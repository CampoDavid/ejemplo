const express = require("express");
const router = express.Router();
const rolesController = require("../controllers/rolesController");

// Obtener todos los roles
router.get("/", rolesController.obtenerRoles);

// Crear un nuevo rol
router.post("/", rolesController.crearRol);

module.exports = router;
