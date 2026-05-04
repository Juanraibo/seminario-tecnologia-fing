/**
 * CalculadoraPage - Página dedicada a la Calculadora de Impacto Ambiental
 * Permite a usuarios calcular el CO2 que evitarían al reciclar sus RAEE
 */

import PublicNav from '../../components/layout/PublicNav'
import CalculadoraImpacto from '../../components/organisms/CalculadoraImpacto'
import {
  Leaf, TreePine, Recycle, Package, Sparkles,
  CheckCircle, Info
} from '../../components/atoms/Icon'
import useScrollReveal from '../../hooks/useScrollReveal'

function InfoCard({ icon: Icon, title, description, delay = 0 }) {
  const { elementRef, isVisible } = useScrollReveal({ delay })

  return (
    <div
      ref={elementRef}
      className={`enterprise-card p-6 text-center transition-all duration-300 ${
        isVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-950/50 rounded-xl mb-4">
        <Icon size={24} className="text-primary-600 dark:text-primary-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function StepCard({ number, title, description, delay = 0 }) {
  const { elementRef, isVisible } = useScrollReveal({ delay })

  return (
    <div
      ref={elementRef}
      className={`flex gap-4 transition-all duration-300 ${
        isVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="shrink-0">
        <div className="w-10 h-10 bg-primary-600 dark:bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
          {number}
        </div>
      </div>
      <div className="flex-1">
        <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
          {title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}

export default function CalculadoraPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <PublicNav />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-emerald-500 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
            <Leaf size={36} strokeWidth={2} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Calculadora de Impacto Ambiental
          </h1>
          <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto leading-relaxed">
            Descubrí cuánto CO₂ podés evitar al reciclar tus residuos electrónicos
            y contribuir a un futuro más sustentable
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Instructivo: ¿Cómo funciona? */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Info size={16} />
              ¿Cómo funciona?
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Tres pasos simples para calcular tu impacto
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Nuestra calculadora usa factores de emisión reales de la API Climatiq
              para estimar el CO₂ evitado al reciclar RAEE
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <StepCard
              number="1"
              title="Seleccioná el tipo"
              description="Elegí la categoría de tu residuo electrónico: computadoras, monitores, cables, baterías, etc."
              delay={0}
            />
            <StepCard
              number="2"
              title="Ingresá el peso"
              description="Ingresá el peso aproximado en kilogramos. Si no sabés, usá el peso promedio sugerido."
              delay={100}
            />
            <StepCard
              number="3"
              title="Calculá y compartí"
              description="Obtené al instante el CO₂ evitado y sus equivalencias en árboles, km de auto, y más."
              delay={200}
            />
          </div>
        </section>

        {/* Calculadora */}
        <section>
          <CalculadoraImpacto />
        </section>

        {/* ¿Por qué es importante? */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Sparkles size={16} />
              Impacto Positivo
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              ¿Por qué reciclar RAEE?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Los residuos electrónicos mal gestionados contaminan el suelo y agua,
              y desperdician materiales valiosos. Reciclarlos correctamente genera múltiples beneficios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard
              icon={Leaf}
              title="Reducción de CO₂"
              description="Evitar la extracción de materias primas vírgenes reduce significativamente las emisiones de gases de efecto invernadero."
              delay={0}
            />
            <InfoCard
              icon={Recycle}
              title="Recuperación de Materiales"
              description="Los RAEE contienen metales preciosos como oro, plata y cobre que pueden recuperarse y reutilizarse."
              delay={100}
            />
            <InfoCard
              icon={TreePine}
              title="Protección del Ecosistema"
              description="Evitar que sustancias tóxicas (plomo, mercurio) contaminen suelos y fuentes de agua protege la biodiversidad."
              delay={200}
            />
          </div>
        </section>

        {/* CTA Final */}
        <section className="bg-gradient-to-br from-primary-600 to-emerald-600 rounded-2xl p-12 text-center text-white">
          <Package size={48} className="mx-auto mb-6 opacity-90" strokeWidth={1.5} />
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para hacer la diferencia?
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-xl mx-auto">
            Coordiná la recolección de tus RAEE con EcoFIng y contribuí
            a un futuro más sustentable para la Facultad de Ingeniería
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors shadow-enterprise-lg"
            >
              <CheckCircle size={20} />
              Donar mis RAEE
            </a>
            <a
              href="/trazabilidad"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border-2 border-white/30"
            >
              Ver Registro Público
            </a>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 pt-8">
          <p className="mb-2">
            Los cálculos de emisiones de CO₂ son estimaciones basadas en factores de emisión
            de{' '}
            <a
              href="https://www.climatiq.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Climatiq API
            </a>
            .
          </p>
          <p>
            Las equivalencias son aproximaciones para facilitar la comprensión del impacto ambiental.
          </p>
        </div>
      </div>
    </div>
  )
}
