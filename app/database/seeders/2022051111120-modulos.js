"use strict";
// const { rolesModulo } = require("../../models/index");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Modulos", modulos);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Modulos", null, {});
  },
};

const modulos = [
  {
    nombre: "Modulo Arbitro",
    url: "/api/v1/arbitro",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Modulo Jugador",
    url: "/api/v1/jugador",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Modulo Persona acargo",
    url: "/api/v1/personaCargo",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Modulo Planillero",
    url: "/api/v1/planillero",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Modulo Incripcion Jugador",
    url: "/api/v1/inscripcionJugador",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Modulo Arbitro Partido",
    url: "/api/v1/arbitroPartido",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Modulo Detalle Partido",
    url: "/api/v1/detallePartido",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Modulo Categoria",
    url: "/api/v1/categoria",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Modulo Equipo",
    url: "/api/v1/equipo",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Modulo Pago",
    url: "/api/v1/pago",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Modulo Motivo Pago",
    url: "/api/v1/motivoPago",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Modulo Inscripcion",
    url: "/api/v1/inscripcion",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Modulo Torneo",
    url: "/api/v1/torneo",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Modulo Campo Deportivo",
    url: "/api/v1/campoDeportivo",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Modulo Campo Juegos",
    url: "/api/v1/juegos",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Modulo Observaciones",
    url: "/api/v1/observaciones",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
