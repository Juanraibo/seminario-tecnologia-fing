import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from '../atoms/Icon'

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const styles = {
    success: {
      bg: 'bg-green-500/90',
      border: 'border-green-400',
      text: 'text-white',
      icon: CheckCircle,
      iconColor: 'text-green-100'
    },
    error: {
      bg: 'bg-red-500/90',
      border: 'border-red-400',
      text: 'text-white',
      icon: AlertCircle,
      iconColor: 'text-red-100'
    },
    warning: {
      bg: 'bg-amber-500/90',
      border: 'border-amber-400',
      text: 'text-white',
      icon: AlertTriangle,
      iconColor: 'text-amber-100'
    },
    info: {
      bg: 'bg-blue-500/90',
      border: 'border-blue-400',
      text: 'text-white',
      icon: Info,
      iconColor: 'text-blue-100'
    }
  }

  const style = styles[type]
  const Icon = style.icon

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${style.bg} ${style.border} ${style.text} backdrop-blur-xl border rounded-xl shadow-2xl p-4 min-w-[300px] max-w-md`}>
        <div className="flex items-start gap-3">
          <Icon size={20} className={style.iconColor} />
          <p className="flex-1 text-sm font-medium">{message}</p>
          {onClose && (
            <button
              onClick={onClose}
              className="hover:opacity-70 transition-opacity"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Hook para usar toasts fácilmente
export function useToast() {
  const showToast = (message, type = 'info') => {
    const event = new CustomEvent('show-toast', {
      detail: { message, type }
    })
    window.dispatchEvent(event)
  }

  return {
    success: (message) => showToast(message, 'success'),
    error: (message) => showToast(message, 'error'),
    warning: (message) => showToast(message, 'warning'),
    info: (message) => showToast(message, 'info')
  }
}
