/**
 * PublicNav - Navbar para páginas públicas (sin autenticación)
 * Enterprise design con logo, navegación y dark mode toggle
 */

import { useNavigate } from 'react-router-dom'
import { Recycle, Sun, Moon, LogIn } from '../atoms/Icon'
import Button from '../atoms/Button'
import { useEffect, useState } from 'react'

export default function PublicNav() {
  const navigate = useNavigate()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Detectar dark mode al montar
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
    setIsDark(!isDark)
  }

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate('/trazabilidad')}
          className="flex items-center gap-2 group"
        >
          <div className="w-9 h-9 bg-primary-600 dark:bg-primary-500 rounded-lg flex items-center justify-center group-hover:bg-primary-700 dark:group-hover:bg-primary-400 transition-colors">
            <Recycle size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-gray-900 dark:text-white">EcoFIng</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Trazabilidad RAEE</p>
          </div>
        </button>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          {/* Toggle dark mode */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            aria-label="Cambiar modo de color"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Botón iniciar sesión */}
          <Button
            variant="primary"
            size="sm"
            icon={<LogIn size={16} />}
            onClick={() => navigate('/')}
          >
            <span className="hidden sm:inline">Iniciar Sesión</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}
