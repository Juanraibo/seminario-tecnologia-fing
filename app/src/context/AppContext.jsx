import { createContext, useContext, useReducer } from 'react'
import lotesData      from '../data/lotes.json'
import institutosData from '../data/institutos.json'
import gestorasData   from '../data/gestoras.json'
import usuariosData   from '../data/usuarios.json'
import configData     from '../data/config.json'

// ── Estado inicial ────────────────────────────────────────────────
const initialState = {
  lotes:      lotesData,
  institutos: institutosData,
  gestoras:   gestorasData,
  usuarios:   usuariosData,
  config:     configData,
  usuarioActual: null, // se puebla al hacer login
}

// ── Reducer ───────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

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

    default:
      return state
  }
}

// ── Context ───────────────────────────────────────────────────────
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
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
