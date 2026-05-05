# 🎯 GUÍA VISUAL DEL PROYECTO — EcoFIng

> **Documento simple para entender TODO el proyecto en 10 minutos**  
> **Para:** Carmela, Verónica y cualquier persona nueva en el equipo  
> **Última actualización:** 5 de mayo de 2026

---

## 📖 ¿Qué es EcoFIng?

Sistema web para **gestionar RAEE** (Residuos de Aparatos Eléctricos y Electrónicos) en la Facultad de Ingeniería de UdelaR.

### El Problema que Resuelve

❌ **Antes:** Cada instituto acumula equipos rotos sin saber qué hacer  
✅ **Ahora:** Sistema coordina retiro, clasificación y reciclaje con impacto medible

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                         USUARIOS                             │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   Instituto  │   Ecopunto   │    Gestora   │  Administrador │
│  (4 actores) │  (1 actor)   │  (2 actores) │   (1 actor)    │
└──────┬───────┴──────┬───────┴──────┬───────┴────────┬───────┘
       │              │              │                │
       └──────────────┴──────────────┴────────────────┘
                           │
                  ┌────────▼────────┐
                  │   React App     │
                  │  (Frontend SPA) │
                  └────────┬────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
         ┌────▼───┐   ┌───▼────┐  ┌───▼─────┐
         │Context │   │OpenRout│  │Supabase │
         │(Estado)│   │er API  │  │(PostgreS│
         │        │   │(IA)    │  │QL)      │
         └────────┘   └────────┘  └─────────┘
```

### Stack Tecnológico

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| **Frontend** | React 18 + Vite 5 | Rápido desarrollo, HMR ultrarrápido |
| **Estilos** | TailwindCSS 3 | UI consistente sin CSS custom |
| **Routing** | React Router v6 | 5 portales con rutas claras |
| **Estado** | Context + useReducer | Suficiente para esta escala, sin Redux |
| **Gráficos** | Recharts | KPIs del dashboard admin |
| **QR** | qrcode.react | Generación de QR en frontend |
| **IA** | OpenRouter API | Claude Sonnet 4.5 para clasificar imágenes |
| **Base de Datos** | Supabase (PostgreSQL) | Backend as a Service, RLS policies |

---

## 🎭 Los 4 Actores del Sistema

### 1. Instituto (ej: INCO)
**Qué hace:**
- 📦 Solicita retiro de equipos
- 📸 Sube foto del lote
- 🔍 Consulta estado de sus lotes
- 📊 Ve QR de trazabilidad

**Rutas:**
- `/instituto` → Dashboard
- `/instituto/nueva` → Nueva solicitud
- `/instituto/lote/:id` → Detalle

---

### 2. Ecopunto (Operarios)
**Qué hace:**
- ✅ Marca lotes como recibidos
- 🤖 Clasifica con IA (o manual)
- ⚖️ Pesa los lotes
- 📢 Publica lotes para gestoras

**Rutas:**
- `/ecopunto` → Bandeja entrante
- `/ecopunto/clasificar/:id` → Clasificar lote
- `/ecopunto/publicar` → Listos para publicar

**Feature estrella:** 🌟 **Clasificación con IA (Claude Vision)**

---

### 3. Gestora (Empresas Recicladoras)
**Qué hace:**
- 📋 Ve catálogo de lotes disponibles
- 💰 Envía cotizaciones
- 🏆 Compite por scoring
- 📄 Sube certificados de disposición

**Rutas:**
- `/gestora` → Catálogo
- `/gestora/lote/:id` → Detalle de lote
- `/gestora/mis-retiros` → Lotes asignados

**Mecánica de gamificación:**
- Subir certificado a tiempo → +10 pts
- 31-60 días → +5 pts
- \> 60 días → +2 pts

---

### 4. Administrador (FIng)
**Qué hace:**
- 📊 Ve KPIs globales (kg, CO2)
- 👥 Gestiona usuarios y gestoras
- ✅ Aprueba/rechaza retiros
- 📈 Monitorea scoring de gestoras

**Rutas:**
- `/admin` → Dashboard con KPIs
- `/admin/actores` → Gestión de usuarios
- `/admin/aprobaciones` → Aprobar retiros

---

## 🔄 Flujo Completo del Sistema

```
1. INSTITUTO crea lote
   └─> Estado: "Pendiente envío Ecopunto"
        │
        │
2. ECOPUNTO marca como recibido
   └─> Estado: "En Ecopunto"
        │
        │ 🤖 Clasificar con IA
        │ ⚖️ Pesar lote
        │
3. ECOPUNTO clasifica
   └─> Estado: "Clasificado"
        │
        │
4. ECOPUNTO publica
   └─> Estado: "Disponible para retiro"
        │
        │
5. GESTORA(S) envían cotización
   └─> Estado: "Solicitado por Gestora/s"
        │
        │
6. ADMIN aprueba retiro
   └─> Estado: "Retiro Aprobado"
        │
        │
7. GESTORA sube certificado
   └─> Estado: "Finalizado"
        │
        │
8. PÚBLICO ve timeline completo
   └─> Ruta: /trazabilidad?lote=LOT-XXX
```

---

## 📂 Estructura del Código

```
app/
├── src/
│   ├── main.jsx                    ← Entry point
│   ├── App.jsx                     ← Router principal
│   ├── index.css                   ← Tailwind imports
│   │
│   ├── components/                 ← Componentes compartidos
│   │   ├── StatusBadge.jsx         ← Badge de estados
│   │   ├── ScoringBadge.jsx        ← Badge de scoring
│   │   ├── LandingPage.jsx         ← Landing moderna
│   │   └── Icon.jsx                ← Iconos SVG
│   │
│   ├── constants/
│   │   └── estados.js              ← ESTADOS_LOTE (¡usar siempre!)
│   │
│   ├── context/
│   │   └── AppContext.jsx          ← Estado global (useReducer)
│   │
│   ├── data/                       ← Datos mock (DEPRECATED → Supabase)
│   │   ├── lotes.json
│   │   ├── institutos.json
│   │   ├── gestoras.json
│   │   ├── usuarios.json
│   │   └── config.json
│   │
│   ├── services/
│   │   ├── claudeVision.js         ← Clasificación IA (OpenRouter)
│   │   └── supabase.js             ← Cliente Supabase
│   │
│   └── portals/                    ← Los 5 portales
│       ├── auth/
│       │   └── LoginPage.jsx
│       ├── instituto/
│       │   ├── Dashboard.jsx
│       │   ├── NuevaSolicitud.jsx
│       │   └── DetalleLote.jsx
│       ├── ecopunto/
│       │   ├── BandejaEntrante.jsx
│       │   ├── Clasificacion.jsx
│       │   └── ListosParaPublicar.jsx
│       ├── gestora/
│       │   ├── Catalogo.jsx
│       │   ├── DetalleLote.jsx
│       │   └── MisRetiros.jsx
│       ├── admin/
│       │   ├── Dashboard.jsx
│       │   ├── GestionActores.jsx
│       │   └── AprobacionRetiros.jsx
│       └── publico/
│           └── Trazabilidad.jsx
```

---

## 🎨 Paleta de Colores

```css
/* Copiar esto en Tailwind */

Primary (Verde):       #10b981  (emerald-500)
Secondary (Cyan):      #06b6d4  (cyan-500)
Accent (Púrpura):      #a855f7  (purple-500)

Dark Background:       #030712  (gray-950)
Card Background:       #111827  (gray-900)
Border:                #1f2937  (gray-800)

Text Light:            #f9fafb  (gray-50)
Text Secondary:        #9ca3af  (gray-400)
```

**Estados de Lote (colores):**
- Pendiente → Amarillo
- En Ecopunto → Azul
- Clasificado → Púrpura
- Disponible → Verde
- Solicitado → Naranja
- Aprobado → Verde oscuro
- Finalizado → Esmeralda

---

## 🗄️ Modelo de Datos (Supabase)

### Tabla: lotes_entrada
```sql
id                    UUID PRIMARY KEY
instituto_id          TEXT
tamaño                TEXT (chico/mediano/grande)
peso_declarado_kg     NUMERIC
foto_url              TEXT (base64 o Supabase Storage)
observaciones         TEXT
estado                TEXT
fecha_solicitud       DATE
fecha_recepcion       DATE
fecha_clasificacion   DATE
```

### Tabla: lotes_publicacion
```sql
id                    UUID PRIMARY KEY
lote_entrada_id       UUID (FK)
categoria_final       TEXT
peso_real_kg          NUMERIC
clasificado_por_ia    BOOLEAN
confianza_ia          INTEGER (0-100)
fecha_publicacion     DATE
estado                TEXT
```

### Tabla: solicitudes_gestoras
```sql
id                    UUID PRIMARY KEY
lote_publicacion_id   UUID (FK)
gestora_id            TEXT
cotizacion_usd        NUMERIC
fecha_solicitud       DATE
estado                TEXT (pendiente/aprobada/rechazada)
```

### Tabla: gestoras
```sql
id                    TEXT PRIMARY KEY
razon_social          TEXT
scoring               INTEGER (0-100)
habilitacion_ministerio BOOLEAN
email_contacto        TEXT
```

---

## 🚀 Decisiones Técnicas Importantes

### 1. ¿Por qué NO usar Next.js?
✅ **Decisión:** React + Vite  
**Razón:** MVP sin necesidad de SSR, Vite más rápido para desarrollo

**ADR:** `docs/decisions/ADR-001-stack.md`

---

### 2. ¿Por qué datos mock primero y luego Supabase?
✅ **Decisión:** Empezar con JSON, migrar después  
**Razón:** Probar flujos sin configurar backend, luego escalar

**ADR:** `docs/decisions/ADR-002-arquitectura-datos.md`

---

### 3. ¿Por qué OpenRouter y no API de Anthropic directamente?
✅ **Decisión:** OpenRouter como proxy  
**Razón:** 
- Una sola API key para múltiples modelos
- Flexibilidad de cambiar modelo sin cambiar código
- Créditos de prueba más accesibles

**Archivo:** `docs/MODELOS-IA-DISPONIBLES.md`

---

### 4. ¿Por qué React Context y no Redux?
✅ **Decisión:** Context + useReducer  
**Razón:** Escala suficiente para MVP, menos boilerplate

---

### 5. ¿Por qué TailwindCSS?
✅ **Decisión:** Tailwind vs. CSS Modules  
**Razón:** Velocidad de desarrollo, consistencia sin esfuerzo

---

## 📅 Timeline del Proyecto

```
Abril 21 ─────────────────────────────────────────── Mayo 26
│                                                          │
├─ Sesión 1-2: Planificación y User Stories
├─ Sesión 3: Setup inicial (React + Vite)
├─ Sesión 4: Sprint 1 → Portal Instituto ✅
├─ Sesión 5: Sprint 2 → Ecopunto + Gestora ✅
├─ Sesión 6: Sprint 3 → IA + Admin + Vista Pública ✅
├─ Sesión 7: Deployment Vercel ✅
├─ Sesión 8: Migración Supabase ✅
├─ Sesión 9: Testing E2E + Bugfixes ✅
├─ Sesión 10: Pulido final + Landing ✅
└─ Mayo 26: 🎯 PRESENTACIÓN FINAL
```

**Estado actual:** MVP 100% completo (13/13 HUs)

---

## ✅ Historias de Usuario Implementadas

### Portal Instituto (3 HUs)
- ✅ HU-I01: Dashboard de lotes
- ✅ HU-I02: Nueva solicitud de retiro
- ✅ HU-I03: Detalle de lote + QR

### Portal Ecopunto (3 HUs)
- ✅ HU-E01: Bandeja entrante
- ✅ HU-E02: Clasificación con IA 🌟
- ✅ HU-E03: Publicar lotes

### Portal Gestora (3 HUs)
- ✅ HU-G01: Catálogo de lotes
- ✅ HU-G02: Enviar cotización
- ✅ HU-G03: Mis retiros + scoring

### Portal Admin (3 HUs)
- ✅ HU-A01: Dashboard con KPIs
- ✅ HU-A02: Gestión de actores
- ✅ HU-A03: Aprobación de retiros

### Vista Pública (1 HU)
- ✅ HU-P01: Trazabilidad por QR

**TOTAL: 13/13 HUs ✅**

---

## 🔑 Usuarios de Prueba

| Rol | Email | Password | Qué puede hacer |
|-----|-------|----------|-----------------|
| Instituto | `inco@fing.edu.uy` | `inco123` | Ver lotes de INCO, crear nuevos |
| Ecopunto | `ecopunto@fing.edu.uy` | `eco123` | Recibir, clasificar, publicar |
| Gestora | `gestora1@reciclauY.com` | `gest123` | Ver catálogo, cotizar, subir certificados |
| Admin | `admin@fing.edu.uy` | `admin123` | Ver todo, aprobar retiros, gestionar actores |

---

## 🌐 Deployment

**URL producción:** https://seminario.noah.uy

**Hosting:** Vercel  
**DNS:** Noah Cloud  
**SSL:** Let's Encrypt (automático por Vercel)

**Variables de entorno necesarias:**
```bash
VITE_OPENROUTER_API_KEY=sk-or-v1-...
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

**Guía completa:** `docs/DEPLOYMENT.md`

---

## 🐛 Principales Bugs Resueltos

### Bug 1: Estado no se actualizaba
**Problema:** Al clasificar un lote, seguía en "Bandeja Entrante"  
**Causa:** Mutación directa del array en reducer  
**Fix:** Retornar nuevo array con spread operator  
**Sesión:** 9

---

### Bug 2: API Key expuesta en Git
**Problema:** `.env.local` casi se commitea  
**Causa:** No estaba en `.gitignore`  
**Fix:** Agregar a gitignore + crear `.env.example`  
**Sesión:** 10

---

### Bug 3: Supabase devuelve snake_case
**Problema:** Frontend usa camelCase, backend snake_case  
**Causa:** Convención diferente  
**Fix:** Normalizar datos en AppContext al cargar  
**Sesión:** 8

**Documentos:** `docs/BUGFIXES-SESION-9.md`, `docs/BUGFIXES-SESION-10.md`

---

## 📚 Documentación Clave para Leer

### Para entender el proyecto
1. **README.md** (raíz) — Descripción general
2. **Este documento** — Visión completa
3. **docs/user-stories/** — Qué hace cada portal

### Para desarrollar
1. **CLAUDE.md** (raíz) — Instrucciones para IA
2. **docs/guia-desarrollo.md** — Convenciones de código
3. **docs/arquitectura/flujo-estados.md** — Estados de lotes

### Para deployment
1. **docs/DEPLOYMENT.md** — Guía Vercel
2. **docs/SECURITY.md** — Buenas prácticas

### Para docentes
1. **docs/PROMPTS-MASTER.md** — TODOS los prompts usados
2. **docs/decisions/** — ADRs (decisiones arquitectónicas)
3. **CHANGELOG.md** — Bitácora de 10 sesiones

---

## 💡 Conceptos Clave para Entender

### 1. Estados del Lote (CRÍTICO)
**Siempre usar** `constants/estados.js`, nunca hardcodear strings.

```javascript
// ✅ BIEN
import { ESTADOS_LOTE } from '@/constants/estados'
if (lote.estado === ESTADOS_LOTE.CLASIFICADO) { ... }

// ❌ MAL
if (lote.estado === "Clasificado") { ... }
```

---

### 2. Dispatch en Context
**Siempre usar dispatch**, nunca mutar estado directamente.

```javascript
// ✅ BIEN
dispatch({ 
  type: 'ACTUALIZAR_LOTE', 
  payload: { id, cambios: { estado: ESTADOS_LOTE.EN_ECOPUNTO } }
})

// ❌ MAL
lote.estado = ESTADOS_LOTE.EN_ECOPUNTO
```

---

### 3. Normalización snake_case ↔ camelCase
Supabase devuelve `peso_real_kg`, frontend usa `pesoRealKg`.

**Solución:** Normalizar en AppContext al cargar datos.

```javascript
// Función helper
const toCamelCase = (obj) => { ... }
const toSnakeCase = (obj) => { ... }
```

---

### 4. Clasificación con IA
**Flujo:**
1. Usuario sube imagen
2. Convertir a base64
3. Llamar `clasificarImagenRAEE(base64)`
4. Mostrar sugerencia + confianza
5. Usuario acepta o corrige
6. Guardar con `clasificado_por_ia: true`

**Fallback:** Si API falla → clasificación manual

---

## 🎯 Próximos Pasos (Post-MVP)

### Features Deseables
- [ ] Notificaciones push por rol
- [ ] Exportar datos a CSV/PDF
- [ ] Búsqueda avanzada de lotes
- [ ] Modo claro/oscuro toggle
- [ ] Integración Climatiq API (CO2 real)

### Mejoras Técnicas
- [ ] Tests unitarios (Jest + React Testing Library)
- [ ] Tests E2E automatizados (Playwright)
- [ ] CI/CD con GitHub Actions
- [ ] Monitoreo con Sentry
- [ ] Analytics con Google Analytics

### Escalabilidad
- [ ] Backend real (Node + Express o Supabase Edge Functions)
- [ ] Autenticación real (Supabase Auth)
- [ ] File uploads a Supabase Storage
- [ ] Rate limiting en API de IA
- [ ] CDN para imágenes

---

## 📞 Contacto

**Equipo:**
- Carmela González
- Verónica Iriarte
- Juan Raimondo (juanraibo@gmail.com)

**Repo GitHub:** (agregar link cuando esté público)  
**Presentación:** 26 de mayo de 2026

---

## 🎓 Para la Presentación Final

### Qué Destacar
1. 🤖 **IA para Clasificación** — Claude Vision analiza imágenes
2. 🌍 **Impacto Medible** — KPIs de kg y CO2 evitado
3. 🔗 **Trazabilidad Pública** — QR sin login
4. 🏆 **Gamificación** — Scoring de gestoras

### Demo Script Sugerido
1. Login como Instituto → crear lote
2. Login como Ecopunto → clasificar con IA
3. Login como Gestora → cotizar
4. Login como Admin → aprobar retiro
5. Escanear QR → ver timeline público

**Tiempo estimado:** 5-7 minutos

---

**Documento creado por:** Juan Raimondo  
**Fecha:** 5 de mayo de 2026  
**Versión:** 1.0
