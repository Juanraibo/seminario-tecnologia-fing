/**
 * Carbon API Service - Cálculo de emisiones de CO2 evitadas
 *
 * Integración con Climatiq API para cálculo real de impacto ambiental
 * Fallback a factor estimado (1.4 kg CO2 / kg RAEE) si API no disponible
 *
 * Climatiq API: https://www.climatiq.io/docs
 * Endpoint: POST https://api.climatiq.io/data/v1/estimate
 */

const CLIMATIQ_API_KEY = import.meta.env.VITE_CLIMATIQ_API_KEY
const CLIMATIQ_ENDPOINT = 'https://api.climatiq.io/data/v1/estimate'

// Factor de emisión estimado (kg CO2 evitado por kg de RAEE reciclado)
// Fuente: estudios de reciclaje electrónico (promedio)
const CO2_FACTOR_FALLBACK = 1.4

/**
 * Categorías de RAEE con sus factores de emisión específicos
 * Estos valores son estimaciones basadas en estudios de reciclaje
 */
const FACTORES_POR_CATEGORIA = {
  'Equipos de Informática y Telecomunicaciones': 1.5, // PCs, laptops, servidores
  'Pantallas y Monitores': 1.3, // LCD, CRT
  'Baterías y Acumuladores': 2.1, // Baterías de Li-ion, plomo-ácido
  'Equipos de Audio y Video': 1.2, // Proyectores, amplificadores
  'Pequeños Electrodomésticos': 0.9, // General
  'Equipos de Iluminación': 0.7, // Lámparas, LEDs
  'Cables y Periféricos': 0.8, // Cables, teclados, mouse
}

/**
 * Calcula CO2 evitado usando Climatiq API
 *
 * @param {number} peso_kg - Peso del RAEE en kilogramos
 * @param {string} categoria - Categoría del RAEE
 * @returns {Promise<{co2_kg: number, source: 'api'|'estimated', details?: object}>}
 */
export async function calcularCO2Evitado(peso_kg, categoria = null) {
  // Validación
  if (!peso_kg || peso_kg <= 0) {
    return {
      co2_kg: 0,
      source: 'estimated',
      error: 'Peso inválido'
    }
  }

  // Si no hay API key, usar fallback
  if (!CLIMATIQ_API_KEY) {
    return calcularCO2Fallback(peso_kg, categoria)
  }

  try {
    // Intentar con Climatiq API
    const response = await fetch(CLIMATIQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emission_factor: {
          // Usar factor de reciclaje de equipos electrónicos
          activity_id: 'waste_type-recycling-na',
          source: 'EPA',
          region: 'SOUTH_AMERICA',
          year: 2023,
        },
        parameters: {
          weight: peso_kg,
          weight_unit: 'kg',
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Climatiq API error: ${response.status}`)
    }

    const data = await response.json()

    return {
      co2_kg: data.co2e || peso_kg * CO2_FACTOR_FALLBACK,
      source: 'api',
      details: {
        activity: data.emission_factor?.activity_id,
        region: data.emission_factor?.region,
        confidence: 'high',
      },
    }
  } catch (error) {
    console.warn('Climatiq API no disponible, usando estimación:', error.message)
    return calcularCO2Fallback(peso_kg, categoria)
  }
}

/**
 * Cálculo fallback de CO2 con factores estimados
 *
 * @param {number} peso_kg - Peso del RAEE en kilogramos
 * @param {string} categoria - Categoría del RAEE
 * @returns {object}
 */
function calcularCO2Fallback(peso_kg, categoria) {
  // Usar factor específico por categoría si está disponible
  const factor = FACTORES_POR_CATEGORIA[categoria] || CO2_FACTOR_FALLBACK

  return {
    co2_kg: peso_kg * factor,
    source: 'estimated',
    details: {
      factor_usado: factor,
      categoria: categoria || 'General',
      confidence: 'medium',
    },
  }
}

/**
 * Calcula CO2 evitado para un lote completo
 *
 * @param {object} lote - Objeto de lote con peso_total_kg y categoria
 * @returns {Promise<object>}
 */
export async function calcularCO2Lote(lote) {
  if (!lote || !lote.peso_total_kg) {
    return {
      co2_kg: 0,
      source: 'estimated',
      error: 'Lote inválido'
    }
  }

  return await calcularCO2Evitado(lote.peso_total_kg, lote.categoria)
}

/**
 * Calcula estadísticas de CO2 para múltiples lotes
 *
 * @param {Array} lotes - Array de lotes
 * @returns {Promise<object>}
 */
export async function calcularEstadisticasCO2(lotes) {
  if (!Array.isArray(lotes) || lotes.length === 0) {
    return {
      total_kg_raee: 0,
      total_co2_evitado: 0,
      por_categoria: {},
      source: 'estimated',
    }
  }

  const resultados = await Promise.all(
    lotes.map(lote => calcularCO2Lote(lote))
  )

  const porCategoria = {}
  let totalCO2 = 0
  let totalKg = 0

  lotes.forEach((lote, index) => {
    const resultado = resultados[index]
    const categoria = lote.categoria || 'Otros'

    if (!porCategoria[categoria]) {
      porCategoria[categoria] = {
        kg_raee: 0,
        co2_evitado: 0,
        lotes: 0,
      }
    }

    porCategoria[categoria].kg_raee += lote.peso_total_kg || 0
    porCategoria[categoria].co2_evitado += resultado.co2_kg || 0
    porCategoria[categoria].lotes += 1

    totalCO2 += resultado.co2_kg || 0
    totalKg += lote.peso_total_kg || 0
  })

  return {
    total_kg_raee: totalKg,
    total_co2_evitado: totalCO2,
    por_categoria: porCategoria,
    source: resultados[0]?.source || 'estimated',
    lotes_procesados: lotes.length,
  }
}

/**
 * Formatea el valor de CO2 para display
 *
 * @param {number} co2_kg - CO2 en kilogramos
 * @param {object} options - Opciones de formato
 * @returns {string}
 */
export function formatearCO2(co2_kg, options = {}) {
  const {
    decimales = 1,
    unidad = 'kg',
    incluirUnidad = true
  } = options

  if (co2_kg >= 1000 && unidad === 'kg') {
    // Convertir a toneladas si es muy grande
    const toneladas = co2_kg / 1000
    return `${toneladas.toFixed(decimales)}${incluirUnidad ? ' ton' : ''}`
  }

  return `${co2_kg.toFixed(decimales)}${incluirUnidad ? ' kg' : ''}`
}

/**
 * Obtiene equivalencias de CO2 (árboles, autos, etc.)
 *
 * @param {number} co2_kg - CO2 en kilogramos
 * @returns {object}
 */
export function obtenerEquivalenciasCO2(co2_kg) {
  return {
    arboles_plantados: (co2_kg / 21.77).toFixed(1), // Un árbol absorbe ~21.77 kg CO2/año
    km_auto: (co2_kg / 0.192).toFixed(0), // Auto promedio emite ~192g CO2/km
    horas_luz: (co2_kg / 0.475).toFixed(0), // Bombilla LED 10W emite ~475g CO2/100h
    smartphones_cargados: (co2_kg / 0.008).toFixed(0), // Cargar smartphone ~8g CO2
  }
}

// Export default para compatibilidad
export default {
  calcularCO2Evitado,
  calcularCO2Lote,
  calcularEstadisticasCO2,
  formatearCO2,
  obtenerEquivalenciasCO2,
}
