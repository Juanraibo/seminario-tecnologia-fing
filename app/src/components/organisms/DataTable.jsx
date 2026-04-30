/**
 * DataTable - Tabla de datos con diseño minimalista
 * Sticky header con backdrop-blur, hover animado, empty state mejorado
 */

import { Loader, AlertCircle, PackageX } from '../atoms/Icon'

export default function DataTable({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No hay datos para mostrar',
  loadingMessage = 'Cargando datos...',
  errorMessage = 'Error al cargar los datos',
  loading = false,
  error = null,
  className = ''
}) {
  // Estado de carga con spinner
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-800/50 transition-colors" role="status" aria-live="polite">
        <Loader size={36} className="animate-spin text-primary-500 mb-4" />
        <p className="text-sm font-medium">{loadingMessage}</p>
      </div>
    )
  }

  // Estado de error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-red-500 dark:text-red-400 bg-white dark:bg-gray-900/30 rounded-lg border border-dashed border-red-300 dark:border-red-800/50 transition-colors" role="alert">
        <AlertCircle size={48} className="mb-4" />
        <p className="text-sm font-medium">{errorMessage}</p>
        {error && <p className="text-xs mt-2 text-gray-400">{error}</p>}
      </div>
    )
  }

  // Estado vacío
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900/30 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 transition-colors">
        <PackageX size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
        <p className="text-sm font-medium">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={`overflow-x-auto bg-white dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-800/50 ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800/50">
            {columns.map((column, index) => (
              <th
                key={column.key || index}
                className={`
                  sticky top-0 z-10
                  bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm
                  px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider
                  ${column.align === 'center' ? 'text-center' : ''}
                  ${column.align === 'right' ? 'text-right' : ''}
                  ${column.className || ''}
                `}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={`
                transition-all duration-200
                animate-fade-in-up
                ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/30 hover:shadow-sm' : ''}
              `}
              style={{ animationDelay: `${Math.min(rowIndex * 30, 300)}ms`, animationFillMode: 'backwards' }}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={`${row.id || rowIndex}-${column.key || colIndex}`}
                  className={`
                    px-6 py-4 text-sm text-gray-900 dark:text-gray-100
                    border-b border-gray-50 dark:border-gray-800/30
                    ${column.align === 'center' ? 'text-center' : ''}
                    ${column.align === 'right' ? 'text-right' : ''}
                    ${column.className || ''}
                  `}
                >
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
