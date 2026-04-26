import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'

import LoginPage          from './portals/auth/LoginPage'
import InstitutoDashboard from './portals/instituto/Dashboard'
import EcopuntoDashboard  from './portals/ecopunto/Dashboard'
import GestoraDashboard   from './portals/gestora/Dashboard'
import AdminDashboard     from './portals/admin/Dashboard'
import Trazabilidad       from './portals/publico/Trazabilidad'

// Ruta protegida: redirige a login si no hay usuario logueado
function PrivateRoute({ children, rolesPermitidos }) {
  const { state } = useApp()
  const usuario = state.usuarioActual

  if (!usuario) return <Navigate to="/login" replace />
  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Layout con header para portales autenticados
function LayoutAutenticado({ children }) {
  const { state, dispatch } = useApp()
  const usuario = state.usuarioActual

  const ETIQUETAS_ROL = {
    admin:     '⚙️ Administrador',
    instituto: '🏛️ Instituto',
    ecopunto:  '♻️ Ecopunto',
    gestora:   '🏭 Gestora',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">♻️</span>
          <span className="font-bold text-gray-800">EcoFIng</span>
          <span className="text-xs text-gray-400 hidden sm:inline">— Sistema de Gestión de RAEE</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {ETIQUETAS_ROL[usuario?.rol]} · {usuario?.nombre}
          </span>
          <button
            onClick={() => dispatch({ type: 'LOGOUT' })}
            className="text-xs text-red-500 hover:text-red-700 border border-red-200 rounded px-2 py-1 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      {/* Pública — sin login */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/trazabilidad" element={<Trazabilidad />} />

      {/* Instituto */}
      <Route path="/instituto/*" element={
        <PrivateRoute rolesPermitidos={['instituto']}>
          <LayoutAutenticado><InstitutoDashboard /></LayoutAutenticado>
        </PrivateRoute>
      } />

      {/* Ecopunto */}
      <Route path="/ecopunto/*" element={
        <PrivateRoute rolesPermitidos={['ecopunto']}>
          <LayoutAutenticado><EcopuntoDashboard /></LayoutAutenticado>
        </PrivateRoute>
      } />

      {/* Gestora */}
      <Route path="/gestora/*" element={
        <PrivateRoute rolesPermitidos={['gestora']}>
          <LayoutAutenticado><GestoraDashboard /></LayoutAutenticado>
        </PrivateRoute>
      } />

      {/* Admin */}
      <Route path="/admin/*" element={
        <PrivateRoute rolesPermitidos={['admin']}>
          <LayoutAutenticado><AdminDashboard /></LayoutAutenticado>
        </PrivateRoute>
      } />

      {/* Raíz → login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}
