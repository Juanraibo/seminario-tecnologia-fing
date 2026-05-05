# Prompt 05 — Sprint 3: Vista Pública (HU-P01)
# Usar en Sesión 6

---

Leé `docs/user-stories/HU_Vista_Publica.md`.

## `app/src/portals/publico/Trazabilidad.jsx`

Esta pantalla es pública (sin login). Recibe el ID por URL: `/trazabilidad?lote=LOT-2026-001`

**Diseño mobile-first** (max-width 480px en móvil, centrado en desktop).

1. Header con logo EcoFIng y texto "Trazabilidad de Residuo Electrónico"

2. Si el ID no existe en el contexto → mensaje de error amigable con ícono

3. Si existe → mostrar:

**Bloque de identificación:**
- ID del lote, categoría (si está clasificado), peso real (si existe)
- Instituto de origen

**Línea de tiempo vertical** con estos hitos:
- Cada hito tiene: ícono ✅ o ⏳ · título · fecha (o "Pendiente")
- Origen: Instituto X — [fecha_solicitud]
- Recepción: Ecopunto FIng — [fecha_recepcion_ecopunto]
- Clasificación: [categoria_final] — [fecha_clasificacion]
- Asignación: Gestora [gestora_asignada] — [fecha_aprobacion]
- Certificado: N° [certificado_numero] — [fecha_certificado]

**Bloque de impacto ambiental** (solo si tiene peso_real_kg):
- Card verde con: "Al gestionar X kg de RAEE, FIng evitó Y kg de CO2"
- Desglose: Cobre ~Z kg · Aluminio ~W kg · Plástico ~V kg
- Calcular usando `config.json`

**Si está Finalizado:** banner destacado "✅ Cumplimiento validado — Certificado N° XXX"

**Si es lote consolidado** (tiene campo `consolidado_en`): nota informativa con link al lote consolidado

---

# Prompt 06 — Sprint 4: Pulido Final
# Usar en Sesión 7

---

El sistema tiene todos los portales funcionando. Ahora pulimos para la presentación.

## 1. Consistencia visual

Revisá los 5 portales y asegurate que todos tengan:
- El mismo header (ya definido en `LayoutAutenticado` de `App.jsx`)
- Navegación interna con tabs o sidebar según el portal
- Mensajes de error y estados vacíos en todas las listas
- Toasts de confirmación en todas las acciones importantes

## 2. Componente Toast global

Creá `app/src/components/Toast.jsx`:
- Aparece en esquina inferior derecha
- Desaparece solo después de 3 segundos
- Variantes: success (verde), error (rojo), info (azul)
- Integrarlo en `App.jsx` como overlay global
- Agregar acción `MOSTRAR_TOAST` al reducer del contexto

## 3. Datos demo para la presentación

Revisá `app/src/data/lotes.json` y asegurate de tener al menos:
- 1 lote en cada estado del flujo
- Lotes de distintos institutos (INCO e IIE mínimo)
- Al menos 1 lote "Finalizado" con certificado
- Al menos 1 lote "Solicitado" con 2 gestoras compitiendo

## 4. README final

Actualizá `README.md` con:
- Screenshot o descripción de cada portal
- Instrucciones de instalación claras
- Lista de todas las funcionalidades implementadas vs. pendientes

## 5. CHANGELOG

Actualizá `CHANGELOG.md` con la entrada de la Sesión 7 documentando todo lo que se implementó y las decisiones tomadas.
