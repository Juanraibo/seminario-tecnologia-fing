/**
 * ClasificarLote - Vista de clasificación de productos en un lote de entrada
 * Permite al operario de Ecopunto subir imágenes, clasificar con IA y agregar items
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp, crearItemConSupabase, actualizarLoteConSupabase } from '../../context/AppContext'
import { useToast } from '../../components/molecules/Toast'
import Button from '../../components/atoms/Button'
import Card from '../../components/molecules/Card'
import StatusBadge from '../../components/molecules/StatusBadge'
import CO2Badge from '../../components/molecules/CO2Badge'
import {
  ArrowLeft, Upload, Sparkles, Check, X, Loader,
  AlertCircle, Scale, Package, Plus, Trash2, Info
} from '../../components/atoms/Icon'
import { ESTADOS_LOTE } from '../../constants/estados'
import { clasificarImagenRAEE, fileToBase64 } from '../../services/claudeVision'
import { formatDate } from '../../utils/formatDate'
import { calcularCO2Evitado } from '../../services/carbonAPI'
import { useCO2 } from '../../hooks/useCO2'
import { Leaf } from '../../components/atoms/Icon'

// Componente interno para mostrar vista previa del impacto ambiental
function ImpactoPreview({ peso_kg, categoria }) {
  const { co2_kg, loading, error } = useCO2(peso_kg, categoria, true)

  if (loading) {
    return (
      <div className="mb-6 animate-slide-up">
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-center gap-3">
          <Loader size={18} className="animate-spin text-primary-600 dark:text-primary-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Calculando impacto...</span>
        </div>
      </div>
    )
  }

  if (error || co2_kg === null) {
    return null
  }

  return (
    <div className="mb-6 animate-slide-up">
      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf size={20} className="text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                Impacto Ambiental
              </p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">
                Este producto evitará emitir
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              {co2_kg.toFixed(2)}
            </p>
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
              kg de CO₂
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ClasificarLote() {
  const { loteId } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const toast = useToast()

  const lote = state.lotes.find(l => l.id === loteId && l.tipo === 'entrada')
  const instituto = state.institutos.find(i => i.id === lote?.institutoId)
  const categorias = state.config.categorias_raee

  // Helper para convertir nombres de archivo a URLs o detectar base64/URLs
  const getFotoUrl = (foto) => {
    if (!foto) return null
    // Si ya es una URL completa (http/https) o base64, usarla directamente
    if (foto.startsWith('http') || foto.startsWith('data:image')) return foto
    // Si es un nombre de archivo, asumir que está en /images/lotes/
    return `/images/lotes/${foto}`
  }

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Lote no encontrado
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            El lote con ID "{loteId}" no existe o no es un lote de entrada.
          </p>
          <Button variant="primary" onClick={() => navigate('/ecopunto')}>
            Volver al dashboard
          </Button>
        </Card>
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
      toast.warning('Debes subir una imagen primero')
      return
    }

    setClasificando(true)
    setError('')
    toast.info('Clasificando con IA...')

    try {
      const { base64, mediaType } = await fileToBase64(imagen)
      const resultado = await clasificarImagenRAEE(base64, mediaType, categorias)

      setResultadoIA(resultado)
      setCategoriaSeleccionada(resultado.categoria)
      if (!descripcion) {
        setDescripcion(resultado.observacion)
      }
      toast.success(`Clasificado como ${resultado.categoria} (${resultado.confianza}% confianza)`)
    } catch (err) {
      console.error('Error al clasificar:', err)
      setError(err.message || 'No se pudo obtener sugerencia de la IA. Clasificá manualmente.')
      toast.error('No se pudo clasificar con IA. Clasificá manualmente.')
      setResultadoIA(null)
    } finally {
      setClasificando(false)
    }
  }

  // Agregar ítem al lote
  const handleAgregarItem = async () => {
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

    try {
      // Calcular CO2 del item
      let co2_kg = null
      let co2_source = 'estimated'

      try {
        const resultadoCO2 = await calcularCO2Evitado(parseFloat(pesoReal), categoriaSeleccionada)
        co2_kg = resultadoCO2.co2_kg
        co2_source = resultadoCO2.source
      } catch (err) {
        console.warn('Error calculando CO2, usando estimación:', err)
        // Usar factor estimado si falla la API
        co2_kg = parseFloat(pesoReal) * 1.4
        co2_source = 'estimated'
      }

      // Generar ID secuencial
      const ultimoId = state.items.length > 0
        ? Math.max(...state.items.map(i => parseInt(i.id.split('-')[2])))
        : 0
      const nuevoId = `ITEM-2026-${String(ultimoId + 1).padStart(3, '0')}`

      // Crear ítem (usando snake_case para Supabase)
      const nuevoItem = {
        id: nuevoId,
        lote_origen_id: loteId,
        instituto_id: lote.institutoId,
        categoria: categoriaSeleccionada,
        descripcion: descripcion.trim(),
        peso_kg: parseFloat(pesoReal),
        co2_kg: co2_kg,
        co2_source: co2_source,
        foto_url: imagenPreview,
        clasificado_por_ia: !!resultadoIA,
        confianza_ia: resultadoIA?.confianza || null,
        fecha_clasificacion: new Date().toISOString().split('T')[0],
        lote_publicado_id: null,
        observaciones: null
      }

      // Guardar en Supabase
      await crearItemConSupabase(nuevoItem, dispatch)

      // Actualizar contador de ítems en el lote
      await actualizarLoteConSupabase(loteId, {
        items_clasificados: itemsDelLote.length + 1
      }, dispatch)

      // Mostrar toast de éxito
      toast.success(`Ítem ${nuevoId} agregado correctamente`)

      // Resetear formulario
      setImagen(null)
      setImagenPreview(null)
      setResultadoIA(null)
      setCategoriaSeleccionada('')
      setPesoReal('')
      setDescripcion('')
      setError('')
    } catch (error) {
      console.error('Error creando item:', error)
      toast.error('Error al guardar el ítem. Intentá de nuevo.')
      setError('Error al guardar el ítem')
    } finally {
      setGuardandoItem(false)
    }
  }

  // Terminar clasificación del lote
  const handleTerminarClasificacion = async () => {
    if (itemsDelLote.length === 0) {
      setError('Debes clasificar al menos un ítem antes de terminar')
      toast.warning('Debes clasificar al menos un ítem antes de terminar')
      return
    }

    try {
      // Marcar lote como clasificado en Supabase
      await actualizarLoteConSupabase(loteId, {
        estado: ESTADOS_LOTE.CLASIFICADO,
        fecha_clasificacion_completa: new Date().toISOString().split('T')[0],
        items_clasificados: itemsDelLote.length
      }, dispatch)

      toast.success(`Lote ${loteId} clasificado con ${itemsDelLote.length} ítems`)

      setTimeout(() => {
        navigate('/ecopunto')
      }, 500)
    } catch (error) {
      console.error('Error al terminar clasificación:', error)
      toast.error('Error al actualizar el estado del lote')
    }
  }

  const nivelConfianzaColor = {
    alto: 'text-green-400 bg-green-500/10 border-green-500/50',
    medio: 'text-amber-400 bg-amber-500/10 border-amber-500/50',
    bajo: 'text-red-400 bg-red-500/10 border-red-500/50',
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              icon={<ArrowLeft size={18} />}
              onClick={() => navigate('/ecopunto')}
            >
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Clasificar Productos del Lote
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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

        {/* Información del Envío (Instituto) */}
        <Card title="Información del Envío" subtitle={`Lote desde ${instituto?.nombre || 'Instituto'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Foto original del lote */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Fotografía enviada por el Instituto
              </label>
              {lote.fotos && lote.fotos.length > 0 ? (
                <div className="space-y-3">
                  {lote.fotos.map((foto, idx) => {
                    const fotoUrl = getFotoUrl(foto)
                    return (
                      <div key={idx} className="relative">
                        <img
                          src={fotoUrl}
                          alt={`Foto ${idx + 1} del lote`}
                          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 object-cover max-h-64 bg-white dark:bg-gray-800"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextElementSibling.style.display = 'flex'
                          }}
                        />
                        <div className="hidden w-full h-48 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl items-center justify-center flex-col gap-2">
                          <Package size={32} className="text-gray-400" />
                          <p className="text-sm text-gray-500">Imagen no disponible</p>
                          <p className="text-xs text-gray-500 font-mono">{foto}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center">
                  <p className="text-sm text-gray-500">Sin fotografía</p>
                </div>
              )}
            </div>

            {/* Información y observaciones */}
            <div className="space-y-4">
              {/* Datos del lote */}
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Datos del Lote</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Instituto:</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{instituto?.nombre}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Tamaño declarado:</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium capitalize">{lote.tamano}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Peso aproximado:</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{lote.peso_declarado_aprox_kg} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Fecha solicitud:</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {formatDate(lote.fecha_solicitud)}
                  </span>
                </div>
              </div>

              {/* Observaciones del Instituto */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
                  <AlertCircle size={16} />
                  Observaciones del Instituto
                </h3>
                {lote.observaciones ? (
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {lote.observaciones}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    Sin observaciones adicionales
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda: Agregar nuevo ítem */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Agregar Nuevo Producto" subtitle="Subí una foto y clasificá cada producto">
              {/* Upload de imagen */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Fotografía del producto *
                </label>

                {!imagenPreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-primary-500/50 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="text-gray-400 group-hover:text-primary-500 mb-3 transition-colors" size={32} />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Haz clic</span> o arrastra una imagen
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
                      className="w-full h-48 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
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
                <div className="bg-gradient-to-br from-accent-50 to-primary-50 dark:from-accent-900/20 dark:to-primary-900/20 rounded-xl border border-accent-200 dark:border-accent-700/30 p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Sparkles size={20} className="text-accent-500 dark:text-accent-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Sugerencia de la IA</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{resultadoIA.categoria}</p>
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
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Categoría RAEE *
                  </label>
                  <select
                    value={categoriaSeleccionada}
                    onChange={(e) => {
                      setCategoriaSeleccionada(e.target.value)
                      setError('')
                    }}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  >
                    <option value="">Seleccionar...</option>
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {resultadoIA && categoriaSeleccionada === resultadoIA.categoria && (
                    <p className="text-xs text-accent-500 dark:text-accent-400 mt-1 flex items-center gap-1">
                      <Check size={12} />
                      Sugerencia de IA aceptada
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    />
                    <Scale size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              {/* Vista previa de impacto ambiental */}
              {categoriaSeleccionada && parseFloat(pesoReal) > 0 && (
                <ImpactoPreview peso_kg={parseFloat(pesoReal)} categoria={categoriaSeleccionada} />
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg p-3 flex items-start gap-2 mb-4">
                  <AlertCircle size={18} className="text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
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
            </Card>
          </div>

          {/* Columna derecha: Lista de ítems clasificados */}
          <div className="space-y-6">
            <Card title={`Productos Clasificados (${itemsDelLote.length})`}>
              {itemsDelLote.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {itemsDelLote.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-mono text-xs text-primary-500 dark:text-primary-400">#{index + 1}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          item.clasificado_por_ia
                            ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {item.clasificado_por_ia ? 'IA' : 'Manual'}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{item.descripcion}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{item.categoria}</p>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-gray-500 dark:text-gray-400">Peso:</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">{item.peso_kg} kg</span>
                      </div>
                      {item.co2_kg && (
                        <div className="flex items-center gap-2 mt-2">
                          <CO2Badge co2_kg={item.co2_kg} size="sm" />
                          {item.co2_source === 'api' && (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400">✓ Real</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package size={32} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Aún no hay productos clasificados
                  </p>
                </div>
              )}

              {itemsDelLote.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Peso total:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-bold">
                      {itemsDelLote.reduce((sum, item) => sum + item.peso_kg, 0).toFixed(1)} kg
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">CO₂ evitado total:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <Leaf size={14} />
                      {itemsDelLote.reduce((sum, item) => sum + (item.co2_kg || 0), 0).toFixed(2)} kg
                    </span>
                  </div>
                </div>
              )}
            </Card>

            {/* Info del lote */}
            <Card title="Info del Lote">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">ID:</span>
                  <span className="text-gray-900 dark:text-gray-100 font-mono">{lote.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Instituto:</span>
                  <span className="text-gray-900 dark:text-gray-100">{instituto?.nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Tamaño declarado:</span>
                  <span className="text-gray-900 dark:text-gray-100 capitalize">{lote.tamano}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Recibido:</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {lote.fecha_recepcion_ecopunto
                      ? formatDate(lote.fecha_recepcion_ecopunto)
                      : 'Hoy'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
