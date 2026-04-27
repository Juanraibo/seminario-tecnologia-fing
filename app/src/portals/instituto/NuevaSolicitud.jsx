import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../components/molecules/Toast'
import Card from '../../components/molecules/Card'
import Button from '../../components/atoms/Button'
import { ArrowLeft, Upload, Check, X, Package, PackagePlus, Boxes } from '../../components/atoms/Icon'
import { ESTADOS_LOTE } from '../../constants/estados'

export default function NuevaSolicitud() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const toast = useToast()
  const usuario = state.usuarioActual
  const config = state.config

  const [tamano, setTamano] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [foto, setFoto] = useState(null)
  const [fotoPreview, setFotoPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Opciones de tamaño con información de topes
  const opcionesTamano = [
    {
      value: 'chico',
      label: 'Lote Chico',
      descripcion: 'Hasta 0.5 m³',
      tope: `Máx. ${config.lote_chico_max_kg} kg`,
      icon: <Package size={32} className="text-primary-500" />,
    },
    {
      value: 'mediano',
      label: 'Lote Mediano',
      descripcion: 'De 0.5 m³ a 2 m³',
      tope: `Máx. ${config.lote_mediano_max_kg} kg`,
      icon: <PackagePlus size={32} className="text-primary-500" />,
    },
    {
      value: 'grande',
      label: 'Lote Grande',
      descripcion: 'Más de 2 m³',
      tope: 'Sin límite de peso',
      icon: <Boxes size={32} className="text-primary-500" />,
    },
  ]

  // Handler para cambio de foto
  const handleFotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
      setErrors({ ...errors, foto: null })
    }
  }

  // Remover foto
  const handleRemoverFoto = () => {
    setFoto(null)
    setFotoPreview(null)
  }

  // Validación
  const validate = () => {
    const newErrors = {}
    if (!tamano) newErrors.tamano = 'Debes seleccionar un tamaño de lote'
    if (!foto) newErrors.foto = 'Debes adjuntar al menos una fotografía'
    return newErrors
  }

  // Submit del formulario
  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)

    // Generar ID único
    const nuevoId = `LOT-${new Date().getFullYear()}-${String(state.lotes.length + 1).padStart(3, '0')}`

    // Crear el nuevo lote
    const nuevoLote = {
      id: nuevoId,
      tipo: 'entrada', // Tipo de lote para filtrado en Ecopunto
      institutoId: usuario.institutoId,
      tamano: tamano,
      peso_real_kg: null,
      categoria_ia: null,
      categoria_final: null,
      clasificado_por_ia: false,
      confianza_ia: null,
      estado: ESTADOS_LOTE.PENDIENTE_ENVIO,
      fecha_solicitud: new Date().toISOString().split('T')[0],
      fecha_recepcion_ecopunto: null,
      fecha_clasificacion: null,
      fecha_publicacion: null,
      fecha_solicitud_gestora: null,
      fecha_aprobacion: null,
      fecha_certificado: null,
      gestora_asignada: null,
      gestora_asignada_id: null,
      certificado_numero: null,
      fotos: [foto.name],
      observaciones: observaciones || null,
      solicitudes_gestoras: [],
    }

    // Agregar al estado
    dispatch({ type: 'AGREGAR_LOTE', payload: nuevoLote })

    // Mostrar toast de éxito
    toast.success(`Solicitud ${nuevoId} creada correctamente`)

    // Redirigir
    setTimeout(() => {
      navigate('/instituto')
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
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
              Nueva Solicitud de Retiro
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Completa el formulario para registrar un nuevo lote de RAEE
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <Card>
            <div className="space-y-6">
              {/* Selección de tamaño */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                  Tamaño del lote *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {opcionesTamano.map((opcion) => (
                    <button
                      key={opcion.value}
                      type="button"
                      onClick={() => {
                        setTamano(opcion.value)
                        setErrors({ ...errors, tamano: null })
                      }}
                      className={`
                        p-4 rounded-lg border-2 transition-all text-left
                        ${tamano === opcion.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }
                      `}
                    >
                      <div className="mb-2">{opcion.icon}</div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {opcion.label}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {opcion.descripcion}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        {opcion.tope}
                      </p>
                    </button>
                  ))}
                </div>
                {errors.tamano && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                    {errors.tamano}
                  </p>
                )}
              </div>

              {/* Upload de foto */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                  Fotografía representativa *
                </label>
                {!fotoPreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="text-gray-400 mb-3" size={40} />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Haz clic para subir</span> o arrastra una imagen
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        PNG, JPG o JPEG (máx. 10MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFotoChange}
                    />
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={fotoPreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      icon={<X size={16} />}
                      onClick={handleRemoverFoto}
                      className="absolute top-2 right-2"
                    >
                      Remover
                    </Button>
                  </div>
                )}
                {errors.foto && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                    {errors.foto}
                  </p>
                )}
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Observaciones (opcional)
                </label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={4}
                  placeholder="Ej: Incluye monitores CRT y teclados en buen estado"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/instituto')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  icon={<Check size={18} />}
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? 'Creando...' : 'Crear Solicitud'}
                </Button>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  )
}
