/**
 * DataTable - Tabla de datos con diseño minimalista
 * Soporte para acciones, hover, y responsive
 */

export default function DataTable({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No hay datos para mostrar',
  className = ''
}) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={`overflow-x-auto bg-white dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-800/50 backdrop-blur-sm ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800/50 bg-gray-50 dark:bg-gray-900/50">
            {columns.map((column, index) => (
              <th
                key={index}
                className={`
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
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={`
                transition-colors
                ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50' : ''}
              `}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={`
                    px-6 py-4 text-sm text-gray-900 dark:text-gray-100
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
