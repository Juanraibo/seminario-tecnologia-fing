import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import PageHeader from '../../components/layout/PageHeader'
import Card, { StatCard } from '../../components/molecules/Card'
import DataTable from '../../components/organisms/DataTable'
import Button from '../../components/atoms/Button'
import StatusBadge from '../../components/molecules/StatusBadge'
import { formatDate } from '../../utils/formatDate'
import { Package, CheckCircle, Clock, FileCheck, Upload, ChevronRight } from '../../components/atoms/Icon'
import { ESTADOS_LOTE } from '../../constants/estados'

export default function EcopuntoDashboard() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()

  const lotesEntrada = state.lotes.filter(l => l.tipo === 'entrada')
  const lotesPendientes = lotesEntrada.filter(l => l.estado === ESTADOS_LOTE.PENDIENTE_ENVIO)
  const lotesRecibidos = lotesEntrada.filter(l => l.estado === ESTADOS_LOTE.EN_ECOPUNTO)
  const lotesClasificados = lotesEntrada.filter(l => l.estado === ESTADOS_LOTE.CLASIFICADO)
  const itemsSinPublicar = state.items.filter(i => i.lotePublicadoId === null)

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

  const columnasPendientes = [
    {
      header: 'Instituto',
      key: 'institutoId',
      render: (row) => {
        const instituto = state.institutos.find(i => i.id === row.institutoId)
        return (
          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
            {instituto?.nombre || row.institutoId}
          </span>
        )
      }
    },
    {
      header: 'ID Lote',
      key: 'id',
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-gray-900 dark:text-gray-100">
          {row.id}
        </span>
      )
    },
    {
      header: 'Tamaño',
      key: 'tamano',
      render: (row) => (
        <span className="capitalize text-sm text-gray-600 dark:text-gray-400">
          {row.tamano}
        </span>
      )
    },
    {
      header: 'Fecha',
      key: 'fecha_solicitud',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
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
      <PageHeader
        title="Portal Ecopunto"
        description="Recepción, clasificación y publicación de lotes RAEE"
        actions={
          itemsSinPublicar.length > 0 && (
            <Button
              variant="primary"
              size="md"
              icon={<Upload size={16} />}
              onClick={() => navigate('/ecopunto/publicar')}
            >
              Publicar Productos ({itemsSinPublicar.length})
            </Button>
          )
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Clock size={18} />}
          label="Por recibir"
          value={lotesPendientes.length}
        />
        <StatCard
          icon={<Package size={18} />}
          label="Para clasificar"
          value={lotesRecibidos.length}
        />
        <StatCard
          icon={<FileCheck size={18} />}
          label="Clasificados"
          value={lotesClasificados.length}
        />
        <StatCard
          icon={<Upload size={18} />}
          label="Sin publicar"
          value={itemsSinPublicar.length}
        />
      </div>

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
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg mb-3">
              <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ¡Todo al día! No hay lotes pendientes.
            </p>
          </div>
        )}
      </Card>

      <Card
        title="Lotes para Clasificar"
        subtitle={`${lotesRecibidos.length} lote(s) en estado "En Ecopunto"`}
      >
        {lotesRecibidos.length > 0 ? (
          <div className="space-y-1">
            {lotesRecibidos.map(lote => {
              const instituto = state.institutos.find(i => i.id === lote.institutoId)
              const itemsClasificados = state.items.filter(i => i.loteOrigenId === lote.id).length

              return (
                <div
                  key={lote.id}
                  onClick={() => navigate(`/ecopunto/clasificar/${lote.id}`)}
                  className="enterprise-table-row flex items-center gap-4 px-4 py-3 rounded-md cursor-pointer group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-semibold text-gray-900 dark:text-gray-100">
                        {lote.id}
                      </span>
                      <StatusBadge estado={lote.estado} size="sm" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {instituto?.nombre}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Tamaño {lote.tamano} {itemsClasificados > 0 && `· ${itemsClasificados} clasificados`}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 shrink-0" />
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg mb-3">
              <Package size={24} className="text-gray-400 dark:text-gray-600" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No hay lotes pendientes de clasificación
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
