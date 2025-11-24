const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
const { Pool } = require("pg");

// Configuración de la conexión
const dbConfig = process.env.DATABASE_URL 
  ? {
      connectionString: process.env.DATABASE_URL,
      // No usar SSL con el pooler (puerto 6543)
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

// Probar conexión
app.get("/ping", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({ ok: true, time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

// Rutas
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(4000, () => console.log("Servidor en http://localhost:4000"));
