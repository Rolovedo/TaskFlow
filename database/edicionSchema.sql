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

-- 16. Agregar columnas de auditoría a la tabla state
ALTER TABLE state 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- 17. Agregar columna project_id a la tabla tasks
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS project_id INT;

-- 18. Actualizar la columna project_id en tasks basándose en la relación con state
UPDATE tasks 
SET project_id = s.project_id 
FROM state s 
WHERE tasks.state_id = s.id;

-- 19. Crear un índice para la columna project_id en tasks
ALTER TABLE tasks 
ADD CONSTRAINT tasks_project_id_fkey 
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

-- 20. Crear un índice para la columna project_id en tasks
CREATE INDEX idx_tasks_project_id ON tasks(project_id);

-- 21. (Opcional) Verifica que la columna project_id en tasks esté correctamente poblada
ALTER TABLE state DROP CONSTRAINT IF EXISTS state_project_id_fkey;
ALTER TABLE state DROP COLUMN IF EXISTS project_id;

-- 22. Eliminar estados duplicados en la tabla state, manteniendo el de menor id
DELETE FROM state WHERE id NOT IN (
  SELECT MIN(id) FROM state GROUP BY name
);

-- 23. Insertar los estados base si no existen
INSERT INTO state (name, state_order, created_at, updated_at) 
VALUES 
  ('pending', 1, NOW(), NOW()),
  ('in_progress', 2, NOW(), NOW()),
  ('in_revision', 3, NOW(), NOW()),
  ('completed', 4, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 24. Actualizar la columna state_id en tasks basándose en el estado actual
UPDATE tasks SET state_id = 1 WHERE status = 'pending';
UPDATE tasks SET state_id = 2 WHERE status = 'in_progress';
UPDATE tasks SET state_id = 3 WHERE status = 'in_revision';
UPDATE tasks SET state_id = 4 WHERE status = 'completed';

-- Eliminar temporalmente las tareas para evitar conflictos de FK
DELETE FROM tasks;

-- Eliminar todos los estados existentes
DELETE FROM state;

-- Reiniciar la secuencia para que empiece desde 1
ALTER SEQUENCE state_id_seq RESTART WITH 1;

-- Insertar los 4 estados globales con IDs específicos
INSERT INTO state (id, name, state_order, created_at, updated_at) VALUES 
  (1, 'pending', 1, NOW(), NOW()),
  (2, 'in_progress', 2, NOW(), NOW()),
  (3, 'in_revision', 3, NOW(), NOW()),
  (4, 'completed', 4, NOW(), NOW());

  -- Actualizar la secuencia para que el próximo ID sea 5
SELECT setval('state_id_seq', 4, true);

-- Eliminar la restricción problemática
ALTER TABLE tasks DROP CONSTRAINT check_task_status;

-- Actualizar los nombres de los estados para que coincidan con el formato esperado
UPDATE state 
SET name = 'in_revision' 
WHERE name = 'in-revision';

-- Eliminar la restricción actual
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;

-- Crear la nueva restricción con el nombre correcto
ALTER TABLE tasks 
ADD CONSTRAINT tasks_status_check 
CHECK (status IN ('pending', 'in_progress', 'in_revision', 'completed'));