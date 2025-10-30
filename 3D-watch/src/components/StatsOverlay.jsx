/**
 * @fileoverview Stats.js performance overlay component
 */

import { useEffect, useRef } from 'react'
import Stats from 'stats.js'
import { UI_SETTINGS } from '../utils/constants'

/**
 * StatsOverlay Component
 * Displays FPS and memory stats with keyboard toggle
 * @param {Object} props
 * @param {boolean} [props.initiallyVisible=false] - Whether stats are visible on mount
 * @returns {null}
 */
function StatsOverlay({ initiallyVisible = false }) {
  const statsRef = useRef(null)
  const isVisibleRef = useRef(initiallyVisible)
  const rafRef = useRef(null)

  useEffect(() => {
    const stats = new Stats()
    stats.showPanel(0)
    
    stats.dom.style.position = 'fixed'
    stats.dom.style.top = '10px'
    stats.dom.style.left = '10px'
    stats.dom.style.zIndex = '10000'
    stats.dom.style.opacity = '0.9'
    
    statsRef.current = stats

    if (initiallyVisible) {
      document.body.appendChild(stats.dom)
    }

    const handleKeyPress = (event) => {
      if (event.key === UI_SETTINGS.STATS_TOGGLE_KEY) {
        isVisibleRef.current = !isVisibleRef.current
        
        if (isVisibleRef.current) {
          if (!stats.dom.parentElement) {
            document.body.appendChild(stats.dom)
          }
        } else {
          if (stats.dom.parentElement) {
            document.body.removeChild(stats.dom)
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    const animate = () => {
      if (isVisibleRef.current && statsRef.current) {
        statsRef.current.begin()
        statsRef.current.end()
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      
      if (stats.dom && stats.dom.parentElement) {
        document.body.removeChild(stats.dom)
      }
    }
  }, [initiallyVisible])

  return null
}

export default StatsOverlay
