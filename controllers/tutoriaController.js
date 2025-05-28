const db = require('../models');
const Tutoria = db.Tutoria;
const Usuario = db.Usuario;

// Crear una nueva tutoría
exports.crear = async (req, res) => {
  const { materia, fecha, cupos, descripcion } = req.body;

  try {
    // El profesor_id se obtiene del token JWT (req.usuario.id)
    const profesor = await Usuario.findOne({
      where: { 
        id: req.usuario.id,
        rol_id: 3 // Asegurarse de que sea un profesor
      }
    });

    if (!profesor) {
      return res.status(403).json({ 
        message: 'Solo los profesores pueden crear tutorías' 
      });
    }

    const nuevaTutoria = await Tutoria.create({ 
      materia, 
      fecha, 
      cupos, 
      descripcion,
      profesor_id: req.usuario.id
    });

    return res.status(201).json({
      message: 'Tutoría creada exitosamente',
      tutoria: nuevaTutoria
    });
  } catch (error) {
    console.error('Error al crear tutoría:', error);
    return res.status(500).json({ 
      message: 'Error al crear tutoría',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener todas las tutorías disponibles
exports.listarDisponibles = async (req, res) => {
  try {
    const tutorias = await Tutoria.findAll({
      where: {
        fecha: {
          [db.Sequelize.Op.gt]: new Date() // Solo tutorías futuras
        },
        cupos: {
          [db.Sequelize.Op.gt]: 0 // Con cupos disponibles
        }
      },
      include: [{
        model: Usuario,
        as: 'profesor',
        attributes: ['id', 'nombre', 'email']
      }],
      order: [['fecha', 'ASC']] // Ordenadas por fecha
    });

    return res.status(200).json({
      message: 'Tutorías recuperadas exitosamente',
      tutorias
    });
  } catch (error) {
    console.error('Error al listar tutorías:', error);
    return res.status(500).json({ 
      message: 'Error al obtener tutorías',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener tutorías de un profesor específico
exports.misTutorias = async (req, res) => {
  try {
    const tutorias = await Tutoria.findAll({
      where: {
        profesor_id: req.usuario.id
      },
      include: [{
        model: Usuario,
        as: 'profesor',
        attributes: ['id', 'nombre', 'email']
      }],
      order: [['fecha', 'DESC']]
    });

    return res.status(200).json({
      message: 'Tutorías recuperadas exitosamente',
      tutorias
    });
  } catch (error) {
    console.error('Error al obtener tutorías del profesor:', error);
    return res.status(500).json({ 
      message: 'Error al obtener tutorías',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Actualizar una tutoría
exports.actualizar = async (req, res) => {
  const { id } = req.params;
  const { materia, fecha, cupos, descripcion } = req.body;

  try {
    const tutoria = await Tutoria.findOne({
      where: { 
        id,
        profesor_id: req.usuario.id // Asegura que el profesor sea dueño de la tutoría
      }
    });

    if (!tutoria) {
      return res.status(404).json({ 
        message: 'Tutoría no encontrada o no tiene permisos para modificarla' 
      });
    }

    await tutoria.update({
      materia,
      fecha,
      cupos,
      descripcion
    });

    return res.status(200).json({
      message: 'Tutoría actualizada exitosamente',
      tutoria
    });
  } catch (error) {
    console.error('Error al actualizar tutoría:', error);
    return res.status(500).json({ 
      message: 'Error al actualizar tutoría',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Eliminar una tutoría
exports.eliminar = async (req, res) => {
  const { id } = req.params;

  try {
    const tutoria = await Tutoria.findOne({
      where: { 
        id,
        profesor_id: req.usuario.id
      }
    });

    if (!tutoria) {
      return res.status(404).json({ 
        message: 'Tutoría no encontrada o no tiene permisos para eliminarla' 
      });
    }

    await tutoria.destroy();

    return res.status(200).json({
      message: 'Tutoría eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar tutoría:', error);
    return res.status(500).json({ 
      message: 'Error al eliminar tutoría',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};