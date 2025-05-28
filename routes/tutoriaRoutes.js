const express = require('express');
const router = express.Router();
const tutoriaController = require('../controllers/tutoriaController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/tutorias:
 *   post:
 *     summary: Crear una nueva tutoría
 *     tags: [Tutorías]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - materia
 *               - fecha
 *               - cupos
 *             properties:
 *               materia:
 *                 type: string
 *                 description: Nombre de la materia
 *               fecha:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de la tutoría
 *               cupos:
 *                 type: integer
 *                 minimum: 1
 *                 description: Número de cupos disponibles
 *               descripcion:
 *                 type: string
 *                 description: Descripción opcional de la tutoría
 *     responses:
 *       201:
 *         description: Tutoría creada exitosamente
 *       400:
 *         description: Datos inválidos en la solicitud
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos de profesor
 */
router.post('/', authMiddleware.verificarToken, authMiddleware.esProfesor, tutoriaController.crear);

/**
 * @swagger
 * /api/tutorias/disponibles:
 *   get:
 *     summary: Obtener todas las tutorías disponibles
 *     tags: [Tutorías]
 *     responses:
 *       200:
 *         description: Lista de tutorías disponibles
 */
router.get('/disponibles', tutoriaController.listarDisponibles);

/**
 * @swagger
 * /api/tutorias/mis-tutorias:
 *   get:
 *     summary: Obtener las tutorías del profesor autenticado
 *     tags: [Tutorías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tutorías del profesor
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos de profesor
 */
router.get('/mis-tutorias', authMiddleware.verificarToken, authMiddleware.esProfesor, tutoriaController.misTutorias);

/**
 * @swagger
 * /api/tutorias/{id}:
 *   put:
 *     summary: Actualizar una tutoría existente
 *     tags: [Tutorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tutoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               materia:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date-time
 *               cupos:
 *                 type: integer
 *                 minimum: 1
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tutoría actualizada exitosamente
 *       404:
 *         description: Tutoría no encontrada
 */
router.put('/:id', authMiddleware.verificarToken, authMiddleware.esProfesor, tutoriaController.actualizar);

/**
 * @swagger
 * /api/tutorias/{id}:
 *   delete:
 *     summary: Eliminar una tutoría
 *     tags: [Tutorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tutoría
 *     responses:
 *       200:
 *         description: Tutoría eliminada exitosamente
 *       404:
 *         description: Tutoría no encontrada
 */
router.delete('/:id', authMiddleware.verificarToken, authMiddleware.esProfesor, tutoriaController.eliminar);

module.exports = router; 