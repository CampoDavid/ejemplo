const express = require('express');
const router = express.Router();
const tutoriaController = require('../controllers/tutoriaController');

// Ruta para publicar una tutoría (solo para profesores)
router.post('/publicar', tutoriaController.publicarTutoria);

// Ruta para listar tutorías disponibles
router.get('/disponibles', tutoriaController.listarTutoriasDisponibles);

module.exports = router;
