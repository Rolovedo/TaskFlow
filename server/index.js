const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Configurar CORS para permitir el frontend de Vercel
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://task-flow-three-theta.vercel.app',
    'https://task-flow-gtet.vercel.app',
    /\.vercel\.app$/ // Permitir todos los subdominios de vercel.app
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Conexión a la base de datos
const { Pool } = require("pg");

// Configuración de la conexión
const dbConfig = process.env.DATABASE_URL 
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes(':6543') ? false : { rejectUnauthorized: false }
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: String(process.env.DB_PASSWORD),
      port: parseInt(process.env.DB_PORT),
      ssl: { rejectUnauthorized: false }
    };

const db = new Pool(dbConfig);

// Ruta raíz
app.get("/", (req, res) => {
  res.json({ 
    message: "TaskFlow API",
    status: "running",
    endpoints: {
      ping: "/ping",
      users: "/api/users",
      projects: "/api/projects",
      tasks: "/api/tasks"
    }
  });
});

// Probar conexión
app.get("/ping", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({ ok: true, time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Ruta de bienvenida de la API
app.get("/api", (req, res) => {
  res.json({ 
    message: "TaskFlow API v1.0",
    status: "running",
    endpoints: {
      users: "/api/users",
      projects: "/api/projects",
      tasks: "/api/tasks",
      ping: "/ping"
    }
  });
});

// Rutas
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));

module.exports = app;
