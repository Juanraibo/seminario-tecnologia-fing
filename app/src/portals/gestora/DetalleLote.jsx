/**
 * DetalleLote (Gestora) - Vista detalle de un lote disponible para cotizar
 * Permite ver información, items y enviar cotización
 */

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../components/molecules/Toast'
import { crearSolicitudGestora } from '../../services/supabase'
import Button from '../../components/atoms/Button'
import Card from '../../components/molecules/Card'
import StatusBadge from '../../components/molecules/StatusBadge'
import { ArrowLeft, Package, TrendingUp, AlertCircle, DollarSign, Building2, CheckCircle } from '../../components/atoms/Icon'
import { ESTADOS_LOTE } from '../../constants/estados'

export default function DetalleLote() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const toast = useToast()
  const [cotizacion, setCotizacion] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Obtener gestora actual
  const gestora = state.gestoras?.find(g => g.id === state.usuarioActual?.gestoraId)

  // Buscar lote de publicación
  const lote = state.lotes.find(l => l.id === id && l.tipo === 'publicacion')

  // Buscar ítems del lote (usando lotePublicadoId)
  const items = state.items?.filter(item => item.lotePublicadoId === id) || []

  // Buscar institutos de origen (únicos de los items)
  const institutosIds = [...new Set(items.map(item => item.institutoId))]
  const institutos = state.institutos?.filter(inst => institutosIds.includes(inst.id)) || []

  // Verificar si esta gestora ya cotizó
  const miCotizacion = lote?.solicitudes_gestoras?.find(s => s.gestoraId === gestora?.id)
  const esAdjudicado = lote?.gestora_asignada_id === gestora?.id
  const puedeCotziar = lote?.estado === ESTADOS_LOTE.DISPONIBLE && !miCotizacion

  if (!lote) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto p-6">
          <Card className="text-center">
            <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Lote no encontrado</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">El lote {id} no existe o no está disponible</p>
            <Button onClick={() => navigate('/gestora')} variant="secondary">
              Volver al catálogo
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  const handleEnviarCotizacion = async () => {
    const monto = parseFloat(cotizacion)

    if (!monto || monto <= 0) {
      toast.error('Por favor ingresá un monto válido')
      return
    }

    setEnviando(true)

    try {
      // Crear solicitud en Supabase
      const nuevaSolicitud = {
        lote_publicacion_id: lote.id,
        gestora_id: gestora.id,
        cotizacion_monto: monto,
        estado: 'pendiente'
      }

      await crearSolicitudGestora(nuevaSolicitud)

      // Actualizar estado local
      dispatch({
        type: 'AGREGAR_SOLICITUD_GESTORA',
        payload: {
          loteId: lote.id,
          gestoraId: gestora.id,
          cotizacion: monto,
          fecha: new Date().toISOString().split('T')[0]
        }
      })

      setCotizacion('')
      toast.success(`Cotización de $${monto.toLocaleString()} enviada correctamente`)
    } catch (error) {
      console.error('Error enviando cotización:', error)
      toast.error('Error al enviar la cotización. Intentá de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header con botón de regreso */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button
            variant="ghost"
            icon={<ArrowLeft size={18} />}
            onClick={() => navigate('/gestora')}
          >
            Volver
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Detalle del Lote
              </h1>
              {esAdjudicado && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700/50">
                  <CheckCircle size={16} />
                  Adjudicado a ti
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {lote.id} · {lote.categoria}
            </p>
          </div>
          <StatusBadge estado={lote.estado} />
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda: Información del lote */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información general */}
            <Card title="Información General">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Categoría RAEE</p>
                  <p className="text-gray-900 dark:text-gray-100 font-semibold">{lote.categoria}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Código del lote</p>
                  <p className="text-gray-900 dark:text-gray-100 font-mono text-sm">{lote.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Cantidad de ítems</p>
                  <p className="text-gray-900 dark:text-gray-100 font-semibold">{lote.cantidad_items} unidades</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Peso total</p>
                  <p className="text-gray-900 dark:text-gray-100 font-semibold">{lote.peso_total_kg} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Fecha de publicación</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{lote.fecha_publicacion || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Institutos de origen</p>
                  <div className="flex flex-wrap gap-1">
                    {institutos.map(inst => (
                      <span
                        key={inst.id}
                        className="inline-block px-2 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-700 dark:text-blue-300 font-medium"
                      >
                        {inst.sigla}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {lote.observaciones && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Observaciones</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{lote.observaciones}</p>
                </div>
              )}
            </Card>

            {/* Ítems individuales con trazabilidad */}
            <Card title={`Ítems Individuales (${items.length})`}>
              <div className="space-y-3">
                {items.map(item => {
                  const loteOrigen = state.lotes.find(l => l.id === item.loteOrigenId)
                  const instituto = state.institutos?.find(i => i.id === item.institutoId)

                  return (
                    <div
                      key={item.id}
                      className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        {/* Imagen del ítem */}
                        <img
                          src={item.foto_url || `https://picsum.photos/seed/${item.id}/200/200`}
                          alt={item.descripcion}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700 flex-shrink-0"
                        />

                        {/* Info del ítem */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-mono text-xs text-gray-500 dark:text-gray-400 mb-1">{item.id}</p>
                              <p className="text-gray-900 dark:text-gray-100 font-medium">{item.descripcion}</p>
                            </div>
                            <span className="text-sm font-semibold text-primary-500">
                              {(item.pesoKg || item.peso_kg || 0)} kg
                            </span>
                          </div>

                          {/* Trazabilidad */}
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Building2 size={14} />
                              <span>{instituto?.sigla || item.institutoId}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Package size={14} />
                              <span>Origen: {item.loteOrigenId}</span>
                            </div>
                            {item.clasificado_por_ia && (
                              <span className="px-2 py-0.5 bg-accent-100 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded text-accent-700 dark:text-accent-300">
                                Clasificado por IA
                              </span>
                            )}
                          </div>

                          {item.observaciones && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{item.observaciones}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Columna derecha: Cotizaciones */}
          <div className="space-y-6">
            {/* Mi cotización o formulario */}
            {miCotizacion ? (
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle size={24} className="text-primary-500" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tu Cotización</h2>
                </div>
                <div className="text-center py-4">
                  <p className="text-sm text-primary-600 dark:text-primary-400 mb-2">Monto cotizado</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    ${miCotizacion.cotizacion.toLocaleString('es-UY')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Enviado el {miCotizacion.fecha}
                  </p>
                </div>
                <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                  <p className="text-xs text-primary-700 dark:text-primary-300 text-center">
                    {esAdjudicado
                      ? '¡Felicitaciones! Este lote te fue adjudicado'
                      : 'Esperando evaluación por parte de Ecopunto'}
                  </p>
                </div>
              </div>
            ) : puedeCotziar ? (
              <Card title="Cotizar Lote">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Monto de tu cotización (UYU)
                    </label>
                    <input
                      type="number"
                      value={cotizacion}
                      onChange={(e) => setCotizacion(e.target.value)}
                      placeholder="Ej: 1500"
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-3 text-lg font-semibold focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                      disabled={enviando}
                    />
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      💡 <strong>Tip:</strong> Cotizaciones competitivas tienen más probabilidad de ser adjudicadas. Tu scoring actual: <strong>{gestora?.scoring}</strong>
                    </p>
                  </div>

                  <Button
                    onClick={handleEnviarCotizacion}
                    fullWidth
                    disabled={!cotizacion || enviando}
                  >
                    {enviando ? 'Enviando...' : 'Enviar Cotización'}
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="text-center py-4">
                <AlertCircle size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Este lote no está disponible para cotizar
                </p>
              </Card>
            )}

            {/* Cotizaciones de otras gestoras */}
            {lote.solicitudes_gestoras && lote.solicitudes_gestoras.length > 0 && (
              <Card title={`Cotizaciones Recibidas (${lote.solicitudes_gestoras.length})`}>
                <div className="space-y-3">
                  {lote.solicitudes_gestoras
                    .sort((a, b) => b.cotizacion - a.cotizacion)
                    .map((solicitud, idx) => {
                      const gestoraInfo = state.gestoras?.find(g => g.id === solicitud.gestoraId)
                      const esMia = solicitud.gestoraId === gestora?.id
                      const esGanadora = solicitud.gestoraId === lote.gestora_asignada_id

                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-xl border ${
                            esGanadora
                              ? 'bg-primary-50 dark:bg-primary-900/10 border-primary-200 dark:border-primary-700/50'
                              : esMia
                              ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-700/50'
                              : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium ${
                                esGanadora ? 'text-primary-700 dark:text-primary-300' :
                                esMia ? 'text-amber-700 dark:text-amber-300' : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {esMia ? 'Tu empresa' : gestoraInfo?.nombre || 'Gestora'}
                              </span>
                              {esGanadora && (
                                <CheckCircle size={14} className="text-primary-500" />
                              )}
                            </div>
                            <span className={`text-xs ${
                              esGanadora ? 'text-primary-600 dark:text-primary-400' :
                              esMia ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {solicitud.fecha}
                            </span>
                          </div>
                          <p className={`text-2xl font-bold ${
                            esGanadora ? 'text-primary-700 dark:text-primary-300' :
                            esMia ? 'text-amber-700 dark:text-amber-300' : 'text-gray-900 dark:text-gray-100'
                          }`}>
                            ${solicitud.cotizacion.toLocaleString('es-UY')}
                          </p>
                          {esGanadora && (
                            <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">Cotización adjudicada</p>
                          )}
                        </div>
                      )
                    })}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
