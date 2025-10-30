/**
 * @fileoverview Memory benchmark for detecting memory leaks and usage
 */

import { PERFORMANCE_TARGETS } from '../../src/utils/constants.js'

/**
 * Memory Benchmark Test
 * Measures heap size before/after model load and detects memory leaks
 */
class MemoryBenchmark {
  constructor() {
    this.snapshots = []
    this.baselineMemory = 0
  }

  /**
   * Check if Memory API is available
   * @returns {boolean}
   */
  isSupported() {
    return !!(performance.memory)
  }

  /**
   * Get current memory usage
   * @returns {Object|null} Memory info
   */
  getCurrentMemory() {
    if (!this.isSupported()) {
      return null
    }

    const memory = performance.memory
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usedMB: Math.round(memory.usedJSHeapSize / 1048576),
      totalMB: Math.round(memory.totalJSHeapSize / 1048576),
      limitMB: Math.round(memory.jsHeapSizeLimit / 1048576)
    }
  }

  /**
   * Take a memory snapshot
   * @param {string} label - Snapshot label
   * @returns {void}
   */
  takeSnapshot(label) {
    const memory = this.getCurrentMemory()
    if (memory) {
      this.snapshots.push({
        label,
        timestamp: performance.now(),
        memory
      })
    }
  }

  /**
   * Set baseline memory usage
   * @returns {void}
   */
  setBaseline() {
    this.takeSnapshot('baseline')
    const memory = this.getCurrentMemory()
    if (memory) {
      this.baselineMemory = memory.usedMB
    }
  }

  /**
   * Calculate memory delta from baseline
   * @returns {Object} Memory comparison
   */
  compareToBaseline() {
    const current = this.getCurrentMemory()
    if (!current) {
      return null
    }

    const delta = current.usedMB - this.baselineMemory
    const percentIncrease = ((delta / this.baselineMemory) * 100).toFixed(1)

    return {
      baseline: this.baselineMemory,
      current: current.usedMB,
      delta,
      percentIncrease: percentIncrease + '%'
    }
  }

  /**
   * Run memory leak detection test
   * @param {Function} testFunc - Function to test for leaks
   * @param {number} iterations - Number of iterations
   * @returns {Promise<Object>} Leak detection results
   */
  async detectLeaks(testFunc, iterations = 10) {
    if (!this.isSupported()) {
      return { supported: false }
    }

    this.setBaseline()
    const memoryReadings = []

    for (let i = 0; i < iterations; i++) {
      await testFunc()
      
      if (global.gc) {
        global.gc()
      }
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const memory = this.getCurrentMemory()
      memoryReadings.push(memory.usedMB)
    }

    const avgMemory = memoryReadings.reduce((a, b) => a + b, 0) / memoryReadings.length
    const maxMemory = Math.max(...memoryReadings)
    const minMemory = Math.min(...memoryReadings)
    const trend = memoryReadings[memoryReadings.length - 1] - memoryReadings[0]

    const hasLeak = trend > 50

    return {
      supported: true,
      iterations,
      baseline: this.baselineMemory,
      avgMemory: avgMemory.toFixed(2),
      maxMemory,
      minMemory,
      trend: trend.toFixed(2),
      hasLeak,
      readings: memoryReadings
    }
  }

  /**
   * Get benchmark results
   * @returns {Object} Memory benchmark results
   */
  getResults() {
    if (!this.isSupported()) {
      return {
        supported: false,
        message: 'Memory API not available in this browser'
      }
    }

    const current = this.getCurrentMemory()
    const isMobile = /Mobi|Android/i.test(navigator.userAgent)
    const targetMemory = isMobile 
      ? PERFORMANCE_TARGETS.MAX_MEMORY_MB_MOBILE
      : PERFORMANCE_TARGETS.MAX_MEMORY_MB_DESKTOP

    return {
      supported: true,
      current: current.usedMB,
      target: targetMemory,
      passed: current.usedMB <= targetMemory,
      snapshots: this.snapshots,
      comparison: this.compareToBaseline()
    }
  }

  /**
   * Reset benchmark
   * @returns {void}
   */
  reset() {
    this.snapshots = []
    this.baselineMemory = 0
  }
}

export default MemoryBenchmark
