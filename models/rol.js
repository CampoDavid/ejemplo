'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Rol extends Model {
    static associate(models) {
      Rol.hasMany(models.Usuario, {
        foreignKey: 'rol_id',
        as: 'usuarios',
        onDelete: 'CASCADE',
      });
    }
  }

  Rol.init(
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      descripcion: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Rol',
      tableName: 'Rols',
      timestamps: true,
      underscored: true,
    }
  );

  return Rol;
};