import { useState } from 'react';
import {
  VideoType,
  prepararDatosCertificado,
  prepararDatosReporteLotes,
  descargarComposicion,
  generarInstruccionesVideo
} from '../services/videoGeneration';

/**
 * Componente para generar videos con HyperFrames
 * @param {Object} props
 * @param {string} props.tipo - Tipo de video (VideoType)
 * @param {Object} props.datos - Datos para el video (lote, gestora, etc.)
 * @param {string} props.titulo - Título del botón
 */
export default function VideoGenerator({ tipo, datos, titulo = 'Generar Video' }) {
  const [generando, setGenerando] = useState(false);
  const [instrucciones, setInstrucciones] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerarVideo = async () => {
    setGenerando(true);
    setError(null);
    setInstrucciones(null);

    try {
      let datosProcesados;

      // Preparar datos según el tipo de video
      switch (tipo) {
        case VideoType.CERTIFICADO_RETIRO:
          datosProcesados = prepararDatosCertificado(datos.lote, datos.gestora);
          break;

        case VideoType.REPORTE_LOTES_GESTORA:
          datosProcesados = prepararDatosReporteLotes(datos.lotes);
          break;

        default:
          throw new Error(`Tipo de video desconocido: ${tipo}`);
      }

      // Descargar la composición HTML personalizada
      await descargarComposicion(tipo, datosProcesados);

      // Generar instrucciones para renderizar
      const instruccionesCompletas = generarInstruccionesVideo(tipo, datosProcesados);
      setInstrucciones(instruccionesCompletas);

    } catch (err) {
      console.error('Error generando video:', err);
      setError(err.message);
    } finally {
      setGenerando(false);
    }
  };

  return (
    <div className="video-generator">
      <button
        onClick={handleGenerarVideo}
        disabled={generando}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
      >
        {generando ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span>Generando...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>{titulo}</span>
          </>
        )}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error al generar video:</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {instrucciones && (
        <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Composición HTML descargada
          </h3>

          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg border border-purple-100">
              <p className="text-sm font-semibold text-purple-800 mb-2">Paso 1:</p>
              <p className="text-gray-700">{instrucciones.paso1}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-purple-100">
              <p className="text-sm font-semibold text-purple-800 mb-2">Paso 2:</p>
              <p className="text-gray-700">{instrucciones.paso2}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-purple-100">
              <p className="text-sm font-semibold text-purple-800 mb-2">Paso 3 - Previsualizar:</p>
              <code className="block bg-gray-900 text-green-400 p-3 rounded text-sm font-mono overflow-x-auto">
                {instrucciones.paso3}
              </code>
            </div>

            <div className="bg-white p-4 rounded-lg border border-purple-100">
              <p className="text-sm font-semibold text-purple-800 mb-2">Paso 4:</p>
              <p className="text-gray-700">{instrucciones.paso4}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-purple-100">
              <p className="text-sm font-semibold text-purple-800 mb-2">Paso 5 - Renderizar a MP4:</p>
              <code className="block bg-gray-900 text-green-400 p-3 rounded text-sm font-mono overflow-x-auto">
                {instrucciones.paso5}
              </code>
            </div>
          </div>

          <div className="mt-6 p-4 bg-indigo-100 rounded-lg">
            <p className="text-sm text-indigo-900 font-medium mb-2">💡 Nota:</p>
            <p className="text-sm text-indigo-800">
              El video se generará en formato MP4 con resolución 1920x1080. La duración depende del tipo de composición.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
