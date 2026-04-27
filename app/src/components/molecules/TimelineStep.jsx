/**
 * TimelineStep - Paso individual de un timeline de progreso
 * Estados: completed, current, pending
 */

import { Check } from '../atoms/Icon'

export default function TimelineStep({
  title,
  subtitle,
  status = 'pending', // 'completed' | 'current' | 'pending'
  icon,
  isLast = false,
  timestamp,
  className = ''
}) {
  const statusStyles = {
    completed: {
      dot: 'bg-primary-500 border-primary-500 shadow-glow-primary',
      line: 'bg-primary-300 dark:bg-primary-700',
      title: 'text-gray-900 dark:text-gray-100 font-semibold',
      subtitle: 'text-gray-600 dark:text-gray-400',
    },
    current: {
      dot: 'bg-secondary-500 border-secondary-500 shadow-glow-secondary animate-pulse-slow',
      line: 'bg-gray-200 dark:bg-gray-700',
      title: 'text-gray-900 dark:text-gray-100 font-semibold',
      subtitle: 'text-secondary-600 dark:text-secondary-400 font-medium',
    },
    pending: {
      dot: 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600',
      line: 'bg-gray-200 dark:bg-gray-700',
      title: 'text-gray-500 dark:text-gray-500',
      subtitle: 'text-gray-400 dark:text-gray-600',
    },
  }

  const styles = statusStyles[status]

  return (
    <div className={`flex gap-4 ${className}`}>
      {/* Línea vertical y dot */}
      <div className="flex flex-col items-center">
        <div className={`
          w-10 h-10 rounded-full border-2 flex items-center justify-center
          transition-all duration-300
          ${styles.dot}
        `}>
          {status === 'completed' ? (
            <Check size={18} className="text-white" />
          ) : icon ? (
            <span className="text-white">{icon}</span>
          ) : null}
        </div>
        {!isLast && (
          <div className={`w-0.5 h-full min-h-[40px] mt-2 transition-colors ${styles.line}`} />
        )}
      </div>

      {/* Contenido */}
      <div className="flex-1 pb-8">
        <h4 className={`text-sm transition-colors ${styles.title}`}>
          {title}
        </h4>
        {subtitle && (
          <p className={`text-xs mt-1 transition-colors ${styles.subtitle}`}>
            {subtitle}
          </p>
        )}
        {timestamp && (
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
            {timestamp}
          </p>
        )}
      </div>
    </div>
  )
}
