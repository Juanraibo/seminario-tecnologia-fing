import { useSearchParams } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export default function Trazabilidad() {
  const [params] = useSearchParams()
  const { state } = useApp()
  const id = params.get('lote')
  const lote = state.lotes.find(l => l.id === id)

  if (!id) return <div className="p-6 text-gray-500">No se especificó un lote.</div>
  if (!lote) return (
    <div className="p-6 text-center">
      <p className="text-gray-500">No encontramos información para este código.</p>
      <p className="text-sm text-gray-400 mt-1">Verificá que el QR esté en buen estado.</p>
    </div>
  )

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <span className="text-4xl">♻️</span>
        <h1 className="text-xl font-bold text-gray-800 mt-2">Trazabilidad del Lote</h1>
        <p className="text-sm text-gray-500">{lote.id}</p>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
        🚧 <strong>Vista pública — En desarrollo (HU-P01)</strong><br />
        Lote encontrado: <strong>{lote.id}</strong> — Estado: <strong>{lote.estado}</strong>
      </div>
    </div>
  )
}
