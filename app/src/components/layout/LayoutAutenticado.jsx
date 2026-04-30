/**
 * LayoutAutenticado - Layout principal para usuarios autenticados
 * Sidebar + TopBar + contenido principal
 */

import { useSidebar } from '../../hooks/useSidebar'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function LayoutAutenticado({ children }) {
  const { isOpen, toggle, close } = useSidebar()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <Sidebar isOpen={isOpen} onClose={close} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onToggleSidebar={toggle} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto animate-fade-in-up">
          {children}
        </main>
      </div>
    </div>
  )
}
