/**
 * MisSolicitudes - Vista de solicitudes de cotización realizadas por la gestora
 * Muestra historial con scoring, estadísticas y detalle de cada gestión
 */

import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Button from '../../components/atoms/Button'
import Card, { StatCard } from '../../components/molecules/Card'
import StatusBadge from '../../components/molecules/StatusBadge'
import PageHeader from '../../components/layout/PageHeader'
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
    <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Mis Solicitudes"
          description="Historial de cotizaciones y gestión de scoring"
        />

        {/* Grid de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Scoring actual - Enterprise style */}
          <div className="enterprise-card p-5 bg-primary-50 dark:bg-primary-950/20 border-primary-200 dark:border-primary-800">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                  Scoring Actual
                </p>
                <p className="text-4xl font-bold text-primary-900 dark:text-primary-100 mt-2 tracking-tight">
                  {gestora?.scoring || 0}
                </p>
                <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">de 100 puntos</p>
              </div>
              <div className="p-2.5 rounded-lg bg-primary-600 dark:bg-primary-500 shrink-0 ml-4">
                <Award size={18} className="text-white" />
              </div>
            </div>
          </div>

          <StatCard
            icon={<Package size={18} />}
            label="Total Solicitudes"
            value={stats.total}
          />
          <StatCard
            icon={<CheckCircle size={18} />}
            label="Adjudicados"
            value={stats.adjudicados}
            trend="up"
            trendValue={`Tasa: ${tasaExito}%`}
          />
          <StatCard
            icon={<Clock size={18} />}
            label="Pendientes"
            value={stats.pendientes}
          />
          <StatCard
            icon={<XCircle size={18} />}
            label="No adjudicados"
            value={stats.rechazados}
          />
        </div>

        {/* Información del scoring */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={24} className="text-primary-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">¿Cómo funciona el Scoring?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">Suma puntos (+)</p>
              <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                <li>• Certificados entregados a tiempo: +5 pts</li>
                <li>• Lotes completados sin incidentes: +3 pts</li>
                <li>• Cotizaciones adjudicadas: +2 pts</li>
              </ul>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Resta puntos (-)</p>
              <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                <li>• Certificados con demora: -5 pts</li>
                <li>• Incumplimiento de retiro: -10 pts</li>
                <li>• Certificado rechazado: -15 pts</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">Rangos de scoring</p>
              <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                <li>• 0-30: Gestora nueva o con problemas</li>
                <li>• 31-60: Gestora regular</li>
                <li>• 61-100: Gestora confiable</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Listado de solicitudes */}
        <Card title="Historial de Solicitudes" subtitle={`${misSolicitudes.length} solicitud(es) realizada(s)`}>
          {misSolicitudes.length > 0 ? (
            <div className="space-y-3">
              {misSolicitudes.map(({ lote, miCotizacion, totalCotizaciones, esAdjudicado, esRechazado, estado }) => (
                <div
                  key={lote.id}
                  onClick={() => navigate(`/gestora/lote/${lote.id}`)}
                  className={`enterprise-card p-5 cursor-pointer transition-all duration-200 hover:scale-[1.01] ${
                    esAdjudicado
                      ? 'bg-primary-50 dark:bg-primary-950/20 border-primary-200 dark:border-primary-800'
                      : esRechazado
                      ? ''
                      : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-xs font-semibold text-primary-500">
                          {lote.id}
                        </span>
                        {esAdjudicado && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700/50">
                            <CheckCircle size={12} />
                            Adjudicado
                          </span>
                        )}
                        {esRechazado && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600/50">
                            <XCircle size={12} />
                            No adjudicado
                          </span>
                        )}
                        {estado === 'pendiente' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50">
                            <Clock size={12} />
                            En evaluación
                          </span>
                        )}
                      </div>
                      <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-lg mb-1">
                        {lote.categoria}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {lote.cantidad_items} ítems · {lote.peso_total_kg} kg
                      </p>
                    </div>
                    <StatusBadge estado={lote.estado} size="sm" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tu cotización</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        ${miCotizacion.cotizacion.toLocaleString('es-UY')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Fecha</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {miCotizacion.fecha}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Competencia</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {totalCotizaciones} gestora(s)
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <DollarSign size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No hay solicitudes aún
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Comenzá cotizando lotes disponibles para hacer crecer tu historial
              </p>
              <Button onClick={() => navigate('/gestora')} variant="primary">
                Ver Catálogo de Lotes
              </Button>
            </div>
          )}
        </Card>
    </div>
  )
}
