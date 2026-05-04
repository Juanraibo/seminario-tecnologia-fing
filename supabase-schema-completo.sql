-- ============================================================================
-- ECOFING MVP - SCHEMA COMPLETO
-- Copiar y pegar TODO este archivo en el SQL Editor de Supabase
-- ============================================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. INSTITUTOS
-- ============================================================================
CREATE TABLE institutos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  sigla VARCHAR(50) NOT NULL UNIQUE,
  direccion TEXT,
  telefono VARCHAR(50),
  email_contacto VARCHAR(255),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Datos iniciales
INSERT INTO institutos (nombre, sigla, email_contacto) VALUES
  ('Instituto de Ingeniería Eléctrica', 'IIE', 'iie@fing.edu.uy'),
  ('Instituto de Computación', 'InCo', 'inco@fing.edu.uy'),
  ('Instituto de Ingeniería Mecánica', 'IIMPI', 'iimpi@fing.edu.uy'),
  ('Instituto de Matemática y Estadística', 'IMERL', 'imerl@fing.edu.uy');

-- ============================================================================
-- 2. GESTORAS
-- ============================================================================
CREATE TABLE gestoras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  rut VARCHAR(50) UNIQUE NOT NULL,
  direccion TEXT,
  telefono VARCHAR(50),
  email_contacto VARCHAR(255),
  scoring INTEGER DEFAULT 100 CHECK (scoring >= 0 AND scoring <= 100),
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Datos iniciales
INSERT INTO gestoras (nombre, rut, email_contacto, scoring) VALUES
  ('ReciclaUY S.A.', '210012340019', 'contacto@reciclauY.com', 95),
  ('EcoGestión Uruguay', '210098760011', 'info@ecogestion.uy', 88);

-- ============================================================================
-- 3. USUARIOS
-- ============================================================================
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL CHECK (rol IN ('admin', 'instituto', 'ecopunto', 'gestora')),
  instituto_id UUID REFERENCES institutos(id) ON DELETE CASCADE,
  gestora_id UUID REFERENCES gestoras(id) ON DELETE CASCADE,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);

-- Usuarios de prueba
INSERT INTO usuarios (email, password_hash, nombre, rol, instituto_id, gestora_id) VALUES
  ('admin@fing.edu.uy', 'admin123', 'Administrador FIng', 'admin', NULL, NULL),
  ('ecopunto@fing.edu.uy', 'eco123', 'Operador Ecopunto', 'ecopunto', NULL, NULL),
  (
    'inco@fing.edu.uy',
    'inco123',
    'Responsable InCo',
    'instituto',
    (SELECT id FROM institutos WHERE sigla = 'InCo'),
    NULL
  ),
  (
    'gestora1@reciclauY.com',
    'gest123',
    'Responsable ReciclaUY',
    'gestora',
    NULL,
    (SELECT id FROM gestoras WHERE rut = '210012340019')
  );

-- ============================================================================
-- 4. LOTES DE ENTRADA
-- ============================================================================
CREATE TABLE lotes_entrada (
  id VARCHAR(50) PRIMARY KEY,
  instituto_id UUID NOT NULL REFERENCES institutos(id),
  tamano VARCHAR(20) NOT NULL CHECK (tamano IN ('pequeño', 'mediano', 'grande')),
  peso_declarado_aprox_kg DECIMAL(10,2),
  descripcion TEXT,
  estado VARCHAR(50) NOT NULL DEFAULT 'Pendiente envío Ecopunto',
  fecha_solicitud DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_recepcion_ecopunto DATE,
  fecha_clasificacion_completa DATE,
  fotos JSONB DEFAULT '[]'::jsonb,
  items_clasificados INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lotes_entrada_instituto ON lotes_entrada(instituto_id);
CREATE INDEX idx_lotes_entrada_estado ON lotes_entrada(estado);

-- ============================================================================
-- 5. ITEMS
-- ============================================================================
CREATE TABLE items (
  id VARCHAR(50) PRIMARY KEY,
  lote_origen_id VARCHAR(50) NOT NULL REFERENCES lotes_entrada(id) ON DELETE CASCADE,
  instituto_id UUID NOT NULL REFERENCES institutos(id),
  categoria VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  peso_kg DECIMAL(10,2) NOT NULL CHECK (peso_kg > 0),
  co2_kg DECIMAL(10,2),
  co2_source VARCHAR(20) DEFAULT 'estimated' CHECK (co2_source IN ('api', 'estimated')),
  foto_url TEXT,
  clasificado_por_ia BOOLEAN DEFAULT false,
  confianza_ia INTEGER CHECK (confianza_ia >= 0 AND confianza_ia <= 100),
  lote_publicado_id VARCHAR(50),
  fecha_clasificacion DATE NOT NULL DEFAULT CURRENT_DATE,
  observaciones TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_items_lote_origen ON items(lote_origen_id);
CREATE INDEX idx_items_categoria ON items(categoria);

-- ============================================================================
-- 6. LOTES DE PUBLICACIÓN
-- ============================================================================
CREATE TABLE lotes_publicacion (
  id VARCHAR(50) PRIMARY KEY,
  categoria VARCHAR(100) NOT NULL,
  cantidad_items INTEGER NOT NULL CHECK (cantidad_items > 0),
  peso_total_kg DECIMAL(10,2) NOT NULL CHECK (peso_total_kg > 0),
  co2_total_kg DECIMAL(10,2),
  estado VARCHAR(50) NOT NULL DEFAULT 'Disponible para retiro',
  gestora_asignada_id UUID REFERENCES gestoras(id) ON DELETE SET NULL,
  fecha_publicacion DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_asignacion DATE,
  fecha_retiro DATE,
  fecha_certificado DATE,
  certificado_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lotes_publicacion_estado ON lotes_publicacion(estado);
CREATE INDEX idx_lotes_publicacion_categoria ON lotes_publicacion(categoria);

-- Agregar FK a items
ALTER TABLE items
  ADD CONSTRAINT fk_items_lote_publicado
  FOREIGN KEY (lote_publicado_id)
  REFERENCES lotes_publicacion(id)
  ON DELETE SET NULL;

-- ============================================================================
-- 7. SOLICITUDES DE GESTORAS
-- ============================================================================
CREATE TABLE solicitudes_gestoras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lote_publicacion_id VARCHAR(50) NOT NULL REFERENCES lotes_publicacion(id) ON DELETE CASCADE,
  gestora_id UUID NOT NULL REFERENCES gestoras(id) ON DELETE CASCADE,
  monto_ofrecido DECIMAL(10,2),
  fecha_retiro_propuesta DATE,
  observaciones TEXT,
  estado VARCHAR(50) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Aprobada', 'Rechazada')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lote_publicacion_id, gestora_id)
);

-- ============================================================================
-- 8. CONFIG
-- ============================================================================
CREATE TABLE config (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  descripcion TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO config (key, value, descripcion) VALUES
  ('categorias_raee',
   '["Equipos de Informática", "Pantallas y Monitores", "Baterías", "Audio y Video", "Iluminación", "Cables"]'::jsonb,
   'Categorías válidas de RAEE'),
  ('factor_co2_por_kg',
   '1.4'::jsonb,
   'Factor de CO2 evitado por kg de RAEE');

-- ============================================================================
-- TRIGGERS: Auto-actualizar updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER usuarios_updated_at BEFORE UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER institutos_updated_at BEFORE UPDATE ON institutos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER gestoras_updated_at BEFORE UPDATE ON gestoras
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER lotes_entrada_updated_at BEFORE UPDATE ON lotes_entrada
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER items_updated_at BEFORE UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER lotes_publicacion_updated_at BEFORE UPDATE ON lotes_publicacion
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - Políticas permisivas para MVP
-- ============================================================================

-- Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gestoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE lotes_entrada ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE lotes_publicacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitudes_gestoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura (todos pueden leer)
CREATE POLICY "Enable read for all" ON usuarios FOR SELECT USING (true);
CREATE POLICY "Enable read for all" ON institutos FOR SELECT USING (true);
CREATE POLICY "Enable read for all" ON gestoras FOR SELECT USING (true);
CREATE POLICY "Enable read for all" ON lotes_entrada FOR SELECT USING (true);
CREATE POLICY "Enable read for all" ON items FOR SELECT USING (true);
CREATE POLICY "Enable read for all" ON lotes_publicacion FOR SELECT USING (true);
CREATE POLICY "Enable read for all" ON solicitudes_gestoras FOR SELECT USING (true);
CREATE POLICY "Enable read for all" ON config FOR SELECT USING (true);

-- Políticas de escritura (todos pueden escribir - MVP)
CREATE POLICY "Enable write for all" ON lotes_entrada FOR ALL USING (true);
CREATE POLICY "Enable write for all" ON items FOR ALL USING (true);
CREATE POLICY "Enable write for all" ON lotes_publicacion FOR ALL USING (true);
CREATE POLICY "Enable write for all" ON solicitudes_gestoras FOR ALL USING (true);
CREATE POLICY "Enable write for all" ON usuarios FOR ALL USING (true);
CREATE POLICY "Enable write for all" ON gestoras FOR ALL USING (true);
CREATE POLICY "Enable write for all" ON config FOR ALL USING (true);
