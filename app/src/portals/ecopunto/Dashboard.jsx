import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import PageHeader from '../../components/layout/PageHeader'
import Card, { StatCard } from '../../components/molecules/Card'
import DataTable from '../../components/organisms/DataTable'
import Button from '../../components/atoms/Button'
import StatusBadge from '../../components/molecules/StatusBadge'
import { formatDate } from '../../utils/formatDate'
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
        return (
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {instituto?.nombre || row.institutoId}
          </span>
        )
      }
    },
    {
      header: 'ID Lote',
      key: 'id',
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-primary-600 dark:text-primary-400">
          {row.id}
        </span>
      )
    },
    {
      header: 'Tamaño',
      key: 'tamano',
      render: (row) => (
        <span className="capitalize text-gray-500 dark:text-gray-400">
          {row.tamano}
        </span>
      )
    },
    {
      header: 'Fecha Solicitud',
      key: 'fecha_solicitud',
      render: (row) => (
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          {formatDate(row.fecha_solicitud)}
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
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Portal Ecopunto"
        description="Recepción, clasificación y publicación de lotes RAEE"
        actions={
          itemsSinPublicar.length > 0 && (
            <Button
              variant="accent"
              icon={<Upload size={18} />}
              onClick={() => navigate('/ecopunto/publicar')}
            >
              Publicar Productos ({itemsSinPublicar.length})
            </Button>
          )
        }
      />

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<Clock size={24} />}
          label="Por recibir"
          value={lotesPendientes.length}
        />
        <StatCard
          icon={<Package size={24} />}
          label="Para clasificar"
          value={lotesRecibidos.length}
        />
        <StatCard
          icon={<FileCheck size={24} />}
          label="Lotes clasificados"
          value={lotesClasificados.length}
        />
        <StatCard
          icon={<Upload size={24} />}
          label="Productos sin publicar"
          value={itemsSinPublicar.length}
        />
      </div>

      {/* Bandeja de entrada */}
      <Card
        title="Bandeja de Entrada"
        subtitle={`${lotesPendientes.length} lote(s) pendiente(s) de recepción`}
      >
        {lotesPendientes.length > 0 ? (
          <DataTable
            columns={columnasPendientes}
            data={lotesPendientes}
            emptyMessage="No hay lotes pendientes de recepción"
          />
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800/50 rounded-full mb-4">
              <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              ¡Todo al día! No hay lotes pendientes de recepción.
            </p>
          </div>
        )}
      </Card>

      {/* Lotes para clasificar */}
      <Card
        title="Lotes para Clasificar"
        subtitle={`${lotesRecibidos.length} lote(s) en estado "En Ecopunto"`}
      >
        {lotesRecibidos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lotesRecibidos.map(lote => {
              const instituto = state.institutos.find(i => i.id === lote.institutoId)
              const itemsClasificados = state.items.filter(i => i.loteOrigenId === lote.id).length

              return (
                <div
                  key={lote.id}
                  onClick={() => navigate(`/ecopunto/clasificar/${lote.id}`)}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-glass hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-0.5 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-mono text-xs font-semibold text-primary-600 dark:text-primary-400">
                      {lote.id}
                    </span>
                    <StatusBadge estado={lote.estado} size="sm" />
                  </div>
                  <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">
                    {instituto?.nombre}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mb-2">
                    Tamaño: {lote.tamano}
                  </p>
                  {itemsClasificados > 0 && (
                    <p className="text-xs text-accent-600 dark:text-accent-400 mb-2">
                      {itemsClasificados} producto(s) clasificado(s)
                    </p>
                  )}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="ghost" size="sm" fullWidth>
                      Clasificar Productos
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800/50 rounded-full mb-4">
              <Package size={32} className="text-gray-400 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No hay lotes pendientes de clasificación
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
