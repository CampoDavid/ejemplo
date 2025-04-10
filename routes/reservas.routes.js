const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservasController');

// Ruta para reservar una tutoría
router.post('/reservar', reservaController.reservarTutoria);

// Ruta para consultar las reservas de un estudiante
router.get('/por-estudiante/:estudianteId', reservaController.obtenerReservasPorEstudiante);

module.exports = router;