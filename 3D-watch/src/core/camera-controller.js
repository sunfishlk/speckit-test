/**
 * @fileoverview Camera controller for viewpoint transitions and animations
 */

import * as THREE from 'three'
import gsap from 'gsap'
import { ANIMATION_SETTINGS } from '../utils/constants.js'

/**
 * @typedef {import('../types/index.js').Vector3} Vector3
 * @typedef {import('../types/index.js').Viewpoint} Viewpoint
 * @typedef {import('../types/index.js').CameraState} CameraState
 * @typedef {import('../types/index.js').CameraConstraints} CameraConstraints
 */

/**
 * CameraController class
 * Manages camera positioning, animations, and viewpoint transitions
 */
export class CameraController {
  /**
   * @param {THREE.PerspectiveCamera} camera - Three.js camera instance
   * @param {CameraConstraints} constraints - Movement constraints
   */
  constructor(camera, constraints) {
    this.camera = camera
    this.constraints = constraints
    this.target = new THREE.Vector3(0, 0, 0)
    this._isAnimating = false
    this.currentTween = null
    this.eventListeners = new Map()
  }

  /**
   * Get the controlled camera instance
   * @returns {THREE.PerspectiveCamera}
   */
  getCamera() {
    return this.camera
  }

  /**
   * Animate camera to a preset viewpoint
   * @param {Viewpoint} viewpoint - Target viewpoint
   * @param {Object} [options] - Animation options
   * @param {number} [options.duration] - Animation duration in seconds
   * @param {string} [options.ease] - GSAP easing function
   * @param {Function} [options.onComplete] - Callback when animation completes
   * @returns {Promise<void>}
   */
  async setViewpoint(viewpoint, options = {}) {
    const duration = options.duration ?? ANIMATION_SETTINGS.VIEWPOINT_TRANSITION_DURATION
    const ease = options.ease ?? ANIMATION_SETTINGS.DEFAULT_EASE

    this.stopAnimation()

    this._isAnimating = true
    this.emit('viewpoint-start', { viewpoint })

    const targetPosition = new THREE.Vector3(
      viewpoint.position.x,
      viewpoint.position.y,
      viewpoint.position.z
    )

    const targetLookAt = new THREE.Vector3(
      viewpoint.target.x,
      viewpoint.target.y,
      viewpoint.target.z
    )

    const startFov = this.camera.fov
    const targetFov = viewpoint.fov || startFov

    return new Promise((resolve) => {
      const animationProps = {
        progress: 0
      }

      this.currentTween = gsap.to(animationProps, {
        progress: 1,
        duration,
        ease,
        onUpdate: () => {
          const t = animationProps.progress

          this.camera.position.lerpVectors(
            this.camera.position,
            targetPosition,
            t
          )

          this.target.lerpVectors(
            this.target,
            targetLookAt,
            t
          )

          this.camera.lookAt(this.target)

          if (targetFov !== startFov) {
            this.camera.fov = startFov + (targetFov - startFov) * t
            this.camera.updateProjectionMatrix()
          }

          this.emit('camera-move', {
            position: {
              x: this.camera.position.x,
              y: this.camera.position.y,
              z: this.camera.position.z
            },
            target: {
              x: this.target.x,
              y: this.target.y,
              z: this.target.z
            }
          })
        },
        onComplete: () => {
          this._isAnimating = false
          this.currentTween = null

          this.camera.position.copy(targetPosition)
          this.target.copy(targetLookAt)
          this.camera.lookAt(this.target)

          if (targetFov !== startFov) {
            this.camera.fov = targetFov
            this.camera.updateProjectionMatrix()
          }

          this.emit('viewpoint-complete', { viewpoint })

          if (options.onComplete) {
            options.onComplete()
          }

          resolve()
        }
      })
    })
  }

  /**
   * Get current camera state
   * @returns {CameraState}
   */
  getCurrentState() {
    return {
      position: {
        x: this.camera.position.x,
        y: this.camera.position.y,
        z: this.camera.position.z
      },
      target: {
        x: this.target.x,
        y: this.target.y,
        z: this.target.z
      },
      zoom: 1.0,
      fov: this.camera.fov,
      isAnimating: this._isAnimating,
      constraints: this.constraints
    }
  }

  /**
   * Update camera movement constraints
   * @param {CameraConstraints} constraints - New constraints
   * @returns {void}
   */
  setConstraints(constraints) {
    this.constraints = constraints
  }

  /**
   * Check if camera is currently animating
   * @returns {boolean}
   */
  isAnimating() {
    return this._isAnimating
  }

  /**
   * Stop any ongoing camera animation
   * @returns {void}
   */
  stopAnimation() {
    if (this.currentTween) {
      this.currentTween.kill()
      this.currentTween = null
    }
    this._isAnimating = false
  }

  /**
   * Reset camera to default viewpoint
   * @param {Viewpoint} defaultViewpoint - Default camera position
   * @param {Object} [options] - Animation options
   * @returns {Promise<void>}
   */
  async reset(defaultViewpoint, options = {}) {
    return this.setViewpoint(defaultViewpoint, options)
  }

  /**
   * Point camera at a target position
   * @param {Vector3} target - Point to look at
   * @returns {void}
   */
  lookAt(target) {
    this.target.set(target.x, target.y, target.z)
    this.camera.lookAt(this.target)
  }

  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event handler
   * @returns {void}
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event).push(callback)
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event handler
   * @returns {void}
   */
  off(event, callback) {
    if (!this.eventListeners.has(event)) {
      return
    }
    const listeners = this.eventListeners.get(event)
    const index = listeners.indexOf(callback)
    if (index !== -1) {
      listeners.splice(index, 1)
    }
  }

  /**
   * Emit event
   * @private
   * @param {string} event - Event name
   * @param {Object} payload - Event data
   * @returns {void}
   */
  emit(event, payload) {
    if (!this.eventListeners.has(event)) {
      return
    }
    const listeners = this.eventListeners.get(event)
    listeners.forEach(callback => {
      try {
        callback(payload)
      } catch (error) {
        console.error(`Error in ${event} listener:`, error)
      }
    })
  }

  /**
   * Clean up controller resources
   * @returns {void}
   */
  dispose() {
    this.stopAnimation()
    this.eventListeners.clear()
  }
}

export default CameraController
