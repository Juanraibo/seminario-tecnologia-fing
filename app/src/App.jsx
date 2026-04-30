import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import PrivateRoute from './components/layout/PrivateRoute'
import LayoutAutenticado from './components/layout/LayoutAutenticado'
import ToastContainer from './components/organisms/ToastContainer'

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
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <DarkModeInitializer />
        <ToastContainer />
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}
