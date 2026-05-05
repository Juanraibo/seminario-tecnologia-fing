# Capturas de Pantalla y Rediseño con Stitch

**Objetivo:** Capturar todas las páginas del sistema para rediseñarlas en Google Stitch con un diseño moderno.

---

## 📸 Cómo Hacer las Capturas

### Opción 1: Captura de Pantalla Completa (Chrome/Edge)

1. **Abrir DevTools:**
   - Presionar `F12` o `Ctrl+Shift+I`

2. **Activar modo responsive:**
   - Presionar `Ctrl+Shift+M` o click en el ícono de dispositivos

3. **Seleccionar resolución:**
   - Desktop: `1920x1080` (full HD)
   - O mejor: `2560x1440` (2K para más detalle)

4. **Captura de página completa:**
   - Abrir Command Menu: `Ctrl+Shift+P`
   - Escribir: "Capture full size screenshot"
   - Enter

5. **Repetir para cada página**

### Opción 2: Extensión de Chrome (Más Fácil)

**Recomendado:** [Awesome Screenshot](https://chrome.google.com/webstore/detail/awesome-screenshot)

1. Instalar extensión
2. Click en ícono → "Capture entire page"
3. Guardar imagen

---

## 📋 Lista de Páginas a Capturar

### Login y Autenticación
- [ ] **01-login.png** — Página de login (http://localhost:5173/login)

### Portal Instituto (login: inco@fing.edu.uy / inco123)
- [ ] **02-instituto-dashboard.png** — Dashboard principal
- [ ] **03-instituto-nueva-solicitud.png** — Formulario nueva solicitud
- [ ] **04-instituto-detalle-lote.png** — Detalle de un lote existente

### Portal Ecopunto (login: ecopunto@fing.edu.uy / eco123)
- [ ] **05-ecopunto-dashboard.png** — Dashboard con filtros
- [ ] **06-ecopunto-clasificar.png** — Clasificación de ítems con IA
- [ ] **07-ecopunto-publicar.png** — Publicación de lotes

### Portal Gestora (login: gestora1@reciclauY.com / gest123)
- [ ] **08-gestora-dashboard.png** — Catálogo de lotes
- [ ] **09-gestora-detalle-lote.png** — Detalle con cotización
- [ ] **10-gestora-solicitudes.png** — Mis solicitudes y scoring

### Portal Admin (login: admin@fing.edu.uy / admin123)
- [ ] **11-admin-dashboard.png** — Dashboard con KPIs y gráficos
- [ ] **12-admin-actores.png** — Gestión de actores (tab Gestoras)
- [ ] **13-admin-retiros.png** — Aprobación de retiros

### Vista Pública (sin login)
- [ ] **14-publica-trazabilidad.png** — Timeline de trazabilidad
  - URL: http://localhost:5173/trazabilidad?lote=PUB-2026-001

---

## 🎨 Prompt para Google Stitch / Claude Artifacts

Copiar y pegar este prompt en Stitch junto con las capturas:

```
Necesito rediseñar este sistema web de gestión de RAEE (Residuos Electrónicos) con un diseño moderno y profesional.

CONTEXTO DEL PROYECTO:
- Sistema de gestión para Facultad de Ingeniería (UdelaR, Uruguay)
- 4 portales + 1 vista pública
- Usuarios: Institutos, Ecopunto (clasificación), Gestoras (retiro), Admin
- Objetivo: Trazabilidad completa de residuos electrónicos

STACK TECNOLÓGICO ACTUAL (mantener):
- React 18
- Vite 5
- TailwindCSS 3 (utility-first)
- React Router v6
- Lucide React (iconos)
- Recharts (gráficos)
- Dark mode implementado

DISEÑO OBJETIVO:
- **Estilo:** Moderno, minimalista, profesional
- **Inspiración:** Linear, Vercel Dashboard, Stripe
- **Colores:** 
  - Primario: Verde (sostenibilidad) #10b981 o similar
  - Secundario: Azul tecnológico #3b82f6
  - Fondo dark: Gradientes sutiles, glassmorphism
- **Componentes:** Cards con bordes sutiles, sombras suaves, espaciado generoso
- **Tipografía:** Inter (ya implementada), jerarquía clara
- **Efectos:** Hover states, transiciones suaves, micro-interacciones

SECCIONES A REDISEÑAR:

1. LOGIN (01-login.png):
   - Layout centrado moderno
   - Ilustración o gradiente de fondo
   - Card glassmorphism para el form
   - Botones con estados hover

2. DASHBOARDS (02, 05, 08, 11):
   - Layout con sidebar fixed (opcional)
   - Cards de estadísticas con iconos grandes
   - Tablas/listas con mejores estilos
   - Gráficos integrados elegantemente

3. FORMULARIOS (03, 06, 07, 09):
   - Inputs con labels floating
   - Mejor spacing entre campos
   - Botones primarios destacados
   - Feedback visual inline

4. TABLAS Y LISTAS (04, 10, 12, 13):
   - Row hover effects
   - Mejor uso de colores para estados
   - Acciones con iconos claros
   - Paginación moderna

5. VISTA PÚBLICA (14):
   - Timeline vertical elegante
   - Iconos grandes por etapa
   - Colores por tipo de acción
   - Footer educativo destacado

COMPONENTES A MANTENER:
- StatusBadge (con mejoras visuales)
- Estructura de rutas React Router
- Integración con Recharts
- Sistema de iconos Lucide

COMPONENTES A MEJORAR:
✅ Buttons: Variantes claras (primary, secondary, ghost, danger)
✅ Cards: Bordes sutiles, sombras, glassmorphism
✅ Inputs: Labels, estados focus, error states
✅ Modals/Dialogs: Backdrop blur, animaciones
✅ Toasts/Notifications: Posición fixed top-right, animación slide-in
✅ Tablas: Hover rows, sticky headers, mejor padding

NO CAMBIAR:
- Funcionalidad existente
- Estructura de datos
- Lógica de negocio
- Rutas y navegación

ENTREGABLE:
Para cada página capturada, generar:
1. Código React con TailwindCSS
2. Mantener estructura de componentes actual
3. Solo cambiar estilos (className)
4. Incluir dark mode compatible
5. Responsive mobile-first

¿Puedes empezar rediseñando el Dashboard del Admin (11-admin-dashboard.png)?
Genera el código React + Tailwind con el nuevo diseño.
```

---

## 🎯 Workflow Recomendado

### Paso 1: Hacer Capturas (30 min)
1. Levantar proyecto: `cd app && npm run dev`
2. Capturar las 14 páginas siguiendo la lista
3. Guardar en `docs/capturas/` con nombres descriptivos

### Paso 2: Rediseñar en Stitch (Iterativo)

**Por cada portal:**

1. **Subir 3-4 capturas relacionadas** (ej: Admin Dashboard, Actores, Retiros)

2. **Usar el prompt de arriba** + agregar:
   ```
   Estas son las pantallas del Portal Admin.
   Quiero un rediseño moderno manteniendo React + Tailwind.
   Empieza por el Dashboard (captura 11).
   ```

3. **Iterar con Stitch:**
   - "Hazlo más minimalista"
   - "Usa gradientes sutiles en el fondo"
   - "Mejora los cards de KPIs"
   - "Agrega efectos hover"

4. **Copiar código generado** a tus componentes

5. **Ajustar si es necesario**

### Paso 3: Aplicar al Proyecto

1. Reemplazar estilos en componentes uno por uno
2. Probar que funcionalidad se mantiene
3. Ajustar responsive si hace falta
4. Commit por portal rediseñado

---

## 🎨 Paleta de Colores Sugerida

```css
/* Primarios - Sostenibilidad */
--green-50: #f0fdf4
--green-500: #10b981  /* Principal */
--green-600: #059669
--green-900: #064e3b

/* Secundarios - Tecnología */
--blue-500: #3b82f6
--blue-600: #2563eb

/* Neutrales - Dark Mode */
--gray-50: #f9fafb
--gray-900: #111827
--gray-950: #030712

/* Estados */
--amber-500: #f59e0b  /* Warning */
--red-500: #ef4444     /* Error */
--purple-500: #a855f7  /* Info */
```

---

## 📐 Sistema de Espaciado

```
Padding/Margin:
- xs: 0.5rem (8px)
- sm: 0.75rem (12px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

Bordes:
- Border radius: 0.5rem (8px) normal, 1rem (16px) cards grandes
- Border width: 1px normal

Sombras:
- sm: Subtle cards
- md: Elevated cards  
- lg: Modals
- xl: Popovers
```

---

## ✅ Checklist de Rediseño

Por cada componente rediseñado:
- [ ] Mantiene funcionalidad original
- [ ] Estilos solo con Tailwind
- [ ] Dark mode funciona
- [ ] Responsive mobile
- [ ] Hover states definidos
- [ ] Transiciones suaves
- [ ] Accesibilidad (contrast, aria)

---

## 📊 Prioridad de Rediseño

Si no hay tiempo para todo, priorizar:

1. **Alta:** Login + Admin Dashboard (más visible en demo)
2. **Alta:** Gestora Dashboard (diferenciador: cotizaciones)
3. **Media:** Ecopunto Clasificar (feature de IA)
4. **Media:** Vista Pública (trazabilidad)
5. **Baja:** Formularios secundarios

---

## 💡 Tips para Stitch

**Buenos prompts de iteración:**
- "Hazlo más espacioso"
- "Usa glassmorphism en los cards"
- "Agrega gradientes sutiles al fondo"
- "Mejora la jerarquía visual"
- "Haz los botones más prominentes"
- "Agrega iconos más grandes"
- "Mejora el contraste de texto"

**Malos prompts:**
- "Hazlo bonito" (muy vago)
- "Cambia todo" (pierde contexto)
- "Usa otro framework" (rompe el stack)

---

**Creado:** 27 de abril de 2026  
**Para:** Rediseño moderno del MVP EcoFIng
