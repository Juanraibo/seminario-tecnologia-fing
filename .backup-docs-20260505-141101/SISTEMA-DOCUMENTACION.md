# Sistema de Documentación — EcoFIng

> Documento maestro que explica cómo se documenta TODO en este proyecto.  
> Actualizado: 26 de abril de 2026

---

## Filosofía de documentación

**Un lugar para cada cosa, cada cosa en su lugar.**

- **Código ejecutable** → `app/src/`
- **Documentación técnica** → `docs/`
- **Registro de cambios** → `CHANGELOG.md`
- **Instrucciones para IA** → `CLAUDE.md`
- **Descripción pública** → `README.md`
- **Entregables académicos** → `entregas/sesion-XX/`

---

## Estructura de la carpeta `docs/`

```
docs/
├── SISTEMA-DOCUMENTACION.md  ← Este archivo (meta-documentación)
├── guia-desarrollo.md         ← Cómo trabajar con el proyecto
│
├── prompts/                   ← Prompts organizados para usar con IA
│   ├── README.md              ← Índice y guía de uso de prompts
│   ├── 00-setup-verificacion.md
│   ├── 01-sprint1-instituto.md
│   ├── 02-sprint2-ecopunto-gestora.md
│   ├── 03-sprint3-ia.md
│   ├── 04-sprint3-admin.md
│   ├── 05-sprint3-publica-y-06-pulido.md
│   └── template-prompt.md     ← Plantilla para nuevos prompts
│
├── user-stories/              ← Historias de usuario
│   ├── HU_Autenticacion.md
│   ├── HU_Portal_Instituto.md
│   ├── HU_Portal_Ecopunto.md
│   ├── HU_Portal_Gestora.md
│   ├── HU_Portal_Administrador.md
│   └── HU_Vista_Publica.md
│
├── decisions/                 ← ADRs (Architecture Decision Records)
│   ├── ADR-001-stack.md
│   ├── ADR-002-arquitectura-datos.md
│   └── template-adr.md        ← Plantilla para nuevos ADRs
│
├── arquitectura/              ← Diagramas y flujos técnicos
│   ├── flujo-estados.md
│   ├── diagrama-componentes.md
│   └── modelo-datos.md
│
└── sesiones/                  ← Registro detallado por sesión
    ├── sesion-01.md
    ├── sesion-02.md
    ├── sesion-03.md
    └── sesion-04.md           ← Sesión actual
```

---

## Documentos de la raíz

### `CLAUDE.md`
**Propósito:** Instrucciones completas para el agente de IA.

**Cuándo actualizar:**
- Cambios en la estructura del proyecto
- Nuevas convenciones de código
- Nuevas reglas de negocio críticas
- Cambios en el stack tecnológico

**No incluir:**
- Detalles de implementación específicos (van en código)
- Historial de cambios (va en CHANGELOG.md)
- Tutoriales (van en docs/guia-desarrollo.md)

---

### `CHANGELOG.md`
**Propósito:** Bitácora cronológica de decisiones y avance.

**Formato:**
```markdown
## [Sesión N — Fecha] Título descriptivo

### Decisiones tomadas
- Lista de decisiones técnicas o de proyecto

### Artefactos generados
- Archivos creados o modificados

### Pendiente para próxima sesión
- Lista de TODOs
```

**Cuándo actualizar:**
- Al final de cada sesión de trabajo
- Después de tomar decisiones técnicas importantes
- Cuando se completan hitos importantes

**Regla de oro:** Un commit importante = una entrada en el CHANGELOG.

---

### `README.md`
**Propósito:** Descripción pública del proyecto para alguien que lo ve por primera vez.

**Contenido:**
- ¿Qué hace el sistema?
- Cómo levantar el proyecto
- Stack tecnológico
- Usuarios de prueba
- Estado actual del proyecto

**Audiencia:** Evaluadores, colaboradores externos, el equipo mismo en 6 meses.

---

## Carpeta `docs/prompts/`

### Estructura de un prompt

Cada prompt debe seguir esta estructura:

```markdown
# Prompt XX — Título del Sprint
# Usar en Sesión N
# Construye HU-XXX, HU-YYY

---

[Contexto breve del objetivo]

## Prerrequisitos
[Archivos o componentes que deben existir antes]

## Componente 1: Nombre
[Instrucciones específicas, paso a paso]

## Componente 2: Nombre
[Instrucciones específicas, paso a paso]

---

## Al terminar
[Checklist de validación manual]
```

### Convenciones

1. **Un prompt por sprint/tarea mayor**
2. **Numeración secuencial:** `00-`, `01-`, `02-`...
3. **Nombres descriptivos:** `01-sprint1-instituto.md` no `prompt1.md`
4. **Referenciar HUs:** Siempre indicar qué HUs cubre
5. **Instrucciones atómicas:** Paso a paso, sin ambigüedad
6. **Checklist final:** Cómo verificar que funcionó

### Template

Ver [`docs/prompts/template-prompt.md`](./prompts/template-prompt.md) para copiar y pegar.

---

## Carpeta `docs/decisions/` (ADRs)

### ¿Qué es un ADR?

Un **Architecture Decision Record** documenta decisiones técnicas importantes con su contexto, alternativas consideradas y consecuencias.

### Cuándo crear un ADR

- Cambio en el stack tecnológico
- Decisión de arquitectura con tradeoffs
- Elección entre múltiples alternativas técnicas
- Cualquier decisión que requiera justificación futura

### Estructura

```markdown
# ADR-NNN: Título de la decisión

## Estado
[Propuesto | Aceptado | Deprecado]

## Contexto
[¿Por qué necesitamos tomar esta decisión?]

## Decisión
[¿Qué decidimos?]

## Alternativas consideradas
1. Alternativa A: pros/cons
2. Alternativa B: pros/cons

## Consecuencias
### Positivas
- Lista de beneficios

### Negativas / Riesgos
- Lista de tradeoffs o limitaciones
```

### Template

Ver [`docs/decisions/template-adr.md`](./decisions/template-adr.md) para copiar y pegar.

---

## Carpeta `docs/sesiones/`

### Propósito

Registro **detallado** de cada sesión de trabajo, complementario al CHANGELOG.md.

El CHANGELOG es la vista ejecutiva, `docs/sesiones/` es el diario de desarrollo.

### Contenido de cada archivo `sesion-NN.md`

```markdown
# Sesión NN — Fecha

## Contexto
[¿En qué punto del proyecto estábamos?]

## Objetivo de la sesión
[¿Qué nos propusimos lograr?]

## Actividades realizadas

### 1. Tarea principal
- Detalle de lo que se hizo
- Problemas encontrados
- Soluciones aplicadas

### 2. Otra tarea
[...]

## Prompts utilizados
- `prompts/01-sprint1-instituto.md` → Resultado: ✅ Funcional / ⚠️ Requirió ajustes / ❌ No funcionó

## Código generado/modificado
- `app/src/portals/instituto/Dashboard.jsx` — Creado
- `app/src/context/AppContext.jsx` — Modificado (agregado action AGREGAR_LOTE)

## Decisiones tomadas
- [Decisiones técnicas o de alcance tomadas en esta sesión]

## Problemas pendientes / Deuda técnica
- [Issues que quedaron sin resolver]

## Próximos pasos
- [Qué hacer en la sesión siguiente]

## Tiempo invertido
- Planificación: X horas
- Desarrollo: Y horas
- Testing: Z horas
- Total: N horas
```

### Cuándo crear

Al **finalizar** cada sesión de trabajo, antes de cerrar la computadora.

### Beneficios

1. Trazabilidad completa de decisiones
2. Referencia para el informe final
3. Evidencia de trabajo para evaluación
4. Memoria de problemas y soluciones
5. Base para retrospectivas

---

## Carpeta `entregas/`

### Propósito

Artefactos formales requeridos por la materia (PDFs, presentaciones, entregables académicos).

### Estructura

```
entregas/
├── sesion-01/
│   ├── acta-constitucion.pdf
│   └── relevamiento-asis.pdf
├── sesion-02/
│   ├── user-stories.pdf
│   └── gantt.xlsx
├── sesion-03/
│   └── arquitectura-mvp.pdf
├── sesion-04/
│   └── avance-sprint1.pdf
[...]
└── sesion-08/
    └── presentacion-final.pdf
```

### Regla importante

**Los documentos fuente viven en `docs/`**, lo que va en `entregas/` son las **exportaciones finales** en el formato requerido por la cátedra (generalmente PDF).

Ejemplo:
- `docs/user-stories/HU_Portal_Instituto.md` → fuente
- `entregas/sesion-02/user-stories.pdf` → exportación

---

## Flujo de trabajo completo

### Antes de una sesión

1. Leer `CHANGELOG.md` para recordar el contexto
2. Revisar `docs/sesiones/sesion-NN.md` de la sesión anterior
3. Revisar el prompt correspondiente en `docs/prompts/`

### Durante una sesión

1. Trabajar con el código en `app/src/`
2. Usar los prompts de `docs/prompts/` si corresponde
3. Anotar decisiones importantes (van a ir al CHANGELOG y al ADR si aplica)

### Después de una sesión

1. **Actualizar `CHANGELOG.md`** con resumen ejecutivo
2. **Crear `docs/sesiones/sesion-NN.md`** con el detalle completo
3. **Crear ADR** si se tomó una decisión de arquitectura
4. **Actualizar `CLAUDE.md`** si cambió algo estructural
5. **Actualizar `README.md`** si cambió el estado del proyecto
6. **Hacer commit** con mensaje descriptivo:
   ```bash
   git add .
   git commit -m "docs: registro completo de sesión 4 — sprint 1 instituto"
   git push
   ```
7. **Exportar entregables** a `entregas/sesion-XX/` si corresponde

---

## Checklist de calidad documental

Antes de dar por cerrada una sesión, verificar:

- [ ] `CHANGELOG.md` tiene entrada de esta sesión
- [ ] `docs/sesiones/sesion-NN.md` existe y está completo
- [ ] Si hubo decisión técnica importante → ADR creado
- [ ] Si se usaron prompts → resultados documentados
- [ ] Si cambió estructura → `CLAUDE.md` actualizado
- [ ] Si se completó hito → `README.md` actualizado
- [ ] Commit hecho con mensaje descriptivo
- [ ] Si hay entregable formal → PDF exportado a `entregas/`

---

## Mantenimiento de este documento

Este archivo debe actualizarse cuando:
- Cambia la estructura de carpetas
- Se agrega un nuevo tipo de documentación
- Se crea un nuevo template
- Cambia el flujo de trabajo del equipo

**Responsable:** Quien proponga el cambio, con consenso del equipo.

---

**Última actualización:** 26 de abril de 2026 — Juan Raimondo
