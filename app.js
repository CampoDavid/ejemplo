const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./models');

// Importar rutas
const tutoriaRoutes = require('./routes/tutoriaRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/tutorias', tutoriaRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Puerto
const PORT = process.env.PORT || 3000;

// Sincronizar base de datos y arrancar servidor
db.sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
  });

module.exports = app; 