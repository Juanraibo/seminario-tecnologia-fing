# **Épica: Gestión de Residuos desde el Instituto Generador**

Esta sección abarca las funcionalidades para que los institutos de la Facultad de Ingeniería (INCO, IIE, IIMPI, etc.) puedan registrar y hacer seguimiento de sus residuos electrónicos (RAEE).

---

## **HU-I01: Dashboard de Mis Solicitudes (Pantalla A1)**

**Como** usuario representante de un Instituto

**Quiero** visualizar un panel principal con el listado de mis solicitudes de retiro

**Para** conocer rápidamente el estado en el que se encuentran mis residuos y acceder a mi historial.

**Criterios de Aceptación:**

1. El usuario ve una tabla con todos sus lotes registrados, ordenados por fecha de solicitud descendente (más reciente primero).
2. Cada fila muestra: Fecha de solicitud, ID del lote, Tamaño declarado y Estado actual.
3. Los estados posibles son (con código de color):
   - 🟡 **Pendiente de envío a Ecopunto**
   - 🔵 **En Ecopunto** (recibido pero aún no clasificado)
   - 🟠 **Asignado a Gestora** (retiro aprobado, pendiente de certificado)
   - ✅ **Procesado** (Certificado de Disposición Final emitido)
4. Existe un botón claro y visible para **"Nueva solicitud de retiro"** que lleva a la Pantalla A2.
5. Al hacer clic en cualquier fila de la tabla, el sistema navega al detalle del lote (Pantalla A3).

**Prioridad:** Alta

**Notas Técnicas:** Los datos de la tabla se cargan desde el archivo `src/data/lotes.json`, filtrados por el instituto del usuario logueado.

---

## **HU-I02: Nueva Solicitud de Retiro (Pantalla A2)**

**Como** usuario representante de un Instituto

**Quiero** registrar un nuevo lote especificando su tamaño y adjuntando una fotografía representativa

**Para** iniciar formalmente el proceso de disposición de los RAEE de mi instituto.

**Criterios de Aceptación:**

1. El formulario permite seleccionar el tamaño del lote mediante tres opciones predefinidas basadas en volumen:
   - **Lote chico** — hasta 0.5 m³ (tope de kg configurable por Administrador)
   - **Lote mediano** — de 0.5 m³ a 2 m³ (tope de kg configurable por Administrador)
   - **Lote grande** — más de 2 m³ (tope de kg configurable por Administrador)
2. El formulario requiere obligatoriamente adjuntar al menos una fotografía representativa del lote. El sistema muestra una previsualización de la foto seleccionada antes de enviar.
3. Existe un campo de texto opcional para **Observaciones** (ej. "Incluye monitores CRT y teclados").
4. Al enviar, el sistema valida que se haya seleccionado tamaño y adjuntado al menos una foto. Si falta alguno, muestra mensajes de error en contexto (inline, no alertas del browser).
5. Al enviar exitosamente, el sistema confirma la creación, asigna un **ID único al lote** (formato: `LOT-AAAA-NNN`) y redirige al dashboard (A1) donde el nuevo lote aparece en estado "Pendiente de envío a Ecopunto".

**Prioridad:** Alta

**Notas Técnicas:** En el MVP, la imagen no persiste en base de datos real; se muestra la previsualización con FileReader API. Los valores exactos de los topes de kg se leen dinámicamente desde `src/data/config.json`.

---

## **HU-I03: Detalle de Solicitud y Trazabilidad (Pantalla A3)**

**Como** usuario representante de un Instituto

**Quiero** acceder al detalle de una solicitud específica, ver su trayecto en una línea de tiempo y obtener su código QR

**Para** hacer seguimiento del lote y poder etiquetarlo físicamente para enviarlo al Ecopunto.

**Criterios de Aceptación:**

1. Al hacer clic en un lote desde el dashboard (A1), se abre la vista de detalle.
2. La vista muestra los datos del lote: ID, tamaño declarado, fecha de solicitud, observaciones y fotografía adjunta.
3. La pantalla incluye una **línea de tiempo visual** con los hitos del lote y el estado actual resaltado:
   - ✅ / ⏳ Solicitud registrada (fecha)
   - ✅ / ⏳ Recibido en Ecopunto (fecha)
   - ✅ / ⏳ Clasificado y publicado (fecha)
   - ✅ / ⏳ Asignado a Gestora (nombre + fecha)
   - ✅ / ⏳ Certificado emitido (número + fecha)
4. La pantalla muestra el **Código QR** generado para ese lote, en tamaño suficiente para ser escaneado o impreso. El QR apunta a la URL pública `/trazabilidad?lote=<ID>`.
5. Existe un botón para **descargar o imprimir el QR** (como imagen PNG).
6. Si el lote ya fue procesado (estado "Procesado"), se muestra un botón **"Ver Certificado de Disposición Final"** que abre el documento en una nueva pestaña o en un visor inline (iframe).

**Prioridad:** Media

**Notas Técnicas:** El QR se genera dinámicamente en el frontend usando la librería `qrcode.react`. El certificado en el MVP es un PDF de ejemplo estático referenciado en los datos del lote.
