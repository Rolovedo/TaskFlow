-- 1. Crear la tabla roles si no existe
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

-- 2. Insertar los roles base si no existen
INSERT INTO roles (id, nombre)
VALUES (1, 'admin'), (2, 'developer')
ON CONFLICT (id) DO NOTHING;

-- 3. Agregar el campo role_id a la tabla users
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role_id INT REFERENCES roles(id);

-- 4. Migrar los datos del campo role al campo role_id
UPDATE users SET role_id = 1 WHERE role = 'admin';
UPDATE users SET role_id = 2 WHERE role = 'developer';

-- 5. Eliminar el campo role anterior
ALTER TABLE users
DROP COLUMN IF EXISTS role;

-- 6. (Opcional) Verifica que el campo role_id esté correctamente poblado
SELECT id, email, name, role_id FROM users;

-- 7. Renombrar la tabla columns a state
ALTER TABLE columns RENAME TO state;

-- 8. Renombrar la columna column_id en tasks a state_id
ALTER TABLE tasks RENAME COLUMN column_id TO state_id;

-- 9. Actualizar la referencia en tasks para que apunte a state
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;

ALTER TABLE tasks
ADD CONSTRAINT tasks_status_check CHECK (
  status IN ('pending', 'in_progress', 'in_revision', 'completed')
);

-- 10. Actualizar la referencia en tasks para que apunte a state
DROP INDEX IF EXISTS idx_tasks_column_id;
CREATE INDEX idx_tasks_state_id ON tasks(state_id);

-- 11. Renombrar la columna board_id en state a project_id
ALTER TABLE boards RENAME TO projects;

-- 12. Actualizar el índice para que apunte a projects
ALTER TABLE state RENAME COLUMN board_id TO project_id;

-- 13. Actualizar el índice para que apunte a projects
DROP INDEX IF EXISTS idx_boards_owner;
CREATE INDEX idx_projects_owner ON projects(owner_id);

-- 14. Crear la tabla project_members para gestionar los miembros del proyecto
CREATE TABLE IF NOT EXISTS project_members (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES projects(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (project_id, user_id)
);

-- 15. Crear índices para optimizar las consultas en project_members
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id);

-- Elimina la restricción actual
ALTER TABLE state DROP CONSTRAINT columns_board_id_fkey;

-- Crea la nueva restricción con ON DELETE CASCADE
ALTER TABLE state
ADD CONSTRAINT state_project_id_fkey
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;