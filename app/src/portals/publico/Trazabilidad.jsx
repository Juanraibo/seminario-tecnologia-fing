import { useSearchParams, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import {
  Recycle, MapPin, Calendar, Package, CheckCircle,
  Building2, Factory, Award, FileCheck, ChevronRight,
  Filter, Search, TrendingUp, Leaf, Scale, QrCode, Globe
} from '../../components/atoms/Icon'
import Card from '../../components/molecules/Card'
import Button from '../../components/atoms/Button'
import { StatCard } from '../../components/molecules/Card'
import PublicNav from '../../components/layout/PublicNav'
import { useState } from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'

export default function Trazabilidad() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { state } = useApp()
  const loteId = params.get('lote')

  // Si hay parámetro lote, mostrar detalle
  if (loteId) {
    return <DetalleLote loteId={loteId} state={state} />
  }

  // Sin parámetro: mostrar registro público de todos los lotes
  return <RegistroPublico state={state} />
}

// ============================================================================
// COMPONENTE: Registro Público (Listado de todos los lotes)
// ============================================================================
function RegistroPublico({ state }) {
  const navigate = useNavigate()
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [ordenamiento, setOrdenamiento] = useState('fecha_desc')

  // Solo mostrar lotes de publicación (los que son visibles públicamente)
  const lotesPublicos = state.lotes.filter(l => l.tipo === 'publicacion')

  // Calcular estadísticas globales
  const stats = {
    totalKg: lotesPublicos.reduce((sum, l) => sum + (l.peso_total_kg || 0), 0),
    totalCO2: lotesPublicos.reduce((sum, l) => sum + (l.peso_total_kg || 0) * 1.4, 0),
    finalizados: lotesPublicos.filter(l => l.estado === 'Finalizado').length,
    enProceso: lotesPublicos.filter(l => l.estado !== 'Finalizado').length,
  }

  // Filtrar por estado
  let lotesFiltrados = lotesPublicos.filter(lote => {
    const cumpleBusqueda = lote.id.toLowerCase().includes(busqueda.toLowerCase()) ||
                           lote.categoria.toLowerCase().includes(busqueda.toLowerCase())

    if (filtroEstado === 'todos') return cumpleBusqueda
    if (filtroEstado === 'finalizado') return lote.estado === 'Finalizado' && cumpleBusqueda
    if (filtroEstado === 'en_proceso') return lote.estado !== 'Finalizado' && cumpleBusqueda
    return cumpleBusqueda
  })

  // Ordenar
  lotesFiltrados = [...lotesFiltrados].sort((a, b) => {
    switch (ordenamiento) {
      case 'fecha_desc':
        return new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion)
      case 'fecha_asc':
        return new Date(a.fecha_publicacion) - new Date(b.fecha_publicacion)
      case 'peso_desc':
        return (b.peso_total_kg || 0) - (a.peso_total_kg || 0)
      case 'peso_asc':
        return (a.peso_total_kg || 0) - (b.peso_total_kg || 0)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Navbar público */}
      <PublicNav />

      {/* Hero section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 dark:from-primary-800 dark:via-primary-700 dark:to-primary-600">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-lg mb-6">
            <Globe size={32} className="text-white" strokeWidth={2} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Registro Público de Trazabilidad
          </h1>
          <p className="text-lg text-primary-50 max-w-2xl mx-auto mb-2">
            Consulta el recorrido completo de cada lote RAEE gestionado en la Facultad de Ingeniería.
          </p>
          <p className="text-sm text-primary-100 max-w-xl mx-auto">
            Transparencia total desde la solicitud hasta el certificado de disposición final.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6 -mt-8">
        {/* Estadísticas globales - Elevadas sobre el hero */}
        <Card className="shadow-enterprise-lg">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<Package size={18} />}
              label="Total Lotes"
              value={lotesPublicos.length}
              variant="default"
              delay={0}
            />
            <StatCard
              icon={<Scale size={18} />}
              label="Total RAEE"
              value={`${stats.totalKg.toFixed(1)} kg`}
              variant="default"
              delay={50}
            />
            <StatCard
              icon={<Leaf size={18} />}
              label="CO₂ Evitado"
              value={`${stats.totalCO2.toFixed(1)} kg`}
              variant="default"
              delay={100}
            />
            <StatCard
              icon={<CheckCircle size={18} />}
              label="Finalizados"
              value={`${stats.finalizados}/${lotesPublicos.length}`}
              variant="default"
              delay={150}
            />
          </div>
        </Card>

        {/* Barra de búsqueda y filtros */}
        <Card padding="default">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por código o categoría..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Filtros por estado */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFiltroEstado('todos')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroEstado === 'todos'
                    ? 'bg-primary-500 text-white dark:bg-primary-600'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFiltroEstado('finalizado')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroEstado === 'finalizado'
                    ? 'bg-primary-500 text-white dark:bg-primary-600'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Finalizados
              </button>
              <button
                onClick={() => setFiltroEstado('en_proceso')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroEstado === 'en_proceso'
                    ? 'bg-primary-500 text-white dark:bg-primary-600'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                En proceso
              </button>

              {/* Separador */}
              <div className="border-l border-gray-300 dark:border-gray-600 mx-2"></div>

              {/* Ordenamiento */}
              <select
                value={ordenamiento}
                onChange={(e) => setOrdenamiento(e.target.value)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-0 focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                <option value="fecha_desc">Más reciente</option>
                <option value="fecha_asc">Más antiguo</option>
                <option value="peso_desc">Mayor peso</option>
                <option value="peso_asc">Menor peso</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Listado de lotes */}
        {lotesFiltrados.length === 0 ? (
          <Card className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No se encontraron lotes con los filtros aplicados</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lotesFiltrados.map((lote, index) => (
              <TarjetaLote key={lote.id} lote={lote} state={state} index={index} />
            ))}
          </div>
        )}

        {/* Footer informativo */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-400 rounded-lg shadow-enterprise-lg p-6 text-white text-center">
          <h3 className="text-lg font-semibold mb-2">
            🌱 Contribución al Medio Ambiente
          </h3>
          <p className="text-sm opacity-90">
            Cada kilogramo de RAEE correctamente gestionado evita <strong>1.4 kg de CO₂</strong> y permite
            recuperar materiales valiosos como cobre y aluminio.
          </p>
          <p className="text-xs opacity-75 mt-3">
            Gracias por contribuir a un campus más sustentable
          </p>
        </div>

        {/* Footer con info del sistema */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>
            Sistema desarrollado por estudiantes de FIng · Seminario de Tecnologías 2026
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENTE: Tarjeta de Lote (para el listado)
// ============================================================================
function TarjetaLote({ lote, state, index }) {
  const navigate = useNavigate()
  const { elementRef, isVisible } = useScrollReveal({ delay: index * 50 })

  const gestora = lote.gestora_asignada_id
    ? state.gestoras?.find(g => g.id === lote.gestora_asignada_id)
    : null

  const items = state.items?.filter(i => lote.items_ids?.includes(i.id))

  // Calcular progreso del lote
  const calcularProgreso = () => {
    if (lote.estado === 'Finalizado') return 100
    if (lote.estado.includes('Aprobado')) return 75
    if (lote.estado.includes('Solicitado')) return 50
    if (lote.estado === 'Disponible para retiro') return 25
    return 10
  }

  const progreso = calcularProgreso()

  /** Determina colores del badge de estado */
  const estadoBadgeClass = lote.estado === 'Finalizado'
    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
    : lote.estado.includes('Aprobado')
    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'

  return (
    <button
      ref={elementRef}
      onClick={() => navigate(`/trazabilidad?lote=${lote.id}`)}
      className={`enterprise-card transition-all duration-200 hover:scale-[1.01] hover:shadow-enterprise-md p-4 text-left group w-full cursor-pointer ${
        isVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Lote</p>
          <p className="font-mono text-sm font-bold text-primary-500">{lote.id}</p>
        </div>
        <ChevronRight size={20} className="text-gray-400 group-hover:text-primary-500 transition-colors" />
      </div>

      {/* Categoría */}
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{lote.categoria}</p>

      {/* Detalles */}
      <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mb-3">
        <div className="flex items-center gap-1">
          <Package size={12} />
          <span>{lote.cantidad_items} ítems</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-semibold">{lote.peso_total_kg} kg</span>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">Progreso</span>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{progreso}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              progreso === 100 ? 'bg-gradient-to-r from-primary-600 to-primary-400' : 'bg-gradient-to-r from-primary-500 to-primary-300'
            }`}
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      {/* Estado */}
      <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${estadoBadgeClass}`}>
        {lote.estado}
      </div>

      {/* Fecha de publicación */}
      {lote.fecha_publicacion && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <Calendar size={12} />
          <span>Publicado: {lote.fecha_publicacion}</span>
        </div>
      )}
    </button>
  )
}

// ============================================================================
// COMPONENTE: Detalle de Lote Individual
// ============================================================================
function DetalleLote({ loteId, state }) {
  const navigate = useNavigate()
  const lote = state.lotes.find(l => l.id === loteId)

  if (!lote) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6 transition-colors">
        <Card className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Lote no encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            No se encontró información para el código: <strong>{loteId}</strong>
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/trazabilidad')}
          >
            Ver registro completo
          </Button>
        </Card>
      </div>
    )
  }

  // Determinar tipo de lote y buscar información relacionada
  const esLoteEntrada = lote.tipo === 'entrada'
  const instituto = state.institutos?.find(i => i.id === lote.institutoId)

  // Si es lote de publicación, buscar gestora y items
  const gestora = lote.gestora_asignada_id
    ? state.gestoras?.find(g => g.id === lote.gestora_asignada_id)
    : null

  const items = esLoteEntrada
    ? state.items?.filter(i => i.loteOrigenId === lote.id)
    : state.items?.filter(i => lote.items_ids?.includes(i.id))

  /** Determina colores del badge de estado en detalle */
  const estadoBadgeClass = lote.estado === 'Finalizado'
    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
    : lote.estado.includes('Aprobado')
    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Navbar público */}
      <PublicNav />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Botón volver */}
        <button
          onClick={() => navigate('/trazabilidad')}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ChevronRight size={16} className="rotate-180" />
          Volver al registro
        </button>

        {/* Header del lote */}
        <div className="flex items-center gap-3 mb-2">
          <QrCode size={24} className="text-primary-600 dark:text-primary-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Detalle del Lote</h1>
        </div>

        {/* Información del lote */}
        <Card>
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Código del lote</p>
              <p className="font-mono text-2xl font-bold text-primary-500">{lote.id}</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${estadoBadgeClass}`}>
              {lote.estado}
            </div>
          </div>

          {/* Timeline de trazabilidad */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <MapPin size={20} className="text-primary-500" />
              Recorrido del Lote
            </h2>

            <div className="relative pl-8 space-y-6">
              {/* Línea vertical */}
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary-600 to-primary-300"></div>

              {/* Paso 1: Origen (Instituto) */}
              <div className="relative">
                <div className="absolute -left-8 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                  <Building2 size={14} className="text-white" />
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Instituto Origen</h3>
                    {lote.fecha_solicitud && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {lote.fecha_solicitud}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {instituto?.nombre || lote.institutoId || lote.institutos_origen?.join(', ')}
                  </p>
                  {esLoteEntrada && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Tamaño: {lote.tamano} · Peso aprox: {lote.peso_declarado_aprox_kg} kg
                    </p>
                  )}
                </div>
              </div>

              {/* Paso 2: Ecopunto (clasificación) */}
              {(lote.fecha_clasificacion_completa || lote.fecha_publicacion) && (
                <div className="relative">
                  <div className="absolute -left-8 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <Recycle size={14} className="text-white" />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Clasificación en Ecopunto</h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {lote.fecha_clasificacion_completa || lote.fecha_publicacion}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {esLoteEntrada
                        ? `${items?.length || 0} ítems clasificados individualmente`
                        : `Lote publicado con ${lote.cantidad_items} ítems`
                      }
                    </p>
                    {!esLoteEntrada && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Categoría: {lote.categoria} · {lote.peso_total_kg} kg
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Paso 3: Gestora (retiro) */}
              {gestora && (
                <div className="relative">
                  <div className="absolute -left-8 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Factory size={14} className="text-white" />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Gestora de Retiro</h3>
                      {lote.fecha_aprobacion && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Calendar size={12} />
                          {lote.fecha_aprobacion}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{gestora.nombre}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Award size={14} className="text-amber-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Scoring: <strong>{gestora.scoring}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 4: Certificado (finalizado) */}
              {lote.estado === 'Finalizado' && lote.certificado_numero && (
                <div className="relative">
                  <div className="absolute -left-8 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle size={14} className="text-white" />
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-green-900 dark:text-green-300">Certificado de Disposición</h3>
                      {lote.fecha_certificado && (
                        <span className="text-xs text-green-700 dark:text-green-400 flex items-center gap-1">
                          <Calendar size={12} />
                          {lote.fecha_certificado}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <FileCheck size={16} className="text-green-600 dark:text-green-400" />
                      <span className="text-sm font-mono text-green-800 dark:text-green-200">
                        {lote.certificado_numero}
                      </span>
                    </div>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-2">
                      ✓ Disposición final certificada conforme a normativa vigente
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Items individuales (si están disponibles) */}
        {items && items.length > 0 && (
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Package size={20} className="text-primary-600 dark:text-primary-400" />
              Ítems en este lote ({items.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.slice(0, 8).map(item => (
                <div key={item.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.descripcion}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{item.categoria}</span>
                    <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{(item.pesoKg || item.peso_kg || 0)} kg</span>
                  </div>
                </div>
              ))}
            </div>
            {items.length > 8 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                ... y {items.length - 8} ítem(s) más
              </p>
            )}
          </Card>
        )}

        {/* Footer informativo */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-400 rounded-lg shadow-enterprise-lg p-6 text-white text-center">
          <h3 className="text-lg font-semibold mb-2">
            🌱 Contribución al Medio Ambiente
          </h3>
          <p className="text-sm opacity-90">
            Este lote evitó la emisión de <strong>{(lote.peso_total_kg * 1.4).toFixed(1)} kg de CO₂</strong> y permitió
            recuperar materiales valiosos como cobre y aluminio.
          </p>
          <p className="text-xs opacity-75 mt-3">
            Gracias por contribuir a un campus más sustentable
          </p>
        </div>

        {/* Footer con info del sistema */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>
            Sistema desarrollado por estudiantes de FIng · Seminario de Tecnologías 2026
          </p>
        </div>
      </div>
    </div>
  )
}
