/**
 * ImpactoAmbiental - Dashboard de impacto ambiental con Climatiq API
 * Gráficos interactivos, equivalencias y estadísticas globales
 */

import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import Card, { StatCard } from '../molecules/Card'
import CO2Badge, { CO2Card } from '../molecules/CO2Badge'
import CategoryBadge from '../molecules/CategoryBadge'
import { useCO2Multiple } from '../../hooks/useCO2'
import {
  Leaf, TrendingUp, Package, Recycle,
  TreePine, Car, Lightbulb, Smartphone
} from '../atoms/Icon'
import { calcularEstadisticasCO2, obtenerEquivalenciasCO2 } from '../../services/carbonAPI'
import { useState, useEffect } from 'react'

export default function ImpactoAmbiental() {
  const { state } = useApp()
  const [estadisticasCO2, setEstadisticasCO2] = useState(null)
  const [loading, setLoading] = useState(true)

  // Calcular estadísticas globales al montar
  useEffect(() => {
    const calcular = async () => {
      setLoading(true)
      const lotesPublicados = state.lotes.filter(l => l.tipo === 'publicacion')
      const stats = await calcularEstadisticasCO2(lotesPublicados)
      setEstadisticasCO2(stats)
      setLoading(false)
    }
    calcular()
  }, [state.lotes])

  // Datos para gráfico de área (CO2 acumulado por mes)
  const dataPorMes = useMemo(() => {
    const lotesPublicados = state.lotes.filter(l => l.tipo === 'publicacion' && l.fecha_publicacion)

    const meses = {}
    lotesPublicados.forEach(lote => {
      const fecha = new Date(lote.fecha_publicacion)
      const mes = fecha.toLocaleDateString('es-UY', { month: 'short', year: 'numeric' })

      if (!meses[mes]) {
        meses[mes] = { mes, co2_kg: 0, lotes: 0 }
      }

      meses[mes].co2_kg += (lote.peso_total_kg || 0) * 1.4 // Factor estimado
      meses[mes].lotes += 1
    })

    return Object.values(meses).sort((a, b) => new Date(a.mes) - new Date(b.mes))
  }, [state.lotes])

  // Datos para gráfico de barras (CO2 por categoría)
  const dataPorCategoria = useMemo(() => {
    if (!estadisticasCO2) return []

    return Object.entries(estadisticasCO2.por_categoria || {}).map(([categoria, data]) => ({
      categoria: categoria.length > 30 ? categoria.substring(0, 27) + '...' : categoria,
      categoriaFull: categoria,
      co2_kg: parseFloat(data.co2_evitado?.toFixed(1) || 0),
      kg_raee: parseFloat(data.kg_raee?.toFixed(1) || 0),
    })).sort((a, b) => b.co2_kg - a.co2_kg)
  }, [estadisticasCO2])

  // Datos para gráfico de torta (distribución por instituto)
  const dataPorInstituto = useMemo(() => {
    const institutos = {}

    state.items?.forEach(item => {
      const instituto = state.institutos?.find(i => i.id === item.institutoId)
      const nombreInstituto = instituto?.sigla || item.institutoId

      if (!institutos[nombreInstituto]) {
        institutos[nombreInstituto] = 0
      }

      institutos[nombreInstituto] += (item.peso_kg || 0) * 1.4
    })

    const colores = ['#10b981', '#059669', '#047857', '#065f46', '#064e3b']

    return Object.entries(institutos)
      .map(([nombre, co2_kg], index) => ({
        nombre,
        co2_kg: parseFloat(co2_kg.toFixed(1)),
        color: colores[index % colores.length]
      }))
      .sort((a, b) => b.co2_kg - a.co2_kg)
  }, [state.items, state.institutos])

  // Equivalencias globales
  const equivalenciasGlobales = useMemo(() => {
    if (!estadisticasCO2) return null
    return obtenerEquivalenciasCO2(estadisticasCO2.total_co2_evitado || 0)
  }, [estadisticasCO2])

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null

    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-enterprise-md">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium" style={{ color: entry.color }}>
              {entry.name}:
            </span>{' '}
            {entry.value} {entry.unit || 'kg CO₂'}
          </p>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Recycle size={48} className="text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Calculando impacto ambiental...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas destacadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Leaf size={20} />}
          label="CO₂ Total Evitado"
          value={`${estadisticasCO2?.total_co2_evitado.toFixed(1) || 0} kg`}
        />
        <StatCard
          icon={<Package size={20} />}
          label="RAEE Gestionado"
          value={`${estadisticasCO2?.total_kg_raee.toFixed(1) || 0} kg`}
        />
        <StatCard
          icon={<Recycle size={20} />}
          label="Lotes Procesados"
          value={estadisticasCO2?.lotes_procesados || 0}
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Categorías"
          value={Object.keys(estadisticasCO2?.por_categoria || {}).length}
        />
      </div>

      {/* Equivalencias visuales */}
      {equivalenciasGlobales && (
        <Card title="Equivalencias Ambientales" subtitle="Impacto del CO₂ evitado en términos cotidianos">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 text-center">
              <TreePine size={32} className="text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                {equivalenciasGlobales.arboles_plantados}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Árboles plantados</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5 opacity-75">(absorción anual)</p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
              <Car size={32} className="text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {equivalenciasGlobales.km_auto}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Km de auto</p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5 opacity-75">(emisiones evitadas)</p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-center">
              <Lightbulb size={32} className="text-amber-600 dark:text-amber-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                {equivalenciasGlobales.horas_luz}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Horas de luz LED</p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5 opacity-75">(bombilla 10W)</p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 text-center">
              <Smartphone size={32} className="text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {equivalenciasGlobales.smartphones_cargados}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Cargas de celular</p>
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-0.5 opacity-75">(0-100%)</p>
            </div>
          </div>
        </Card>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de área: CO2 por mes */}
        <Card title="Tendencia Mensual de CO₂" subtitle="Evolución del impacto ambiental">
          {dataPorMes.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dataPorMes}>
                <defs>
                  <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="co2_kg"
                  name="CO₂ evitado"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#colorCO2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No hay datos suficientes para mostrar la tendencia
            </div>
          )}
        </Card>

        {/* Gráfico de barras: CO2 por categoría */}
        <Card title="CO₂ por Categoría RAEE" subtitle="Distribución del impacto por tipo de residuo">
          {dataPorCategoria.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataPorCategoria} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis type="category" dataKey="categoria" stroke="#6b7280" style={{ fontSize: '11px' }} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="co2_kg" name="CO₂ evitado" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No hay datos por categoría
            </div>
          )}
        </Card>

        {/* Gráfico de torta: Contribución por instituto */}
        <Card title="Contribución por Instituto" subtitle="Distribución de CO₂ evitado por origen">
          {dataPorInstituto.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dataPorInstituto}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nombre, percent }) => `${nombre} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#10b981"
                  dataKey="co2_kg"
                >
                  {dataPorInstituto.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No hay datos por instituto
            </div>
          )}
        </Card>

        {/* Top categorías */}
        <Card title="Top Categorías" subtitle="Mayor impacto ambiental">
          {dataPorCategoria.length > 0 ? (
            <div className="space-y-3">
              {dataPorCategoria.slice(0, 5).map((cat, index) => (
                <div key={cat.categoria} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-colors">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate" title={cat.categoriaFull}>
                      {cat.categoria}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {cat.kg_raee} kg RAEE
                    </p>
                  </div>
                  <CO2Badge co2_kg={cat.co2_kg} size="sm" showIcon={false} />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No hay datos disponibles
            </div>
          )}
        </Card>
      </div>

      {/* Footer con crédito de Climatiq API */}
      <Card className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800">
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>
            Cálculos de emisiones de CO₂ realizados con{' '}
            <a
              href="https://www.climatiq.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              Climatiq API
            </a>
            {estadisticasCO2?.source === 'api' ? ' (datos en tiempo real)' : ' (factores estimados promedio)'}
          </p>
          <p className="mt-1 text-gray-400 dark:text-gray-500">
            Factores de emisión basados en estudios de reciclaje electrónico y recuperación de materiales
          </p>
        </div>
      </Card>
    </div>
  )
}
