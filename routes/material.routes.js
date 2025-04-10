
const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

// Ruta para agregar material a una tutoría
router.post('/agregar', materialController.agregarMaterial);

// Ruta para obtener materiales por ID de tutoría
router.get('/por-tutoria/:tutoriaId', materialController.obtenerMaterialesPorTutoria);

module.exports = router;
