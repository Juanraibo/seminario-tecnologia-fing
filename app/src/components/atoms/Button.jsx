/**
 * Button - Componente atómico para botones
 * Variantes: primary, secondary, ghost, danger, outline, accent, gradient
 * Tamaños: sm, md, lg
 * Prop loading que muestra spinner y deshabilita
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
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-sm hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 active:translate-y-0',
    secondary:
      'bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-700 text-white shadow-sm hover:shadow-md hover:shadow-secondary-500/20 dark:hover:shadow-secondary-500/30',
    accent:
      'bg-accent-500 hover:bg-accent-600 active:bg-accent-700 text-white shadow-sm hover:shadow-md hover:shadow-accent-500/20 dark:hover:shadow-accent-500/30',
    ghost:
      'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700',
    danger:
      'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-sm hover:shadow-md hover:shadow-red-500/20',
    outline:
      'bg-transparent border-2 border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20',
    gradient:
      'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 active:from-primary-700 active:to-primary-800 text-white shadow-sm hover:shadow-lg hover:shadow-primary-500/30 hover:scale-[1.02]',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
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
        ${loading ? 'relative' : ''}
        ${variant !== 'ghost' ? 'active:translate-y-0' : ''}
        ${className}
      `}
    >
      {loading ? (
        <>
          <Loader size={size === 'sm' ? 14 : 18} className="animate-spin" />
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
