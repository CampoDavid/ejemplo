const db = require('../models');

async function initRoles() {
    try {
        // Crear roles básicos
        const roles = [
            { id: 1, nombre: 'admin' },
            { id: 2, nombre: 'estudiante' },
            { id: 3, nombre: 'profesor' }
        ];

        for (const rol of roles) {
            await db.Rol.findOrCreate({
                where: { id: rol.id },
                defaults: rol
            });
        }

        console.log('✅ Roles inicializados correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar roles:', error);
    } finally {
        await db.sequelize.close();
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    initRoles();
}

module.exports = initRoles; 