# Integración HyperFrames en EcoFIng

## ✅ Instalación completada

- ✅ FFmpeg instalado
- ✅ HyperFrames inicializado en `/video-generation`
- ✅ Servicio de integración creado: `app/src/services/videoGeneration.js`
- ✅ Componente React creado: `app/src/components/VideoGenerator.jsx`
- ✅ Composiciones HTML creadas:
  - `video-generation/compositions/certificado-retiro.html`
  - `video-generation/compositions/reporte-lotes-gestora.html`

---

## 📹 Casos de uso implementados

### 1. Certificado de Retiro (Portal Gestora)

Cuando una gestora finaliza el retiro de un lote (estado `Finalizado`), puede generar un certificado en video.

**Ubicación:** Portal Gestora → Detalle de Lote (después de completar retiro)

**Ejemplo de integración:**

```jsx
// app/src/portals/gestora/DetalleLote.jsx

import VideoGenerator from '../../components/VideoGenerator';
import { VideoType } from '../../services/videoGeneration';

// ... dentro del componente DetalleLote

{lote.estado === ESTADOS_LOTE.FINALIZADO && (
  <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
          <Video size={24} className="text-white" />
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">
          Certificado en Video
        </h3>
        <p className="text-gray-700 mb-4">
          Genera un certificado de retiro en formato video con los datos del lote
        </p>
        <VideoGenerator
          tipo={VideoType.CERTIFICADO_RETIRO}
          datos={{
            lote: lote,
            gestora: gestora
          }}
          titulo="Generar Certificado"
        />
      </div>
    </div>
  </Card>
)}
```

### 2. Reporte de Lotes Disponibles (Portal Admin)

El administrador puede generar reportes visuales de los lotes disponibles para compartir con gestoras.

**Ubicación:** Portal Admin → Dashboard

**Ejemplo de integración:**

```jsx
// app/src/portals/admin/Dashboard.jsx

import VideoGenerator from '../../components/VideoGenerator';
import { VideoType } from '../../services/videoGeneration';

// ... dentro del componente AdminDashboard

<Card>
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
      Reportes en Video
    </h3>
  </div>
  
  <VideoGenerator
    tipo={VideoType.REPORTE_LOTES_GESTORA}
    datos={{
      lotes: state.lotes
    }}
    titulo="Generar Reporte de Lotes"
  />
</Card>
```

---

## 🚀 Cómo usar el sistema

### Flujo completo de generación de video

1. **En la aplicación EcoFIng:**
   - El usuario hace clic en "Generar Video"
   - Se descarga un archivo HTML personalizado con los datos del lote/gestora

2. **Copiar el archivo descargado:**
   ```bash
   # El archivo se descargará como: certificado-retiro-1234567890.html
   # Copiarlo a:
   cp ~/Downloads/certificado-retiro-*.html video-generation/compositions/
   ```

3. **Previsualizar en el navegador:**
   ```bash
   cd video-generation
   npm run dev
   # Se abre en http://localhost:5174
   ```

4. **Verificar la composición:**
   ```bash
   npm run check
   ```

5. **Renderizar a MP4:**
   ```bash
   npm run render
   # El video se genera en video-generation/output/
   ```

6. **Copiar el video a la app:**
   ```bash
   cp output/*.mp4 ../app/public/videos/
   ```

---

## 🎨 Personalización de composiciones

### Certificado de Retiro

**Variables disponibles:**
- `{{LOTE_CODIGO}}` - Código del lote
- `{{GESTORA_NOMBRE}}` - Nombre de la gestora
- `{{PESO_TOTAL}}` - Peso total en kg
- `{{FECHA_RETIRO}}` - Fecha del retiro

**Archivo:** `video-generation/compositions/certificado-retiro.html`

**Duración:** 10 segundos

**Resolución:** 1920x1080

### Reporte de Lotes

**Variables disponibles:**
- `{{FECHA_ACTUAL}}` - Fecha del reporte
- `{{TOTAL_LOTES}}` - Cantidad de lotes disponibles
- `{{PESO_TOTAL}}` - Peso total en kg
- `{{CATEGORIAS}}` - Cantidad de categorías distintas

**Archivo:** `video-generation/compositions/reporte-lotes-gestora.html`

**Duración:** 15 segundos

**Resolución:** 1920x1080

---

## 📦 Estructura de archivos

```
seminario-tecnologia-fing/
│
├── video-generation/           ← Proyecto HyperFrames
│   ├── compositions/           ← Composiciones HTML
│   │   ├── certificado-retiro.html
│   │   └── reporte-lotes-gestora.html
│   ├── assets/                 ← Assets (logos, imágenes)
│   ├── output/                 ← Videos renderizados (MP4)
│   ├── index.html              ← Composición principal
│   ├── hyperframes.json        ← Configuración HyperFrames
│   ├── package.json
│   └── CLAUDE.md               ← Guía de HyperFrames
│
├── app/
│   ├── public/
│   │   └── videos/             ← Videos finales para la app
│   └── src/
│       ├── components/
│       │   └── VideoGenerator.jsx  ← Componente React
│       └── services/
│           └── videoGeneration.js  ← Servicio de integración
```

---

## 🛠️ Comandos útiles

### HyperFrames CLI

```bash
# Previsualizar composición
cd video-generation && npm run dev

# Validar composición
cd video-generation && npm run check

# Renderizar a MP4
cd video-generation && npm run render

# Ver documentación
npx hyperframes docs <topic>
# Topics: data-attributes, gsap, compositions, rendering, examples

# Agregar bloques del catálogo
npx hyperframes add <block-name>

# Deshabilitar telemetría
npx hyperframes telemetry disable
```

### Desarrollo

```bash
# Levantar app EcoFIng
cd app && npm run dev

# Levantar preview de HyperFrames (en otra terminal)
cd video-generation && npm run dev
```

---

## 🎯 Próximos pasos sugeridos

### 1. Videos tutoriales para Institutos

Crear composición HTML para onboarding de institutos:
- Cómo registrar una solicitud de retiro
- Cómo hacer seguimiento del lote
- Qué hacer cuando el Ecopunto retira el lote

**Archivo a crear:** `video-generation/compositions/tutorial-instituto.html`

### 2. Videos de impacto ambiental

Mostrar el impacto CO2 evitado con animaciones:
- Gráficos animados de kg reciclados
- Contador de CO2 evitado
- Comparaciones visuales (árboles, km en auto)

**Archivo a crear:** `video-generation/compositions/impacto-ambiental.html`

### 3. Integración con QR Codes

Agregar QR codes dinámicos a los certificados:
- Usar `qrcode.react` para generar el QR
- Renderizar en canvas
- Exportar como imagen para HyperFrames

### 4. Resúmenes mensuales automatizados

Portal Admin → generar video mensual con:
- Total de lotes gestionados
- Total de kg reciclados
- Institutos más activos
- Gestoras con mejor desempeño

---

## 📚 Recursos

- **HyperFrames Docs:** https://hyperframes.heygen.com
- **HyperFrames Catalog:** https://hyperframes.heygen.com/catalog
- **GSAP Docs:** https://gsap.com/docs/v3/
- **LLM-friendly index:** https://hyperframes.heygen.com/llms.txt

---

## 🐛 Troubleshooting

### El video no se renderiza

1. Verificar que FFmpeg está instalado:
   ```bash
   ffmpeg -version
   ```

2. Verificar la composición:
   ```bash
   cd video-generation && npm run check
   ```

3. Ver logs detallados:
   ```bash
   npx hyperframes render --verbose
   ```

### Las variables no se reemplazan

Verificar que:
- Los placeholders usan el formato correcto: `{{VARIABLE}}`
- El servicio `videoGeneration.js` está reemplazando correctamente
- El HTML descargado contiene los datos (abrir el archivo y verificar)

### El preview no se ve

1. Verificar que el servidor está corriendo:
   ```bash
   cd video-generation && npm run dev
   ```

2. Abrir en navegador: http://localhost:5174

3. Verificar la consola del navegador por errores

---

## ✅ Checklist de integración

- [x] Instalar FFmpeg
- [x] Inicializar HyperFrames
- [x] Crear servicio de integración React
- [x] Crear componente VideoGenerator
- [x] Crear composición: certificado-retiro.html
- [x] Crear composición: reporte-lotes-gestora.html
- [ ] Integrar en portal Gestora (DetalleLote.jsx)
- [ ] Integrar en portal Admin (Dashboard.jsx)
- [ ] Crear composiciones adicionales (tutoriales, impacto)
- [ ] Configurar CI/CD para renderizado automático
- [ ] Documentar en README.md principal

---

## 💡 Notas importantes

1. **HyperFrames es determinista:** No usar `Date.now()`, `Math.random()`, ni network fetches dentro de las composiciones HTML. Usar solo los datos pasados como variables.

2. **Performance:** Las animaciones GSAP son más eficientes que CSS para videos.

3. **Assets:** Logos e imágenes deben estar en `video-generation/assets/`.

4. **Linting:** Siempre ejecutar `npm run check` antes de renderizar.

5. **Duración:** Mantener los videos cortos (10-20 segundos) para mejor engagement.
