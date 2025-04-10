'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Reserva extends Model {
    static associate(models) {
      // Relación con Usuario (estudiante)
      Reserva.belongsTo(models.Usuario, {
        foreignKey: 'estudiante_id',
        as: 'estudiante',
      });

      // Relación con Tutoria
      Reserva.belongsTo(models.Tutoria, {
        foreignKey: 'tutoria_id',
        as: 'tutoria',
      });
    }
  }

  Reserva.init(
    {
      estudianteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios',
          key: 'id',
        },
      },
      tutoriaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Tutorias',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Reserva',
      tableName: 'Reservas',
      timestamps: true,
      underscored: true,
    }
  );

  return Reserva;
};