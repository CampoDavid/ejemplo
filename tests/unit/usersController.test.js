const { Usuario, Rol } = require('../../models');
const usersController = require('../../controllers/usersController');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

describe('UsersController', () => {
  let res;
  let rolEstudiante;
  let rolProfesor;

  beforeEach(async () => {
    res = mockResponse();
    
    // Crear roles necesarios
    rolEstudiante = await Rol.create({ nombre: 'estudiante' });
    rolProfesor = await Rol.create({ nombre: 'profesor' });
  });

  describe('register', () => {
    it('debe registrar un nuevo usuario exitosamente', async () => {
      const req = mockRequest({
        nombre: 'Test User',
        email: 'test@example.com',
        password: '123456',
        rol_id: rolEstudiante.id
      });

      await usersController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Usuario registrado exitosamente',
          user: expect.objectContaining({
            nombre: 'Test User',
            email: 'test@example.com'
          })
        })
      );
    });

    it('debe manejar error cuando el email ya existe', async () => {
      // Crear usuario primero
      await Usuario.create({
        nombre: 'Existing User',
        email: 'existing@example.com',
        password: '123456',
        rol_id: rolEstudiante.id
      });

      const req = mockRequest({
        nombre: 'Test User',
        email: 'existing@example.com',
        password: '123456',
        rol_id: rolEstudiante.id
      });

      await usersController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'El email ya está registrado'
        })
      );
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      // Crear un usuario de prueba
      const hashedPassword = await bcrypt.hash('123456', 10);
      await Usuario.create({
        nombre: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        rol_id: rolEstudiante.id
      });
    });

    it('debe hacer login exitosamente con credenciales correctas', async () => {
      const req = mockRequest({
        email: 'test@example.com',
        password: '123456'
      });

      await usersController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Login exitoso',
          token: expect.any(String)
        })
      );
    });

    it('debe rechazar login con contraseña incorrecta', async () => {
      const req = mockRequest({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

      await usersController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Credenciales inválidas'
        })
      );
    });

    it('debe rechazar login con email no existente', async () => {
      const req = mockRequest({
        email: 'nonexistent@example.com',
        password: '123456'
      });

      await usersController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Credenciales inválidas'
        })
      );
    });
  });
}); 