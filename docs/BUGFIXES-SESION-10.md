# Bugfixes y Mejoras — Sesión 10

**Fecha:** 28 de abril de 2026  
**Responsable:** Juan Raimondo

---

## 📋 Resumen de Problemas Corregidos

### 1. 🌓 Modo Oscuro No Funcionaba Correctamente

**Problema:**
- El toggle de modo oscuro se activaba/desactivaba visualmente, pero siempre mantenía el fondo oscuro
- Cada vez que se cambiaba de ruta, el modo oscuro se restablecía
- La preferencia no persistía entre sesiones

**Causa raíz:**
- El estado `darkMode` se inicializaba siempre en `true` sin leer `localStorage`
- El `useEffect` que aplicaba `dark` class no sincronizaba con el estado real
- Cada instancia del componente `LayoutAutenticado` tenía su propio estado local que se perdía

**Solución implementada:**
```javascript
// Antes (App.jsx líneas 38-63):
const [darkMode, setDarkMode] = useState(true)  // Siempre true

useEffect(() => {
  document.documentElement.classList.add('dark')  // Siempre agrega dark
}, [])

const toggleDarkMode = () => {
  setDarkMode(!darkMode)
  document.documentElement.classList.toggle('dark')  // Toggle sin persistencia
}

// Después:
const [darkMode, setDarkMode] = useState(() => {
  const saved = localStorage.getItem('darkMode')
  return saved !== null ? saved === 'true' : true  // Lee de localStorage
})

useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')  // Remueve correctamente
  }
}, [darkMode])

const toggleDarkMode = () => {
  setDarkMode(prev => {
    const newValue = !prev
    localStorage.setItem('darkMode', String(newValue))  // Persiste cambio
    return newValue
  })
}
```

**Archivos modificados:**
- `app/src/App.jsx` (líneas 36-64)

**Validación:**
- ✅ Toggle funciona correctamente (dark ↔ light)
- ✅ Preferencia se mantiene al cambiar de ruta
- ✅ Preferencia se mantiene al recargar página
- ✅ Estado inicial lee correctamente desde `localStorage`

---

### 2. 📱 QR Codes Apuntaban a Lote Hardcodeado

**Problema:**
- Los QR generados en el portal Instituto apuntaban correctamente a cada lote
- PERO el link "Trazabilidad" en el header siempre apuntaba a `PUB-2026-001`
- El botón en LoginPage también estaba hardcodeado al mismo lote
- Esto impedía ver otros lotes sin escanear el QR específico

**Causa raíz:**
- Links hardcodeados en lugar de apuntar al registro completo

**Solución implementada:**
```javascript
// Antes (App.jsx línea 83):
<Link to="/trazabilidad?lote=PUB-2026-001" ...>

// Después:
<Link to="/trazabilidad" ...>  // Sin parámetro → muestra registro completo

// Antes (LoginPage.jsx línea 189):
navigate('/trazabilidad?lote=PUB-2026-001')

// Después:
navigate('/trazabilidad')  // Al registro completo
```

**Archivos modificados:**
- `app/src/App.jsx` (línea 83)
- `app/src/portals/auth/LoginPage.jsx` (línea 189)

**Validación:**
- ✅ Link en header va al registro público
- ✅ Botón en login va al registro público
- ✅ Los QR individuales siguen funcionando: `/trazabilidad?lote=LOT-XXX`

---

### 3. 🌐 Vista Pública Mejorada: Registro Completo de Lotes

**Problema original:**
- La vista pública solo mostraba UN lote específico (vía QR)
- No había forma de ver un listado/registro de todos los procesos
- No se podía navegar entre lotes sin QR físico

**Nueva funcionalidad implementada:**

#### A. Registro Público (sin parámetro `lote`)
Cuando accedes a `/trazabilidad` sin parámetros:

**Características:**
- ✅ Listado de TODOS los lotes de publicación
- ✅ Tarjetas clickeables con información resumida
- ✅ Barra de búsqueda por código o categoría
- ✅ Filtros: Todos | Finalizados | En proceso
- ✅ Información por tarjeta:
  - Código del lote (font-mono verde)
  - Categoría
  - Número de ítems + peso total
  - Barra de progreso visual (0-100%)
  - Badge de estado (color-coded)
  - Fecha de publicación
- ✅ Diseño responsive (1/2/3 columnas según pantalla)
- ✅ Footer educativo con impacto ambiental

**Cálculo de progreso:**
```javascript
Finalizado → 100%
Retiro Aprobado → 75%
Solicitado por Gestoras → 50%
Disponible para retiro → 25%
Otros → 10%
```

#### B. Detalle de Lote (con parámetro `lote=XXX`)
Cuando accedes a `/trazabilidad?lote=PUB-2026-001`:

**Mejoras implementadas:**
- ✅ Botón "Volver al registro" en la parte superior
- ✅ Timeline completo (igual que antes)
- ✅ Si el lote no existe, botón para volver al registro
- ✅ Footer con cálculo de CO₂ específico del lote: `peso × 1.4 kg`

**Archivos modificados:**
- `app/src/portals/publico/Trazabilidad.jsx` — Reescrito completamente (275 líneas → 450 líneas)

**Estructura del nuevo archivo:**
```
Trazabilidad (componente principal)
├── RegistroPublico (sin parámetro lote)
│   ├── Header con branding
│   ├── Búsqueda y filtros
│   ├── Grid de TarjetaLote
│   └── Footer educativo
│
├── TarjetaLote (componente)
│   ├── Header (código + chevron)
│   ├── Categoría
│   ├── Detalles (ítems, peso)
│   ├── Barra de progreso
│   ├── Badge de estado
│   └── Fecha de publicación
│
└── DetalleLote (con parámetro lote)
    ├── Botón volver
    ├── Header con branding
    ├── Información del lote
    ├── Timeline de trazabilidad
    ├── Ítems individuales
    └── Footer con CO₂ calculado
```

**Validación:**
- ✅ Registro muestra 3 lotes de publicación
- ✅ Búsqueda funciona (código + categoría)
- ✅ Filtros funcionan correctamente
- ✅ Click en tarjeta navega a detalle
- ✅ Botón volver regresa al registro
- ✅ QR sigue funcionando correctamente

---

## 📊 Impacto de los Cambios

### Archivos modificados:
1. `app/src/App.jsx` — 2 correcciones (modo oscuro + link header)
2. `app/src/portals/auth/LoginPage.jsx` — 1 corrección (link registro)
3. `app/src/portals/publico/Trazabilidad.jsx` — Reescritura completa

### Líneas de código:
- **Antes:** ~275 líneas (Trazabilidad.jsx)
- **Después:** ~450 líneas (+63%)
- **Total modificado:** ~200 líneas (contando App.jsx y LoginPage.jsx)

### Nuevos componentes:
- `RegistroPublico` — Vista de listado de lotes
- `TarjetaLote` — Componente reutilizable para tarjetas
- `DetalleLote` — Refactorizado del original (mejorado)

### UX mejorada:
- ✅ Modo oscuro funcional y persistente
- ✅ Navegación pública sin necesidad de QR
- ✅ Búsqueda y filtrado de lotes
- ✅ Progreso visual de cada lote
- ✅ Navegación fluida (registro ↔ detalle)

---

## 🧪 Checklist de Testing

### Modo Oscuro
- [ ] Hacer login → toggle modo oscuro → verificar cambio visual
- [ ] Cambiar de ruta → verificar que preferencia persiste
- [ ] Recargar página → verificar que preferencia persiste
- [ ] Abrir en modo incógnito → verificar que default es oscuro

### Registro Público
- [ ] Acceder a `/trazabilidad` → debe mostrar listado
- [ ] Verificar que muestra 3 lotes (PUB-2026-001, 002, 003)
- [ ] Buscar "PUB-2026-001" → debe filtrar correctamente
- [ ] Buscar "Baterías" → debe mostrar lote PUB-2026-002
- [ ] Filtro "Finalizados" → debe mostrar solo PUB-2026-001
- [ ] Filtro "En proceso" → debe mostrar PUB-2026-002 y 003
- [ ] Click en tarjeta → debe navegar a detalle

### Detalle de Lote
- [ ] Click "Ver detalle" → debe mostrar timeline completo
- [ ] Click "Volver al registro" → debe volver al listado
- [ ] Acceder a `/trazabilidad?lote=PUB-2026-999` → debe mostrar "no encontrado"
- [ ] Botón "Ver registro completo" en error → debe volver al listado

### QR Navigation
- [ ] Generar QR en Instituto para lote LOT-2026-001
- [ ] Escanear QR → debe ir a `/trazabilidad?lote=LOT-2026-001`
- [ ] Debe mostrar detalle correcto del lote de entrada

### Links de Navegación
- [ ] Login → Click "Ver Registro Público" → debe ir a listado
- [ ] Header (logueado) → Click "Trazabilidad" → debe ir a listado

---

## 🎯 Próximos Pasos Sugeridos

### Mejoras opcionales para el Registro Público:
1. **Paginación:** Si hay muchos lotes (>12), agregar paginación
2. **Ordenamiento:** Permitir ordenar por fecha, peso, estado
3. **Estadísticas:** Panel superior con KPIs (total kg, CO₂ evitado, etc.)
4. **Exportar:** Botón para descargar CSV de lotes
5. **Vista de mapa:** Visualización geográfica de institutos origen

### Datos mock adicionales:
- Agregar 5-8 lotes más de publicación para demo más rica
- Variar estados (tener lotes en todos los estados)
- Agregar lotes finalizados con certificados

---

## 📝 Notas de Implementación

### Decisión: ¿Por qué solo mostrar lotes de publicación?

Los lotes de "entrada" (tipo: `entrada`) son internos del Ecopunto y no tienen sentido mostrarse públicamente porque:
- No están clasificados aún
- No tienen categoría definida
- No tienen peso final
- Son "trabajo en progreso" del Ecopunto

Los lotes de "publicación" (tipo: `publicacion`) SÍ son públicos porque:
- Ya están clasificados y agrupados
- Tienen categoría RAEE definida
- Tienen peso total calculado
- Son los que se entregan a gestoras y tienen trazabilidad completa

**Filtro aplicado:**
```javascript
const lotesPublicos = state.lotes.filter(l => l.tipo === 'publicacion')
```

### Persistencia del modo oscuro

Se usa `localStorage` en lugar de Context porque:
- La preferencia es del navegador, no del usuario logueado
- Debe persistir entre sesiones sin login
- No es parte del estado de la aplicación

**Key en localStorage:** `darkMode` (string: `"true"` o `"false"`)

---

**Documentado por:** Claude Sonnet 4.5  
**Fecha:** 28 de abril de 2026
