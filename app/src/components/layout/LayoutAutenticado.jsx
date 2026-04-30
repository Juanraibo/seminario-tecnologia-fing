/**
 * LayoutAutenticado - Layout principal para usuarios autenticados
 * Sidebar + TopBar + contenido principal
 */

import { useLocation } from 'react-router-dom'
import { useSidebar } from '../../hooks/useSidebar'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function LayoutAutenticado({ children }) {
  const { isOpen, toggle, close } = useSidebar()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <Sidebar isOpen={isOpen} onClose={close} />
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isOpen ? 'lg:ml-60' : 'lg:ml-0'}`}>
        <TopBar onToggleSidebar={toggle} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto page-transition-enter" key={location.pathname}>
          {children}
        </main>
      </div>
    </div>
  )
}
