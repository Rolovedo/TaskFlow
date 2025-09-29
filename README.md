# TaskFlow

Sistema de gestión de proyectos colaborativo con interfaz moderna y funcionalidades de administración de usuarios, desarrollado con React, Node.js y PostgreSQL.

## 📋 Descripción

TaskFlow es una aplicación web completa para la gestión de proyectos y usuarios. Cuenta con un sistema de autenticación robusto, gestión de roles, interfaz moderna con loaders animados, transiciones suaves entre páginas y un dashboard intuitivo. El proyecto está diseñado para administradores y desarrolladores con diferentes niveles de acceso.

## 🎨 Características Principales

- ✅ **Autenticación completa**: Login con JWT y manejo de sesiones
- ✅ **Sistema de roles**: Administradores y desarrolladores con permisos diferenciados
- ✅ **Interfaz moderna**: Diseño responsive con gradientes y animaciones
- ✅ **Logo personalizado**: TaskFlow con símbolo de infinito animado
- ✅ **Loaders elegantes**: Animaciones de carga con CSS puro
- ✅ **Transiciones suaves**: Navegación fluida entre páginas
- ✅ **Dashboard interactivo**: Panel de control personalizado por rol
- ✅ **Gestión de proyectos**: Vista preliminar de proyectos (en desarrollo)
- ✅ **Manejo de errores**: Feedback visual claro sin recargas de página
- ✅ **Protección de rutas**: Sistema de autenticación y autorización

## 🛠️ Tecnologías

### Backend
- **Node.js** con Express.js
- **PostgreSQL** como base de datos
- **JWT** para autenticación segura
- **bcrypt** para encriptación de contraseñas
- **CORS** para comunicación cliente-servidor

### Frontend
- **React 19** con hooks modernos
- **React Router DOM** para navegación
- **Context API** para gestión de estado global
- **CSS moderno** con animaciones y gradientes
- **Axios** para peticiones HTTP
- **Diseño responsive** adaptable a móviles

### Base de datos
- **PostgreSQL** con esquema relacional
- **Tablas estructuradas**: usuarios, proyectos, tareas
- **DBeaver** recomendado para administración

## 🎯 Funcionalidades Detalladas

### 🔐 Sistema de Autenticación
- Login seguro con validación de credenciales
- Tokens JWT con expiración automática
- Logout con confirmación visual
- Protección contra ataques de fuerza bruta
- Manejo de errores sin recarga de página

### 👥 Gestión de Usuarios
- **Administradores**: Acceso completo al sistema
- **Desarrolladores**: Acceso limitado a sus proyectos
- Perfiles de usuario personalizados
- Cambio de roles (solo administradores)

### 🎨 Interfaz de Usuario
- **Logo animado**: TaskFlow con símbolo de infinito CSS puro
- **Loaders elegantes**: 3 variantes de animaciones de carga
- **Gradientes futuristas**: Paleta azul-morado profesional
- **Transiciones fluidas**: Navegación sin interrupciones
- **Responsive design**: Optimizado para todos los dispositivos

### 📊 Dashboard
- Panel personalizado según el rol del usuario
- Vista rápida de proyectos asignados
- Navegación intuitiva entre secciones
- Información del usuario en tiempo real

## 📦 Instalación y Configuración

### Prerrequisitos
```bash
- Node.js v16 o superior
- PostgreSQL v12 o superior
- npm o yarn
- Git
```

### 1. Clonar el repositorio
```bash
git clone https://github.com/Rolovedo/TaskFlow.git
cd TaskFlow
```

### 2. Configuración de la Base de Datos

#### Instalar PostgreSQL
1. Descargar desde [postgresql.org](https://www.postgresql.org/download/)
2. Instalar y recordar usuario/contraseña
3. Configurar la base de datos:

```sql
-- Conectar a PostgreSQL como superusuario
psql -U postgres

-- Crear base de datos
CREATE DATABASE taskflow;

-- Conectar a la nueva base de datos
\c taskflow;

-- Ejecutar el schema completo (copiar desde database/schema.sql)
```

#### Schema de base de datos
```sql
-- Usuarios con roles
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role_id INTEGER DEFAULT 2,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Proyectos
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tareas
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    project_id INTEGER REFERENCES projects(id),
    assigned_to INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Configuración del Backend

```bash
# Navegar al directorio del servidor
cd server

# Instalar dependencias
npm install

# Crear archivo de configuración
cp .env.example .env
```

#### Variables de entorno (.env)
```env
# Base de datos PostgreSQL
DB_USER=postgres
DB_PASS=tu_contraseña_postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskflow

# Seguridad JWT
JWT_SECRET=tu_clave_jwt_super_segura_de_64_caracteres_minimo

# Puerto del servidor
PORT=4000
```

#### Generar JWT_SECRET seguro
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Configuración del Frontend

```bash
# Navegar al directorio del cliente
cd ../client

# Instalar dependencias
npm install

# Crear archivo de configuración (opcional)
echo "REACT_APP_API_URL=http://localhost:4000/api" > .env
```

## 🚀 Ejecutar el Proyecto

### Método 1: Ejecución manual

#### Terminal 1 - Backend
```bash
cd server
npm start
# ✅ Servidor ejecutándose en http://localhost:4000
```

#### Terminal 2 - Frontend
```bash
cd client
npm start
# ✅ Cliente ejecutándose en http://localhost:3000
```

### Método 2: Ejecución con desarrollo
```bash
# Backend con auto-restart
cd server
npm run dev

# Frontend con hot-reload
cd client
npm start
```

## 🧪 Credenciales de Prueba

### Crear usuarios de prueba
Una vez que el servidor esté corriendo, puedes crear usuarios de prueba:

```bash
# POST http://localhost:4000/api/users/register
{
  "email": "admin@taskflow.com",
  "password": "admin123",
  "name": "Administrador Sistema",
  "role": "admin"
}

{
  "email": "dev@taskflow.com",
  "password": "dev123",
  "name": "Desarrollador Frontend",
  "role": "developer"
}
```

### Login en la aplicación
- **Administrador**: admin@taskflow.com / admin123
- **Desarrollador**: dev@taskflow.com / dev123

## 📚 API Endpoints

### 🔐 Autenticación
```http
POST /api/users/register    # Registrar nuevo usuario
POST /api/users/login       # Iniciar sesión
```

### 👥 Usuarios (requiere autenticación)
```http
GET    /api/users          # Obtener usuarios (solo admin)
GET    /api/users/:id      # Obtener usuario específico
PUT    /api/users/:id      # Actualizar usuario
DELETE /api/users/:id      # Eliminar usuario (solo admin)
```

### 🔧 Sistema
```http
GET /ping                  # Verificar estado del servidor
```

## 📱 Flujo de Usuario

### Para Administradores
1. **Login** → Loader "Iniciando Sesión" → Dashboard
2. **Dashboard**: Vista completa del sistema
3. **Proyectos**: Gestión total de proyectos
4. **Usuarios**: CRUD completo de usuarios
5. **Logout**: Cierre seguro con confirmación

### Para Desarrolladores
1. **Login** → Loader "Iniciando Sesión" → Dashboard
2. **Dashboard**: Vista personalizada
3. **Proyectos**: Solo proyectos asignados
4. **Perfil**: Edición de datos personales
5. **Logout**: Cierre seguro

## 🎨 Componentes Principales

### 🔄 Loaders
- **Infinito animado**: CSS puro sin marcos
- **Partículas flotantes**: Ambiente futurista
- **Gradientes dinámicos**: Azul-morado profesional
- **3 variantes**: Para diferentes contextos

### 🎯 Logo
- **TaskFlow**: Con símbolo de infinito integrado
- **Animaciones**: Efecto glow y hover
- **Tamaños adaptativos**: small, medium, large, xlarge
- **Variantes de color**: light, dark, gradient

### 🛡️ Protección de Rutas
```javascript
// Rutas públicas: /login
// Rutas protegidas: /dashboard, /projects
// Redirección automática según autenticación
```

## 📂 Estructura del Proyecto

```
TaskFlow/
├── 📁 client/                    # Frontend React
│   ├── 📁 public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── Loader.js         # Loader infinito animado
│   │   │   ├── Loader.css        # Estilos del loader
│   │   │   └── ProtectedRoute.js # Protección de rutas
│   │   ├── 📁 context/
│   │   │   └── AuthContext.js    # Gestión de autenticación
│   │   ├── 📁 hooks/
│   │   │   └── usePageTransition.js # Transiciones suaves
│   │   ├── 📁 pages/
│   │   │   ├── Login.js          # Página de login
│   │   │   ├── Login.css         # Estilos del login
│   │   │   ├── Dashboard.js      # Dashboard principal
│   │   │   ├── Dashboard.css     # Estilos del dashboard
│   │   │   ├── Projects.js       # Gestión de proyectos
│   │   │   └── Projects.css      # Estilos de proyectos
│   │   ├── 📁 services/
│   │   │   └── api.js           # Configuración de Axios
│   │   ├── App.js               # Componente principal
│   │   └── index.js             # Punto de entrada
│   ├── .env                     # Variables de entorno
│   └── package.json
├── 📁 server/                   # Backend Node.js
│   ├── 📁 routes/
│   │   └── users.js            # Rutas de usuarios
│   ├── .env                    # Variables de entorno
│   ├── .env.example            # Ejemplo de configuración
│   ├── index.js                # Servidor principal
│   └── package.json
├── 📁 database/
│   └── schema.sql              # Esquema de PostgreSQL
├── .gitignore
├── README.md
└── TaskFlow.postman_collection.json
```

## 🔧 Scripts Disponibles

### Backend (server/)
```bash
npm start          # Producción
npm run dev        # Desarrollo con nodemon
npm test           # Tests (próximamente)
```

### Frontend (client/)
```bash
npm start          # Servidor de desarrollo
npm run build      # Build de producción
npm test           # Tests unitarios
npm run eject      # Exponer configuración
```

## 🔐 Seguridad Implementada

- ✅ **Contraseñas encriptadas**: bcrypt con salt
- ✅ **JWT seguro**: Tokens con expiración
- ✅ **Validación de entrada**: Sanitización de datos
- ✅ **CORS configurado**: Comunicación segura
- ✅ **Variables de entorno**: Datos sensibles protegidos
- ✅ **Validación de roles**: Permisos por endpoint
- ✅ **Interceptores HTTP**: Manejo automático de tokens

## 🐛 Solución de Problemas Comunes

### Error: "no existe la relación users"
```bash
# Verificar que PostgreSQL esté corriendo
sudo service postgresql start

# Conectar y verificar la base de datos
psql -U postgres -d taskflow
\dt  # Listar tablas
```

### Error: "Cannot connect to database"
```bash
# Verificar variables de entorno
cat server/.env

# Probar conexión manual
psql -U postgres -h localhost -p 5432 -d taskflow
```

### Error: "Port 4000 already in use"
```bash
# Encontrar y terminar proceso
lsof -i :4000
kill -9 <PID>

# O cambiar puerto en .env
PORT=4001
```

### Frontend no carga
```bash
# Limpiar cache y reinstalar
cd client
rm -rf node_modules package-lock.json
npm install
npm start
```

### Error 401 en login
```bash
# Verificar que el servidor esté corriendo
curl http://localhost:4000/ping

# Verificar credenciales en la base de datos
psql -U postgres -d taskflow -c "SELECT email, name FROM users;"
```

## 🚀 Próximas Funcionalidades

- [ ] **Gestión completa de proyectos**: CRUD de proyectos
- [ ] **Tableros Kanban**: Arrastrar y soltar tareas
- [ ] **Comentarios**: Sistema de comunicación
- [ ] **Notificaciones**: Alertas en tiempo real
- [ ] **Búsqueda avanzada**: Filtros y ordenamiento
- [ ] **Informes**: Dashboard con métricas
- [ ] **API completa**: Endpoints de proyectos y tareas
- [ ] **Tests automatizados**: Jest y Cypress
- [ ] **Dockerización**: Contenedores para deploy
- [ ] **CI/CD**: Pipeline automatizado

## 🤝 Contribución

1. Fork el repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Add: nueva funcionalidad'`
4. Push rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Convención de commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: actualización de documentación
style: cambios de formato
refactor: refactorización de código
test: añadir tests
chore: tareas de mantenimiento
```

## 👨‍💻 Autor

**Samuel Rodriguez**  
📧 Email: [acevedo314848@gmail.com]  
🐙 GitHub: [Rolovedo](https://github.com/Rolovedo)  


## 📊 Estado del Proyecto

```
🟢 Completado:
- ✅ Sistema de autenticación completo
- ✅ Dashboard funcional
- ✅ Interfaz moderna con animaciones
- ✅ Gestión básica de usuarios
- ✅ Loaders y transiciones

🟡 En Desarrollo:
- 🔄 CRUD completo de proyectos
- 🔄 Sistema de tareas Kanban
- 🔄 Tests automatizados

🔴 Planificado:
- 📋 Notificaciones en tiempo real
- 📋 Reportes y métricas
- 📋 Deploy en producción
```
