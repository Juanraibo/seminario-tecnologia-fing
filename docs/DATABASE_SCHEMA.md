# Esquema de Base de Datos - EcoFIng MVP

## Tecnología Recomendada: **Supabase**

### ¿Por qué Supabase?

- ✅ PostgreSQL (relacional) - ideal para este modelo de datos
- ✅ Auth integrado con roles y políticas de seguridad (RLS)
- ✅ API REST automática generada desde el schema
- ✅ Cliente JavaScript oficial (`@supabase/supabase-js`)
- ✅ Storage para fotos de lotes/items
- ✅ Realtime subscriptions (opcional para futuro)
- ✅ Plan gratuito: 500MB DB + 1GB Storage + 50K requests/mes
- ✅ Dashboard intuitivo para gestión

### Alternativas consideradas:
- **MongoDB Atlas**: NoSQL, menos apropiado para relaciones complejas
- **Firebase**: Buen auth pero Firestore es más caro y menos flexible
- **PlanetScale**: MySQL, buen pero Supabase incluye más features out-of-the-box

---

## Esquema de Tablas

### 1. `usuarios`

Gestión de usuarios del sistema (Instituto, Ecopunto, Gestora, Admin).

```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL CHECK (rol IN ('admin', 'instituto', 'ecopunto', 'gestora')),
  
  -- Relaciones opcionales según rol
  instituto_id UUID REFERENCES institutos(id) ON DELETE CASCADE,
  gestora_id UUID REFERENCES gestoras(id) ON DELETE CASCADE,
  
  -- Metadata
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_instituto ON usuarios(instituto_id);
CREATE INDEX idx_usuarios_gestora ON usuarios(gestora_id);
```

---

### 2. `institutos`

Institutos de la Facultad de Ingeniería que generan RAEE.

```sql
CREATE TABLE institutos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  sigla VARCHAR(50) NOT NULL UNIQUE,
  direccion TEXT,
  telefono VARCHAR(50),
  email_contacto VARCHAR(255),
  
  -- Metadata
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice
CREATE INDEX idx_institutos_sigla ON institutos(sigla);
```

**Datos iniciales:**
```sql
INSERT INTO institutos (nombre, sigla, email_contacto) VALUES
  ('Instituto de Ingeniería Eléctrica', 'IIE', 'iie@fing.edu.uy'),
  ('Instituto de Computación', 'InCo', 'inco@fing.edu.uy'),
  ('Instituto de Ingeniería Mecánica', 'IIMPI', 'iimpi@fing.edu.uy'),
  ('Instituto de Matemática y Estadística', 'IMERL', 'imerl@fing.edu.uy');
```

---

### 3. `gestoras`

Empresas gestoras de RAEE autorizadas.

```sql
CREATE TABLE gestoras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  rut VARCHAR(50) UNIQUE NOT NULL,
  direccion TEXT,
  telefono VARCHAR(50),
  email_contacto VARCHAR(255),
  
  -- Scoring para asignación
  scoring INTEGER DEFAULT 100 CHECK (scoring >= 0 AND scoring <= 100),
  
  -- Metadata
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_gestoras_rut ON gestoras(rut);
CREATE INDEX idx_gestoras_scoring ON gestoras(scoring DESC);
```

---

### 4. `lotes_entrada`

Lotes generados por institutos y recibidos en Ecopunto.

```sql
CREATE TABLE lotes_entrada (
  id VARCHAR(50) PRIMARY KEY, -- Formato: LOT-2026-001
  instituto_id UUID NOT NULL REFERENCES institutos(id),
  
  -- Datos de la solicitud
  tamano VARCHAR(20) NOT NULL CHECK (tamano IN ('pequeño', 'mediano', 'grande')),
  peso_declarado_aprox_kg DECIMAL(10,2),
  descripcion TEXT,
  
  -- Estados
  estado VARCHAR(50) NOT NULL DEFAULT 'Pendiente envío Ecopunto',
  -- Estados posibles: 
  -- 'Pendiente envío Ecopunto', 'En Ecopunto', 'Clasificado'
  
  -- Fechas
  fecha_solicitud DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_recepcion_ecopunto DATE,
  fecha_clasificacion_completa DATE,
  
  -- Fotos (URLs en Supabase Storage)
  fotos JSONB DEFAULT '[]'::jsonb,
  
  -- Clasificación
  items_clasificados INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_lotes_entrada_instituto ON lotes_entrada(instituto_id);
CREATE INDEX idx_lotes_entrada_estado ON lotes_entrada(estado);
CREATE INDEX idx_lotes_entrada_fecha ON lotes_entrada(fecha_solicitud DESC);
```

---

### 5. `items`

Items individuales clasificados desde lotes de entrada.

```sql
CREATE TABLE items (
  id VARCHAR(50) PRIMARY KEY, -- Formato: ITEM-2026-001
  lote_origen_id VARCHAR(50) NOT NULL REFERENCES lotes_entrada(id) ON DELETE CASCADE,
  instituto_id UUID NOT NULL REFERENCES institutos(id),
  
  -- Clasificación
  categoria VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  peso_kg DECIMAL(10,2) NOT NULL CHECK (peso_kg > 0),
  
  -- CO2 evitado
  co2_kg DECIMAL(10,2),
  co2_source VARCHAR(20) DEFAULT 'estimated' CHECK (co2_source IN ('api', 'estimated')),
  
  -- Foto del item
  foto_url TEXT,
  
  -- IA classification
  clasificado_por_ia BOOLEAN DEFAULT false,
  confianza_ia INTEGER CHECK (confianza_ia >= 0 AND confianza_ia <= 100),
  
  -- Publicación
  lote_publicado_id VARCHAR(50) REFERENCES lotes_publicacion(id) ON DELETE SET NULL,
  
  -- Metadata
  fecha_clasificacion DATE NOT NULL DEFAULT CURRENT_DATE,
  observaciones TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_items_lote_origen ON items(lote_origen_id);
CREATE INDEX idx_items_lote_publicado ON items(lote_publicado_id);
CREATE INDEX idx_items_categoria ON items(categoria);
CREATE INDEX idx_items_instituto ON items(instituto_id);
```

---

### 6. `lotes_publicacion`

Lotes publicados para que gestoras los soliciten.

```sql
CREATE TABLE lotes_publicacion (
  id VARCHAR(50) PRIMARY KEY, -- Formato: PUB-2026-001
  
  -- Agrupación de items
  categoria VARCHAR(100) NOT NULL,
  cantidad_items INTEGER NOT NULL CHECK (cantidad_items > 0),
  peso_total_kg DECIMAL(10,2) NOT NULL CHECK (peso_total_kg > 0),
  
  -- CO2 total evitado
  co2_total_kg DECIMAL(10,2),
  
  -- Estados
  estado VARCHAR(50) NOT NULL DEFAULT 'Disponible para retiro',
  -- Estados posibles:
  -- 'Disponible para retiro', 'Solicitado por Gestora/s', 
  -- 'Retiro Aprobado - Pendiente de Certificado', 'Finalizado'
  
  -- Gestora asignada
  gestora_asignada_id UUID REFERENCES gestoras(id) ON DELETE SET NULL,
  
  -- Fechas
  fecha_publicacion DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_asignacion DATE,
  fecha_retiro DATE,
  fecha_certificado DATE,
  
  -- Certificado
  certificado_url TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_lotes_publicacion_categoria ON lotes_publicacion(categoria);
CREATE INDEX idx_lotes_publicacion_estado ON lotes_publicacion(estado);
CREATE INDEX idx_lotes_publicacion_gestora ON lotes_publicacion(gestora_asignada_id);
CREATE INDEX idx_lotes_publicacion_fecha ON lotes_publicacion(fecha_publicacion DESC);
```

---

### 7. `solicitudes_gestoras`

Solicitudes de gestoras para retirar lotes publicados.

```sql
CREATE TABLE solicitudes_gestoras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lote_publicacion_id VARCHAR(50) NOT NULL REFERENCES lotes_publicacion(id) ON DELETE CASCADE,
  gestora_id UUID NOT NULL REFERENCES gestoras(id) ON DELETE CASCADE,
  
  -- Datos de la solicitud
  monto_ofrecido DECIMAL(10,2),
  fecha_retiro_propuesta DATE,
  observaciones TEXT,
  
  -- Estado
  estado VARCHAR(50) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Aprobada', 'Rechazada')),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraint: una gestora no puede solicitar el mismo lote dos veces
  UNIQUE(lote_publicacion_id, gestora_id)
);

-- Índices
CREATE INDEX idx_solicitudes_lote ON solicitudes_gestoras(lote_publicacion_id);
CREATE INDEX idx_solicitudes_gestora ON solicitudes_gestoras(gestora_id);
CREATE INDEX idx_solicitudes_estado ON solicitudes_gestoras(estado);
```

---

### 8. `config`

Configuración global del sistema.

```sql
CREATE TABLE config (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  descripcion TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Datos iniciales
INSERT INTO config (key, value, descripcion) VALUES
  ('categorias_raee', 
   '["Equipos de Informática", "Pantallas y Monitores", "Baterías", "Audio y Video", "Iluminación", "Cables"]'::jsonb,
   'Categorías válidas de RAEE'),
  
  ('factor_co2_por_kg', 
   '1.4'::jsonb,
   'Factor de CO2 evitado por kg de RAEE (backup si API falla)'),
  
  ('materiales_recuperados_pct', 
   '{"cobre": 0.15, "aluminio": 0.10, "plastico": 0.25, "vidrio": 0.20}'::jsonb,
   'Porcentaje de materiales recuperables por kg de RAEE'),
  
  ('openrouter_api_key', 
   'null'::jsonb,
   'API Key de OpenRouter para clasificación con IA'),
  
  ('climatiq_api_key', 
   'null'::jsonb,
   'API Key de Climatiq para cálculos de CO2');
```

---

## Row Level Security (RLS) Policies

### Habilitar RLS en todas las tablas

```sql
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gestoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE lotes_entrada ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE lotes_publicacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitudes_gestoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;
```

### Policies por rol

#### Admin - acceso total
```sql
CREATE POLICY "Admin acceso total usuarios"
  ON usuarios FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Repetir para todas las tablas...
```

#### Instituto - solo sus datos
```sql
CREATE POLICY "Instituto ver sus lotes"
  ON lotes_entrada FOR SELECT
  USING (instituto_id = (auth.jwt() ->> 'instituto_id')::uuid);

CREATE POLICY "Instituto crear lotes"
  ON lotes_entrada FOR INSERT
  WITH CHECK (instituto_id = (auth.jwt() ->> 'instituto_id')::uuid);
```

#### Ecopunto - acceso a clasificación
```sql
CREATE POLICY "Ecopunto ver todos los lotes entrada"
  ON lotes_entrada FOR SELECT
  USING (auth.jwt() ->> 'role' = 'ecopunto');

CREATE POLICY "Ecopunto actualizar lotes"
  ON lotes_entrada FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'ecopunto');
```

#### Gestora - solo lotes publicados y sus solicitudes
```sql
CREATE POLICY "Gestora ver lotes publicados"
  ON lotes_publicacion FOR SELECT
  USING (auth.jwt() ->> 'role' = 'gestora');

CREATE POLICY "Gestora crear solicitudes"
  ON solicitudes_gestoras FOR INSERT
  WITH CHECK (gestora_id = (auth.jwt() ->> 'gestora_id')::uuid);
```

#### Público - acceso read-only a trazabilidad
```sql
CREATE POLICY "Público ver lotes publicados finalizados"
  ON lotes_publicacion FOR SELECT
  USING (true); -- Todos pueden ver (para trazabilidad)

CREATE POLICY "Público ver items"
  ON items FOR SELECT
  USING (true);
```

---

## Triggers y Funciones

### Auto-actualizar `updated_at`

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a todas las tablas
CREATE TRIGGER usuarios_updated_at BEFORE UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER institutos_updated_at BEFORE UPDATE ON institutos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ... repetir para todas las tablas
```

### Actualizar contador de items en lote_entrada

```sql
CREATE OR REPLACE FUNCTION actualizar_items_clasificados()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE lotes_entrada
  SET items_clasificados = (
    SELECT COUNT(*) FROM items WHERE lote_origen_id = NEW.lote_origen_id
  )
  WHERE id = NEW.lote_origen_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_items_clasificados
AFTER INSERT ON items
FOR EACH ROW EXECUTE FUNCTION actualizar_items_clasificados();
```

---

## Storage Buckets (Supabase)

### 1. `lotes-fotos`
- Fotos de lotes enviadas por institutos
- Público: No
- Max file size: 5MB
- Allowed types: image/jpeg, image/png, image/webp

### 2. `items-fotos`
- Fotos de items clasificados por Ecopunto
- Público: No
- Max file size: 5MB
- Allowed types: image/jpeg, image/png, image/webp

### 3. `certificados`
- Certificados de retiro de gestoras
- Público: Sí (para trazabilidad)
- Max file size: 10MB
- Allowed types: application/pdf, image/jpeg, image/png

---

## Queries Comunes

### Dashboard Instituto
```sql
-- Mis lotes
SELECT * FROM lotes_entrada 
WHERE instituto_id = $usuario_instituto_id
ORDER BY fecha_solicitud DESC;

-- Estadísticas
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE estado = 'Finalizado') as finalizados,
  SUM(peso_declarado_aprox_kg) as peso_total
FROM lotes_entrada
WHERE instituto_id = $usuario_instituto_id;
```

### Dashboard Ecopunto
```sql
-- Lotes pendientes de recepción
SELECT le.*, i.nombre as instituto_nombre
FROM lotes_entrada le
JOIN institutos i ON le.instituto_id = i.id
WHERE le.estado = 'Pendiente envío Ecopunto'
ORDER BY le.fecha_solicitud ASC;

-- Items sin publicar
SELECT * FROM items
WHERE lote_publicado_id IS NULL
ORDER BY fecha_clasificacion DESC;
```

### Dashboard Gestora
```sql
-- Lotes disponibles
SELECT * FROM lotes_publicacion
WHERE estado = 'Disponible para retiro'
ORDER BY fecha_publicacion DESC;

-- Mis solicitudes
SELECT lp.*, sg.monto_ofrecido, sg.estado as solicitud_estado
FROM solicitudes_gestoras sg
JOIN lotes_publicacion lp ON sg.lote_publicacion_id = lp.id
WHERE sg.gestora_id = $usuario_gestora_id
ORDER BY sg.created_at DESC;
```

### Dashboard Admin
```sql
-- Estadísticas globales
SELECT 
  COUNT(DISTINCT le.id) as total_lotes,
  SUM(i.peso_kg) as peso_total,
  SUM(i.co2_kg) as co2_evitado
FROM lotes_entrada le
LEFT JOIN items i ON i.lote_origen_id = le.id;

-- Actividad por instituto
SELECT 
  inst.sigla,
  COUNT(le.id) as lotes,
  SUM(i.peso_kg) as kg_raee
FROM institutos inst
LEFT JOIN lotes_entrada le ON le.instituto_id = inst.id
LEFT JOIN items i ON i.instituto_id = inst.id
GROUP BY inst.id, inst.sigla
ORDER BY kg_raee DESC;
```

---

## Migración desde JSON

Script de migración para cargar los datos actuales de `app/src/data/*.json`:

```js
// scripts/migrate-to-supabase.js
import { createClient } from '@supabase/supabase-js'
import lotesData from '../app/src/data/lotes.json'
import institutosData from '../app/src/data/institutos.json'
// ... otros imports

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function migrate() {
  // 1. Institutos
  const { data: institutos, error: errInstitutos } = await supabase
    .from('institutos')
    .insert(institutosData)
    .select()

  // 2. Gestoras
  // ...

  // 3. Lotes de entrada
  // ...

  console.log('Migración completada')
}

migrate()
```

---

## Next Steps

1. **Crear cuenta en Supabase**: https://supabase.com
2. **Crear nuevo proyecto**: `ecofing-mvp`
3. **Ejecutar schema SQL** desde el SQL Editor de Supabase
4. **Configurar Storage buckets** desde el dashboard
5. **Obtener credenciales**:
   - Project URL
   - Anon/Public Key
6. **Instalar cliente**:
   ```bash
   cd app && npm install @supabase/supabase-js
   ```
7. **Crear servicio** `app/src/services/supabase.js`
8. **Migrar context** de JSON a llamadas Supabase
9. **Testing** en ambiente local primero
10. **Deploy** a Vercel con env vars

¿Querés que avancemos con la integración de Supabase ahora o preferís primero probar el deploy actual en Vercel?
