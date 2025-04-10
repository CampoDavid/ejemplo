const db = require('../models');
const Material = db.Material;
const Tutoria = db.Tutoria;

exports.agregarMaterial = async (req, res) => {
  const { titulo, descripcion, url, tutoriaId } = req.body;

  try {
    const tutoria = await Tutoria.findByPk(tutoriaId);
    if (!tutoria) {
      return res.status(404).json({ message: 'Tutoria no encontrada' });
    }

    const nuevoMaterial = await Material.create({ titulo, descripcion, url, tutoriaId });
    return res.status(201).json(nuevoMaterial);
  } catch (error) {
    console.error('Error al agregar material:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.obtenerMaterialesPorTutoria = async (req, res) => {
  const { tutoriaId } = req.params;

  try {
    const materiales = await Material.findAll({ where: { tutoriaId } });
    return res.status(200).json(materiales);
  } catch (error) {
    console.error('Error al obtener materiales:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};
