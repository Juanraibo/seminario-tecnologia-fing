# Sistema de Diseño Enterprise - EcoFIng

**Versión:** 2.0  
**Fecha:** 3 de mayo de 2026  
**Estilo:** Enterprise Modern Refined (inspirado en Notion, Linear, Figma)

---

## Filosofía de Diseño

EcoFIng v2 adopta un enfoque **Enterprise Modern** que prioriza:

- ✅ **Funcionalidad sobre decoración**
- ✅ **Claridad y legibilidad**
- ✅ **Productividad del usuario**
- ✅ **Mantenibilidad del código**
- ✅ **Rendimiento optimizado**

---

## Sistema de Colores

### Paleta Simplificada

Reducimos la paleta a **un solo color de marca** + grises neutros:

```js
primary: {
  500: '#10b981' // Verde esmeralda - único color de marca
  // Escala completa 50-950 disponible
}

// Solo grises neutrales (gray-50 a gray-950)
// Sin secondary, accent, teal (eliminados)
```

### Uso de Colores

- **Primary (verde):** Solo para acciones primarias, estados activos, links importantes
- **Grises:** Todo lo demás (backgrounds, borders, texto)
- **Estados semánticos:** Usar colores nativos de Tailwind (red, emerald, amber, blue)

---

## Tipografía

**Familia:** `Inter` (única fuente para toda la app)

**Tamaños:**
- `text-xs` (12px) - Labels, shortcuts, metadata
- `text-sm` (14px) - Body text, botones, inputs
- `text-base` (16px) - Párrafos principales
- `text-lg` (18px) - Subtítulos
- `text-2xl` (24px) - Page headers
- `text-3xl` (30px) - Hero titles (máximo)

**Pesos:**
- `font-medium` (500) - Default para botones, labels
- `font-semibold` (600) - Headings, nav items activos
- `font-bold` (700) - Page titles

---

## Espaciado

Sistema basado en **múltiplos de 4px**:

- `p-4` (16px) - Padding estándar
- `gap-4` (16px) - Gap entre elementos
- `space-y-6` (24px) - Espacio entre secciones

**Spacing scale:** 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24

---

## Sombras

Eliminamos efectos decorativos (glass, glow). Solo sombras funcionales:

```js
shadow-enterprise-sm: '0 1px 2px rgba(0, 0, 0, 0.04)'
shadow-enterprise: '0 1px 3px rgba(0, 0, 0, 0.08)'
shadow-enterprise-md: '0 2px 4px rgba(0, 0, 0, 0.08)'
shadow-enterprise-lg: '0 4px 6px rgba(0, 0, 0, 0.1)'
```

**Uso:**
- Cards: `shadow-enterprise`
- Hover: `shadow-enterprise-md`
- Modals: `shadow-enterprise-lg`
- Botones: `shadow-enterprise-sm`

---

## Border Radius

Conservador y funcional:

```js
rounded-sm: 4px
rounded (default): 6px
rounded-md: 8px
rounded-lg: 8px // Máximo para Enterprise
```

**No usar:** `rounded-xl`, `rounded-2xl`, `rounded-3xl` (demasiado redondeado)

---

## Animaciones

Simplificadas al mínimo:

```js
// Solo una animación
animate-fade-in: 'fadeIn 0.15s ease-out'

// Todas las transiciones
transition-colors duration-100
```

**Eliminadas:** slide-up, scale-in, pulse-slow, slide-in-* (decorativas)

---

## Componentes

### Button

**Variantes:**
- `primary` - Gris oscuro (default)
- `secondary` - Blanco con border
- `ghost` - Transparente
- `danger` - Rojo

**Tamaños:** `sm`, `md`, `lg`

**Ejemplo:**
```jsx
<Button variant="primary" size="md" icon={<Plus size={16} />}>
  Nueva Solicitud
</Button>
```

### Card

Estilo limpio con clase `enterprise-card`:

```jsx
<Card title="Título" subtitle="Descripción">
  {children}
</Card>
```

**Variantes:** Solo `default` (eliminamos `glass` y `gradient`)

### StatusBadge

Dot indicator + texto:

```jsx
<StatusBadge estado={lote.estado} size="sm" />
```

**Colores sutiles**, sin glow effects.

### DataTable

Filas con hover state usando `enterprise-table-row`:

```jsx
<DataTable
  columns={columns}
  data={data}
  onRowClick={handleClick}
/>
```

---

## Layout

### Sidebar

- **Ancho:** 240px fijo
- **Estilo:** Notion-like con shortcuts visibles
- **Background:** `bg-gray-50 dark:bg-gray-950`
- **Nav items:** Clase `.nav-item` con estados hover/active

**Shortcuts:** Texto gris sutil (no kbd boxes decorativos)

### TopBar

- **Altura:** 56px (14 en Tailwind)
- **Breadcrumb:** Texto xs, sin efectos
- **Acciones:** Botones compactos

### Main Content

```jsx
<div className="space-y-6">
  <PageHeader title="..." description="..." />
  {/* Content */}
</div>
```

---

## Utilidades CSS Personalizadas

### `.enterprise-card`

Card estándar con hover:

```css
.enterprise-card {
  @apply bg-white dark:bg-gray-900 
         border border-gray-200 dark:border-gray-800 
         rounded-lg shadow-enterprise
         transition-all duration-100;
}

.enterprise-card:hover {
  @apply border-gray-300 dark:border-gray-700 
         shadow-enterprise-md;
}
```

### `.enterprise-table-row`

Fila de tabla con hover:

```css
.enterprise-table-row {
  @apply border-b border-gray-100 dark:border-gray-800/50
         transition-colors duration-75;
}

.enterprise-table-row:hover {
  @apply bg-gray-50 dark:bg-gray-900/50;
}
```

### `.nav-item`

Item de navegación en sidebar:

```css
.nav-item {
  @apply flex items-center gap-2 
         px-2 py-1.5 rounded-md text-sm font-medium
         text-gray-700 dark:text-gray-300
         transition-colors duration-75;
}

.nav-item:hover {
  @apply bg-gray-100 dark:bg-gray-800;
}

.nav-item.active {
  @apply bg-gray-200 dark:bg-gray-700 
         text-gray-900 dark:text-white;
}
```

---

## Dark Mode

Estrategia: `class` (toggle manual + localStorage)

**Variables CSS:**
```css
:root {
  --color-bg-base: 250 250 250;
  --color-bg-elevated: 255 255 255;
}

.dark {
  --color-bg-base: 10 10 10;
  --color-bg-elevated: 23 23 23;
}
```

**Uso en componentes:** Siempre incluir variante dark desde el inicio.

---

## Eliminado del Sistema Anterior

🗑️ **Removido:**
- Glassmorphism (`.glass`, `backdrop-blur`)
- Glow effects (`shadow-glow-*`)
- Paletas secondary, accent, teal
- Gradientes decorativos
- Animaciones complejas (slide, scale, pulse-slow)
- Border radius extremos (xl, 2xl, 3xl)

---

## Buenas Prácticas

### ✅ Hacer

- Usar componentes base (Button, Card, etc.)
- Mantener spacing consistente (4px scale)
- Aplicar dark mode desde el inicio
- Usar `enterprise-*` utilidades
- Priorizar funcionalidad sobre estética

### ❌ Evitar

- Crear variantes nuevas sin necesidad
- Hardcodear colores (usar Tailwind classes)
- Efectos decorativos (shadows, blur, glow)
- Animaciones largas (>200ms)
- Border radius grandes (>8px)

---

## Migración desde v1

### Cambios de Clases

| v1 (Glass Premium) | v2 (Enterprise) |
|--------------------|-----------------|
| `glass` | `enterprise-card` |
| `shadow-glass` | `shadow-enterprise-md` |
| `rounded-2xl` | `rounded-lg` |
| `bg-primary-50` (active) | `bg-gray-200` |
| `text-gradient` | `text-gray-900` |
| `shadow-glow-primary` | `shadow-enterprise` |

### Componentes Actualizados

Todos los componentes en `app/src/components/` ya están migrados a v2.

---

## Referencias

- **Inspiración:** Notion, Linear, Figma, GitHub Projects
- **Framework:** TailwindCSS 3
- **Tipografía:** [Inter](https://fonts.google.com/specimen/Inter)
- **Iconos:** Lucide React

---

**Actualizado por:** Claude Code  
**Equipo:** EcoFIng (Carmela González, Verónica Iriarte, Juan Raimondo)
