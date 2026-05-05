# **Épica: Transparencia Ciudadana y Comunicación Ambiental**

Esta épica refiere al portal abierto y público al que cualquier ciudadano, estudiante o auditor puede acceder sin necesidad de usuario ni contraseña, garantizando la transparencia del manejo de RAEE en UdelaR.

---

## **HU-P01: Trazabilidad Pública Vía Código QR (Pantalla E1)**

**Como** ciudadano o integrante de la comunidad académica

**Quiero** escanear un código QR pegado en un equipo en desuso para acceder a una página web pública

**Para** conocer de dónde salió el residuo, quién lo procesó y cuál fue el impacto ambiental de reciclarlo correctamente.

**Criterios de Aceptación:**

1. La URL **no requiere autenticación**. Cualquier persona con el enlace puede acceder.
2. La pantalla recibe el ID del lote como parámetro en la URL: `/trazabilidad?lote=LOT-2025-001`. Si el ID no existe o es inválido, se muestra un mensaje de error amigable: *"No encontramos información para este código. Verificá que el QR esté en buen estado."*
3. El diseño es **mobile-first** (pensado para usuarios que escanean desde su celular). Se adapta correctamente a pantallas de escritorio también.
4. La pantalla muestra el **Journey completo del lote** en forma de línea de tiempo:
   - ✅ **Origen:** Instituto X — *[fecha de solicitud]*
   - ✅ **Recepción:** Recibido en Ecopunto FIng — *[fecha de recepción]*
   - ✅ / ⏳ **Clasificación:** Categoría de RAEE confirmada — *[fecha de clasificación o "En proceso"]*
   - ✅ / ⏳ **Destino final:** Entregado a Gestora Y — *[fecha de retiro o "Pendiente de asignación"]*
   - ✅ / ⏳ **Certificado:** Disposición final certificada — *[número de certificado y fecha, o "Pendiente"]*
5. La pantalla incluye un bloque de **"Impacto Ambiental de este lote"**, calculado con los coeficientes del sistema:
   - Ejemplo: *"Al gestionar estos 15 kg de RAEE, FIng evitó aproximadamente 21 kg de CO2"*
   - Incluye el desglose estimado de materiales recuperados (Cobre, Aluminio, Plásticos)
6. Si el lote fue **procesado completamente**, se muestra un recuadro destacado: *"✅ Cumplimiento validado — Certificado N° CERT-2025-088"*
7. **Comportamiento especial para lotes consolidados:** Si el QR pertenece a un lote original que fue consolidado en uno mayor, la pantalla muestra el historial del lote original y agrega una nota: *"Este lote fue consolidado con otros residuos. Ver lote consolidado [LOT-AAAA-NNN-G]"* con enlace a la trazabilidad del lote consolidado.

**Prioridad:** Alta

**Valor de Negocio:** Es la vitrina pública del proyecto. Cumple con los objetivos estratégicos de posicionar a FIng como referente en transparencia y gestión ambiental responsable.

**Notas Técnicas:** Esta pantalla lee los datos del lote desde el contexto global de la app (que a su vez carga `src/data/lotes.json`). No requiere llamadas a API externas. Los coeficientes de impacto ambiental se obtienen de `src/data/config.json`.
