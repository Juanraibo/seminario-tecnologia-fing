/**
 * Badge - Componente atómico para etiquetas y labels
 * Variantes: default, primary, secondary, accent, success, warning, error
 */

export default function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  const baseStyles = 'inline-flex items-center gap-1 font-medium rounded-full transition-colors'

  const variants = {
    default: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200',
    primary: 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300',
    secondary: 'bg-secondary-100 dark:bg-secondary-900/40 text-secondary-700 dark:text-secondary-300',
    accent: 'bg-accent-100 dark:bg-accent-900/40 text-accent-700 dark:text-accent-300',
    teal: 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300',
    success: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
    warning: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
    error: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  )
}
