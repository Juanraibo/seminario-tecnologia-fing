import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Button from '../../components/atoms/Button'
import { ArrowLeft, Building2, Users, Factory, Plus, CheckCircle, XCircle, Award, Trash2 } from '../../components/atoms/Icon'

export default function GestionActores() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [tabActiva, setTabActiva] = useState('institutos')

  // Estados para formularios
  const [mostrarFormInstituto, setMostrarFormInstituto] = useState(false)
  const [mostrarFormOperario, setMostrarFormOperario] = useState(false)
  const [mostrarFormGestora, setMostrarFormGestora] = useState(false)

  const [nuevoInstituto, setNuevoInstituto] = useState({ nombre: '', sigla: '', responsable: '' })
  const [nuevoOperario, setNuevoOperario] = useState({ nombre: '', email: '', password: '' })
  const [nuevaGestora, setNuevaGestora] = useState({ nombre: '', email: '' })

  // Handler para agregar instituto (no persiste)
  const handleAgregarInstituto = () => {
    if (!nuevoInstituto.nombre || !nuevoInstituto.sigla || !nuevoInstituto.responsable) {
      alert('Por favor completá todos los campos')
      return
    }
    alert(`Instituto "${nuevoInstituto.sigla}" agregado (no persiste - MVP)`)
    setNuevoInstituto({ nombre: '', sigla: '', responsable: '' })
    setMostrarFormInstituto(false)
  }

  // Handler para agregar operario
  const handleAgregarOperario = () => {
    if (!nuevoOperario.nombre || !nuevoOperario.email || !nuevoOperario.password) {
      alert('Por favor completá todos los campos')
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
    }
  }

  // Handler para agregar gestora
  const handleAgregarGestora = () => {
    if (!nuevaGestora.nombre || !nuevaGestora.email) {
      alert('Por favor completá todos los campos')
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
    }
  }

  // Handler para toggle de habilitación
  const handleToggleHabilitacion = (gestoraId, nombreGestora, habilitacionActual) => {
    const accion = habilitacionActual ? 'deshabilitar' : 'habilitar'
    if (confirm(
      `¿Confirmar ${accion} a "${nombreGestora}"?\n\n` +
      (habilitacionActual
        ? 'No podrá participar en nuevas licitaciones.'
        : 'Podrá ver y solicitar lotes disponibles.')
    )) {
      dispatch({
        type: 'TOGGLE_HABILITACION_GESTORA',
        payload: gestoraId
      })
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradiente de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 via-transparent to-secondary-500/5"></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Volver
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">
              Gestión de Actores
            </h1>
            <p className="text-gray-400">
              Administración de institutos, operarios y gestoras
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-800">
            {[
              { id: 'institutos', label: 'Institutos', icon: Building2 },
              { id: 'operarios', label: 'Operarios Ecopunto', icon: Users },
              { id: 'gestoras', label: 'Gestoras', icon: Factory }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTabActiva(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  tabActiva === tab.id
                    ? 'bg-primary-500/10 text-primary-400 border-b-2 border-primary-500'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
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
                  <h2 className="text-lg font-semibold text-white">
                    Institutos Registrados ({state.institutos?.length || 0})
                  </h2>
                  <Button
                    onClick={() => setMostrarFormInstituto(!mostrarFormInstituto)}
                    className="flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Agregar Instituto
                  </Button>
                </div>

                {mostrarFormInstituto && (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-white">Nuevo Instituto</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Nombre completo"
                        value={nuevoInstituto.nombre}
                        onChange={(e) => setNuevoInstituto({ ...nuevoInstituto, nombre: e.target.value })}
                        className="bg-gray-950/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Sigla"
                        value={nuevoInstituto.sigla}
                        onChange={(e) => setNuevoInstituto({ ...nuevoInstituto, sigla: e.target.value })}
                        className="bg-gray-950/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        type="email"
                        placeholder="Email responsable"
                        value={nuevoInstituto.responsable}
                        onChange={(e) => setNuevoInstituto({ ...nuevoInstituto, responsable: e.target.value })}
                        className="bg-gray-950/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAgregarInstituto}>Guardar</Button>
                      <Button size="sm" variant="ghost" onClick={() => {
                        setMostrarFormInstituto(false)
                        setNuevoInstituto({ nombre: '', sigla: '', responsable: '' })
                      }}>Cancelar</Button>
                    </div>
                    <p className="text-xs text-amber-400">⚠️ MVP: No persiste al recargar</p>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Sigla</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Nombre</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Responsable</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.institutos?.map((instituto) => (
                        <tr key={instituto.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                          <td className="py-3 px-4">
                            <span className="font-semibold text-primary-400">{instituto.sigla}</span>
                          </td>
                          <td className="py-3 px-4 text-white">{instituto.nombre}</td>
                          <td className="py-3 px-4 text-gray-400 text-sm">{instituto.responsable}</td>
                          <td className="py-3 px-4 text-center">
                            {instituto.activo ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/30">
                                <CheckCircle size={12} />
                                Activo
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-500/10 text-gray-400 border border-gray-500/30">
                                <XCircle size={12} />
                                Inactivo
                              </span>
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
                  <h2 className="text-lg font-semibold text-white">
                    Operarios de Ecopunto ({state.usuarios?.filter(u => u.rol === 'ecopunto').length || 0})
                  </h2>
                  <Button
                    onClick={() => setMostrarFormOperario(!mostrarFormOperario)}
                    className="flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Agregar Operario
                  </Button>
                </div>

                {mostrarFormOperario && (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-white">Nuevo Operario</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Nombre completo"
                        value={nuevoOperario.nombre}
                        onChange={(e) => setNuevoOperario({ ...nuevoOperario, nombre: e.target.value })}
                        className="bg-gray-950/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={nuevoOperario.email}
                        onChange={(e) => setNuevoOperario({ ...nuevoOperario, email: e.target.value })}
                        className="bg-gray-950/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        type="password"
                        placeholder="Contraseña"
                        value={nuevoOperario.password}
                        onChange={(e) => setNuevoOperario({ ...nuevoOperario, password: e.target.value })}
                        className="bg-gray-950/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
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
                      className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-white">{operario.nombre}</p>
                        <p className="text-sm text-gray-400">{operario.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/30">
                          <CheckCircle size={12} />
                          Activo
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEliminarOperario(operario)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
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
                  <h2 className="text-lg font-semibold text-white">
                    Gestoras Registradas ({state.gestoras?.length || 0})
                  </h2>
                  <Button
                    onClick={() => setMostrarFormGestora(!mostrarFormGestora)}
                    className="flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Agregar Gestora
                  </Button>
                </div>

                {mostrarFormGestora && (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-white">Nueva Gestora</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Nombre de la empresa"
                        value={nuevaGestora.nombre}
                        onChange={(e) => setNuevaGestora({ ...nuevaGestora, nombre: e.target.value })}
                        className="bg-gray-950/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        type="email"
                        placeholder="Email de contacto"
                        value={nuevaGestora.email}
                        onChange={(e) => setNuevaGestora({ ...nuevaGestora, email: e.target.value })}
                        className="bg-gray-950/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAgregarGestora}>Guardar</Button>
                      <Button size="sm" variant="ghost" onClick={() => {
                        setMostrarFormGestora(false)
                        setNuevaGestora({ nombre: '', email: '' })
                      }}>Cancelar</Button>
                    </div>
                    <p className="text-xs text-gray-400">
                      💡 Scoring inicial: {state.config.scoring_inicial} · Habilitación: Deshabilitada por defecto
                    </p>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Nombre</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Email</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Scoring</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Certificados</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Habilitación</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.gestoras?.map((gestora) => (
                        <tr key={gestora.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                          <td className="py-3 px-4">
                            <span className="font-semibold text-white">{gestora.nombre}</span>
                          </td>
                          <td className="py-3 px-4 text-gray-400 text-sm">{gestora.email}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Award size={16} className="text-primary-400" />
                              <span className="font-bold text-primary-400">{gestora.scoring}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center text-sm text-gray-400">
                            {gestora.certificados_a_tiempo} / {gestora.certificados_entregados}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleToggleHabilitacion(gestora.id, gestora.nombre, gestora.habilitacion_ministerio)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                gestora.habilitacion_ministerio ? 'bg-green-500' : 'bg-gray-600'
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
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-sm text-blue-300">
                    💡 <strong>Habilitación del Ministerio:</strong> Solo gestoras habilitadas pueden participar en licitaciones.
                    Deshabilitar una gestora no afecta sus lotes ya adjudicados.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
