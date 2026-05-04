/**
 * Sidebar - Navegación lateral Enterprise
 * Estilo Notion/Linear: limpio, funcional, con shortcuts visibles
 */

import { NavLink } from 'react-router-dom'
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

// Configuración de navegación por rol con shortcuts
const NAV_ITEMS = {
  instituto: [
    { to: '/instituto', icon: LayoutDashboard, label: 'Dashboard', shortcut: '⌘D' },
    { to: '/instituto/nueva-solicitud', icon: PlusCircle, label: 'Nueva Solicitud', shortcut: '⌘N' },
  ],
  ecopunto: [
    { to: '/ecopunto', icon: LayoutDashboard, label: 'Dashboard', shortcut: '⌘D' },
    { to: '/ecopunto/publicar', icon: Package, label: 'Publicar Lotes', shortcut: '⌘P' },
  ],
  gestora: [
    { to: '/gestora', icon: LayoutDashboard, label: 'Dashboard', shortcut: '⌘D' },
    { to: '/gestora/solicitudes', icon: FileText, label: 'Mis Solicitudes', shortcut: '⌘S' },
  ],
  admin: [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', shortcut: '⌘D' },
    { to: '/admin/actores', icon: Users, label: 'Gestionar Actores', shortcut: '⌘U' },
    { to: '/admin/retiros', icon: CheckCircle, label: 'Aprobación Retiros', shortcut: '⌘R' },
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
  const items = NAV_ITEMS[usuario?.rol] || []

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-60 bg-gray-50 dark:bg-gray-950
          border-r border-gray-200 dark:border-gray-800
          flex flex-col
          transition-transform duration-200
          shadow-enterprise-lg
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <Recycle size={20} className="text-primary-600 dark:text-primary-500" strokeWidth={2.5} />
            <span className="font-semibold text-base text-gray-900 dark:text-white">
              EcoFIng
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-500"
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {items.map((item) => {
            const IconComp = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to.endsWith('/instituto') || item.to.endsWith('/ecopunto') || item.to.endsWith('/gestora') || item.to.endsWith('/admin')}
                onClick={() => {
                  // Solo cerrar en mobile (< lg breakpoint)
                  if (window.innerWidth < 1024) {
                    onClose()
                  }
                }}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
              >
                <IconComp size={16} strokeWidth={2} />
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <span className="hidden lg:inline-block ml-auto text-xs text-gray-400 dark:text-gray-500">
                    {item.shortcut}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Usuario y cierre de sesión */}
        {usuario && (
          <div className="mt-auto p-3 border-t border-gray-200 dark:border-gray-800 shrink-0">
            <div className="flex items-center gap-2.5 mb-2 px-2 py-1.5">
              <div className="w-7 h-7 rounded bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 text-xs font-semibold shrink-0">
                {usuario.nombre?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                  {usuario.nombre}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {ETIQUETAS_ROL[usuario.rol] || usuario.rol}
                </p>
              </div>
            </div>
            <button
              onClick={() => dispatch({ type: 'LOGOUT' })}
              className="flex items-center gap-2 w-full px-2 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors font-medium"
              aria-label="Cerrar sesión"
            >
              <LogOut size={14} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
