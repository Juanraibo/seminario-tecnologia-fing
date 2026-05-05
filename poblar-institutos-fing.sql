-- Poblar tabla institutos con los 11 institutos de la Facultad de Ingeniería
-- Ejecutar en Supabase SQL Editor

-- Eliminar los institutos de prueba existentes (opcional)
-- DELETE FROM institutos;

-- Insertar los 11 institutos principales de FING
INSERT INTO institutos (nombre, sigla, email_contacto, activo) VALUES
  ('Instituto de Ingeniería Eléctrica', 'IIE', 'iie@fing.edu.uy', true),
  ('Instituto de Computación', 'InCo', 'inco@fing.edu.uy', true),
  ('Instituto de Ingeniería Mecánica y Producción Industrial', 'IIMPI', 'iimpi@fing.edu.uy', true),
  ('Instituto de Matemática y Estadística', 'IMERL', 'imerl@fing.edu.uy', true),
  ('Instituto de Ingeniería Química', 'IIQ', 'iiq@fing.edu.uy', true),
  ('Instituto de Estructuras y Transporte', 'IET', 'iet@fing.edu.uy', true),
  ('Instituto de Agrimensura', 'IA', 'agrimensura@fing.edu.uy', true),
  ('Instituto de Física', 'IF', 'fisica@fing.edu.uy', true),
  ('Instituto de Ingeniería Ambiental', 'IIA', 'iia@fing.edu.uy', true),
  ('Instituto de Mecánica de los Fluidos e Ingeniería Ambiental', 'IMFIA', 'imfia@fing.edu.uy', true),
  ('Laboratorio Tecnológico del Uruguay', 'LATU', 'latu@latu.org.uy', true)
ON CONFLICT (sigla) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  email_contacto = EXCLUDED.email_contacto,
  activo = EXCLUDED.activo;
