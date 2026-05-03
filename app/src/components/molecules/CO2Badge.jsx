/**
 * CO2Badge - Indicador visual de emisiones de CO2 evitadas
 * Enterprise design con tooltips informativos
 */

import { Leaf, Loader, AlertCircle } from '../atoms/Icon'
import { formatearCO2 } from '../../services/carbonAPI'

export default function CO2Badge({
  co2_kg = 0,
  source = 'estimated',
  loading = false,
  error = null,
  showSource = false,
  showIcon = true,
  size = 'md',
  variant = 'default',
  className = ''
}) {
  // Tamaños
  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  }

  // Variantes de color
  const variants = {
    default: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    primary: 'bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800',
    subtle: 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
  }

  // Estado de carga
  if (loading) {
    return (
      <div className={`inline-flex items-center gap-1.5 rounded-md border ${sizes[size]} ${variants[variant]} ${className}`}>
        <Loader size={iconSizes[size]} className="animate-spin" />
        <span className="font-medium">Calculando...</span>
      </div>
    )
  }

  // Estado de error
  if (error) {
    return (
      <div className={`inline-flex items-center gap-1.5 rounded-md border bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 ${sizes[size]} ${className}`}>
        <AlertCircle size={iconSizes[size]} />
        <span className="font-medium text-xs">Error cálculo</span>
      </div>
    )
  }

  // Formatear valor
  const valorFormateado = formatearCO2(co2_kg, { decimales: 1 })

  // Indicador de fuente (API real vs estimado)
  const sourceIndicator = source === 'api' ? '✓' : '≈'
  const sourceTooltip = source === 'api'
    ? 'Cálculo con Climatiq API'
    : 'Estimación basada en factores promedio'

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-md border ${sizes[size]} ${variants[variant]} ${className} transition-colors`}
      title={showSource ? sourceTooltip : `CO₂ evitado: ${valorFormateado}`}
    >
      {showIcon && <Leaf size={iconSizes[size]} strokeWidth={2.5} />}
      <span className="font-semibold">{valorFormateado}</span>
      <span className="text-xs opacity-75">CO₂</span>
      {showSource && (
        <span className="text-xs opacity-60 ml-0.5" title={sourceTooltip}>
          {sourceIndicator}
        </span>
      )}
    </div>
  )
}

/**
 * CO2Card - Card expandido con equivalencias
 */
export function CO2Card({ co2_kg, equivalencias, className = '' }) {
  if (!co2_kg || co2_kg <= 0) return null

  return (
    <div className={`bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-emerald-600 dark:bg-emerald-500 rounded-lg flex items-center justify-center">
          <Leaf size={18} className="text-white" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">CO₂ Evitado</p>
          <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
            {formatearCO2(co2_kg, { decimales: 1 })}
          </p>
        </div>
      </div>

      {equivalencias && (
        <div className="space-y-2 text-xs text-emerald-700 dark:text-emerald-300">
          <p className="flex items-center justify-between">
            <span className="opacity-80">🌳 Árboles plantados:</span>
            <span className="font-semibold">{equivalencias.arboles_plantados}</span>
          </p>
          <p className="flex items-center justify-between">
            <span className="opacity-80">🚗 Km de auto evitados:</span>
            <span className="font-semibold">{equivalencias.km_auto}</span>
          </p>
          <p className="flex items-center justify-between">
            <span className="opacity-80">💡 Horas de luz LED:</span>
            <span className="font-semibold">{equivalencias.horas_luz}</span>
          </p>
        </div>
      )}
    </div>
  )
}
