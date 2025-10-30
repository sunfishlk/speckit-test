/**
 * @fileoverview Viewpoint transition benchmark for measuring animation performance
 */

import { ANIMATION_SETTINGS, PERFORMANCE_TARGETS } from '../../src/utils/constants.js'

/**
 * Viewpoint Transition Benchmark
 * Measures animation duration and frame rate during camera transitions
 */
class TransitionBenchmark {
  constructor() {
    this.transitions = []
    this.isRecording = false
    this.currentTransition = null
  }

  /**
   * Start recording a transition
   * @param {string} fromViewpoint - Starting viewpoint ID
   * @param {string} toViewpoint - Target viewpoint ID
   * @returns {void}
   */
  startTransition(fromViewpoint, toViewpoint) {
    if (!this.isRecording) {
      return
    }

    this.currentTransition = {
      from: fromViewpoint,
      to: toViewpoint,
      startTime: performance.now(),
      endTime: null,
      frames: [],
      duration: 0,
      avgFPS: 0,
      minFPS: Infinity,
      droppedFrames: 0
    }
  }

  /**
   * Record a frame during transition
   * @param {number} timestamp - Frame timestamp
   * @returns {void}
   */
  recordFrame(timestamp) {
    if (!this.isRecording || !this.currentTransition) {
      return
    }

    this.currentTransition.frames.push(timestamp)
  }

  /**
   * End recording current transition
   * @returns {void}
   */
  endTransition() {
    if (!this.isRecording || !this.currentTransition) {
      return
    }

    this.currentTransition.endTime = performance.now()
    this.currentTransition.duration = this.currentTransition.endTime - this.currentTransition.startTime

    const frames = this.currentTransition.frames
    if (frames.length > 1) {
      const frameTimes = []
      for (let i = 1; i < frames.length; i++) {
        frameTimes.push(frames[i] - frames[i - 1])
      }

      const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length
      this.currentTransition.avgFPS = 1000 / avgFrameTime

      frameTimes.forEach(ft => {
        const fps = 1000 / ft
        if (fps < this.currentTransition.minFPS) {
          this.currentTransition.minFPS = fps
        }
        if (fps < 30) {
          this.currentTransition.droppedFrames++
        }
      })
    }

    this.transitions.push(this.currentTransition)
    this.currentTransition = null
  }

  /**
   * Start benchmark recording
   * @returns {void}
   */
  start() {
    this.isRecording = true
    this.transitions = []
    this.currentTransition = null
  }

  /**
   * Stop recording and calculate results
   * @returns {Object} Benchmark results
   */
  stop() {
    this.isRecording = false

    if (this.transitions.length === 0) {
      return {
        transitionCount: 0,
        avgDuration: 0,
        maxDuration: 0,
        minDuration: 0,
        avgFPS: 0,
        minFPS: 0,
        totalDroppedFrames: 0,
        passed: false
      }
    }

    const durations = this.transitions.map(t => t.duration)
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length
    const maxDuration = Math.max(...durations)
    const minDuration = Math.min(...durations)

    const fpsList = this.transitions.map(t => t.avgFPS)
    const avgFPS = fpsList.reduce((a, b) => a + b, 0) / fpsList.length
    const minFPS = Math.min(...this.transitions.map(t => t.minFPS))

    const totalDroppedFrames = this.transitions.reduce((sum, t) => sum + t.droppedFrames, 0)

    const targetDuration = ANIMATION_SETTINGS.VIEWPOINT_TRANSITION_DURATION * 1000
    const durationPassed = maxDuration <= targetDuration
    const fpsPassed = minFPS >= PERFORMANCE_TARGETS.TARGET_FPS_DESKTOP

    return {
      transitionCount: this.transitions.length,
      avgDuration: avgDuration.toFixed(2),
      maxDuration: maxDuration.toFixed(2),
      minDuration: minDuration.toFixed(2),
      avgFPS: avgFPS.toFixed(2),
      minFPS: minFPS.toFixed(2),
      totalDroppedFrames,
      targetDuration,
      targetFPS: PERFORMANCE_TARGETS.TARGET_FPS_DESKTOP,
      passed: durationPassed && fpsPassed,
      durationPassed,
      fpsPassed,
      transitions: this.transitions.map(t => ({
        from: t.from,
        to: t.to,
        duration: t.duration.toFixed(2),
        avgFPS: t.avgFPS.toFixed(2),
        droppedFrames: t.droppedFrames
      }))
    }
  }

  /**
   * Reset benchmark
   * @returns {void}
   */
  reset() {
    this.transitions = []
    this.currentTransition = null
    this.isRecording = false
  }
}

/**
 * Measure a single viewpoint transition
 * @param {Function} transitionFn - Function that performs the transition
 * @param {string} fromViewpoint - Starting viewpoint ID
 * @param {string} toViewpoint - Target viewpoint ID
 * @returns {Promise<Object>} Transition metrics
 */
export async function measureTransition(transitionFn, fromViewpoint, toViewpoint) {
  const benchmark = new TransitionBenchmark()
  benchmark.start()
  benchmark.startTransition(fromViewpoint, toViewpoint)

  return new Promise((resolve) => {
    let rafId

    const recordFrame = (timestamp) => {
      benchmark.recordFrame(timestamp)
      rafId = requestAnimationFrame(recordFrame)
    }

    rafId = requestAnimationFrame(recordFrame)

    transitionFn().then(() => {
      cancelAnimationFrame(rafId)
      benchmark.endTransition()
      const results = benchmark.stop()
      resolve(results.transitions[0])
    })
  })
}

export default TransitionBenchmark
