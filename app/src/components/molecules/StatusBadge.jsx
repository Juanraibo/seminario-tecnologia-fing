/**
 * StatusBadge - Badge especializado para estados de lotes
 * Sistema de semáforo: verde (OK), amarillo (en proceso), azul (info), rojo (alerta)
 * Con glow sutil en dark mode para mejor visibilidad
 */

import Badge from '../atoms/Badge'
import { ESTADOS_LOTE } from '../../constants/estados'
import { Clock, Package, FileCheck, CheckCircle, AlertCircle, Loader, Check } from '../atoms/Icon'

// Mapeo de estados a colores tipo semáforo con glow en dark mode
const ESTADO_CONFIG = {
  [ESTADOS_LOTE.PENDIENTE_ENVIO]: {
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50 dark:shadow-[0_0_8px_rgba(251,191,36,0.15)]',
    icon: <Clock size={14} />,
    label: 'Pendiente envío',
  },
  [ESTADOS_LOTE.EN_ECOPUNTO]: {
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50 dark:shadow-[0_0_8px_rgba(59,130,246,0.15)]',
    icon: <Package size={14} />,
    label: 'En Ecopunto',
  },
  [ESTADOS_LOTE.CLASIFICADO]: {
    color: 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600/50',
    icon: <FileCheck size={14} />,
    label: 'Clasificado',
  },
  [ESTADOS_LOTE.DISPONIBLE]: {
    color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50 dark:shadow-[0_0_8px_rgba(16,185,129,0.15)]',
    icon: <CheckCircle size={14} />,
    label: 'Disponible',
  },
  [ESTADOS_LOTE.SOLICITADO]: {
    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-700/50 dark:shadow-[0_0_8px_rgba(249,115,22,0.15)]',
    icon: <AlertCircle size={14} />,
    label: 'Solicitado',
  },
  [ESTADOS_LOTE.RETIRO_APROBADO]: {
    color: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700/50 dark:shadow-[0_0_8px_rgba(139,92,246,0.15)]',
    icon: <Loader size={14} />,
    label: 'Aprobado',
  },
  [ESTADOS_LOTE.FINALIZADO]: {
    color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700/50 dark:shadow-[0_0_8px_rgba(34,197,94,0.15)]',
    icon: <Check size={14} />,
    label: 'Finalizado',
  },
}

export default function StatusBadge({ estado, showIcon = true, size = 'md', className = '' }) {
  const config = ESTADO_CONFIG[estado]

  if (!config) {
    return (
      <Badge variant="default" size={size} className={className}>
        {estado}
      </Badge>
    )
  }

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full transition-all duration-200 ${config.color} ${sizeStyles[size]} ${className}`}>
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  )
}
