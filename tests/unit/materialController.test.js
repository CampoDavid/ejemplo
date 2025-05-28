const { Material, Usuario, Rol, Tutoria } = require('../../models');
const materialController = require('../../controllers/materialController');

// Mock de response y request
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body = {}, params = {}, usuario = null) => ({
  body,
  params,
  usuario
});

describe('MaterialController', () => {
  let res;
  let profesor;
  let tutoria;

  beforeEach(async () => {
    res = mockResponse();
    
    // Crear rol de profesor
    const rolProfesor = await Rol.create({ nombre: 'profesor' });

    // Crear profesor para pruebas
    profesor = await Usuario.create({
      nombre: 'Profesor Test',
      email: 'profesor@test.com',
      password: '123456',
      rol_id: rolProfesor.id
    });

    // Crear tutoría para pruebas
    tutoria = await Tutoria.create({
      materia: 'Matemáticas',
      descripcion: 'Descripción de la tutoría',
      profesor_id: profesor.id,
      fecha: new Date(Date.now() + 86400000), // mañana
      cupos: 5
    });
  });

  afterEach(async () => {
    // Limpiar las tablas después de cada prueba
    await Material.destroy({ where: {}, force: true });
    await Tutoria.destroy({ where: {}, force: true });
    await Usuario.destroy({ where: {}, force: true });
    await Rol.destroy({ where: {}, force: true });
  });

  describe('agregarMaterial', () => {
    it('debe agregar material exitosamente', async () => {
      const req = mockRequest(
        {
          titulo: 'Material de prueba',
          descripcion: 'Descripción del material',
          url: 'https://ejemplo.com/material.pdf',
          tutoriaId: tutoria.id
        },
        {},
        { id: profesor.id }
      );

      await materialController.agregarMaterial(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Material agregado exitosamente',
          material: expect.objectContaining({
            titulo: 'Material de prueba',
            url: 'https://ejemplo.com/material.pdf'
          })
        })
      );
    });

    it('debe fallar si faltan campos requeridos', async () => {
      const req = mockRequest(
        {
          descripcion: 'Descripción del material'
        },
        {},
        { id: profesor.id }
      );

      await materialController.agregarMaterial(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('debe fallar si la tutoría no existe', async () => {
      const req = mockRequest(
        {
          titulo: 'Material de prueba',
          descripcion: 'Descripción del material',
          url: 'https://ejemplo.com/material.pdf',
          tutoriaId: 99999
        },
        {},
        { id: profesor.id }
      );

      await materialController.agregarMaterial(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('obtenerMaterialesPorTutoria', () => {
    beforeEach(async () => {
      // Crear algunos materiales de prueba
      await Material.bulkCreate([
        {
          titulo: 'Material 1',
          descripcion: 'Descripción 1',
          url: 'https://ejemplo.com/material1.pdf',
          tutoria_id: tutoria.id
        },
        {
          titulo: 'Material 2',
          descripcion: 'Descripción 2',
          url: 'https://ejemplo.com/material2.pdf',
          tutoria_id: tutoria.id
        }
      ]);
    });

    it('debe listar todos los materiales de una tutoría', async () => {
      const req = mockRequest({}, { tutoriaId: tutoria.id });

      await materialController.obtenerMaterialesPorTutoria(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Materiales recuperados exitosamente',
          materiales: expect.arrayContaining([
            expect.objectContaining({
              titulo: 'Material 1'
            }),
            expect.objectContaining({
              titulo: 'Material 2'
            })
          ])
        })
      );
    });

    it('debe fallar si la tutoría no existe', async () => {
      const req = mockRequest({}, { tutoriaId: 99999 });

      await materialController.obtenerMaterialesPorTutoria(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('eliminarMaterial', () => {
    let material;

    beforeEach(async () => {
      material = await Material.create({
        titulo: 'Material para eliminar',
        descripcion: 'Descripción',
        url: 'https://ejemplo.com/material.pdf',
        tutoria_id: tutoria.id
      });
    });

    it('debe eliminar material exitosamente', async () => {
      const req = mockRequest(
        {},
        { id: material.id },
        { id: profesor.id, rol: 'profesor' }
      );

      await materialController.eliminarMaterial(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Material eliminado exitosamente'
        })
      );

      const materialEliminado = await Material.findByPk(material.id);
      expect(materialEliminado).toBeNull();
    });

    it('debe fallar si el material no existe', async () => {
      const req = mockRequest(
        {},
        { id: 99999 },
        { id: profesor.id, rol: 'profesor' }
      );

      await materialController.eliminarMaterial(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('debe fallar si el usuario no tiene permisos', async () => {
      const otroProfesor = await Usuario.create({
        nombre: 'Otro Profesor',
        email: 'otro@test.com',
        password: '123456',
        rol_id: profesor.rol_id
      });

      const req = mockRequest(
        {},
        { id: material.id },
        { id: otroProfesor.id, rol: 'profesor' }
      );

      await materialController.eliminarMaterial(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
}); 