const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const path = require("path");

const db = require(path.join(__dirname, "models")); // Asegúrate de que este path sea correcto
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Rutas de la aplicación
app.use("/api/usuarios", require(path.join(__dirname, "routes", "usuarios.routes")));
app.use("/api/material", require(path.join(__dirname, "routes", "material.routes")));
app.use("/api/tutoria", require(path.join(__dirname, "routes", "tutoria.routes")));
app.use("/api/reservas", require(path.join(__dirname, "routes", "reservas.routes")));
app.use("/api/roles", require(path.join(__dirname, "routes", "roles.routes"))); // Ruta de roles añadida

// Sincronización de la base de datos
db.sequelize.sync()
  .then(() => {
    console.log("Las tablas se han sincronizado correctamente.");
    
    // Solo escucha si no es test
    if (process.env.NODE_ENV !== "test") {
      app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      });
    }
  })
  .catch((error) => {
    console.error("Error al sincronizar la base de datos:", error);
  });

module.exports = app;
