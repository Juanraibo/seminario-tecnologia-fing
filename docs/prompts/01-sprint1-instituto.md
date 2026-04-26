# Prompt 01 — Sprint 1: Portal Instituto
# Usar en Sesión 4
# Construye HU-I01, HU-I02, HU-I03

---

Leé el `CLAUDE.md` y los archivos `docs/user-stories/HU_Portal_Instituto.md` para entender los criterios de aceptación completos antes de escribir una sola línea de código.

Vamos a construir el Portal Instituto completo. El usuario que usa este portal es el representante de un instituto (ej. INCO) y accede luego de loguearse.

## Componente compartido previo

Antes de los portales, creá en `app/src/components/StatusBadge.jsx`:
- Recibe una prop `estado` (string)
- Muestra el estado como un badge con color usando `COLORES_ESTADO` de `app/src/constants/estados.js`
- Ejemplo: estado "Finalizado" → badge verde con texto "Finalizado ✅"

---

## HU-I01: Dashboard — `app/src/portals/instituto/Dashboard.jsx`

Reemplazá el placeholder actual. Este componente debe:

1. Obtener el usuario logueado desde `useApp()` — tiene `institutoId` (ej. "INCO")
2. Filtrar los lotes del contexto donde `lote.institutoId === usuario.institutoId`
3. Mostrar una tabla con columnas: Fecha de solicitud · ID del lote · Tamaño · Estado (usando StatusBadge)
4. Ordenar por fecha descendente (más reciente primero)
5. Cada fila es clickeable y navega a `/instituto/lote/:id` usando `useNavigate`
6. Botón "Nueva solicitud de retiro" que navega a `/instituto/nueva`
7. Si no hay lotes, mostrar un estado vacío amigable con el botón igual visible

---

## HU-I02: Nueva Solicitud — `app/src/portals/instituto/NuevaSolicitud.jsx`

1. Formulario con:
   - Selector de tamaño: 3 opciones (Chico / Mediano / Grande) con descripción de m³ leída de `config.json`
   - Input de archivo para foto (obligatorio) con previsualización usando FileReader
   - Textarea de observaciones (opcional)
2. Validación inline: si falta tamaño o foto, mostrar mensaje de error en rojo debajo del campo (sin alert del browser)
3. Al enviar exitosamente:
   - Generar ID único formato `LOT-2026-XXX` (XXX = número random de 3 dígitos)
   - Hacer dispatch `AGREGAR_LOTE` al contexto con todos los datos y estado "Pendiente envío Ecopunto"
   - Mostrar mensaje de éxito con el ID asignado
   - Redirigir al dashboard después de 2 segundos

---

## HU-I03: Detalle del Lote — `app/src/portals/instituto/DetalleLote.jsx`

1. Leer el ID del lote desde los params de la URL (`useParams`)
2. Buscar el lote en el contexto. Si no existe, mostrar error amigable
3. Mostrar datos del lote: ID, tamaño, peso (si ya fue pesado), categoría (si fue clasificada), observaciones
4. Línea de tiempo visual vertical con estos hitos (mostrar fecha si existe, "Pendiente" si no):
   - Solicitud registrada
   - Recibido en Ecopunto
   - Clasificado y publicado
   - Asignado a Gestora
   - Certificado emitido
5. Código QR: usar la librería `qrcode.react` (ya está en package.json) apuntando a `http://localhost:5173/trazabilidad?lote=<ID>`
6. Botón "Descargar QR" que guarda el QR como imagen PNG usando canvas
7. Si el lote está "Finalizado": mostrar badge de cumplimiento con el número de certificado

---

## Routing

Actualizá `app/src/App.jsx` para agregar estas rutas dentro del bloque de instituto:
- `/instituto` → Dashboard
- `/instituto/nueva` → NuevaSolicitud
- `/instituto/lote/:id` → DetalleLote

---

## Al terminar

Confirmá que:
- El login con inco@fing.edu.uy / inco123 lleva al dashboard
- El dashboard muestra los lotes del INCO del JSON mock
- Se puede crear un nuevo lote y aparece en el dashboard
- Al clickear un lote se ve el detalle con QR
- El QR es scaneable y lleva a /trazabilidad?lote=<ID>
