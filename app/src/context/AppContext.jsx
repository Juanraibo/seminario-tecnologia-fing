import { createContext, useContext, useReducer, useEffect, useState } from 'react'
import {
  getInstitutos,
  getGestoras,
  loginUsuario,
  getLotesEntrada,
  crearLoteEntrada,
  actualizarLoteEntrada,
  getItems,
  crearItem,
  actualizarItem,
  getLotesPublicacion,
  crearLotePublicacion,
  actualizarLotePublicacion,
  getSolicitudesGestoras,
  crearSolicitudGestora,
  getConfig,
} from '../services/supabase'
import {
  normalizeUsuario,
  normalizeLote,
  normalizeItem,
  normalizeLotePublicacion,
  normalizeGestora,
  normalizeInstituto,
} from '../utils/normalizeData'

// ── Estado inicial (vacío - se carga desde Supabase) ──────────────
const initialState = {
  lotes:      [],
  items:      [],
  institutos: [],
  gestoras:   [],
  usuarios:   [],
  config:     {},
  usuarioActual: null,
  isLoading: true, // nuevo: indica si está cargando datos
}

// ── Reducer ───────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    // ── Cargar datos iniciales desde Supabase ────────────────────────
    case 'SET_INITIAL_DATA':
      return {
        ...state,
        institutos: action.payload.institutos || [],
        gestoras: action.payload.gestoras || [],
        lotes: action.payload.lotes || [],
        items: action.payload.items || [],
        config: action.payload.config || {},
        isLoading: false,
      }

    case 'LOGIN':
      return { ...state, usuarioActual: action.payload }

    case 'LOGOUT':
      return { ...state, usuarioActual: null }

    case 'ACTUALIZAR_LOTE': {
      const lotes = state.lotes.map(l =>
        l.id === action.payload.id ? { ...l, ...action.payload } : l
      )
      return { ...state, lotes }
    }

    case 'AGREGAR_LOTE':
      return { ...state, lotes: [action.payload, ...state.lotes] }

    case 'ACTUALIZAR_SCORING_GESTORA': {
      const gestoras = state.gestoras.map(g =>
        g.id === action.payload.id
          ? { ...g, scoring: Math.min(100, g.scoring + action.payload.puntos) }
          : g
      )
      return { ...state, gestoras }
    }

    case 'TOGGLE_HABILITACION_GESTORA': {
      const gestoras = state.gestoras.map(g =>
        g.id === action.payload
          ? { ...g, habilitacion_ministerio: !g.habilitacion_ministerio }
          : g
      )
      return { ...state, gestoras }
    }

    // ── Acciones para ítems ──────────────────────────────────────────

    case 'AGREGAR_ITEM':
      return { ...state, items: [action.payload, ...state.items] }

    case 'ACTUALIZAR_ITEM': {
      const items = state.items.map(i =>
        i.id === action.payload.id ? { ...i, ...action.payload } : i
      )
      return { ...state, items }
    }

    case 'ASIGNAR_ITEMS_A_LOTE_PUBLICACION': {
      const { itemsIds, lotePublicadoId } = action.payload
      const items = state.items.map(i =>
        itemsIds.includes(i.id) ? { ...i, lotePublicadoId } : i
      )
      return { ...state, items }
    }

    case 'AGREGAR_SOLICITUD_GESTORA': {
      const { loteId, gestoraId, cotizacion, fecha } = action.payload
      const lotes = state.lotes.map(l => {
        if (l.id === loteId) {
          const solicitudes = l.solicitudes_gestoras || []
          return {
            ...l,
            solicitudes_gestoras: [...solicitudes, { gestoraId, cotizacion, fecha }]
          }
        }
        return l
      })
      return { ...state, lotes }
    }

    // ── Acciones para usuarios y gestoras ────────────────────────────

    case 'AGREGAR_USUARIO':
      return { ...state, usuarios: [...state.usuarios, action.payload] }

    case 'ELIMINAR_USUARIO': {
      const usuarios = state.usuarios.filter(u => u.id !== action.payload)
      return { ...state, usuarios }
    }

    case 'AGREGAR_GESTORA':
      return { ...state, gestoras: [...state.gestoras, action.payload] }

    case 'ELIMINAR_GESTORA': {
      const gestoras = state.gestoras.filter(g => g.id !== action.payload)
      return { ...state, gestoras }
    }

    default:
      return state
  }
}

// ── Context ───────────────────────────────────────────────────────
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Cargar datos desde Supabase al montar
  useEffect(() => {
    async function loadInitialData() {
      try {
        console.log('📥 Cargando datos desde Supabase...')

        const [institutos, gestoras, lotesEntrada, lotesPublicacion, items, solicitudes, categorias_raee] = await Promise.all([
          getInstitutos(),
          getGestoras(),
          getLotesEntrada(),
          getLotesPublicacion(),
          getItems(),
          getSolicitudesGestoras(),
          getConfig('categorias_raee'),
        ])

        console.log('✅ Datos cargados:', { institutos, gestoras, lotesEntrada, lotesPublicacion, items, solicitudes })

        // Agrupar solicitudes por lote
        const solicitudesPorLote = solicitudes.reduce((acc, sol) => {
          if (!acc[sol.lote_publicacion_id]) {
            acc[sol.lote_publicacion_id] = []
          }
          acc[sol.lote_publicacion_id].push({
            gestoraId: sol.gestora_id,
            cotizacion: sol.monto_ofrecido,
            fecha: sol.created_at,
            estado: sol.estado
          })
          return acc
        }, {})

        // Combinar lotes de entrada y publicación
        const todosLotes = [
          ...lotesEntrada.map(normalizeLote),
          ...lotesPublicacion.map(lote => ({
            ...normalizeLotePublicacion(lote),
            solicitudes_gestoras: solicitudesPorLote[lote.id] || []
          }))
        ]

        // Normalizar datos de snake_case a camelCase
        dispatch({
          type: 'SET_INITIAL_DATA',
          payload: {
            institutos: institutos.map(normalizeInstituto),
            gestoras: gestoras.map(normalizeGestora),
            lotes: todosLotes,
            items: items.map(normalizeItem),
            config: { categorias_raee },
          },
        })
      } catch (error) {
        console.error('❌ Error cargando datos iniciales:', error)
        // Si falla Supabase, el estado queda vacío pero la app no crashea
        dispatch({
          type: 'SET_INITIAL_DATA',
          payload: {
            institutos: [],
            gestoras: [],
            lotes: [],
            items: [],
            config: {},
          },
        })
      }
    }

    loadInitialData()
  }, [])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>')
  return ctx
}

// ── Funciones helper para operaciones con Supabase ───────────────
export async function loginConSupabase(email, password, dispatch) {
  try {
    const usuario = await loginUsuario(email, password)
    const usuarioNormalizado = normalizeUsuario(usuario)
    dispatch({ type: 'LOGIN', payload: usuarioNormalizado })
    return usuarioNormalizado
  } catch (error) {
    console.error('Error en login:', error)
    throw error
  }
}

export async function crearLoteConSupabase(lote, dispatch) {
  try {
    const nuevoLote = await crearLoteEntrada(lote)
    const loteNormalizado = normalizeLote(nuevoLote)
    dispatch({ type: 'AGREGAR_LOTE', payload: loteNormalizado })
    return loteNormalizado
  } catch (error) {
    console.error('Error creando lote:', error)
    throw error
  }
}

export async function actualizarLoteConSupabase(id, cambios, dispatch) {
  try {
    const loteActualizado = await actualizarLoteEntrada(id, cambios)
    const loteNormalizado = normalizeLote(loteActualizado)
    dispatch({ type: 'ACTUALIZAR_LOTE', payload: loteNormalizado })
    return loteNormalizado
  } catch (error) {
    console.error('Error actualizando lote:', error)
    throw error
  }
}

export async function crearItemConSupabase(item, dispatch) {
  try {
    const nuevoItem = await crearItem(item)
    const itemNormalizado = normalizeItem(nuevoItem)
    dispatch({ type: 'AGREGAR_ITEM', payload: itemNormalizado })
    return itemNormalizado
  } catch (error) {
    console.error('Error creando item:', error)
    throw error
  }
}

export async function crearLotePublicacionConSupabase(lote, dispatch) {
  try {
    const nuevoLote = await crearLotePublicacion(lote)
    const loteNormalizado = normalizeLotePublicacion(nuevoLote)
    dispatch({ type: 'AGREGAR_LOTE', payload: loteNormalizado })
    return loteNormalizado
  } catch (error) {
    console.error('Error creando lote de publicación:', error)
    throw error
  }
}
