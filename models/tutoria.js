'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tutoria extends Model {
    static associate(models) {
      // Una tutoría pertenece a un profesor (usuario)
      Tutoria.belongsTo(models.Usuario, {
        foreignKey: 'profesor_id',
        as: 'profesor'
      });

      // Una tutoría puede tener muchos materiales
      Tutoria.hasMany(models.Material, {
        foreignKey: 'tutoria_id',
        as: 'materiales',
        onDelete: 'CASCADE'
      });

      // Una tutoría puede tener muchas reservas
      Tutoria.hasMany(models.Reserva, {
        foreignKey: 'tutoria_id',
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
        validate: {
          notEmpty: {
            msg: 'La materia no puede estar vacía'
          }
        }
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: {
            msg: 'La fecha debe tener el formato YYYY-MM-DD'
          },
          isFuture(value) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const inputDate = new Date(value);
            if (inputDate < today) {
              throw new Error('La fecha debe ser futura');
            }
          }
        },
        get() {
          // Asegurarse de que la fecha se devuelva en formato YYYY-MM-DD
          const date = this.getDataValue('fecha');
          return date ? date.toISOString().split('T')[0] : null;
        },
        set(value) {
          // Asegurarse de que la fecha se guarde correctamente
          if (value) {
            const date = new Date(value);
            date.setHours(0, 0, 0, 0);
            this.setDataValue('fecha', date);
          }
        }
      },
      cupos: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: {
            args: [1],
            msg: 'Debe haber al menos 1 cupo disponible'
          }
        }
      },
      profesor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'profesor_id',
        references: {
          model: 'Usuarios',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      modelName: 'Tutoria',
      tableName: 'Tutorias',
      underscored: true,
      timestamps: true
    }
  );

  return Tutoria;
};