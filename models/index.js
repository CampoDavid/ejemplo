'use strict';




const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Lee todos los modelos en este directorio excepto index.js
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && // Ignorar archivos ocultos
      file !== basename && // Ignorar este archivo index.js
      file.slice(-3) === '.js' // Solo archivos JS
    );
  })
  .forEach(file => {
    const modelPath = path.join(__dirname, file);
    const modelModule = require(modelPath);

    // Verifica que el módulo exporte una función para inicializar el modelo
    if (typeof modelModule === 'function') {
      const model = modelModule(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    } else {
      console.warn(`⚠️  Archivo ignorado: ${file} (no exporta una función)`);
    }
  });

// Ejecuta las asociaciones si existen
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
  


