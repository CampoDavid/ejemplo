'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tutoria extends Model {
    static associate(models) {
      // Una tutoría pertenece a un profesor (usuario)
      Tutoria.belongsTo(models.Usuario, {
        foreignKey: 'profesor_id',
        as: 'profesor',
      });

      // Una tutoría puede tener muchos materiales
      Tutoria.hasMany(models.Material, {
        foreignKey: 'tutoriaId',
        as: 'materiales',
        onDelete: 'CASCADE'
      });

      // Una tutoría puede tener muchas reservas
      Tutoria.hasMany(models.Reserva, {
        foreignKey: 'tutoriaId',
        as: 'reservas',
        onDelete: 'CASCADE'
      });
    }
  }

  Tutoria.init(
    {
      materia: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fecha: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      cupos: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      profesorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Tutoria',
      tableName: 'Tutorias',
      timestamps: true,
      underscored: true,
    }
  );

  return Tutoria;
};