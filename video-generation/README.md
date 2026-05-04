# 🎬 EcoFIng Video Generation

Generación automatizada de videos para certificados y reportes usando **HyperFrames**.

## 🚀 Inicio rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Previsualizar composiciones
npm run dev
# → http://localhost:5174

# 3. Validar composición
npm run check

# 4. Renderizar a MP4
npm run render
```

## 📁 Composiciones disponibles

### 1. Certificado de Retiro
**Archivo:** `compositions/certificado-retiro.html`  
**Duración:** 10 segundos  
**Variables:**
- `{{LOTE_CODIGO}}` - Código del lote
- `{{GESTORA_NOMBRE}}` - Nombre de la gestora
- `{{PESO_TOTAL}}` - Peso total en kg
- `{{FECHA_RETIRO}}` - Fecha del retiro

**Uso desde la app EcoFIng:**
```jsx
import VideoGenerator from '../components/VideoGenerator';
import { VideoType } from '../services/videoGeneration';

<VideoGenerator
  tipo={VideoType.CERTIFICADO_RETIRO}
  datos={{
    lote: lote,
    gestora: gestora
  }}
  titulo="Generar Certificado"
/>
```

### 2. Reporte de Lotes
**Archivo:** `compositions/reporte-lotes-gestora.html`  
**Duración:** 15 segundos  
**Variables:**
- `{{FECHA_ACTUAL}}` - Fecha del reporte
- `{{TOTAL_LOTES}}` - Cantidad de lotes disponibles
- `{{PESO_TOTAL}}` - Peso total en kg
- `{{CATEGORIAS}}` - Cantidad de categorías

**Uso desde la app EcoFIng:**
```jsx
<VideoGenerator
  tipo={VideoType.REPORTE_LOTES_GESTORA}
  datos={{
    lotes: state.lotes
  }}
  titulo="Generar Reporte"
/>
```

## 🎨 Personalizar composiciones

1. Editar el archivo HTML en `compositions/`
2. Usar placeholders: `{{NOMBRE_VARIABLE}}`
3. Validar: `npm run check`
4. Previsualizar: `npm run dev`

**Ejemplo:**
```html
<div class="info-value">{{LOTE_CODIGO}}</div>
```

## 🛠️ Comandos disponibles

```bash
# Desarrollo
npm run dev          # Preview en navegador con hot reload

# Validación
npm run check        # Lint + validación de composición

# Producción
npm run render       # Renderizar a MP4 (output/)
npm run publish      # Publicar y obtener link compartible

# Utilidades
npx hyperframes docs <topic>           # Ver documentación
npx hyperframes add <block-name>       # Agregar bloque del catálogo
npx hyperframes telemetry disable      # Deshabilitar telemetría
```

## 📦 Estructura de archivos

```
video-generation/
├── compositions/              ← Composiciones HTML
│   ├── certificado-retiro.html
│   └── reporte-lotes-gestora.html
├── assets/                    ← Imágenes, logos, fonts
├── output/                    ← Videos renderizados (MP4)
├── index.html                 ← Composición principal
├── hyperframes.json           ← Configuración
├── meta.json                  ← Metadata del proyecto
├── package.json
├── CLAUDE.md                  ← Guía para agentes IA
└── AGENTS.md                  ← Instrucciones para agentes
```

## ⚙️ Configuración

### hyperframes.json
```json
{
  "$schema": "https://hyperframes.heygen.com/schema/hyperframes.json",
  "registry": "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
  "paths": {
    "blocks": "compositions",
    "components": "compositions/components",
    "assets": "assets"
  }
}
```

## 🎯 Integración con EcoFIng

### Flujo completo

1. **Usuario en la app web:**
   - Hace clic en "Generar Video"
   - Se descarga `certificado-retiro-{timestamp}.html` con datos personalizados

2. **Copiar a compositions/:**
   ```bash
   cp ~/Downloads/certificado-retiro-*.html compositions/
   ```

3. **Previsualizar:**
   ```bash
   npm run dev
   # Abrir http://localhost:5174
   ```

4. **Renderizar:**
   ```bash
   npm run render
   # Video generado en output/
   ```

5. **Usar en la app:**
   ```bash
   cp output/*.mp4 ../app/public/videos/
   ```

## 📚 Recursos

- **Docs HyperFrames:** https://hyperframes.heygen.com
- **Catálogo de bloques:** https://hyperframes.heygen.com/catalog
- **GSAP Docs:** https://gsap.com/docs/v3/
- **Guía de integración:** `../docs/hyperframes-integration.md`

## 🐛 Troubleshooting

### El video no se renderiza
```bash
# Verificar FFmpeg
ffmpeg -version

# Ver logs detallados
npx hyperframes render --verbose

# Validar composición
npm run check
```

### Variables no se reemplazan
- Verificar que el HTML descargado contiene los datos (abrirlo en editor)
- El servicio `videoGeneration.js` reemplaza `{{VAR}}` con valores reales
- Verificar que los nombres coinciden exactamente

### Animaciones no funcionan
- Asegurarse de registrar el timeline en `window.__timelines`
- Usar `paused: true` en el timeline
- Verificar que los elementos tienen `class="clip"`

## ✅ Checklist antes de renderizar

- [ ] Composición validada con `npm run check`
- [ ] Preview verificado en navegador (`npm run dev`)
- [ ] Variables reemplazadas correctamente
- [ ] Animaciones funcionan correctamente
- [ ] Duración apropiada (10-20 segundos)
- [ ] Resolución 1920x1080

## 💡 Tips

1. **Mantén las animaciones simples:** GSAP es eficiente, pero muchas animaciones complejas pueden ralentizar el renderizado.

2. **Usa assets locales:** Coloca imágenes/logos en `assets/` en vez de URLs externas.

3. **Duración óptima:** 10-20 segundos es ideal para certificados y reportes.

4. **Linting es tu amigo:** Siempre ejecuta `npm run check` antes de renderizar.

5. **Determinismo:** No uses `Date.now()`, `Math.random()`, ni network fetches dentro del HTML.

## 🚀 Próximos pasos

- [ ] Crear `tutorial-instituto.html` para onboarding
- [ ] Crear `impacto-ambiental.html` con gráficos animados
- [ ] Agregar QR codes dinámicos
- [ ] Automatizar renderizado con script
- [ ] Integrar en CI/CD
- [ ] Subir videos a storage cloud

---

**Versión HyperFrames:** 0.4.43  
**Proyecto:** EcoFIng - Gestión RAEE  
**Equipo:** Carmela González · Verónica Iriarte · Juan Raimondo
