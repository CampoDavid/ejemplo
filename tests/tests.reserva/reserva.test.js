const request = require("supertest");
const app = require("../../server");
const db = require("../../models");

let estudianteId, profesorId, tutoriaId;

beforeAll(async () => {
  const [rolEst] = await db.Rol.findOrCreate({
    where: { nombre: "estudiante" },
    defaults: { descripcion: "Estudiante" }
  });

  const estudiante = await db.Usuario.create({
    nombre: "Estudiante Test",
    email: "reservatest@test.com",
    password: "12345678",
    rol_id: rolEst.id
  });
  estudianteId = estudiante.id;

  const [rolProf] = await db.Rol.findOrCreate({
    where: { nombre: "profesor" },
    defaults: { descripcion: "Profesor" }
  });

  const profesor = await db.Usuario.create({
    nombre: "Profesor Test",
    email: "reservaprof@test.com",
    password: "12345678",
    rol_id: rolProf.id
  });
  profesorId = profesor.id;

  const tutoria = await db.Tutoria.create({
    materia: "Física",
    fecha: new Date(Date.now() + 86400000),
    cupos: 3,
    profesor_id: profesor.id
  });
  tutoriaId = tutoria.id;
});

afterAll(async () => {
  await db.Reserva.destroy({ where: { estudiante_id: estudianteId } });
  await db.Tutoria.destroy({ where: { id: tutoriaId } });
  await db.Usuario.destroy({ where: { id: estudianteId } });
  await db.Usuario.destroy({ where: { id: profesorId } });
  await db.sequelize.close();
});

describe("Pruebas de Reservas", () => {
  it("Debe permitir reservar una tutoría", async () => {
    const res = await request(app)
      .post("/api/reservas/reservar")
      .send({ estudianteId, tutoriaId });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("estudianteId", estudianteId);
    expect(res.body).toHaveProperty("tutoriaId", tutoriaId);
  });

  it("Debe listar reservas del estudiante", async () => {
    const res = await request(app).get(`/api/reservas/por-estudiante/${estudianteId}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("tutoria");
    expect(res.body[0].tutoria).toHaveProperty("id", tutoriaId);
  });
});
