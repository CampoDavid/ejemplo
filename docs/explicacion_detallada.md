# Explicación Detallada del Sistema de Gestión de Tutorías

## 1. Modelos (models/)

### 1.1 Usuario (usuario.js)
```javascript
// Definición del modelo Usuario
class Usuario extends Model {
  static associate(models) {
    // Relación con Rol: Un usuario tiene un rol
    Usuario.belongsTo(models.Rol, {
      foreignKey: 'rol_id',
      as: 'rol'
    });
    // Relación con Tutoria: Un profesor puede tener muchas tutorías
    Usuario.hasMany(models.Tutoria, {
      foreignKey: 'profesor_id',
      as: 'tutorias'
    });
  }
}
```
**Explicación línea por línea:**
1. `class Usuario extends Model`: Hereda de Sequelize.Model para crear el modelo
2. `static associate(models)`: Método para definir relaciones con otros modelos
3. `Usuario.belongsTo(models.Rol)`: Establece relación uno a uno con Rol
4. `Usuario.hasMany(models.Tutoria)`: Establece relación uno a muchos con Tutorías

### 1.2 Material (materials.js)
```javascript
// Definición del modelo Material
{
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 255]
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true
    }
  }
}
```
**Explicación de cada campo:**
1. `titulo`:
   - `type: DataTypes.STRING`: Campo de texto
   - `allowNull: false`: No puede ser nulo
   - `validate`: Reglas de validación
     - `notEmpty`: No puede estar vacío
     - `len: [3, 255]`: Longitud entre 3 y 255 caracteres

2. `descripcion`:
   - `type: DataTypes.TEXT`: Campo de texto largo
   - `allowNull: true`: Puede ser nulo

3. `url`:
   - Validación de URL
   - Campo obligatorio
   - Debe ser una URL válida

## 2. Controladores (controllers/)

### 2.1 MaterialController (materialController.js)

#### agregarMaterial
```javascript
exports.agregarMaterial = async (req, res) => {
  try {
    const { titulo, descripcion, url, tutoriaId } = req.body;

    // Validación de campos requeridos
    if (!titulo || !url || !tutoriaId) {
      return res.status(400).json({
        message: 'Faltan campos requeridos'
      });
    }
```
**Explicación:**
1. `exports.agregarMaterial`: Exporta la función para uso en rutas
2. `async (req, res)`: Función asíncrona que maneja la petición
3. `const { titulo, ... } = req.body`: Destructuring de datos de la petición
4. Validación de campos obligatorios

#### Validación de Tutoría
```javascript
    const tutoria = await Tutoria.findOne({
      where: { 
        id: tutoriaId,
        profesor_id: req.usuario.id
      }
    });
```
**Explicación:**
1. Busca la tutoría por ID
2. Verifica que pertenezca al profesor actual
3. Usa el modelo Tutoria de Sequelize

## 3. Pruebas (tests/)

### 3.1 Configuración de Pruebas (setup.js)
```javascript
beforeAll(async () => {
  try {
    await db.sequelize.sync({ force: true });
    console.log('Base de datos de pruebas sincronizada');
  } catch (error) {
    console.error('Error al sincronizar:', error);
    throw error;
  }
});
```
**Explicación:**
1. `beforeAll`: Se ejecuta antes de todas las pruebas
2. `sync({ force: true })`: Recrea las tablas
3. Manejo de errores con try/catch

### 3.2 Pruebas de Material (materialController.test.js)
```javascript
describe('agregarMaterial', () => {
  it('debe agregar material exitosamente', async () => {
    const req = mockRequest({
      titulo: 'Material de prueba',
      descripcion: 'Descripción',
      url: 'https://ejemplo.com/material.pdf',
      tutoriaId: tutoria.id
    });
```
**Explicación:**
1. `describe`: Agrupa pruebas relacionadas
2. `it`: Define un caso de prueba específico
3. `mockRequest`: Simula una petición HTTP

## 4. Middleware (middleware/)

### 4.1 Autenticación (auth.js)
```javascript
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        message: 'Token no proporcionado'
      });
    }
```
**Explicación:**
1. Extrae el token del header
2. Verifica su existencia
3. Maneja casos de error

## 5. Base de Datos

### 5.1 Configuración (config/config.js)
```javascript
module.exports = {
  development: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "1234",
    database: process.env.DB_NAME || "tutorias",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql"
  }
}
```
**Explicación:**
1. Configuración para diferentes entornos
2. Uso de variables de entorno
3. Valores por defecto

## 6. Rutas (routes/)

### 6.1 Rutas de Material (material.routes.js)
```javascript
router.post('/', authMiddleware, async (req, res) => {
  await materialController.agregarMaterial(req, res);
});
```
**Explicación:**
1. Define ruta POST
2. Usa middleware de autenticación
3. Conecta con el controlador

## 7. Validaciones

### 7.1 Validación de Datos
```javascript
const validateMaterial = (data) => {
  const errors = [];
  if (!data.titulo) errors.push('El título es requerido');
  if (!data.url) errors.push('La URL es requerida');
  return errors;
};
```
**Explicación:**
1. Función de validación
2. Comprueba campos requeridos
3. Retorna array de errores

## 8. Manejo de Errores

### 8.1 Error Handler
```javascript
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};
```
**Explicación:**
1. Middleware de manejo de errores
2. Logging de errores
3. Respuesta según entorno

## 9. Seguridad

### 9.1 Protección de Rutas
```javascript
const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.usuario.rol)) {
    return res.status(403).json({
      message: 'No tiene permisos suficientes'
    });
  }
  next();
};
```
**Explicación:**
1. Middleware de verificación de roles
2. Control de acceso basado en roles
3. Manejo de permisos

## 10. Utilidades

### 10.1 Helpers
```javascript
const formatearFecha = (fecha) => {
  return new Date(fecha).toISOString().split('T')[0];
};
```
**Explicación:**
1. Función auxiliar
2. Formato de fechas
3. Uso en múltiples partes

Esta documentación detallada proporciona una visión profunda de cada componente del sistema, explicando su funcionamiento línea por línea. Cada sección incluye ejemplos de código reales y su explicación detallada. 