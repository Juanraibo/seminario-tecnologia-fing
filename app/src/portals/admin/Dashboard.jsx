import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'
import PageHeader from '../../components/layout/PageHeader'
import Card, { StatCard } from '../../components/molecules/Card'
import Button from '../../components/atoms/Button'
import ImpactoAmbiental from '../../components/organisms/ImpactoAmbiental'
import {
  Package, Leaf, Cpu, Layers, Award,
  TrendingUp, Users, CheckCircle, BarChart3
} from '../../components/atoms/Icon'
import { ESTADOS_LOTE } from '../../constants/estados'

// Componente interno para divisores de sección
function SectionDivider({ title, icon }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
    </div>
  )
}

export default function AdminDashboard() {
  const { state } = useApp()
  const navigate = useNavigate()
  const [vistaActual, setVistaActual] = useState('resumen') // 'resumen' | 'impacto'

  // Calcular KPIs
  const kpis = useMemo(() => {
    // Solo lotes de entrada (que tienen peso_declarado_aprox_kg)
    const lotesEntrada = state.lotes.filter(l => l.tipo === 'entrada')
    const lotesPublicacion = state.lotes.filter(l => l.tipo === 'publicacion')

    // Total kg gestionados (usar items para cálculo preciso)
    const totalKg = state.items?.reduce((sum, item) => sum + (item.peso_kg || 0), 0) || 0

    // CO2 evitado
    const co2Evitado = totalKg * (state.config?.factor_co2_por_kg || 1.4)

    // Materiales recuperados (valores por defecto si no existen en config)
    const materialesPct = state.config?.materiales_recuperados_pct || { cobre: 0.15, aluminio: 0.25 }
    const cobreRecuperado = totalKg * materialesPct.cobre
    const aluminioRecuperado = totalKg * materialesPct.aluminio

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

  // Tooltip personalizado para Recharts
  const chartTooltipStyle = {
    backgroundColor: 'var(--tooltip-bg, #ffffff)',
    border: '1px solid var(--tooltip-border, #e5e7eb)',
    borderRadius: '0.5rem',
    color: 'var(--tooltip-color, #111827)'
  }

  return (
    <div className="space-y-8">
      {/* Header con tabs */}
      <div className="space-y-4">
        <PageHeader
          title="Panel Administrativo"
          description="Impacto ambiental y gestión del sistema"
          actions={
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
          }
        />

        {/* Tabs de navegación */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setVistaActual('resumen')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              vistaActual === 'resumen'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Resumen General
          </button>
          <button
            onClick={() => setVistaActual('impacto')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
              vistaActual === 'impacto'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            <BarChart3 size={16} />
            Impacto Ambiental
          </button>
        </div>
      </div>

      {/* Contenido según vista activa */}
      {vistaActual === 'impacto' ? (
        <ImpactoAmbiental />
      ) : (
        <>
      {/* SECCIÓN 1: IMPACTO AMBIENTAL */}
      <div className="space-y-6">
        <SectionDivider title="Impacto Ambiental" icon={<Leaf size={24} />} />

        {/* KPIs Ambientales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Package size={24} />}
            label="Total Gestionado"
            value={`${kpis.totalKg} kg`}
            delay={0}
          />
          <StatCard
            icon={<Leaf size={24} />}
            label="CO₂ Evitado"
            value={`${kpis.co2Evitado} kg`}
            delay={50}
          />
          <StatCard
            icon={<Cpu size={24} />}
            label="Cobre Recuperado"
            value={`${kpis.cobreRecuperado} kg`}
            delay={100}
          />
          <StatCard
            icon={<Layers size={24} />}
            label="Aluminio Recuperado"
            value={`${kpis.aluminioRecuperado} kg`}
            delay={150}
          />
        </div>

        {/* Métrica de finalización */}
        <Card variant="gradient" className="border-green-500/30">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Tasa de Finalización
              </p>
              <p className="text-5xl font-bold text-gray-900 dark:text-white mt-2">
                {kpis.pctCertificados}%
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {kpis.lotesFinalizados} de {kpis.totalLotesPublicados} lotes con certificado
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <Award size={28} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        {/* Gráficos Ambientales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de barras: kg por instituto */}
          <Card title="RAEE Gestionado por Instituto">
            {dataPorInstituto.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dataPorInstituto}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                  <XAxis dataKey="nombre" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      ...chartTooltipStyle,
                      backgroundColor: 'var(--tooltip-bg, #ffffff)',
                      border: '1px solid var(--tooltip-border, #e5e7eb)',
                      color: 'var(--tooltip-color, #111827)'
                    }}
                  />
                  <Bar dataKey="kg" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                No hay datos disponibles
              </div>
            )}
          </Card>

          {/* Gráfico de torta: certificados */}
          <Card title="Estado de Lotes Publicados">
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
                      ...chartTooltipStyle,
                      backgroundColor: 'var(--tooltip-bg, #ffffff)',
                      border: '1px solid var(--tooltip-border, #e5e7eb)',
                      color: 'var(--tooltip-color, #111827)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                No hay lotes publicados aún
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* SECCIÓN 2: GESTIÓN DEL SISTEMA */}
      <div className="space-y-6">
        <SectionDivider title="Gestión del Sistema" icon={<Users size={24} />} />

        {/* Métricas de Actores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={<Users size={24} />}
            label="Institutos Activos"
            value={`${state.institutos?.filter(i => i.activo).length || 0}`}
          />
          <StatCard
            icon={<Users size={24} />}
            label="Operarios Ecopunto"
            value={`${state.usuarios?.filter(u => u.rol === 'ecopunto').length || 0}`}
          />
          <StatCard
            icon={<TrendingUp size={24} />}
            label="Gestoras Habilitadas"
            value={`${state.gestoras?.filter(g => g.habilitacion_ministerio).length || 0}`}
          />
        </div>
      </div>
        </>
      )}
    </div>
  )
}
