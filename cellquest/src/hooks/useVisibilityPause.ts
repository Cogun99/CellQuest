import { useEffect, useState, type RefCallback } from 'react'

/** True when the document is hidden or the observed element is offscreen. */
export function useShouldPauseAnimation(): {
  shouldPause: boolean
  observeRef: RefCallback<HTMLElement>
} {
  const [hidden, setHidden] = useState(
    () => typeof document !== 'undefined' && document.visibilityState === 'hidden',
  )
  const [offscreen, setOffscreen] = useState(false)
  const [element, setElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const onVis = () => setHidden(document.visibilityState === 'hidden')
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  useEffect(() => {
    if (!element || typeof IntersectionObserver === 'undefined') {
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => setOffscreen(!entry?.isIntersecting),
      { threshold: 0.05 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [element])

  return {
    shouldPause: hidden || offscreen,
    observeRef: setElement,
  }
}
