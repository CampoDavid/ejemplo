const request = require('supertest');
const app = require('../server');
const db = require('../models');

describe('Módulo de Roles', () => {
    let adminToken;

    beforeAll(async () => {
        // Sincronizar la base de datos de prueba
        await db.sequelize.sync({ force: true });

        // Crear rol de administrador
        const rolAdmin = await db.Rol.create({
            id: 1,
            nombre: 'admin'
        });

        // Crear usuario administrador
        const admin = await db.Usuario.create({
            nombre: 'Admin Test',
            email: 'admin@test.com',
            password: await require('../utils/passwordUtils').hashPassword('123456'),
            rolId: rolAdmin.id
        });

        // Obtener token de administrador
        const response = await request(app)
            .post('/api/usuarios/login')
            .send({
                email: 'admin@test.com',
                password: '123456'
            });
        
        adminToken = response.body.token;
    });

    afterAll(async () => {
        await db.sequelize.close();
    });

    describe('GET /api/roles', () => {
        it('debería obtener la lista de roles (como admin)', async () => {
            const response = await request(app)
                .get('/api/roles')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('debería fallar sin autenticación', async () => {
            const response = await request(app)
                .get('/api/roles');

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/roles', () => {
        it('debería crear un nuevo rol (como admin)', async () => {
            const rolData = {
                nombre: 'profesor'
            };

            const response = await request(app)
                .post('/api/roles')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(rolData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.nombre).toBe(rolData.nombre);
        });

        it('debería fallar al crear un rol duplicado', async () => {
            const rolData = {
                nombre: 'profesor'
            };

            const response = await request(app)
                .post('/api/roles')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(rolData);

            expect(response.status).toBe(400);
        });

        it('debería fallar sin datos requeridos', async () => {
            const response = await request(app)
                .post('/api/roles')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({});

            expect(response.status).toBe(400);
        });
    });
}); 