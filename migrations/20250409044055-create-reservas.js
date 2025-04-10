'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reservas', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      estudianteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios', // Asegúrate de que la tabla se llama 'usuarios' en la base de datos
          key: 'id'
        },
        onDelete: 'CASCADE', // Si se elimina un usuario, se eliminan las reservas asociadas
        onUpdate: 'CASCADE'  // Si se actualiza el id de un usuario, las reservas asociadas se actualizan
      },
      tutoriaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tutorias', // Asegúrate de que la tabla se llama 'tutorias' en la base de datos
          key: 'id'
        },
        onDelete: 'CASCADE', // Si se elimina una tutoría, se eliminan las reservas asociadas
        onUpdate: 'CASCADE'  // Si se actualiza el id de una tutoría, las reservas asociadas se actualizan
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('reservas');
  }
};

