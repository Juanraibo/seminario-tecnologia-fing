import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Package, Leaf, Cpu, Layers, Award, TrendingUp, Users, CheckCircle } from '../../components/atoms/Icon'
import Button from '../../components/atoms/Button'
import { ESTADOS_LOTE } from '../../constants/estados'

export default function AdminDashboard() {
  const { state } = useApp()
  const navigate = useNavigate()

  // Calcular KPIs
  const kpis = useMemo(() => {
    // Solo lotes de entrada (que tienen peso_declarado_aprox_kg)
    const lotesEntrada = state.lotes.filter(l => l.tipo === 'entrada')
    const lotesPublicacion = state.lotes.filter(l => l.tipo === 'publicacion')

    // Total kg gestionados (usar items para cálculo preciso)
    const totalKg = state.items?.reduce((sum, item) => sum + (item.peso_kg || 0), 0) || 0

    // CO2 evitado
    const co2Evitado = totalKg * state.config.factor_co2_por_kg

    // Materiales recuperados
    const cobreRecuperado = totalKg * state.config.materiales_recuperados_pct.cobre
    const aluminioRecuperado = totalKg * state.config.materiales_recuperados_pct.aluminio

    // % lotes con certificado
    const lotesFinalizados = lotesPublicacion.filter(l => l.estado === ESTADOS_LOTE.FINALIZADO).length
    const totalLotesPublicados = lotesPublicacion.length
    const pctCertificados = totalLotesPublicados > 0
      ? Math.round((lotesFinalizados / totalLotesPublicados) * 100)
      : 0

    return {
      totalKg: totalKg.toFixed(1),
      co2Evitado: co2Evitado.toFixed(1),
      cobreRecuperado: cobreRecuperado.toFixed(2),
      aluminioRecuperado: aluminioRecuperado.toFixed(2),
      pctCertificados,
      lotesFinalizados,
      totalLotesPublicados
    }
  }, [state.lotes, state.items, state.config])

  // Datos para gráfico de barras (kg por instituto)
  const dataPorInstituto = useMemo(() => {
    const institutoKg = {}

    state.items?.forEach(item => {
      const institutoId = item.institutoId
      if (!institutoKg[institutoId]) {
        institutoKg[institutoId] = 0
      }
      institutoKg[institutoId] += item.peso_kg || 0
    })

    return Object.entries(institutoKg).map(([institutoId, kg]) => {
      const instituto = state.institutos?.find(i => i.id === institutoId)
      return {
        nombre: instituto?.sigla || institutoId,
        kg: parseFloat(kg.toFixed(1))
      }
    }).sort((a, b) => b.kg - a.kg)
  }, [state.items, state.institutos])

  // Datos para gráfico de torta (certificados)
  const dataCertificados = useMemo(() => {
    const lotesPublicacion = state.lotes.filter(l => l.tipo === 'publicacion')
    const conCertificado = lotesPublicacion.filter(l => l.estado === ESTADOS_LOTE.FINALIZADO).length
    const enProceso = lotesPublicacion.length - conCertificado

    return [
      { nombre: 'Finalizados', value: conCertificado, color: '#10b981' },
      { nombre: 'En proceso', value: enProceso, color: '#f59e0b' }
    ]
  }, [state.lotes])

  // Lotes pendientes de aprobación
  const lotesPendientes = state.lotes.filter(l =>
    l.tipo === 'publicacion' &&
    l.solicitudes_gestoras &&
    l.solicitudes_gestoras.length > 0 &&
    !l.gestora_asignada_id
  ).length

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
              Panel Administrativo
            </h1>
            <p className="text-gray-400">
              Métricas de impacto ambiental y gestión del sistema
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate('/admin/actores')}
              className="flex items-center gap-2"
            >
              <Users size={18} />
              Gestión de Actores
            </Button>
            {lotesPendientes > 0 && (
              <Button
                variant="primary"
                onClick={() => navigate('/admin/retiros')}
                className="flex items-center gap-2 relative"
              >
                <CheckCircle size={18} />
                Aprobar Retiros
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {lotesPendientes}
                </span>
              </Button>
            )}
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total kg */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">
                  Total Gestionado
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {kpis.totalKg}
                </p>
                <p className="text-xs text-gray-500 mt-1">kilogramos de RAEE</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Package size={24} className="text-blue-400" />
              </div>
            </div>
          </div>

          {/* CO2 evitado */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">
                  CO₂ Evitado
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {kpis.co2Evitado}
                </p>
                <p className="text-xs text-gray-500 mt-1">kg de emisiones</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-xl">
                <Leaf size={24} className="text-green-400" />
              </div>
            </div>
          </div>

          {/* Cobre recuperado */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">
                  Cobre Recuperado
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {kpis.cobreRecuperado}
                </p>
                <p className="text-xs text-gray-500 mt-1">kg (~{state.config.materiales_recuperados_pct.cobre * 100}% del total)</p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <Cpu size={24} className="text-amber-400" />
              </div>
            </div>
          </div>

          {/* Aluminio recuperado */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">
                  Aluminio Recuperado
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {kpis.aluminioRecuperado}
                </p>
                <p className="text-xs text-gray-500 mt-1">kg (~{state.config.materiales_recuperados_pct.aluminio * 100}% del total)</p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <Layers size={24} className="text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Fila de métricas secundarias */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* % Lotes con certificado */}
          <div className="bg-gradient-to-br from-primary-500/20 to-primary-600/10 backdrop-blur-xl rounded-2xl border border-primary-500/50 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-primary-300">
                  Tasa de Finalización
                </p>
                <p className="text-5xl font-bold text-white mt-2">
                  {kpis.pctCertificados}%
                </p>
                <p className="text-xs text-primary-400 mt-1">
                  {kpis.lotesFinalizados} de {kpis.totalLotesPublicados} lotes con certificado
                </p>
              </div>
              <div className="p-3 bg-primary-500/20 rounded-xl">
                <Award size={28} className="text-primary-400" />
              </div>
            </div>
          </div>

          {/* Total Institutos */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">
                  Institutos Activos
                </p>
                <p className="text-5xl font-bold text-white mt-2">
                  {state.institutos?.filter(i => i.activo).length || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  de {state.institutos?.length || 0} totales
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Users size={28} className="text-blue-400" />
              </div>
            </div>
          </div>

          {/* Gestoras habilitadas */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">
                  Gestoras Habilitadas
                </p>
                <p className="text-5xl font-bold text-white mt-2">
                  {state.gestoras?.filter(g => g.habilitacion_ministerio).length || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  de {state.gestoras?.length || 0} registradas
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-xl">
                <TrendingUp size={28} className="text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de barras: kg por instituto */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              RAEE Gestionado por Instituto
            </h2>
            {dataPorInstituto.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dataPorInstituto}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="nombre" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="kg" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No hay datos disponibles
              </div>
            )}
          </div>

          {/* Gráfico de torta: certificados */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Estado de Lotes Publicados
            </h2>
            {dataCertificados.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dataCertificados}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ nombre, value, percent }) =>
                      `${nombre}: ${value} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dataCertificados.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No hay lotes publicados aún
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
