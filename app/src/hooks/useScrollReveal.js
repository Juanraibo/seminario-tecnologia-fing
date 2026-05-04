/**
 * useScrollReveal - Hook para animaciones on-scroll con Intersection Observer
 * Respeta prefers-reduced-motion
 */

import { useEffect, useRef, useState } from 'react'

export default function useScrollReveal({
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  triggerOnce = true,
  delay = 0,
} = {}) {
  const elementRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Respetar prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)

          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, triggerOnce, delay])

  return { elementRef, isVisible }
}

/**
 * useScrollRevealList - Hook para revelar listas con stagger
 */
export function useScrollRevealList({
  itemCount,
  staggerDelay = 50,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
} = {}) {
  const containerRef = useRef(null)
  const [visibleItems, setVisibleItems] = useState([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setVisibleItems(Array.from({ length: itemCount }, (_, i) => i))
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Revelar items con stagger
          Array.from({ length: itemCount }, (_, i) => i).forEach((index) => {
            setTimeout(() => {
              setVisibleItems((prev) => [...prev, index])
            }, index * staggerDelay)
          })

          observer.unobserve(container)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [itemCount, staggerDelay, threshold, rootMargin])

  return { containerRef, visibleItems }
}
