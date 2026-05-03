/**
 * Button - Componente atómico Enterprise
 * Variantes: primary, secondary, ghost, danger
 * Tamaños: sm, md, lg
 * Estilo: Minimalista, funcional, sin efectos decorativos
 */

import { Loader } from './Icon'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors duration-100 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-gray-900 hover:bg-gray-800 active:bg-gray-950 text-white shadow-enterprise-sm',
    secondary:
      'bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-900 border border-gray-300 shadow-enterprise-sm dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white dark:border-gray-700',
    ghost:
      'bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700 dark:hover:bg-gray-800 dark:active:bg-gray-700 dark:text-gray-200',
    danger:
      'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-enterprise-sm',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  }

  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? (
        <>
          <Loader size={size === 'sm' ? 12 : 14} className="animate-spin" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </button>
  )
}
