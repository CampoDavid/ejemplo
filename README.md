 # 📚 Plataforma Web de Tutorías Académicas - Backend

Este es el backend de la plataforma para la gestión de tutorías académicas en la Facultad de Ingeniería de la Universidad Unicomfacauca. Está desarrollado con **Node.js**, **Express**, **Sequelize** y **MySQL** bajo el patrón **MVC**, y con pruebas bajo **TDD** utilizando **Jest** y **Supertest**.

---

## 🚀 Tecnologías Utilizadas

- Node.js + Express.js
- Sequelize (ORM)
- MySQL (XAMPP o Workbench)
- Jest y Supertest (Pruebas)
- JWT (Autenticación)

---

## 📁 Estructura del Proyecto

```
├── controllers/          # Lógica de negocio
├── models/               # Modelos Sequelize
├── routes/               # Endpoints de la API
├── tests/                # Pruebas automatizadas
├── config/               # Configuración de base de datos
├── .env                  # Variables de entorno
├── server.js             # Punto de entrada
└── app.js                # Configuración principal
```

---

## ⚙️ Configuración del Proyecto

### 1. Clona el repositorio
```bash
https://github.com/tu-usuario/api-tutorias.git
cd api-tutorias
```

### 2. Instala las dependencias
```bash
npm install
```

### 3. Configura la base de datos
Asegúrate de tener corriendo MySQL en tu XAMPP o Workbench y crea una base de datos, por ejemplo:
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

### 5. Ejecuta el servidor
```bash
node app.js
```

> 💡 Si todo está bien, verás:
```
✅ Base de datos conectada y sincronizada
🚀 Servidor corriendo en http://localhost:3000
```

---

## ✅ Scripts Útiles

### Ejecutar pruebas (TDD)
```bash
npm test
```

---

## 🧪 Historias de Usuario Implementadas

### 1. Registro e Inicio de Sesión
- Ruta: `/api/usuarios/registro`
- Ruta: `/api/usuarios/login`

### 2. Publicación de Tutorías
- Ruta: `/api/tutoria/publicar`
- Ruta: `/api/tutoria/disponibles`

### 3. Reservas
- Ruta: `/api/reservas/reservar`
- Ruta: `/api/reservas/por-estudiante/:id`

### 4. Materiales
- Ruta: `/api/material/agregar`
- Ruta: `/api/material/por-tutoria/:id`

---

## 🛡️ Autenticación
Usa JSON Web Token para proteger futuras rutas privadas.

---

## ✍️ Contribuyentes

- Samuel Fernández Díaz  
- Jheferson Shneider Sánchez  
- Cristian David Campo Puyo  
- Juan Manuel Flor Mosquera

---

## 👨‍🏫 Profesor: Julián Andrés Gil

---

## 📌 Notas
- Se aplicó TDD (Test Driven Development) para cada módulo clave.
- El proyecto puede escalarse con validación JWT, interfaces protegidas y dashboards por rol.

---

¡Gracias por visitar este proyecto académico! 🎓