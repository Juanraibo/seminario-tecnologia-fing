# Changelog — EcoFIng

Bitácora de decisiones y avance por sesión de trabajo.  
Formato: `[Sesión N — Fecha] Título`

---

## [Sesión 6 — 27 de abril de 2026] Rediseño del flujo de clasificación: Sistema de ítems individuales

### Decisiones tomadas
- **Modelo de datos de 3 niveles:**
  1. **Lote de Entrada** (tipo: "entrada") — contenedor de envío del instituto
  2. **Ítems individuales** — productos clasificados uno por uno con foto + IA
  3. **Lote de Publicación** (tipo: "publicacion") — agrupación por categoría para catálogo
- **Nuevo flujo de clasificación:** El Ecopunto clasifica producto por producto dentro de un lote, no el lote completo
- **Agrupación flexible:** Los lotes de publicación pueden contener ítems de múltiples institutos, agrupados por categoría RAEE
- **Modelo IA:** Cambio de Google Gemini (FREE, no disponible) a **Claude 3 Haiku** ($0.25/1M tokens) — confiable y económico
- **Trazabilidad completa:** Cada ítem mantiene referencia a su lote origen e instituto

### Artefactos generados
- **Modelo de datos:**
  - `app/src/data/items.json` — 17 ítems mock clasificados
  - `app/src/data/lotes.json` — Reestructurado con campo `tipo` + lotes de publicación
- **Context actualizado:**
  - `AppContext.jsx` — Nuevas acciones: `AGREGAR_ITEM`, `ACTUALIZAR_ITEM`, `ASIGNAR_ITEMS_A_LOTE_PUBLICACION`
- **Portal Ecopunto rediseñado (3 vistas):**
  - `Dashboard.jsx` — 4 tarjetas estadísticas, filtrado por tipo de lote, contador de ítems sin publicar
  - `ClasificarLote.jsx` — Clasificación ítem por ítem: foto + IA + peso + descripción, lista de productos agregados
  - `PublicarLotes.jsx` — Agrupación por categoría, selección múltiple, creación de lotes de publicación
- **Configuración:**
  - `.env.local` — Modelo cambiado a `anthropic/claude-3-haiku`
  - `claudeVision.js` — Headers ASCII-safe (fix error ISO-8859-1)
  - `Icon.jsx` — Export de `Sparkles` agregado (fix pantalla en blanco)

### Problemas resueltos
- **Error pantalla en blanco:** Ícono `Sparkles` no exportado en Icon.jsx → agregado
- **Error fetch headers:** Caracteres no-ASCII ("—", "í") en headers de OpenRouter → reemplazados por ASCII
- **Modelo IA no disponible:** Google Gemini FREE (404) → cambiado a Claude Haiku (funciona perfecto)

### Métricas de implementación
- **Líneas de código:** ~800 líneas modificadas/reescritas
- **Archivos modificados:** 8 archivos (3 portales, 1 servicio, 2 datos, 2 config)
- **Tiempo de desarrollo:** 1 sesión (aprox. 2-3 horas)
- **Cobertura de HUs:** 3/16 completadas rediseñadas (HU-E01, E02, E03 con modelo realista)

### Validación de UX
- ✅ Flujo probado end-to-end por el usuario
- ✅ Clasificación con IA funcionando correctamente
- ✅ Agrupación y publicación operativa
- ✅ Trazabilidad completa verificada

### Pendiente para próxima sesión
- Implementar Portal Gestora (HU-G01, G02, G03) con visualización de lotes de publicación
- Implementar Portal Admin (HU-A01, A02, A03)
- Vista Pública de trazabilidad (HU-P01)
- Testing integral del flujo completo
- Documentar decisión de arquitectura (ADR-003: Modelo de ítems individuales)

---

## [Sesión 5 — 27 de abril de 2026] Sprint 1 — Portal Instituto + Sistema de Diseño

### Decisiones tomadas
- **Paleta de colores:** Tech Sostenible (verde esmeralda + azul eléctrico + morado/teal)
- **Dark mode:** Activado por defecto, modo ultra-oscuro (gray-950 como fondo base)
- **Iconografía:** Lucide React en lugar de emojis, 100% iconos profesionales vectoriales
- **Diseño atómico:** Sistema completo de componentes (Atoms → Molecules → Organisms)
- **LoginPage:** Rediseñado con glassmorphism, gradientes y animaciones modernas

### Artefactos generados
- **Sistema de Diseño Atómico (10 componentes):**
  - Atoms: `Badge.jsx`, `Button.jsx`, `Icon.jsx`
  - Molecules: `Card.jsx`, `StatusBadge.jsx`, `TimelineStep.jsx`
  - Organisms: `DataTable.jsx`, `ProgressTimeline.jsx`
- **Portal Instituto completo (3 HUs):**
  - `Dashboard.jsx` — HU-I01: Listado de lotes con estadísticas
  - `NuevaSolicitud.jsx` — HU-I02: Formulario de creación de lotes
  - `DetalleLote.jsx` — HU-I03: Vista detalle + QR + Timeline
- **Configuración:**
  - `tailwind.config.js` — Paleta extendida + animaciones custom
  - `index.css` — Variables CSS dark mode + scrollbar personalizado
  - `App.jsx` — Dark mode por defecto + iconos profesionales
  - `LoginPage.jsx` — Diseño moderno con glassmorphism

### Métricas de implementación
- **Líneas de código:** ~2,500 nuevas líneas
- **Componentes creados:** 13 archivos (10 componentes de diseño + 3 vistas Instituto)
- **Tiempo de desarrollo:** 1 sesión (aprox. 3-4 horas)
- **Cobertura de HUs:** 3/16 completadas (HU-I01, HU-I02, HU-I03)

### Pendiente para próxima sesión
- Implementar Sprint 2: Portal Ecopunto (HU-E01, E02, E03)
- Implementar Sprint 2: Portal Gestora (HU-G01, G02, G03)
- Testing integral del flujo Instituto → Ecopunto → Gestora

---

## [Sesión 4 — 26 de abril de 2026] Sistema de documentación y preparación para desarrollo

### Decisiones tomadas
- Sistema dual de registro: CHANGELOG.md (ejecutivo) + docs/sesiones/ (detallado)
- Carpeta entregas/ se mantiene para artefactos formales académicos
- Templates obligatorios creados para prompts y ADRs
- Flujo de cierre de sesión estandarizado (ver docs/SISTEMA-DOCUMENTACION.md)

### Artefactos generados
- `docs/SISTEMA-DOCUMENTACION.md` — documento maestro de cómo se documenta el proyecto
- `docs/prompts/template-prompt.md` — plantilla para nuevos prompts
- `docs/decisions/template-adr.md` — plantilla para ADRs
- `docs/sesiones/sesion-04.md` — primer ejemplo de documentación detallada

### Pendiente para próxima sesión
- Ejecutar prompt 00 (verificación setup)
- Implementar Sprint 1 completo: Portal Instituto (HU-I01, I02, I03)
- Testing manual de flujo completo
- Generar entregable de avance

---

## [Sesión 3 — 21 de abril de 2026] Diseño de arquitectura del MVP

### Decisiones tomadas
- Stack definido: React 18 + Vite + TailwindCSS + React Router v6 (ver ADR-001)
- Arquitectura sin backend: estado en React Context + JSON locales (ver ADR-002)
- IA: Anthropic API con claude-sonnet-4-20250514 para clasificación de imágenes en HU-E02
- Se agrega HU-AUTH01 (login simulado) al backlog — faltaba en la especificación original
- Se define fórmula de Scoring de Gestoras: base 50pts, +10/+5/+2 según puntualidad de certificado
- Se define comportamiento de QR al consolidar lotes: QR original redirige al consolidado

### Artefactos generados
- `CLAUDE.md` — instrucciones para agente IA
- `docs/user-stories/` — 6 archivos de HUs revisados y completos
- `docs/decisions/ADR-001-stack.md`
- `docs/decisions/ADR-002-arquitectura-datos.md`
- `docs/arquitectura/flujo-estados.md`
- Estructura de carpetas del repositorio definida

### Pendiente para próxima sesión
- Inicializar proyecto con Vite (`npm create vite@latest`)
- Instalar dependencias
- Crear datos mock (JSON) base con lotes en distintos estados
- Implementar AppContext y router base
- Comenzar Portal Instituto (HU-I01)

---

## [Sesión 2 — 14 de abril de 2026] Análisis de requerimientos y artefactos de gestión

### Decisiones tomadas
- Alcance del MVP confirmado: 5 portales + vista pública
- User Stories elaboradas por portal (primera versión)
- Artefactos de gestión: Gantt, RACI, Riesgos, Comunicaciones definidos

### Artefactos generados
- `docs/user-stories/` — primera versión de HUs (revisadas en Sesión 3)
- Cronograma Gantt
- Matriz RACI
- Matriz de Riesgos

---

## [Sesión 1 — 7 de abril de 2026] Kick-off y relevamiento AS-IS

### Decisiones tomadas
- Equipo conformado: Carmela González, Verónica Iriarte, Juan Raimondo
- Problema identificado: gestión de RAEE en FIng es manual, sin trazabilidad ni cumplimiento formal del Decreto 292/024
- Solución propuesta: MVP web con GenAI para clasificación automatizada
- Repositorio GitHub creado

### Artefactos generados
- `README.md` inicial
- Estructura base de carpetas del repositorio
