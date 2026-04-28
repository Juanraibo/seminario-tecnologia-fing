# Prompts IA — Presentación Final EcoFIng

**Uso:** Generar assets visuales para la presentación del 26 de mayo de 2026  
**Herramientas:** Canva AI, Midjourney, DALL-E 3, Leonardo.ai  
**Tiempo estimado:** 2-3 horas de generación

---

## 🎯 Assets Críticos para la Presentación (Orden de Prioridad)

### 1. PORTADA DE PRESENTACIÓN ⭐⭐⭐

**Prompt para Canva AI / Leonardo.ai:**
```
A modern, professional presentation cover slide background for an academic project, dark gradient from deep forest green (#064e3b) to dark navy (#030712), subtle geometric patterns of circuit boards and recycling symbols, clean and minimal design, emerald green (#10b981) accent lines, sustainable technology aesthetic, professional academic presentation, 16:9 aspect ratio, high quality --ar 16:9 --style raw
```

**Elementos de texto a agregar en Canva:**
- Título: "EcoFIng"
- Subtítulo: "Sistema de Gestión de RAEE"
- Bajada: "Facultad de Ingeniería · Universidad de la República"
- Footer: "Seminario de Tecnologías · Mayo 2026"
- Autores: "Carmela González · Verónica Iriarte · Juan Raimondo"

**Color scheme para texto:**
- Título: Blanco (#FFFFFF) - Bold
- Subtítulo: Verde esmeralda (#10b981) - Semibold
- Resto: Gris claro (#D1D5DB)

---

### 2. BACKGROUND PARA SLIDES ⭐⭐⭐

**Prompt para background sutil:**
```
A very subtle, minimal background pattern for presentation slides, dark mode (#030712 background), faint geometric lines forming circuit patterns, barely visible emerald green (#10b981) accents, extremely minimal and not distracting, professional academic presentation aesthetic, clean design, 16:9 aspect ratio --ar 16:9 --style raw
```

**Uso:** Aplicar con 5-10% de opacidad como background en todos los slides

---

### 3. DIAGRAMA DE ARQUITECTURA DEL SISTEMA ⭐⭐⭐

**Prompt para diagrama conceptual:**
```
A clean technical architecture diagram showing 4 connected modules in a horizontal flow: "Instituto" (university building icon, blue), "Ecopunto" (recycling symbol, emerald green), "Gestora" (factory icon, purple), "Admin" (settings icon, red), connected by arrows showing data flow, modern minimal design, flat icons, professional color scheme, white background, software architecture visualization, infographic style --ar 16:9 --style raw
```

**Alternativamente, crear en Canva con:**
- 4 cards rectangulares con bordes redondeados
- Iconos: Building2, Recycle, Factory, Settings (de Lucide Icons)
- Flechas con gradiente verde→azul
- Labels claros en cada módulo

---

### 4. FLUJO DE ESTADOS DEL LOTE ⭐⭐

**Prompt para timeline visual:**
```
A vertical flowchart showing the lifecycle of e-waste batches, 6 states connected by arrows: "Pendiente Envío" (gray), "En Ecopunto" (blue), "Clasificado" (cyan), "Disponible" (yellow), "Retiro Aprobado" (orange), "Finalizado" (green), modern minimal design, circular nodes, color-coded states, professional process diagram, white background, clean infographic style --ar 9:16 --style raw
```

**Estados a incluir (copiar de constants/estados.js):**
1. Pendiente envío Ecopunto (gris)
2. En Ecopunto (azul)
3. Clasificado (cyan)
4. Disponible para retiro (amarillo)
5. Retiro Aprobado (naranja)
6. Finalizado (verde)

---

### 5. KPIs AMBIENTALES — INFOGRAFÍA ⭐⭐

**Prompt para visualización de impacto:**
```
A modern infographic showing environmental impact metrics, 3 large KPI cards: "1.4 kg CO2 evitado" with cloud icon (emerald green), "5% Cobre recuperado" with metal icon (orange), "8% Aluminio" with metal icon (silver), clean minimal design, professional eco-friendly aesthetic, icons and numbers prominent, white background --ar 16:9 --style raw
```

**Datos a incluir (del Dashboard Admin):**
- 🌍 CO₂ evitado: 1.4 kg por cada kg de RAEE
- 🔩 Cobre recuperado: 5%
- ⚙️ Aluminio recuperado: 8%
- ✅ Tasa de finalización: XX%

---

### 6. CAPTURAS DE PANTALLA UI (Mockups) ⭐⭐

#### 6.1 Dashboard Instituto

**Prompt:**
```
A modern web dashboard interface screenshot for an institute portal in an e-waste management system, dark mode UI (#030712 background), showing a table of waste batches with status badges (green, blue, yellow), 4 KPI cards at top with emerald green accents (#10b981), clean minimal design, professional SaaS aesthetic, Tailwind CSS style, realistic UI mockup --ar 16:9 --style raw
```

#### 6.2 Clasificación con IA (Ecopunto)

**Prompt:**
```
A web interface screenshot showing AI-powered e-waste classification, split screen with uploaded photo of electronic device on left and classification results on right, emerald green (#10b981) and blue (#06b6d4) accents, modern minimal UI, dark mode, professional AI application interface, realistic mockup --ar 16:9 --style raw
```

#### 6.3 Registro Público de Trazabilidad

**Prompt:**
```
A public-facing web interface showing a grid of e-waste batch cards, light gradient background (green to blue to purple), modern card-based design with progress bars, search bar at top, clean minimal UI, professional public portal aesthetic, realistic web mockup --ar 16:9 --style raw
```

---

### 7. ICONOS PERSONALIZADOS DEL FLUJO ⭐

**Set de 4 iconos (generar juntos):**
```
A set of 4 minimalist flat icons for an e-waste management flow, all in the same style: 1) university building (emerald green #10b981), 2) recycling symbol (electric blue #06b6d4), 3) factory/industrial building (purple #a855f7), 4) certificate with checkmark (green #10b981), simple geometric shapes, modern minimal design, vector style, white background, consistent line weight --ar 16:9 --style raw
```

**Uso:** Para timeline de trazabilidad en slides

---

### 8. COMPARACIÓN ANTES/DESPUÉS ⭐

**Prompt para "Antes" (proceso manual):**
```
A conceptual illustration showing chaotic manual e-waste management, paper documents scattered, person overwhelmed with paperwork, old desktop computer, messy process, muted gray colors, professional editorial illustration style, simple and clean --ar 16:9 --style raw
```

**Prompt para "Después" (con EcoFIng):**
```
A conceptual illustration showing streamlined digital e-waste management, clean tablet interface with emerald green UI, organized workflow, person confident and efficient, modern technology, vibrant emerald green and blue colors, professional editorial illustration style --ar 16:9 --style raw
```

---

### 9. HERO IMAGE — IMPACTO AMBIENTAL ⭐⭐

**Prompt para imagen de impacto:**
```
A modern, professional conceptual image representing sustainable e-waste management, abstract geometric shapes of circuit boards transforming into green leaves, emerald green (#10b981) and electric blue (#06b6d4) gradient, dark background, clean minimal design, environmental technology concept, professional corporate style --ar 16:9 --style raw
```

**Uso:** Slide de introducción sobre el problema ambiental

---

### 10. STACK TECNOLÓGICO — LOGOS ⭐

**No generar con IA, usar logos oficiales:**
- React: https://react.dev (descargar logo oficial)
- Vite: https://vitejs.dev
- TailwindCSS: https://tailwindcss.com
- Anthropic Claude: https://anthropic.com
- Vercel: https://vercel.com

**Prompt para slide de stack (solo si necesitas background):**
```
A clean, minimal background for a technology stack showcase slide, subtle grid pattern, dark background (#030712), faint emerald green lines, not distracting, space for logos and text, professional tech presentation aesthetic --ar 16:9 --style raw
```

---

## 🎨 Slides Sugeridos para la Presentación (15-20 slides)

### Estructura recomendada:

1. **Portada** — Asset #1
2. **Contexto y Problema** — Asset #9 (Hero image)
3. **Objetivos del Proyecto** — Texto con bullets
4. **Normativa (Decreto 292/024)** — Texto + icono legal
5. **Arquitectura del Sistema** — Asset #3 (Diagrama)
6. **Stack Tecnológico** — Asset #10 (Logos)
7. **Flujo de Estados** — Asset #4 (Timeline)
8. **Portal Instituto** — Asset #6.1 (Screenshot)
9. **Portal Ecopunto + IA** — Asset #6.2 (Screenshot)
10. **Portal Gestora** — Screenshot (generar similar a 6.1)
11. **Portal Admin** — Screenshot (generar similar a 6.1)
12. **Registro Público** — Asset #6.3 (Screenshot)
13. **KPIs Ambientales** — Asset #5 (Infografía)
14. **Comparación Antes/Después** — Asset #8
15. **Decisiones Técnicas Destacadas** — Texto + iconos
16. **Desafíos y Soluciones** — Texto + Asset #7 (iconos)
17. **Demo en Vivo** — Slide con QR + URL
18. **Trabajo Futuro** — Bullet points
19. **Conclusiones** — Texto
20. **Agradecimientos** — Créditos

---

## 🎬 Prompt para VIDEO DE DEMO (Opcional)

**Prompt para thumbnail del video:**
```
A professional thumbnail image for a demo video of an e-waste management system, split screen showing smartphone scanning QR code on left and web dashboard interface on right, emerald green and blue accents, modern tech aesthetic, "DEMO" text space, YouTube thumbnail style, engaging and professional --ar 16:9 --style raw
```

---

## 📸 Prompt para FOTO DEL EQUIPO (Si necesitan una ilustración)

**Prompt para representación del equipo:**
```
A professional illustration of 3 university students working together on a tech project, diverse group, laptop with code visible, university campus background, modern flat illustration style, emerald green and blue accent colors, collaborative and professional atmosphere, clean minimal design --ar 16:9 --style raw
```

**Mejor opción:** Usar foto real del equipo

---

## 🖼️ Templates de Canva Recomendados

Si prefieren usar Canva en lugar de generar desde cero:

1. **Buscar:** "Academic Presentation Dark" o "Tech Startup Pitch Deck"
2. **Filtrar por:** Gratis, 16:9, Moderno
3. **Customizar colores:**
   - Primary: #10b981 (emerald green)
   - Secondary: #06b6d4 (electric blue)
   - Accent: #a855f7 (purple)
   - Background: #030712 (dark)

**Templates sugeridos:**
- "Minimalist Tech Presentation"
- "Sustainable Business Pitch"
- "Academic Research Presentation"

---

## 🎯 Checklist de Assets para Presentación

### Esenciales (hacer primero):
- [x] Portada de presentación
- [x] Background para slides
- [x] Diagrama de arquitectura
- [x] Flujo de estados
- [x] KPIs ambientales

### Importantes:
- [ ] 3 mockups de UI (Instituto, Ecopunto, Público)
- [ ] Set de iconos del flujo
- [ ] Hero image de impacto ambiental

### Opcionales:
- [ ] Comparación antes/después
- [ ] Thumbnail de video demo
- [ ] Ilustración del equipo

---

## ⚡ Workflow Rápido (2 horas)

### Opción A: Todo con IA Generativa (Calidad alta, tiempo medio)
1. **15 min:** Generar portada y background en Leonardo.ai
2. **30 min:** Generar 3 mockups UI en Midjourney
3. **20 min:** Generar infografías (arquitectura, KPIs)
4. **15 min:** Generar iconos y hero image
5. **40 min:** Ensamblar todo en Canva y agregar texto

### Opción B: Canva + IA selectiva (Calidad media, tiempo rápido)
1. **10 min:** Elegir template de Canva y customizar colores
2. **20 min:** Generar solo assets críticos (portada, diagrama, KPIs)
3. **30 min:** Crear mockups directamente en Canva con shapes
4. **10 min:** Agregar iconos de Lucide/Iconos gratis
5. **50 min:** Completar todos los slides con texto y datos

### Opción C: Screenshots reales + diseño simple (Calidad real, tiempo mínimo)
1. **30 min:** Tomar screenshots reales de la app en producción
2. **20 min:** Editarlas en Figma/Photoshop (crop, anotaciones)
3. **10 min:** Elegir template simple de Canva
4. **60 min:** Ensamblar presentación completa

**Recomendación:** Opción C para autenticidad, Opción B para balance tiempo/calidad

---

## 💡 Tips Finales

### Para Screenshots Reales (Opción C - Recomendada)

1. **Preparar datos mock realistas** antes de capturar
2. **Usar Chrome DevTools** para captura limpia:
   - F12 → Ctrl+Shift+P → "Capture full size screenshot"
3. **Modo oscuro activado** para consistencia
4. **Zoom al 100%** en el navegador
5. **Limpiar cookies/cache** para UI fresca

### Para Generación con IA

1. **Iterar 3-5 veces** por imagen hasta lograr calidad
2. **Guardar prompts exitosos** para reutilizar
3. **Mantener consistencia** en colores entre assets
4. **Preferir simplicidad** sobre complejidad

### Para Ensamblar en Canva

1. **Usar grilla** para alineación perfecta
2. **Consistencia en fonts:** Inter o similar sans-serif
3. **Espaciado generoso** entre elementos
4. **Tamaños de texto:**
   - Título: 44-54pt
   - Subtítulo: 28-36pt
   - Cuerpo: 18-24pt
   - Captions: 14-16pt

---

**Tiempo total estimado:** 2-4 horas dependiendo de la opción elegida

**Fecha límite sugerida:** 20 de mayo (6 días antes de la presentación)

**Próximo paso:** Revisar con el equipo y practicar la presentación oral

---

**Creado por:** Claude Sonnet 4.5  
**Fecha:** 28 de abril de 2026  
**Última actualización:** Sesión 10
