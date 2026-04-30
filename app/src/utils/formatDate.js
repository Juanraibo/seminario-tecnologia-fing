/**
 * Formatea una fecha al locale uruguayo
 * @param {string|Date} date - Fecha a formatear
 * @param {object} options - Opciones de toLocaleDateString
 * @returns {string} Fecha formateada
 */
export function formatDate(date, options = {}) {
  if (!date) return ''
  const defaultOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  }
  return new Date(date).toLocaleDateString('es-UY', defaultOptions)
}

/**
 * Formato corto: "28 abr 2026"
 */
export function formatDateShort(date) {
  return formatDate(date, { day: '2-digit', month: 'short', year: 'numeric' })
}

/**
 * Formato largo: "28 de abril de 2026"
 */
export function formatDateLong(date) {
  return formatDate(date, { day: '2-digit', month: 'long', year: 'numeric' })
}
