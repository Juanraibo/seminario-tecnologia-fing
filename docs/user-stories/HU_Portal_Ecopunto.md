# **Épica: Recepción y Clasificación Centralizada (Ecopunto)**

Esta sección define las interacciones de los operarios físicos del Ecopunto de FIng, quienes reciben, pesan y clasifican los lotes provenientes de los institutos con asistencia de IA generativa.

---

## **HU-E01: Bandeja de Solicitudes Entrantes (Pantalla B1)**

**Como** operario del Ecopunto

**Quiero** visualizar una bandeja de entrada con los lotes declarados por los institutos que aún no han llegado físicamente

**Para** organizar las tareas de recepción y saber qué esperar en el espacio físico.

**Criterios de Aceptación:**

1. El operario ve un listado de lotes en estado **"Pendiente de envío a Ecopunto"**.
2. El listado muestra por cada lote: Instituto origen, ID del lote, Tamaño declarado, Fecha de solicitud y Foto en miniatura (si fue adjuntada por el Instituto).
3. Al recibir físicamente un lote, el operario presiona el botón **"Marcar como Recibido"** en la fila correspondiente. El lote pasa al estado **"En Ecopunto"** y desaparece de esta bandeja.
4. El sistema muestra el total de lotes pendientes en el encabezado de la bandeja (ej. "3 lotes por recibir").

**Prioridad:** Alta

---

## **HU-E02: Recepción y Clasificación con Asistencia IA (Pantalla B2)**

**Como** operario del Ecopunto

**Quiero** subir una foto del residuo recibido para que la IA me sugiera su categoría según el Decreto 292/024, y poder confirmar o corregir esa sugerencia junto con el peso real

**Para** clasificar correctamente el lote de forma ágil, precisa y trazable.

**Criterios de Aceptación:**

1. La pantalla es accesible desde el listado de lotes en estado "En Ecopunto". El operario selecciona un lote para clasificarlo.
2. La pantalla tiene un área para **subir o tomar una foto** del equipamiento del lote. Muestra previsualización de la imagen seleccionada.
3. Al presionar **"Clasificar con IA"**, el sistema envía la imagen a la API de clasificación y muestra un indicador de carga mientras procesa.
4. Una vez procesada, el sistema muestra la **Sugerencia de la IA** con:
   - Categoría sugerida (según las categorías del Decreto 292/024)
   - Nivel de confianza (alto / medio / bajo)
   - Breve observación textual de la IA
5. El operario puede:
   - **Aceptar** la sugerencia con un botón "Confirmar categoría"
   - **Corregir** seleccionando otra categoría desde un menú desplegable con todas las categorías válidas del decreto
6. El operario ingresa el **peso real en kg** mediante teclado numérico. Este campo es obligatorio para guardar.
7. **Manejo de error de IA:** Si la API no responde en 15 segundos o devuelve un error, el sistema muestra el mensaje: *"No se pudo obtener sugerencia de la IA. Por favor, clasificá el lote manualmente."* El menú de categorías queda disponible para que el operario clasifique sin asistencia. El proceso no se bloquea.
8. Al guardar, el lote actualiza su información con el peso real, la categoría final y si fue asistido por IA o clasificado manualmente. El lote pasa al estado **"Clasificado (no publicado)"**.

**Prioridad:** Alta

**Notas Técnicas:** Se consume la API de **OpenRouter** (`https://openrouter.ai/api/v1/chat/completions`) usando el modelo `anthropic/claude-sonnet-4-5` con capacidades de visión. La imagen se envía en Base64 junto con un prompt que lista las categorías del Decreto 292/024 uruguayo. El prompt fuerza una respuesta en JSON estructurado. La API key se obtiene de la variable de entorno `VITE_OPENROUTER_API_KEY`. Ver implementación de referencia en `src/services/claudeVision.js`.

**Categorías válidas (Decreto 292/024):**
- Equipos de Informática y Telecomunicaciones
- Equipos de Audio y Video
- Baterías y Acumuladores
- Electrodomésticos de Línea Blanca
- Equipos de Iluminación
- Herramientas Eléctricas y Electrónicas
- Equipos Médicos
- Otros RAEE

---

## **HU-E03: Gestión de Lotes Listos para Publicar (Pantalla B3)**

**Como** operario del Ecopunto

**Quiero** revisar los lotes ya clasificados, opcionalmente agrupar varios en uno, y publicarlos para que las gestoras puedan solicitarlos

**Para** poner los residuos disponibles en el catálogo con un código de referencia único.

**Criterios de Aceptación:**

1. El operario ve un listado de lotes en estado **"Clasificado (no publicado)"**, mostrando: ID, categoría, peso real, instituto origen y fecha de clasificación.
2. El operario puede seleccionar **uno o varios lotes** mediante checkboxes.
3. Con uno o más lotes seleccionados, puede presionar **"Publicar para Gestoras"**:
   - Si selecciona **un solo lote**: se publica tal cual, manteniendo su ID original.
   - Si selecciona **varios lotes**: el sistema los consolida en un **nuevo lote agrupado**, generando un nuevo ID (formato: `LOT-AAAA-NNN-G`) y un nuevo QR. Los lotes originales quedan internamente vinculados al nuevo lote consolidado.
4. **Comportamiento de QRs al consolidar:** Los QRs de los lotes originales siguen siendo válidos. Al escanearlos, la Vista Pública muestra el historial del lote original e indica que fue consolidado con el lote `LOT-AAAA-NNN-G`, con enlace al lote consolidado.
5. Al publicar, el sistema genera automáticamente un **código QR** asociado al lote (o lote consolidado).
6. El lote publicado pasa al estado **"Disponible para retiro"** y desaparece de esta bandeja.

**Prioridad:** Media

**Notas Técnicas:** El QR se genera en el frontend con `qrcode.react`. La lógica de consolidación actualiza el array de lotes en el contexto global de la app.
