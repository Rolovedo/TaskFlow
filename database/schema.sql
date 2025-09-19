-- Tabla de roles
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

-- Insertar roles base
INSERT INTO roles (id, nombre) VALUES (1, 'admin'), (2, 'developer');

-- Usuarios
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role_id INT REFERENCES roles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Proyectos (antes boards)
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  owner_id INT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Estados (antes columns)
CREATE TABLE state (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  project_id INT REFERENCES projects(id) ON DELETE CASCADE,
  state_order INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tareas
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'in_revision', 'completed')),
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  state_id INT REFERENCES state(id) ON DELETE CASCADE,
  assigned_to INT REFERENCES users(id) ON DELETE SET NULL,
  created_by INT REFERENCES users(id) ON DELETE CASCADE,
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_projects_owner ON projects(owner_id);
CREATE INDEX idx_tasks_state_id ON tasks(state_id);
