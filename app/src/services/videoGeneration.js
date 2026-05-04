/**
 * Servicio de generación de videos con HyperFrames
 * Integra las composiciones HTML de HyperFrames con los datos de EcoFIng
 */

const HYPERFRAMES_BASE_URL = 'http://localhost:5174'; // Puerto de HyperFrames preview

/**
 * Tipos de videos disponibles
 */
export const VideoType = {
  CERTIFICADO_RETIRO: 'certificado-retiro',
  REPORTE_LOTES_GESTORA: 'reporte-lotes-gestora',
};

/**
 * Genera los datos para un certificado de retiro en video
 * @param {Object} lote - Datos del lote
 * @param {Object} gestora - Datos de la gestora
 * @returns {Object} - Datos procesados para el template
 */
export function prepararDatosCertificado(lote, gestora) {
  return {
    LOTE_CODIGO: lote.codigo,
    GESTORA_NOMBRE: gestora.nombre,
    PESO_TOTAL: lote.pesoKg.toFixed(2),
    FECHA_RETIRO: new Date().toLocaleDateString('es-UY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
  };
}

/**
 * Genera los datos para un reporte de lotes disponibles
 * @param {Array} lotes - Lista de lotes disponibles
 * @returns {Object} - Datos procesados para el template
 */
export function prepararDatosReporteLotes(lotes) {
  const lotesDisponibles = lotes.filter(l =>
    l.estado === 'Disponible para retiro' ||
    l.estado === 'Solicitado por Gestora/s'
  );

  const pesoTotal = lotesDisponibles.reduce((acc, l) => acc + l.pesoKg, 0);
  const categoriasUnicas = new Set(lotesDisponibles.map(l => l.categoria));

  return {
    FECHA_ACTUAL: new Date().toLocaleDateString('es-UY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    TOTAL_LOTES: lotesDisponibles.length,
    PESO_TOTAL: pesoTotal.toFixed(0),
    CATEGORIAS: categoriasUnicas.size,
    LOTES: lotesDisponibles.slice(0, 3).map(l => ({
      codigo: l.codigo,
      categoria: l.categoria,
      peso: l.pesoKg.toFixed(0)
    }))
  };
}

/**
 * Reemplaza placeholders en HTML con datos reales
 * @param {string} htmlTemplate - Template HTML con placeholders {{VARIABLE}}
 * @param {Object} data - Datos para reemplazar
 * @returns {string} - HTML procesado
 */
function reemplazarPlaceholders(htmlTemplate, data) {
  let resultado = htmlTemplate;

  Object.entries(data).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    resultado = resultado.replaceAll(placeholder, value);
  });

  return resultado;
}

/**
 * Genera un archivo HTML de composición personalizado
 * @param {string} tipoVideo - Tipo de video (VideoType)
 * @param {Object} datos - Datos para el video
 * @returns {Promise<Blob>} - Blob del HTML generado
 */
export async function generarComposicionHTML(tipoVideo, datos) {
  try {
    // Cargar el template correspondiente
    const templatePath = `../../video-generation/compositions/${tipoVideo}.html`;
    const response = await fetch(templatePath);

    if (!response.ok) {
      throw new Error(`No se pudo cargar el template: ${tipoVideo}`);
    }

    const htmlTemplate = await response.text();
    const htmlProcesado = reemplazarPlaceholders(htmlTemplate, datos);

    return new Blob([htmlProcesado], { type: 'text/html' });
  } catch (error) {
    console.error('Error generando composición HTML:', error);
    throw error;
  }
}

/**
 * Abre la previsualización de HyperFrames en una nueva ventana
 * @param {string} tipoVideo - Tipo de video
 */
export function previsualizarVideo(tipoVideo) {
  const url = `${HYPERFRAMES_BASE_URL}?composition=${tipoVideo}`;
  window.open(url, '_blank', 'width=1920,height=1080');
}

/**
 * Genera instrucciones para renderizar el video con HyperFrames CLI
 * @param {string} tipoVideo - Tipo de video
 * @returns {string} - Comando CLI para ejecutar
 */
export function obtenerComandoRender(tipoVideo) {
  return `cd video-generation && npx hyperframes render --composition=compositions/${tipoVideo}.html --output=../app/public/videos/${tipoVideo}-${Date.now()}.mp4`;
}

/**
 * Descarga la composición HTML personalizada
 * @param {string} tipoVideo - Tipo de video
 * @param {Object} datos - Datos para el video
 */
export async function descargarComposicion(tipoVideo, datos) {
  try {
    const blob = await generarComposicionHTML(tipoVideo, datos);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tipoVideo}-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error descargando composición:', error);
    throw error;
  }
}

/**
 * Genera el comando completo para crear un video personalizado
 * @param {string} tipoVideo - Tipo de video
 * @param {Object} datos - Datos para el video
 * @returns {Object} - Instrucciones completas
 */
export function generarInstruccionesVideo(tipoVideo, datos) {
  return {
    paso1: 'Descargar la composición HTML personalizada',
    paso2: `Copiar el archivo a video-generation/compositions/`,
    paso3: `Ejecutar: cd video-generation && npm run dev`,
    paso4: `Verificar la composición en el navegador`,
    paso5: `Renderizar: npm run render`,
    comandoCLI: obtenerComandoRender(tipoVideo),
    datos: datos
  };
}

export default {
  VideoType,
  prepararDatosCertificado,
  prepararDatosReporteLotes,
  generarComposicionHTML,
  previsualizarVideo,
  obtenerComandoRender,
  descargarComposicion,
  generarInstruccionesVideo
};
