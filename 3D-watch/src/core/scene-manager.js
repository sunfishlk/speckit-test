/**
 * @fileoverview Scene manager for Three.js scene initialization and management
 */

import * as THREE from 'three'
import { LIGHTING_DEFAULTS, ENVIRONMENT_DEFAULTS } from '../utils/constants.js'

/**
 * @typedef {import('../types/index.js').SceneConfiguration} SceneConfiguration
 * @typedef {import('../types/index.js').LightingConfig} LightingConfig
 */

/**
 * SceneManager class
 * Manages Three.js scene, lighting, and environment
 */
export class SceneManager {
  /**
   * @param {SceneConfiguration} [config] - Scene configuration
   */
  constructor(config = {}) {
    this.scene = new THREE.Scene()
    this.lights = {}
    this.config = this.mergeConfig(config)
    
    this.initializeScene()
  }

  /**
   * Merge user config with defaults
   * @private
   * @param {Object} config - User configuration
   * @returns {SceneConfiguration} Merged configuration
   */
  mergeConfig(config) {
    return {
      lighting: {
        ambientLight: {
          color: config.lighting?.ambientLight?.color || LIGHTING_DEFAULTS.AMBIENT_COLOR,
          intensity: config.lighting?.ambientLight?.intensity ?? LIGHTING_DEFAULTS.AMBIENT_INTENSITY
        },
        directionalLight: {
          color: config.lighting?.directionalLight?.color || LIGHTING_DEFAULTS.DIRECTIONAL_COLOR,
          intensity: config.lighting?.directionalLight?.intensity ?? LIGHTING_DEFAULTS.DIRECTIONAL_INTENSITY,
          position: config.lighting?.directionalLight?.position || LIGHTING_DEFAULTS.DIRECTIONAL_POSITION,
          castShadow: config.lighting?.directionalLight?.castShadow ?? LIGHTING_DEFAULTS.CAST_SHADOW
        }
      },
      environment: {
        background: config.environment?.background || ENVIRONMENT_DEFAULTS.BACKGROUND_COLOR,
        fog: config.environment?.fog || null
      }
    }
  }

  /**
   * Initialize scene with lighting and environment
   * @private
   * @returns {void}
   */
  initializeScene() {
    this.scene.background = new THREE.Color(this.config.environment.background)

    const ambientLight = new THREE.AmbientLight(
      this.config.lighting.ambientLight.color,
      this.config.lighting.ambientLight.intensity
    )
    this.lights.ambient = ambientLight
    this.scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(
      this.config.lighting.directionalLight.color,
      this.config.lighting.directionalLight.intensity
    )
    directionalLight.position.set(
      this.config.lighting.directionalLight.position.x,
      this.config.lighting.directionalLight.position.y,
      this.config.lighting.directionalLight.position.z
    )
    directionalLight.castShadow = this.config.lighting.directionalLight.castShadow

    if (directionalLight.castShadow) {
      directionalLight.shadow.mapSize.width = 2048
      directionalLight.shadow.mapSize.height = 2048
      directionalLight.shadow.camera.near = 0.5
      directionalLight.shadow.camera.far = 500
    }

    this.lights.directional = directionalLight
    this.scene.add(directionalLight)

    if (this.config.environment.fog) {
      const fog = new THREE.Fog(
        this.config.environment.fog.color,
        this.config.environment.fog.near,
        this.config.environment.fog.far
      )
      this.scene.fog = fog
    }
  }

  /**
   * Get the Three.js scene instance
   * @returns {THREE.Scene}
   */
  getScene() {
    return this.scene
  }

  /**
   * Update lighting configuration
   * @param {LightingConfig} lightingConfig - New lighting settings
   * @returns {void}
   */
  updateLighting(lightingConfig) {
    if (lightingConfig.ambientLight && this.lights.ambient) {
      if (lightingConfig.ambientLight.color) {
        this.lights.ambient.color.set(lightingConfig.ambientLight.color)
      }
      if (lightingConfig.ambientLight.intensity !== undefined) {
        this.lights.ambient.intensity = lightingConfig.ambientLight.intensity
      }
    }

    if (lightingConfig.directionalLight && this.lights.directional) {
      if (lightingConfig.directionalLight.color) {
        this.lights.directional.color.set(lightingConfig.directionalLight.color)
      }
      if (lightingConfig.directionalLight.intensity !== undefined) {
        this.lights.directional.intensity = lightingConfig.directionalLight.intensity
      }
      if (lightingConfig.directionalLight.position) {
        this.lights.directional.position.set(
          lightingConfig.directionalLight.position.x,
          lightingConfig.directionalLight.position.y,
          lightingConfig.directionalLight.position.z
        )
      }
      if (lightingConfig.directionalLight.castShadow !== undefined) {
        this.lights.directional.castShadow = lightingConfig.directionalLight.castShadow
      }
    }
  }

  /**
   * Set scene background
   * @param {string} background - Hex color or texture path
   * @returns {void}
   */
  setBackground(background) {
    this.scene.background = new THREE.Color(background)
  }

  /**
   * Set environment settings
   * @param {Object} environmentConfig - Environment configuration
   * @returns {Promise<void>}
   */
  async setEnvironment(environmentConfig) {
    if (environmentConfig.skybox) {
      console.warn('Skybox loading not yet implemented')
    }

    if (environmentConfig.fog) {
      const fog = new THREE.Fog(
        environmentConfig.fog.color,
        environmentConfig.fog.near,
        environmentConfig.fog.far
      )
      this.scene.fog = fog
    } else {
      this.scene.fog = null
    }
  }

  /**
   * Add object to scene
   * @param {THREE.Object3D} object - Object to add
   * @returns {void}
   */
  addObject(object) {
    this.scene.add(object)
  }

  /**
   * Remove object from scene
   * @param {THREE.Object3D} object - Object to remove
   * @returns {void}
   */
  removeObject(object) {
    this.scene.remove(object)
    
    if (object.traverse) {
      object.traverse((child) => {
        if (child.geometry) {
          child.geometry.dispose()
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose())
          } else {
            child.material.dispose()
          }
        }
      })
    }
  }

  /**
   * Clear all objects from scene (except lights)
   * @returns {void}
   */
  clear() {
    const objectsToRemove = []
    
    this.scene.traverse((child) => {
      if (!child.isLight && child !== this.scene) {
        objectsToRemove.push(child)
      }
    })

    objectsToRemove.forEach(obj => {
      if (obj.parent) {
        this.removeObject(obj)
      }
    })
  }

  /**
   * Dispose of all scene resources
   * @returns {void}
   */
  dispose() {
    this.clear()
    
    Object.values(this.lights).forEach(light => {
      this.scene.remove(light)
      if (light.dispose) {
        light.dispose()
      }
    })

    this.lights = {}
  }
}

export default SceneManager
