/**
 * @fileoverview Load time benchmark for measuring model loading performance
 */

import { PERFORMANCE_TARGETS } from '../../src/utils/constants.js'

/**
 * Load Time Benchmark Test
 * Measures model fetch time, parse time, and first render time
 */
class LoadBenchmark {
  constructor() {
    this.metrics = {
      fetchStart: 0,
      fetchEnd: 0,
      parseStart: 0,
      parseEnd: 0,
      renderStart: 0,
      renderEnd: 0
    }
  }

  /**
   * Mark fetch start
   * @returns {void}
   */
  markFetchStart() {
    this.metrics.fetchStart = performance.now()
  }

  /**
   * Mark fetch end
   * @returns {void}
   */
  markFetchEnd() {
    this.metrics.fetchEnd = performance.now()
  }

  /**
   * Mark parse start
   * @returns {void}
   */
  markParseStart() {
    this.metrics.parseStart = performance.now()
  }

  /**
   * Mark parse end
   * @returns {void}
   */
  markParseEnd() {
    this.metrics.parseEnd = performance.now()
  }

  /**
   * Mark render start
   * @returns {void}
   */
  markRenderStart() {
    this.metrics.renderStart = performance.now()
  }

  /**
   * Mark render end
   * @returns {void}
   */
  markRenderEnd() {
    this.metrics.renderEnd = performance.now()
  }

  /**
   * Calculate and return results
   * @returns {Object} Benchmark results
   */
  getResults() {
    const fetchTime = this.metrics.fetchEnd - this.metrics.fetchStart
    const parseTime = this.metrics.parseEnd - this.metrics.parseStart
    const renderTime = this.metrics.renderEnd - this.metrics.renderStart
    const totalTime = this.metrics.renderEnd - this.metrics.fetchStart

    return {
      fetchTime: fetchTime.toFixed(2),
      parseTime: parseTime.toFixed(2),
      renderTime: renderTime.toFixed(2),
      totalTime: totalTime.toFixed(2),
      targetTime: PERFORMANCE_TARGETS.MAX_LOAD_TIME_MS,
      passed: totalTime <= PERFORMANCE_TARGETS.MAX_LOAD_TIME_MS,
      breakdown: {
        fetch: ((fetchTime / totalTime) * 100).toFixed(1) + '%',
        parse: ((parseTime / totalTime) * 100).toFixed(1) + '%',
        render: ((renderTime / totalTime) * 100).toFixed(1) + '%'
      }
    }
  }

  /**
   * Reset all metrics
   * @returns {void}
   */
  reset() {
    this.metrics = {
      fetchStart: 0,
      fetchEnd: 0,
      parseStart: 0,
      parseEnd: 0,
      renderStart: 0,
      renderEnd: 0
    }
  }
}

/**
 * Measure load performance using Navigation Timing API
 * @returns {Object} Load timing metrics
 */
export function getNavigationTiming() {
  if (!performance.timing) {
    return null
  }

  const timing = performance.timing
  const navigationStart = timing.navigationStart

  return {
    domContentLoaded: timing.domContentLoadedEventEnd - navigationStart,
    loadComplete: timing.loadEventEnd - navigationStart,
    domInteractive: timing.domInteractive - navigationStart,
    firstPaint: getFirstPaint()
  }
}

/**
 * Get first paint timing
 * @returns {number|null} First paint time in ms
 */
function getFirstPaint() {
  if (performance.getEntriesByType) {
    const paintEntries = performance.getEntriesByType('paint')
    const firstPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint')
    return firstPaint ? firstPaint.startTime : null
  }
  return null
}

export default LoadBenchmark
