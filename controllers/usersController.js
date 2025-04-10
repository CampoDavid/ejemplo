const db = require('../models');
const Usuario = db.Usuario;
const Rol = db.Rol;
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.registrar = async (req, res) => {
  const { nombre, email, password, rolId } = req.body;

  try {
    // Validar si ya existe
    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      return res.status(400).json({ message: 'El usuario ya está registrado' });
    }

    // Crear usuario
    const nuevoUsuario = await Usuario.create({ nombre, email, password, rolId });
    return res.status(201).json({ id: nuevoUsuario.id, email: nuevoUsuario.email });
  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario || usuario.password !== password) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET || 'secreto', {
      expiresIn: '1h'
    });

    return res.status(200).json({ token, email: usuario.email });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};
