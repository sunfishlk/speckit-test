/**
 * @fileoverview Renderer manager for WebGL renderer configuration
 */

import * as THREE from 'three'
import { RENDERER_SETTINGS } from '../utils/constants.js'

/**
 * @typedef {import('../types/index.js').RendererConfig} RendererConfig
 */

/**
 * RendererManager class
 * Manages WebGL renderer configuration and lifecycle
 */
export class RendererManager {
  /**
   * @param {HTMLElement} container - DOM container for renderer
   * @param {RendererConfig} [config] - Renderer configuration
   */
  constructor(container, config = {}) {
    this.container = container
    this.renderer = null
    this.config = this.mergeConfig(config)
    this.resizeObserver = null
    this.contextLostHandler = null
    this.contextRestoredHandler = null
    
    this.initializeRenderer()
    this.setupEventListeners()
  }

  /**
   * Merge user config with defaults
   * @private
   * @param {Object} config - User configuration
   * @returns {RendererConfig} Merged configuration
   */
  mergeConfig(config) {
    return {
      antialias: config.antialias ?? RENDERER_SETTINGS.ANTIALIAS,
      alpha: config.alpha ?? RENDERER_SETTINGS.ALPHA,
      powerPreference: config.powerPreference || RENDERER_SETTINGS.POWER_PREFERENCE,
      shadowMapEnabled: config.shadowMapEnabled ?? RENDERER_SETTINGS.SHADOW_MAP_ENABLED,
      shadowMapType: config.shadowMapType || RENDERER_SETTINGS.SHADOW_MAP_TYPE,
      toneMapping: config.toneMapping || RENDERER_SETTINGS.TONE_MAPPING,
      toneMappingExposure: config.toneMappingExposure ?? RENDERER_SETTINGS.TONE_MAPPING_EXPOSURE,
      pixelRatio: Math.min(
        config.pixelRatio || window.devicePixelRatio,
        RENDERER_SETTINGS.MAX_PIXEL_RATIO
      )
    }
  }

  /**
   * Initialize WebGL renderer
   * @private
   * @returns {void}
   */
  initializeRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: this.config.antialias,
      alpha: this.config.alpha,
      powerPreference: this.config.powerPreference
    })

    this.renderer.setPixelRatio(this.config.pixelRatio)
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)

    this.renderer.shadowMap.enabled = this.config.shadowMapEnabled
    if (this.config.shadowMapEnabled) {
      this.renderer.shadowMap.type = this.getShadowMapType(this.config.shadowMapType)
    }

    this.renderer.toneMapping = this.getToneMapping(this.config.toneMapping)
    this.renderer.toneMappingExposure = this.config.toneMappingExposure

    this.renderer.outputColorSpace = THREE.SRGBColorSpace

    this.container.appendChild(this.renderer.domElement)
  }

  /**
   * Get Three.js shadow map type constant
   * @private
   * @param {string} type - Shadow map type name
   * @returns {number} Three.js constant
   */
  getShadowMapType(type) {
    const types = {
      'basic': THREE.BasicShadowMap,
      'pcf': THREE.PCFShadowMap,
      'pcfsoft': THREE.PCFSoftShadowMap,
      'vsm': THREE.VSMShadowMap
    }
    return types[type.toLowerCase()] || THREE.PCFSoftShadowMap
  }

  /**
   * Get Three.js tone mapping constant
   * @private
   * @param {string} mapping - Tone mapping name
   * @returns {number} Three.js constant
   */
  getToneMapping(mapping) {
    const mappings = {
      'linear': THREE.LinearToneMapping,
      'reinhard': THREE.ReinhardToneMapping,
      'cineon': THREE.CineonToneMapping,
      'aces': THREE.ACESFilmicToneMapping,
      'acesfilmic': THREE.ACESFilmicToneMapping
    }
    return mappings[mapping.toLowerCase()] || THREE.ACESFilmicToneMapping
  }

  /**
   * Setup event listeners for resize and context loss
   * @private
   * @returns {void}
   */
  setupEventListeners() {
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleResize()
      })
      this.resizeObserver.observe(this.container)
    } else {
      window.addEventListener('resize', () => this.handleResize())
    }

    const canvas = this.renderer.domElement
    
    this.contextLostHandler = (event) => {
      event.preventDefault()
      console.error('WebGL context lost')
      this.onContextLost && this.onContextLost(event)
    }

    this.contextRestoredHandler = () => {
      console.warn('WebGL context restored')
      this.onContextRestored && this.onContextRestored()
    }

    canvas.addEventListener('webglcontextlost', this.contextLostHandler, false)
    canvas.addEventListener('webglcontextrestored', this.contextRestoredHandler, false)
  }

  /**
   * Handle container resize
   * @private
   * @returns {void}
   */
  handleResize() {
    if (!this.renderer || !this.container) {
      return
    }

    const width = this.container.clientWidth
    const height = this.container.clientHeight

    this.renderer.setSize(width, height)
  }

  /**
   * Get the WebGL renderer instance
   * @returns {THREE.WebGLRenderer}
   */
  getRenderer() {
    return this.renderer
  }

  /**
   * Get current renderer size
   * @returns {Object} Size with width and height
   */
  getSize() {
    const size = new THREE.Vector2()
    this.renderer.getSize(size)
    return { width: size.x, height: size.y }
  }

  /**
   * Update renderer configuration
   * @param {Partial<RendererConfig>} config - Configuration updates
   * @returns {void}
   */
  updateConfig(config) {
    if (config.pixelRatio !== undefined) {
      this.renderer.setPixelRatio(
        Math.min(config.pixelRatio, RENDERER_SETTINGS.MAX_PIXEL_RATIO)
      )
      this.config.pixelRatio = config.pixelRatio
    }

    if (config.shadowMapEnabled !== undefined) {
      this.renderer.shadowMap.enabled = config.shadowMapEnabled
      this.config.shadowMapEnabled = config.shadowMapEnabled
    }

    if (config.shadowMapType) {
      this.renderer.shadowMap.type = this.getShadowMapType(config.shadowMapType)
      this.config.shadowMapType = config.shadowMapType
    }

    if (config.toneMapping) {
      this.renderer.toneMapping = this.getToneMapping(config.toneMapping)
      this.config.toneMapping = config.toneMapping
    }

    if (config.toneMappingExposure !== undefined) {
      this.renderer.toneMappingExposure = config.toneMappingExposure
      this.config.toneMappingExposure = config.toneMappingExposure
    }
  }

  /**
   * Render a scene with a camera
   * @param {THREE.Scene} scene - Scene to render
   * @param {THREE.Camera} camera - Camera to render from
   * @returns {void}
   */
  render(scene, camera) {
    this.renderer.render(scene, camera)
  }

  /**
   * Dispose of renderer resources
   * @returns {void}
   */
  dispose() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }

    const canvas = this.renderer.domElement
    if (canvas) {
      if (this.contextLostHandler) {
        canvas.removeEventListener('webglcontextlost', this.contextLostHandler)
      }
      if (this.contextRestoredHandler) {
        canvas.removeEventListener('webglcontextrestored', this.contextRestoredHandler)
      }
      
      if (canvas.parentElement) {
        canvas.parentElement.removeChild(canvas)
      }
    }

    this.renderer.dispose()
    this.renderer = null
  }
}

export default RendererManager
