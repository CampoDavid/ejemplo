const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
require("dotenv").config();
const path = require("path");

const db = require(path.join(__dirname, "models"));
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de seguridad
app.use(helmet());
app.use(rateLimiter);
app.use(cors());
app.use(bodyParser.json());

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
const materialRouter = require('./routes/material.routes');
const usuariosRouter = require('./routes/usuarios.routes');
const tutoriaRouter = require('./routes/tutoriaRoutes');
const reservasRouter = require('./routes/reservas.routes');
const rolesRouter = require('./routes/roles.routes');

// Prefijo /api para todas las rutas
app.use('/api/material', materialRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/tutorias', tutoriaRouter);
app.use('/api/reservas', reservasRouter);
app.use('/api/roles', rolesRouter);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Manejador de errores
app.use(errorHandler);

db.sequelize.sync()
  .then(() => {
    console.log("✅ Las tablas se han sincronizado correctamente.");

    if (process.env.NODE_ENV !== "test") {
      app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
        console.log(`📚 Documentación disponible en: http://localhost:${PORT}/api-docs`);
      });
    }
  })
  .catch((error) => {
    console.error("❌ Error al sincronizar la base de datos:", error);
  });

module.exports = app;
