import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Button from '../../components/atoms/Button'
import StatusBadge from '../../components/molecules/StatusBadge'
import { ArrowLeft, ChevronDown, ChevronUp, Package, Award, CheckCircle, XCircle, AlertCircle } from '../../components/atoms/Icon'
import { ESTADOS_LOTE } from '../../constants/estados'

export default function AprobacionRetiros() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [loteExpandido, setLoteExpandido] = useState(null)
  const [gestoraSeleccionada, setGestoraSeleccionada] = useState({})

  // Lotes con solicitudes pendientes de aprobación
  const lotesPendientes = state.lotes.filter(l =>
    l.tipo === 'publicacion' &&
    l.solicitudes_gestoras &&
    l.solicitudes_gestoras.length > 0 &&
    !l.gestora_asignada_id
  )

  // Handler para aprobar retiro
  const handleAprobarRetiro = (lote) => {
    const gestoraId = gestoraSeleccionada[lote.id]

    if (!gestoraId) {
      alert('Por favor seleccioná una gestora antes de aprobar')
      return
    }

    const gestora = state.gestoras?.find(g => g.id === gestoraId)
    const confirmacion = confirm(
      `¿Confirmar aprobación de retiro?\n\n` +
      `Lote: ${lote.id}\n` +
      `Gestora: ${gestora?.nombre}\n` +
      `Scoring: ${gestora?.scoring}\n\n` +
      `La gestora será notificada para proceder con el retiro.`
    )

    if (confirmacion) {
      dispatch({
        type: 'ACTUALIZAR_LOTE',
        payload: {
          id: lote.id,
          estado: ESTADOS_LOTE.RETIRO_APROBADO,
          gestora_asignada_id: gestoraId,
          gestora_asignada: gestora?.nombre,
          fecha_aprobacion: new Date().toISOString().split('T')[0]
        }
      })

      // Limpiar selección
      setGestoraSeleccionada({ ...gestoraSeleccionada, [lote.id]: null })
      setLoteExpandido(null)

      alert(`✅ Retiro aprobado\n\n${gestora?.nombre} fue notificada y debe proceder con el retiro.`)
    }
  }

  // Handler para rechazar todas las solicitudes
  const handleRechazarSolicitudes = (lote) => {
    const confirmacion = confirm(
      `¿Rechazar todas las solicitudes para ${lote.id}?\n\n` +
      `El lote volverá al catálogo como "Disponible para retiro".\n` +
      `Las ${lote.solicitudes_gestoras.length} gestora(s) no serán notificadas.`
    )

    if (confirmacion) {
      dispatch({
        type: 'ACTUALIZAR_LOTE',
        payload: {
          id: lote.id,
          estado: ESTADOS_LOTE.DISPONIBLE,
          solicitudes_gestoras: []
        }
      })

      setLoteExpandido(null)
      alert('Solicitudes rechazadas. El lote volvió al catálogo.')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradiente de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 via-transparent to-secondary-500/5"></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Volver
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">
              Aprobación de Retiros
            </h1>
            <p className="text-gray-400">
              Evaluar solicitudes de gestoras y aprobar retiros
            </p>
          </div>
        </div>

        {/* Contador de pendientes */}
        <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/10 backdrop-blur-xl rounded-2xl border border-amber-500/50 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle size={24} className="text-amber-400" />
            <div>
              <p className="text-white font-semibold">
                {lotesPendientes.length} lote(s) con solicitudes pendientes de aprobación
              </p>
              <p className="text-xs text-amber-300 mt-0.5">
                Total de solicitudes: {lotesPendientes.reduce((sum, l) => sum + l.solicitudes_gestoras.length, 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Lista de lotes */}
        {lotesPendientes.length > 0 ? (
          <div className="space-y-4">
            {lotesPendientes.map(lote => {
              const expandido = loteExpandido === lote.id
              const gestoraIdSeleccionada = gestoraSeleccionada[lote.id]

              return (
                <div
                  key={lote.id}
                  className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 overflow-hidden"
                >
                  {/* Header del lote (clickeable para expandir) */}
                  <button
                    onClick={() => setLoteExpandido(expandido ? null : lote.id)}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Package size={24} className="text-primary-400" />
                      <div className="text-left">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-sm font-semibold text-primary-400">
                            {lote.id}
                          </span>
                          <StatusBadge estado={lote.estado} size="sm" />
                        </div>
                        <p className="text-white font-medium">{lote.categoria}</p>
                        <p className="text-sm text-gray-400">
                          {lote.cantidad_items} ítems · {lote.peso_total_kg} kg · {lote.solicitudes_gestoras.length} solicitud(es)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        {expandido ? 'Contraer' : 'Expandir'}
                      </span>
                      {expandido ? (
                        <ChevronUp size={20} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Contenido expandible */}
                  {expandido && (
                    <div className="border-t border-gray-800 p-6 space-y-6">
                      {/* Información del lote */}
                      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800/30 rounded-xl">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Fecha publicación</p>
                          <p className="text-sm text-white">{lote.fecha_publicacion}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Institutos origen</p>
                          <p className="text-sm text-white">{lote.institutos_origen?.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Observaciones</p>
                          <p className="text-sm text-white">{lote.observaciones || 'Ninguna'}</p>
                        </div>
                      </div>

                      {/* Tabla de gestoras solicitantes */}
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-3">
                          Gestoras Solicitantes
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-800">
                                <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Seleccionar</th>
                                <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Gestora</th>
                                <th className="text-center py-2 px-3 text-xs font-medium text-gray-400">Scoring</th>
                                <th className="text-center py-2 px-3 text-xs font-medium text-gray-400">Habilitación</th>
                                <th className="text-right py-2 px-3 text-xs font-medium text-gray-400">Cotización</th>
                                <th className="text-center py-2 px-3 text-xs font-medium text-gray-400">Fecha</th>
                              </tr>
                            </thead>
                            <tbody>
                              {lote.solicitudes_gestoras
                                .sort((a, b) => b.cotizacion - a.cotizacion)
                                .map((solicitud, idx) => {
                                  const gestora = state.gestoras?.find(g => g.id === solicitud.gestoraId)
                                  const seleccionada = gestoraIdSeleccionada === solicitud.gestoraId

                                  return (
                                    <tr
                                      key={idx}
                                      className={`border-b border-gray-800/50 ${
                                        seleccionada ? 'bg-primary-500/10' : 'hover:bg-gray-800/30'
                                      }`}
                                    >
                                      <td className="py-3 px-3">
                                        <input
                                          type="radio"
                                          name={`gestora-${lote.id}`}
                                          checked={seleccionada}
                                          onChange={() => setGestoraSeleccionada({
                                            ...gestoraSeleccionada,
                                            [lote.id]: solicitud.gestoraId
                                          })}
                                          className="w-4 h-4 text-primary-500 bg-gray-800 border-gray-600"
                                        />
                                      </td>
                                      <td className="py-3 px-3">
                                        <span className="text-white font-medium">{gestora?.nombre}</span>
                                      </td>
                                      <td className="py-3 px-3 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                          <Award size={14} className="text-primary-400" />
                                          <span className="font-semibold text-primary-400">{gestora?.scoring}</span>
                                        </div>
                                      </td>
                                      <td className="py-3 px-3 text-center">
                                        {gestora?.habilitacion_ministerio ? (
                                          <CheckCircle size={16} className="text-green-400 mx-auto" />
                                        ) : (
                                          <XCircle size={16} className="text-red-400 mx-auto" />
                                        )}
                                      </td>
                                      <td className="py-3 px-3 text-right">
                                        <span className="text-white font-bold">
                                          ${solicitud.cotizacion.toLocaleString('es-UY')}
                                        </span>
                                      </td>
                                      <td className="py-3 px-3 text-center text-xs text-gray-400">
                                        {solicitud.fecha}
                                      </td>
                                    </tr>
                                  )
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                        <Button
                          variant="ghost"
                          onClick={() => handleRechazarSolicitudes(lote)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <XCircle size={18} className="mr-2" />
                          Rechazar Todas
                        </Button>

                        <Button
                          onClick={() => handleAprobarRetiro(lote)}
                          disabled={!gestoraIdSeleccionada}
                          className="bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckCircle size={18} className="mr-2" />
                          Aprobar Retiro
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-12 text-center">
            <CheckCircle size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No hay solicitudes pendientes
            </h3>
            <p className="text-gray-400 text-sm">
              Todas las solicitudes han sido procesadas
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
