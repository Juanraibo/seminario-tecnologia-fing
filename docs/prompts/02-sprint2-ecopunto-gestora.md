# Prompt 02 — Sprint 2: Ecopunto + Gestora
# Usar en Sesión 5
# Construye HU-E01, HU-E03, HU-G01, HU-G02, HU-G03
# NOTA: HU-E02 (clasificación con IA) se hace en el Prompt 03

---

Leé el `CLAUDE.md` y los archivos:
- `docs/user-stories/HU_Portal_Ecopunto.md`
- `docs/user-stories/HU_Portal_Gestora.md`

---

## PORTAL ECOPUNTO

### HU-E01: Bandeja Entrante — `app/src/portals/ecopunto/BandejaEntrante.jsx`

1. Mostrar todos los lotes con estado `ESTADOS_LOTE.PENDIENTE_ENVIO`
2. Cada fila: Instituto origen · ID · Tamaño declarado · Fecha de solicitud · miniatura de foto
3. Botón "Marcar como Recibido" por lote. Al presionar:
   - Dispatch `ACTUALIZAR_LOTE` con estado `ESTADOS_LOTE.EN_ECOPUNTO` y `fecha_recepcion_ecopunto: new Date().toISOString().split('T')[0]`
   - El lote desaparece de la bandeja
   - Mostrar toast de confirmación: "Lote LOT-XXX marcado como recibido"
4. Contador en el header: "X lotes por recibir"
5. Si no hay lotes pendientes: estado vacío "No hay lotes pendientes de recepción"

### HU-E03: Listos para Publicar — `app/src/portals/ecopunto/ListosParaPublicar.jsx`

1. Mostrar lotes con estado `ESTADOS_LOTE.CLASIFICADO`
2. Cada fila: ID · Categoría final · Peso real (kg) · Instituto origen · Fecha clasificación
3. Checkbox por fila para selección múltiple
4. Botón "Publicar para Gestoras" (activo solo si hay al menos 1 seleccionado)
5. Al publicar:
   - Si 1 lote: dispatch `ACTUALIZAR_LOTE` con estado `ESTADOS_LOTE.DISPONIBLE` y `fecha_publicacion`
   - Si varios lotes: crear lote consolidado con nuevo ID formato `LOT-2026-XXX-G`, peso sumado, estado `DISPONIBLE`. Los lotes originales quedan con campo `consolidado_en: <nuevo_id>`
   - Lotes publicados desaparecen de la lista

### Routing Ecopunto

Actualizá `App.jsx`:
- `/ecopunto` → BandejaEntrante (reemplazar placeholder)
- `/ecopunto/clasificar/:id` → placeholder por ahora (se hace en Prompt 03)
- `/ecopunto/publicar` → ListosParaPublicar

Agregá navegación lateral o tabs dentro del layout de ecopunto con: "Bandeja" | "Clasificar" | "Publicar"

---

## PORTAL GESTORA

### Componente compartido: ScoringBadge — `app/src/components/ScoringBadge.jsx`

Recibe `scoring` (número 0-100) y muestra:
- 0-39: "Bronce 🥉" en marrón
- 40-69: "Plata 🥈" en gris
- 70-100: "Oro 🥇" en amarillo
- Si scoring >= 70 Y habilitacion_ministerio === true: mostrar "🌿 Sello Verde" en verde

### HU-G01: Catálogo — `app/src/portals/gestora/Catalogo.jsx`

1. Obtener la gestora del usuario logueado: `state.gestoras.find(g => g.id === usuario.gestoraId)`
2. Si `habilitacion_ministerio === false`: mostrar pantalla de bloqueo con mensaje explicativo, sin acceso al catálogo
3. Mostrar `ScoringBadge` con el scoring actual en lugar destacado
4. Cards de lotes con estado `ESTADOS_LOTE.DISPONIBLE`:
   - Categoría · Peso (kg) · Fecha publicación · Foto miniatura · Instituto origen
   - Botón "Ver detalle" → navega a `/gestora/lote/:id`
5. Filtro por categoría (select desplegable con las categorías del `config.json`)

### HU-G02: Detalle de Lote — `app/src/portals/gestora/DetalleLote.jsx`

1. Mostrar todos los datos del lote
2. Verificar si esta gestora ya tiene una solicitud activa para este lote (buscar en `lote.solicitudes_gestoras`)
3. Si no tiene solicitud: botón "Ofrecer retiro"
4. Al presionar "Ofrecer retiro": mostrar modal de confirmación con:
   - Resumen del lote
   - Input numérico para cotización (opcional, en USD)
   - Advertencia: "Quedará pendiente de aprobación por la administración de FIng"
   - Botones "Confirmar" y "Cancelar"
5. Al confirmar: dispatch `ACTUALIZAR_LOTE` agregando la solicitud al array `solicitudes_gestoras` y cambiando estado a `ESTADOS_LOTE.SOLICITADO`
6. Si ya tiene solicitud: mostrar "✓ Solicitud enviada — pendiente de aprobación" (no accionable)

### HU-G03: Mis Retiros — `app/src/portals/gestora/MisRetiros.jsx`

Dos secciones:

**Pendientes de certificado:** lotes con estado `RETIRO_APROBADO` asignados a esta gestora
- Columnas: ID · Categoría · Peso · Fecha aprobación · Días transcurridos
- Botón "Subir Certificado" por fila
- Al presionar: input de archivo PDF simulado. Mostrar nombre del archivo seleccionado
- Al confirmar subida:
  - Calcular puntos según días transcurridos desde `fecha_aprobacion`:
    - ≤ 30 días → +10 pts (leer de `config.json`: `scoring_certificado_a_tiempo`)
    - 31-60 días → +5 pts
    - > 60 días → +2 pts
  - Dispatch `ACTUALIZAR_LOTE` con estado `FINALIZADO` y `fecha_certificado`
  - Dispatch `ACTUALIZAR_SCORING_GESTORA` con los puntos calculados
  - Mostrar toast: "Certificado registrado. +X puntos a tu scoring"

**Historial completados:** lotes `FINALIZADO` asignados a esta gestora
- Columnas: ID · Categoría · Certificado N° · Fecha · Puntos obtenidos

### Routing Gestora

- `/gestora` → Catalogo
- `/gestora/lote/:id` → DetalleLote
- `/gestora/mis-retiros` → MisRetiros

Navegación con tabs: "Catálogo" | "Mis retiros"

---

## Al terminar verificá

- Login con gestora1@reciclauY.com ve el catálogo con los lotes disponibles del JSON mock
- Se puede ofrecer retiro y el lote cambia de estado
- En MisRetiros se ven los lotes aprobados y se puede simular la subida del certificado
- El scoring actualiza correctamente
