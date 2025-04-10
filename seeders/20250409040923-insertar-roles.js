"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("roles", [
      {
        nombre: "Profesor",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: "Estudiante",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles", {
      nombre: { [Sequelize.Op.in]: ["Profesor", "Estudiante"] }
    }, {});
  },
};

