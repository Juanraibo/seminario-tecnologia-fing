import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Button from '../../components/atoms/Button'
import StatusBadge from '../../components/molecules/StatusBadge'
import { ArrowLeft, Package, TrendingUp, AlertCircle, DollarSign, Building2, CheckCircle } from '../../components/atoms/Icon'
import { ESTADOS_LOTE } from '../../constants/estados'

export default function DetalleLote() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const [cotizacion, setCotizacion] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Obtener gestora actual
  const gestora = state.gestoras?.find(g => g.id === state.usuarioActual?.gestoraId)

  // Buscar lote de publicación
  const lote = state.lotes.find(l => l.id === id && l.tipo === 'publicacion')

  // Buscar ítems del lote
  const items = state.items?.filter(item => lote?.items_ids?.includes(item.id)) || []

  // Buscar institutos de origen
  const institutos = state.institutos?.filter(inst => lote?.institutos_origen?.includes(inst.id)) || []

  // Verificar si esta gestora ya cotizó
  const miCotizacion = lote?.solicitudes_gestoras?.find(s => s.gestoraId === gestora?.id)
  const esAdjudicado = lote?.gestora_asignada_id === gestora?.id
  const puedeCotziar = lote?.estado === ESTADOS_LOTE.DISPONIBLE && !miCotizacion

  if (!lote) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"></div>
        <div className="relative max-w-7xl mx-auto p-6">
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
            <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Lote no encontrado</h2>
            <p className="text-gray-400 mb-4">El lote {id} no existe o no está disponible</p>
            <Button onClick={() => navigate('/gestora')} variant="secondary">
              Volver al catálogo
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleEnviarCotizacion = () => {
    const monto = parseFloat(cotizacion)

    if (!monto || monto <= 0) {
      alert('Por favor ingresá un monto válido')
      return
    }

    setEnviando(true)

    // Simular delay de red
    setTimeout(() => {
      // Actualizar lote con nueva solicitud
      dispatch({
        type: 'AGREGAR_SOLICITUD_GESTORA',
        payload: {
          loteId: lote.id,
          gestoraId: gestora.id,
          cotizacion: monto,
          fecha: new Date().toISOString().split('T')[0]
        }
      })

      setEnviando(false)
      setCotizacion('')
      alert('¡Cotización enviada correctamente!')
    }, 800)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradiente de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 via-transparent to-secondary-500/5"></div>
      </div>

      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto p-6 space-y-6">
        {/* Header con botón de regreso */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/gestora')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Volver
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">
                Detalle del Lote
              </h1>
              {esAdjudicado && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-primary-500/20 text-primary-300 border border-primary-500/50">
                  <CheckCircle size={16} />
                  Adjudicado a ti
                </span>
              )}
            </div>
            <p className="text-gray-400">
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
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Package size={24} className="text-primary-400" />
                Información General
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Categoría RAEE</p>
                  <p className="text-white font-semibold">{lote.categoria}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Código del lote</p>
                  <p className="text-white font-mono text-sm">{lote.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Cantidad de ítems</p>
                  <p className="text-white font-semibold">{lote.cantidad_items} unidades</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Peso total</p>
                  <p className="text-white font-semibold">{lote.peso_total_kg} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Fecha de publicación</p>
                  <p className="text-white font-medium">{lote.fecha_publicacion || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Institutos de origen</p>
                  <div className="flex flex-wrap gap-1">
                    {institutos.map(inst => (
                      <span
                        key={inst.id}
                        className="inline-block px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded text-xs text-blue-300 font-medium"
                      >
                        {inst.sigla}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {lote.observaciones && (
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Observaciones</p>
                  <p className="text-sm text-gray-300">{lote.observaciones}</p>
                </div>
              )}
            </div>

            {/* Ítems individuales con trazabilidad */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={24} className="text-primary-400" />
                Ítems Individuales ({items.length})
              </h2>

              <div className="space-y-3">
                {items.map(item => {
                  const loteOrigen = state.lotes.find(l => l.id === item.loteOrigenId)
                  const instituto = state.institutos?.find(i => i.id === item.institutoId)

                  return (
                    <div
                      key={item.id}
                      className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 hover:bg-gray-800/50 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        {/* Info del ítem */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-mono text-xs text-gray-500 mb-1">{item.id}</p>
                              <p className="text-white font-medium">{item.descripcion}</p>
                            </div>
                            <span className="text-sm font-semibold text-primary-400">
                              {item.peso_kg} kg
                            </span>
                          </div>

                          {/* Trazabilidad */}
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                              <Building2 size={14} />
                              <span>{instituto?.sigla || item.institutoId}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Package size={14} />
                              <span>Origen: {item.loteOrigenId}</span>
                            </div>
                            {item.clasificado_por_ia && (
                              <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 rounded text-purple-300">
                                Clasificado por IA
                              </span>
                            )}
                          </div>

                          {item.observaciones && (
                            <p className="text-xs text-gray-500 mt-2">{item.observaciones}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Columna derecha: Cotizaciones */}
          <div className="space-y-6">
            {/* Mi cotización o formulario */}
            {miCotizacion ? (
              <div className="bg-gradient-to-br from-primary-500/20 to-primary-600/10 backdrop-blur-xl rounded-2xl border border-primary-500/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle size={24} className="text-primary-400" />
                  <h2 className="text-lg font-semibold text-white">Tu Cotización</h2>
                </div>
                <div className="text-center py-4">
                  <p className="text-sm text-primary-300 mb-2">Monto cotizado</p>
                  <p className="text-4xl font-bold text-white">
                    ${miCotizacion.cotizacion.toLocaleString('es-UY')}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Enviado el {miCotizacion.fecha}
                  </p>
                </div>
                <div className="mt-4 p-3 bg-primary-500/10 rounded-lg">
                  <p className="text-xs text-primary-300 text-center">
                    {esAdjudicado
                      ? '¡Felicitaciones! Este lote te fue adjudicado'
                      : 'Esperando evaluación por parte de Ecopunto'}
                  </p>
                </div>
              </div>
            ) : puedeCotziar ? (
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign size={24} className="text-primary-400" />
                  <h2 className="text-lg font-semibold text-white">Cotizar Lote</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Monto de tu cotización (UYU)
                    </label>
                    <input
                      type="number"
                      value={cotizacion}
                      onChange={(e) => setCotizacion(e.target.value)}
                      placeholder="Ej: 1500"
                      className="w-full bg-gray-950/50 border border-gray-700 text-white rounded-xl px-4 py-3 text-lg font-semibold focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                      disabled={enviando}
                    />
                  </div>

                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-xs text-blue-300">
                      💡 <strong>Tip:</strong> Cotizaciones competitivas tienen más probabilidad de ser adjudicadas. Tu scoring actual: <strong>{gestora?.scoring}</strong>
                    </p>
                  </div>

                  <Button
                    onClick={handleEnviarCotizacion}
                    fullWidth
                    disabled={!cotizacion || enviando}
                    className="bg-primary-500 hover:bg-primary-600 text-white"
                  >
                    {enviando ? 'Enviando...' : 'Enviar Cotización'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
                <div className="text-center py-4">
                  <AlertCircle size={48} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-sm">
                    Este lote no está disponible para cotizar
                  </p>
                </div>
              </div>
            )}

            {/* Cotizaciones de otras gestoras */}
            {lote.solicitudes_gestoras && lote.solicitudes_gestoras.length > 0 && (
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Cotizaciones Recibidas ({lote.solicitudes_gestoras.length})
                </h3>

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
                              ? 'bg-primary-500/10 border-primary-500/50'
                              : esMia
                              ? 'bg-amber-500/10 border-amber-500/50'
                              : 'bg-gray-800/30 border-gray-700/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium ${
                                esGanadora ? 'text-primary-300' :
                                esMia ? 'text-amber-300' : 'text-gray-300'
                              }`}>
                                {esMia ? 'Tu empresa' : gestoraInfo?.nombre || 'Gestora'}
                              </span>
                              {esGanadora && (
                                <CheckCircle size={14} className="text-primary-400" />
                              )}
                            </div>
                            <span className={`text-xs ${
                              esGanadora ? 'text-primary-400' :
                              esMia ? 'text-amber-400' : 'text-gray-500'
                            }`}>
                              {solicitud.fecha}
                            </span>
                          </div>
                          <p className={`text-2xl font-bold ${
                            esGanadora ? 'text-primary-300' :
                            esMia ? 'text-amber-300' : 'text-white'
                          }`}>
                            ${solicitud.cotizacion.toLocaleString('es-UY')}
                          </p>
                          {esGanadora && (
                            <p className="text-xs text-primary-400 mt-1">Cotización adjudicada</p>
                          )}
                        </div>
                      )
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
