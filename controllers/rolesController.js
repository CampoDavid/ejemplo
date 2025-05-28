const db = require("../models");
const Rol = db.rol;

exports.obtenerRoles = async (req, res) => {
  try {
    const roles = await Rol.findAll();
    res.json(roles);
  } catch (error) {
    console.error("Error al obtener roles:", error);
    res.status(500).json({ error: "Error al obtener los roles" });
  }
};

exports.crearRol = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: "El campo 'nombre' es obligatorio" });
    }

    const nuevoRol = await Rol.create({ nombre });
    res.status(201).json(nuevoRol);
  } catch (error) {
    console.error("❌ Error detallado al crear rol:", error); // MUY IMPORTANTE
    res.status(500).json({ error: "Error al crear el rol" });
  }
};

