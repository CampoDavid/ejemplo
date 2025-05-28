const db = require('../models');

// Establecer ambiente de pruebas
process.env.NODE_ENV = 'test';

// Función para limpiar la base de datos
const clearDatabase = async () => {
  try {
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    const tables = Object.values(db.sequelize.models);
    for (const table of tables) {
      await table.destroy({ truncate: true, force: true });
    }
    
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  } catch (error) {
    console.error('Error al limpiar la base de datos:', error);
    throw error;
  }
};

beforeAll(async () => {
  try {
    // Sincronizar la base de datos de prueba
    await db.sequelize.sync({ force: true });
    console.log('Base de datos de pruebas sincronizada correctamente');
  } catch (error) {
    console.error('Error al sincronizar la base de datos de pruebas:', error);
    throw error;
  }
});

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  try {
    await clearDatabase();
    await db.sequelize.close();
  } catch (error) {
    console.error('Error al cerrar la conexión:', error);
    throw error;
  }
}); 