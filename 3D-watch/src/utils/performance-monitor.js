/**
 * @fileoverview Performance monitoring utility for FPS, memory, and draw calls tracking
 */

import Stats from 'stats.js'

/**
 * @typedef {import('../types/index.js').PerformanceMetrics} PerformanceMetrics
 */

/**
 * Performance monitor class
 * Tracks FPS, memory usage, draw calls, and triangle count
 */
export class PerformanceMonitor {
  /**
   * @param {Object} [options] - Monitor options
   * @param {boolean} [options.enabled=false] - Whether monitoring is enabled
   * @param {number} [options.updateInterval=16] - Update interval in ms
   */
  constructor(options = {}) {
    this.enabled = options.enabled || false
    this.updateInterval = options.updateInterval || 16
    this.stats = null
    this.metrics = {
      fps: 0,
      memory: 0,
      drawCalls: 0,
      triangles: 0
    }
    this.lastUpdateTime = 0
    this.listeners = []
    
    if (this.enabled) {
      this.initStats()
    }
  }

  /**
   * Initialize Stats.js panels
   * @private
   */
  initStats() {
    this.stats = new Stats()
    this.stats.showPanel(0)
    this.stats.dom.classList.add('stats-overlay')
    
    if (this.enabled) {
      document.body.appendChild(this.stats.dom)
    }
  }

  /**
   * Enable performance monitoring
   * @returns {void}
   */
  enable() {
    if (!this.enabled) {
      this.enabled = true
      if (!this.stats) {
        this.initStats()
      }
      if (this.stats && this.stats.dom && !this.stats.dom.parentElement) {
        document.body.appendChild(this.stats.dom)
      }
    }
  }

  /**
   * Disable performance monitoring
   * @returns {void}
   */
  disable() {
    if (this.enabled) {
      this.enabled = false
      if (this.stats && this.stats.dom && this.stats.dom.parentElement) {
        document.body.removeChild(this.stats.dom)
      }
    }
  }

  /**
   * Toggle performance monitoring on/off
   * @returns {boolean} New enabled state
   */
  toggle() {
    if (this.enabled) {
      this.disable()
    } else {
      this.enable()
    }
    return this.enabled
  }

  /**
   * Begin frame measurement
   * @returns {void}
   */
  begin() {
    if (this.enabled && this.stats) {
      this.stats.begin()
    }
  }

  /**
   * End frame measurement
   * @returns {void}
   */
  end() {
    if (this.enabled && this.stats) {
      this.stats.end()
    }
  }

  /**
   * Update metrics from renderer info
   * @param {THREE.WebGLRenderer} renderer - Three.js renderer
   * @returns {void}
   */
  update(renderer) {
    if (!this.enabled) {
      return
    }

    const now = performance.now()
    if (now - this.lastUpdateTime < this.updateInterval) {
      return
    }

    this.lastUpdateTime = now

    if (renderer && renderer.info) {
      this.metrics.drawCalls = renderer.info.render.calls
      this.metrics.triangles = renderer.info.render.triangles
    }

    if (performance.memory) {
      this.metrics.memory = Math.round(performance.memory.usedJSHeapSize / 1048576)
    }

    this.metrics.fps = this.getFPS()

    this.notifyListeners(this.metrics)
  }

  /**
   * Get current FPS from Stats.js
   * @private
   * @returns {number} Current FPS
   */
  getFPS() {
    if (this.stats && this.stats.getFPS) {
      return Math.round(this.stats.getFPS())
    }
    return 60
  }

  /**
   * Get current performance metrics
   * @returns {PerformanceMetrics} Current metrics
   */
  getMetrics() {
    return { ...this.metrics }
  }

  /**
   * Add a listener for metric updates
   * @param {Function} callback - Callback function receiving metrics
   * @returns {void}
   */
  addListener(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback)
    }
  }

  /**
   * Remove a listener
   * @param {Function} callback - Callback to remove
   * @returns {void}
   */
  removeListener(callback) {
    const index = this.listeners.indexOf(callback)
    if (index !== -1) {
      this.listeners.splice(index, 1)
    }
  }

  /**
   * Notify all listeners of metric updates
   * @private
   * @param {PerformanceMetrics} metrics - Updated metrics
   * @returns {void}
   */
  notifyListeners(metrics) {
    this.listeners.forEach(callback => {
      try {
        callback(metrics)
      } catch (error) {
        console.error('Error in performance listener:', error)
      }
    })
  }

  /**
   * Check if current performance meets targets
   * @param {Object} targets - Performance targets
   * @param {number} targets.minFPS - Minimum acceptable FPS
   * @param {number} targets.maxMemoryMB - Maximum memory in MB
   * @returns {Object} Performance check results
   */
  checkPerformance(targets) {
    const { minFPS, maxMemoryMB } = targets
    const meetsFPSTarget = this.metrics.fps >= minFPS
    const meetsMemoryTarget = this.metrics.memory <= maxMemoryMB

    return {
      passing: meetsFPSTarget && meetsMemoryTarget,
      meetsFPSTarget,
      meetsMemoryTarget,
      currentFPS: this.metrics.fps,
      currentMemory: this.metrics.memory,
      targetFPS: minFPS,
      targetMemory: maxMemoryMB
    }
  }

  /**
   * Dispose of performance monitor resources
   * @returns {void}
   */
  dispose() {
    this.disable()
    this.listeners = []
    this.stats = null
  }
}

export default PerformanceMonitor
