/**
 * Tooltip - Tooltip enterprise con posicionamiento inteligente
 * Aparece en hover, accesible con keyboard
 */

import { useState } from 'react'

export default function Tooltip({
  children,
  content,
  position = 'top', // top | bottom | left | right
  delay = 200,
  className = ''
}) {
  const [isVisible, setIsVisible] = useState(false)
  let timeout = null

  const handleMouseEnter = () => {
    timeout = setTimeout(() => setIsVisible(true), delay)
  }

  const handleMouseLeave = () => {
    clearTimeout(timeout)
    setIsVisible(false)
  }

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-100',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-900 dark:border-b-gray-100',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-gray-900 dark:border-l-gray-100',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-900 dark:border-r-gray-100',
  }

  if (!content) return children

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}

      {isVisible && (
        <div
          className={`
            absolute z-50 px-3 py-2 text-xs font-medium text-white dark:text-gray-900
            bg-gray-900 dark:bg-gray-100 rounded-md shadow-enterprise-lg
            whitespace-nowrap animate-fade-in pointer-events-none
            ${positions[position]}
          `}
          role="tooltip"
        >
          {content}
          <div className={`absolute w-0 h-0 ${arrows[position]}`} />
        </div>
      )}
    </div>
  )
}

/**
 * TooltipIcon - Icono de ayuda con tooltip
 */
import { Info } from './Icon'

export function TooltipIcon({ content, className = '' }) {
  return (
    <Tooltip content={content} position="top">
      <button
        type="button"
        className={`inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors ${className}`}
        aria-label="Más información"
      >
        <Info size={10} className="text-gray-600 dark:text-gray-400" />
      </button>
    </Tooltip>
  )
}
