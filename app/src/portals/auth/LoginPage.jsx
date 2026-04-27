import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Recycle, Building2, Factory, Shield, Globe } from '../../components/atoms/Icon'

export default function LoginPage() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Activar dark mode por defecto
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
      color: 'text-red-400',
    },
    {
      nombre: 'Instituto',
      email: 'inco@fing.edu.uy',
      password: 'inco123',
      icon: Building2,
      color: 'text-blue-400',
    },
    {
      nombre: 'Ecopunto',
      email: 'ecopunto@fing.edu.uy',
      password: 'eco123',
      icon: Recycle,
      color: 'text-green-400',
    },
    {
      nombre: 'Gestora',
      email: 'gestora1@reciclauY.com',
      password: 'gest123',
      icon: Factory,
      color: 'text-purple-400',
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
    setEmail(perfil.email)
    setPassword(perfil.password)
    setError('')

    // Login automático después de un pequeño delay para feedback visual
    setTimeout(() => {
      const usuario = state.usuarios.find(
        u => u.email === perfil.email && u.password === perfil.password
      )
      if (usuario) {
        dispatch({ type: 'LOGIN', payload: usuario })
        navigate(RUTAS_POR_ROL[usuario.rol])
      }
    }, 300)
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Gradiente de fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 via-transparent to-secondary-500/10"></div>
      </div>

      {/* Efectos de fondo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl"></div>

      {/* Card principal */}
      <div className="relative w-full max-w-md animate-slide-up">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800/50 p-8">

          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4 shadow-glow-primary">
              <Recycle size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">EcoFIng</h1>
            <p className="text-sm text-gray-400">
              Sistema de Gestión de RAEE
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Facultad de Ingeniería · UdelaR
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="usuario@fing.edu.uy"
                required
                className="w-full bg-gray-950/50 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-gray-950/50 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl px-4 py-3 animate-fade-in">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl py-3 text-sm transition-all shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5"
            >
              Ingresar al sistema
            </button>
          </form>

          {/* Perfiles de prueba - Auto-login */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-400 font-medium mb-3 text-center">
              Acceso rápido · MVP
            </p>
            <div className="grid grid-cols-2 gap-2">
              {PERFILES_PRUEBA.map((perfil) => {
                const Icon = perfil.icon
                return (
                  <button
                    key={perfil.email}
                    onClick={() => handleAutoLogin(perfil)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-800/30 hover:bg-gray-800/60 border border-gray-700/50 hover:border-gray-600 transition-all group"
                  >
                    <Icon size={20} className={`${perfil.color} group-hover:scale-110 transition-transform`} />
                    <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
                      {perfil.nombre}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Acceso a vista pública */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <button
              onClick={() => navigate('/trazabilidad?lote=PUB-2026-001')}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/30 hover:border-blue-500/50 transition-all group"
            >
              <Globe size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-blue-300 group-hover:text-blue-200">
                Ver Trazabilidad Pública
              </span>
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Consultar seguimiento de lotes sin login
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
