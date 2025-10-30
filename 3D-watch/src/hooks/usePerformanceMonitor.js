/**
 * @fileoverview React hook for performance monitoring integration
 */

import { useEffect, useRef } from 'react'
import { PerformanceMonitor } from '../utils/performance-monitor'
import { useViewer } from '../context/ViewerContext'
import { UI_SETTINGS } from '../utils/constants'

/**
 * Hook to manage performance monitoring
 * @param {Object} [options] - Monitor options
 * @param {boolean} [options.enabled=false] - Initial enabled state
 * @param {THREE.WebGLRenderer} [options.renderer] - Three.js renderer
 * @returns {Object} Performance monitor API
 */
export function usePerformanceMonitor(options = {}) {
  const { actions } = useViewer()
  const monitorRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const monitor = new PerformanceMonitor({
      enabled: options.enabled || false,
      updateInterval: UI_SETTINGS.STATS_UPDATE_INTERVAL_MS
    })

    monitorRef.current = monitor

    monitor.addListener((metrics) => {
      actions.updatePerformance(metrics)
    })

    const handleKeyPress = (event) => {
      if (event.key === UI_SETTINGS.STATS_TOGGLE_KEY) {
        monitor.toggle()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    const updateLoop = () => {
      if (options.renderer && monitor.enabled) {
        monitor.update(options.renderer)
      }
      rafRef.current = requestAnimationFrame(updateLoop)
    }

    rafRef.current = requestAnimationFrame(updateLoop)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      monitor.dispose()
    }
  }, [options.renderer, options.enabled])

  return {
    enable: () => monitorRef.current?.enable(),
    disable: () => monitorRef.current?.disable(),
    toggle: () => monitorRef.current?.toggle(),
    getMetrics: () => monitorRef.current?.getMetrics()
  }
}

export default usePerformanceMonitor
