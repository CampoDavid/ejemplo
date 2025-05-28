const db = require('../models');
const Usuario = db.Usuario;
const Rol = db.Rol;
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || require('crypto').randomBytes(64).toString('hex');

exports.registrar = async (req, res) => {
  const { nombre, email, password, rolId } = req.body;

  try {
    // Validar campos requeridos
    if (!nombre || !email || !password || !rolId) {
      return res.status(400).json({ 
        message: 'Todos los campos son requeridos',
        details: {
          nombre: !nombre ? 'El nombre es requerido' : null,
          email: !email ? 'El email es requerido' : null,
          password: !password ? 'La contraseña es requerida' : null,
          rolId: !rolId ? 'El rol es requerido' : null
        }
      });
    }

    // Verificar si el rol existe
    const rol = await Rol.findByPk(rolId);
    if (!rol) {
      return res.status(400).json({ 
        message: 'El rol especificado no existe',
        details: { rolId: `No existe un rol con el ID ${rolId}` }
      });
    }

    // Validar si ya existe el usuario
    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      return res.status(400).json({ 
        message: 'El usuario ya está registrado',
        details: { email: 'Este correo electrónico ya está registrado' }
      });
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear usuario
    const nuevoUsuario = await Usuario.create({ 
      nombre, 
      email, 
      password: hashedPassword, 
      rol_id: rolId
    });

    // Obtener el nombre del rol
    const nombreRol = rol.nombre;

    return res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario.id, 
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nombreRol
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({ 
      message: 'Error al registrar usuario',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email y contraseña son requeridos',
        details: {
          email: !email ? 'El email es requerido' : null,
          password: !password ? 'La contraseña es requerida' : null
        }
      });
    }

    const usuario = await Usuario.findOne({ 
      where: { email },
      include: [{
        model: Rol,
        attributes: ['nombre']
      }]
    });

    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const passwordValida = await comparePassword(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email,
        rol: usuario.Rol?.nombre 
      }, 
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ 
      message: 'Login exitoso',
      token, 
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.Rol?.nombre
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ 
      where: { id: req.usuario.id },
      include: [{
        model: Rol,
        attributes: ['nombre']
      }],
      attributes: { exclude: ['password'] }
    });

    if (!usuario) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    return res.status(200).json({
      message: 'Perfil recuperado exitosamente',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.Rol?.nombre
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return res.status(500).json({ 
      message: 'Error al obtener el perfil del usuario' 
    });
  }
};
