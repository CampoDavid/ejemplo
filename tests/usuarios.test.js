const request = require('supertest');
const app = require('../server');
const db = require('../models');
const { hashPassword } = require('../utils/passwordUtils');

describe('Módulo de Usuarios', () => {
    beforeAll(async () => {
        // Sincronizar la base de datos de prueba
        await db.sequelize.sync({ force: true });
        
        // Crear rol de prueba
        await db.Rol.create({
            id: 1,
            nombre: 'usuario'
        });
    });

    afterAll(async () => {
        // Cerrar la conexión
        await db.sequelize.close();
    });

    describe('POST /api/usuarios/registro', () => {
        it('debería registrar un nuevo usuario correctamente', async () => {
            const userData = {
                nombre: 'Usuario Test',
                email: 'test@example.com',
                password: '123456',
                rolId: 1
            };

            const response = await request(app)
                .post('/api/usuarios/registro')
                .send(userData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.email).toBe(userData.email);
        });

        it('debería fallar al registrar un usuario con email duplicado', async () => {
            const userData = {
                nombre: 'Usuario Duplicado',
                email: 'test@example.com',
                password: '123456',
                rolId: 1
            };

            const response = await request(app)
                .post('/api/usuarios/registro')
                .send(userData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('El usuario ya está registrado');
        });

        it('debería fallar al registrar un usuario sin datos requeridos', async () => {
            const response = await request(app)
                .post('/api/usuarios/registro')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('details');
        });
    });

    describe('POST /api/usuarios/login', () => {
        it('debería hacer login correctamente', async () => {
            const loginData = {
                email: 'test@example.com',
                password: '123456'
            };

            const response = await request(app)
                .post('/api/usuarios/login')
                .send(loginData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('usuario');
        });

        it('debería fallar con credenciales incorrectas', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'contraseñaincorrecta'
            };

            const response = await request(app)
                .post('/api/usuarios/login')
                .send(loginData);

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Credenciales inválidas');
        });
    });

    describe('GET /api/usuarios/perfil', () => {
        let token;

        beforeAll(async () => {
            // Obtener token para pruebas
            const response = await request(app)
                .post('/api/usuarios/login')
                .send({
                    email: 'test@example.com',
                    password: '123456'
                });
            token = response.body.token;
        });

        it('debería obtener el perfil del usuario autenticado', async () => {
            const response = await request(app)
                .get('/api/usuarios/perfil')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('usuario');
            expect(response.body.usuario.email).toBe('test@example.com');
        });

        it('debería fallar sin token de autenticación', async () => {
            const response = await request(app)
                .get('/api/usuarios/perfil');

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('No se proporcionó token de autenticación');
        });

        it('debería fallar con token inválido', async () => {
            const response = await request(app)
                .get('/api/usuarios/perfil')
                .set('Authorization', 'Bearer tokeninvalido');

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Token inválido');
        });
    });
}); 