# Sistema de Gestión de Tutorías

## Índice
1. [Introducción](#introducción)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Modelos de Datos](#modelos-de-datos)
4. [Controladores](#controladores)
5. [Pruebas](#pruebas)
6. [Configuración](#configuración)

## Introducción

El Sistema de Gestión de Tutorías es una aplicación web desarrollada con Node.js y MySQL que permite gestionar tutorías académicas. El sistema facilita la interacción entre profesores y estudiantes, permitiendo la gestión de materiales educativos, reservas de tutorías y administración de usuarios.

### Características Principales
- Gestión de usuarios con roles (administrador, profesor, estudiante)
- Gestión de materiales educativos
- Sistema de reservas de tutorías
- Control de acceso basado en roles
- API RESTful

## Arquitectura del Sistema

### Tecnologías Utilizadas
- **Backend**: Node.js con Express
- **Base de Datos**: MySQL con Sequelize ORM
- **Testing**: Jest para pruebas unitarias e integración
- **Autenticación**: JWT (JSON Web Tokens)

### Estructura de Directorios
```
proyecto/
├── config/
│   ├── config.js         # Configuración de base de datos
├── controllers/
│   ├── materialController.js
│   ├── reservasController.js
│   ├── rolesController.js
│   ├── tutoriaController.js
│   └── usersController.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── validator.js
├── models/
│   ├── index.js
│   ├── material.js
│   ├── reserva.js
│   ├── rol.js
│   ├── tutoria.js
│   └── usuario.js
├── tests/
│   ├── unit/
│   └── integration/
└── routes/
    ├── material.routes.js
    ├── reservas.routes.js
    └── usuarios.routes.js
```

## Modelos de Datos

### Usuario
- **Campos**:
  - id (PK)
  - nombre
  - email
  - password (hash)
  - rol_id (FK)

### Tutoría
- **Campos**:
  - id (PK)
  - materia
  - descripcion
  - fecha
  - cupos
  - profesor_id (FK)

### Material
- **Campos**:
  - id (PK)
  - titulo
  - descripcion
  - url
  - tutoria_id (FK)

### Reserva
- **Campos**:
  - id (PK)
  - tutoria_id (FK)
  - estudiante_id (FK)
  - estado
  - fecha_reserva

## Controladores

### MaterialController
Gestiona los materiales educativos asociados a las tutorías.

#### Funcionalidades:
1. **agregarMaterial**
   - Permite a los profesores agregar materiales a sus tutorías
   - Validación de permisos y datos
   - Manejo de archivos y URLs

2. **obtenerMaterialesPorTutoria**
   - Lista los materiales asociados a una tutoría
   - Ordenamiento por fecha de creación

3. **eliminarMaterial**
   - Permite eliminar materiales
   - Verificación de permisos

### Pruebas Unitarias
Cada controlador cuenta con pruebas unitarias que verifican:
- Validación de datos
- Manejo de errores
- Permisos de usuario
- Integridad de datos

## Configuración

### Base de Datos
El sistema utiliza tres entornos de base de datos:
```javascript
{
  development: {
    database: "tutorias",
    // Configuración de desarrollo
  },
  test: {
    database: "tutorias_test",
    // Configuración de pruebas
  },
  production: {
    // Configuración de producción
  }
}
```

### Variables de Entorno
```env
DB_USERNAME=root
DB_PASSWORD=****
DB_NAME=tutorias
DB_HOST=localhost
DB_PORT=3306
JWT_SECRET=****
```

## Pruebas

### Configuración de Pruebas
- Jest como framework de pruebas
- Configuración específica para pruebas unitarias
- Base de datos de pruebas independiente

### Cobertura de Código
- Statements: >50%
- Branches: >40%
- Functions: >60%
- Lines: >50%

### Ejecución de Pruebas
```bash
npm test              # Ejecutar todas las pruebas
npm run test:unit     # Ejecutar pruebas unitarias
npm run test:coverage # Ver cobertura de código
```

## Seguridad

### Autenticación
- JWT para manejo de sesiones
- Tokens con expiración
- Refresh tokens para mantener sesiones

### Autorización
- Middleware de autenticación
- Control de acceso basado en roles
- Validación de permisos por recurso

## Despliegue

### Requisitos del Sistema
- Node.js v14 o superior
- MySQL 5.7 o superior
- NPM o Yarn

### Pasos de Instalación
1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Configurar variables de entorno
4. Ejecutar migraciones: `npm run migrate`
5. Iniciar servidor: `npm start`

## Mantenimiento

### Logs y Monitoreo
- Winston para logging
- Morgan para logs HTTP
- Manejo de errores centralizado

### Backups
- Respaldo diario de base de datos
- Rotación de logs
- Gestión de archivos subidos

## Conclusiones

El Sistema de Gestión de Tutorías proporciona una plataforma robusta para la administración de tutorías académicas, con énfasis en:
- Seguridad y control de acceso
- Pruebas automatizadas
- Mantenibilidad del código
- Escalabilidad

Para convertir este documento a Word, puedes:
1. Usar un convertidor online de Markdown a Word
2. Copiar y pegar en Word manteniendo el formato
3. Usar herramientas como Pandoc 