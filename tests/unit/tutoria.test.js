const { Tutoria, Usuario, Rol } = require('../../models');

describe('Modelo Tutoria', () => {
  let profesor;

  beforeAll(async () => {
    // Crear un rol de profesor
    const rol = await Rol.create({
      nombre: 'profesor'
    });

    // Crear un profesor para las pruebas
    profesor = await Usuario.create({
      nombre: 'Profesor Test',
      email: 'profesor@test.com',
      password: '123456',
      rol_id: rol.id
    });
  });

  it('debe crear una tutoría válida', async () => {
    const tutoriaData = {
      materia: 'Matemáticas',
      descripcion: 'Tutoría de prueba',
      fecha: '2025-05-29',
      cupos: 5,
      profesor_id: profesor.id
    };

    const tutoria = await Tutoria.create(tutoriaData);
    expect(tutoria).toHaveProperty('id');
    expect(tutoria.materia).toBe(tutoriaData.materia);
    expect(tutoria.cupos).toBe(tutoriaData.cupos);
  });

  it('debe validar fecha futura', async () => {
    const tutoriaData = {
      materia: 'Matemáticas',
      descripcion: 'Tutoría de prueba',
      fecha: '2020-01-01',
      cupos: 5,
      profesor_id: profesor.id
    };

    await expect(Tutoria.create(tutoriaData)).rejects.toThrow('La fecha debe ser futura');
  });

  it('debe validar cupos mínimos', async () => {
    const tutoriaData = {
      materia: 'Matemáticas',
      descripcion: 'Tutoría de prueba',
      fecha: '2025-05-29',
      cupos: 0,
      profesor_id: profesor.id
    };

    await expect(Tutoria.create(tutoriaData)).rejects.toThrow('Debe haber al menos 1 cupo disponible');
  });

  it('debe validar materia requerida', async () => {
    const tutoriaData = {
      descripcion: 'Tutoría de prueba',
      fecha: '2025-05-29',
      cupos: 5,
      profesor_id: profesor.id
    };

    await expect(Tutoria.create(tutoriaData)).rejects.toThrow();
  });
}); 