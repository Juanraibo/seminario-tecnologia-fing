/**
 * TopBar - Barra superior Enterprise
 * Estilo minimalista, funcional, sin efectos decorativos
 */

import { useLocation, Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useDarkMode } from '../../hooks/useDarkMode'
import {
  Menu,
  Sun,
  Moon,
  Globe,
  Calculator,
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
      (segment.match(/^(LOT|ITM)-/i) ? 'Detalle' : segment.charAt(0).toUpperCase() + segment.slice(1))

    return { label, href, isLast }
  })

  return (
    <header className="h-14 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-3 lg:px-4 flex items-center justify-between shrink-0 transition-colors">
      {/* Lado izquierdo: hamburger + breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Botón hamburger */}
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-gray-600 dark:text-gray-400"
          aria-label="Abrir menú de navegación"
        >
          <Menu size={18} />
        </button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs min-w-0" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.href} className="flex items-center gap-1 min-w-0">
              {index > 0 && (
                <ChevronRight size={12} className="text-gray-400 shrink-0" />
              )}
              {crumb.isLast ? (
                <span className="font-semibold text-gray-900 dark:text-gray-100 truncate" aria-current="page">
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
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Trazabilidad pública */}
        <Link
          to="/trazabilidad"
          className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded px-2.5 py-1.5 transition-colors"
          title="Ver registro público de trazabilidad"
        >
          <Globe size={14} />
          <span className="hidden sm:inline">Trazabilidad</span>
        </Link>

        {/* Calculadora de impacto */}
        <Link
          to="/calculadora"
          className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded px-2.5 py-1.5 transition-colors"
          title="Calculadora de impacto ambiental"
        >
          <Calculator size={14} />
          <span className="hidden sm:inline">Calculadora</span>
        </Link>

        {/* Toggle dark mode */}
        <button
          onClick={toggleDarkMode}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-gray-600 dark:text-gray-400"
          title={darkMode ? 'Modo claro' : 'Modo oscuro'}
          aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Cerrar sesión */}
        <button
          onClick={() => dispatch({ type: 'LOGOUT' })}
          className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded px-2.5 py-1.5 transition-colors"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  )
}
