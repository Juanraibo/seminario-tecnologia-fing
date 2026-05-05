# **Épica: Gestión de Empresas Autorizadas (Gestoras)**

Esta sección corresponde a las interacciones de las empresas externas autorizadas (Gestoras de RAEE) que retiran los residuos electrónicos de la Facultad para su disposición final o reciclaje, en cumplimiento del Decreto 292/024.

---

## **HU-G01: Catálogo de Lotes Disponibles y Scoring (Pantalla C1)**

**Como** representante de una empresa gestora

**Quiero** ver un catálogo de los lotes disponibles en el Ecopunto de FIng y conocer mi puntaje actual de reputación (Scoring)

**Para** evaluar qué materiales me interesa retirar en función de mis capacidades y de la confianza que he construido con FIng.

**Criterios de Aceptación:**

1. En un lugar destacado de la pantalla se muestra el **Scoring de la empresa**, compuesto por:
   - **Puntaje numérico** (0–100 puntos, calculado según HU-G03)
   - **Nivel de reputación visual** representado en estrellas o badge: Bronce (0–39), Plata (40–69), Oro (70–100)
   - **Sello Verde** (ícono destacado) si la empresa tiene Habilitación del Ministerio de Ambiente vigente y un Scoring ≥ 70
2. El catálogo muestra **tarjetas (cards)** por cada lote disponible. Cada card incluye:
   - Categoría de RAEE (ej. "Equipos de Informática")
   - Peso real en kg
   - Fecha de publicación
   - Foto en miniatura del lote
   - Botón **"Ver detalle"** que navega a la Pantalla C2
3. El catálogo puede **filtrarse por Categoría** mediante un selector desplegable. El filtro "Todas las categorías" muestra todo.
4. Solo pueden acceder a esta pantalla las gestoras con **Habilitación Ministerio de Ambiente marcada como Vigente** por el Administrador (HU-A02). Si la habilitación está vencida, se muestra un mensaje informativo bloqueando el acceso al catálogo.

**Prioridad:** Alta

---

## **HU-G02: Detalle de Lote y Solicitud de Retiro (Pantalla C2)**

**Como** representante de una empresa gestora

**Quiero** ver el detalle completo de un lote disponible y postularme formalmente para retirarlo

**Para** integrarlo a mi flujo logístico de trabajo y cumplir con la regulación vigente.

**Criterios de Aceptación:**

1. Al hacer clic en una card del catálogo (C1), se muestra el **detalle completo del lote**: ID, categoría, peso real (kg), fecha de publicación, instituto de origen, foto(s) y observaciones del Ecopunto.
2. Existe un botón destacado **"Ofrecer retiro"**.
3. Al presionar "Ofrecer retiro", aparece un **diálogo de confirmación** que:
   - Muestra el resumen del lote a retirar
   - Solicita opcionalmente una **cotización o propuesta económica** (campo numérico en USD o UYU, a definir por el equipo)
   - Informa que la solicitud quedará **"Pendiente de aprobación"** por la administración de FIng
   - Tiene botones "Confirmar solicitud" y "Cancelar"
4. Una vez confirmado, el lote permanece visible en el catálogo para que **otras gestoras también puedan postularse** al mismo retiro, hasta que un Administrador asigne y apruebe una.
5. Si la gestora ya tiene una solicitud activa sobre ese lote, el botón "Ofrecer retiro" se reemplaza por el texto **"Solicitud enviada — pendiente de aprobación"** (no accionable).

**Prioridad:** Alta

---

## **HU-G03: Mis Retiros y Carga de Certificado (Pantalla C3)**

**Como** representante de una empresa gestora

**Quiero** ver los lotes cuyo retiro me fue aprobado y subir el Certificado de Disposición Final una vez que los procese

**Para** cumplir con la obligación legal y mejorar mi Scoring de reputación dentro del sistema.

**Criterios de Aceptación:**

1. La pantalla muestra dos secciones:
   - **Retiros aprobados pendientes de certificado:** lotes en estado "Retiro Aprobado — Pendiente de Certificado", con fecha límite estimada de entrega del certificado.
   - **Historial de retiros completados:** lotes en estado "Finalizado", con fecha de entrega del certificado y puntaje obtenido.
2. En cada fila de "Retiros aprobados" existe un botón **"Subir Certificado"**.
3. Al presionar "Subir Certificado", el sistema permite **seleccionar un archivo PDF** desde el dispositivo local. En el MVP se simula la subida mostrando el nombre del archivo y marcando como cargado.
4. Al subir el certificado exitosamente:
   - El lote pasa al estado **"Finalizado"**
   - El sistema actualiza el Scoring de la empresa según la siguiente fórmula (ver Notas Técnicas)
   - Se muestra un mensaje de confirmación indicando el nuevo puntaje obtenido
5. Si el certificado se sube **dentro de los 30 días** de aprobado el retiro: +10 puntos al Scoring.
6. Si el certificado se sube **entre 31 y 60 días**: +5 puntos al Scoring.
7. Si el certificado se sube **con más de 60 días de demora**: +2 puntos al Scoring (se cumplió, pero tarde).
8. **El Scoring nunca baja automáticamente**; solo sube al subir certificados. El Administrador puede ajustarlo manualmente si detecta incumplimientos (esto es una función futura, no del MVP).

**Prioridad:** Alta

**Notas Técnicas — Fórmula de Scoring:**

```
Scoring inicial al registrarse: 50 puntos

Por cada certificado subido a tiempo (≤ 30 días):  +10 puntos
Por cada certificado subido con demora (31–60 días): +5 puntos
Por cada certificado subido muy tarde (> 60 días):   +2 puntos

Techo: 100 puntos
```

El scoring se almacena en `src/data/gestoras.json` y se actualiza en el contexto de la app al simular la subida del certificado. En el MVP, las "fechas" para calcular demora se toman del campo `fecha_aprobacion` del lote comparado con la fecha actual del sistema.
