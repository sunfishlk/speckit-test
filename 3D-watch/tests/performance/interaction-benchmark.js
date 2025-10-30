/**
 * @fileoverview Interaction response benchmark for measuring input latency
 */

import { PERFORMANCE_TARGETS } from '../../src/utils/constants.js'

/**
 * Interaction Response Benchmark
 * Measures input latency for mouse events
 */
class InteractionBenchmark {
  constructor() {
    this.samples = []
    this.isRecording = false
  }

  /**
   * Start recording interaction times
   * @returns {void}
   */
  start() {
    this.isRecording = true
    this.samples = []
  }

  /**
   * Record an interaction event
   * @param {string} eventType - Type of event (mousedown, mousemove, wheel, etc.)
   * @param {number} inputTime - Timestamp of input event
   * @param {number} responseTime - Timestamp of visual response
   * @returns {void}
   */
  recordInteraction(eventType, inputTime, responseTime) {
    if (!this.isRecording) {
      return
    }

    const latency = responseTime - inputTime
    this.samples.push({
      eventType,
      inputTime,
      responseTime,
      latency
    })
  }

  /**
   * Stop recording and calculate results
   * @returns {Object} Benchmark results
   */
  stop() {
    this.isRecording = false

    if (this.samples.length === 0) {
      return {
        sampleCount: 0,
        avgLatency: 0,
        minLatency: 0,
        maxLatency: 0,
        passed: false
      }
    }

    const latencies = this.samples.map(s => s.latency)
    const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length
    const minLatency = Math.min(...latencies)
    const maxLatency = Math.max(...latencies)

    const byEventType = {}
    this.samples.forEach(sample => {
      if (!byEventType[sample.eventType]) {
        byEventType[sample.eventType] = []
      }
      byEventType[sample.eventType].push(sample.latency)
    })

    const eventTypeStats = {}
    Object.keys(byEventType).forEach(type => {
      const latencies = byEventType[type]
      eventTypeStats[type] = {
        count: latencies.length,
        avgLatency: (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2),
        minLatency: Math.min(...latencies).toFixed(2),
        maxLatency: Math.max(...latencies).toFixed(2)
      }
    })

    return {
      sampleCount: this.samples.length,
      avgLatency: avgLatency.toFixed(2),
      minLatency: minLatency.toFixed(2),
      maxLatency: maxLatency.toFixed(2),
      eventTypeStats,
      targetLatency: PERFORMANCE_TARGETS.MAX_INTERACTION_RESPONSE_MS,
      passed: avgLatency <= PERFORMANCE_TARGETS.MAX_INTERACTION_RESPONSE_MS
    }
  }

  /**
   * Reset benchmark
   * @returns {void}
   */
  reset() {
    this.samples = []
    this.isRecording = false
  }
}

/**
 * Measure event handler response time
 * @param {HTMLElement} element - Element to attach listeners to
 * @param {string} eventType - Event type to measure
 * @param {number} duration - Test duration in seconds
 * @returns {Promise<Object>} Benchmark results
 */
export async function measureEventLatency(element, eventType, duration = 5) {
  const benchmark = new InteractionBenchmark()
  benchmark.start()

  return new Promise((resolve) => {
    const startTime = performance.now()
    let frameCount = 0

    const handleEvent = (event) => {
      const inputTime = event.timeStamp || performance.now()
      
      requestAnimationFrame(() => {
        const responseTime = performance.now()
        benchmark.recordInteraction(eventType, inputTime, responseTime)
        frameCount++
      })
    }

    element.addEventListener(eventType, handleEvent)

    const checkTimer = setInterval(() => {
      if (performance.now() - startTime >= duration * 1000) {
        clearInterval(checkTimer)
        element.removeEventListener(eventType, handleEvent)
        
        const results = benchmark.stop()
        results.totalDuration = duration
        results.eventsPerSecond = (frameCount / duration).toFixed(2)
        
        resolve(results)
      }
    }, 100)
  })
}

export default InteractionBenchmark
