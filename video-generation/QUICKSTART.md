# 🚀 HyperFrames Quickstart - EcoFIng

Guía rápida de 5 minutos para generar tu primer video.

---

## ✅ Verificación Rápida

```powershell
# 1. Verificar FFmpeg
ffmpeg -version
# ✅ Debe mostrar: ffmpeg version 8.1

# 2. Verificar node
node --version
# ✅ Debe ser >= 22 (actualmente v24.14.1)

# 3. Verificar que estamos en la carpeta correcta
pwd
# ✅ Debe terminar en: \Seminario Fing\video-generation
```

---

## 🎬 Generar tu primer video (3 pasos)

### Paso 1: Instalar dependencias

```powershell
npm install
```

### Paso 2: Previsualizar en el navegador

```powershell
npm run dev
```

Se abrirá http://localhost:5174 con un preview interactivo.

### Paso 3: Renderizar a MP4

```powershell
npm run render
```

El video se generará en `output/`

---

## 📹 Generar Certificado de Retiro

### Opción A: Con datos de prueba

1. **Abrir la composición:**
   ```powershell
   code .\compositions\certificado-retiro.html
   ```

2. **Reemplazar variables manualmente:**
   ```html
   <!-- Buscar {{LOTE_CODIGO}} y reemplazar por -->
   LOTE-2026-001

   <!-- Buscar {{GESTORA_NOMBRE}} y reemplazar por -->
   EcoGestión Uruguay SA

   <!-- Buscar {{PESO_TOTAL}} y reemplazar por -->
   450.50

   <!-- Buscar {{FECHA_RETIRO}} y reemplazar por -->
   4 de mayo de 2026
   ```

3. **Previsualizar:**
   ```powershell
   npm run dev
   ```

4. **Renderizar:**
   ```powershell
   npm run render
   ```

### Opción B: Desde la app EcoFIng (Recomendado)

1. **En la app web:**
   - Ir a portal Gestora
   - Abrir un lote en estado "Finalizado"
   - Clic en "Generar Certificado en Video"
   - Se descarga `certificado-retiro-{timestamp}.html`

2. **Copiar el archivo descargado:**
   ```powershell
   Copy-Item ~\Downloads\certificado-retiro-*.html .\compositions\
   ```

3. **Renderizar:**
   ```powershell
   npm run render
   ```

---

## 🎯 Comandos Esenciales

```powershell
# Preview interactivo en navegador
npm run dev

# Validar composición antes de renderizar
npm run check

# Renderizar a MP4
npm run render

# Renderizar TODAS las composiciones (script personalizado)
.\scripts\render-all.ps1

# Ver documentación de HyperFrames
npx hyperframes docs compositions
```

---

## 📂 Estructura de Carpetas

```
video-generation/
├── compositions/           ← Tus archivos HTML aquí
│   ├── certificado-retiro.html
│   └── reporte-lotes-gestora.html
├── assets/                 ← Logos, imágenes, fonts
├── output/                 ← Videos renderizados (MP4)
└── scripts/                ← Scripts de automatización
```

---

## 🎨 Personalizar una Composición

1. **Duplicar una composición existente:**
   ```powershell
   Copy-Item .\compositions\certificado-retiro.html .\compositions\mi-video.html
   ```

2. **Editar con VSCode:**
   ```powershell
   code .\compositions\mi-video.html
   ```

3. **Cambiar contenido:**
   - HTML estándar (divs, spans, etc.)
   - Usar clases de Tailwind o CSS personalizado
   - Agregar animaciones GSAP en el `<script>`

4. **Validar:**
   ```powershell
   npm run check
   ```

5. **Previsualizar:**
   ```powershell
   npm run dev
   ```

6. **Renderizar:**
   ```powershell
   npm run render
   ```

---

## 💡 Tips Rápidos

### ✅ Hacer

- ✅ Usar `npm run check` antes de renderizar
- ✅ Mantener videos cortos (10-20 segundos)
- ✅ Usar animaciones GSAP para mejor performance
- ✅ Colocar assets en `assets/` en vez de URLs externas
- ✅ Usar 1920x1080 de resolución

### ❌ Evitar

- ❌ Usar `Date.now()` o `Math.random()` en el HTML
- ❌ Hacer network requests dentro del HTML
- ❌ Videos muy largos (> 60 segundos)
- ❌ Animaciones CSS muy complejas
- ❌ Olvidar el `paused: true` en GSAP timelines

---

## 🐛 Problemas Comunes

### "ffmpeg no encontrado"

```powershell
# Instalar FFmpeg
winget install ffmpeg

# Reiniciar terminal
exit
```

### "npm command not found"

```powershell
# Verificar que Node.js está instalado
node --version

# Si no está, instalar desde nodejs.org
```

### "El video no se renderiza"

```powershell
# 1. Validar composición
npm run check

# 2. Ver errores detallados
npx hyperframes render --verbose

# 3. Verificar que FFmpeg funciona
ffmpeg -version
```

### "Las variables no se reemplazan"

Las variables `{{VARIABLE}}` deben reemplazarse **antes** de renderizar:

- **Opción 1:** Editar el HTML manualmente
- **Opción 2:** Usar el componente `VideoGenerator` de React (recomendado)

---

## 📦 Copiar Videos a la App

```powershell
# Después de renderizar, copiar a la app web
Copy-Item .\output\*.mp4 ..\app\public\videos\

# Verificar que se copiaron
Get-ChildItem ..\app\public\videos\*.mp4
```

---

## 🎓 Próximos Pasos

1. **Leer la documentación completa:**
   ```powershell
   code .\README.md
   code ..\docs\hyperframes-integration.md
   ```

2. **Ver ejemplos:**
   ```powershell
   code ..\docs\ejemplos\integracion-videogenerator-gestora.jsx
   ```

3. **Explorar el catálogo de HyperFrames:**
   - https://hyperframes.heygen.com/catalog

4. **Agregar bloques del catálogo:**
   ```powershell
   npx hyperframes add <block-name>
   ```

---

## 🆘 Ayuda

- **Documentación local:** `README.md`
- **Guía de integración:** `../docs/hyperframes-integration.md`
- **Docs oficiales:** https://hyperframes.heygen.com
- **CLI docs:** `npx hyperframes docs <topic>`

---

## 🎯 Resumen de 30 Segundos

```powershell
# 1. Instalar
npm install

# 2. Previsualizar
npm run dev

# 3. Renderizar
npm run render

# 4. ¡Listo! Video en output/
```

---

**¡Bienvenido a HyperFrames! 🎬**  
Ahora puedes generar videos profesionales directamente desde HTML.
