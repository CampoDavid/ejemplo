const db = require('../models');
const Tutoria = db.Tutoria;
const Usuario = db.Usuario;

exports.publicarTutoria = async (req, res) => {
  const { materia, fecha, cupos, profesorId } = req.body;

  try {
    const profesor = await Usuario.findByPk(profesorId);
    if (!profesor) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }

    const nuevaTutoria = await Tutoria.create({ materia, fecha, cupos, profesorId });
    return res.status(201).json(nuevaTutoria);
  } catch (error) {
    console.error('Error al publicar tutoría:', error);
    return res.status(500).json({ message: 'Error al publicar tutoría' });
  }
};

exports.listarTutoriasDisponibles = async (req, res) => {
  try {
    const tutorias = await Tutoria.findAll({
      where: {
        fecha: {
          [db.Sequelize.Op.gt]: new Date(),
        },
        cupos: {
          [db.Sequelize.Op.gt]: 0,
        },
      },
      include: [
        {
          model: Usuario,
          as: 'profesor',
          attributes: ['id', 'nombre', 'email']
        }
      ]
    });

    return res.status(200).json(tutorias);
  } catch (error) {
    console.error('Error al obtener tutorías:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};