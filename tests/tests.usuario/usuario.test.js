const request = require("supertest");
const app = require("../../server");
const db = require("../../models");

const emailTest = "estudiante@test.com";
let rol_id;

beforeAll(async () => {
  const [rol] = await db.Rol.findOrCreate({
    where: { nombre: "estudiante" },
    defaults: { descripcion: "Rol de estudiante" }
  });

  rol_id = rol.id;

  await db.Usuario.destroy({ where: { email: emailTest } });
});

afterAll(async () => {
  await db.Usuario.destroy({ where: { email: emailTest } });
  await db.sequelize.close();
});

describe("Pruebas de Usuarios", () => {
  it("Debe registrar un usuario", async () => {
    const res = await request(app)
      .post("/api/usuarios/registro")
      .send({
        nombre: "Estudiante",
        email: emailTest,
        password: "12345678",
        rol_id: rol_id
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe(emailTest);
  });

  it("Debe iniciar sesión con usuario registrado", async () => {
    const res = await request(app)
      .post("/api/usuarios/login")
      .send({
        email: emailTest,
        password: "12345678"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
    expect(res.body.email).toBe(emailTest);
  });
});
