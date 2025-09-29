const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Importar la conexión de base de datos
const { Pool } = require('pg');
const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Middleware para verificar token
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

// Middleware para verificar admin
const verifyAdmin = (req, res, next) => {
  if (req.user.role_id !== 1) { // role_id es número
    return res.status(403).json({ error: 'Acceso denegado. Solo administradores' });
  }
  next();
};

// REGISTRO DE USUARIO
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role_id = 2 } = req.body; // por defecto developer (2)
    
    // Validar datos
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password y name son requeridos' });
    }
    
    // Verificar si el usuario ya existe
    const userExists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (email, password, name, role_id) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role_id, created_at',
      [email, hashedPassword, name, role_id]
    );
    
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    // Generar token con role_id
    const token = jwt.sign(
      { id: user.id, email: user.email, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role_id: user.role_id
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// OBTENER TODOS LOS USUARIOS (solo admin)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        u.id, 
        u.email, 
        u.name, 
        u.role_id, 
        u.created_at, 
        u.updated_at,
        COALESCE(
          STRING_AGG(DISTINCT p_owned.name, ', '),
          'ninguno'
        ) AS proyectos_propietario,
        COALESCE(
          STRING_AGG(DISTINCT p_assigned.name, ', '),
          'ninguno'
        ) AS proyectos_asignado
      FROM users u
      LEFT JOIN projects p_owned ON u.id = p_owned.owner_id
      LEFT JOIN project_members pm ON u.id = pm.user_id
      LEFT JOIN projects p_assigned ON pm.project_id = p_assigned.id AND p_assigned.owner_id != u.id
      GROUP BY u.id, u.email, u.name, u.role_id, u.created_at, u.updated_at
      ORDER BY u.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// OBTENER USUARIO POR ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Solo admin puede ver otros usuarios, usuario puede ver su propio perfil
    if (req.user.role_id !== 1 && req.user.id !== parseInt(id)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    
    const result = await db.query(`
      SELECT 
        u.id, 
        u.email, 
        u.name, 
        u.role_id, 
        u.created_at, 
        u.updated_at,
        COALESCE(
          STRING_AGG(DISTINCT p_owned.name, ', '),
          'ninguno'
        ) AS proyectos_propietario,
        COALESCE(
          STRING_AGG(DISTINCT p_assigned.name, ', '),
          'ninguno'
        ) AS proyectos_asignado
      FROM users u
      LEFT JOIN projects p_owned ON u.id = p_owned.owner_id
      LEFT JOIN project_members pm ON u.id = pm.user_id
      LEFT JOIN projects p_assigned ON pm.project_id = p_assigned.id AND p_assigned.owner_id != u.id
      WHERE u.id = $1
      GROUP BY u.id, u.email, u.name, u.role_id, u.created_at, u.updated_at
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ACTUALIZAR USUARIO
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, role_id } = req.body;
    
    // Solo admin puede editar otros usuarios, usuario puede editar su propio perfil
    if (req.user.role_id !== 1 && req.user.id !== parseInt(id)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    
    // Solo admin puede cambiar roles
    if (role_id && req.user.role_id !== 1) {
      return res.status(403).json({ error: 'Solo admin puede cambiar roles' });
    }
    
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (email) {
      updates.push(`email = $${paramCount}`);
      values.push(email);
      paramCount++;
    }
    
    if (name) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }

    if (role_id && req.user.role_id === 1) {
      updates.push(`role_id = $${paramCount}`);
      values.push(role_id);
      paramCount++;
    }
    
    updates.push(`updated_at = NOW()`);
    values.push(id);
    
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, email, name, role_id, updated_at`;
    
    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({
      message: 'Usuario actualizado exitosamente',
      user: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ELIMINAR USUARIO (solo admin)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;