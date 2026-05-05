/**
 * EJEMPLO DE INTEGRACIÓN - VideoGenerator en Portal Gestora
 *
 * Este archivo muestra cómo integrar el componente VideoGenerator
 * en el portal de Gestora para generar certificados de retiro.
 *
 * Ubicación sugerida: app/src/portals/gestora/DetalleLote.jsx
 */

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../components/molecules/Toast'
import Button from '../../components/atoms/Button'
import Card from '../../components/molecules/Card'
import StatusBadge from '../../components/molecules/StatusBadge'
import VideoGenerator from '../../components/VideoGenerator'
import { VideoType } from '../../services/videoGeneration'
import {
  ArrowLeft, Package, TrendingUp, AlertCircle,
  DollarSign, Building2, CheckCircle, Video
} from '../../components/atoms/Icon'
import { ESTADOS_LOTE } from '../../constants/estados'

export default function DetalleLoteConVideo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const toast = useToast()
  const [cotizacion, setCotizacion] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Obtener gestora actual
  const gestora = state.gestoras?.find(g => g.id === state.usuarioActual?.gestoraId)

  // Buscar lote
  const lote = state.lotes.find(l => l.id === id && l.tipo === 'publicacion')

  // Buscar ítems del lote
  const items = state.items?.filter(item => lote?.items_ids?.includes(item.id)) || []

  // Buscar institutos de origen
  const institutos = state.institutos?.filter(inst => lote?.institutos_origen?.includes(inst.id)) || []

  // Verificar estado
  const miCotizacion = lote?.solicitudes_gestoras?.find(s => s.gestoraId === gestora?.id)
  const esAdjudicado = lote?.gestora_asignada_id === gestora?.id
  const puedeCotziar = lote?.estado === ESTADOS_LOTE.DISPONIBLE && !miCotizacion
  const estaFinalizado = lote?.estado === ESTADOS_LOTE.FINALIZADO

  if (!lote) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto p-6">
          <Card className="text-center">
            <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Lote no encontrado
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              El lote {id} no existe o no está disponible
            </p>
            <Button onClick={() => navigate('/gestora')} variant="secondary">
              Volver al catálogo
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  const handleEnviarCotizacion = async () => {
    // ... lógica existente de enviar cotización
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto p-6 space-y-6">

        {/* Header con botón volver */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('/gestora')}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Volver al catálogo
          </Button>
        </div>

        {/* Card principal con info del lote */}
        <Card>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {lote.codigo}
              </h1>
              <StatusBadge estado={lote.estado} />
            </div>
            <Package size={48} className="text-primary-500" />
          </div>

          {/* ... resto del contenido del lote */}
        </Card>

        {/*
          ╔══════════════════════════════════════════════════════════════╗
          ║  NUEVA SECCIÓN: Generador de Certificado en Video          ║
          ╚══════════════════════════════════════════════════════════════╝
        */}

        {estaFinalizado && esAdjudicado && (
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-2 border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-6">

              {/* Icono decorativo */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Video size={32} className="text-white" />
                </div>
              </div>

              {/* Contenido */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100">
                    Certificado de Retiro en Video
                  </h3>
                  <span className="px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                    NUEVO
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  Genera un certificado profesional en formato video (MP4) con los datos del retiro.
                  Incluye código de lote, información de la gestora, peso total y QR code de verificación.
                </p>

                {/* Características */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>1920x1080 Full HD</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>10 segundos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Animaciones profesionales</span>
                  </div>
                </div>

                {/* Componente VideoGenerator */}
                <VideoGenerator
                  tipo={VideoType.CERTIFICADO_RETIRO}
                  datos={{
                    lote: lote,
                    gestora: gestora
                  }}
                  titulo="Generar Certificado en Video"
                />

                {/* Info adicional */}
                <div className="mt-6 p-4 bg-white/60 dark:bg-gray-900/40 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span className="font-semibold text-purple-800 dark:text-purple-300">
                      ℹ️ Cómo funciona:
                    </span>
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                    <li>1. Se descargará un archivo HTML personalizado con los datos del retiro</li>
                    <li>2. Sigue las instrucciones para renderizar el video a MP4</li>
                    <li>3. El proceso toma ~30 segundos en total</li>
                    <li>4. Obtendrás un video profesional listo para compartir</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Vista previa del certificado (opcional) */}
        {estaFinalizado && esAdjudicado && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Preview del Certificado
            </h3>
            <div className="aspect-video bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg flex items-center justify-center overflow-hidden">
              <div className="text-center text-white p-8">
                <div className="text-6xl font-bold mb-4">
                  Certificado de Retiro
                </div>
                <div className="text-2xl opacity-90 mb-8">
                  Gestión Responsable de RAEE
                </div>
                <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-sm opacity-80 mb-1">Lote</div>
                    <div className="text-xl font-bold">{lote.codigo}</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-sm opacity-80 mb-1">Gestora</div>
                    <div className="text-xl font-bold">{gestora.nombre}</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-sm opacity-80 mb-1">Peso Total</div>
                    <div className="text-xl font-bold">{lote.pesoKg} kg</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-sm opacity-80 mb-1">Fecha</div>
                    <div className="text-xl font-bold">
                      {new Date().toLocaleDateString('es-UY')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
              Esta es una representación estática. El video real incluye animaciones profesionales con GSAP.
            </p>
          </Card>
        )}

        {/* ... resto de cards (items, institutos, cotización, etc.) */}

      </div>
    </div>
  )
}
