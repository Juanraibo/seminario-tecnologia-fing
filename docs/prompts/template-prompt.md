# Prompt XX — [Título descriptivo del objetivo]
# Usar en Sesión N
# Construye HU-XXX, HU-YYY, HU-ZZZ

---

[Párrafo introductorio explicando el objetivo general de este prompt]

Leé el `CLAUDE.md` y los archivos `docs/user-stories/HU_[Nombre].md` para entender los criterios de aceptación completos antes de escribir código.

---

## Prerrequisitos

Antes de empezar, verificá que existen estos archivos/componentes:
- `ruta/al/archivo.jsx`
- `otro/archivo-necesario.js`

Si falta algo, crealo primero usando [otro prompt o instrucción].

---

## Componente 1: [Nombre del componente]

**Ubicación:** `app/src/ruta/Componente.jsx`

**Responsabilidad:** [¿Qué hace este componente?]

**Requisitos:**
1. [Requisito funcional específico]
2. [Otro requisito]
3. [Validaciones necesarias]

**Datos que consume:**
- De `useApp()`: `lotes`, `usuarioActual`, etc.
- Props: `prop1`, `prop2`

**Interacciones:**
- Al hacer click en X → navega a `/ruta`
- Al enviar formulario → dispatch `ACCION_CONTEXTO`

**Validaciones:**
- Si falta campo obligatorio → mostrar error inline
- Si no hay datos → mostrar estado vacío amigable

---

## Componente 2: [Nombre del segundo componente]

[Repetir estructura anterior]

---

## Routing

Actualizá `app/src/App.jsx` para agregar estas rutas:
- `/nueva-ruta` → ComponenteNuevo
- `/otra-ruta/:parametro` → OtroComponente

---

## Estilos y UX

- Usar clases de Tailwind para consistencia
- Botones primarios: `bg-green-600 hover:bg-green-700 text-white`
- Botones secundarios: `border border-gray-300 hover:bg-gray-50`
- Estados vacíos: ícono + texto centrado + CTA
- Errores: texto rojo debajo del campo, no alerts del browser

---

## Al terminar

Confirmá manualmente que:
- [ ] [Criterio de aceptación 1]
- [ ] [Criterio de aceptación 2]
- [ ] [Criterio de aceptación 3]
- [ ] No hay errores en la consola del browser
- [ ] La navegación funciona correctamente
- [ ] El estado se persiste correctamente en el contexto

---

## Troubleshooting común

Si encontrás este error:
```
[Texto del error común]
```
Solución: [Cómo resolverlo]

---

**Prompt creado:** [Fecha] — [Autor]
