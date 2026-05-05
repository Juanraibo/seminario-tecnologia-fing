/**
 * LandingPage - Página principal pública de EcoFIng
 * Landing page moderna que explica el proyecto, funcionalidades y valor agregado
 */

import { useNavigate } from 'react-router-dom'
import Button from '../../components/atoms/Button'
import PublicNav from '../../components/layout/PublicNav'
import {
  Leaf, Package, Recycle, Award, TrendingUp, Users,
  Building2, Factory, Cpu, CheckCircle, ArrowRight,
  BarChart3, Shield, Zap
} from '../../components/atoms/Icon'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <PublicNav />
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-accent-500/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 py-24 sm:py-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                <Leaf size={16} className="text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                  Gestión Sustentable de RAEE
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                EcoFIng
                <span className="block text-primary-600 dark:text-primary-400 mt-2">
                  Tecnología para un Futuro Sustentable
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300">
                Plataforma integral para la gestión de Residuos de Aparatos Eléctricos y Electrónicos
                en la Facultad de Ingeniería. Transformamos desechos en impacto positivo.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="group"
                >
                  Comenzar
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/trazabilidad')}
                >
                  Ver Trazabilidad
                </Button>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-800">
                <div>
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">100%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Trazable</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">-80%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">CO₂</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">11</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Institutos</p>
                </div>
              </div>
            </div>

            {/* Ilustración / Hero Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-accent-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 rounded-2xl p-6 space-y-3">
                    <Recycle size={32} className="text-primary-600 dark:text-primary-400" />
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Clasificación Inteligente</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">IA para categorización automática</p>
                  </div>
                  <div className="bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/30 dark:to-accent-800/30 rounded-2xl p-6 space-y-3">
                    <Award size={32} className="text-accent-600 dark:text-accent-400" />
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Certificación</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Documentación automática</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl p-6 space-y-3">
                    <BarChart3 size={32} className="text-green-600 dark:text-green-400" />
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Impacto Medible</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Métricas ambientales en tiempo real</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl p-6 space-y-3">
                    <Shield size={32} className="text-blue-600 dark:text-blue-400" />
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Trazabilidad Total</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Seguimiento completo del ciclo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problema y Solución */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Por qué EcoFIng?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Los RAEE representan uno de los flujos de residuos de más rápido crecimiento.
              EcoFIng digitaliza y optimiza todo el proceso de gestión.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Problema */}
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-8">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">El Problema</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Procesos manuales y fragmentados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Falta de trazabilidad documentada</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Impacto ambiental no medible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Gestoras sin criterios objetivos</span>
                </li>
              </ul>
            </div>

            {/* Solución */}
            <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800 rounded-2xl p-8">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4">
                <Zap size={24} className="text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Nuestra Solución</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-primary-500 mt-0.5 flex-shrink-0" />
                  <span>Plataforma web centralizada</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-primary-500 mt-0.5 flex-shrink-0" />
                  <span>Clasificación con IA</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-primary-500 mt-0.5 flex-shrink-0" />
                  <span>Trazabilidad completa</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-primary-500 mt-0.5 flex-shrink-0" />
                  <span>Sistema de scoring transparente</span>
                </li>
              </ul>
            </div>

            {/* Impacto */}
            <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-2xl p-8">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
                <Leaf size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">El Impacto</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Reducción de CO₂ medible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Recuperación de materiales</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Certificación automática</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Cumplimiento normativo</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Funcionalidades Clave
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Cuatro portales especializados para una gestión integral
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Instituto */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Portal Instituto</h3>
                  <p className="text-gray-600 dark:text-gray-400">Gestión de solicitudes de retiro</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-primary-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Crear solicitudes con fotografías</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-primary-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Seguimiento en tiempo real</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-primary-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Historial completo de lotes</span>
                </li>
              </ul>
            </div>

            {/* Ecopunto */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Portal Ecopunto</h3>
                  <p className="text-gray-600 dark:text-gray-400">Clasificación y publicación</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-accent-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Clasificación con IA (Claude Vision)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-accent-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Cálculo automático de CO₂</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-accent-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Publicación de lotes al catálogo</span>
                </li>
              </ul>
            </div>

            {/* Gestora */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Factory size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Portal Gestora</h3>
                  <p className="text-gray-600 dark:text-gray-400">Licitación y retiro</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Catálogo de lotes disponibles</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Envío de cotizaciones</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Sistema de scoring transparente</span>
                </li>
              </ul>
            </div>

            {/* Admin */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Portal Admin</h3>
                  <p className="text-gray-600 dark:text-gray-400">Supervisión y métricas</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Aprobación de retiros</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Dashboard de impacto ambiental</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Gestión de actores del sistema</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tecnología */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tecnología de Vanguardia
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Stack moderno para máximo rendimiento y escalabilidad
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-3">⚛️</div>
              <p className="font-semibold text-gray-900 dark:text-white">React 18</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Frontend moderno</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-3">🗄️</div>
              <p className="font-semibold text-gray-900 dark:text-white">Supabase</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Base de datos PostgreSQL</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-3">🤖</div>
              <p className="font-semibold text-gray-900 dark:text-white">Claude AI</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Clasificación inteligente</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-3">🎨</div>
              <p className="font-semibold text-gray-900 dark:text-white">Tailwind CSS</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Diseño responsive</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-gradient-to-br from-primary-600 to-accent-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            ¿Listo para transformar la gestión de RAEE?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Únete a la red de institutos que ya están midiendo su impacto ambiental
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/login')}
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              Iniciar Sesión
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate('/trazabilidad')}
              className="border-2 border-white text-white hover:bg-white/10"
            >
              Explorar Trazabilidad
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">EcoFIng</h3>
              <p className="text-sm text-gray-400">
                Plataforma de gestión de RAEE para la Facultad de Ingeniería, Universidad de la República, Uruguay.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => navigate('/trazabilidad')} className="hover:text-white transition-colors">
                    Trazabilidad
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/calculadora')} className="hover:text-white transition-colors">
                    Calculadora CO₂
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">
                    Iniciar Sesión
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contacto</h4>
              <p className="text-sm text-gray-400">
                Facultad de Ingeniería<br />
                Universidad de la República<br />
                Montevideo, Uruguay
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>© 2026 EcoFIng. Seminario de Tecnologías - Trabajo Final.</p>
            <p className="mt-2">Carmela González · Verónica Iriarte · Juan Raimondo</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
