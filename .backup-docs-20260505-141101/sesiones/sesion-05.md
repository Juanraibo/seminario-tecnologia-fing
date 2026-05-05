# Sesión 5 — 27 de abril de 2026

## Contexto

Primera sesión de **desarrollo intensivo** después de la preparación de infraestructura en Sesión 4. El proyecto tiene toda la base técnica lista y es momento de implementar funcionalidades reales.

**Estado del repositorio al inicio:**
- Branch: `main`
- Último commit: `4d6e8e6` — "docs: sistema completo de documentación y limpieza de estructura"
- Servidor de desarrollo: Funcionando en puerto 5173
- Infraestructura: Context API, Router, JSON mock, constantes de estados — ✅ Operativos

**Stack confirmado:**
- React 18.3.1 + Vite 5.3.1
- TailwindCSS 3.4.4
- React Router v6.23.1
- Recharts 2.12.7 + qrcode.react 3.1.0

---

## Objetivo de la sesión

**Meta principal:** Implementar Sprint 1 completo — Portal Instituto funcional con sistema de diseño atómico profesional.

**Requisitos del usuario:**
1. Diseño moderno y atractivo visualmente
2. Paleta "Tech Sostenible" con énfasis en dark mode
3. Iconografía profesional (NO emojis)
4. Estilo minimalista y sutil
5. Sistema de semáforo para estados de lotes
6. Timeline visual de progreso
7. Diseño atómico (Atomic Design)
8. Amigable y accesible

---

## Actividades realizadas

### 1. Instalación de dependencias

**Lucide React** para iconografía profesional:
```bash
npm install lucide-react
```

**Razón:** Biblioteca moderna de iconos vectoriales, tree-shakeable, con 1000+ iconos profesionales.

---

### 2. Configuración de Tailwind CSS — Paleta Tech Sostenible

**Archivo modificado:** `app/tailwind.config.js`

**Cambios implementados:**
- ✅ Dark mode habilitado con estrategia `class`
- ✅ Paleta personalizada con 4 colores principales (10 tonos cada uno):
  - `primary` — Verde esmeralda (#10b981)
  - `secondary` — Azul eléctrico/cyan (#06b6d4)
  - `accent` — Morado para highlights (#a855f7)
  - `teal` — Teal para acentos (#14b8a6)
- ✅ Animaciones custom: `fade-in`, `slide-up`, `slide-down`, `pulse-slow`
- ✅ Sombras especiales: `soft`, `soft-lg`, `glow-primary`, `glow-secondary`
- ✅ Font: Inter (Google Fonts)

**Archivo modificado:** `app/src/index.css`

**Cambios implementados:**
- ✅ Variables CSS para dark mode (colores base más oscuros: gray-950)
- ✅ Import de Google Fonts (Inter)
- ✅ Scrollbar personalizado con estilos para dark mode
- ✅ Body con transiciones suaves entre modos

---

### 3. Sistema de Diseño Atómico

Implementación completa de Atomic Design Pattern con 3 niveles:

#### **Atoms (componentes base)** — 3 componentes

**`components/atoms/Badge.jsx`**
- 8 variantes de color (default, primary, secondary, accent, teal, success, warning, error)
- 3 tamaños (sm, md, lg)
- Dark mode integrado

**`components/atoms/Button.jsx`**
- 6 variantes (primary, secondary, accent, ghost, danger, outline)
- 3 tamaños (sm, md, lg)
- Soporte para iconos (left/right)
- Estados: hover, active, disabled
- Sombras dinámicas

**`components/atoms/Icon.jsx`**
- Wrapper de Lucide React
- 60+ iconos exportados y tipados
- Tamaños consistentes
- Función `Icon({ name, size })` para uso dinámico

#### **Molecules (componentes compuestos)** — 3 componentes

**`components/molecules/Card.jsx`**
- Variante base con title, subtitle, headerAction
- Variante `StatCard` para métricas
- 4 niveles de padding
- Hover opcional
- Dark mode integrado

**`components/molecules/StatusBadge.jsx`**
- Sistema de semáforo para estados de lotes
- Mapeo automático de ESTADOS_LOTE
- Iconos contextuales por estado:
  - Pendiente → Clock (amarillo)
  - En Ecopunto → Package (azul)
  - Clasificado → FileCheck (gris)
  - Disponible → CheckCircle (verde esmeralda)
  - Solicitado → AlertCircle (naranja)
  - Aprobado → Loader (violeta)
  - Finalizado → Check (verde)
- 3 tamaños

**`components/molecules/TimelineStep.jsx`**
- Estados: completed, current, pending
- Dot con icono dinámico
- Línea vertical conectora
- Timestamps opcionales
- Animación pulse en estado current

#### **Organisms (componentes complejos)** — 2 componentes

**`components/organisms/DataTable.jsx`**
- Tabla responsive con columnas configurables
- Renderizado custom por columna
- Click en fila (navegación)
- Empty state
- Dark mode integrado

**`components/organisms/ProgressTimeline.jsx`**
- Timeline completo con 7 estados del flujo
- Detección automática del estado actual
- Indicador visual con pulse
- Timestamps desde historial
- Iconos contextuales por paso

---

### 4. Portal Instituto — 3 Historias de Usuario

#### **HU-I01: Dashboard de Mis Solicitudes**

**Archivo:** `app/src/portals/instituto/Dashboard.jsx`

**Funcionalidades implementadas:**
- ✅ 4 tarjetas estadísticas (Total, Pendientes, En proceso, Finalizados)
- ✅ Tabla de lotes ordenados por fecha descendente
- ✅ StatusBadge con sistema de semáforo
- ✅ Click en fila → navega a detalle
- ✅ Botón "Nueva Solicitud" con icono Plus
- ✅ Filtrado por institutoId del usuario logueado
- ✅ Diseño responsive (grid adaptativo)

**Criterios de aceptación cubiertos:** 5/5 ✅

#### **HU-I02: Nueva Solicitud de Retiro**

**Archivo:** `app/src/portals/instituto/NuevaSolicitud.jsx`

**Funcionalidades implementadas:**
- ✅ Selección de tamaño (chico/mediano/grande) con iconos Package
- ✅ Información de topes de kg desde config.json
- ✅ Upload de imagen con preview (FileReader API)
- ✅ Validación inline (sin alertas del browser)
- ✅ Generación automática de ID único (LOT-YYYY-NNN)
- ✅ Estado inicial: "Pendiente envío Ecopunto"
- ✅ Campo de observaciones opcional
- ✅ Botón remover foto
- ✅ Feedback visual al subir imagen

**Criterios de aceptación cubiertos:** 5/5 ✅

#### **HU-I03: Detalle de Solicitud y Trazabilidad**

**Archivo:** `app/src/portals/instituto/DetalleLote.jsx`

**Funcionalidades implementadas:**
- ✅ Vista detalle con todos los datos del lote
- ✅ Código QR generado dinámicamente (qrcode.react)
- ✅ Botón de descarga de QR como PNG
- ✅ Timeline visual con ProgressTimeline
- ✅ Indicador del estado actual con pulse
- ✅ Información de gestora asignada (cuando aplica)
- ✅ Sección de certificado para lotes finalizados
- ✅ Grid responsive 2/3 + 1/3
- ✅ StatusBadge grande en header

**Criterios de aceptación cubiertos:** 6/6 ✅

---

### 5. Actualización del Router

**Archivo modificado:** `app/src/App.jsx`

**Rutas agregadas:**
```javascript
/instituto                    → Dashboard
/instituto/nueva-solicitud   → Formulario
/instituto/lote/:loteId      → Detalle + QR + Timeline
```

**Cambios adicionales:**
- ✅ Dark mode activado por defecto (useState(true))
- ✅ useEffect para aplicar clase 'dark' al montar
- ✅ Toggle dark/light con iconos Sun/Moon de Lucide
- ✅ Iconos de rol (Settings, Building2, Recycle, Factory)
- ✅ Header con logo Recycle profesional
- ✅ Botón logout con icono LogOut

---

### 6. Mejoras de Diseño Dark Mode

**Decisión técnica:** Modo ultra-oscuro como estándar

**Cambios implementados:**
- `gray-900` → `gray-950` en todos los fondos base
- `gray-800` → `gray-900` en cards y contenedores
- `gray-700` → `gray-800` en bordes
- Variables CSS ajustadas para mayor contraste
- Texto principal: `gray-50` en lugar de `gray-100`

**Archivos modificados:**
- ✅ `index.css` — Variables CSS dark
- ✅ `App.jsx` — Background y header
- ✅ `LoginPage.jsx` — Fondos e inputs
- ✅ `Dashboard.jsx` — Fondo principal
- ✅ `NuevaSolicitud.jsx` — Fondo y card
- ✅ `DetalleLote.jsx` — Fondo principal
- ✅ `Card.jsx` — Background de cards
- ✅ `DataTable.jsx` — Background de tabla

---

### 7. Reemplazo completo de Emojis → Iconos Lucide

**Archivos modificados:**

**`App.jsx`**
- ♻️ → `<Recycle />` (header logo)
- 🌙/☀️ → `<Moon />` / `<Sun />` (toggle)
- Emojis de rol → Componentes (Settings, Building2, Recycle, Factory)

**`LoginPage.jsx`**
- ♻️ → `<Recycle />` (logo principal)
- 👤 → `<Shield />` (admin)
- 🏛️ → `<Building2 />` (instituto)
- ♻️ → `<Recycle />` (ecopunto)
- 🏭 → `<Factory />` (gestora)

**`NuevaSolicitud.jsx`**
- 📦 → `<Package />` (lote chico)
- 📦📦 → `<PackagePlus />` (lote mediano)
- 📦📦📦 → `<Boxes />` (lote grande)

**Total de emojis reemplazados:** 12

---

### 8. LoginPage — Rediseño Moderno

**Archivo modificado:** `app/src/portals/auth/LoginPage.jsx`

**Nuevas características:**
- ✅ Gradiente de fondo animado (from-gray-950 via-gray-900)
- ✅ Overlay con gradiente de colores primary/secondary
- ✅ Efectos de blur en círculos flotantes
- ✅ Card con glassmorphism (backdrop-blur-xl)
- ✅ Logo con gradiente y sombra glow
- ✅ Inputs con border focus animado
- ✅ Botón con gradiente horizontal
- ✅ Hover con translate-y y sombra aumentada
- ✅ Lista de usuarios con hover effects
- ✅ Font mono para credenciales
- ✅ Dark mode activado por defecto

**Tecnologías aplicadas:**
- Glassmorphism
- Gradientes múltiples
- Animaciones CSS (slide-up, fade-in)
- Sombras glow
- Backdrop blur

---

## Decisiones técnicas relevantes

### 1. Diseño Atómico vs. Componentes ad-hoc

**Decisión:** Implementar Atomic Design desde el inicio

**Razón:**
- Reutilización de código (DRY)
- Consistencia visual automática
- Escalabilidad a medida que se agregan portales
- Mantenimiento simplificado
- Facilita testing unitario

**Trade-off:** Mayor tiempo de setup inicial, pero ahorro masivo a largo plazo

---

### 2. Dark mode ultra-oscuro (gray-950)

**Decisión:** Usar gray-950 como fondo base en lugar del típico gray-900

**Razón:**
- Diferenciación visual clara del modo claro
- Menos fatiga visual en sesiones prolongadas
- Contraste más dramático y profesional
- Alineado con tendencia de diseño "dark premium"

**Impacto:** Requiere ajustar todos los componentes, pero resultado final es mucho más moderno

---

### 3. Iconografía profesional (Lucide React)

**Decisión:** Reemplazar 100% de emojis por iconos SVG

**Razón:**
- Emojis varían entre sistemas operativos/browsers
- Iconos SVG son escalables sin pérdida de calidad
- Control total sobre tamaño, color y estilo
- Consistencia visual garantizada
- Accesibilidad mejorada (aria-labels)

**Biblioteca elegida:** Lucide React
- Tree-shakeable (solo se importan los iconos usados)
- 1000+ iconos disponibles
- Diseño consistente y moderno
- Mantenimiento activo
- MIT License

---

### 4. Sistema de semáforo para estados

**Decisión:** Mapeo visual de estados mediante colores tipo semáforo

**Colores asignados:**
- 🟡 Amarillo/Amber → Pendiente, en espera
- 🔵 Azul → En proceso, información
- ⚪ Gris → Neutral, clasificado
- 🟢 Verde esmeralda → Disponible, activo
- 🟠 Naranja → Solicitud recibida, atención
- 🟣 Violeta → Aprobado, pendiente de cierre
- 🟢 Verde → Finalizado, completado

**Ventaja:** Usuario identifica estado de un vistazo sin leer texto

---

## Problemas encontrados y soluciones

### Problema 1: Error de sintaxis en Icon.jsx

**Error:**
```
Expected "}" but found "as"
src/components/atoms/Icon.jsx:74:11
Download as DownloadIcon
```

**Causa:** Uso de sintaxis `as` en destructuring, que no es válida en JavaScript

**Solución:** Eliminar aliases y usar nombres directos de Lucide:
```javascript
// ❌ Incorrecto
Download as DownloadIcon

// ✅ Correcto
Download
```

---

### Problema 2: Exports duplicados de iconos

**Error:**
```
The symbol "Download" has already been declared
Multiple exports with the same name "Download"
```

**Causa:** Download y Upload exportados dos veces (línea 37 y línea 74)

**Solución:** Eliminar duplicados de la sección "Documentos y datos"

---

### Problema 3: Servidor no responde (ERR_CONNECTION_REFUSED)

**Causa:** Proceso de Vite se detuvo después del comando con `timeout`

**Solución:**
```bash
# Limpiar procesos node
pkill node

# Reiniciar servidor en background
cd app && npm run dev > /dev/null 2>&1 &
```

**Prevención:** Usar `run_in_background` sin timeout para comandos de servidor

---

## Artefactos generados

### Código nuevo (líneas aproximadas)

| Tipo | Cantidad | Líneas |
|------|----------|--------|
| Componentes Atoms | 3 | ~250 |
| Componentes Molecules | 3 | ~400 |
| Componentes Organisms | 2 | ~300 |
| Vistas Portal Instituto | 3 | ~650 |
| Configuración (Tailwind, CSS) | 2 | ~150 |
| Router y App updates | 1 | ~100 |
| **Total** | **14 archivos** | **~1,850** |

### Documentación

- ✅ `CHANGELOG.md` actualizado con Sesión 5
- ✅ `docs/sesiones/sesion-05.md` (este documento)

---

## Testing realizado

### Manual testing del flujo completo

**Login:**
- ✅ Página carga en dark mode automáticamente
- ✅ Gradientes y glassmorphism funcionan correctamente
- ✅ Login con credenciales correctas → redirige al dashboard
- ✅ Login con credenciales incorrectas → muestra error inline

**Dashboard Instituto:**
- ✅ Estadísticas calculan correctamente (Total, Pendientes, En proceso, Finalizados)
- ✅ Tabla muestra solo lotes del instituto logueado (INCO)
- ✅ Lotes ordenados por fecha descendente
- ✅ StatusBadge muestra color e icono correcto por estado
- ✅ Click en fila → navega a detalle correcto

**Nueva Solicitud:**
- ✅ Opciones de tamaño renderizan con iconos profesionales
- ✅ Upload de imagen muestra preview correctamente
- ✅ Validación funciona (campo vacío → error inline)
- ✅ Crear solicitud → genera ID único → redirige a dashboard
- ✅ Nuevo lote aparece en dashboard en estado "Pendiente"

**Detalle de Lote:**
- ✅ Información completa del lote se muestra
- ✅ QR se genera correctamente con URL `/trazabilidad?lote=LOT-XXX`
- ✅ Botón descargar QR funciona (genera PNG)
- ✅ Timeline muestra 7 pasos del flujo
- ✅ Estado actual resaltado con pulse
- ✅ Para lotes finalizados, muestra sección de certificado

**Dark Mode:**
- ✅ Toggle funciona correctamente (Sun ↔ Moon)
- ✅ Transiciones suaves entre modos
- ✅ Todos los componentes soportan dark mode
- ✅ Contraste adecuado en ambos modos
- ✅ Scrollbar personalizado funciona

**Responsive:**
- ✅ Dashboard: grid adapta de 4 columnas a 1 columna en mobile
- ✅ Tabla: scroll horizontal en pantallas pequeñas
- ✅ Formulario: inputs y botones se adaptan
- ✅ Detalle: layout cambia de 2/3 + 1/3 a columna única

---

## Métricas de la sesión

- **Duración:** ~4 horas
- **Commits realizados:** 0 (pendiente al final de sesión)
- **Archivos modificados:** 14
- **Archivos creados:** 13
- **Líneas de código agregadas:** ~1,850
- **HUs completadas:** 3/16 (18.75%)
- **Portales completados:** 1/5 (20%)
- **Sistema de diseño:** 100% implementado

---

## Próximos pasos (Sesión 6)

### Sprint 2 — Portal Ecopunto

**HU-E01:** Bandeja entrante
- Listado de lotes recibidos
- Filtro por estado
- Acción "Clasificar" → navega a HU-E02

**HU-E02:** Clasificación con IA (OpenRouter + Claude Vision)
- Upload de imagen del lote
- Llamada a API de Anthropic vía OpenRouter
- Parsing de respuesta (categoría + confianza)
- Ingreso manual de peso real
- Confirmación/corrección de categoría

**HU-E03:** Lotes para publicar
- Listado de lotes clasificados (no publicados)
- Botón "Publicar al catálogo"
- Cambio de estado a "Disponible para retiro"

### Sprint 2 — Portal Gestora (parcial)

**HU-G01:** Catálogo de lotes + Scoring
- Listado de lotes disponibles
- Visualización de scoring de la gestora
- Filtros por categoría
- Sistema de puntuación base + bonos

---

## Lecciones aprendidas

1. **Inversión en sistema de diseño vale la pena:** Los primeros componentes tardaron más, pero las vistas posteriores se implementaron 3x más rápido
2. **Dark mode desde el inicio:** Configurar dark mode al principio evita refactorización masiva después
3. **Iconografía profesional es no-negociable:** El impacto visual de iconos SVG vs emojis es dramático
4. **Glassmorphism bien aplicado:** El LoginPage quedó visualmente impactante sin sacrificar usabilidad
5. **Testing manual es crítico:** Encontramos 3 bugs menores durante testing que no se habrían detectado sin probar el flujo completo

---

## Apéndice: Estructura final de componentes

```
app/src/
├── components/
│   ├── atoms/
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   └── Icon.jsx
│   ├── molecules/
│   │   ├── Card.jsx
│   │   ├── StatusBadge.jsx
│   │   └── TimelineStep.jsx
│   └── organisms/
│       ├── DataTable.jsx
│       └── ProgressTimeline.jsx
├── portals/
│   ├── auth/
│   │   └── LoginPage.jsx
│   └── instituto/
│       ├── Dashboard.jsx
│       ├── NuevaSolicitud.jsx
│       └── DetalleLote.jsx
├── constants/
│   └── estados.js
├── context/
│   └── AppContext.jsx
├── data/
│   ├── lotes.json
│   ├── institutos.json
│   ├── gestoras.json
│   ├── usuarios.json
│   └── config.json
├── App.jsx
├── main.jsx
└── index.css
```

---

**Documento generado:** 27 de abril de 2026  
**Autor:** Equipo EcoFIng (Carmela González · Verónica Iriarte · Juan Raimondo)  
**Próxima sesión:** 28 de abril de 2026 — Sprint 2: Portal Ecopunto + Portal Gestora
