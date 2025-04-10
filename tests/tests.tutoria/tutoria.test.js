const request = require("supertest");
const app = require("../../server");
const db = require("../../models");

let tutorId, tutoriaId;

beforeAll(async () => {
  const [rol] = await db.Rol.findOrCreate({
    where: { nombre: "profesor" },
    defaults: { descripcion: "Profesor" }
  });

  const profesor = await db.Usuario.create({
    nombre: "Profesor Test",
    email: "profesor@test.com",
    password: "12345678",
    rol_id: rol.id
  });

  tutorId = profesor.id;
});

afterAll(async () => {
  await db.Tutoria.destroy({ where: { profesor_id: tutorId } });
  await db.Usuario.destroy({ where: { id: tutorId } });
  await db.sequelize.close();
});

describe("Pruebas de Tutorias", () => {
  it("Debe permitir publicar una tutoría", async () => {
    const res = await request(app)
      .post("/api/tutoria/publicar")
      .send({
        materia: "Matemáticas",
        fecha: new Date(Date.now() + 86400000),
        cupos: 5,
        profesor_id: tutorId
      });

    tutoriaId = res.body.id;

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("materia", "Matemáticas");
    expect(res.body).toHaveProperty("cupos", 5);
  });

  it("Debe listar las tutorías disponibles", async () => {
    const res = await request(app).get("/api/tutoria/disponibles");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("materia");
    expect(res.body[0]).toHaveProperty("cupos");
  });
});
