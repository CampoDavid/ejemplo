const request = require("supertest");
const app = require("../server"); // Asegúrate que aquí exportes `app` en server.js
const db = require("../models");

beforeAll(async () => {
  await db.sequelize.sync({ force: true }); // Sincroniza DB antes de pruebas
});

beforeEach(async () => {
  await db.rol.destroy({ where: {}, truncate: true }); // Limpia tabla
});

afterAll(async () => {
  await db.sequelize.close(); // Cierra conexión después de pruebas
});

describe("POST /api/roles", () => {
  it("debería crear un rol válido", async () => {
    const res = await request(app)
      .post("/api/roles")
      .send({ nombre: "Docente" })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("nombre", "Docente");
  });

  it("debería fallar si no se envía nombre", async () => {
    const res = await request(app)
      .post("/api/roles")
      .send({})
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "El campo 'nombre' es obligatorio");
  });
});
