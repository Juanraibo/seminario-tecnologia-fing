# 🏗️ ARQUITECTURA DEL SISTEMA — EcoFIng

> **Documentación técnica completa de la arquitectura**  
> **Última actualización:** 5 de mayo de 2026

---

## 📑 Índice

1. [Visión General](#visión-general)
2. [Diagrama de Arquitectura](#diagrama-de-arquitectura)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Arquitectura de Datos](#arquitectura-de-datos)
5. [Flujo de Estados](#flujo-de-estados)
6. [Integración con Servicios Externos](#integración-con-servicios-externos)
7. [Patrones de Diseño](#patrones-de-diseño)
8. [Escalabilidad](#escalabilidad)

---

## Visión General

EcoFIng es una **Single Page Application (SPA)** construida con React que gestiona el flujo completo de RAEE desde la solicitud inicial hasta el certificado de disposición final.

### Características Arquitectónicas Clave

- **Frontend-first:** Toda la lógica de UI en React
- **State management:** React Context + useReducer
- **Backend as a Service:** Supabase (PostgreSQL + Auth + Storage)
- **IA as a Service:** OpenRouter API (Claude Vision)
- **Deployment:** Vercel + CDN global

---

## Diagrama de Arquitectura

### Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────┐
│                         CAPA DE PRESENTACIÓN                     │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │Instituto │  │ Ecopunto │  │ Gestora  │  │  Admin   │        │
│  │ Portal   │  │  Portal  │  │  Portal  │  │  Portal  │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       │             │             │             │               │
│       └─────────────┴─────────────┴─────────────┘               │
│                            │                                     │
│                   ┌────────▼────────┐                           │
│                   │  React Router   │                           │
│                   └────────┬────────┘                           │
└────────────────────────────┼──────────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────┐
│                      CAPA DE LÓGICA                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │               AppContext (Global State)                  │  │
│  │                                                           │  │
│  │  ┌──────────────┐         ┌──────────────┐              │  │
│  │  │   Reducer    │         │   Actions    │              │  │
│  │  │  (Mutations) │◄────────┤  (Dispatch)  │              │  │
│  │  └──────────────┘         └──────────────┘              │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Services    │  │  Utilities   │  │  Constants   │        │
│  │              │  │              │  │              │        │
│  │ - claudeVisi │  │ - normalize  │  │ - estados.js │        │
│  │ - supabase   │  │ - validators │  │ - config     │        │
│  └──────┬───────┘  └──────────────┘  └──────────────┘        │
└─────────┼──────────────────────────────────────────────────────┘
          │
┌─────────▼─────────────────────────────────────────────────────┐
│                    CAPA DE SERVICIOS EXTERNOS                   │
│                                                                  │
│  ┌───────────────┐  ┌────────────────┐  ┌──────────────┐      │
│  │   Supabase    │  │  OpenRouter    │  │    Vercel    │      │
│  │  (PostgreSQL) │  │  (Claude AI)   │  │   (CDN)      │      │
│  │               │  │                │  │              │      │
│  │ - Auth        │  │ - Vision API   │  │ - Hosting    │      │
│  │ - Database    │  │ - /chat/compl  │  │ - SSL        │      │
│  │ - Storage     │  │                │  │ - Edge Fns   │      │
│  │ - RLS         │  │                │  │              │      │
│  └───────────────┘  └────────────────┘  └──────────────┘      │
└──────────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

```
┌─────────┐
│  USER   │
└────┬────┘
     │
     │ (1) Acción
     ▼
┌─────────────┐
│ Component   │
└────┬────────┘
     │
     │ (2) dispatch()
     ▼
┌─────────────┐
│  AppContext │
│   Reducer   │
└────┬────────┘
     │
     │ (3) Actualiza state
     ▼
┌─────────────┐      (4) API Call (si necesario)
│   Service   ├────────────────┐
└─────────────┘                │
     │                         ▼
     │                  ┌──────────────┐
     │ (5) Response     │   Supabase   │
     │◄─────────────────┤  OpenRouter  │
     │                  └──────────────┘
     │
     │ (6) dispatch update
     ▼
┌─────────────┐
│  Component  │
│  re-render  │
└─────────────┘
```

---

## Stack Tecnológico

### Frontend Core

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **React** | 18.3.1 | Framework de UI |
| **Vite** | 5.4.21 | Build tool + dev server |
| **React Router** | 6.30.3 | Routing SPA |

**Por qué React:**
- Componentes reutilizables
- Virtual DOM para performance
- Ecosistema maduro
- Experiencia del equipo

**Por qué Vite:**
- HMR ultrarrápido (< 100ms)
- Build optimizado con Rollup
- ESM nativo en desarrollo

---

### Estilos

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **TailwindCSS** | 3.4.19 | Utility-first CSS |
| **PostCSS** | 8.5.12 | CSS processing |
| **Autoprefixer** | 10.5.0 | Vendor prefixes |

**Por qué Tailwind:**
- Desarrollo rápido sin escribir CSS
- Diseño consistente con design tokens
- Purge automático de CSS no usado
- Dark mode built-in

---

### Librerías de UI

| Librería | Versión | Uso |
|---------|---------|-----|
| **Recharts** | 2.15.4 | Gráficos de KPIs (Admin) |
| **qrcode.react** | 3.2.0 | Generación de QR codes |
| **lucide-react** | - | Iconos SVG (inline en Icon.jsx) |

---

### Backend as a Service

| Servicio | Propósito |
|---------|-----------|
| **Supabase** | Base de datos PostgreSQL + Auth + Storage + RLS |
| **OpenRouter** | Proxy para APIs de IA (Claude, GPT, etc.) |

---

### Deployment

| Servicio | Propósito |
|---------|-----------|
| **Vercel** | Hosting + CDN + SSL + Edge Functions |
| **GitHub** | Control de versiones + CI/CD |
| **Noah Cloud** | DNS management |

---

## Arquitectura de Datos

### Evolución del Modelo de Datos

**Fase 1 (Sesiones 1-7): Mock Data**
```
app/src/data/
├── lotes.json          ← Todos los lotes en un solo array
├── institutos.json
├── gestoras.json
├── usuarios.json
└── config.json
```

**Problema:** No persiste entre recargas, no escalable.

---

**Fase 2 (Sesión 8): Supabase**
```
Supabase PostgreSQL
├── lotes_entrada       ← Lotes solicitados por institutos
├── lotes_publicacion   ← Lotes clasificados y publicados
├── items               ← Items individuales de un lote (futuro)
├── solicitudes_gestoras ← Cotizaciones de gestoras
├── gestoras
├── institutos
├── usuarios
└── config
```

**Mejora:** Persistencia real, RLS policies, relaciones normalizadas.

---

### Modelo Entidad-Relación

```
┌──────────────┐
│  institutos  │
└──────┬───────┘
       │
       │ 1:N
       ▼
┌──────────────┐
│lotes_entrada │
└──────┬───────┘
       │
       │ 1:1
       ▼
┌──────────────────┐
│lotes_publicacion │
└──────┬───────────┘
       │
       │ 1:N
       ▼
┌────────────────────┐
│solicitudes_gestoras│
└──────┬─────────────┘
       │
       │ N:1
       ▼
┌──────────────┐
│   gestoras   │
└──────────────┘
```

### Esquema de Supabase (PostgreSQL)

#### Tabla: lotes_entrada
```sql
CREATE TABLE lotes_entrada (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instituto_id TEXT NOT NULL REFERENCES institutos(id),
  tamaño TEXT CHECK (tamaño IN ('chico', 'mediano', 'grande')),
  peso_declarado_kg NUMERIC,
  foto_url TEXT,
  observaciones TEXT,
  estado TEXT NOT NULL,
  fecha_solicitud DATE DEFAULT CURRENT_DATE,
  fecha_recepcion_ecopunto DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabla: lotes_publicacion
```sql
CREATE TABLE lotes_publicacion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_entrada_id UUID REFERENCES lotes_entrada(id),
  categoria_final TEXT NOT NULL,
  peso_real_kg NUMERIC NOT NULL,
  clasificado_por_ia BOOLEAN DEFAULT false,
  confianza_ia INTEGER CHECK (confianza_ia BETWEEN 0 AND 100),
  observaciones_clasificacion TEXT,
  fecha_clasificacion DATE,
  fecha_publicacion DATE,
  estado TEXT NOT NULL,
  gestora_asignada_id TEXT REFERENCES gestoras(id),
  fecha_aprobacion_retiro DATE,
  fecha_certificado DATE,
  certificado_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabla: solicitudes_gestoras
```sql
CREATE TABLE solicitudes_gestoras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_publicacion_id UUID REFERENCES lotes_publicacion(id),
  gestora_id TEXT REFERENCES gestoras(id),
  cotizacion_usd NUMERIC,
  observaciones TEXT,
  fecha_solicitud DATE DEFAULT CURRENT_DATE,
  estado TEXT DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabla: gestoras
```sql
CREATE TABLE gestoras (
  id TEXT PRIMARY KEY,
  razon_social TEXT NOT NULL,
  email_contacto TEXT,
  telefono TEXT,
  scoring INTEGER DEFAULT 0 CHECK (scoring BETWEEN 0 AND 100),
  habilitacion_ministerio BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Ver esquema completo:** `docs/DATABASE_SCHEMA.md`

---

### Row Level Security (RLS)

```sql
-- Solo institutos ven sus propios lotes
CREATE POLICY "Institutos ven sus lotes"
ON lotes_entrada FOR SELECT
USING (auth.uid() IN (
  SELECT id FROM usuarios WHERE instituto_id = lotes_entrada.instituto_id
));

-- Solo gestoras habilitadas pueden cotizar
CREATE POLICY "Gestoras habilitadas pueden cotizar"
ON solicitudes_gestoras FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM gestoras 
    WHERE id = gestora_id 
    AND habilitacion_ministerio = true
  )
);
```

---

## Flujo de Estados

### Estados de un Lote

```
┌──────────────────────────┐
│ Pendiente envío Ecopunto │ ← Estado inicial
└────────────┬─────────────┘
             │
             │ Ecopunto marca como recibido
             ▼
┌──────────────────────────┐
│      En Ecopunto         │
└────────────┬─────────────┘
             │
             │ Ecopunto clasifica (IA o manual)
             ▼
┌──────────────────────────┐
│      Clasificado         │
└────────────┬─────────────┘
             │
             │ Ecopunto publica para gestoras
             ▼
┌──────────────────────────┐
│  Disponible para retiro  │
└────────────┬─────────────┘
             │
             │ Gestora(s) envían cotización
             ▼
┌──────────────────────────┐
│ Solicitado por Gestora/s │
└────────────┬─────────────┘
             │
             │ Admin aprueba retiro
             ▼
┌──────────────────────────┐
│ Retiro Aprobado          │
│ Pendiente de Certificado │
└────────────┬─────────────┘
             │
             │ Gestora sube certificado
             ▼
┌──────────────────────────┐
│      Finalizado          │ ← Estado final
└──────────────────────────┘
```

### Constantes de Estado

**Archivo:** `app/src/constants/estados.js`

```javascript
export const ESTADOS_LOTE = {
  PENDIENTE_ENVIO: 'Pendiente envío Ecopunto',
  EN_ECOPUNTO: 'En Ecopunto',
  CLASIFICADO: 'Clasificado',
  DISPONIBLE: 'Disponible para retiro',
  SOLICITADO: 'Solicitado por Gestora/s',
  RETIRO_APROBADO: 'Retiro Aprobado — Pendiente de Certificado',
  FINALIZADO: 'Finalizado'
}

export const COLORES_ESTADO = {
  [ESTADOS_LOTE.PENDIENTE_ENVIO]: 'yellow',
  [ESTADOS_LOTE.EN_ECOPUNTO]: 'blue',
  [ESTADOS_LOTE.CLASIFICADO]: 'purple',
  [ESTADOS_LOTE.DISPONIBLE]: 'green',
  [ESTADOS_LOTE.SOLICITADO]: 'orange',
  [ESTADOS_LOTE.RETIRO_APROBADO]: 'emerald',
  [ESTADOS_LOTE.FINALIZADO]: 'emerald'
}
```

**Regla de oro:** Siempre usar estas constantes, nunca strings hardcoded.

---

## Integración con Servicios Externos

### 1. OpenRouter API (Clasificación con IA)

**Endpoint:** `https://openrouter.ai/api/v1/chat/completions`

**Modelo usado:** `anthropic/claude-sonnet-4-5`

**Flujo:**
```
1. Usuario sube imagen en Ecopunto
2. Convertir imagen a base64
3. Llamar API con prompt + imagen
4. API devuelve:
   {
     categoria: "Equipos informáticos",
     confianza: 85,
     observaciones: "Laptop Dell de aprox. 2015..."
   }
5. Mostrar sugerencia al usuario
6. Usuario acepta o corrige manualmente
```

**Código:** `app/src/services/claudeVision.js`

```javascript
export async function clasificarImagenRAEE(imagenBase64) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-sonnet-4-5',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: PROMPT_CLASIFICACION_RAEE },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imagenBase64}` }}
        ]
      }]
    })
  })
  
  // Parse respuesta y extraer categoría, confianza, observaciones
  return parseRespuestaIA(await response.json())
}
```

**Manejo de errores:**
- Timeout 15 segundos
- Fallback a clasificación manual
- Mostrar mensaje claro al usuario

---

### 2. Supabase

**Cliente:** `@supabase/supabase-js`

**Configuración:** `app/src/services/supabase.js`

```javascript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

**Operaciones típicas:**

```javascript
// SELECT
const { data, error } = await supabase
  .from('lotes_entrada')
  .select('*')
  .eq('instituto_id', 'INCO')

// INSERT
const { data, error } = await supabase
  .from('lotes_entrada')
  .insert([{ instituto_id: 'INCO', tamaño: 'mediano', ... }])

// UPDATE
const { data, error } = await supabase
  .from('lotes_entrada')
  .update({ estado: 'En Ecopunto' })
  .eq('id', loteId)
```

**Normalización de datos:**

Supabase devuelve `snake_case`, frontend usa `camelCase`.

```javascript
// Utilidad en AppContext
const toCamelCase = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
    acc[camelKey] = obj[key]
    return acc
  }, {})
}
```

---

### 3. Vercel (Deployment)

**Build settings:**
```
Build Command:    cd app && npm run build
Output Directory: app/dist
Install Command:  cd app && npm install
```

**Environment Variables:**
```
VITE_OPENROUTER_API_KEY
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

**Rewrites para SPA:** `vercel.json`

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## Patrones de Diseño

### 1. Container/Presentational Pattern

**Container:** Componentes con lógica (dashboard, forms)  
**Presentational:** Componentes reutilizables (StatusBadge, ScoringBadge)

```
app/src/
├── portals/              ← Containers
│   └── instituto/
│       └── Dashboard.jsx  (lógica + estado)
└── components/           ← Presentational
    └── StatusBadge.jsx    (solo UI)
```

---

### 2. Reducer Pattern (Global State)

**Acción → Reducer → Nuevo Estado → Re-render**

```javascript
// AppContext.jsx
const reducer = (state, action) => {
  switch (action.type) {
    case 'AGREGAR_LOTE':
      return {
        ...state,
        lotes: [...state.lotes, action.payload]
      }
    case 'ACTUALIZAR_LOTE':
      return {
        ...state,
        lotes: state.lotes.map(l => 
          l.id === action.payload.id 
            ? { ...l, ...action.payload.cambios } 
            : l
        )
      }
    default:
      return state
  }
}
```

---

### 3. Service Layer

**Separación de responsabilidades:**

```
Component → Service → API Externa
```

**Ejemplo:**
```javascript
// Clasificacion.jsx (Component)
const resultado = await clasificarImagenRAEE(imagenBase64)

// claudeVision.js (Service)
export async function clasificarImagenRAEE(imagenBase64) {
  // Lógica de API call
}
```

**Beneficio:** Si cambia la API, solo se modifica el service.

---

### 4. Higher-Order Components (futuro)

**Posible mejora:** Wrappear rutas con autenticación

```javascript
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { usuario } = useApp()
  return allowedRoles.includes(usuario.rol) ? children : <Navigate to="/login" />
}
```

---

## Escalabilidad

### Limitaciones Actuales (MVP)

1. **Estado en memoria:** Se pierde al recargar (resuelto con Supabase)
2. **Sin paginación:** Listas cargan todos los items
3. **API key en cliente:** Expuesta en requests (OK para demo)
4. **Sin autenticación real:** Login simulado

---

### Path to Production

#### Fase 1: Backend Real
```
Frontend (React) → API REST/GraphQL (Node/Supabase) → PostgreSQL
```

**Cambios necesarios:**
- Mover API calls a backend
- Implementar autenticación JWT
- Rate limiting en APIs

---

#### Fase 2: Optimizaciones
- **Code splitting:** React.lazy() por ruta
- **Lazy loading:** Imágenes con Intersection Observer
- **Paginación:** Infinite scroll o páginas
- **CDN:** Imágenes en Supabase Storage + CDN
- **Caching:** React Query para datos remotos

---

#### Fase 3: Monitoreo
- **Sentry:** Error tracking
- **Google Analytics:** User behavior
- **Vercel Analytics:** Performance metrics
- **Logs:** Structured logging con timestamps

---

#### Fase 4: Testing
- **Unit tests:** Jest + React Testing Library
- **E2E tests:** Playwright
- **CI/CD:** GitHub Actions
- **Lighthouse:** Performance audits

---

## Conclusión

### Fortalezas de la Arquitectura

✅ **Modular:** Componentes y portales bien separados  
✅ **Escalable:** Fácil migrar a backend real  
✅ **Mantenible:** Código organizado y documentado  
✅ **Rápida:** Vite + React + Tailwind = desarrollo veloz

### Trade-offs Asumidos

⚠️ **No hay SSR:** No crítico para app interna  
⚠️ **API key expuesta:** Aceptable para MVP académico  
⚠️ **Sin tests automatizados:** Prioridad fue features

### Aprendizajes Clave

1. **React Context es suficiente** para apps medianas (no siempre se necesita Redux)
2. **TailwindCSS acelera desarrollo** sin sacrificar calidad visual
3. **Supabase es ideal para MVPs** (backend en minutos)
4. **Documentar decisiones (ADRs) es clave** para mantener coherencia

---

**Documentado por:** Juan Raimondo  
**Fecha:** 5 de mayo de 2026  
**Versión:** 1.0

**Referencias:**
- `docs/decisions/ADR-001-stack.md`
- `docs/decisions/ADR-002-arquitectura-datos.md`
- `docs/arquitectura/flujo-estados.md`
- `docs/DATABASE_SCHEMA.md`
