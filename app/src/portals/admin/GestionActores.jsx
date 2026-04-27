import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Button from '../../components/atoms/Button'
import { ArrowLeft, Building2, Users, Factory, Plus, CheckCircle, XCircle, Award } from '../../components/atoms/Icon'

export default function GestionActores() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [tabActiva, setTabActiva] = useState('institutos')

  // Estados para formulario de nuevo instituto
  const [mostrarFormInstituto, setMostrarFormInstituto] = useState(false)
  const [nuevoInstituto, setNuevoInstituto] = useState({
    nombre: '',
    sigla: '',
    responsable: ''
  })

  // Handler para agregar instituto
  const handleAgregarInstituto = () => {
    if (!nuevoInstituto.nombre || !nuevoInstituto.sigla || !nuevoInstituto.responsable) {
      alert('Por favor completá todos los campos')
      return
    }

    // En un sistema real esto haría un POST al backend
    // Por ahora solo mostramos confirmación (no persiste)
    alert(`Instituto "${nuevoInstituto.sigla}" agregado exitosamente (no persiste - es MVP)`)

    setNuevoInstituto({ nombre: '', sigla: '', responsable: '' })
    setMostrarFormInstituto(false)
  }

  // Handler para toggle de habilitación de gestora
  const handleToggleHabilitacion = (gestoraId, nombreGestora, habilitacionActual) => {
    const accion = habilitacionActual ? 'deshabilitar' : 'habilitar'
    const confirmacion = confirm(
      `¿Confirmar ${accion} a "${nombreGestora}"?\n\n` +
      (habilitacionActual
        ? 'No podrá participar en nuevas licitaciones.'
        : 'Podrá ver y solicitar lotes disponibles.')
    )

    if (confirmacion) {
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
            <button
              onClick={() => setTabActiva('institutos')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                tabActiva === 'institutos'
                  ? 'bg-primary-500/10 text-primary-400 border-b-2 border-primary-500'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
              }`}
            >
              <Building2 size={18} />
              Institutos
            </button>
            <button
              onClick={() => setTabActiva('operarios')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                tabActiva === 'operarios'
                  ? 'bg-primary-500/10 text-primary-400 border-b-2 border-primary-500'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
              }`}
            >
              <Users size={18} />
              Operarios Ecopunto
            </button>
            <button
              onClick={() => setTabActiva('gestoras')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                tabActiva === 'gestoras'
                  ? 'bg-primary-500/10 text-primary-400 border-b-2 border-primary-500'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
              }`}
            >
              <Factory size={18} />
              Gestoras
            </button>
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

                {/* Formulario de nuevo instituto */}
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
                      <Button size="sm" onClick={handleAgregarInstituto}>
                        Guardar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setMostrarFormInstituto(false)
                          setNuevoInstituto({ nombre: '', sigla: '', responsable: '' })
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                    <p className="text-xs text-amber-400">
                      ⚠️ MVP: Los datos no persisten al recargar
                    </p>
                  </div>
                )}

                {/* Tabla de institutos */}
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
                <h2 className="text-lg font-semibold text-white">
                  Operarios de Ecopunto ({state.usuarios?.filter(u => u.rol === 'ecopunto').length || 0})
                </h2>

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
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/30">
                        <CheckCircle size={12} />
                        Activo
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  💡 Alta/baja de operarios se gestiona externamente por el área de RRHH
                </p>
              </div>
            )}

            {/* TAB GESTORAS */}
            {tabActiva === 'gestoras' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">
                  Gestoras Registradas ({state.gestoras?.length || 0})
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Nombre</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Email</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Scoring</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Certificados</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Habilitación</th>
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
                              onClick={() => handleToggleHabilitacion(
                                gestora.id,
                                gestora.nombre,
                                gestora.habilitacion_ministerio
                              )}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                gestora.habilitacion_ministerio
                                  ? 'bg-green-500'
                                  : 'bg-gray-600'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  gestora.habilitacion_ministerio ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
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
