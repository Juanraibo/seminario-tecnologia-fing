import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradiente de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 via-transparent to-secondary-500/5"></div>
      </div>

      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Portal Gestora
            </h1>
            <p className="text-gray-400">
              Catálogo de lotes RAEE disponibles para retiro
            </p>
          </div>
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
                <p className="text-sm text-gray-400">Scoring actual</p>
                <p className="text-3xl font-bold text-primary-400">{gestora.scoring}</p>
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">
                  Disponibles
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {stats.disponibles}
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-xl">
                <Package size={24} className="text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">
                  Mis solicitudes
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {stats.solicitados}
                </p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <Clock size={24} className="text-amber-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">
                  Adjudicados
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {stats.adjudicados}
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <TrendingUp size={24} className="text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">
                  Finalizados
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {stats.finalizados}
                </p>
              </div>
              <div className="p-3 bg-primary-500/10 rounded-xl">
                <CheckCircle size={24} className="text-primary-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-gray-400" />
            <h2 className="text-lg font-semibold text-white">Filtros</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Filtro por estado */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estado
              </label>
              <select
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
                className="w-full bg-gray-950/50 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="disponibles">Disponibles para cotizar</option>
                <option value="solicitados">Mis solicitudes</option>
                <option value="adjudicados">Adjudicados a mí</option>
                <option value="todos">Todos</option>
              </select>
            </div>

            {/* Filtro por categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoría RAEE
              </label>
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="w-full bg-gray-950/50 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="todas">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Catálogo de lotes */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Catálogo de Lotes
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {lotesFiltrados.length} lote(s) encontrado(s)
              </p>
            </div>
          </div>

          {lotesFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lotesFiltrados.map(lote => {
                const miCotizacion = lote.solicitudes_gestoras?.find(s => s.gestoraId === gestora?.id)
                const esAdjudicado = lote.gestora_asignada_id === gestora?.id

                return (
                  <div
                    key={lote.id}
                    onClick={() => navigate(`/gestora/lote/${lote.id}`)}
                    className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5 hover:bg-gray-800/50 hover:border-gray-600/50 transition-all cursor-pointer group relative"
                  >
                    {esAdjudicado && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-300 border border-primary-500/50">
                          <CheckCircle size={12} />
                          Adjudicado
                        </span>
                      </div>
                    )}

                    <div className="mb-3">
                      <span className="font-mono text-xs font-semibold text-primary-400">
                        {lote.id}
                      </span>
                    </div>

                    <h3 className="text-white font-semibold mb-2 text-lg group-hover:text-primary-400 transition-colors">
                      {lote.categoria}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Cantidad:</span>
                        <span className="text-white font-semibold">{lote.cantidad_items} ítems</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Peso total:</span>
                        <span className="text-white font-semibold">{lote.peso_total_kg} kg</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Origen:</span>
                        <span className="text-white font-medium text-xs">
                          {lote.institutos_origen?.length} instituto(s)
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <StatusBadge estado={lote.estado} size="sm" />
                    </div>

                    {miCotizacion && (
                      <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <p className="text-xs text-amber-300 mb-1">Tu cotización</p>
                        <p className="text-sm font-bold text-amber-400">
                          ${miCotizacion.cotizacion.toLocaleString('es-UY')} UYU
                        </p>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-700/50">
                      <Button
                        variant="ghost"
                        size="sm"
                        fullWidth
                        className="group-hover:bg-primary-500/10 group-hover:text-primary-400 group-hover:border-primary-500/50"
                      >
                        Ver Detalle
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No hay lotes disponibles
              </h3>
              <p className="text-gray-400 text-sm">
                {estadoFiltro === 'disponibles'
                  ? 'No hay lotes disponibles para cotizar en este momento'
                  : 'Probá cambiando los filtros'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
