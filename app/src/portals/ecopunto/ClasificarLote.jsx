import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Button from '../../components/atoms/Button'
import { ArrowLeft, Upload, Sparkles, Check, X, Loader, AlertCircle, Scale, Package, Plus, Trash2 } from '../../components/atoms/Icon'
import { ESTADOS_LOTE } from '../../constants/estados'
import { clasificarImagenRAEE, fileToBase64 } from '../../services/claudeVision'

export default function ClasificarLote() {
  const { loteId } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useApp()

  const lote = state.lotes.find(l => l.id === loteId && l.tipo === 'entrada')
  const instituto = state.institutos.find(i => i.id === lote?.institutoId)
  const categorias = state.config.categorias_raee

  // Ítems ya clasificados de este lote
  const itemsDelLote = state.items.filter(i => i.loteOrigenId === loteId)

  // Estados del formulario para NUEVO ítem
  const [imagen, setImagen] = useState(null)
  const [imagenPreview, setImagenPreview] = useState(null)
  const [clasificando, setClasificando] = useState(false)
  const [resultadoIA, setResultadoIA] = useState(null)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('')
  const [pesoReal, setPesoReal] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState('')
  const [guardandoItem, setGuardandoItem] = useState(false)

  if (!lote) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"></div>
        <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-8 max-w-md">
          <h2 className="text-xl font-bold text-white mb-2">Lote no encontrado</h2>
          <p className="text-gray-400 mb-4">El lote con ID "{loteId}" no existe o no es un lote de entrada.</p>
          <Button variant="primary" onClick={() => navigate('/ecopunto')}>
            Volver al dashboard
          </Button>
        </div>
      </div>
    )
  }

  // Handler para cambio de imagen
  const handleImagenChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagen(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagenPreview(reader.result)
      }
      reader.readAsDataURL(file)
      setError('')
      setResultadoIA(null)
    }
  }

  // Clasificar con IA
  const handleClasificarConIA = async () => {
    if (!imagen) {
      setError('Debes subir una imagen primero')
      return
    }

    setClasificando(true)
    setError('')

    try {
      const { base64, mediaType } = await fileToBase64(imagen)
      const resultado = await clasificarImagenRAEE(base64, mediaType, categorias)

      setResultadoIA(resultado)
      setCategoriaSeleccionada(resultado.categoria)
      if (!descripcion) {
        setDescripcion(resultado.observacion)
      }
    } catch (err) {
      console.error('Error al clasificar:', err)
      setError(err.message || 'No se pudo obtener sugerencia de la IA. Clasificá manualmente.')
      setResultadoIA(null)
    } finally {
      setClasificando(false)
    }
  }

  // Agregar ítem al lote
  const handleAgregarItem = () => {
    // Validaciones
    if (!categoriaSeleccionada) {
      setError('Debes seleccionar una categoría')
      return
    }
    if (!pesoReal || parseFloat(pesoReal) <= 0) {
      setError('Debes ingresar un peso válido')
      return
    }
    if (!descripcion.trim()) {
      setError('Debes ingresar una descripción del ítem')
      return
    }

    setGuardandoItem(true)

    // Generar ID secuencial
    const ultimoId = state.items.length > 0
      ? Math.max(...state.items.map(i => parseInt(i.id.split('-')[2])))
      : 0
    const nuevoId = `ITEM-2026-${String(ultimoId + 1).padStart(3, '0')}`

    // Crear ítem
    const nuevoItem = {
      id: nuevoId,
      loteOrigenId: loteId,
      institutoId: lote.institutoId,
      categoria: categoriaSeleccionada,
      descripcion: descripcion.trim(),
      peso_kg: parseFloat(pesoReal),
      foto_url: `${nuevoId}.jpg`, // En producción, se subiría la imagen a un servidor
      clasificado_por_ia: !!resultadoIA,
      confianza_ia: resultadoIA?.confianza || null,
      fecha_clasificacion: new Date().toISOString().split('T')[0],
      lotePublicadoId: null,
      observaciones: null
    }

    // Agregar al estado
    dispatch({
      type: 'AGREGAR_ITEM',
      payload: nuevoItem
    })

    // Actualizar contador de ítems en el lote
    dispatch({
      type: 'ACTUALIZAR_LOTE',
      payload: {
        id: loteId,
        items_clasificados: itemsDelLote.length + 1
      }
    })

    // Resetear formulario
    setImagen(null)
    setImagenPreview(null)
    setResultadoIA(null)
    setCategoriaSeleccionada('')
    setPesoReal('')
    setDescripcion('')
    setError('')
    setGuardandoItem(false)
  }

  // Eliminar ítem
  const handleEliminarItem = (itemId) => {
    // En un sistema real, esto requeriría confirmación
    // Por ahora simplemente lo marcamos como eliminado o lo removemos del estado
    // Para el MVP, vamos a dejarlo simple: no implementamos eliminación
    alert('Eliminación de ítems no implementada en el MVP')
  }

  // Terminar clasificación del lote
  const handleTerminarClasificacion = () => {
    if (itemsDelLote.length === 0) {
      setError('Debes clasificar al menos un ítem antes de terminar')
      return
    }

    // Marcar lote como clasificado
    dispatch({
      type: 'ACTUALIZAR_LOTE',
      payload: {
        id: loteId,
        estado: ESTADOS_LOTE.CLASIFICADO,
        fecha_clasificacion_completa: new Date().toISOString().split('T')[0],
        items_clasificados: itemsDelLote.length
      }
    })

    navigate('/ecopunto')
  }

  const nivelConfianzaColor = {
    alto: 'text-green-400 bg-green-500/10 border-green-500/50',
    medio: 'text-amber-400 bg-amber-500/10 border-amber-500/50',
    bajo: 'text-red-400 bg-red-500/10 border-red-500/50',
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradiente de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-gradient-to-tr from-accent-500/5 via-transparent to-secondary-500/5"></div>
      </div>

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              icon={<ArrowLeft size={18} />}
              onClick={() => navigate('/ecopunto')}
              className="text-white border-gray-700 hover:bg-gray-800/50"
            >
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Clasificar Productos del Lote
              </h1>
              <p className="text-gray-400 mt-1">
                {lote.id} · {instituto?.nombre} · {itemsDelLote.length} ítem(s) clasificado(s)
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            icon={<Check size={18} />}
            onClick={handleTerminarClasificacion}
            disabled={itemsDelLote.length === 0}
          >
            Terminar Clasificación
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda: Agregar nuevo ítem */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Plus size={20} className="text-primary-400" />
                Agregar Nuevo Producto
              </h2>

              {/* Upload de imagen */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Fotografía del producto *
                </label>

                {!imagenPreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-primary-500/50 hover:bg-gray-800/30 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="text-gray-500 group-hover:text-primary-400 mb-3 transition-colors" size={32} />
                      <p className="text-sm text-gray-400">
                        <span className="font-semibold text-white">Haz clic</span> o arrastra una imagen
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImagenChange}
                    />
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={imagenPreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl border border-gray-700"
                    />
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      icon={<X size={16} />}
                      onClick={() => {
                        setImagen(null)
                        setImagenPreview(null)
                        setResultadoIA(null)
                      }}
                      className="absolute top-2 right-2"
                    >
                      Remover
                    </Button>
                  </div>
                )}

                {imagen && !resultadoIA && (
                  <Button
                    variant="accent"
                    fullWidth
                    icon={clasificando ? <Loader size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    onClick={handleClasificarConIA}
                    disabled={clasificando}
                    className="mt-4"
                  >
                    {clasificando ? 'Clasificando con IA...' : 'Clasificar con IA'}
                  </Button>
                )}
              </div>

              {/* Resultado de IA */}
              {resultadoIA && (
                <div className="bg-gradient-to-br from-accent-500/10 to-primary-500/10 rounded-xl border border-accent-500/30 p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Sparkles size={20} className="text-accent-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white mb-1">Sugerencia de la IA</h3>
                      <p className="text-sm text-gray-300 mb-2">{resultadoIA.categoria}</p>
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${nivelConfianzaColor[resultadoIA.confianza]}`}>
                        Confianza: {resultadoIA.confianza}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Formulario */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Categoría RAEE *
                  </label>
                  <select
                    value={categoriaSeleccionada}
                    onChange={(e) => {
                      setCategoriaSeleccionada(e.target.value)
                      setError('')
                    }}
                    className="w-full bg-gray-950/50 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  >
                    <option value="">Seleccionar...</option>
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {resultadoIA && categoriaSeleccionada === resultadoIA.categoria && (
                    <p className="text-xs text-accent-400 mt-1 flex items-center gap-1">
                      <Check size={12} />
                      Sugerencia de IA aceptada
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Peso (kg) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={pesoReal}
                      onChange={(e) => {
                        setPesoReal(e.target.value)
                        setError('')
                      }}
                      placeholder="Ej: 3.5"
                      className="w-full bg-gray-950/50 border border-gray-700 text-white pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    />
                    <Scale size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Descripción del producto *
                </label>
                <input
                  type="text"
                  value={descripcion}
                  onChange={(e) => {
                    setDescripcion(e.target.value)
                    setError('')
                  }}
                  placeholder="Ej: Monitor LCD Samsung 22 pulgadas"
                  className="w-full bg-gray-950/50 border border-gray-700 text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-start gap-2 mb-4">
                  <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Botón agregar */}
              <Button
                variant="primary"
                fullWidth
                icon={guardandoItem ? <Loader size={18} className="animate-spin" /> : <Plus size={18} />}
                onClick={handleAgregarItem}
                disabled={guardandoItem || !categoriaSeleccionada || !pesoReal || !descripcion}
              >
                {guardandoItem ? 'Agregando...' : 'Agregar Producto al Lote'}
              </Button>
            </div>
          </div>

          {/* Columna derecha: Lista de ítems clasificados */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Package size={20} className="text-primary-400" />
                Productos Clasificados ({itemsDelLote.length})
              </h2>

              {itemsDelLote.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {itemsDelLote.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-mono text-xs text-primary-400">#{index + 1}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${item.clasificado_por_ia ? 'bg-accent-500/20 text-accent-300' : 'bg-gray-700 text-gray-300'}`}>
                          {item.clasificado_por_ia ? 'IA' : 'Manual'}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-white mb-1">{item.descripcion}</p>
                      <p className="text-xs text-gray-400 mb-2">{item.categoria}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Peso:</span>
                        <span className="text-white font-semibold">{item.peso_kg} kg</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package size={32} className="text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">
                    Aún no hay productos clasificados
                  </p>
                </div>
              )}

              {itemsDelLote.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Peso total:</span>
                    <span className="text-white font-bold">
                      {itemsDelLote.reduce((sum, item) => sum + item.peso_kg, 0).toFixed(1)} kg
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Info del lote */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Info del Lote
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">ID:</span>
                  <span className="text-white font-mono">{lote.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Instituto:</span>
                  <span className="text-white">{instituto?.nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tamaño declarado:</span>
                  <span className="text-white capitalize">{lote.tamano}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Recibido:</span>
                  <span className="text-white">
                    {lote.fecha_recepcion_ecopunto
                      ? new Date(lote.fecha_recepcion_ecopunto).toLocaleDateString('es-UY')
                      : 'Hoy'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
