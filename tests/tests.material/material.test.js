const request = require("supertest");
const app = require("../../server");
const db = require("../../models");

let profesorId, tutoriaId, materialId;

beforeAll(async () => {
  const [rol] = await db.Rol.findOrCreate({
    where: { nombre: "profesor" },
    defaults: { descripcion: "Profesor" }
  });

  const profesor = await db.Usuario.create({
    nombre: "Profesor Material",
    email: "materialprof@test.com",
    password: "12345678",
    rol_id: rol.id
  });

  profesorId = profesor.id;

  const tutoria = await db.Tutoria.create({
    materia: "Programación",
    fecha: new Date(Date.now() + 86400000),
    cupos: 10,
    profesor_id: profesor.id
  });

  tutoriaId = tutoria.id;
});

afterAll(async () => {
  await db.Material.destroy({ where: { tutoria_id: tutoriaId } });
  await db.Tutoria.destroy({ where: { id: tutoriaId } });
  await db.Usuario.destroy({ where: { id: profesorId } });
  await db.sequelize.close();
});

describe("Pruebas de Materiales", () => {
  it("Debe permitir agregar material a una tutoría", async () => {
    const res = await request(app)
      .post("/api/material/agregar")
      .send({
        titulo: "Guía de estudio",
        descripcion: "Material para repasar temas vistos en clase",
        url: "http://ejemplo.com/material.pdf",
        tutoria_id: tutoriaId
      });

    materialId = res.body.id;

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("titulo", "Guía de estudio");
  });

  it("Debe listar materiales de una tutoría", async () => {
    const res = await request(app).get(`/api/material/por-tutoria/${tutoriaId}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("url");
  });
});
