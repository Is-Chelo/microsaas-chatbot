"use strict";
const { Modulo } = require("../../models/index");

module.exports = {
  async up(queryInterface, Sequelize) {
    const countModulos = await Modulo.count();
    const data = [];
    for (let i = 1; i <= countModulos; i++)
      data.push({
        idModulo: i,
        idRol: 1,
        okSelect: 1,
        okUpdate: 1,
        okInsert: 1,
        okDelete: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    await queryInterface.bulkInsert("rolesModulos", data);
  },

  async down(queryInterface, Sequelize) {
     await queryInterface.bulkDelete("rolesModulos", null, {});

  },
};

