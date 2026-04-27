import { useSearchParams } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Recycle, MapPin, Calendar, Package, CheckCircle, Building2, Factory, Award, FileCheck } from '../../components/atoms/Icon'

export default function Trazabilidad() {
  const [params] = useSearchParams()
  const { state } = useApp()
  const loteId = params.get('lote')

  // Buscar lote (puede ser de entrada o publicación)
  const lote = state.lotes.find(l => l.id === loteId)

  if (!loteId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Recycle size={32} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Trazabilidad EcoFIng
          </h2>
          <p className="text-gray-600 text-sm">
            Escaneá el código QR de un lote para ver su trazabilidad completa
          </p>
        </div>
      </div>
    )
  }

  if (!lote) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Lote no encontrado
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            No se encontró información para el código: <strong>{loteId}</strong>
          </p>
          <p className="text-xs text-gray-500">
            Verificá que el código QR esté en buen estado
          </p>
        </div>
      </div>
    )
  }

  // Determinar tipo de lote y buscar información relacionada
  const esLoteEntrada = lote.tipo === 'entrada'
  const instituto = state.institutos?.find(i => i.id === lote.institutoId)

  // Si es lote de publicación, buscar gestora y items
  const gestora = lote.gestora_asignada_id
    ? state.gestoras?.find(g => g.id === lote.gestora_asignada_id)
    : null

  const items = esLoteEntrada
    ? state.items?.filter(i => i.loteOrigenId === lote.id)
    : state.items?.filter(i => lote.items_ids?.includes(i.id))

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header con branding */}
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Recycle size={40} className="text-green-600" />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900">EcoFIng</h1>
              <p className="text-sm text-gray-600">Gestión de RAEE · FIng UdelaR</p>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4"></div>
          <p className="text-xs text-gray-500">
            Sistema de trazabilidad pública de Residuos de Aparatos Eléctricos y Electrónicos
          </p>
        </div>

        {/* Información del lote */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Código del lote</p>
              <p className="font-mono text-2xl font-bold text-green-600">{lote.id}</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              lote.estado === 'Finalizado'
                ? 'bg-green-100 text-green-700'
                : lote.estado.includes('Aprobado')
                ? 'bg-blue-100 text-blue-700'
                : 'bg-amber-100 text-amber-700'
            }`}>
              {lote.estado}
            </div>
          </div>

          {/* Timeline de trazabilidad */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPin size={20} className="text-green-600" />
              Recorrido del Lote
            </h2>

            <div className="relative pl-8 space-y-6">
              {/* Línea vertical */}
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-green-500 to-blue-500"></div>

              {/* Paso 1: Origen (Instituto) */}
              <div className="relative">
                <div className="absolute -left-8 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Building2 size={14} className="text-white" />
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Instituto Origen</h3>
                    {lote.fecha_solicitud && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        {lote.fecha_solicitud}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">
                    {instituto?.nombre || lote.institutoId}
                  </p>
                  {esLoteEntrada && (
                    <p className="text-xs text-gray-500 mt-1">
                      Tamaño: {lote.tamano} · Peso aprox: {lote.peso_declarado_aprox_kg} kg
                    </p>
                  )}
                </div>
              </div>

              {/* Paso 2: Ecopunto (clasificación) */}
              {lote.fecha_clasificacion_completa && (
                <div className="relative">
                  <div className="absolute -left-8 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Recycle size={14} className="text-white" />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">Clasificación en Ecopunto</h3>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        {lote.fecha_clasificacion_completa}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {esLoteEntrada
                        ? `${items?.length || 0} ítems clasificados individualmente`
                        : `Lote publicado con ${lote.cantidad_items} ítems`
                      }
                    </p>
                    {!esLoteEntrada && (
                      <p className="text-xs text-gray-500 mt-1">
                        Categoría: {lote.categoria} · {lote.peso_total_kg} kg
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Paso 3: Gestora (retiro) */}
              {gestora && (
                <div className="relative">
                  <div className="absolute -left-8 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <Factory size={14} className="text-white" />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">Gestora de Retiro</h3>
                      {lote.fecha_aprobacion && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar size={12} />
                          {lote.fecha_aprobacion}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{gestora.nombre}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Award size={14} className="text-amber-500" />
                      <span className="text-xs text-gray-600">
                        Scoring: <strong>{gestora.scoring}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 4: Certificado (finalizado) */}
              {lote.estado === 'Finalizado' && lote.certificado_numero && (
                <div className="relative">
                  <div className="absolute -left-8 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle size={14} className="text-white" />
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-green-900">Certificado de Disposición</h3>
                      {lote.fecha_certificado && (
                        <span className="text-xs text-green-700 flex items-center gap-1">
                          <Calendar size={12} />
                          {lote.fecha_certificado}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <FileCheck size={16} className="text-green-600" />
                      <span className="text-sm font-mono text-green-800">
                        {lote.certificado_numero}
                      </span>
                    </div>
                    <p className="text-xs text-green-700 mt-2">
                      ✓ Disposición final certificada conforme a normativa vigente
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items individuales (si están disponibles) */}
        {items && items.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={20} className="text-blue-600" />
              Ítems en este lote ({items.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.slice(0, 8).map(item => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{item.descripcion}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-600">{item.categoria}</span>
                    <span className="text-xs font-semibold text-blue-600">{item.peso_kg} kg</span>
                  </div>
                </div>
              ))}
            </div>
            {items.length > 8 && (
              <p className="text-xs text-gray-500 mt-3 text-center">
                ... y {items.length - 8} ítem(s) más
              </p>
            )}
          </div>
        )}

        {/* Footer informativo */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-lg p-6 text-white text-center">
          <h3 className="text-lg font-semibold mb-2">
            🌱 Contribución al Medio Ambiente
          </h3>
          <p className="text-sm opacity-90">
            Cada kilogramo de RAEE correctamente gestionado evita <strong>1.4 kg de CO₂</strong> y permite
            recuperar materiales valiosos como cobre y aluminio.
          </p>
          <p className="text-xs opacity-75 mt-3">
            Gracias por contribuir a un campus más sustentable
          </p>
        </div>

        {/* Footer con info del sistema */}
        <div className="text-center text-xs text-gray-500">
          <p>
            Sistema desarrollado por estudiantes de FIng · Seminario de Tecnologías 2026
          </p>
        </div>
      </div>
    </div>
  )
}
