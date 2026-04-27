import { useParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { useApp } from '../../context/AppContext'
import Card from '../../components/molecules/Card'
import StatusBadge from '../../components/molecules/StatusBadge'
import Button from '../../components/atoms/Button'
import ProgressTimeline from '../../components/organisms/ProgressTimeline'
import { ArrowLeft, Download, FileText, Package, Calendar } from '../../components/atoms/Icon'

export default function DetalleLote() {
  const { loteId } = useParams()
  const navigate = useNavigate()
  const { state } = useApp()

  const lote = state.lotes.find(l => l.id === loteId)

  if (!lote) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 flex items-center justify-center">
        <Card className="max-w-md">
          <div className="text-center py-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Lote no encontrado
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              El lote con ID "{loteId}" no existe.
            </p>
            <Button variant="primary" onClick={() => navigate('/instituto')}>
              Volver al dashboard
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // URL para el QR (siempre apunta al dominio de producción)
  const qrUrl = `https://seminario.noah.uy/trazabilidad?lote=${lote.id}`

  // Descargar QR como imagen
  const handleDescargarQR = () => {
    const svg = document.getElementById('qr-code')
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = `QR-${lote.id}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              icon={<ArrowLeft size={18} />}
              onClick={() => navigate('/instituto')}
            >
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Detalle del Lote
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 font-mono text-sm">
                {lote.id}
              </p>
            </div>
          </div>
          <StatusBadge estado={lote.estado} size="lg" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Datos del lote */}
            <Card title="Información del lote">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    ID del lote
                  </label>
                  <p className="text-sm font-mono font-semibold text-gray-900 dark:text-gray-100 mt-1">
                    {lote.id}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Tamaño
                  </label>
                  <p className="text-sm capitalize text-gray-900 dark:text-gray-100 mt-1">
                    {lote.tamano}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Fecha de solicitud
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                    {new Date(lote.fecha_solicitud).toLocaleDateString('es-UY', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                {lote.peso_real_kg && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Peso real
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                      {lote.peso_real_kg} kg
                    </p>
                  </div>
                )}
                {lote.categoria_final && (
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Categoría
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                      {lote.categoria_final}
                    </p>
                  </div>
                )}
              </div>

              {lote.observaciones && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Observaciones
                  </label>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                    {lote.observaciones}
                  </p>
                </div>
              )}
            </Card>

            {/* Fotografía */}
            {lote.fotos && lote.fotos.length > 0 && (
              <Card title="Fotografía del lote">
                <div className="bg-gray-100 dark:bg-gray-950 rounded-lg p-4 flex items-center justify-center">
                  <Package size={64} className="text-gray-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                    Imagen: {lote.fotos[0]}
                  </p>
                </div>
              </Card>
            )}

            {/* Timeline de progreso */}
            <Card title="Trazabilidad del lote" subtitle="Seguimiento del proceso completo">
              <ProgressTimeline estadoActual={lote.estado} />
            </Card>

            {/* Certificado si está finalizado */}
            {lote.estado === 'Finalizado' && lote.certificado_numero && (
              <Card>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <FileText size={24} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      Certificado de Disposición Final
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      N° {lote.certificado_numero}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Emitido el {new Date(lote.fecha_certificado).toLocaleDateString('es-UY')}
                    </p>
                    <Button variant="outline" size="sm" icon={<Download size={16} />} className="mt-3">
                      Descargar certificado
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar con QR */}
          <div className="space-y-6">
            <Card title="Código QR" subtitle="Para etiquetar el lote físicamente">
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <QRCodeSVG
                    id="qr-code"
                    value={qrUrl}
                    size={200}
                    level="H"
                    includeMargin
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                  Escanea para ver la trazabilidad pública
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Download size={16} />}
                  onClick={handleDescargarQR}
                  fullWidth
                  className="mt-4"
                >
                  Descargar QR
                </Button>
              </div>
            </Card>

            {/* Gestora asignada si existe */}
            {lote.gestora_asignada && (
              <Card title="Gestora asignada">
                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Empresa
                    </label>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                      {lote.gestora_asignada}
                    </p>
                  </div>
                  {lote.fecha_aprobacion && (
                    <div>
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Fecha de aprobación
                      </label>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {new Date(lote.fecha_aprobacion).toLocaleDateString('es-UY')}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
