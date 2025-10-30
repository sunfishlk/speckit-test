/**
 * @fileoverview Model loader for GLTF/GLB files with Draco support
 */

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { MODEL_SETTINGS } from '../utils/constants.js'

/**
 * @typedef {import('../types/index.js').LoadProgressEvent} LoadProgressEvent
 * @typedef {import('../types/index.js').LoadedModelData} LoadedModelData
 */

/**
 * ModelLoader class
 * Handles loading of GLTF/GLB models with Draco compression support
 */
export class ModelLoader {
  /**
   * @param {Object} [options] - Loader options
   * @param {string} [options.dracoDecoderPath] - Path to Draco decoder
   * @param {boolean} [options.enableDraco=true] - Enable Draco support
   */
  constructor(options = {}) {
    this.gltfLoader = new GLTFLoader()
    this.dracoLoader = null
    this.cache = new Map()
    
    const dracoPath = options.dracoDecoderPath || MODEL_SETTINGS.DEFAULT_DRACO_PATH
    const enableDraco = options.enableDraco !== false

    if (enableDraco) {
      this.dracoLoader = new DRACOLoader()
      this.dracoLoader.setDecoderPath(dracoPath)
      this.dracoLoader.setDecoderConfig({ type: 'js' })
      this.dracoLoader.preload()
      this.gltfLoader.setDRACOLoader(this.dracoLoader)
    }
  }

  /**
   * Load a 3D model from URL
   * @param {string} url - Path to GLTF/GLB file
   * @param {Function} [onProgress] - Progress callback
   * @returns {Promise<THREE.Group>} Loaded model
   * @throws {Error} If loading fails
   */
  async load(url, onProgress = null) {
    if (this.cache.has(url)) {
      return this.cache.get(url).clone()
    }

    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          const model = gltf.scene
          this.cache.set(url, model)
          resolve(model)
        },
        (progressEvent) => {
          if (onProgress && progressEvent.lengthComputable) {
            const progress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: (progressEvent.loaded / progressEvent.total) * 100
            }
            onProgress(progress)
          }
        },
        (error) => {
          const errorMessage = `Failed to load model from ${url}: ${error.message}`
          console.error(errorMessage, error)
          reject(new Error(errorMessage))
        }
      )
    })
  }

  /**
   * Load model with metadata extraction
   * @param {string} url - Path to GLTF/GLB file
   * @param {Function} [onProgress] - Progress callback
   * @returns {Promise<LoadedModelData>} Loaded model with metadata
   * @throws {Error} If loading fails
   */
  async loadWithMetadata(url, onProgress = null) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          const model = gltf.scene
          this.cache.set(url, model)

          const metadata = this.extractMetadata(gltf)
          
          resolve({
            model,
            metadata
          })
        },
        (progressEvent) => {
          if (onProgress && progressEvent.lengthComputable) {
            const progress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: (progressEvent.loaded / progressEvent.total) * 100
            }
            onProgress(progress)
          }
        },
        (error) => {
          const errorMessage = `Failed to load model from ${url}: ${error.message}`
          console.error(errorMessage, error)
          reject(new Error(errorMessage))
        }
      )
    })
  }

  /**
   * Extract metadata from loaded GLTF
   * @private
   * @param {Object} gltf - Loaded GLTF object
   * @returns {Object} Metadata
   */
  extractMetadata(gltf) {
    let polygonCount = 0
    let textureCount = 0
    const boundingBox = new THREE.Box3()

    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        if (child.geometry) {
          const geometry = child.geometry
          if (geometry.index) {
            polygonCount += geometry.index.count / 3
          } else if (geometry.attributes.position) {
            polygonCount += geometry.attributes.position.count / 3
          }
        }

        if (child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material]
          materials.forEach(material => {
            Object.keys(material).forEach(key => {
              if (material[key] && material[key].isTexture) {
                textureCount++
              }
            })
          })
        }
      }
    })

    boundingBox.setFromObject(gltf.scene)

    return {
      polygonCount: Math.round(polygonCount),
      textureCount,
      boundingBox: {
        min: {
          x: boundingBox.min.x,
          y: boundingBox.min.y,
          z: boundingBox.min.z
        },
        max: {
          x: boundingBox.max.x,
          y: boundingBox.max.y,
          z: boundingBox.max.z
        }
      },
      animations: gltf.animations ? gltf.animations.map(a => a.name) : [],
      cameras: gltf.cameras ? gltf.cameras.map(c => c.name) : []
    }
  }

  /**
   * Preload multiple models
   * @param {string[]} urls - Array of model URLs
   * @returns {Promise<void>}
   */
  async preload(urls) {
    const promises = urls.map(url => this.load(url))
    await Promise.all(promises)
  }

  /**
   * Clear cached models
   * @returns {void}
   */
  clearCache() {
    this.cache.forEach((model) => {
      if (model.traverse) {
        model.traverse((child) => {
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
    })
    this.cache.clear()
  }

  /**
   * Dispose of loader resources
   * @returns {void}
   */
  dispose() {
    this.clearCache()
    if (this.dracoLoader) {
      this.dracoLoader.dispose()
    }
  }
}

export default ModelLoader
