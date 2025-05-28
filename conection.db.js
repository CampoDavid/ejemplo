require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
);

// Solo log básico en producción
if (process.env.NODE_ENV === 'production') {
  console.log('Intentando conectar a la base de datos...');
} else {
  // Logs detallados solo en desarrollo
  console.log('Variables de entorno de base de datos configuradas');
}

sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión exitosa a la base de datos');
  })
  .catch((error) => {
    console.error('❌ Error al conectar a la base de datos');
    if (process.env.NODE_ENV === 'development') {
      console.error('Detalles del error:', error);
    }
  });

module.exports = sequelize;
      