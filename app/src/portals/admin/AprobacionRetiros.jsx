/**
 * AprobacionRetiros - Panel de aprobación de retiros para administradores
 * Lista solicitudes de gestoras y permite aprobar o rechazar
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp, actualizarLoteConSupabase } from '../../context/AppContext'
import { useToast } from '../../components/molecules/Toast'
import { actualizarLotePublicacion } from '../../services/supabase'
import Button from '../../components/atoms/Button'
import Card from '../../components/molecules/Card'
import StatusBadge from '../../components/molecules/StatusBadge'
import PageHeader from '../../components/layout/PageHeader'
import { ArrowLeft, ChevronDown, ChevronUp, Package, Award, CheckCircle, XCircle, AlertCircle } from '../../components/atoms/Icon'
import { ESTADOS_LOTE } from '../../constants/estados'

export default function AprobacionRetiros() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const toast = useToast()
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
  const handleAprobarRetiro = async (lote) => {
    const gestoraId = gestoraSeleccionada[lote.id]

    if (!gestoraId) {
      toast.warning('Por favor seleccioná una gestora antes de aprobar')
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
      try {
        // Actualizar en Supabase
        await actualizarLotePublicacion(lote.id, {
          estado: ESTADOS_LOTE.RETIRO_APROBADO,
          gestora_asignada_id: gestoraId,
          fecha_asignacion: new Date().toISOString().split('T')[0]
        })

        // Actualizar en estado local
        dispatch({
          type: 'ACTUALIZAR_LOTE',
          payload: {
            id: lote.id,
            estado: ESTADOS_LOTE.RETIRO_APROBADO,
            gestora_asignada_id: gestoraId,
            gestoraAsignada_id: gestoraId,
            fecha_asignacion: new Date().toISOString().split('T')[0],
            fechaAsignacion: new Date().toISOString().split('T')[0]
          }
        })

        // Limpiar selección
        setGestoraSeleccionada({ ...gestoraSeleccionada, [lote.id]: null })
        setLoteExpandido(null)

        toast.success(`Retiro aprobado para ${gestora?.nombre}`)
      } catch (error) {
        console.error('Error aprobando retiro:', error)
        toast.error('Error al aprobar el retiro. Intentá de nuevo.')
      }
    }
  }

  // Handler para rechazar todas las solicitudes
  const handleRechazarSolicitudes = async (lote) => {
    const confirmacion = confirm(
      `¿Rechazar todas las solicitudes para ${lote.id}?\n\n` +
      `El lote volverá al catálogo como "Disponible para retiro".\n` +
      `Las ${lote.solicitudes_gestoras.length} gestora(s) recibirán notificación.`
    )

    if (confirmacion) {
      try {
        // Actualizar estado del lote en Supabase (las solicitudes quedan registradas)
        await actualizarLotePublicacion(lote.id, {
          estado: ESTADOS_LOTE.DISPONIBLE,
          gestora_asignada_id: null,
          fecha_asignacion: null
        })

        // Actualizar en estado local
        dispatch({
          type: 'ACTUALIZAR_LOTE',
          payload: {
            id: lote.id,
            estado: ESTADOS_LOTE.DISPONIBLE,
            gestora_asignada_id: null,
            gestoraAsignada_id: null,
            fecha_asignacion: null,
            fechaAsignacion: null
          }
        })

        setLoteExpandido(null)
        toast.info('Solicitudes rechazadas. Lote devuelto al catálogo.')
      } catch (error) {
        console.error('Error rechazando solicitudes:', error)
        toast.error('Error al rechazar solicitudes. Intentá de nuevo.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <PageHeader
          title="Aprobación de Retiros"
          description="Evaluar solicitudes de gestoras y aprobar retiros"
          actions={
            <Button variant="ghost" icon={<ArrowLeft size={18} />} onClick={() => navigate('/admin')}>
              Volver
            </Button>
          }
        />

        {/* Contador de pendientes */}
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200 dark:border-amber-700/50 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle size={24} className="text-amber-500" />
            <div>
              <p className="text-gray-900 dark:text-gray-100 font-semibold">
                {lotesPendientes.length} lote(s) con solicitudes pendientes de aprobación
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
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
                <Card key={lote.id} padding="none" className="overflow-hidden">
                  {/* Header del lote (clickeable para expandir) */}
                  <button
                    onClick={() => setLoteExpandido(expandido ? null : lote.id)}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Package size={24} className="text-primary-500" />
                      <div className="text-left">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-sm font-semibold text-primary-500">
                            {lote.id}
                          </span>
                          <StatusBadge estado={lote.estado} size="sm" />
                        </div>
                        <p className="text-gray-900 dark:text-gray-100 font-medium">{lote.categoria}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {lote.cantidad_items} ítems · {lote.peso_total_kg} kg · {lote.solicitudes_gestoras.length} solicitud(es)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
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
                    <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-6">
                      {/* Información del lote */}
                      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Fecha publicación</p>
                          <p className="text-sm text-gray-900 dark:text-gray-100">{lote.fecha_publicacion}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Institutos origen</p>
                          <p className="text-sm text-gray-900 dark:text-gray-100">{lote.institutos_origen?.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Observaciones</p>
                          <p className="text-sm text-gray-900 dark:text-gray-100">{lote.observaciones || 'Ninguna'}</p>
                        </div>
                      </div>

                      {/* Tabla de gestoras solicitantes */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                          Gestoras Solicitantes
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400">Seleccionar</th>
                                <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400">Gestora</th>
                                <th className="text-center py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400">Scoring</th>
                                <th className="text-center py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400">Habilitación</th>
                                <th className="text-right py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400">Cotización</th>
                                <th className="text-center py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400">Fecha</th>
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
                                      className={`border-b border-gray-100 dark:border-gray-800 ${
                                        seleccionada ? 'bg-primary-50 dark:bg-primary-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
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
                                          className="w-4 h-4 text-primary-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                        />
                                      </td>
                                      <td className="py-3 px-3">
                                        <span className="text-gray-900 dark:text-gray-100 font-medium">{gestora?.nombre}</span>
                                      </td>
                                      <td className="py-3 px-3 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                          <Award size={14} className="text-primary-500" />
                                          <span className="font-semibold text-primary-500">{gestora?.scoring}</span>
                                        </div>
                                      </td>
                                      <td className="py-3 px-3 text-center">
                                        {gestora?.habilitacion_ministerio ? (
                                          <CheckCircle size={16} className="text-green-500 mx-auto" />
                                        ) : (
                                          <XCircle size={16} className="text-red-500 mx-auto" />
                                        )}
                                      </td>
                                      <td className="py-3 px-3 text-right">
                                        <span className="text-gray-900 dark:text-gray-100 font-bold">
                                          ${solicitud.cotizacion.toLocaleString('es-UY')}
                                        </span>
                                      </td>
                                      <td className="py-3 px-3 text-center text-xs text-gray-500 dark:text-gray-400">
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
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                          variant="ghost"
                          onClick={() => handleRechazarSolicitudes(lote)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <XCircle size={18} className="mr-2" />
                          Rechazar Todas
                        </Button>

                        <Button
                          variant="primary"
                          icon={<CheckCircle size={18} />}
                          onClick={() => handleAprobarRetiro(lote)}
                          disabled={!gestoraIdSeleccionada}
                        >
                          Aprobar Retiro
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CheckCircle size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No hay solicitudes pendientes
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Todas las solicitudes han sido procesadas
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
