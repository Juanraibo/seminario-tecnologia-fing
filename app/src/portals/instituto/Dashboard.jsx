import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Card, { StatCard } from '../../components/molecules/Card'
import DataTable from '../../components/organisms/DataTable'
import StatusBadge from '../../components/molecules/StatusBadge'
import Button from '../../components/atoms/Button'
import { Plus, Package, CheckCircle, Clock, TrendingUp } from '../../components/atoms/Icon'

export default function InstitutoDashboard() {
  const { state } = useApp()
  const navigate = useNavigate()
  const usuario = state.usuarioActual
  const lotes = state.lotes.filter(l => l.institutoId === usuario?.institutoId)

  // Estadísticas
  const stats = {
    total: lotes.length,
    finalizados: lotes.filter(l => l.estado === 'Finalizado').length,
    enProceso: lotes.filter(l => l.estado !== 'Finalizado' && l.estado !== 'Pendiente envío Ecopunto').length,
    pendientes: lotes.filter(l => l.estado === 'Pendiente envío Ecopunto').length,
  }

  // Configurar columnas de la tabla
  const columns = [
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
      header: 'Fecha Solicitud',
      key: 'fecha_solicitud',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(row.fecha_solicitud).toLocaleDateString('es-UY', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
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
      header: 'Estado',
      key: 'estado',
      render: (row) => <StatusBadge estado={row.estado} />
    },
  ]

  // Ordenar lotes por fecha descendente
  const lotesOrdenados = [...lotes].sort((a, b) =>
    new Date(b.fecha_solicitud) - new Date(a.fecha_solicitud)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Mis Solicitudes
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {usuario?.nombre} · Instituto {usuario?.institutoId}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={<Plus size={16} />}
          onClick={() => navigate('/instituto/nueva-solicitud')}
        >
          Nueva Solicitud
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Package size={18} />}
          label="Total de lotes"
          value={stats.total}
        />
        <StatCard
          icon={<Clock size={18} />}
          label="Pendientes"
          value={stats.pendientes}
        />
        <StatCard
          icon={<TrendingUp size={18} />}
          label="En proceso"
          value={stats.enProceso}
        />
        <StatCard
          icon={<CheckCircle size={18} />}
          label="Finalizados"
          value={stats.finalizados}
        />
      </div>

      {/* Tabla de lotes */}
      <Card
        title="Historial de solicitudes"
        subtitle="Haz clic en una fila para ver el detalle completo"
      >
        <DataTable
          columns={columns}
          data={lotesOrdenados}
          onRowClick={(lote) => navigate(`/instituto/lote/${lote.id}`)}
          emptyMessage="No tienes solicitudes registradas. Crea una nueva para comenzar."
        />
      </Card>
    </div>
  )
}
