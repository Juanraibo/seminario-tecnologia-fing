import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { Recycle, Sun, Moon, Settings, Building2, Factory, LogOut } from './components/atoms/Icon'

import LoginPage              from './portals/auth/LoginPage'
import InstitutoDashboard     from './portals/instituto/Dashboard'
import InstitutoNueva         from './portals/instituto/NuevaSolicitud'
import InstitutoDetalle       from './portals/instituto/DetalleLote'
import EcopuntoDashboard      from './portals/ecopunto/Dashboard'
import EcopuntoClasificar     from './portals/ecopunto/ClasificarLote'
import EcopuntoPublicar       from './portals/ecopunto/PublicarLotes'
import GestoraDashboard       from './portals/gestora/Dashboard'
import AdminDashboard         from './portals/admin/Dashboard'
import Trazabilidad           from './portals/publico/Trazabilidad'

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
  const [darkMode, setDarkMode] = useState(true)

  const ETIQUETAS_ROL = {
    admin:     'Administrador',
    instituto: 'Instituto',
    ecopunto:  'Ecopunto',
    gestora:   'Gestora',
  }

  const ICONOS_ROL = {
    admin:     <Settings size={16} />,
    instituto: <Building2 size={16} />,
    ecopunto:  <Recycle size={16} />,
    gestora:   <Factory size={16} />,
  }

  // Aplicar dark mode por defecto al montar
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-3 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Recycle size={24} className="text-primary-500" />
            <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">EcoFIng</span>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
            Sistema de Gestión de RAEE
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-300 hidden md:flex items-center gap-2">
            {ICONOS_ROL[usuario?.rol]}
            <span>{ETIQUETAS_ROL[usuario?.rol]} · {usuario?.nombre}</span>
          </span>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={darkMode ? 'Modo claro' : 'Modo oscuro'}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => dispatch({ type: 'LOGOUT' })}
            className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border border-red-200 dark:border-red-800 rounded px-3 py-1.5 transition-colors"
          >
            <LogOut size={14} />
            <span>Salir</span>
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
      <Route path="/instituto" element={
        <PrivateRoute rolesPermitidos={['instituto']}>
          <LayoutAutenticado><InstitutoDashboard /></LayoutAutenticado>
        </PrivateRoute>
      } />
      <Route path="/instituto/nueva-solicitud" element={
        <PrivateRoute rolesPermitidos={['instituto']}>
          <LayoutAutenticado><InstitutoNueva /></LayoutAutenticado>
        </PrivateRoute>
      } />
      <Route path="/instituto/lote/:loteId" element={
        <PrivateRoute rolesPermitidos={['instituto']}>
          <LayoutAutenticado><InstitutoDetalle /></LayoutAutenticado>
        </PrivateRoute>
      } />

      {/* Ecopunto */}
      <Route path="/ecopunto" element={
        <PrivateRoute rolesPermitidos={['ecopunto']}>
          <LayoutAutenticado><EcopuntoDashboard /></LayoutAutenticado>
        </PrivateRoute>
      } />
      <Route path="/ecopunto/clasificar/:loteId" element={
        <PrivateRoute rolesPermitidos={['ecopunto']}>
          <LayoutAutenticado><EcopuntoClasificar /></LayoutAutenticado>
        </PrivateRoute>
      } />
      <Route path="/ecopunto/publicar" element={
        <PrivateRoute rolesPermitidos={['ecopunto']}>
          <LayoutAutenticado><EcopuntoPublicar /></LayoutAutenticado>
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
