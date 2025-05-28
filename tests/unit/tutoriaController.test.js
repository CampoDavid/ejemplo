const { Tutoria, Usuario, Rol } = require('../../models');
const tutoriaController = require('../../controllers/tutoriaController');

// Mock de response y request
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body = {}, params = {}, user = null) => ({
  body,
  params,
  user
});

describe('TutoriaController', () => {
  let res;
  let profesor;
  let estudiante;

  beforeEach(async () => {
    res = mockResponse();
    
    // Crear roles necesarios
    const rolProfesor = await Rol.create({ nombre: 'profesor' });
    const rolEstudiante = await Rol.create({ nombre: 'estudiante' });

    // Crear usuarios de prueba
    profesor = await Usuario.create({
      nombre: 'Profesor Test',
      email: 'profesor@test.com',
      password: '123456',
      rol_id: rolProfesor.id
    });

    estudiante = await Usuario.create({
      nombre: 'Estudiante Test',
      email: 'estudiante@test.com',
      password: '123456',
      rol_id: rolEstudiante.id
    });
  });

  describe('createTutoria', () => {
    it('debe crear una tutoría exitosamente', async () => {
      const req = mockRequest(
        {
          materia: 'Matemáticas',
          descripcion: 'Tutoría de prueba',
          fecha: '2025-05-29',
          cupos: 5
        },
        {},
        { id: profesor.id }
      );

      await tutoriaController.createTutoria(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Tutoría creada exitosamente',
          tutoria: expect.objectContaining({
            materia: 'Matemáticas',
            cupos: 5
          })
        })
      );
    });

    it('debe validar fecha futura al crear tutoría', async () => {
      const req = mockRequest(
        {
          materia: 'Matemáticas',
          descripcion: 'Tutoría de prueba',
          fecha: '2020-01-01',
          cupos: 5
        },
        {},
        { id: profesor.id }
      );

      await tutoriaController.createTutoria(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getTutorias', () => {
    beforeEach(async () => {
      // Crear algunas tutorías de prueba
      await Tutoria.create({
        materia: 'Matemáticas',
        descripcion: 'Tutoría 1',
        fecha: '2025-05-29',
        cupos: 5,
        profesor_id: profesor.id
      });

      await Tutoria.create({
        materia: 'Física',
        descripcion: 'Tutoría 2',
        fecha: '2025-06-01',
        cupos: 3,
        profesor_id: profesor.id
      });
    });

    it('debe listar todas las tutorías disponibles', async () => {
      const req = mockRequest();

      await tutoriaController.getTutorias(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          tutorias: expect.arrayContaining([
            expect.objectContaining({
              materia: 'Matemáticas'
            }),
            expect.objectContaining({
              materia: 'Física'
            })
          ])
        })
      );
    });
  });

  describe('getTutoriasByProfesor', () => {
    beforeEach(async () => {
      await Tutoria.create({
        materia: 'Matemáticas',
        descripcion: 'Tutoría del profesor',
        fecha: '2025-05-29',
        cupos: 5,
        profesor_id: profesor.id
      });
    });

    it('debe listar tutorías del profesor', async () => {
      const req = mockRequest({}, {}, { id: profesor.id });

      await tutoriaController.getTutoriasByProfesor(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          tutorias: expect.arrayContaining([
            expect.objectContaining({
              materia: 'Matemáticas',
              profesor_id: profesor.id
            })
          ])
        })
      );
    });
  });

  describe('updateTutoria', () => {
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

    it('debe actualizar tutoría exitosamente', async () => {
      const req = mockRequest(
        {
          materia: 'Matemáticas Avanzadas',
          cupos: 10
        },
        { id: tutoria.id },
        { id: profesor.id }
      );

      await tutoriaController.updateTutoria(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Tutoría actualizada exitosamente',
          tutoria: expect.objectContaining({
            materia: 'Matemáticas Avanzadas',
            cupos: 10
          })
        })
      );
    });

    it('debe validar que la tutoría existe', async () => {
      const req = mockRequest(
        {
          materia: 'Matemáticas Avanzadas'
        },
        { id: 99999 },
        { id: profesor.id }
      );

      await tutoriaController.updateTutoria(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deleteTutoria', () => {
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

    it('debe eliminar tutoría exitosamente', async () => {
      const req = mockRequest(
        {},
        { id: tutoria.id },
        { id: profesor.id }
      );

      await tutoriaController.deleteTutoria(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      
      // Verificar que la tutoría fue eliminada
      const tutoriaEliminada = await Tutoria.findByPk(tutoria.id);
      expect(tutoriaEliminada).toBeNull();
    });

    it('debe validar que la tutoría existe al eliminar', async () => {
      const req = mockRequest(
        {},
        { id: 99999 },
        { id: profesor.id }
      );

      await tutoriaController.deleteTutoria(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
}); 