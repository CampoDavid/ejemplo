const jwt = require('jsonwebtoken');
const db = require('../models');
const Usuario = db.Usuario;

exports.verificarToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        message: 'No se proporcionó token de autenticación' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findByPk(decoded.id);

    if (!usuario) {
      return res.status(401).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ 
      message: 'Token inválido o expirado' 
    });
  }
};

exports.esProfesor = (req, res, next) => {
  if (req.usuario.rol_id !== 3) { // Asumiendo que 3 es el ID del rol profesor
    return res.status(403).json({ 
      message: 'Acceso denegado. Se requieren permisos de profesor.' 
    });
  }
  next();
}; 