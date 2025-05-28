const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const usuariosController = require('../controllers/usersController');
const { validateRequest } = require('../middleware/validator');
const { authMiddleware, checkRole } = require('../middleware/auth');
const db = require('../models');

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nombre
 *         - email
 *         - password
 *         - rolId
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *         rolId:
 *           type: integer
 *           description: ID del rol del usuario
 */

// Validaciones para registro
const validacionesRegistro = [
    check('nombre').trim().isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    check('email').isEmail().withMessage('Debe proporcionar un email válido'),
    check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    validateRequest
];

// Validaciones para login
const validacionesLogin = [
    check('email').isEmail().withMessage('Debe proporcionar un email válido'),
    check('password').notEmpty().withMessage('La contraseña es requerida'),
    validateRequest
];

/**
 * @swagger
 * /api/usuarios/registro:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.post('/registro', validacionesRegistro, usuariosController.registrar);

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Inicia sesión de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', validacionesLogin, usuariosController.login);

/**
 * @swagger
 * /api/usuarios/perfil:
 *   get:
 *     summary: Obtiene el perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/perfil', authMiddleware, usuariosController.obtenerPerfil);

/**
 * @swagger
 * /api/usuarios/admin/usuarios:
 *   get:
 *     summary: Lista todos los usuarios (solo admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.get('/admin/usuarios', authMiddleware, checkRole(['admin']), async (req, res) => {
    try {
        const usuarios = await db.Usuario.findAll({
            attributes: { exclude: ['password'] },
            include: [{
                model: db.Rol,
                attributes: ['nombre']
            }]
        });
        res.json({ usuarios });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener la lista de usuarios' });
    }
});

module.exports = router;
