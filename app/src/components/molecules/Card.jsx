/**
 * Card - Componente molecular para contenedores de contenido
 * Diseño minimalista con soporte para dark mode
 */

export default function Card({
  children,
  title,
  subtitle,
  headerAction,
  padding = 'default',
  hover = false,
  className = ''
}) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={`
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-700
        rounded-lg shadow-soft
        transition-all duration-200
        ${hover ? 'hover:shadow-soft-lg hover:border-gray-300 dark:hover:border-gray-600' : ''}
        ${className}
      `}
    >
      {(title || headerAction) && (
        <div className={`flex items-center justify-between border-b border-gray-100 dark:border-gray-700 ${paddingStyles[padding]} pb-4`}>
          <div>
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
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={title || headerAction ? `${paddingStyles[padding]} pt-4` : paddingStyles[padding]}>
        {children}
      </div>
    </div>
  )
}

// Variante para estadísticas
export function StatCard({ icon, label, value, trend, trendValue, className = '' }) {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  }

  return (
    <Card padding="default" className={className}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {value}
          </p>
          {trend && trendValue && (
            <p className={`text-sm mt-2 ${trendColors[trend]}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-primary-600 dark:text-primary-400">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
