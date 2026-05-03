/**
 * CategoryBadge - Badge con icono temático por categoría RAEE
 * Enterprise design con toques de color sutiles
 */

import {
  Cpu,
  Monitor,
  Battery,
  Speaker,
  Lightbulb,
  Cable,
  Package
} from '../atoms/Icon'

// Configuración de categorías con iconos y colores
const CATEGORY_CONFIG = {
  'Equipos de Informática y Telecomunicaciones': {
    icon: Cpu,
    color: 'blue',
    bgLight: 'bg-blue-50 dark:bg-blue-950/20',
    textLight: 'text-blue-700 dark:text-blue-300',
    borderLight: 'border-blue-200 dark:border-blue-800'
  },
  'Pantallas y Monitores': {
    icon: Monitor,
    color: 'purple',
    bgLight: 'bg-purple-50 dark:bg-purple-950/20',
    textLight: 'text-purple-700 dark:text-purple-300',
    borderLight: 'border-purple-200 dark:border-purple-800'
  },
  'Baterías y Acumuladores': {
    icon: Battery,
    color: 'amber',
    bgLight: 'bg-amber-50 dark:bg-amber-950/20',
    textLight: 'text-amber-700 dark:text-amber-300',
    borderLight: 'border-amber-200 dark:border-amber-800'
  },
  'Equipos de Audio y Video': {
    icon: Speaker,
    color: 'pink',
    bgLight: 'bg-pink-50 dark:bg-pink-950/20',
    textLight: 'text-pink-700 dark:text-pink-300',
    borderLight: 'border-pink-200 dark:border-pink-800'
  },
  'Pequeños Electrodomésticos': {
    icon: Package,
    color: 'slate',
    bgLight: 'bg-slate-50 dark:bg-slate-950/20',
    textLight: 'text-slate-700 dark:text-slate-300',
    borderLight: 'border-slate-200 dark:border-slate-800'
  },
  'Equipos de Iluminación': {
    icon: Lightbulb,
    color: 'yellow',
    bgLight: 'bg-yellow-50 dark:bg-yellow-950/20',
    textLight: 'text-yellow-700 dark:text-yellow-300',
    borderLight: 'border-yellow-200 dark:border-yellow-800'
  },
  'Cables y Periféricos': {
    icon: Cable,
    color: 'gray',
    bgLight: 'bg-gray-50 dark:bg-gray-800',
    textLight: 'text-gray-700 dark:text-gray-300',
    borderLight: 'border-gray-200 dark:border-gray-700'
  }
}

export default function CategoryBadge({
  categoria,
  size = 'md',
  showIcon = true,
  fullWidth = false,
  className = ''
}) {
  // Obtener configuración de la categoría (fallback a "Otros")
  const config = CATEGORY_CONFIG[categoria] || {
    icon: Package,
    color: 'gray',
    bgLight: 'bg-gray-50 dark:bg-gray-800',
    textLight: 'text-gray-700 dark:text-gray-300',
    borderLight: 'border-gray-200 dark:border-gray-700'
  }

  const IconComponent = config.icon

  // Tamaños
  const sizes = {
    sm: {
      container: 'text-xs px-2 py-1',
      icon: 12
    },
    md: {
      container: 'text-sm px-3 py-1.5',
      icon: 14
    },
    lg: {
      container: 'text-base px-4 py-2',
      icon: 16
    }
  }

  const currentSize = sizes[size] || sizes.md

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 rounded-md border
        ${config.bgLight} ${config.textLight} ${config.borderLight}
        ${currentSize.container}
        ${fullWidth ? 'w-full justify-center' : ''}
        ${className}
        transition-colors
      `}
      title={categoria}
    >
      {showIcon && <IconComponent size={currentSize.icon} strokeWidth={2} />}
      <span className="font-medium truncate">{categoria}</span>
    </div>
  )
}

/**
 * Variante compacta solo con icono + tooltip
 */
export function CategoryIcon({ categoria, size = 16, className = '' }) {
  const config = CATEGORY_CONFIG[categoria] || CATEGORY_CONFIG['Cables y Periféricos']
  const IconComponent = config.icon

  return (
    <div
      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${config.bgLight} ${config.textLight} ${className}`}
      title={categoria}
    >
      <IconComponent size={size} strokeWidth={2} />
    </div>
  )
}
