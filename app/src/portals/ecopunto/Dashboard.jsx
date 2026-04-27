import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import DataTable from '../../components/organisms/DataTable'
import StatusBadge from '../../components/molecules/StatusBadge'
import Button from '../../components/atoms/Button'
import { Package, CheckCircle, Clock, FileCheck, Upload } from '../../components/atoms/Icon'
import { ESTADOS_LOTE } from '../../constants/estados'

export default function EcopuntoDashboard() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()

  // Filtrar solo lotes de entrada (del instituto)
  const lotesEntrada = state.lotes.filter(l => l.tipo === 'entrada')

  // Lotes en diferentes estados
  const lotesPendientes = lotesEntrada.filter(l => l.estado === ESTADOS_LOTE.PENDIENTE_ENVIO)
  const lotesRecibidos = lotesEntrada.filter(l => l.estado === ESTADOS_LOTE.EN_ECOPUNTO)
  const lotesClasificados = lotesEntrada.filter(l => l.estado === ESTADOS_LOTE.CLASIFICADO)

  // Ítems sin asignar a lote de publicación
  const itemsSinPublicar = state.items.filter(i => i.lotePublicadoId === null)

  // Handler para marcar como recibido
  const marcarComoRecibido = (lote) => {
    dispatch({
      type: 'ACTUALIZAR_LOTE',
      payload: {
        id: lote.id,
        estado: ESTADOS_LOTE.EN_ECOPUNTO,
        fecha_recepcion_ecopunto: new Date().toISOString().split('T')[0]
      }
    })
  }

  // Columnas para tabla de pendientes
  const columnasPendientes = [
    {
      header: 'Instituto',
      key: 'institutoId',
      render: (row) => {
        const instituto = state.institutos.find(i => i.id === row.institutoId)
        return <span className="font-medium text-gray-100">{instituto?.nombre || row.institutoId}</span>
      }
    },
    {
      header: 'ID Lote',
      key: 'id',
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-primary-400">
          {row.id}
        </span>
      )
    },
    {
      header: 'Tamaño',
      key: 'tamano',
      render: (row) => (
        <span className="capitalize text-gray-300">
          {row.tamano}
        </span>
      )
    },
    {
      header: 'Fecha Solicitud',
      key: 'fecha_solicitud',
      render: (row) => (
        <span className="text-gray-400 text-sm">
          {new Date(row.fecha_solicitud).toLocaleDateString('es-UY')}
        </span>
      )
    },
    {
      header: 'Acción',
      key: 'accion',
      align: 'right',
      render: (row) => (
        <Button
          variant="primary"
          size="sm"
          icon={<CheckCircle size={14} />}
          onClick={(e) => {
            e.stopPropagation()
            marcarComoRecibido(row)
          }}
        >
          Marcar Recibido
        </Button>
      )
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradiente de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 via-transparent to-secondary-500/5"></div>
      </div>

      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Portal Ecopunto
            </h1>
            <p className="text-gray-400">
              Recepción, clasificación y publicación de lotes RAEE
            </p>
          </div>
          {itemsSinPublicar.length > 0 && (
            <Button
              variant="accent"
              icon={<Upload size={18} />}
              onClick={() => navigate('/ecopunto/publicar')}
            >
              Publicar Productos ({itemsSinPublicar.length})
            </Button>
          )}
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">
                  Por recibir
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {lotesPendientes.length}
                </p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <Clock size={24} className="text-amber-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">
                  Para clasificar
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {lotesRecibidos.length}
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Package size={24} className="text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">
                  Lotes clasificados
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {lotesClasificados.length}
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-xl">
                <FileCheck size={24} className="text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">
                  Productos sin publicar
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {itemsSinPublicar.length}
                </p>
              </div>
              <div className="p-3 bg-accent-500/10 rounded-xl">
                <Upload size={24} className="text-accent-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Bandeja de entrada */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Bandeja de Entrada
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {lotesPendientes.length} lote(s) pendiente(s) de recepción
              </p>
            </div>
          </div>

          {lotesPendientes.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-gray-800/50">
              <DataTable
                columns={columnasPendientes}
                data={lotesPendientes}
                emptyMessage="No hay lotes pendientes de recepción"
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/50 rounded-full mb-4">
                <CheckCircle size={32} className="text-green-400" />
              </div>
              <p className="text-gray-400 text-sm">
                ¡Todo al día! No hay lotes pendientes de recepción.
              </p>
            </div>
          )}
        </div>

        {/* Lotes para clasificar */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Lotes para Clasificar
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {lotesRecibidos.length} lote(s) en estado "En Ecopunto"
              </p>
            </div>
          </div>

          {lotesRecibidos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lotesRecibidos.map(lote => {
                const instituto = state.institutos.find(i => i.id === lote.institutoId)
                const itemsClasificados = state.items.filter(i => i.loteOrigenId === lote.id).length

                return (
                  <div
                    key={lote.id}
                    onClick={() => navigate(`/ecopunto/clasificar/${lote.id}`)}
                    className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 hover:bg-gray-800/50 hover:border-gray-600/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="font-mono text-xs font-semibold text-primary-400">
                        {lote.id}
                      </span>
                      <StatusBadge estado={lote.estado} size="sm" />
                    </div>
                    <p className="text-white font-medium mb-1">{instituto?.nombre}</p>
                    <p className="text-sm text-gray-400 capitalize mb-2">Tamaño: {lote.tamano}</p>
                    {itemsClasificados > 0 && (
                      <p className="text-xs text-accent-400 mb-2">
                        {itemsClasificados} producto(s) clasificado(s)
                      </p>
                    )}
                    <div className="mt-4 pt-4 border-t border-gray-700/50">
                      <Button
                        variant="ghost"
                        size="sm"
                        fullWidth
                        className="group-hover:bg-primary-500/10 group-hover:text-primary-400 group-hover:border-primary-500/50"
                      >
                        Clasificar Productos
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/50 rounded-full mb-4">
                <Package size={32} className="text-gray-600" />
              </div>
              <p className="text-gray-400 text-sm">
                No hay lotes pendientes de clasificación
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
