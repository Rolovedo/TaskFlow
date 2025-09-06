# TaskFlow

Tablero colaborativo de tareas estilo Kanban desarrollado con React, Node.js y PostgreSQL.

## 📋 Descripción

TaskFlow es una aplicación web que permite gestionar proyectos mediante tableros tipo Kanban. Incluye autenticación de usuarios con roles (administradores y desarrolladores) y funcionalidades CRUD completas para usuarios y tareas.

## 🚀 Características

- **Autenticación**: Login y registro con JWT
- **Roles de usuario**: Administradores y desarrolladores
- **CRUD completo**: Usuarios y tareas
- **Tableros Kanban**: Organización visual de tareas
- **Base de datos**: PostgreSQL con relaciones
- **API REST**: Backend con Express.js
- **Frontend**: React con interfaz moderna

## 🛠️ Tecnologías

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT para autenticación
- bcrypt para encriptación
- CORS

### Frontend
- React 19
- React Scripts
- CSS moderno

### Base de datos
- PostgreSQL
- DBeaver para administración

## 📦 Instalación

### Prerrequisitos
- Node.js (v16 o superior)
- PostgreSQL
- npm o yarn
- DBeaver (opcional, para gestión de BD)

### 1. Clonar el repositorio
```bash
git clone https://github.com/Rolovedo/TaskFlow.git
cd TaskFlow
```

### 2. Configurar la base de datos

#### Instalar PostgreSQL
1. Descargar desde [postgresql.org](https://www.postgresql.org/download/)
2. Instalar y configurar usuario y contraseña
3. Crear base de datos:

```sql
-- Conectar a PostgreSQL
psql -U postgres

-- Crear base de datos
CREATE DATABASE taskflow;

-- Usar la base de datos
\c taskflow

-- Ejecutar el schema (copiar contenido de database/schema.sql)
```

#### Ejecutar el schema
```sql
-- Copiar y ejecutar todo el contenido del archivo database/schema.sql
-- Esto creará las tablas: users, boards, columns, tasks
```

### 3. Configurar el backend

```bash
# Navegar a la carpeta server
cd server

# Instalar dependencias
npm install

# Crear archivo .env basado en .env.example
cp .env.example .env
```

#### Configurar variables de entorno (.env)
```env
DB_USER=postgres
DB_PASS=tu_contraseña_postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskflow
JWT_SECRET=tu_clave_secreta_super_segura
```

#### Generar JWT_SECRET
```bash
# Ejecutar este comando para generar una clave segura
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Configurar el frontend

```bash
# Navegar a la carpeta client
cd ../client

# Instalar dependencias
npm install
```

## 🚀 Ejecución

### Iniciar el backend
```bash
cd server
npm start
# Servidor corriendo en: http://localhost:4000
```

### Iniciar el frontend
```bash
cd client
npm start
# Cliente corriendo en: http://localhost:3000
```

## 📝 API Endpoints

### Autenticación
- `POST /api/users/register` - Registrar usuario
- `POST /api/users/login` - Iniciar sesión

### Usuarios
- `GET /api/users` - Obtener todos los usuarios (solo admin)
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario (solo admin)

### Pruebas
- `GET /ping` - Probar conexión del servidor

## 🧪 Pruebas con Postman

### 1. Importar colección
- Importar el archivo `TaskFlow.postman_collection.json`
- Configurar variable `baseUrl`: `http://localhost:4000`

### 2. Flujo de pruebas
1. **Probar conexión**: `GET /ping`
2. **Registrar admin**: `POST /api/users/register`
3. **Login admin**: `POST /api/users/login`
4. **Obtener usuarios**: `GET /api/users` (con token)
5. **CRUD de usuarios**: GET, PUT, DELETE

### 3. Ejemplos de requests

#### Registrar administrador
```json
POST /api/users/register
{
  "email": "admin@taskflow.com",
  "password": "admin123",
  "name": "Administrador",
  "role": "admin"
}
```

#### Login
```json
POST /api/users/login
{
  "email": "admin@taskflow.com",
  "password": "admin123"
}
```

## 📂 Estructura del proyecto

```
TaskFlow/
├── client/                 # Frontend React
│   ├── public/
│   ├── src/
│   └── package.json
├── server/                 # Backend Node.js
│   ├── routes/
│   │   └── users.js
│   ├── .env
│   ├── .env.example
│   ├── index.js
│   └── package.json
├── database/
│   └── schema.sql         # Esquema de base de datos
├── .gitignore
├── README.md
└── TaskFlow.postman_collection.json
```

## 🔧 Scripts disponibles

### Backend (server/)
```bash
npm start          # Iniciar servidor
npm run dev        # Iniciar con nodemon
```

### Frontend (client/)
```bash
npm start          # Iniciar en desarrollo
npm run build      # Construir para producción
npm test           # Ejecutar tests
```

## 🔐 Seguridad

- Contraseñas encriptadas con bcrypt
- Autenticación JWT con expiración
- Validación de roles y permisos
- Variables de entorno para datos sensibles

## 👥 Roles de usuario

### Administrador
- Gestión completa de usuarios
- Acceso a todos los endpoints
- Puede cambiar roles de usuarios

### Desarrollador
- Acceso limitado
- Solo puede ver/editar su propio perfil
- Acceso a funcionalidades de tareas

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 📧 Contacto

**Desarrollador**: [Tu nombre]  
**Email**: [tu-email@dominio.com]  
**GitHub**: [Rolovedo](https://github.com/Rolovedo)

---

## 🔧 Solución de problemas

### Error: "no existe la relación users"
- Verificar que se ejecutó el schema.sql
- Confirmar conexión a la base de datos correcta

### Error 500 en endpoints
- Verificar variables de entorno
- Comprobar que PostgreSQL esté corriendo
- Revisar logs del servidor

### Puerto ocupado
- Cambiar puerto en variables de entorno
- Verificar que no haya otros servicios corriendo

---

⭐ **¡Dale una estrella al proyecto si te fue útil!** ⭐
