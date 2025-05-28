'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Material extends Model {
    static associate(models) {
      Material.belongsTo(models.Tutoria, {
        foreignKey: 'tutoria_id',
        as: 'tutoria'
      });
    }
  }

  Material.init(
    {
      titulo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [3, 255]
        }
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isUrl: true
        }
      },
      tutoria_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Tutorias',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      modelName: 'Material',
      tableName: 'Materials',
      underscored: true
    }
  );

  return Material;
};
