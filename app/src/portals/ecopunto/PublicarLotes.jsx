/**
 * PublicarLotes - Vista para agrupar y publicar productos clasificados
 * Permite seleccionar items por categoría y crear lotes de publicación
 */

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp, crearLotePublicacionConSupabase } from '../../context/AppContext'
import { useToast } from '../../components/molecules/Toast'
import { actualizarItem } from '../../services/supabase'
import Button from '../../components/atoms/Button'
import Card from '../../components/molecules/Card'
import { ArrowLeft, Upload as PublishIcon, Check, Package, Building2 } from '../../components/atoms/Icon'
import { ESTADOS_LOTE } from '../../constants/estados'

export default function PublicarLotes() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const toast = useToast()

  // Ítems sin asignar a lote de publicación
  const itemsSinPublicar = state.items.filter(i =>
    (i.lotePublicadoId === null || i.lotePublicadoId === undefined) &&
    (i.lote_publicado_id === null || i.lote_publicado_id === undefined)
  )

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

  const crearLotePublicacion = async () => {
    if (itemsSeleccionados.length === 0) {
      toast.warning('Seleccioná al menos un ítem para publicar')
      return
    }

    try {
      // Generar ID para lote de publicación
      const lotesPublicacion = state.lotes.filter(l => l.tipo === 'publicacion')
      const ultimoNumero = lotesPublicacion.length > 0
        ? Math.max(...lotesPublicacion.map(l => parseInt(l.id.split('-')[2])))
        : 0
      const nuevoId = `PUB-2026-${String(ultimoNumero + 1).padStart(3, '0')}`

      // Obtener ítems seleccionados
      const items = state.items.filter(i => itemsSeleccionados.includes(i.id))

      // Calcular peso total y CO2 total (usar campos normalizados)
      const pesoTotal = items.reduce((sum, i) => sum + (i.pesoKg || i.peso_kg || 0), 0)
      const co2Total = items.reduce((sum, i) => sum + (i.co2Kg || i.co2_kg || 0), 0)

      // Institutos de origen (únicos)
      const institutosOrigen = [...new Set(items.map(i => i.institutoId))]

      // Crear lote de publicación (snake_case para Supabase)
      const nuevoLote = {
        id: nuevoId,
        categoria: categoriaSeleccionada,
        cantidad_items: itemsSeleccionados.length,
        peso_total_kg: pesoTotal,
        co2_total_kg: co2Total,
        estado: ESTADOS_LOTE.DISPONIBLE,
        fecha_publicacion: new Date().toISOString().split('T')[0],
        gestora_asignada_id: null,
        fecha_asignacion: null,
        fecha_retiro: null,
        fecha_certificado: null,
        certificado_url: null
      }

      // Guardar lote en Supabase
      await crearLotePublicacionConSupabase(nuevoLote, dispatch)

      // Actualizar cada ítem para asignarlo al lote de publicación
      for (const itemId of itemsSeleccionados) {
        await actualizarItem(itemId, { lote_publicado_id: nuevoId })
        dispatch({
          type: 'ACTUALIZAR_ITEM',
          payload: { id: itemId, lotePublicadoId: nuevoId }
        })
      }

      // Mostrar toast de éxito
      toast.success(`Lote ${nuevoId} publicado con ${itemsSeleccionados.length} ítems`)

      // Navegar de vuelta
      setTimeout(() => {
        navigate('/ecopunto')
      }, 300)
    } catch (error) {
      console.error('Error creando lote de publicación:', error)
      toast.error('Error al publicar el lote. Intentá de nuevo.')
    }
  }

  const itemsCategoria = itemsPorCategoria[categoriaSeleccionada] || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
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
                Agrupar y Publicar Productos
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
          <Card className="text-center py-12">
            <Package size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No hay productos para publicar
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Todos los productos clasificados ya están asignados a lotes de publicación
            </p>
            <Button variant="primary" onClick={() => navigate('/ecopunto')}>
              Volver al Dashboard
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar: Categorías */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6" title="Categorías">
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
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span className="pr-2">{categoria}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            isActiva ? 'bg-white/20' : 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300'
                          }`}>
                            {itemsCount}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </Card>
            </div>

            {/* Main: Ítems de la categoría */}
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {categoriaSeleccionada}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {itemsCategoria.length} producto(s) en esta categoría
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {itemsSeleccionados.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={deseleccionarTodos}>
                        Deseleccionar todos
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={seleccionarTodos}>
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
                          relative bg-white dark:bg-gray-900 border-2 rounded-xl p-4 cursor-pointer transition-all
                          ${isSelected
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          }
                        `}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                            <Check size={14} className="text-white" />
                          </div>
                        )}

                        <div className="mb-3">
                          <span className="font-mono text-xs font-semibold text-primary-500 dark:text-primary-400">
                            {item.id}
                          </span>
                          {item.clasificado_por_ia && (
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300">
                              IA
                            </span>
                          )}
                        </div>

                        <p className="text-gray-900 dark:text-gray-100 font-medium mb-1 text-sm line-clamp-2">{item.descripcion}</p>

                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <Building2 size={12} />
                          <span>{instituto?.nombre}</span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
                          <Package size={12} />
                          <span>de {loteOrigen?.id}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100 dark:border-gray-700">
                          <span className="text-gray-500 dark:text-gray-400">Peso:</span>
                          <span className="text-gray-900 dark:text-gray-100 font-semibold">{(item.pesoKg || item.peso_kg || 0)} kg</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>

              {/* Resumen de selección */}
              {itemsSeleccionados.length > 0 && (
                <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border border-primary-200 dark:border-primary-700/30 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Resumen del Lote a Publicar
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Categoría</p>
                      <p className="text-gray-900 dark:text-gray-100 font-semibold">{categoriaSeleccionada}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Cantidad de productos</p>
                      <p className="text-gray-900 dark:text-gray-100 font-semibold">{itemsSeleccionados.length} ítems</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Peso total</p>
                      <p className="text-gray-900 dark:text-gray-100 font-semibold">
                        {state.items
                          .filter(i => itemsSeleccionados.includes(i.id))
                          .reduce((sum, i) => sum + (i.pesoKg || i.peso_kg || 0), 0)
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
