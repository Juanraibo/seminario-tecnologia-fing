/**
 * StatusBadge - Badge Enterprise para estados de lotes
 * Estilo minimalista con dot indicator
 */

import { ESTADOS_LOTE } from '../../constants/estados'

// Configuración Enterprise — colores sutiles sin glow
const ESTADO_CONFIG = {
  [ESTADOS_LOTE.PENDIENTE_ENVIO]: {
    color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900',
    dot: 'bg-amber-500',
    label: 'Pendiente envío',
  },
  [ESTADOS_LOTE.EN_ECOPUNTO]: {
    color: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900',
    dot: 'bg-blue-500',
    label: 'En Ecopunto',
  },
  [ESTADOS_LOTE.CLASIFICADO]: {
    color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700',
    dot: 'bg-gray-500',
    label: 'Clasificado',
  },
  [ESTADOS_LOTE.DISPONIBLE]: {
    color: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900',
    dot: 'bg-emerald-500',
    label: 'Disponible',
  },
  [ESTADOS_LOTE.SOLICITADO]: {
    color: 'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900',
    dot: 'bg-orange-500',
    label: 'Solicitado',
  },
  [ESTADOS_LOTE.RETIRO_APROBADO]: {
    color: 'bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-900',
    dot: 'bg-violet-500',
    label: 'Aprobado',
  },
  [ESTADOS_LOTE.FINALIZADO]: {
    color: 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900',
    dot: 'bg-green-500',
    label: 'Finalizado',
  },
}

export default function StatusBadge({ estado, showIcon = true, size = 'sm', className = '' }) {
  const config = ESTADO_CONFIG[estado]

  if (!config) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 ${className}`}>
        {estado}
      </span>
    )
  }

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded transition-colors duration-100 ${config.color} ${sizeStyles[size]} ${className}`}>
      {showIcon && <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></div>}
      <span>{config.label}</span>
    </span>
  )
}
