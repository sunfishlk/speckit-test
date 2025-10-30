/**
 * @fileoverview FPS benchmark for measuring frame rate during rendering
 */

import { PERFORMANCE_TARGETS } from '../../src/utils/constants.js'

/**
 * FPS Benchmark Test
 * Measures frames per second during initial render and interactions
 */
class FPSBenchmark {
  constructor() {
    this.frames = []
    this.isRunning = false
    this.startTime = 0
    this.frameCount = 0
  }

  /**
   * Start FPS measurement
   * @returns {void}
   */
  start() {
    this.isRunning = true
    this.startTime = performance.now()
    this.frameCount = 0
    this.frames = []
  }

  /**
   * Record a frame
   * @returns {void}
   */
  recordFrame() {
    if (!this.isRunning) {
      return
    }

    const now = performance.now()
    const elapsed = now - this.startTime
    this.frameCount++
    
    this.frames.push({
      timestamp: now,
      frameNumber: this.frameCount,
      elapsed
    })
  }

  /**
   * Stop measurement and calculate results
   * @returns {Object} Benchmark results
   */
  stop() {
    this.isRunning = false
    const totalTime = (performance.now() - this.startTime) / 1000
    const avgFPS = this.frameCount / totalTime

    const frameTimes = []
    for (let i = 1; i < this.frames.length; i++) {
      const deltaTime = this.frames[i].elapsed - this.frames[i - 1].elapsed
      frameTimes.push(deltaTime)
    }

    const minFrameTime = Math.min(...frameTimes)
    const maxFrameTime = Math.max(...frameTimes)
    const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length

    const maxFPS = 1000 / minFrameTime
    const minFPS = 1000 / maxFrameTime

    return {
      totalFrames: this.frameCount,
      totalTime: totalTime.toFixed(2),
      avgFPS: avgFPS.toFixed(2),
      minFPS: minFPS.toFixed(2),
      maxFPS: maxFPS.toFixed(2),
      avgFrameTime: avgFrameTime.toFixed(2),
      targetFPS: PERFORMANCE_TARGETS.TARGET_FPS_DESKTOP,
      passed: avgFPS >= PERFORMANCE_TARGETS.MIN_FPS
    }
  }

  /**
   * Get current FPS
   * @returns {number} Current FPS
   */
  getCurrentFPS() {
    if (!this.isRunning || this.frameCount < 2) {
      return 0
    }

    const now = performance.now()
    const elapsed = (now - this.startTime) / 1000
    return this.frameCount / elapsed
  }
}

/**
 * Run FPS benchmark
 * @param {number} duration - Test duration in seconds
 * @returns {Promise<Object>} Benchmark results
 */
export async function runFPSBenchmark(duration = 5) {
  const benchmark = new FPSBenchmark()
  
  return new Promise((resolve) => {
    benchmark.start()
    
    let frameId
    const animate = () => {
      benchmark.recordFrame()
      
      if (performance.now() - benchmark.startTime < duration * 1000) {
        frameId = requestAnimationFrame(animate)
      } else {
        const results = benchmark.stop()
        resolve(results)
      }
    }

    frameId = requestAnimationFrame(animate)
  })
}

export default FPSBenchmark
