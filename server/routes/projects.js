// projects.js
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Conexión a la base de datos
const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Middleware de autenticación
const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Middleware para verificar admin
const verifyAdmin = (req, res, next) => {
  if (req.user.role_id !== 1) {
    return res.status(403).json({ error: 'Acceso denegado. Solo administradores' });
  }
  next();
};

// CREAR PROYECTO (solo admin) - SIN crear estados
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, description, owner_id } = req.body;
    if (!name || !owner_id) {
      return res.status(400).json({ error: 'Nombre y owner_id son requeridos' });
    }

    const project = await db.query(
      `INSERT INTO projects (name, description, owner_id) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, description, owner_id, created_at, updated_at`,
      [name, description, owner_id]
    );

    // NO crear estados específicos del proyecto
    // Los estados son globales y ya existen

    res.status(201).json({
      message: 'Proyecto creado exitosamente',
      project: project.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// OBTENER ESTADOS GLOBALES (MOVER ANTES DE /:id)
router.get('/states', verifyToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        s.id, 
        s.name, 
        s.state_order, 
        s.created_at, 
        s.updated_at
      FROM state s 
      ORDER BY s.state_order
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// OBTENER TODOS LOS PROYECTOS
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.owner_id, 
        u.name as owner_name, 
        p.created_at, 
        p.updated_at,
        COALESCE(
          STRING_AGG(DISTINCT um.name, ', '),
          'ninguno'
        ) AS usuarios_asignados
      FROM projects p
      JOIN users u ON p.owner_id = u.id
      LEFT JOIN project_members pm ON p.id = pm.project_id
      LEFT JOIN users um ON pm.user_id = um.id
      GROUP BY p.id, p.name, p.description, p.owner_id, u.name, p.created_at, p.updated_at
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// OBTENER PROYECTO POR ID (DESPUÉS del endpoint /states)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await db.query(`
      SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.owner_id, 
        u.name as owner_name, 
        p.created_at, 
        p.updated_at,
        COALESCE(
          STRING_AGG(DISTINCT um.name, ', '),
          'ninguno'
        ) AS usuarios_asignados
      FROM projects p
      JOIN users u ON p.owner_id = u.id
      LEFT JOIN project_members pm ON p.id = pm.project_id
      LEFT JOIN users um ON pm.user_id = um.id
      WHERE p.id = $1
      GROUP BY p.id, p.name, p.description, p.owner_id, u.name, p.created_at, p.updated_at
    `, [id]);

    if (project.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json(project.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ACTUALIZAR PROYECTO (solo admin)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }
    if (description) {
      updates.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const query = `UPDATE projects SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json({ message: 'Proyecto actualizado', project: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ELIMINAR PROYECTO (solo admin)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`DELETE FROM projects WHERE id = $1 RETURNING id`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    res.json({ message: 'Proyecto eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// AGREGAR MIEMBRO A PROYECTO (admin)
router.post('/:id/members', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) return res.status(400).json({ error: 'user_id requerido' });

    await db.query(
      `INSERT INTO project_members (project_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [id, user_id]
    );

    res.json({ message: 'Miembro agregado al proyecto' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ELIMINAR MIEMBRO DE PROYECTO (admin)
router.delete('/:id/members/:user_id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id, user_id } = req.params;

    const result = await db.query(
      `DELETE FROM project_members WHERE project_id = $1 AND user_id = $2 RETURNING id`,
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Miembro no encontrado en el proyecto' });
    }

    res.json({ message: 'Miembro eliminado del proyecto' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
