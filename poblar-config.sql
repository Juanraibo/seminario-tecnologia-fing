-- Poblar tabla config con todos los valores necesarios
-- Ejecutar este script en el SQL Editor de Supabase

-- Primero, eliminar los valores existentes para evitar duplicados
DELETE FROM config;

-- Insertar todos los valores de configuración
INSERT INTO config (key, value, descripcion) VALUES
  -- Categorías RAEE
  ('categorias_raee',
   '["Equipos de Informática y Telecomunicaciones", "Equipos de Audio y Video", "Baterías y Acumuladores", "Electrodomésticos de Línea Blanca", "Equipos de Iluminación", "Herramientas Eléctricas y Electrónicas", "Equipos Médicos", "Otros RAEE"]'::jsonb,
   'Categorías válidas de RAEE según normativa uruguaya'),

  -- Topes de peso por tamaño de lote
  ('lote_chico_max_kg',
   '30'::jsonb,
   'Peso máximo en kg para lotes pequeños'),

  ('lote_mediano_max_kg',
   '100'::jsonb,
   'Peso máximo en kg para lotes medianos'),

  -- Factor de CO2
  ('factor_co2_por_kg',
   '1.4'::jsonb,
   'Factor de CO2 evitado por kg de RAEE reciclado'),

  -- Materiales recuperados (porcentajes)
  ('materiales_recuperados_pct',
   '{"cobre": 0.05, "aluminio": 0.08, "plastico": 0.15}'::jsonb,
   'Porcentajes de materiales recuperados por kg de RAEE'),

  -- Scoring de gestoras
  ('scoring_inicial',
   '50'::jsonb,
   'Scoring inicial para nuevas gestoras'),

  ('scoring_certificado_a_tiempo',
   '10'::jsonb,
   'Puntos de scoring por certificado entregado a tiempo'),

  ('scoring_certificado_demora_media',
   '5'::jsonb,
   'Puntos de scoring por certificado con demora media'),

  ('scoring_certificado_demora_alta',
   '2'::jsonb,
   'Puntos de scoring por certificado con demora alta'),

  -- Límites de tiempo
  ('dias_limite_certificado',
   '30'::jsonb,
   'Días límite para entregar certificado después del retiro'),

  ('ia_timeout_segundos',
   '15'::jsonb,
   'Timeout en segundos para clasificación con IA');

-- Verificar que se insertaron correctamente
SELECT * FROM config ORDER BY key;
