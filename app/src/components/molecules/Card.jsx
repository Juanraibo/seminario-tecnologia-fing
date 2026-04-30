/**
 * Card - Componente molecular para contenedores de contenido
 * Variantes: default, glass, gradient
 * Diseño minimalista con soporte para dark mode
 */

export default function Card({
  children,
  title,
  subtitle,
  headerAction,
  padding = 'default',
  hover = false,
  variant = 'default',
  className = ''
}) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  }

  // Estilos base según variante
  const variantStyles = {
    default: `
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-700
      shadow-soft
    `,
    glass: `
      glass shadow-glass
    `,
    gradient: `
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-700
      shadow-soft
      relative overflow-hidden
      before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px]
      before:bg-gradient-to-r before:from-primary-500 before:to-secondary-500
    `,
  }

  return (
    <div
      className={`
        rounded-lg
        transition-all duration-300
        ${variantStyles[variant]}
        ${hover
          ? 'hover:shadow-glass hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-0.5'
          : ''
        }
        ${className}
      `}
    >
      {(title || headerAction) && (
        <div className={`flex items-center justify-between border-b border-gray-100 dark:border-gray-700/50 ${paddingStyles[padding]} pb-4`}>
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div className="shrink-0 ml-4">{headerAction}</div>}
        </div>
      )}
      <div className={title || headerAction ? `${paddingStyles[padding]} pt-4` : paddingStyles[padding]}>
        {children}
      </div>
    </div>
  )
}

// Variante para tarjetas de estadísticas
export function StatCard({ icon, label, value, trend, trendValue, variant = 'default', className = '' }) {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  }

  // Estilo del icono según variante
  const iconContainerStyles = {
    default: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    glass: 'glass text-primary-600 dark:text-primary-400',
    gradient: 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white',
  }

  return (
    <div
      className={`
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-700
        rounded-lg shadow-soft
        p-6
        transition-all duration-300
        hover:shadow-glass hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-0.5
        ${variant === 'gradient' ? 'relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-primary-500 before:to-secondary-500' : ''}
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {label}
          </p>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mt-2 tracking-tight">
            {value}
          </p>
          {trend && trendValue && (
            <p className={`text-sm mt-2 font-medium ${trendColors[trend]}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-xl shrink-0 ml-4 ${iconContainerStyles[variant]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
