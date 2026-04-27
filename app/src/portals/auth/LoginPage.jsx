import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Recycle, Building2, Factory, Shield } from '../../components/atoms/Icon'

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

          {/* Usuarios de prueba */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-400 font-medium mb-3 text-center">
              Usuarios de prueba · MVP
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-gray-800/50">
                <Shield size={14} className="text-red-400" />
                <span className="font-mono">admin@fing.edu.uy / admin123</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-gray-800/50">
                <Building2 size={14} className="text-blue-400" />
                <span className="font-mono">inco@fing.edu.uy / inco123</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-gray-800/50">
                <Recycle size={14} className="text-green-400" />
                <span className="font-mono">ecopunto@fing.edu.uy / eco123</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-gray-800/50">
                <Factory size={14} className="text-purple-400" />
                <span className="font-mono">gestora1@reciclauY.com / gest123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
