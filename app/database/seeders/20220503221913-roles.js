"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Roles", [
      {
        nombre: "Admin",
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: "Encargado",
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Roles", null, {});
  },
};
