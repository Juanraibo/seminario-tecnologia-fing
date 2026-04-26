import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export default function InstitutoDashboard() {
  const { state } = useApp()
  const navigate = useNavigate()
  const usuario = state.usuarioActual
  const lotes = state.lotes.filter(l => l.institutoId === usuario?.institutoId)

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-gray-800 mb-1">
        Portal Instituto — {usuario?.nombre}
      </h1>
      <p className="text-sm text-gray-500 mb-6">Mis solicitudes de retiro</p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
        🚧 <strong>En desarrollo — Sprint 1</strong>: Este portal se construye en la Sesión 4.
        Hay {lotes.length} lote(s) registrados para este instituto en los datos mock.
      </div>
    </div>
  )
}
