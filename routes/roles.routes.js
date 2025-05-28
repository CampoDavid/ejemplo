const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const rolesController = require("../controllers/rolesController");

// Obtener todos los roles
router.get("/", rolesController.obtenerRoles);

// Crear un nuevo rol con validación
router.post(
  "/",
  [
    check("nombre")
      .notEmpty()
      .withMessage("El nombre del rol es obligatorio")
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    next();
  },
  rolesController.crearRol
);

module.exports = router;
