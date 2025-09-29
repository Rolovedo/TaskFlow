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
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Middleware para verificar si el usuario es owner del proyecto
const verifyProjectOwner = async (req, res, next) => {
  try {
    const { project_id } = req.body;
    
    if (!project_id) {
      return res.status(400).json({ error: 'project_id es requerido' });
    }

    // Verificar que el proyecto existe
    const projectQuery = await db.query(`
      SELECT owner_id, id as project_id
      FROM projects 
      WHERE id = $1
    `, [project_id]);

    if (projectQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    const project = projectQuery.rows[0];

    // Verificar si el usuario es admin o el owner del proyecto
    if (req.user.role_id !== 1 && req.user.id !== project.owner_id) {
      return res.status(403).json({ error: 'Solo el propietario del proyecto o un administrador puede realizar esta acción' });
    }

    req.project = project;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Middleware para verificar si el usuario tiene acceso al proyecto
const verifyProjectAccess = async (projectId, userId, userRoleId) => {
  try {
    // Admin puede ver todo
    if (userRoleId === 1) {
      return true;
    }

    // Verificar si es owner del proyecto
    const ownerQuery = await db.query('SELECT id FROM projects WHERE id = $1 AND owner_id = $2', [projectId, userId]);
    if (ownerQuery.rows.length > 0) {
      return true;
    }

    // Verificar si está asignado como miembro del proyecto
    const memberQuery = await db.query('SELECT id FROM project_members WHERE project_id = $1 AND user_id = $2', [projectId, userId]);
    if (memberQuery.rows.length > 0) {
      return true;
    }

    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// CREAR TAREA (modificada para usar project_id directamente)
router.post('/', verifyToken, verifyProjectOwner, async (req, res) => {
  try {
    const { title, description, status = 'pending', priority = 'medium', project_id, state_id, assigned_to, due_date } = req.body;
    
    // Validar campos requeridos
    if (!title || !project_id || !state_id) {
      return res.status(400).json({ error: 'Title, project_id y state_id son requeridos' });
    }

    // Verificar que el usuario asignado existe (si se proporciona)
    if (assigned_to) {
      const userExists = await db.query('SELECT id FROM users WHERE id = $1', [assigned_to]);
      if (userExists.rows.length === 0) {
        return res.status(400).json({ error: 'El usuario asignado no existe' });
      }
    }

    const result = await db.query(`
      INSERT INTO tasks (title, description, status, priority, project_id, state_id, assigned_to, created_by, due_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [title, description, status, priority, project_id, state_id, assigned_to, req.user.id, due_date]);

    res.status(201).json({
      message: 'Tarea creada exitosamente',
      task: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// OBTENER TODAS LAS TAREAS (corregir JOIN)
router.get('/', verifyToken, async (req, res) => {
  try {
    let query;
    let params = [];

    // Si es admin, puede ver todas las tareas
    if (req.user.role_id === 1) {
      query = `
        SELECT 
          t.id, 
          t.title, 
          t.description, 
          t.status, 
          t.priority, 
          t.state_id,
          s.name as state_name,
          t.due_date,
          t.created_at, 
          t.updated_at,
          COALESCE(ua.name, 'Sin asignar') as assigned_to_name,
          ua.id as assigned_to_id,
          uc.name as created_by_name,
          uc.id as created_by_id,
          p.name as project_name,
          p.id as project_id,
          p.owner_id as project_owner_id
        FROM tasks t
        LEFT JOIN users ua ON t.assigned_to = ua.id
        JOIN users uc ON t.created_by = uc.id
        JOIN state s ON t.state_id = s.id
        JOIN projects p ON t.project_id = p.id
        ORDER BY t.created_at DESC
      `;
    } else {
      // Para no-admin, solo mostrar tareas de proyectos donde es owner o miembro
      query = `
        SELECT 
          t.id, 
          t.title, 
          t.description, 
          t.status, 
          t.priority, 
          t.state_id,
          s.name as state_name,
          t.due_date,
          t.created_at, 
          t.updated_at,
          COALESCE(ua.name, 'Sin asignar') as assigned_to_name,
          ua.id as assigned_to_id,
          uc.name as created_by_name,
          uc.id as created_by_id,
          p.name as project_name,
          p.id as project_id,
          p.owner_id as project_owner_id
        FROM tasks t
        LEFT JOIN users ua ON t.assigned_to = ua.id
        JOIN users uc ON t.created_by = uc.id
        JOIN state s ON t.state_id = s.id
        JOIN projects p ON t.project_id = p.id
        WHERE (
          p.owner_id = $1 OR 
          EXISTS (
            SELECT 1 FROM project_members pm 
            WHERE pm.project_id = p.id AND pm.user_id = $1
          )
        )
        ORDER BY t.created_at DESC
      `;
      params = [req.user.id];
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// OBTENER TAREA POR ID (corregir JOIN)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(`
      SELECT 
        t.id, 
        t.title, 
        t.description, 
        t.status, 
        t.priority, 
        t.state_id,
        s.name as state_name,
        t.due_date,
        t.created_at, 
        t.updated_at,
        COALESCE(ua.name, 'Sin asignar') as assigned_to_name,
        ua.id as assigned_to_id,
        uc.name as created_by_name,
        uc.id as created_by_id,
        p.name as project_name,
        p.id as project_id,
        p.owner_id as project_owner_id
      FROM tasks t
      LEFT JOIN users ua ON t.assigned_to = ua.id
      JOIN users uc ON t.created_by = uc.id
      JOIN state s ON t.state_id = s.id
      JOIN projects p ON t.project_id = p.id
      WHERE t.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    const task = result.rows[0];

    // Verificar si el usuario tiene acceso al proyecto de esta tarea
    const hasAccess = await verifyProjectAccess(task.project_id, req.user.id, req.user.role_id);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'No tienes acceso a esta tarea' });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ACTUALIZAR TAREA (corregir consulta)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, state_id, assigned_to, due_date } = req.body;

    // Verificar que la tarea existe y obtener información del proyecto
    const taskQuery = await db.query(`
      SELECT t.*, p.owner_id as project_owner_id
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE t.id = $1
    `, [id]);

    if (taskQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    const task = taskQuery.rows[0];

    // Verificar permisos:
    const isAdmin = req.user.role_id === 1;
    const isProjectOwner = req.user.id === task.project_owner_id;
    const isAssignedUser = req.user.id === task.assigned_to;

    if (!isAdmin && !isProjectOwner && !isAssignedUser) {
      return res.status(403).json({ error: 'No tienes permisos para actualizar esta tarea' });
    }

    // Si es solo usuario asignado (no owner ni admin), solo puede cambiar ciertos campos
    if (isAssignedUser && !isAdmin && !isProjectOwner) {
      if (title !== undefined || priority !== undefined || state_id !== undefined || assigned_to !== undefined) {
        return res.status(403).json({ error: 'Como usuario asignado, solo puedes modificar la descripción y el estado de la tarea' });
      }
    }

    // Verificaciones y actualizaciones...
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined && (isAdmin || isProjectOwner)) {
      updates.push(`title = $${paramCount}`);
      values.push(title);
      paramCount++;
    }

    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }

    if (status !== undefined) {
      updates.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }

    if (priority !== undefined && (isAdmin || isProjectOwner)) {
      updates.push(`priority = $${paramCount}`);
      values.push(priority);
      paramCount++;
    }

    if (state_id !== undefined && (isAdmin || isProjectOwner)) {
      updates.push(`state_id = $${paramCount}`);
      values.push(state_id);
      paramCount++;
    }

    if (assigned_to !== undefined && (isAdmin || isProjectOwner)) {
      updates.push(`assigned_to = $${paramCount}`);
      values.push(assigned_to);
      paramCount++;
    }

    if (due_date !== undefined && (isAdmin || isProjectOwner)) {
      updates.push(`due_date = $${paramCount}`);
      values.push(due_date);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay campos válidos para actualizar' });
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await db.query(query, values);

    res.json({
      message: 'Tarea actualizada exitosamente',
      task: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ELIMINAR TAREA (corregir consulta)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la tarea existe y obtener información del proyecto
    const taskQuery = await db.query(`
      SELECT t.*, p.owner_id as project_owner_id
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE t.id = $1
    `, [id]);

    if (taskQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    const task = taskQuery.rows[0];

    // Solo el owner del proyecto o un admin pueden eliminar la tarea
    if (req.user.role_id !== 1 && req.user.id !== task.project_owner_id) {
      return res.status(403).json({ error: 'Solo el propietario del proyecto o un administrador puede eliminar esta tarea' });
    }

    await db.query('DELETE FROM tasks WHERE id = $1', [id]);

    res.json({ message: 'Tarea eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// OBTENER TAREAS POR PROYECTO (corregir consulta)
router.get('/project/:projectId', verifyToken, async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verificar si el usuario tiene acceso al proyecto
    const hasAccess = await verifyProjectAccess(projectId, req.user.id, req.user.role_id);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'No tienes acceso a este proyecto' });
    }

    const result = await db.query(`
      SELECT 
        t.id, 
        t.title, 
        t.description, 
        t.status, 
        t.priority, 
        t.state_id,
        s.name as state_name,
        t.due_date,
        t.created_at, 
        t.updated_at,
        COALESCE(ua.name, 'Sin asignar') as assigned_to_name,
        ua.id as assigned_to_id,
        uc.name as created_by_name,
        uc.id as created_by_id,
        p.owner_id as project_owner_id
      FROM tasks t
      LEFT JOIN users ua ON t.assigned_to = ua.id
      JOIN users uc ON t.created_by = uc.id
      JOIN state s ON t.state_id = s.id
      JOIN projects p ON t.project_id = p.id
      WHERE t.project_id = $1
      ORDER BY s.state_order, t.created_at DESC
    `, [projectId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;