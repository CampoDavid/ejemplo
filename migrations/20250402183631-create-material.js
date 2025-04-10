'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Materiales', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: false  // Añadido para evitar que el campo esté vacío
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false  // Añadido para evitar que el campo esté vacío
      },
      tutoriaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tutorias',  // Hace referencia a la tabla 'Tutorias'
          key: 'id'
        },
        onDelete: 'CASCADE'  // Si se elimina una tutoría, los materiales asociados también se eliminan
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
    await queryInterface.dropTable('Materiales');
  }
};
