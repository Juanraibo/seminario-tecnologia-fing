# Changelog — EcoFIng

Bitácora de decisiones y avance por sesión de trabajo.  
Formato: `[Sesión N — Fecha] Título`

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
