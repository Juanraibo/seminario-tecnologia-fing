# 🎯 DECISIONES TÉCNICAS — EcoFIng

> **Consolidación de todas las decisiones arquitectónicas y técnicas del proyecto**  
> **Última actualización:** 5 de mayo de 2026

---

## 📋 Índice de Decisiones

1. [Stack Tecnológico](#1-stack-tecnológico)
2. [Arquitectura de Datos](#2-arquitectura-de-datos)
3. [Gestión de Estado](#3-gestión-de-estado)
4. [Integración con IA](#4-integración-con-ia)
5. [Deployment y Hosting](#5-deployment-y-hosting)
6. [Seguridad](#6-seguridad)
7. [UX y Diseño](#7-ux-y-diseño)
8. [Decisiones de Implementación](#8-decisiones-de-implementación)

---

## 1. Stack Tecnológico

### DECISIÓN: React + Vite + TailwindCSS

**Fecha:** 21 de abril de 2026  
**Estado:** ✅ Implementado  
**ADR:** `docs/decisions/ADR-001-stack.md`

#### Contexto
Necesitábamos elegir stack para MVP funcional en 4 semanas, considerando:
- Equipo con experiencia variada
- 5 portales con roles diferenciados
- Integración con API de IA
- Presentación final el 26 de mayo

#### Opciones Consideradas

| Opción | Pros | Contras | Decisión |
|--------|------|---------|----------|
| **React + Vite** | Setup rápido, HMR ultrarrápido, ecosistema maduro | Sin SSR | ✅ **ELEGIDA** |
| Next.js | SSR, API routes | Overhead de config, curva de aprendizaje | ❌ Rechazada |
| HTML/CSS/JS vanilla | Sin dependencias | Sin componentes, inmantenible | ❌ Rechazada |

#### Justificación

**Por qué React:**
- ✅ Componentes reutilizables → menos código duplicado
- ✅ Virtual DOM → performance automática
- ✅ Ecosistema robusto (Recharts, QR, etc.)
- ✅ Experiencia del equipo

**Por qué Vite sobre Create React App:**
- ✅ HMR en < 100ms (vs. segundos en CRA)
- ✅ Build con Rollup → bundle optimizado
- ✅ ESM nativo en desarrollo
- ✅ Configuración mínima

**Por qué TailwindCSS:**
- ✅ Velocidad de desarrollo (no escribir CSS custom)
- ✅ Diseño consistente con design tokens
- ✅ Purge automático de CSS no usado
- ✅ Dark mode built-in

#### Consecuencias

**Positivas:**
- ✅ Desarrollo rápido (MVP en 6 sesiones)
- ✅ UI consistente sin esfuerzo
- ✅ Fácil onboarding del equipo

**Negativas:**
- ⚠️ Sin SSR (no crítico para app interna)
- ⚠️ API key expuesta en cliente (mitigado con warnings)

---

## 2. Arquitectura de Datos

### DECISIÓN: JSON Mock → Supabase PostgreSQL

**Fecha:** 21 de abril (mock) → 4 de mayo (Supabase)  
**Estado:** ✅ Implementado  
**ADR:** `docs/decisions/ADR-002-arquitectura-datos.md`

#### Fase 1: JSON Mock (Sesiones 3-7)

**Decisión:** Datos en archivos JSON + React Context

**Razones:**
- ✅ Setup instantáneo (sin configurar backend)
- ✅ Demostrar flujos sin dependencias externas
- ✅ Iterar rápido en UI

**Consecuencias:**
- ⚠️ Datos no persisten al recargar
- ⚠️ No escalable a producción
- ✅ Estructura JSON mapeaba directamente a DB relacional

**Archivos:**
```
app/src/data/
├── lotes.json          ← 6 lotes en distintos estados
├── institutos.json     ← 4 institutos (INCO, IIE, IIMPI, IMFIA)
├── gestoras.json       ← 2 gestoras con scoring
├── usuarios.json       ← 4 usuarios de prueba
└── config.json         ← Configuración (categorías, tamaños, etc.)
```

---

#### Fase 2: Supabase (Sesión 8+)

**Decisión:** Migrar a Supabase (PostgreSQL + Auth + Storage)

**Por qué Supabase:**
- ✅ Backend as a Service → sin escribir API REST
- ✅ PostgreSQL real → queries SQL, relaciones, constraints
- ✅ Row Level Security (RLS) → seguridad por rol
- ✅ Real-time subscriptions (futuro)
- ✅ Storage para imágenes
- ✅ Free tier generoso (500MB DB, 1GB storage)

**Alternativas consideradas:**
- Firebase: No SQL (menos familiar para el equipo)
- Backend custom (Node + Express): Más tiempo de desarrollo

**Migración:**
```
JSON mock → Schema SQL → Seed data → Normalización camelCase/snake_case
```

**Modelo de 3 capas:**
1. **lotes_entrada**: Solicitudes de institutos
2. **lotes_publicacion**: Lotes clasificados y publicados
3. **solicitudes_gestoras**: Cotizaciones de gestoras

**Ver esquema completo:** `docs/DATABASE_SCHEMA.md`

#### Consecuencias

**Positivas:**
- ✅ Persistencia real
- ✅ Queries eficientes
- ✅ Escalabilidad probada
- ✅ Seguridad con RLS

**Negativas:**
- ⚠️ Complejidad adicional (normalización de datos)
- ⚠️ Dependencia de servicio externo

---

## 3. Gestión de Estado

### DECISIÓN: React Context + useReducer (sin Redux)

**Fecha:** 21 de abril de 2026  
**Estado:** ✅ Implementado

#### Contexto
Necesitábamos estado global accesible desde los 5 portales.

#### Opciones

| Opción | Pros | Contras | Decisión |
|--------|------|---------|----------|
| **Context + useReducer** | Simple, sin dependencias, suficiente para esta escala | No hay DevTools nativos | ✅ **ELEGIDA** |
| Redux Toolkit | DevTools, middleware | Boilerplate, overkill para MVP | ❌ Rechazada |
| Zustand | Minimalista | Otra dependencia | ❌ Rechazada |

#### Justificación

**Escala del proyecto:**
- 5 portales
- ~25 componentes
- ~10 acciones (AGREGAR_LOTE, ACTUALIZAR_LOTE, etc.)

**Redux es overkill cuando:**
- No hay middleware complejo
- No se necesita time-travel debugging
- El estado cabe en un objeto

**Context + Reducer es suficiente cuando:**
- ✅ Estado predecible (reducer pattern)
- ✅ Acciones bien definidas
- ✅ Un solo contexto global

#### Implementación

**Archivo:** `app/src/context/AppContext.jsx`

```javascript
const AppContext = createContext()

const reducer = (state, action) => {
  switch (action.type) {
    case 'AGREGAR_LOTE': ...
    case 'ACTUALIZAR_LOTE': ...
    case 'ACTUALIZAR_SCORING_GESTORA': ...
    default: return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
```

#### Consecuencias

**Positivas:**
- ✅ Código simple y mantenible
- ✅ Sin dependencias extra
- ✅ Performance adecuada (sin re-renders innecesarios)

**Negativas:**
- ⚠️ No hay DevTools (mitigado con console.log en reducer)

---

## 4. Integración con IA

### DECISIÓN: OpenRouter API (Claude Vision)

**Fecha:** 27 de abril de 2026  
**Estado:** ✅ Implementado  
**HU:** HU-E02 (Clasificación con IA)

#### Contexto
Necesitábamos clasificar imágenes de RAEE automáticamente.

#### Opciones

| Opción | Pros | Contras | Decisión |
|--------|------|---------|----------|
| **OpenRouter** | Una API key, múltiples modelos, flexible | Proxy (latencia extra mínima) | ✅ **ELEGIDA** |
| Anthropic API directa | Sin proxy | Solo Claude, cambiar modelo = cambiar código | ❌ Rechazada |
| OpenAI Vision | GPT-4 Vision | Más caro, menos preciso para clasificación | ❌ Rechazada |

#### Por qué OpenRouter

**Ventajas clave:**
1. **Flexibilidad de modelo:**
   ```javascript
   // Cambiar modelo es un string
   model: 'anthropic/claude-sonnet-4-5'  // ← cambiar aquí
   model: 'openai/gpt-4-vision-preview'
   model: 'google/gemini-pro-vision'
   ```

2. **Una sola API key:** Acceso a 20+ modelos sin múltiples cuentas

3. **Formato estándar:** Compatible con OpenAI (ampliamente documentado)

4. **Créditos de prueba:** $10 USD gratis para testing

#### Implementación

**Modelo elegido:** `anthropic/claude-sonnet-4-5`

**Por qué Claude sobre GPT:**
- ✅ Mejor para clasificación técnica
- ✅ Más barato ($3 vs $10 por 1M tokens)
- ✅ Respuestas más estructuradas

**Prompt Engineering:**
```javascript
const PROMPT_CLASIFICACION_RAEE = `
Sos un experto en clasificación de RAEE...

Categorías válidas:
- Equipos informáticos
- Pantallas y monitores
- Baterías y acumuladores
- ...

Devolvé JSON:
{
  "categoria": "...",
  "confianza": 0-100,
  "observaciones": "..."
}
`
```

**Flujo:**
```
1. Usuario sube imagen
2. Convertir a base64
3. Llamar OpenRouter API
4. Parse JSON de respuesta
5. Mostrar sugerencia + confianza
6. Usuario acepta o corrige
```

**Manejo de errores:**
- Timeout 15 segundos
- Fallback a clasificación manual
- Mensaje claro al usuario

#### Consecuencias

**Positivas:**
- ✅ Clasificación precisa (~85% confianza promedio)
- ✅ UX diferenciadora (feature estrella)
- ✅ Ahorro de tiempo del operario

**Negativas:**
- ⚠️ API key expuesta en cliente (OK para demo)
- ⚠️ Costo por request (mitigado con free tier)
- ⚠️ Dependencia de servicio externo

**Mitigación futura:**
- Backend proxy para esconder API key
- Rate limiting por usuario
- Cache de clasificaciones comunes

---

## 5. Deployment y Hosting

### DECISIÓN: Vercel + Dominio Personalizado

**Fecha:** 27 de abril de 2026  
**Estado:** ✅ Deployado en https://seminario.noah.uy

#### Contexto
Necesitábamos deployment público para presentación.

#### Opciones

| Opción | Pros | Contras | Decisión |
|--------|------|---------|----------|
| **Vercel** | Deploy automático, CDN global, SSL gratis | Límites en free tier | ✅ **ELEGIDA** |
| Netlify | Similar a Vercel | Menos popular para React | ❌ Rechazada |
| GitHub Pages | Gratis, simple | Sin rewrites (problema para SPA) | ❌ Rechazada |
| VPS (DigitalOcean) | Control total | Configurar nginx, SSL, etc. | ❌ Rechazada |

#### Por qué Vercel

**Ventajas clave:**
1. ✅ **Deploy automático:** Push a GitHub → deploy automático
2. ✅ **CDN global:** Edge locations en todo el mundo
3. ✅ **SSL automático:** Let's Encrypt sin configuración
4. ✅ **Rewrites para SPA:** Soporte nativo para React Router
5. ✅ **Preview deployments:** Cada PR tiene su URL
6. ✅ **Environment variables:** Secrets seguros

#### Configuración

**Build Settings:**
```
Root Directory:    app/
Build Command:     npm run build
Output Directory:  dist
Install Command:   npm install
```

**Rewrites (vercel.json):**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Variables de Entorno:**
```
VITE_OPENROUTER_API_KEY=sk-or-v1-...
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

#### DNS Personalizado

**Dominio:** seminario.noah.uy  
**Proveedor DNS:** Noah Cloud

**Configuración:**
```
Type:  CNAME
Name:  seminario
Value: cname.vercel-dns.com
```

**SSL:** Automático (Let's Encrypt)  
**TTL:** 3600 segundos

#### Consecuencias

**Positivas:**
- ✅ App accesible públicamente
- ✅ HTTPS by default
- ✅ Deploy en < 2 minutos
- ✅ Rollback fácil

**Negativas:**
- ⚠️ Límites en free tier (100GB bandwidth)
- ⚠️ Dependencia de Vercel

**Ver guía completa:** `docs/DEPLOYMENT.md`

---

## 6. Seguridad

### DECISIÓN: Múltiples Capas de Seguridad

**Fecha:** 28 de abril de 2026  
**Estado:** ✅ Implementado

#### Problemas Identificados

1. **API keys expuestas en cliente**
2. **Autenticación simulada (no real)**
3. **Sin sanitización de inputs**
4. **RLS en Supabase (configurado)**

#### Medidas Implementadas

**1. Protección de API Keys**

**Problema:** `.env.local` casi se commitea a Git

**Solución:**
```
✅ .env.local en .gitignore
✅ .env.example como template
✅ Documentar en SECURITY.md
✅ Usar secrets de Vercel en producción
```

**Archivo:** `docs/PREVENCION-API-KEYS.md`

---

**2. Row Level Security (RLS) en Supabase**

**Problema:** Sin RLS, cualquier usuario ve todos los datos

**Solución:**
```sql
-- Solo institutos ven sus lotes
CREATE POLICY "Institutos ven sus lotes"
ON lotes_entrada FOR SELECT
USING (auth.uid() IN (
  SELECT id FROM usuarios WHERE instituto_id = lotes_entrada.instituto_id
));
```

**Políticas implementadas:**
- Institutos ven solo sus lotes
- Gestoras habilitadas pueden cotizar
- Solo admin aprueba retiros

---

**3. Validación de Inputs**

**Problema:** Posible XSS en textarea

**Solución:**
- ✅ React escapa automáticamente
- ✅ Validación de tipos (peso > 0, categoría válida)
- ⚠️ Sanitización adicional con DOMPurify (futuro)

---

**4. HTTPS Forzado**

**Problema:** Datos sensibles en HTTP

**Solución:**
- ✅ Vercel fuerza HTTPS automáticamente
- ✅ Redirect HTTP → HTTPS

---

#### Consecuencias

**Positivas:**
- ✅ MVP seguro para demo
- ✅ Buenas prácticas documentadas

**Negativas:**
- ⚠️ API key sigue en cliente (mitigar con backend proxy)
- ⚠️ Autenticación simulada (no JWT real)

**Ver auditoría completa:** `docs/SECURITY.md`

---

## 7. UX y Diseño

### DECISIÓN: Dark Mode + Emerald Green

**Fecha:** Progresivo (sesiones 4-10)  
**Estado:** ✅ Implementado

#### Paleta de Colores

**Decisión:** Emerald green como primary

**Razones:**
- ✅ Asociación con ecología y sostenibilidad
- ✅ Contraste alto en dark mode
- ✅ Diferenciador visual (no el típico azul)

**Colores:**
```css
Primary:   #10b981 (emerald-500)
Secondary: #06b6d4 (cyan-500)
Accent:    #a855f7 (purple-500)
```

---

### DECISIÓN: Mobile-First Responsive

**Por qué:**
- ✅ Vista pública (QR) se ve en móviles
- ✅ TailwindCSS facilita breakpoints

**Implementación:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
</div>
```

---

### DECISIÓN: StatusBadge y ScoringBadge

**Problema:** Inconsistencia en mostrar estados

**Solución:** Componentes reutilizables

```jsx
<StatusBadge estado={lote.estado} />
<ScoringBadge scoring={gestora.scoring} />
```

**Beneficio:** Cambiar estilo una vez → se aplica en todo el sistema

---

## 8. Decisiones de Implementación

### DECISIÓN: Constantes de Estado Centralizadas

**Archivo:** `app/src/constants/estados.js`

**Problema:** Strings hardcoded → errores de typo

**Solución:**
```javascript
export const ESTADOS_LOTE = {
  PENDIENTE_ENVIO: 'Pendiente envío Ecopunto',
  EN_ECOPUNTO: 'En Ecopunto',
  // ...
}
```

**Uso:**
```javascript
// ✅ BIEN
if (lote.estado === ESTADOS_LOTE.CLASIFICADO) { ... }

// ❌ MAL
if (lote.estado === "Clasificado") { ... }  // typo → bug silencioso
```

---

### DECISIÓN: Un Componente por Archivo

**Convención:**
```
Dashboard.jsx       ← export default Dashboard
StatusBadge.jsx     ← export default StatusBadge
```

**Beneficios:**
- ✅ Fácil encontrar componentes
- ✅ Imports claros
- ✅ Hot reload más rápido

---

### DECISIÓN: Rutas Semánticas

**Estructura:**
```
/instituto
/instituto/nueva
/instituto/lote/:id

/ecopunto
/ecopunto/clasificar/:id
/ecopunto/publicar

/gestora
/gestora/lote/:id
/gestora/mis-retiros

/admin
/admin/actores
/admin/aprobaciones

/trazabilidad?lote=LOT-XXX
```

**Por qué:** URLs intuitivas y RESTful

---

### DECISIÓN: Normalización de Datos (snake_case ↔ camelCase)

**Problema:** Supabase devuelve `peso_real_kg`, frontend usa `pesoRealKg`

**Solución:** Normalizar al cargar datos

```javascript
const toCamelCase = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
    acc[camelKey] = obj[key]
    return acc
  }, {})
}
```

**Dónde:** En `AppContext.jsx` al inicializar estado

---

## Resumen de Decisiones

### ✅ Decisiones Correctas

1. **React + Vite:** Desarrollo rápido, HMR excelente
2. **TailwindCSS:** UI consistente sin esfuerzo
3. **Context (no Redux):** Suficiente para esta escala
4. **OpenRouter:** Flexibilidad de modelos
5. **Supabase:** Backend en minutos
6. **Vercel:** Deploy trivial

### ⚠️ Trade-offs Asumidos

1. **API key en cliente:** OK para demo, NO para producción
2. **Auth simulada:** Suficiente para MVP
3. **Sin tests automatizados:** Prioridad fue features

### 🔮 Mejoras Futuras

1. **Backend proxy:** Esconder API key
2. **Auth real:** JWT con Supabase Auth
3. **Tests E2E:** Playwright
4. **Monitoring:** Sentry + Google Analytics

---

## Aprendizajes Clave

### Lo que Funcionó

1. ✅ **Documentar decisiones temprano** (ADRs desde sesión 3)
2. ✅ **Iterar rápido con mock data** (validar UX antes de DB)
3. ✅ **Prompts estructurados** (Claude Code siguió instrucciones)
4. ✅ **Convenciones claras** (estados, rutas, nombres)

### Lo que Mejoraría

1. ⚠️ **Tests desde el inicio** (retrofit tests es más difícil)
2. ⚠️ **TypeScript:** Evita bugs de typos
3. ⚠️ **Storybook:** Documentar componentes visuales

---

## Referencias

### ADRs Formales
- `docs/decisions/ADR-001-stack.md`
- `docs/decisions/ADR-002-arquitectura-datos.md`

### Documentación Complementaria
- `docs/ARQUITECTURA.md`
- `docs/SECURITY.md`
- `docs/DEPLOYMENT.md`
- `docs/DATABASE_SCHEMA.md`
- `docs/MODELOS-IA-DISPONIBLES.md`

---

**Documentado por:** Juan Raimondo  
**Fecha:** 5 de mayo de 2026  
**Versión:** 1.0
