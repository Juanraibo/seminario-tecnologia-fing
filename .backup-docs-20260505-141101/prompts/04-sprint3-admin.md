# Prompt 04 — Sprint 3: Portal Administrador
# Usar en Sesión 6
# Construye HU-A01, HU-A02, HU-A03

---

Leé `docs/user-stories/HU_Portal_Administrador.md` antes de empezar.

---

## HU-A01: Dashboard Global — `app/src/portals/admin/Dashboard.jsx`

Calcular todo dinámicamente desde `state.lotes` y `state.config`:

**KPI Cards (fila superior):**
- Total kg gestionados: suma de `peso_real_kg` de todos los lotes con peso
- CO2 evitado (kg): total_kg × `config.factor_co2_por_kg`
- Cobre recuperado (kg): total_kg × `config.materiales_recuperados_pct.cobre`
- Aluminio recuperado: ídem aluminio
- % lotes con certificado: lotes "Finalizado" / total lotes

**Gráfico de barras** (usar Recharts `BarChart`):
- Eje X: nombre de cada instituto
- Eje Y: kg totales por instituto
- Calcular agrupando lotes por `institutoId` y sumando `peso_real_kg`

**Gráfico de torta** (usar Recharts `PieChart`):
- "Con certificado" vs "En proceso"

---

## HU-A02: Gestión de Actores — `app/src/portals/admin/GestionActores.jsx`

Tres tabs: Institutos | Operarios Ecopunto | Gestoras

**Tab Institutos:** tabla con datos de `state.institutos`. Botón "Agregar" abre formulario simple (nombre, sigla, email). Al guardar, agregar al estado local del componente (no persiste — es MVP).

**Tab Operarios:** lista estática con los usuarios de rol "ecopunto" de `state.usuarios`. Botones Alta/Baja simulados que cambian un estado local `activo`.

**Tab Gestoras:** tabla con nombre, email, scoring (ScoringBadge) y toggle de habilitación. Al cambiar el toggle: mostrar diálogo de confirmación, luego dispatch `TOGGLE_HABILITACION_GESTORA`.

---

## HU-A03: Aprobación de Retiros — `app/src/portals/admin/AprobacionRetiros.jsx`

1. Listar lotes con estado `ESTADOS_LOTE.SOLICITADO`
2. Cada lote expandible (accordion) mostrando:
   - Datos del lote
   - Tabla de gestoras que solicitaron: nombre · scoring · habilitación · cotización ofrecida
3. Radio buttons para seleccionar la gestora ganadora
4. Botón "Aprobar retiro" (requiere selección):
   - Dispatch `ACTUALIZAR_LOTE` con estado `RETIRO_APROBADO`, `gestora_asignada`, `fecha_aprobacion`
   - Toast: "Retiro aprobado — ReciclaUY S.A. fue notificada"
5. Botón "Rechazar todas":
   - Dispatch `ACTUALIZAR_LOTE` con estado `DISPONIBLE`, limpiar `solicitudes_gestoras`
   - Toast: "Solicitudes rechazadas — lote vuelve al catálogo"

**Routing Admin:**
- `/admin` → Dashboard
- `/admin/actores` → GestionActores
- `/admin/retiros` → AprobacionRetiros

Navegación con tabs: "Dashboard" | "Actores" | "Aprobación de retiros"
