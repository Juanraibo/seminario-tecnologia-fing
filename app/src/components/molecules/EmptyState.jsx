/**
 * EmptyState - Estados vacíos personalizados enterprise
 * Iconos temáticos y CTAs según el contexto
 */

import {
  PackageX, Search, CheckCircle, FileText,
  DollarSign, Package, AlertCircle
} from '../atoms/Icon'
import Button from '../atoms/Button'

export default function EmptyState({
  type = 'default', // default | no-results | no-data | success | error
  icon: CustomIcon,
  title,
  description,
  action,
  actionLabel,
  secondaryAction,
  secondaryActionLabel,
  className = ''
}) {
  // Iconos por defecto según tipo
  const defaultIcons = {
    default: PackageX,
    'no-results': Search,
    'no-data': FileText,
    success: CheckCircle,
    error: AlertCircle,
  }

  const Icon = CustomIcon || defaultIcons[type] || PackageX

  // Colores según tipo
  const iconColors = {
    default: 'text-gray-300 dark:text-gray-600',
    'no-results': 'text-gray-300 dark:text-gray-600',
    'no-data': 'text-gray-300 dark:text-gray-600',
    success: 'text-emerald-500 dark:text-emerald-400',
    error: 'text-red-500 dark:text-red-400',
  }

  const bgColors = {
    default: 'bg-gray-100 dark:bg-gray-800',
    'no-results': 'bg-gray-100 dark:bg-gray-800',
    'no-data': 'bg-gray-100 dark:bg-gray-800',
    success: 'bg-emerald-100 dark:bg-emerald-950/30',
    error: 'bg-red-100 dark:bg-red-950/30',
  }

  return (
    <div className={`text-center py-12 px-6 ${className}`}>
      {/* Icono */}
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg ${bgColors[type]} mb-6`}>
        <Icon size={32} className={iconColors[type]} strokeWidth={1.5} />
      </div>

      {/* Título */}
      {title && (
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h3>
      )}

      {/* Descripción */}
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
          {description}
        </p>
      )}

      {/* Acciones */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {action && (
            <Button
              variant="primary"
              size="md"
              onClick={action}
            >
              {actionLabel || 'Continuar'}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="secondary"
              size="md"
              onClick={secondaryAction}
            >
              {secondaryActionLabel || 'Cancelar'}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * EmptyStates predefinidos para casos comunes
 */

export function EmptyLotes({ onAction, actionLabel = 'Nueva Solicitud' }) {
  return (
    <EmptyState
      icon={Package}
      title="No hay lotes registrados"
      description="Aún no hay lotes de RAEE en el sistema. Creá una nueva solicitud para comenzar."
      action={onAction}
      actionLabel={actionLabel}
    />
  )
}

export function EmptySearch({ onClear }) {
  return (
    <EmptyState
      type="no-results"
      title="Sin resultados"
      description="No se encontraron coincidencias con tu búsqueda. Intentá con otros términos o limpiá los filtros."
      action={onClear}
      actionLabel="Limpiar filtros"
    />
  )
}

export function EmptySolicitudes({ onAction }) {
  return (
    <EmptyState
      icon={DollarSign}
      title="No hay solicitudes"
      description="Todavía no realizaste ninguna solicitud de cotización. Explorá el catálogo de lotes disponibles."
      action={onAction}
      actionLabel="Ver catálogo"
    />
  )
}

export function SuccessState({ title, description, onAction, actionLabel }) {
  return (
    <EmptyState
      type="success"
      title={title || '¡Éxito!'}
      description={description}
      action={onAction}
      actionLabel={actionLabel}
    />
  )
}

export function ErrorState({ title, description, onRetry, onGoBack }) {
  return (
    <EmptyState
      type="error"
      title={title || 'Error'}
      description={description}
      action={onRetry}
      actionLabel="Reintentar"
      secondaryAction={onGoBack}
      secondaryActionLabel="Volver"
    />
  )
}
