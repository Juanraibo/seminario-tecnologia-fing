/**
 * useSidebar - Hook para manejar el estado del sidebar
 * Persiste en localStorage, por defecto abierto en desktop
 */

import { useState, useCallback, useEffect } from 'react'

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('ecofing-sidebar-open')
      // Por defecto false (cerrado) si no hay valor guardado
      return saved !== null ? saved === 'true' : false
    } catch {
      return true
    }
  })

  // Persistir cambios en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ecofing-sidebar-open', String(isOpen))
    } catch {
      // localStorage no disponible, ignorar silenciosamente
    }
  }, [isOpen])

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  return { isOpen, toggle, close }
}
