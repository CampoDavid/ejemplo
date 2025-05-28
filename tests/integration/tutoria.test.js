const request = require('supertest');
const app = require('../../app');
const { Tutoria, Usuario, Rol } = require('../../models');
const jwt = require('jsonwebtoken');

describe('API Tutorías', () => {
  let token;
  let profesor;

  beforeAll(async () => {
    // Crear rol de profesor
    const rol = await Rol.create({
      nombre: 'profesor'
    });

    // Crear profesor para pruebas
    profesor = await Usuario.create({
      nombre: 'Profesor Test',
      email: 'profesor@test.com',
      password: '123456',
      rol_id: rol.id
    });

    // Generar token JWT
    token = jwt.sign(
      { id: profesor.id, email: profesor.email, rol: 'profesor' },
      process.env.JWT_SECRET || 'tu_clave_secreta_muy_segura',
      { expiresIn: '1h' }
    );
  });

  describe('POST /api/tutorias', () => {
    it('debe crear una tutoría con datos válidos', async () => {
      const tutoriaData = {
        materia: 'Matemáticas',
        descripcion: 'Tutoría de prueba',
        fecha: '2025-05-29',
        cupos: 5
      };

      const response = await request(app)
        .post('/api/tutorias')
        .set('Authorization', `Bearer ${token}`)
        .send(tutoriaData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('tutoria');
      expect(response.body.tutoria.materia).toBe(tutoriaData.materia);
    });

    it('debe rechazar tutoría con fecha pasada', async () => {
      const tutoriaData = {
        materia: 'Matemáticas',
        descripcion: 'Tutoría de prueba',
        fecha: '2020-01-01',
        cupos: 5
      };

      const response = await request(app)
        .post('/api/tutorias')
        .set('Authorization', `Bearer ${token}`)
        .send(tutoriaData);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/tutorias/disponibles', () => {
    beforeEach(async () => {
      // Crear algunas tutorías de prueba
      await Tutoria.create({
        materia: 'Matemáticas',
        descripcion: 'Tutoría 1',
        fecha: '2025-05-29',
        cupos: 5,
        profesor_id: profesor.id
      });
    });

    it('debe listar tutorías disponibles', async () => {
      const response = await request(app)
        .get('/api/tutorias/disponibles');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.tutorias)).toBe(true);
      expect(response.body.tutorias.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/tutorias/mis-tutorias', () => {
    it('debe listar tutorías del profesor', async () => {
      const response = await request(app)
        .get('/api/tutorias/mis-tutorias')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.tutorias)).toBe(true);
    });

    it('debe rechazar sin autenticación', async () => {
      const response = await request(app)
        .get('/api/tutorias/mis-tutorias');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/tutorias/:id', () => {
    let tutoria;

    beforeEach(async () => {
      tutoria = await Tutoria.create({
        materia: 'Matemáticas',
        descripcion: 'Tutoría para actualizar',
        fecha: '2025-05-29',
        cupos: 5,
        profesor_id: profesor.id
      });
    });

    it('debe actualizar tutoría existente', async () => {
      const updateData = {
        materia: 'Matemáticas Avanzadas',
        cupos: 10
      };

      const response = await request(app)
        .put(`/api/tutorias/${tutoria.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.tutoria.materia).toBe(updateData.materia);
      expect(response.body.tutoria.cupos).toBe(updateData.cupos);
    });
  });

  describe('DELETE /api/tutorias/:id', () => {
    let tutoria;

    beforeEach(async () => {
      tutoria = await Tutoria.create({
        materia: 'Matemáticas',
        descripcion: 'Tutoría para eliminar',
        fecha: '2025-05-29',
        cupos: 5,
        profesor_id: profesor.id
      });
    });

    it('debe eliminar tutoría existente', async () => {
      const response = await request(app)
        .delete(`/api/tutorias/${tutoria.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      
      // Verificar que la tutoría fue eliminada
      const tutoriaEliminada = await Tutoria.findByPk(tutoria.id);
      expect(tutoriaEliminada).toBeNull();
    });
  });
}); 