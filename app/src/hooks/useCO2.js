/**
 * Hook useCO2 - Cálculo de emisiones de CO2 evitadas
 *
 * Integración con Climatiq API para cálculo en tiempo real
 * Fallback a factores estimados si API no disponible
 */

import { useState, useEffect } from 'react'
import {
  calcularCO2Evitado,
  obtenerEquivalenciasCO2,
  formatearCO2
} from '../services/carbonAPI'

/**
 * Hook para calcular CO2 evitado de un ítem o lote RAEE
 *
 * @param {number} peso_kg - Peso en kilogramos
 * @param {string} categoria - Categoría RAEE
 * @param {boolean} autoCalcular - Si debe calcular automáticamente al montar
 * @returns {object} { co2_kg, source, loading, error, equivalencias, formatear, recalcular }
 */
export function useCO2(peso_kg = 0, categoria = null, autoCalcular = true) {
  const [data, setData] = useState({
    co2_kg: 0,
    source: null,
    loading: false,
    error: null,
    details: null,
  })

  const calcular = async (nuevoPeso = peso_kg, nuevaCategoria = categoria) => {
    if (!nuevoPeso || nuevoPeso <= 0) {
      setData({
        co2_kg: 0,
        source: 'estimated',
        loading: false,
        error: 'Peso inválido',
        details: null,
      })
      return
    }

    setData(prev => ({ ...prev, loading: true, error: null }))

    try {
      const resultado = await calcularCO2Evitado(nuevoPeso, nuevaCategoria)
      setData({
        ...resultado,
        loading: false,
        error: null,
      })
    } catch (error) {
      setData({
        co2_kg: 0,
        source: 'error',
        loading: false,
        error: error.message,
        details: null,
      })
    }
  }

  // Auto-calcular al montar o cuando cambian los parámetros
  useEffect(() => {
    if (autoCalcular && peso_kg > 0) {
      calcular(peso_kg, categoria)
    }
  }, [peso_kg, categoria, autoCalcular])

  return {
    co2_kg: data.co2_kg,
    source: data.source,
    loading: data.loading,
    error: data.error,
    details: data.details,
    equivalencias: data.co2_kg > 0 ? obtenerEquivalenciasCO2(data.co2_kg) : null,
    formatear: (opciones) => formatearCO2(data.co2_kg, opciones),
    recalcular: calcular,
  }
}

/**
 * Hook para calcular CO2 de múltiples ítems
 *
 * @param {Array} items - Array de ítems con peso_kg y categoria
 * @returns {object} { total_co2, por_categoria, loading, error }
 */
export function useCO2Multiple(items = []) {
  const [data, setData] = useState({
    total_co2: 0,
    por_categoria: {},
    loading: false,
    error: null,
  })

  useEffect(() => {
    if (!items || items.length === 0) {
      setData({
        total_co2: 0,
        por_categoria: {},
        loading: false,
        error: null,
      })
      return
    }

    const calcularTodos = async () => {
      setData(prev => ({ ...prev, loading: true }))

      try {
        const resultados = await Promise.all(
          items.map(item => calcularCO2Evitado(item.peso_kg, item.categoria))
        )

        let totalCO2 = 0
        const porCategoria = {}

        items.forEach((item, index) => {
          const resultado = resultados[index]
          const cat = item.categoria || 'Otros'

          totalCO2 += resultado.co2_kg || 0

          if (!porCategoria[cat]) {
            porCategoria[cat] = {
              co2_kg: 0,
              items: 0,
            }
          }

          porCategoria[cat].co2_kg += resultado.co2_kg || 0
          porCategoria[cat].items += 1
        })

        setData({
          total_co2: totalCO2,
          por_categoria: porCategoria,
          loading: false,
          error: null,
        })
      } catch (error) {
        setData({
          total_co2: 0,
          por_categoria: {},
          loading: false,
          error: error.message,
        })
      }
    }

    calcularTodos()
  }, [items])

  return data
}

export default useCO2
