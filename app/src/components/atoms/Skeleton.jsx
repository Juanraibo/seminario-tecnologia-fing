/**
 * Skeleton - Loading placeholder enterprise
 * Diseño minimalista con animación shimmer sutil
 */

export default function Skeleton({ className = '', variant = 'default', ...props }) {
  const variants = {
    default: 'h-4 w-full',
    text: 'h-4 w-full',
    title: 'h-8 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    card: 'h-48 w-full rounded-lg',
    stat: 'h-24 w-full rounded-lg',
    button: 'h-10 w-32 rounded-md',
  }

  return (
    <div
      className={`
        bg-gray-200 dark:bg-gray-800
        animate-pulse
        ${variants[variant]}
        ${className}
      `}
      {...props}
    />
  )
}

/**
 * SkeletonCard - Card completa con skeleton
 */
export function SkeletonCard() {
  return (
    <div className="enterprise-card p-5 space-y-4">
      <Skeleton variant="title" />
      <div className="space-y-2">
        <Skeleton />
        <Skeleton className="w-5/6" />
        <Skeleton className="w-4/6" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton variant="button" />
        <Skeleton variant="button" />
      </div>
    </div>
  )
}

/**
 * SkeletonTable - Tabla con skeleton rows
 */
export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
          <Skeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-1/3" />
            <Skeleton className="w-1/2" />
          </div>
          <Skeleton variant="button" />
        </div>
      ))}
    </div>
  )
}

/**
 * SkeletonStats - Grid de stats con skeleton
 */
export function SkeletonStats({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="stat" />
      ))}
    </div>
  )
}
