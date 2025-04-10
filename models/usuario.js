'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.belongsTo(models.Rol, {
        foreignKey: 'rol_id',
        onDelete: 'CASCADE',
      });

      Usuario.hasMany(models.Reserva, {
        foreignKey: 'estudiante_id',
        onDelete: 'CASCADE',
      });

      Usuario.hasMany(models.Tutoria, {
        foreignKey: 'profesorId',
        onDelete: 'CASCADE',
      });
    }
  }

  Usuario.init(
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 100],
        },
      },
      rolId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Rols',
          key: 'id',
        },
        field: 'rol_id'
      },
    },
    {
      sequelize,
      modelName: 'Usuario',
      underscored: true,
      timestamps: true,
      
    }
  );

  return Usuario;
};