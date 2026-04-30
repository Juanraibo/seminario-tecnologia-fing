/**
 * TopBar - Barra superior minimalista
 * Breadcrumb, toggle sidebar, dark mode, trazabilidad y logout
 */

import { useLocation, Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useDarkMode } from '../../hooks/useDarkMode'
import {
  Menu,
  Sun,
  Moon,
  Globe,
  LogOut,
  ChevronRight,
} from '../atoms/Icon'

// Mapeo de segmentos de ruta a etiquetas legibles
const PATH_LABELS = {
  instituto: 'Instituto',
  ecopunto: 'Ecopunto',
  gestora: 'Gestora',
  admin: 'Admin',
  'nueva-solicitud': 'Nueva Solicitud',
  publicar: 'Publicar Lotes',
  solicitudes: 'Mis Solicitudes',
  actores: 'Gestionar Actores',
  retiros: 'Aprobación Retiros',
  trazabilidad: 'Trazabilidad',
}

export default function TopBar({ onToggleSidebar }) {
  const { dispatch } = useApp()
  const location = useLocation()
  const [darkMode, toggleDarkMode] = useDarkMode()

  // Construir breadcrumbs desde la ruta actual
  const pathSegments = location.pathname.split('/').filter(Boolean)

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/')
    const isLast = index === pathSegments.length - 1
    const label =
      PATH_LABELS[segment] ||
      // Si el segmento parece un ID (LOT-xxx o ITM-xxx), mostrar "Detalle"
      (segment.match(/^(LOT|ITM)-/i) ? 'Detalle' : segment.charAt(0).toUpperCase() + segment.slice(1))

    return { label, href, isLast }
  })

  return (
    <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 px-4 lg:px-6 flex items-center justify-between shrink-0 transition-colors">
      {/* Lado izquierdo: hamburger + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Botón hamburger para mobile/tablet */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
          aria-label="Abrir menú de navegación"
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm min-w-0" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.href} className="flex items-center gap-1.5 min-w-0">
              {index > 0 && (
                <ChevronRight size={14} className="text-gray-400 dark:text-gray-500 shrink-0" />
              )}
              {crumb.isLast ? (
                <span className="font-medium text-gray-900 dark:text-gray-100 truncate" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.href}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors truncate"
                >
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Lado derecho: acciones */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Trazabilidad pública */}
        <Link
          to="/trazabilidad"
          className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-1.5 transition-colors"
          title="Ver registro público de trazabilidad"
        >
          <Globe size={14} />
          <span className="hidden sm:inline">Trazabilidad</span>
        </Link>

        {/* Toggle dark mode */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
          title={darkMode ? 'Modo claro' : 'Modo oscuro'}
          aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Cerrar sesión */}
        <button
          onClick={() => dispatch({ type: 'LOGOUT' })}
          className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border border-red-200 dark:border-red-800 rounded-lg px-3 py-1.5 transition-colors"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  )
}
