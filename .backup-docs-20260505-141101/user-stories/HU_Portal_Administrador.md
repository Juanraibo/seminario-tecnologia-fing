# **Épica: Gobernanza, Auditoría y Control Central**

Esta sección es utilizada por el perfil de "Administrador FIng" (ej. Intendencia de la Facultad o Comisión Ambiental), encargado de orquestar el sistema, validar actores y vigilar el cumplimiento de las metas ambientales.

---

## **HU-A01: Dashboard Global de Impacto (Pantalla D1)**

**Como** Administrador del sistema

**Quiero** visualizar un tablero general con las métricas consolidadas de operación e impacto ambiental

**Para** generar reportes institucionales y evaluar el éxito del programa EcoFIng.

**Criterios de Aceptación:**

1. El dashboard muestra los siguientes **KPIs principales** en tarjetas destacadas:
   - Total de kg de RAEE gestionados (histórico y del año en curso)
   - Equivalente de CO2 evitado en kg (calculado con el factor configurado en `config.json`: 1.4 kg CO2 por kg de RAEE)
   - Desglose estimado de materiales recuperados: Cobre, Aluminio, Plásticos (calculados con los porcentajes de `config.json`)
2. Muestra un **gráfico de barras** indicando qué Institutos generan mayor volumen de RAEE (en kg).
3. Muestra un **gráfico de torta o indicador porcentual** con la proporción de lotes que ya cuentan con Certificado de Disposición Final emitido vs. los que están en proceso.
4. Todos los KPIs y gráficos se calculan dinámicamente a partir de los datos en `src/data/lotes.json`.

**Prioridad:** Alta

**Notas Técnicas:** Los factores de conversión para el impacto ambiental se toman de `src/data/config.json` (Anexo D del documento de especificación). Para el MVP se puede usar una librería liviana de gráficos como Recharts.

---

## **HU-A02: Gestión de Actores — Institutos, Ecopunto y Gestoras (Pantalla D2)**

**Como** Administrador del sistema

**Quiero** tener un panel para visualizar y gestionar los usuarios de Institutos, los operarios del Ecopunto y las empresas gestoras

**Para** asegurar que solo operan entidades autorizadas por el Ministerio de Ambiente y personal designado por FIng.

**Criterios de Aceptación:**

1. La pantalla se organiza en **tres secciones o pestañas**:
   - **Institutos registrados:** listado con nombre, sigla y usuario responsable. Botón "Agregar Instituto" (abre formulario con nombre, sigla y email del responsable).
   - **Operarios del Ecopunto:** listado con nombre y estado (activo/inactivo). Botones de "Alta" y "Baja" por operario.
   - **Empresas Gestoras:** listado con nombre, email de contacto y estado de habilitación.
2. Para cada Gestora, existe un **toggle (interruptor)** que indica si cuenta con **"Habilitación Ministerio de Ambiente Vigente"**. Solo las gestoras con este toggle activado pueden acceder al catálogo (HU-G01).
3. Al cambiar el estado del toggle de una gestora, el sistema muestra un diálogo de confirmación antes de aplicar el cambio.

**Prioridad:** Baja para el flujo core; necesaria para gobernar el sistema.

**Notas Técnicas:** En el MVP, esta pantalla muestra datos estáticos de `src/data/gestoras.json` e `institutos.json`. Los cambios de estado (alta/baja, toggle) se simulan actualizando el estado local de React sin persistencia real. Esto demuestra que el concepto de validación normativa (Decreto 292/024) está contemplado en el diseño del sistema.

---

## **HU-A03: Aprobación de Retiros de Gestoras (Pantalla D3)**

**Como** Administrador del sistema

**Quiero** revisar las solicitudes de retiro que hacen las empresas gestoras y decidir a cuál aprobar

**Para** asignar los lotes priorizando a las empresas con mejor scoring, mayor capacidad técnica o mejor propuesta económica.

**Criterios de Aceptación:**

1. El Administrador ve un listado de lotes en estado **"Solicitado por Gestora/s"**.
2. Al expandir o seleccionar un lote, se muestra el detalle del lote y una tabla con **todas las gestoras que solicitaron ese retiro**, indicando por cada una:
   - Nombre de la empresa
   - Scoring actual (número y nivel: Bronce / Plata / Oro)
   - Habilitación Ministerio de Ambiente (Vigente / No vigente)
   - Cotización o propuesta económica ofrecida (si fue ingresada)
3. El Administrador puede seleccionar la oferta ganadora y presionar **"Aprobar retiro"** para la gestora seleccionada.
4. Al aprobar:
   - El lote pasa al estado **"Retiro Aprobado — Pendiente de Certificado"** y se asigna a la gestora seleccionada.
   - Las solicitudes de las demás gestoras para ese lote se rechazan automáticamente.
   - El sistema muestra una **notificación simulada** (banner o toast) indicando que se notificó a la gestora seleccionada para coordinar la logística de retiro.
5. El Administrador puede también presionar **"Rechazar todas"**. En ese caso, el lote vuelve al estado **"Disponible para retiro"** en el catálogo público de gestoras (HU-G01).

**Prioridad:** Alta
