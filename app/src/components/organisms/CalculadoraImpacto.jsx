/**
 * CalculadoraImpacto - Calculadora de impacto ambiental para portal público
 * Permite a usuarios estimar el CO2 evitado al donar RAEE
 */

import { useState } from 'react'
import { useCO2 } from '../../hooks/useCO2'
import Card from '../molecules/Card'
import Button from '../atoms/Button'
import { CO2Card } from '../molecules/CO2Badge'
import CategoryBadge from '../molecules/CategoryBadge'
import {
  Calculator, Leaf, TreePine, Car, Lightbulb,
  Smartphone, ArrowRight, Package
} from '../atoms/Icon'
import useScrollReveal from '../../hooks/useScrollReveal'

// Categorías RAEE con pesos promedio
const CATEGORIAS_RAEE = [
  { id: 'Equipos de Informática', nombre: 'Equipos de Informática', pesoPromedio: 8, ejemplo: 'PC, laptop, impresora' },
  { id: 'Pantallas y Monitores', nombre: 'Pantallas y Monitores', pesoPromedio: 12, ejemplo: 'Monitor, TV, display' },
  { id: 'Baterías', nombre: 'Baterías', pesoPromedio: 0.5, ejemplo: 'Pilas, baterías recargables' },
  { id: 'Audio y Video', nombre: 'Audio y Video', pesoPromedio: 3, ejemplo: 'Parlantes, auriculares, micrófonos' },
  { id: 'Iluminación', nombre: 'Iluminación', pesoPromedio: 0.3, ejemplo: 'Bombillas LED, tubos fluorescentes' },
  { id: 'Cables', nombre: 'Cables y Conectores', pesoPromedio: 0.2, ejemplo: 'Cables USB, HDMI, cargadores' },
]

export default function CalculadoraImpacto() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null)
  const [pesoKg, setPesoKg] = useState('')
  const [mostrarResultado, setMostrarResultado] = useState(false)

  const { elementRef, isVisible } = useScrollReveal({ threshold: 0.2 })

  // Calcular CO2 cuando hay categoría y peso válido
  const pesoNumerico = parseFloat(pesoKg) || 0
  const { co2_kg, equivalencias, loading } = useCO2(
    pesoNumerico,
    categoriaSeleccionada?.id,
    mostrarResultado && pesoNumerico > 0
  )

  const handleCalcular = () => {
    if (categoriaSeleccionada && pesoNumerico > 0) {
      setMostrarResultado(true)
    }
  }

  const handleReset = () => {
    setCategoriaSeleccionada(null)
    setPesoKg('')
    setMostrarResultado(false)
  }

  const handleUsarPesoPromedio = () => {
    if (categoriaSeleccionada) {
      setPesoKg(categoriaSeleccionada.pesoPromedio.toString())
    }
  }

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-500 ${
        isVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-8'
      }`}
    >
      <Card className="bg-gradient-to-br from-primary-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950/30">
        {/* Header */}
        <div className="text-center mb-6 pb-6 border-b border-primary-200 dark:border-primary-900/30">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 dark:bg-primary-950/50 rounded-xl mb-4">
            <Calculator size={28} className="text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Calculadora de Impacto
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Descubrí cuánto CO₂ podés evitar al reciclar tus residuos electrónicos
          </p>
        </div>

        {/* Paso 1: Seleccionar categoría */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            1. Seleccioná el tipo de residuo
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CATEGORIAS_RAEE.map((categoria) => (
              <button
                key={categoria.id}
                onClick={() => {
                  setCategoriaSeleccionada(categoria)
                  setMostrarResultado(false)
                }}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  categoriaSeleccionada?.id === categoria.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30 shadow-enterprise-md'
                    : 'border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 bg-white dark:bg-gray-900'
                }`}
              >
                <CategoryBadge categoria={categoria.id} showLabel={false} size="lg" className="mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {categoria.nombre}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {categoria.ejemplo}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Paso 2: Ingresar peso */}
        {categoriaSeleccionada && (
          <div className="mb-6 animate-slide-up">
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              2. Ingresá el peso aproximado (kg)
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={pesoKg}
                  onChange={(e) => {
                    setPesoKg(e.target.value)
                    setMostrarResultado(false)
                  }}
                  placeholder="Ej: 2.5"
                  className="w-full px-4 py-3 text-lg font-semibold border-2 border-gray-200 dark:border-gray-700 rounded-lg
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                    focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>
              <Button
                variant="secondary"
                size="md"
                onClick={handleUsarPesoPromedio}
              >
                Usar promedio ({categoriaSeleccionada.pesoPromedio} kg)
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              💡 Tip: Peso promedio para {categoriaSeleccionada.nombre}: ~{categoriaSeleccionada.pesoPromedio} kg
            </p>
          </div>
        )}

        {/* Botón calcular */}
        {categoriaSeleccionada && pesoNumerico > 0 && !mostrarResultado && (
          <div className="mb-6 animate-scale-in">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              icon={<Calculator size={20} />}
              onClick={handleCalcular}
            >
              Calcular Impacto
            </Button>
          </div>
        )}

        {/* Resultados */}
        {mostrarResultado && !loading && co2_kg !== null && (
          <div className="space-y-6 animate-slide-up">
            {/* Badge principal de CO2 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border-2 border-primary-200 dark:border-primary-800 shadow-enterprise-lg">
              <div className="text-center mb-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Al reciclar {pesoNumerico} kg de {categoriaSeleccionada.nombre}, evitarías emitir:
                </p>
                <div className="inline-flex items-center gap-3 bg-emerald-100 dark:bg-emerald-950/30 px-6 py-4 rounded-xl">
                  <Leaf size={32} className="text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-4xl font-bold text-emerald-900 dark:text-emerald-100">
                      {co2_kg.toFixed(2)}
                    </p>
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      kg de CO₂
                    </p>
                  </div>
                </div>
              </div>

              {/* Equivalencias */}
              {equivalencias && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center mb-4">
                    Equivalente a:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <TreePine size={24} className="text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {equivalencias.arboles_plantados}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Árboles plantados</p>
                    </div>
                    <div className="text-center">
                      <Car size={24} className="text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {equivalencias.km_auto}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Km en auto</p>
                    </div>
                    <div className="text-center">
                      <Lightbulb size={24} className="text-amber-600 dark:text-amber-400 mx-auto mb-2" />
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {equivalencias.horas_luz}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Horas LED</p>
                    </div>
                    <div className="text-center">
                      <Smartphone size={24} className="text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {equivalencias.smartphones_cargados}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Cargas completas</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="bg-primary-600 dark:bg-primary-900/50 rounded-xl p-6 text-center">
              <p className="text-lg font-bold text-white dark:text-primary-100 mb-3">
                ¡Sumá tu aporte al medio ambiente!
              </p>
              <p className="text-sm text-primary-100 dark:text-primary-200 mb-4 max-w-md mx-auto">
                Coordiná la recolección de tus RAEE y ayudanos a reducir el impacto ambiental
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  icon={<Package size={18} />}
                  onClick={() => window.location.href = '/login'}
                >
                  Donar mis RAEE
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleReset}
                >
                  Calcular otro
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              Calculando impacto ambiental...
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
