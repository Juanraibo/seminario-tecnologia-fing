/**
 * DataTable - Tabla Enterprise
 * Diseño limpio, funcional, sticky header sin efectos decorativos
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
  // Estado de carga
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400" role="status" aria-live="polite">
        <Loader size={32} className="animate-spin text-gray-400 mb-3" />
        <p className="text-sm font-medium">{loadingMessage}</p>
      </div>
    )
  }

  // Estado de error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-red-600 dark:text-red-400" role="alert">
        <AlertCircle size={40} className="mb-3" />
        <p className="text-sm font-medium">{errorMessage}</p>
        {error && <p className="text-xs mt-2 text-gray-500">{error}</p>}
      </div>
    )
  }

  // Estado vacío
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <PackageX size={40} className="text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-sm font-medium">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            {columns.map((column, index) => (
              <th
                key={column.key || index}
                className={`
                  bg-gray-50 dark:bg-gray-900
                  px-4 py-2.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide
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
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={`
                enterprise-table-row
                ${onRowClick ? 'cursor-pointer' : ''}
              `}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={`${row.id || rowIndex}-${column.key || colIndex}`}
                  className={`
                    px-4 py-3 text-sm text-gray-900 dark:text-gray-100
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
