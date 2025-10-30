/**
 * @fileoverview Preset viewpoint configurations
 */

/**
 * @typedef {import('../types/index.js').Viewpoint} Viewpoint
 */

/**
 * Default viewpoint for initial camera position
 * @type {Viewpoint}
 */
export const DEFAULT_VIEWPOINT = {
  id: 'default',
  name: 'Default View',
  description: 'Initial perspective of the house',
  position: { x: 15, y: 5, z: 15 },
  target: { x: 0, y: 0, z: 0 },
  fov: 75,
  category: 'overview',
  order: 0
}

/**
 * Preset viewpoints for house navigation
 * @type {Viewpoint[]}
 */
export const VIEWPOINTS = [
  {
    id: 'front-entrance',
    name: 'Front Entrance',
    description: 'Main entrance with driveway view',
    position: { x: 12, y: 2, z: 12 },
    target: { x: 0, y: 1.5, z: 0 },
    fov: 75,
    category: 'exterior',
    order: 1,
    icon: 'door'
  },
  {
    id: 'living-room',
    name: 'Living Room',
    description: 'Spacious living area',
    position: { x: 5, y: 1.8, z: 0 },
    target: { x: 0, y: 1.5, z: -5 },
    fov: 70,
    category: 'interior',
    order: 2,
    icon: 'sofa'
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    description: 'Modern kitchen with island',
    position: { x: -5, y: 1.8, z: 3 },
    target: { x: -8, y: 1.5, z: 3 },
    fov: 70,
    category: 'interior',
    order: 3,
    icon: 'utensils'
  },
  {
    id: 'bedroom',
    name: 'Master Bedroom',
    description: 'Large master bedroom',
    position: { x: 0, y: 5, z: 8 },
    target: { x: 0, y: 4, z: 5 },
    fov: 70,
    category: 'interior',
    order: 4,
    icon: 'bed'
  },
  {
    id: 'backyard',
    name: 'Backyard',
    description: 'Garden and outdoor space',
    position: { x: -10, y: 3, z: -10 },
    target: { x: 0, y: 0, z: 0 },
    fov: 75,
    category: 'exterior',
    order: 5,
    icon: 'tree'
  },
  {
    id: 'aerial',
    name: 'Aerial View',
    description: 'Bird\'s eye view of the property',
    position: { x: 0, y: 20, z: 0 },
    target: { x: 0, y: 0, z: 0 },
    fov: 60,
    category: 'overview',
    order: 6,
    icon: 'eye'
  }
]

/**
 * Get viewpoint by ID
 * @param {string} id - Viewpoint ID
 * @returns {Viewpoint|null}
 */
export function getViewpointById(id) {
  return VIEWPOINTS.find(vp => vp.id === id) || null
}

/**
 * Get viewpoints by category
 * @param {string} category - Category name
 * @returns {Viewpoint[]}
 */
export function getViewpointsByCategory(category) {
  return VIEWPOINTS.filter(vp => vp.category === category)
}

export default {
  DEFAULT_VIEWPOINT,
  VIEWPOINTS,
  getViewpointById,
  getViewpointsByCategory
}
