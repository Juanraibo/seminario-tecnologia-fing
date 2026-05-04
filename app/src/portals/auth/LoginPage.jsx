import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Recycle, Building2, Factory, Shield, Globe, ChevronRight } from '../../components/atoms/Icon'

export default function LoginPage() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Activar dark mode por defecto (Enterprise style)
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  const RUTAS_POR_ROL = {
    admin:     '/admin',
    instituto: '/instituto',
    ecopunto:  '/ecopunto',
    gestora:   '/gestora',
  }

  // Perfiles de prueba para auto-login
  const PERFILES_PRUEBA = [
    {
      nombre: 'Administrador',
      email: 'admin@fing.edu.uy',
      password: 'admin123',
      icon: Shield,
      rol: 'admin',
    },
    {
      nombre: 'Instituto',
      email: 'inco@fing.edu.uy',
      password: 'inco123',
      icon: Building2,
      rol: 'instituto',
    },
    {
      nombre: 'Ecopunto',
      email: 'ecopunto@fing.edu.uy',
      password: 'eco123',
      icon: Recycle,
      rol: 'ecopunto',
    },
    {
      nombre: 'Gestora',
      email: 'gestora1@reciclauY.com',
      password: 'gest123',
      icon: Factory,
      rol: 'gestora',
    },
  ]

  function handleLogin(e) {
    e.preventDefault()
    setError('')
    const usuario = state.usuarios.find(
      u => u.email === email && u.password === password
    )
    if (!usuario) {
      setError('Credenciales incorrectas. Verificá tu email y contraseña.')
      return
    }
    dispatch({ type: 'LOGIN', payload: usuario })
    navigate(RUTAS_POR_ROL[usuario.rol])
  }

  // Auto-login al hacer click en un perfil
  function handleAutoLogin(perfil) {
    const usuario = state.usuarios.find(
      u => u.email === perfil.email && u.password === perfil.password
    )
    if (usuario) {
      dispatch({ type: 'LOGIN', payload: usuario })
      navigate(RUTAS_POR_ROL[usuario.rol])
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
      {/* Patrón de fondo: circuitos y reciclaje */}
      <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.05]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fill-rule='evenodd'%3E%3Ccircle cx='10' cy='10' r='1.5'/%3E%3Ccircle cx='30' cy='10' r='1.5'/%3E%3Ccircle cx='50' cy='10' r='1.5'/%3E%3Ccircle cx='70' cy='10' r='1.5'/%3E%3Ccircle cx='10' cy='30' r='1.5'/%3E%3Ccircle cx='70' cy='30' r='1.5'/%3E%3Ccircle cx='10' cy='50' r='1.5'/%3E%3Ccircle cx='70' cy='50' r='1.5'/%3E%3Ccircle cx='10' cy='70' r='1.5'/%3E%3Ccircle cx='30' cy='70' r='1.5'/%3E%3Ccircle cx='50' cy='70' r='1.5'/%3E%3Ccircle cx='70' cy='70' r='1.5'/%3E%3Cpath d='M10 10 L30 10 M50 10 L70 10 M10 30 L10 10 M70 30 L70 10 M10 50 L10 70 M70 50 L70 70 M10 70 L30 70 M50 70 L70 70' stroke='%2310b981' stroke-width='0.5' fill='none' opacity='0.3'/%3E%3Cpath d='M40 20 L35 25 L40 30 L45 25 Z M40 50 L35 55 L40 60 L45 55 Z' fill='%2310b981' opacity='0.4'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '80px 80px'
      }}></div>

      {/* Gradiente con toques de color */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-primary-50/10 to-emerald-50/10 dark:from-gray-950 dark:via-primary-950/20 dark:to-emerald-950/10"></div>

      {/* Elementos decorativos flotantes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl"></div>

      {/* Card principal */}
      <div className="w-full max-w-md relative z-10">
        <div className="enterprise-card p-8 animate-fade-in">

          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 dark:bg-gray-100 rounded-lg mb-4">
              <Recycle size={32} className="text-white dark:text-gray-900" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">EcoFIng</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sistema de Gestión de RAEE
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
              Facultad de Ingeniería · UdelaR
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="usuario@fing.edu.uy"
                required
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-md px-3 py-2.5 animate-fade-in">
                <p className="text-xs text-red-700 dark:text-red-400 font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-semibold rounded-md py-2.5 text-sm transition-colors shadow-enterprise-sm"
            >
              Ingresar al sistema
            </button>
          </form>

          {/* Perfiles de prueba - Auto-login (estilo table) */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-3 uppercase tracking-wide">
              Acceso rápido · MVP
            </p>
            <div className="space-y-1">
              {PERFILES_PRUEBA.map((perfil) => {
                const Icon = perfil.icon
                return (
                  <button
                    key={perfil.email}
                    onClick={() => handleAutoLogin(perfil)}
                    className="enterprise-table-row w-full flex items-center gap-3 px-3 py-2.5 rounded-md group"
                  >
                    <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-gray-600 dark:text-gray-400" strokeWidth={2} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {perfil.nombre}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {perfil.email}
                      </p>
                    </div>
                    <ChevronRight size={14} className="text-gray-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Acceso a vista pública */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={() => navigate('/trazabilidad')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors group"
            >
              <Globe size={16} className="text-gray-600 dark:text-gray-400" strokeWidth={2} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Ver Registro Público
              </span>
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-2">
              Consultar trazabilidad de todos los lotes sin login
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
