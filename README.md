# 📚 Plataforma Web de Tutorías Académicas - Backend

Este es el backend de la plataforma para la gestión de tutorías académicas en la Facultad de Ingeniería de la Universidad Unicomfacauca. Está desarrollado con **Node.js**, **Express**, **Sequelize** y **MySQL** bajo el patrón **MVC**, y con pruebas bajo **TDD** utilizando **Jest** y **Supertest**.

---

## 🚀 Tecnologías Utilizadas

- Node.js + Express.js
- Sequelize (ORM)
- MySQL (XAMPP o Workbench)
- Jest y Supertest (Pruebas)
- JWT (Autenticación)
- Swagger (Documentación API)
- Helmet (Seguridad)
- Morgan (Logging)

---

## 📁 Estructura del Proyecto

```
├── controllers/          # Lógica de negocio
├── models/              # Modelos Sequelize
├── routes/              # Endpoints de la API
├── tests/              # Pruebas automatizadas
│   ├── unit/           # Pruebas unitarias
│   ├── integration/    # Pruebas de integración
│   └── config/         # Configuración de pruebas
├── config/             # Configuración de base de datos
├── docs/              # Documentación
├── utils/             # Utilidades y helpers
├── scripts/           # Scripts de inicialización
├── .env               # Variables de entorno
├── server.js          # Punto de entrada
└── app.js             # Configuración principal
```

---

## ⚙️ Configuración del Proyecto

### 1. Clona el repositorio
```bash
git clone https://github.com/CampoDavid/ejemplo.git
cd ejemplo
```

### 2. Instala las dependencias
```bash
npm install
```

### 3. Configura la base de datos
Asegúrate de tener corriendo MySQL en tu XAMPP o Workbench y crea una base de datos:
```sql
CREATE DATABASE tutorias;
```

### 4. Crea un archivo `.env`
```env
DB_NAME=tutorias
DB_USER=root
DB_PASSWORD=          # (tu contraseña si tienes una)
DB_HOST=localhost
JWT_SECRET=secreto
PORT=3000
```

### 5. Inicializa la base de datos y roles
```bash
node scripts/initRoles.js
```

### 6. Ejecuta el servidor
```bash
npm start
```

---

## ✅ Scripts Útiles

### Ejecutar pruebas
```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas con coverage
npm run test:coverage

# Ejecutar pruebas unitarias
npm run test:unit

# Ejecutar pruebas de integración
npm run test:integration
```

### Reiniciar la base de datos
```bash
# Ejecutar script de reset
mysql -u root -p < reset-db.sql
```

---

## 🧪 Funcionalidades Implementadas

### 1. Gestión de Usuarios y Autenticación
- Registro de usuarios con roles
- Login con JWT
- Middleware de autenticación
- Gestión de permisos por rol

### 2. Gestión de Tutorías
- CRUD completo de tutorías
- Filtrado por estado y tutor
- Validación de disponibilidad
- Asignación automática de horarios

### 3. Sistema de Materiales
- Subida y gestión de materiales
- Asociación con tutorías
- Control de acceso por rol
- Validación de tipos de archivo

### 4. Pruebas Automatizadas
- Cobertura de código > 50%
- Pruebas unitarias de controladores
- Pruebas de integración de API
- Pruebas de middleware de autenticación

### 5. Documentación
- Swagger UI para API
- Documentación detallada de endpoints
- Ejemplos de uso y respuestas
- Guías de implementación

### 6. Seguridad
- Protección contra XSS
- Headers de seguridad con Helmet
- Validación de datos
- Sanitización de entradas
- Encriptación de contraseñas

---

## 📊 Cobertura de Pruebas

- Statements: 54.71%
- Branch: 18.42%
- Functions: 65%
- Lines: 54.71%

---

## 🛡️ Endpoints Protegidos

Todos los endpoints (excepto login y registro) requieren un token JWT válido en el header:
```
Authorization: Bearer <token>
```

---

## 👨‍💻 Equipo de Desarrollo

- Samuel Fernández Díaz  
- Jheferson Shneider Sánchez  
- Cristian David Campo Puyo  
- Juan Manuel Flor Mosquera

---

## 👨‍🏫 Profesor
Julián Andrés Gil

---

## 📝 Notas de la Última Actualización

- Implementación completa de pruebas unitarias y de integración
- Documentación actualizada con Swagger
- Mejoras en la seguridad con Helmet
- Sistema de logging con Morgan
- Scripts de inicialización y reset de base de datos
- Mejoras en la gestión de roles y permisos

---

## 🔜 Próximas Mejoras

- Aumentar la cobertura de pruebas
- Implementar sistema de notificaciones
- Mejorar la documentación de código
- Optimizar consultas a base de datos
- Implementar caché para mejoras de rendimiento

---

