const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const materialController = require('../controllers/materialController');
const { authMiddleware, checkRole } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validator');

/**
 * @swagger
 * components:
 *   schemas:
 *     Material:
 *       type: object
 *       required:
 *         - titulo
 *         - descripcion
 *         - url
 *         - tutoriaId
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del material
 *         titulo:
 *           type: string
 *           description: Título del material
 *         descripcion:
 *           type: string
 *           description: Descripción detallada del material
 *         url:
 *           type: string
 *           format: uri
 *           description: URL del material (documento, video, etc.)
 *         tutoriaId:
 *           type: integer
 *           description: ID de la tutoría a la que pertenece el material
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

// Validaciones para agregar material
const validacionesAgregarMaterial = [
    check('titulo').trim().isLength({ min: 3 }).withMessage('El título debe tener al menos 3 caracteres'),
    check('descripcion').trim().isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres'),
    check('url').isURL().withMessage('Debe proporcionar una URL válida'),
    check('tutoriaId').isInt().withMessage('El ID de la tutoría debe ser un número válido'),
    validateRequest
];

/**
 * @swagger
 * /api/material/agregar:
 *   post:
 *     summary: Agregar nuevo material a una tutoría
 *     tags: [Material]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descripcion
 *               - url
 *               - tutoriaId
 *             properties:
 *               titulo:
 *                 type: string
 *                 minLength: 3
 *               descripcion:
 *                 type: string
 *                 minLength: 10
 *               url:
 *                 type: string
 *                 format: uri
 *               tutoriaId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Material agregado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Material'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos para agregar material
 */
router.post('/agregar', 
    authMiddleware, 
    checkRole(['profesor', 'admin']), 
    validacionesAgregarMaterial, 
    materialController.agregarMaterial
);

/**
 * @swagger
 * /api/material/por-tutoria/{tutoriaId}:
 *   get:
 *     summary: Obtener todos los materiales de una tutoría
 *     tags: [Material]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tutoriaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tutoría
 *     responses:
 *       200:
 *         description: Lista de materiales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Material'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Tutoría no encontrada
 */
router.get('/por-tutoria/:tutoriaId', 
    authMiddleware,
    check('tutoriaId').isInt().withMessage('El ID de la tutoría debe ser un número válido'),
    validateRequest,
    materialController.obtenerMaterialesPorTutoria
);

/**
 * @swagger
 * /api/material/{id}:
 *   delete:
 *     summary: Eliminar un material
 *     tags: [Material]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del material a eliminar
 *     responses:
 *       200:
 *         description: Material eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos para eliminar este material
 *       404:
 *         description: Material no encontrado
 */
router.delete('/:id',
    authMiddleware,
    checkRole(['profesor', 'admin']),
    check('id').isInt().withMessage('El ID del material debe ser un número válido'),
    validateRequest,
    materialController.eliminarMaterial
);

module.exports = router;
