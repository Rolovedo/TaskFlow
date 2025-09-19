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