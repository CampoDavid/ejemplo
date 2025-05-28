const jwt = require('jsonwebtoken');
const { verifyToken, isProfesor } = require('../../middleware/authMiddleware');
const { Usuario, Rol } = require('../../models');

describe('Auth Middleware', () => {
  let res;
  let next;
  let token;
  let profesor;
  let estudiante;

  beforeEach(async () => {
    // Mock de response
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // Mock de next
    next = jest.fn();

    // Crear roles
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

    // Generar token válido
    token = jwt.sign(
      { id: profesor.id, email: profesor.email },
      process.env.JWT_SECRET || 'tu_clave_secreta_muy_segura',
      { expiresIn: '1h' }
    );
  });

  describe('verifyToken', () => {
    it('debe permitir acceso con token válido', async () => {
      const req = {
        headers: {
          authorization: `Bearer ${token}`
        }
      };

      await verifyToken(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
    });

    it('debe rechazar petición sin token', async () => {
      const req = {
        headers: {}
      };

      await verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No token provided'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('debe rechazar token inválido', async () => {
      const req = {
        headers: {
          authorization: 'Bearer invalid_token'
        }
      };

      await verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid token'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('isProfesor', () => {
    it('debe permitir acceso a profesor', async () => {
      const req = {
        user: {
          id: profesor.id
        }
      };

      await isProfesor(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('debe rechazar acceso a estudiante', async () => {
      const req = {
        user: {
          id: estudiante.id
        }
      };

      await isProfesor(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Acceso denegado. Se requiere rol de profesor'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
}); 