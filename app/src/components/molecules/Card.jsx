/**
 * Card - Componente molecular Enterprise
 * Diseño minimalista, funcional, bordes sutiles
 */

import useScrollReveal from '../../hooks/useScrollReveal'

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
    default: 'p-5',
    lg: 'p-6',
  }

  return (
    <div
      className={`
        enterprise-card
        ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {(title || headerAction) && (
        <div className={`flex items-center justify-between border-b border-gray-100 dark:border-gray-800 ${paddingStyles[padding]} pb-4`}>
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
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
export function StatCard({ icon, label, value, trend, trendValue, className = '', delay = 0 }) {
  const { elementRef, isVisible } = useScrollReveal({ delay })

  const trendColors = {
    up: 'text-emerald-600 dark:text-emerald-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  }

  return (
    <div
      ref={elementRef}
      className={`enterprise-card p-5 transition-all duration-200 hover:scale-[1.02] hover:shadow-enterprise-md group ${className} ${
        isVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2 tracking-tight">
            {value}
          </p>
          {trend && trendValue && (
            <p className={`text-xs mt-2 font-medium ${trendColors[trend]}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-primary-50 dark:group-hover:bg-primary-950/30 shrink-0 ml-4 transition-colors text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
