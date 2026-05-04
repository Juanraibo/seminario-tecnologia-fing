/**
 * GestionActores - Panel de administración de actores del sistema
 * Tabs para gestionar institutos, operarios de ecopunto y gestoras
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../components/molecules/Toast'
import { actualizarGestora } from '../../services/supabase'
import Button from '../../components/atoms/Button'
import Card from '../../components/molecules/Card'
import PageHeader from '../../components/layout/PageHeader'
import Badge from '../../components/atoms/Badge'
import { ArrowLeft, Building2, Users, Factory, Plus, CheckCircle, XCircle, Award, Trash2 } from '../../components/atoms/Icon'

export default function GestionActores() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const toast = useToast()
  const [tabActiva, setTabActiva] = useState('institutos')

  // Estados para formularios
  const [mostrarFormInstituto, setMostrarFormInstituto] = useState(false)
  const [mostrarFormOperario, setMostrarFormOperario] = useState(false)
  const [mostrarFormGestora, setMostrarFormGestora] = useState(false)

  const [nuevoInstituto, setNuevoInstituto] = useState({ nombre: '', sigla: '', responsable: '' })
  const [nuevoOperario, setNuevoOperario] = useState({ nombre: '', email: '', password: '' })
  const [nuevaGestora, setNuevaGestora] = useState({ nombre: '', email: '' })

  // Tabs disponibles
  const tabs = [
    { id: 'institutos', label: 'Institutos', icon: Building2 },
    { id: 'operarios', label: 'Operarios Ecopunto', icon: Users },
    { id: 'gestoras', label: 'Gestoras', icon: Factory }
  ]

  // Handler para agregar instituto (no persiste)
  const handleAgregarInstituto = () => {
    if (!nuevoInstituto.nombre || !nuevoInstituto.sigla || !nuevoInstituto.responsable) {
      toast.warning('Por favor completá todos los campos')
      return
    }
    toast.info(`Instituto "${nuevoInstituto.sigla}" agregado (no persiste en MVP)`)
    setNuevoInstituto({ nombre: '', sigla: '', responsable: '' })
    setMostrarFormInstituto(false)
  }

  // Handler para agregar operario
  const handleAgregarOperario = () => {
    if (!nuevoOperario.nombre || !nuevoOperario.email || !nuevoOperario.password) {
      toast.warning('Por favor completá todos los campos')
      return
    }

    const nuevoId = `USER-${Date.now()}`
    dispatch({
      type: 'AGREGAR_USUARIO',
      payload: {
        id: nuevoId,
        nombre: nuevoOperario.nombre,
        email: nuevoOperario.email,
        password: nuevoOperario.password,
        rol: 'ecopunto'
      }
    })

    toast.success(`Operario ${nuevoOperario.nombre} agregado correctamente`)
    setNuevoOperario({ nombre: '', email: '', password: '' })
    setMostrarFormOperario(false)
  }

  // Handler para eliminar operario
  const handleEliminarOperario = (operario) => {
    if (confirm(`¿Eliminar operario "${operario.nombre}"?\n\nEsta acción no se puede deshacer.`)) {
      dispatch({
        type: 'ELIMINAR_USUARIO',
        payload: operario.id
      })
      toast.success(`Operario ${operario.nombre} eliminado`)
    }
  }

  // Handler para agregar gestora
  const handleAgregarGestora = () => {
    if (!nuevaGestora.nombre || !nuevaGestora.email) {
      toast.warning('Por favor completá todos los campos')
      return
    }

    const nuevoId = `G${String(state.gestoras.length + 1).padStart(3, '0')}`
    dispatch({
      type: 'AGREGAR_GESTORA',
      payload: {
        id: nuevoId,
        nombre: nuevaGestora.nombre,
        email: nuevaGestora.email,
        scoring: state.config.scoring_inicial || 50,
        habilitacion_ministerio: false,
        certificados_entregados: 0,
        certificados_a_tiempo: 0
      }
    })

    toast.success(`Gestora ${nuevaGestora.nombre} agregada correctamente`)
    setNuevaGestora({ nombre: '', email: '' })
    setMostrarFormGestora(false)
  }

  // Handler para eliminar gestora
  const handleEliminarGestora = (gestora) => {
    if (confirm(
      `¿Eliminar gestora "${gestora.nombre}"?\n\n` +
      `Esta acción no se puede deshacer.\n` +
      `Los lotes ya asignados quedarán sin gestora.`
    )) {
      dispatch({
        type: 'ELIMINAR_GESTORA',
        payload: gestora.id
      })
      toast.success(`Gestora ${gestora.nombre} eliminada`)
    }
  }

  // Handler para toggle de habilitación
  const handleToggleHabilitacion = async (gestoraId, nombreGestora, habilitacionActual) => {
    const accion = habilitacionActual ? 'deshabilitar' : 'habilitar'
    if (confirm(
      `¿Confirmar ${accion} a "${nombreGestora}"?\n\n` +
      (habilitacionActual
        ? 'No podrá participar en nuevas licitaciones.'
        : 'Podrá ver y solicitar lotes disponibles.')
    )) {
      try {
        // Actualizar en Supabase (usamos el campo 'activa' en lugar de 'habilitacion_ministerio')
        await actualizarGestora(gestoraId, {
          activa: !habilitacionActual
        })

        // Actualizar estado local
        dispatch({
          type: 'TOGGLE_HABILITACION_GESTORA',
          payload: gestoraId
        })

        toast.success(`${nombreGestora} ${habilitacionActual ? 'deshabilitada' : 'habilitada'}`)
      } catch (error) {
        console.error('Error actualizando gestora:', error)
        toast.error('Error al actualizar la gestora. Intentá de nuevo.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <PageHeader
          title="Gestión de Actores"
          description="Administración de institutos, operarios y gestoras"
          actions={
            <Button variant="ghost" icon={<ArrowLeft size={18} />} onClick={() => navigate('/admin')}>
              Volver
            </Button>
          }
        />

        {/* Tabs */}
        <Card padding="none" className="overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setTabActiva(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  tabActiva === tab.id
                    ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* TAB INSTITUTOS */}
            {tabActiva === 'institutos' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Institutos Registrados ({state.institutos?.length || 0})
                  </h2>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Plus size={16} />}
                    onClick={() => setMostrarFormInstituto(!mostrarFormInstituto)}
                  >
                    Agregar Instituto
                  </Button>
                </div>

                {mostrarFormInstituto && (
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Nuevo Instituto</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Nombre completo"
                        value={nuevoInstituto.nombre}
                        onChange={(e) => setNuevoInstituto({ ...nuevoInstituto, nombre: e.target.value })}
                        className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="Sigla"
                        value={nuevoInstituto.sigla}
                        onChange={(e) => setNuevoInstituto({ ...nuevoInstituto, sigla: e.target.value })}
                        className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                      <input
                        type="email"
                        placeholder="Email responsable"
                        value={nuevoInstituto.responsable}
                        onChange={(e) => setNuevoInstituto({ ...nuevoInstituto, responsable: e.target.value })}
                        className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAgregarInstituto}>Guardar</Button>
                      <Button size="sm" variant="ghost" onClick={() => {
                        setMostrarFormInstituto(false)
                        setNuevoInstituto({ nombre: '', sigla: '', responsable: '' })
                      }}>Cancelar</Button>
                    </div>
                    <p className="text-xs text-amber-600 dark:text-amber-400">⚠️ MVP: No persiste al recargar</p>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Sigla</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Nombre</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Responsable</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.institutos?.map((instituto) => (
                        <tr key={instituto.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                          <td className="py-3 px-4">
                            <span className="font-semibold text-primary-500">{instituto.sigla}</span>
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{instituto.nombre}</td>
                          <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-sm">{instituto.responsable}</td>
                          <td className="py-3 px-4 text-center">
                            {instituto.activo ? (
                              <Badge variant="success" size="sm">
                                <CheckCircle size={12} />
                                Activo
                              </Badge>
                            ) : (
                              <Badge variant="default" size="sm">
                                <XCircle size={12} />
                                Inactivo
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB OPERARIOS */}
            {tabActiva === 'operarios' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Operarios de Ecopunto ({state.usuarios?.filter(u => u.rol === 'ecopunto').length || 0})
                  </h2>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Plus size={16} />}
                    onClick={() => setMostrarFormOperario(!mostrarFormOperario)}
                  >
                    Agregar Operario
                  </Button>
                </div>

                {mostrarFormOperario && (
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Nuevo Operario</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Nombre completo"
                        value={nuevoOperario.nombre}
                        onChange={(e) => setNuevoOperario({ ...nuevoOperario, nombre: e.target.value })}
                        className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={nuevoOperario.email}
                        onChange={(e) => setNuevoOperario({ ...nuevoOperario, email: e.target.value })}
                        className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                      <input
                        type="password"
                        placeholder="Contraseña"
                        value={nuevoOperario.password}
                        onChange={(e) => setNuevoOperario({ ...nuevoOperario, password: e.target.value })}
                        className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAgregarOperario}>Guardar</Button>
                      <Button size="sm" variant="ghost" onClick={() => {
                        setMostrarFormOperario(false)
                        setNuevoOperario({ nombre: '', email: '', password: '' })
                      }}>Cancelar</Button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {state.usuarios?.filter(u => u.rol === 'ecopunto').map((operario) => (
                    <div
                      key={operario.id}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{operario.nombre}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{operario.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="success" size="sm">
                          <CheckCircle size={12} />
                          Activo
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEliminarOperario(operario)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB GESTORAS */}
            {tabActiva === 'gestoras' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Gestoras Registradas ({state.gestoras?.length || 0})
                  </h2>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Plus size={16} />}
                    onClick={() => setMostrarFormGestora(!mostrarFormGestora)}
                  >
                    Agregar Gestora
                  </Button>
                </div>

                {mostrarFormGestora && (
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Nueva Gestora</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Nombre de la empresa"
                        value={nuevaGestora.nombre}
                        onChange={(e) => setNuevaGestora({ ...nuevaGestora, nombre: e.target.value })}
                        className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                      <input
                        type="email"
                        placeholder="Email de contacto"
                        value={nuevaGestora.email}
                        onChange={(e) => setNuevaGestora({ ...nuevaGestora, email: e.target.value })}
                        className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAgregarGestora}>Guardar</Button>
                      <Button size="sm" variant="ghost" onClick={() => {
                        setMostrarFormGestora(false)
                        setNuevaGestora({ nombre: '', email: '' })
                      }}>Cancelar</Button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      💡 Scoring inicial: {state.config.scoring_inicial} · Habilitación: Deshabilitada por defecto
                    </p>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Nombre</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Email</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Scoring</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Certificados</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Habilitación</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.gestoras?.map((gestora) => (
                        <tr key={gestora.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                          <td className="py-3 px-4">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">{gestora.nombre}</span>
                          </td>
                          <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-sm">{gestora.email}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Award size={16} className="text-primary-500" />
                              <span className="font-bold text-primary-500">{gestora.scoring}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            {gestora.certificados_a_tiempo} / {gestora.certificados_entregados}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleToggleHabilitacion(gestora.id, gestora.nombre, gestora.habilitacion_ministerio)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                gestora.habilitacion_ministerio ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  gestora.habilitacion_ministerio ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEliminarGestora(gestora)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    💡 <strong>Habilitación del Ministerio:</strong> Solo gestoras habilitadas pueden participar en licitaciones.
                    Deshabilitar una gestora no afecta sus lotes ya adjudicados.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
