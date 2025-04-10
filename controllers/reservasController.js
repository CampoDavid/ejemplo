const db = require('../models');
const Reserva = db.Reserva;
const Tutoria = db.Tutoria;

exports.reservarTutoria = async (req, res) => {
  const { estudianteId, tutoriaId } = req.body;

  try {
    const tutoria = await Tutoria.findByPk(tutoriaId);
    if (!tutoria) {
      return res.status(404).json({ message: 'Tutoria no encontrada' });
    }

    if (tutoria.cupos <= 0) {
      return res.status(400).json({ message: 'No hay cupos disponibles' });
    }

    const reservaExistente = await Reserva.findOne({ where: { estudianteId, tutoriaId } });
    if (reservaExistente) {
      return res.status(409).json({ message: 'Ya tienes una reserva para esta tutoría' });
    }

    const nuevaReserva = await Reserva.create({ estudianteId, tutoriaId });
    await tutoria.decrement('cupos');

    return res.status(201).json(nuevaReserva);
  } catch (error) {
    console.error('Error al reservar tutoría:', error);
    return res.status(500).json({ message: 'Error al realizar la reserva' });
  }
};

exports.obtenerReservasPorEstudiante = async (req, res) => {
  const { estudianteId } = req.params;

  try {
    const reservas = await Reserva.findAll({
      where: { estudianteId },
      include: [
        {
          model: db.Tutoria,
          as: 'tutoria',
        }
      ]
    });

    return res.status(200).json(reservas);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};
