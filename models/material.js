'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Material extends Model {
    static associate(models) {
      Material.belongsTo(models.Tutoria, {
        foreignKey: 'tutoria_id',
        as: 'tutoria',
      });
    }
  }

  Material.init(
    {
      titulo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'El título no puede estar vacío.',
          },
          len: {
            args: [3, 255],
            msg: 'El título debe tener entre 3 y 255 caracteres.',
          },
        },
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: {
            msg: 'La URL debe ser válida.',
          },
        },
      },
      tutoriaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Tutorias',
          key: 'id',
        },
        validate: {
          isInt: {
            msg: 'La tutoría debe ser un número entero válido.',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Material',
      tableName: 'Materials',
      timestamps: true,
      underscored: true,
    }
  );

  return Material;
};
