const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const path = require("path");

const db = require(path.join(__dirname, "models"));
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());


const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger.json"); 
app.use("/document", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const materialRouter = require('./routes/material.routes');
app.use('/material', materialRouter);
// app.use("/api/material", require(path.join(__dirname, "routes", "material.routes")));*/

const usuariosRouter = require('./routes/usuarios.routes');
app.use('/usuarios', usuariosRouter);
// app.use("/api/usuarios", require(path.join(__dirname, "routes", "usuarios.routes")));

const tutoriaRouter = require('./routes/tutoria.routes');
app.use('/tutoria', tutoriaRouter);
// app.use("/api/tutoria", require(path.join(__dirname, "routes", "tutoria.routes")));

const reservasRouter = require('./routes/reservas.routes');
app.use('/reservas', reservasRouter);
//app.use("/api/reservas", require(path.join(__dirname, "routes", "reservas.routes")));

const rolesRouter = require('./routes/roles.routes');
app.use('/roles', rolesRouter);
//app.use("/api/roles", require(path.join(__dirname, "routes", "roles.routes")));


db.sequelize.sync()
  .then(() => {
    console.log("✅ Las tablas se han sincronizado correctamente.");

    if (process.env.NODE_ENV !== "test") {
      app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
        console.log(`📄 Documentación Swagger en: http://localhost:${PORT}/document`);
      });
    }
  })
  .catch((error) => {
    console.error("❌ Error al sincronizar la base de datos:", error);
  });

module.exports = app;
