/**
 * ErrorBoundary - Captura errores de React y muestra UI de error enterprise
 */

import { Component } from 'react'
import { AlertTriangle, Home, ArrowLeft } from '../atoms/Icon'
import Button from '../atoms/Button'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ Error capturado por ErrorBoundary:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.href = '/'
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
          <div className="max-w-lg w-full">
            <div className="enterprise-card p-8 text-center">
              {/* Icono de error */}
              <div className="w-16 h-16 bg-red-100 dark:bg-red-950/30 rounded-lg flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} className="text-red-600 dark:text-red-400" />
              </div>

              {/* Mensaje */}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Algo salió mal
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                La aplicación encontró un error inesperado. Intentá recargar la página o volver al inicio.
              </p>

              {/* Detalles del error (solo en dev) */}
              {import.meta.env.DEV && this.state.error && (
                <details className="text-left mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <summary className="text-sm font-medium text-red-700 dark:text-red-400 cursor-pointer mb-2">
                    Detalles técnicos (solo en desarrollo)
                  </summary>
                  <div className="text-xs text-red-600 dark:text-red-300 font-mono whitespace-pre-wrap break-words">
                    {this.state.error.toString()}
                    {this.state.errorInfo && (
                      <div className="mt-2 text-red-500 dark:text-red-400">
                        {this.state.errorInfo.componentStack}
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Acciones */}
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<ArrowLeft size={18} />}
                  onClick={this.handleReload}
                >
                  Recargar página
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  icon={<Home size={18} />}
                  onClick={this.handleReset}
                >
                  Volver al inicio
                </Button>
              </div>

              {/* Footer */}
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-6">
                Si el problema persiste, contactá al administrador del sistema
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
