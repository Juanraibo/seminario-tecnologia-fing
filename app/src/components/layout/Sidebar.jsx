/**
 * Sidebar - Navegación lateral principal
 * Fijo 240px en desktop, overlay en mobile
 * Recibe isOpen y onClose desde LayoutAutenticado (useSidebar hook)
 */

import { NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import {
  Recycle,
  LayoutDashboard,
  PlusCircle,
  Package,
  Users,
  CheckCircle,
  FileText,
  LogOut,
  X,
} from '../atoms/Icon'

// Configuración de navegación por rol
const NAV_ITEMS = {
  instituto: [
    { to: '/instituto', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/instituto/nueva-solicitud', icon: PlusCircle, label: 'Nueva Solicitud' },
  ],
  ecopunto: [
    { to: '/ecopunto', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/ecopunto/publicar', icon: Package, label: 'Publicar Lotes' },
  ],
  gestora: [
    { to: '/gestora', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/gestora/solicitudes', icon: FileText, label: 'Mis Solicitudes' },
  ],
  admin: [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/actores', icon: Users, label: 'Gestionar Actores' },
    { to: '/admin/retiros', icon: CheckCircle, label: 'Aprobación Retiros' },
  ],
}

// Etiquetas legibles para cada rol
const ETIQUETAS_ROL = {
  admin: 'Administrador',
  instituto: 'Instituto',
  ecopunto: 'Ecopunto',
  gestora: 'Gestora',
}

export default function Sidebar({ isOpen, onClose }) {
  const { state, dispatch } = useApp()
  const usuario = state.usuarioActual
  const location = useLocation()
  const items = NAV_ITEMS[usuario?.rol] || []

  return (
    <>
      {/* Overlay para mobile cuando el sidebar está abierto */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-60 bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <Recycle size={24} className="text-primary-500" />
            <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">
              EcoFIng
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const IconComp = item.icon
            const isActive = location.pathname === item.to

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <IconComp size={18} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Información del usuario y cierre de sesión */}
        {usuario && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 shrink-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                {usuario.nombre?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {usuario.nombre}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {ETIQUETAS_ROL[usuario.rol] || usuario.rol}
                </p>
              </div>
            </div>
            <button
              onClick={() => dispatch({ type: 'LOGOUT' })}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              aria-label="Cerrar sesión"
            >
              <LogOut size={16} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
