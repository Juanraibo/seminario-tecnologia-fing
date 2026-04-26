# Prompt 03 — Sprint 3: Clasificación con IA (HU-E02)
# Usar en Sesión 6, DESPUÉS de que el resto del Ecopunto esté funcionando
# REQUIERE que VITE_OPENROUTER_API_KEY esté en app/.env.local

---

Leé el `CLAUDE.md` y el criterio HU-E02 en `docs/user-stories/HU_Portal_Ecopunto.md`.

El servicio de IA ya existe en `app/src/services/claudeVision.js` — revisalo antes de empezar.

---

## HU-E02: Clasificación con IA — `app/src/portals/ecopunto/Clasificacion.jsx`

Este componente recibe el ID del lote por URL params (`/ecopunto/clasificar/:id`).

### Flujo completo:

**Paso 1 — Encabezado:**
- Mostrar datos del lote: ID, Instituto origen, tamaño declarado
- El lote debe estar en estado "En Ecopunto"

**Paso 2 — Upload de imagen:**
- Área de drag & drop O botón "Seleccionar foto"
- Al seleccionar: mostrar previsualización de la imagen
- Botón "Clasificar con IA" (activo solo si hay imagen)

**Paso 3 — Llamada a la IA:**
- Mostrar spinner/loader con texto "Analizando imagen con IA..."
- Importar y llamar a `clasificarImagenRAEE` y `fileToBase64` desde `app/src/services/claudeVision.js`
- Timeout de 15 segundos (ya implementado en el servicio)

**Paso 4a — Resultado exitoso:**
- Mostrar card de "Sugerencia de la IA" con:
  - Categoría sugerida (texto grande)
  - Nivel de confianza como badge: "Alta 🟢" / "Media 🟡" / "Baja 🔴"
  - Observación de la IA en texto secundario
- Botón "✓ Aceptar esta categoría"
- Select desplegable para "Corregir categoría" con todas las opciones de `config.json`

**Paso 4b — Error de la IA:**
- Mostrar alerta amarilla: "No se pudo obtener sugerencia de la IA. Clasificá el lote manualmente."
- Mostrar igual el select de categorías para clasificación manual
- El operario puede continuar sin la IA

**Paso 5 — Peso real:**
- Input numérico para peso en kg (obligatorio, mayor a 0)
- Mostrar el tamaño declarado como referencia

**Paso 6 — Guardar:**
- Botón "Guardar clasificación" (requiere categoría seleccionada/aceptada Y peso ingresado)
- Al guardar: dispatch `ACTUALIZAR_LOTE` con:
  - `categoria_final`: la categoría confirmada
  - `peso_real_kg`: el peso ingresado
  - `clasificado_por_ia`: true si se usó IA, false si fue manual
  - `confianza_ia`: el valor devuelto por la IA (o null si fue manual)
  - `estado`: `ESTADOS_LOTE.CLASIFICADO`
  - `fecha_clasificacion`: fecha actual
- Redirigir a `/ecopunto/publicar` con mensaje de éxito

---

## Nota sobre la API key

Si `VITE_OPENROUTER_API_KEY` no está configurada, el botón "Clasificar con IA" debe mostrar:
"⚠️ API key no configurada — solo clasificación manual disponible"
Y habilitar directamente el select de categorías sin intentar llamar a la API.
