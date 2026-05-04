/**
 * NotFound - Página 404 Enterprise
 * Diseño limpio con opciones de navegación
 */

import { useNavigate } from 'react-router-dom'
import { Home, Search, ArrowLeft, PackageX } from '../components/atoms/Icon'
import Button from '../components/atoms/Button'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Ilustración 404 */}
        <div className="mb-8 relative">
          <div className="text-[140px] font-bold text-gray-200 dark:text-gray-800 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <PackageX size={40} className="text-gray-400 dark:text-gray-600" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Mensaje */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Página no encontrada
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          La página que buscás no existe o fue movida a otra ubicación.
        </p>

        {/* Acciones */}
        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon={<Home size={18} />}
            onClick={() => navigate('/')}
          >
            Volver al inicio
          </Button>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            icon={<ArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            Regresar
          </Button>
          <Button
            variant="ghost"
            size="lg"
            fullWidth
            icon={<Search size={18} />}
            onClick={() => navigate('/trazabilidad')}
          >
            Ver Registro Público
          </Button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-8">
          EcoFIng · Sistema de Gestión de RAEE
        </p>
      </div>
    </div>
  )
}
