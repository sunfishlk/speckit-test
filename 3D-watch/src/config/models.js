/**
 * @fileoverview House model configurations
 */

import { DEFAULT_VIEWPOINT } from './viewpoints.js'

/**
 * @typedef {import('../types/index.js').HouseModel} HouseModel
 */

/**
 * Default house model configuration
 * @type {HouseModel}
 */
export const DEFAULT_MODEL = {
  id: 'default-house',
  url: '/models/house.glb',
  name: 'Sample House',
  description: 'A modern 3-bedroom house with open floor plan',
  boundingBox: {
    min: { x: -10, y: 0, z: -10 },
    max: { x: 10, y: 8, z: 10 }
  },
  defaultViewpoint: DEFAULT_VIEWPOINT,
  thumbnail: '/models/house-thumbnail.jpg',
  metadata: {
    polygonCount: 50000,
    textureCount: 10,
    fileSize: 2000000,
    compressionType: 'draco'
  }
}

/**
 * Available house models
 * @type {HouseModel[]}
 */
export const AVAILABLE_MODELS = [
  DEFAULT_MODEL,
  {
    id: 'modern-villa',
    url: '/models/modern-villa.glb',
    name: 'Modern Villa',
    description: 'Luxurious modern villa with pool',
    boundingBox: {
      min: { x: -15, y: 0, z: -15 },
      max: { x: 15, y: 12, z: 15 }
    },
    defaultViewpoint: {
      ...DEFAULT_VIEWPOINT,
      position: { x: 20, y: 8, z: 20 }
    },
    thumbnail: '/models/villa-thumbnail.jpg',
    metadata: {
      polygonCount: 85000,
      textureCount: 15,
      fileSize: 3500000,
      compressionType: 'draco'
    }
  }
]

/**
 * Get model by ID
 * @param {string} id - Model ID
 * @returns {HouseModel|null}
 */
export function getModelById(id) {
  return AVAILABLE_MODELS.find(model => model.id === id) || null
}

export default {
  DEFAULT_MODEL,
  AVAILABLE_MODELS,
  getModelById
}
