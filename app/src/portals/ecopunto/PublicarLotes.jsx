import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../components/molecules/Toast'
import Button from '../../components/atoms/Button'
import { ArrowLeft, Upload as PublishIcon, Check, Package, Building2 } from '../../components/atoms/Icon'
import { ESTADOS_LOTE } from '../../constants/estados'

export default function PublicarLotes() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const toast = useToast()

  // Ítems sin asignar a lote de publicación
  const itemsSinPublicar = state.items.filter(i => i.lotePublicadoId === null)

  // Agrupar ítems por categoría
  const itemsPorCategoria = useMemo(() => {
    const grupos = {}
    itemsSinPublicar.forEach(item => {
      if (!grupos[item.categoria]) {
        grupos[item.categoria] = []
      }
      grupos[item.categoria].push(item)
    })
    return grupos
  }, [itemsSinPublicar])

  const categorias = Object.keys(itemsPorCategoria)

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categorias[0] || '')
  const [itemsSeleccionados, setItemsSeleccionados] = useState([])

  // Cambiar de categoría resetea selección
  const handleCambiarCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria)
    setItemsSeleccionados([])
  }

  const toggleSeleccionItem = (itemId) => {
    setItemsSeleccionados(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const seleccionarTodos = () => {
    const itemsCategoria = itemsPorCategoria[categoriaSeleccionada] || []
    setItemsSeleccionados(itemsCategoria.map(i => i.id))
  }

  const deseleccionarTodos = () => {
    setItemsSeleccionados([])
  }

  const crearLotePublicacion = () => {
    if (itemsSeleccionados.length === 0) {
      toast.warning('Seleccioná al menos un ítem para publicar')
      return
    }

    // Generar ID para lote de publicación
    const lotesPublicacion = state.lotes.filter(l => l.tipo === 'publicacion')
    const ultimoNumero = lotesPublicacion.length > 0
      ? Math.max(...lotesPublicacion.map(l => parseInt(l.id.split('-')[2])))
      : 0
    const nuevoId = `PUB-2026-${String(ultimoNumero + 1).padStart(3, '0')}`

    // Obtener ítems seleccionados
    const items = state.items.filter(i => itemsSeleccionados.includes(i.id))

    // Calcular peso total
    const pesoTotal = items.reduce((sum, i) => sum + i.peso_kg, 0)

    // Institutos de origen (únicos)
    const institutosOrigen = [...new Set(items.map(i => i.institutoId))]

    // Crear lote de publicación
    const nuevoLote = {
      id: nuevoId,
      tipo: 'publicacion',
      categoria: categoriaSeleccionada,
      items_ids: itemsSeleccionados,
      peso_total_kg: pesoTotal,
      cantidad_items: itemsSeleccionados.length,
      institutos_origen: institutosOrigen,
      estado: ESTADOS_LOTE.DISPONIBLE,
      fecha_publicacion: new Date().toISOString().split('T')[0],
      fecha_solicitud_gestora: null,
      fecha_aprobacion: null,
      fecha_certificado: null,
      gestora_asignada: null,
      gestora_asignada_id: null,
      certificado_numero: null,
      observaciones: null,
      solicitudes_gestoras: []
    }

    // Agregar lote
    dispatch({
      type: 'AGREGAR_LOTE',
      payload: nuevoLote
    })

    // Asignar ítems al lote
    dispatch({
      type: 'ASIGNAR_ITEMS_A_LOTE_PUBLICACION',
      payload: {
        itemsIds: itemsSeleccionados,
        lotePublicadoId: nuevoId
      }
    })

    // Mostrar toast de éxito
    toast.success(`Lote ${nuevoId} publicado con ${itemsSeleccionados.length} ítems`)

    // Navegar de vuelta
    setTimeout(() => {
      navigate('/ecopunto')
    }, 300)
  }

  const itemsCategoria = itemsPorCategoria[categoriaSeleccionada] || []

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 via-transparent to-secondary-500/5"></div>
      </div>

      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto p-6 space-y-6">
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
                Agrupar y Publicar Productos
              </h1>
              <p className="text-gray-400 mt-1">
                {itemsSinPublicar.length} producto(s) sin publicar · {itemsSeleccionados.length} seleccionado(s)
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            icon={<PublishIcon size={18} />}
            onClick={crearLotePublicacion}
            disabled={itemsSeleccionados.length === 0}
          >
            Crear Lote y Publicar {itemsSeleccionados.length > 0 && `(${itemsSeleccionados.length})`}
          </Button>
        </div>

        {itemsSinPublicar.length === 0 ? (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-12 text-center">
            <Package size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No hay productos para publicar
            </h3>
            <p className="text-gray-400 mb-6">
              Todos los productos clasificados ya están asignados a lotes de publicación
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/ecopunto')}
            >
              Volver al Dashboard
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar: Categorías */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6 sticky top-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Categorías
                </h2>
                <div className="space-y-2">
                  {categorias.map(categoria => {
                    const itemsCount = itemsPorCategoria[categoria].length
                    const isActiva = categoria === categoriaSeleccionada

                    return (
                      <button
                        key={categoria}
                        onClick={() => handleCambiarCategoria(categoria)}
                        className={`
                          w-full text-left px-4 py-3 rounded-lg text-sm transition-all
                          ${isActiva
                            ? 'bg-primary-500 text-white font-semibold'
                            : 'bg-gray-800/30 text-gray-300 hover:bg-gray-800/50'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span className="pr-2">{categoria}</span>
                          <span className={`
                            text-xs px-2 py-0.5 rounded-full
                            ${isActiva ? 'bg-white/20' : 'bg-primary-500/20 text-primary-300'}
                          `}>
                            {itemsCount}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Main: Ítems de la categoría */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {categoriaSeleccionada}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      {itemsCategoria.length} producto(s) en esta categoría
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {itemsSeleccionados.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={deseleccionarTodos}
                      >
                        Deseleccionar todos
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={seleccionarTodos}
                    >
                      Seleccionar todos
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {itemsCategoria.map(item => {
                    const isSelected = itemsSeleccionados.includes(item.id)
                    const instituto = state.institutos.find(i => i.id === item.institutoId)
                    const loteOrigen = state.lotes.find(l => l.id === item.loteOrigenId)

                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleSeleccionItem(item.id)}
                        className={`
                          relative bg-gray-800/30 border-2 rounded-xl p-4 cursor-pointer transition-all
                          ${isSelected
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/50'
                          }
                        `}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                            <Check size={14} className="text-white" />
                          </div>
                        )}

                        <div className="mb-3">
                          <span className="font-mono text-xs font-semibold text-primary-400">
                            {item.id}
                          </span>
                          {item.clasificado_por_ia && (
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-accent-500/20 text-accent-300">
                              IA
                            </span>
                          )}
                        </div>

                        <p className="text-white font-medium mb-1 text-sm line-clamp-2">{item.descripcion}</p>

                        <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                          <Building2 size={12} />
                          <span>{instituto?.nombre}</span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                          <Package size={12} />
                          <span>de {loteOrigen?.id}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-700/50">
                          <span className="text-gray-400">Peso:</span>
                          <span className="text-white font-semibold">{item.peso_kg} kg</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Resumen de selección */}
              {itemsSeleccionados.length > 0 && (
                <div className="bg-gradient-to-br from-primary-500/10 to-accent-500/10 backdrop-blur-xl rounded-2xl border border-primary-500/30 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Resumen del Lote a Publicar
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Categoría</p>
                      <p className="text-white font-semibold">{categoriaSeleccionada}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Cantidad de productos</p>
                      <p className="text-white font-semibold">{itemsSeleccionados.length} ítems</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Peso total</p>
                      <p className="text-white font-semibold">
                        {state.items
                          .filter(i => itemsSeleccionados.includes(i.id))
                          .reduce((sum, i) => sum + i.peso_kg, 0)
                          .toFixed(1)} kg
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
