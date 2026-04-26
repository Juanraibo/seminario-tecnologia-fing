import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export default function LoginPage() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <span className="text-3xl">♻️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">EcoFIng</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sistema de Gestión de RAEE — Facultad de Ingeniería, UdelaR
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="usuario@fing.edu.uy"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
          >
            Ingresar
          </button>
        </form>

        {/* Usuarios de prueba */}
        <div className="mt-6 border-t pt-4">
          <p className="text-xs text-gray-500 font-medium mb-2">Usuarios de prueba (MVP):</p>
          <div className="space-y-1 text-xs text-gray-500">
            <p>👤 admin@fing.edu.uy / admin123</p>
            <p>🏛️ inco@fing.edu.uy / inco123</p>
            <p>♻️ ecopunto@fing.edu.uy / eco123</p>
            <p>🏭 gestora1@reciclauY.com / gest123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
