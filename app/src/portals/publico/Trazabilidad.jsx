import { useSearchParams, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Recycle, MapPin, Calendar, Package, CheckCircle, Building2, Factory, Award, FileCheck, ChevronRight, Filter, Search, TrendingUp, Leaf, Scale, ArrowUpDown } from '../../components/atoms/Icon'
import { useState } from 'react'

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
  const [ordenamiento, setOrdenamiento] = useState('fecha_desc') // fecha_desc, fecha_asc, peso_desc, peso_asc

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header con branding */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Recycle size={40} className="text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">EcoFIng · Registro Público</h1>
                <p className="text-sm text-gray-600">Trazabilidad de RAEE · FIng UdelaR</p>
              </div>
            </div>
          </div>

          {/* Estadísticas globales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Package size={18} className="text-green-600" />
                <p className="text-xs font-medium text-green-700">Total Lotes</p>
              </div>
              <p className="text-2xl font-bold text-green-900">{lotesPublicos.length}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Scale size={18} className="text-blue-600" />
                <p className="text-xs font-medium text-blue-700">Total RAEE</p>
              </div>
              <p className="text-2xl font-bold text-blue-900">{stats.totalKg.toFixed(1)} kg</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <Leaf size={18} className="text-emerald-600" />
                <p className="text-xs font-medium text-emerald-700">CO₂ Evitado</p>
              </div>
              <p className="text-2xl font-bold text-emerald-900">{stats.totalCO2.toFixed(1)} kg</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={18} className="text-purple-600" />
                <p className="text-xs font-medium text-purple-700">Finalizados</p>
              </div>
              <p className="text-2xl font-bold text-purple-900">{stats.finalizados}/{lotesPublicos.length}</p>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row gap-3">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por código o categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Filtros por estado */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFiltroEstado('todos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroEstado === 'todos'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltroEstado('finalizado')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroEstado === 'finalizado'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Finalizados
            </button>
            <button
              onClick={() => setFiltroEstado('en_proceso')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroEstado === 'en_proceso'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              En proceso
            </button>

            {/* Separador */}
            <div className="border-l border-gray-300 mx-2"></div>

            {/* Ordenamiento */}
            <select
              value={ordenamiento}
              onChange={(e) => setOrdenamiento(e.target.value)}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 border-0 focus:ring-2 focus:ring-green-500 cursor-pointer"
            >
              <option value="fecha_desc">Más reciente</option>
              <option value="fecha_asc">Más antiguo</option>
              <option value="peso_desc">Mayor peso</option>
              <option value="peso_asc">Menor peso</option>
            </select>
          </div>
        </div>

        {/* Listado de lotes */}
        {lotesFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No se encontraron lotes con los filtros aplicados</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lotesFiltrados.map(lote => (
              <TarjetaLote key={lote.id} lote={lote} state={state} />
            ))}
          </div>
        )}

        {/* Footer informativo */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-lg p-6 text-white text-center">
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
        <div className="text-center text-xs text-gray-500">
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
function TarjetaLote({ lote, state }) {
  const navigate = useNavigate()
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

  return (
    <button
      onClick={() => navigate(`/trazabilidad?lote=${lote.id}`)}
      className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-5 text-left group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Lote</p>
          <p className="font-mono text-sm font-bold text-green-600">{lote.id}</p>
        </div>
        <ChevronRight size={20} className="text-gray-400 group-hover:text-green-600 transition-colors" />
      </div>

      {/* Categoría */}
      <p className="text-sm font-medium text-gray-900 mb-2">{lote.categoria}</p>

      {/* Detalles */}
      <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
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
          <span className="text-xs text-gray-500">Progreso</span>
          <span className="text-xs font-semibold text-gray-700">{progreso}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all ${
              progreso === 100 ? 'bg-green-600' : 'bg-blue-500'
            }`}
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      {/* Estado */}
      <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
        lote.estado === 'Finalizado'
          ? 'bg-green-100 text-green-700'
          : lote.estado.includes('Aprobado')
          ? 'bg-blue-100 text-blue-700'
          : 'bg-amber-100 text-amber-700'
      }`}>
        {lote.estado}
      </div>

      {/* Fecha de publicación */}
      {lote.fecha_publicacion && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1 text-xs text-gray-500">
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Lote no encontrado
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            No se encontró información para el código: <strong>{loteId}</strong>
          </p>
          <button
            onClick={() => navigate('/trazabilidad')}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Ver registro completo
          </button>
        </div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Botón volver */}
        <button
          onClick={() => navigate('/trazabilidad')}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronRight size={16} className="rotate-180" />
          Volver al registro
        </button>

        {/* Header con branding */}
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Recycle size={40} className="text-green-600" />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900">EcoFIng</h1>
              <p className="text-sm text-gray-600">Gestión de RAEE · FIng UdelaR</p>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4"></div>
          <p className="text-xs text-gray-500">
            Sistema de trazabilidad pública de Residuos de Aparatos Eléctricos y Electrónicos
          </p>
        </div>

        {/* Información del lote */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Código del lote</p>
              <p className="font-mono text-2xl font-bold text-green-600">{lote.id}</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              lote.estado === 'Finalizado'
                ? 'bg-green-100 text-green-700'
                : lote.estado.includes('Aprobado')
                ? 'bg-blue-100 text-blue-700'
                : 'bg-amber-100 text-amber-700'
            }`}>
              {lote.estado}
            </div>
          </div>

          {/* Timeline de trazabilidad */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPin size={20} className="text-green-600" />
              Recorrido del Lote
            </h2>

            <div className="relative pl-8 space-y-6">
              {/* Línea vertical */}
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-green-500 to-blue-500"></div>

              {/* Paso 1: Origen (Instituto) */}
              <div className="relative">
                <div className="absolute -left-8 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Building2 size={14} className="text-white" />
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Instituto Origen</h3>
                    {lote.fecha_solicitud && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        {lote.fecha_solicitud}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">
                    {instituto?.nombre || lote.institutoId || lote.institutos_origen?.join(', ')}
                  </p>
                  {esLoteEntrada && (
                    <p className="text-xs text-gray-500 mt-1">
                      Tamaño: {lote.tamano} · Peso aprox: {lote.peso_declarado_aprox_kg} kg
                    </p>
                  )}
                </div>
              </div>

              {/* Paso 2: Ecopunto (clasificación) */}
              {(lote.fecha_clasificacion_completa || lote.fecha_publicacion) && (
                <div className="relative">
                  <div className="absolute -left-8 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Recycle size={14} className="text-white" />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">Clasificación en Ecopunto</h3>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        {lote.fecha_clasificacion_completa || lote.fecha_publicacion}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {esLoteEntrada
                        ? `${items?.length || 0} ítems clasificados individualmente`
                        : `Lote publicado con ${lote.cantidad_items} ítems`
                      }
                    </p>
                    {!esLoteEntrada && (
                      <p className="text-xs text-gray-500 mt-1">
                        Categoría: {lote.categoria} · {lote.peso_total_kg} kg
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Paso 3: Gestora (retiro) */}
              {gestora && (
                <div className="relative">
                  <div className="absolute -left-8 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <Factory size={14} className="text-white" />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">Gestora de Retiro</h3>
                      {lote.fecha_aprobacion && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar size={12} />
                          {lote.fecha_aprobacion}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{gestora.nombre}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Award size={14} className="text-amber-500" />
                      <span className="text-xs text-gray-600">
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
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-green-900">Certificado de Disposición</h3>
                      {lote.fecha_certificado && (
                        <span className="text-xs text-green-700 flex items-center gap-1">
                          <Calendar size={12} />
                          {lote.fecha_certificado}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <FileCheck size={16} className="text-green-600" />
                      <span className="text-sm font-mono text-green-800">
                        {lote.certificado_numero}
                      </span>
                    </div>
                    <p className="text-xs text-green-700 mt-2">
                      ✓ Disposición final certificada conforme a normativa vigente
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items individuales (si están disponibles) */}
        {items && items.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={20} className="text-blue-600" />
              Ítems en este lote ({items.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.slice(0, 8).map(item => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{item.descripcion}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-600">{item.categoria}</span>
                    <span className="text-xs font-semibold text-blue-600">{item.peso_kg} kg</span>
                  </div>
                </div>
              ))}
            </div>
            {items.length > 8 && (
              <p className="text-xs text-gray-500 mt-3 text-center">
                ... y {items.length - 8} ítem(s) más
              </p>
            )}
          </div>
        )}

        {/* Footer informativo */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-lg p-6 text-white text-center">
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
        <div className="text-center text-xs text-gray-500">
          <p>
            Sistema desarrollado por estudiantes de FIng · Seminario de Tecnologías 2026
          </p>
        </div>
      </div>
    </div>
  )
}
