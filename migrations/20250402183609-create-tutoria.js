'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tutorias', {  // Asegúrate de que el nombre de la tabla sea correcto (Tutorias en plural)
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: false  // Se añadió esta validación para asegurar que el título no esté vacío
      },
      descripcion: {
        type: Sequelize.TEXT
      },
      fecha: {
        type: Sequelize.DATE,
        allowNull: false  // Se añadió esta validación para asegurar que la fecha no esté vacía
      },
      profesorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios',  // Hace referencia a la tabla Usuarios
          key: 'id'
        },
        onDelete: 'CASCADE'  // Si se elimina un usuario (profesor), las tutorías asociadas también se eliminan
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tutorias');  // Se asegura de que se borre la tabla correcta
  }
};
