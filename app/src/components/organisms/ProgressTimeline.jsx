/**
 * ProgressTimeline - Timeline de progreso para visualizar estados de lotes
 * Muestra el flujo completo desde creación hasta finalización
 */

import TimelineStep from '../molecules/TimelineStep'
import { ESTADOS_LOTE } from '../../constants/estados'
import { Clock, Package, FileCheck, CheckCircle, AlertCircle, FileText, Check } from '../atoms/Icon'

// Flujo de estados del lote (orden secuencial)
const FLUJO_ESTADOS = [
  {
    estado: ESTADOS_LOTE.PENDIENTE_ENVIO,
    titulo: 'Solicitud creada',
    icon: <Clock size={16} />,
  },
  {
    estado: ESTADOS_LOTE.EN_ECOPUNTO,
    titulo: 'Recibido en Ecopunto',
    icon: <Package size={16} />,
  },
  {
    estado: ESTADOS_LOTE.CLASIFICADO,
    titulo: 'Clasificado y pesado',
    icon: <FileCheck size={16} />,
  },
  {
    estado: ESTADOS_LOTE.DISPONIBLE,
    titulo: 'Publicado en catálogo',
    icon: <CheckCircle size={16} />,
  },
  {
    estado: ESTADOS_LOTE.SOLICITADO,
    titulo: 'Solicitud de retiro',
    icon: <AlertCircle size={16} />,
  },
  {
    estado: ESTADOS_LOTE.RETIRO_APROBADO,
    titulo: 'Retiro aprobado',
    icon: <FileText size={16} />,
  },
  {
    estado: ESTADOS_LOTE.FINALIZADO,
    titulo: 'Certificado recibido',
    icon: <Check size={16} />,
  },
]

export default function ProgressTimeline({ estadoActual, historial = [], className = '' }) {
  // Determinar el índice del estado actual
  const estadoIndex = FLUJO_ESTADOS.findIndex(f => f.estado === estadoActual)

  return (
    <div className={`py-4 ${className}`}>
      {FLUJO_ESTADOS.map((flujo, index) => {
        // Determinar status del step
        let status = 'pending'
        if (index < estadoIndex) {
          status = 'completed'
        } else if (index === estadoIndex) {
          status = 'current'
        }

        // Buscar timestamp en historial si existe
        const registro = historial?.find(h => h.estado === flujo.estado)
        const timestamp = registro?.fecha
          ? new Date(registro.fecha).toLocaleDateString('es-UY', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          : null

        return (
          <TimelineStep
            key={flujo.estado}
            title={flujo.titulo}
            subtitle={status === 'current' ? flujo.estado : null}
            status={status}
            icon={flujo.icon}
            timestamp={timestamp}
            isLast={index === FLUJO_ESTADOS.length - 1}
          />
        )
      })}
    </div>
  )
}
