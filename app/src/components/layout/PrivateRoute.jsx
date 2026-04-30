import { Navigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export default function PrivateRoute({ children, rolesPermitidos = [] }) {
  const { state } = useApp()
  const usuario = state.usuarioActual

  if (!usuario) return <Navigate to="/login" replace />
  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/login" replace />
  }
  return children
}
