const db = require('../models');
const Material = db.Material;
const Tutoria = db.Tutoria;

// Agregar material a una tutoría
exports.agregarMaterial = async (req, res) => {
  try {
    const { titulo, descripcion, url, tutoriaId } = req.body;

    // Validación de campos requeridos
    if (!titulo || !url || !tutoriaId) {
      return res.status(400).json({
        message: 'Faltan campos requeridos'
      });
    }

    // Validación de URL
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({
        message: 'URL inválida'
      });
    }

    // Verifica que la tutoría exista y que el profesor sea el dueño
    const tutoria = await Tutoria.findOne({
      where: { 
        id: tutoriaId,
        profesor_id: req.usuario.id
      }
    });

    if (!tutoria) {
      return res.status(403).json({ 
        message: 'No tiene permisos para agregar material a esta tutoría o la tutoría no existe' 
      });
    }

    // Crea el nuevo material
    const material = await Material.create({
      titulo,
      descripcion,
      url,
      tutoria_id: tutoriaId
    });

    return res.status(201).json({
      message: 'Material agregado exitosamente',
      material
    });
  } catch (error) {
    console.error('Error al agregar material:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map(e => e.message)
      });
    }
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

// Obtener todos los materiales de una tutoría
exports.obtenerMaterialesPorTutoria = async (req, res) => {
  try {
    const { tutoriaId } = req.params;

    if (!tutoriaId) {
      return res.status(400).json({
        message: 'ID de tutoría no proporcionado'
      });
    }

    // Verifica que la tutoría exista
    const tutoria = await Tutoria.findByPk(tutoriaId);
    if (!tutoria) {
      return res.status(404).json({ 
        message: 'Tutoría no encontrada' 
      });
    }

    // Obtiene los materiales
    const materiales = await Material.findAll({ 
      where: { tutoria_id: tutoriaId },
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      message: 'Materiales recuperados exitosamente',
      materiales
    });
  } catch (error) {
    console.error('Error al obtener materiales:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

// Eliminar un material
exports.eliminarMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: 'ID de material no proporcionado'
      });
    }

    // Busca el material y su tutoría asociada
    const material = await Material.findOne({
      where: { id },
      include: [{
        model: Tutoria,
        as: 'tutoria',
        required: true
      }]
    });

    if (!material) {
      return res.status(404).json({ 
        message: 'Material no encontrado' 
      });
    }

    // Verifica que el usuario sea el profesor de la tutoría
    if (material.tutoria.profesor_id !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({ 
        message: 'No tiene permisos para eliminar este material' 
      });
    }

    // Elimina el material
    await material.destroy();

    return res.status(200).json({ 
      message: 'Material eliminado exitosamente' 
    });
  } catch (error) {
    console.error('Error al eliminar material:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};
