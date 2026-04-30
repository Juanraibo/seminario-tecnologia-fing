import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import PageHeader from '../../components/layout/PageHeader'
import Card, { StatCard } from '../../components/molecules/Card'
import Button from '../../components/atoms/Button'
import StatusBadge from '../../components/molecules/StatusBadge'
import { Package, TrendingUp, CheckCircle, Clock, Filter } from '../../components/atoms/Icon'
import { ESTADOS_LOTE } from '../../constants/estados'

export default function GestoraDashboard() {
  const { state } = useApp()
  const navigate = useNavigate()

  // Filtrar solo lotes de publicación
  const lotesPublicacion = state.lotes.filter(l => l.tipo === 'publicacion')

  // Estados para filtros
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas')
  const [estadoFiltro, setEstadoFiltro] = useState('disponibles')

  // Obtener gestora actual
  const gestora = state.gestoras?.find(g => g.id === state.usuarioActual?.gestoraId)

  // Lotes según filtros
  const lotesFiltrados = useMemo(() => {
    return lotesPublicacion.filter(lote => {
      // Filtro por estado
      if (estadoFiltro === 'disponibles' && lote.estado !== ESTADOS_LOTE.DISPONIBLE) return false
      if (estadoFiltro === 'solicitados') {
        const tengoCotizacion = lote.solicitudes_gestoras?.some(s => s.gestoraId === gestora?.id)
        if (!tengoCotizacion) return false
      }
      if (estadoFiltro === 'adjudicados' && lote.gestora_asignada_id !== gestora?.id) return false

      // Filtro por categoría
      if (categoriaFiltro !== 'todas' && lote.categoria !== categoriaFiltro) return false

      return true
    })
  }, [lotesPublicacion, categoriaFiltro, estadoFiltro, gestora])

  // Categorías únicas
  const categorias = [...new Set(lotesPublicacion.map(l => l.categoria))]

  // Estadísticas
  const stats = {
    disponibles: lotesPublicacion.filter(l => l.estado === ESTADOS_LOTE.DISPONIBLE).length,
    solicitados: lotesPublicacion.filter(l =>
      l.solicitudes_gestoras?.some(s => s.gestoraId === gestora?.id)
    ).length,
    adjudicados: lotesPublicacion.filter(l =>
      l.gestora_asignada_id === gestora?.id &&
      [ESTADOS_LOTE.SOLICITADO, ESTADOS_LOTE.RETIRO_APROBADO].includes(l.estado)
    ).length,
    finalizados: lotesPublicacion.filter(l =>
      l.gestora_asignada_id === gestora?.id &&
      l.estado === ESTADOS_LOTE.FINALIZADO
    ).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Portal Gestora"
        description="Catálogo de lotes RAEE disponibles para retiro"
        actions={
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => navigate('/gestora/solicitudes')}
              className="flex items-center gap-2"
            >
              <Clock size={18} />
              Mis Solicitudes
            </Button>
            {gestora && (
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Scoring actual</p>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {gestora.scoring}
                </p>
              </div>
            )}
          </div>
        }
      />

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<Package size={24} />}
          label="Disponibles"
          value={stats.disponibles}
        />
        <StatCard
          icon={<Clock size={24} />}
          label="Mis solicitudes"
          value={stats.solicitados}
        />
        <StatCard
          icon={<TrendingUp size={24} />}
          label="Adjudicados"
          value={stats.adjudicados}
        />
        <StatCard
          icon={<CheckCircle size={24} />}
          label="Finalizados"
          value={stats.finalizados}
        />
      </div>

      {/* Filtros */}
      <Card
        title="Filtros"
        headerAction={<Filter size={20} className="text-gray-400 dark:text-gray-500" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Filtro por estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado
            </label>
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="disponibles">Disponibles para cotizar</option>
              <option value="solicitados">Mis solicitudes</option>
              <option value="adjudicados">Adjudicados a mí</option>
              <option value="todos">Todos</option>
            </select>
          </div>

          {/* Filtro por categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoría RAEE
            </label>
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="todas">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Catálogo de lotes */}
      <Card
        title="Catálogo de Lotes"
        subtitle={`${lotesFiltrados.length} lote(s) encontrado(s)`}
      >
        {lotesFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lotesFiltrados.map(lote => {
              const miCotizacion = lote.solicitudes_gestoras?.find(s => s.gestoraId === gestora?.id)
              const esAdjudicado = lote.gestora_asignada_id === gestora?.id

              return (
                <div
                  key={lote.id}
                  onClick={() => navigate(`/gestora/lote/${lote.id}`)}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-glass hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-0.5 transition-all cursor-pointer group relative"
                >
                  {esAdjudicado && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700/50">
                        <CheckCircle size={12} />
                        Adjudicado
                      </span>
                    </div>
                  )}

                  <div className="mb-3">
                    <span className="font-mono text-xs font-semibold text-primary-600 dark:text-primary-400">
                      {lote.id}
                    </span>
                  </div>

                  <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-2 text-lg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {lote.categoria}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Cantidad:</span>
                      <span className="text-gray-900 dark:text-gray-100 font-semibold">
                        {lote.cantidad_items} ítems
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Peso total:</span>
                      <span className="text-gray-900 dark:text-gray-100 font-semibold">
                        {lote.peso_total_kg} kg
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Origen:</span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium text-xs">
                        {lote.institutos_origen?.length} instituto(s)
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <StatusBadge estado={lote.estado} size="sm" />
                  </div>

                  {miCotizacion && (
                    <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg">
                      <p className="text-xs text-amber-600 dark:text-amber-300 mb-1">Tu cotización</p>
                      <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
                        ${miCotizacion.cotizacion.toLocaleString('es-UY')} UYU
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="ghost" size="sm" fullWidth>
                      Ver Detalle
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No hay lotes disponibles
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {estadoFiltro === 'disponibles'
                ? 'No hay lotes disponibles para cotizar en este momento'
                : 'Probá cambiando los filtros'}
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
