"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Personas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nombre: {
        type: Sequelize.STRING,
      },
      apellidoPaterno: {
        type: Sequelize.STRING,
      },
      apellidoMaterno: {
        type: Sequelize.STRING,
      },
      sexo: {
        type: Sequelize.ENUM("Masculino", "Femenino"),
      },
      correo: {
        type: Sequelize.STRING,
      },
      fechaNacimiento: {
        type: Sequelize.DATE,
      },
      direccion: {
        type: Sequelize.STRING,
      },
      telefono: {
        type: Sequelize.STRING,
      },
      nroDip: {
        type: Sequelize.INTEGER,
      },
      fotografia: {
        type: Sequelize.STRING,
      },
      usuario: {
        type: Sequelize.STRING,
      },
      clave: {
        type: Sequelize.STRING,
      },
      idRol: {
        type: Sequelize.INTEGER,
        references: {
          model: "Roles",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Personas");
  },
};
