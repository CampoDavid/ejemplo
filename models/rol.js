'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Rol extends Model {
    static associate(models) {
      Rol.hasMany(models.Usuario, {
        foreignKey: 'rol_id',
        as: 'usuarios'
      });
    }
  }
  
  Rol.init({
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Rol',
    tableName: 'Roles',
    underscored: true,
    timestamps: true
  });
  
  return Rol;
};
