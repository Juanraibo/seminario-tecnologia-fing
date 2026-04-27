import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Button from '../../components/atoms/Button'
import StatusBadge from '../../components/molecules/StatusBadge'
import { TrendingUp, Award, Clock, CheckCircle, XCircle, DollarSign, Package } from '../../components/atoms/Icon'
import { ESTADOS_LOTE } from '../../constants/estados'

export default function MisSolicitudes() {
  const { state } = useApp()
  const navigate = useNavigate()

  // Obtener gestora actual
  const gestora = state.gestoras?.find(g => g.id === state.usuarioActual?.gestoraId)

  // Obtener todos los lotes de publicación donde esta gestora tiene solicitud
  const misSolicitudes = useMemo(() => {
    const lotesSolicitados = state.lotes.filter(lote => {
      if (lote.tipo !== 'publicacion') return false
      return lote.solicitudes_gestoras?.some(s => s.gestoraId === gestora?.id)
    })

    return lotesSolicitados.map(lote => {
      const miCotizacion = lote.solicitudes_gestoras.find(s => s.gestoraId === gestora?.id)
      const totalCotizaciones = lote.solicitudes_gestoras?.length || 0
      const esAdjudicado = lote.gestora_asignada_id === gestora?.id
      const esRechazado = lote.gestora_asignada_id && lote.gestora_asignada_id !== gestora?.id

      return {
        lote,
        miCotizacion,
        totalCotizaciones,
        esAdjudicado,
        esRechazado,
        estado: esAdjudicado ? 'adjudicado' : esRechazado ? 'rechazado' : 'pendiente'
      }
    }).sort((a, b) => {
      // Ordenar: adjudicados primero, luego pendientes, luego rechazados
      if (a.estado !== b.estado) {
        const orden = { adjudicado: 0, pendiente: 1, rechazado: 2 }
        return orden[a.estado] - orden[b.estado]
      }
      return new Date(b.miCotizacion.fecha) - new Date(a.miCotizacion.fecha)
    })
  }, [state.lotes, gestora])

  // Estadísticas
  const stats = {
    total: misSolicitudes.length,
    adjudicados: misSolicitudes.filter(s => s.esAdjudicado).length,
    pendientes: misSolicitudes.filter(s => s.estado === 'pendiente').length,
    rechazados: misSolicitudes.filter(s => s.esRechazado).length,
  }

  // Calcular porcentaje de éxito
  const tasaExito = stats.total > 0
    ? Math.round((stats.adjudicados / stats.total) * 100)
    : 0

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradiente de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 via-transparent to-secondary-500/5"></div>
      </div>

      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Mis Solicitudes
          </h1>
          <p className="text-gray-400">
            Historial de cotizaciones y gestión de scoring
          </p>
        </div>

        {/* Grid de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Scoring actual */}
          <div className="bg-gradient-to-br from-primary-500/20 to-primary-600/10 backdrop-blur-xl rounded-2xl border border-primary-500/50 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-primary-300">
                  Scoring Actual
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {gestora?.scoring || 0}
                </p>
                <p className="text-xs text-primary-400 mt-1">de 100 puntos</p>
              </div>
              <div className="p-3 bg-primary-500/20 rounded-xl">
                <Award size={24} className="text-primary-400" />
              </div>
            </div>
          </div>

          {/* Total solicitudes */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">
                  Total Solicitudes
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-gray-500/10 rounded-xl">
                <Package size={24} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Adjudicados */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">
                  Adjudicados
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {stats.adjudicados}
                </p>
                <p className="text-xs text-green-400 mt-1">Tasa: {tasaExito}%</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-xl">
                <CheckCircle size={24} className="text-green-400" />
              </div>
            </div>
          </div>

          {/* Pendientes */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">
                  Pendientes
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {stats.pendientes}
                </p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <Clock size={24} className="text-amber-400" />
              </div>
            </div>
          </div>

          {/* Rechazados */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">
                  No adjudicados
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {stats.rechazados}
                </p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-xl">
                <XCircle size={24} className="text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Información del scoring */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={24} className="text-primary-400" />
            <h2 className="text-xl font-semibold text-white">¿Cómo funciona el Scoring?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <p className="text-sm font-semibold text-green-400 mb-2">Suma puntos (+)</p>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• Certificados entregados a tiempo: +5 pts</li>
                <li>• Lotes completados sin incidentes: +3 pts</li>
                <li>• Cotizaciones adjudicadas: +2 pts</li>
              </ul>
            </div>

            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-sm font-semibold text-red-400 mb-2">Resta puntos (-)</p>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• Certificados con demora: -5 pts</li>
                <li>• Incumplimiento de retiro: -10 pts</li>
                <li>• Certificado rechazado: -15 pts</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <p className="text-sm font-semibold text-blue-400 mb-2">Rangos de scoring</p>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• 0-30: Gestora nueva o con problemas</li>
                <li>• 31-60: Gestora regular</li>
                <li>• 61-100: Gestora confiable</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Listado de solicitudes */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Historial de Solicitudes
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {misSolicitudes.length} solicitud(es) realizada(s)
              </p>
            </div>
          </div>

          {misSolicitudes.length > 0 ? (
            <div className="space-y-3">
              {misSolicitudes.map(({ lote, miCotizacion, totalCotizaciones, esAdjudicado, esRechazado, estado }) => (
                <div
                  key={lote.id}
                  onClick={() => navigate(`/gestora/lote/${lote.id}`)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${
                    esAdjudicado
                      ? 'bg-primary-500/10 border-primary-500/50 hover:bg-primary-500/15'
                      : esRechazado
                      ? 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50'
                      : 'bg-gray-800/30 border-amber-500/50 hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-xs font-semibold text-primary-400">
                          {lote.id}
                        </span>
                        {esAdjudicado && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-300 border border-primary-500/50">
                            <CheckCircle size={12} />
                            Adjudicado
                          </span>
                        )}
                        {esRechazado && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/50">
                            <XCircle size={12} />
                            No adjudicado
                          </span>
                        )}
                        {estado === 'pendiente' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/50">
                            <Clock size={12} />
                            En evaluación
                          </span>
                        )}
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-1">
                        {lote.categoria}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {lote.cantidad_items} ítems · {lote.peso_total_kg} kg
                      </p>
                    </div>
                    <StatusBadge estado={lote.estado} size="sm" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-700/50">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tu cotización</p>
                      <p className="text-lg font-bold text-white">
                        ${miCotizacion.cotizacion.toLocaleString('es-UY')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Fecha</p>
                      <p className="text-sm font-medium text-gray-300">
                        {miCotizacion.fecha}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Competencia</p>
                      <p className="text-sm font-medium text-gray-300">
                        {totalCotizaciones} gestora(s)
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <DollarSign size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No hay solicitudes aún
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Comenzá cotizando lotes disponibles para hacer crecer tu historial
              </p>
              <Button
                onClick={() => navigate('/gestora')}
                variant="primary"
              >
                Ver Catálogo de Lotes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
