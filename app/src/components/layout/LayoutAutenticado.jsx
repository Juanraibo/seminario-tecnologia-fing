import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useDarkMode } from '../../hooks/useDarkMode'
import { Recycle, Sun, Moon, Settings, Building2, Factory, LogOut, Globe } from '../atoms/Icon'

export default function LayoutAutenticado({ children }) {
  const { state, dispatch } = useApp()
  const usuario = state.usuarioActual
  const [darkMode, toggleDarkMode] = useDarkMode()

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
          <Link
            to="/trazabilidad"
            className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-800 rounded px-3 py-1.5 transition-colors"
            title="Ver registro público de trazabilidad"
          >
            <Globe size={14} />
            <span className="hidden sm:inline">Trazabilidad</span>
          </Link>
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
