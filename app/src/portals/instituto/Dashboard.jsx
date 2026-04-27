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
        <span className="font-mono text-xs font-semibold text-primary-600 dark:text-primary-400">
          {row.id}
        </span>
      )
    },
    {
      header: 'Fecha Solicitud',
      key: 'fecha_solicitud',
      render: (row) => new Date(row.fecha_solicitud).toLocaleDateString('es-UY', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    },
    {
      header: 'Tamaño',
      key: 'tamano',
      render: (row) => (
        <span className="capitalize text-gray-600 dark:text-gray-400">
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

  // Ordenar lotes por fecha descendente (más reciente primero)
  const lotesOrdenados = [...lotes].sort((a, b) =>
    new Date(b.fecha_solicitud) - new Date(a.fecha_solicitud)
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Mis Solicitudes
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {usuario?.nombre} · Instituto {usuario?.institutoId}
            </p>
          </div>
          <Button
            variant="primary"
            icon={<Plus size={18} />}
            onClick={() => navigate('/instituto/nueva-solicitud')}
          >
            Nueva Solicitud
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Package size={20} />}
            label="Total de lotes"
            value={stats.total}
          />
          <StatCard
            icon={<Clock size={20} />}
            label="Pendientes"
            value={stats.pendientes}
            className="border-l-4 border-amber-400 dark:border-amber-500"
          />
          <StatCard
            icon={<TrendingUp size={20} />}
            label="En proceso"
            value={stats.enProceso}
            className="border-l-4 border-blue-400 dark:border-blue-500"
          />
          <StatCard
            icon={<CheckCircle size={20} />}
            label="Finalizados"
            value={stats.finalizados}
            className="border-l-4 border-green-400 dark:border-green-500"
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
    </div>
  )
}
