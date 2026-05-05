import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import PrivateRoute from './components/layout/PrivateRoute'
import LayoutAutenticado from './components/layout/LayoutAutenticado'
import ToastContainer from './components/organisms/ToastContainer'
import ErrorBoundary from './components/layout/ErrorBoundary'

// Inicializa dark mode desde localStorage AL INICIAR la app
// (no solo cuando se monta LayoutAutenticado, para que funcione en login y trazabilidad)
function DarkModeInitializer() {
  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    const isDark = saved !== null ? saved === 'true' : true
    document.documentElement.classList.toggle('dark', isDark)
  }, [])
  return null
}

import LoginPage              from './portals/auth/LoginPage'
import NotFound               from './portals/NotFound'
import InstitutoDashboard     from './portals/instituto/Dashboard'
import InstitutoNueva         from './portals/instituto/NuevaSolicitud'
import InstitutoDetalle       from './portals/instituto/DetalleLote'
import EcopuntoDashboard      from './portals/ecopunto/Dashboard'
import EcopuntoClasificar     from './portals/ecopunto/ClasificarLote'
import EcopuntoPublicar       from './portals/ecopunto/PublicarLotes'
import GestoraDashboard       from './portals/gestora/Dashboard'
import GestoraDetalleLote     from './portals/gestora/DetalleLote'
import GestoraMisSolicitudes  from './portals/gestora/MisSolicitudes'
import AdminDashboard         from './portals/admin/Dashboard'
import AdminGestionActores    from './portals/admin/GestionActores'
import AdminAprobacionRetiros from './portals/admin/AprobacionRetiros'
import Trazabilidad           from './portals/publico/Trazabilidad'
import CalculadoraPage        from './portals/publico/CalculadoraPage'

function AppRoutes() {
  const { state } = useApp()

  // Mostrar loading mientras carga datos de Supabase
  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Cargando EcoFIng...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Conectando con la base de datos</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Pública — sin login */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/trazabilidad" element={<Trazabilidad />} />
      <Route path="/calculadora" element={<CalculadoraPage />} />

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
      <Route path="/gestora" element={
        <PrivateRoute rolesPermitidos={['gestora']}>
          <LayoutAutenticado><GestoraDashboard /></LayoutAutenticado>
        </PrivateRoute>
      } />
      <Route path="/gestora/lote/:id" element={
        <PrivateRoute rolesPermitidos={['gestora']}>
          <LayoutAutenticado><GestoraDetalleLote /></LayoutAutenticado>
        </PrivateRoute>
      } />
      <Route path="/gestora/solicitudes" element={
        <PrivateRoute rolesPermitidos={['gestora']}>
          <LayoutAutenticado><GestoraMisSolicitudes /></LayoutAutenticado>
        </PrivateRoute>
      } />

      {/* Admin */}
      <Route path="/admin" element={
        <PrivateRoute rolesPermitidos={['admin']}>
          <LayoutAutenticado><AdminDashboard /></LayoutAutenticado>
        </PrivateRoute>
      } />
      <Route path="/admin/actores" element={
        <PrivateRoute rolesPermitidos={['admin']}>
          <LayoutAutenticado><AdminGestionActores /></LayoutAutenticado>
        </PrivateRoute>
      } />
      <Route path="/admin/retiros" element={
        <PrivateRoute rolesPermitidos={['admin']}>
          <LayoutAutenticado><AdminAprobacionRetiros /></LayoutAutenticado>
        </PrivateRoute>
      } />

      {/* Raíz → login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 404 - Página no encontrada */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <DarkModeInitializer />
          <ToastContainer />
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  )
}
