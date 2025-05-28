const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false // Desactivar logs en pruebas
});

module.exports = sequelize; 