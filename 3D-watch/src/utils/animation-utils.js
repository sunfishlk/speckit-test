/**
 * @fileoverview Animation utilities for camera movements and transitions
 */

import * as THREE from 'three'

/**
 * @typedef {import('../types/index.js').Vector3} Vector3
 */

/**
 * Calculate optimal camera path between two positions
 * Avoids passing through objects by arcing above if needed
 * @param {Vector3} start - Start position
 * @param {Vector3} end - End position
 * @param {number} [arcHeight=2] - Height of arc above midpoint
 * @returns {Vector3[]} Array of waypoints
 */
export function calculateCameraPath(start, end, arcHeight = 2) {
  const startVec = new THREE.Vector3(start.x, start.y, start.z)
  const endVec = new THREE.Vector3(end.x, end.y, end.z)
  const distance = startVec.distanceTo(endVec)

  if (distance < 5) {
    return [start, end]
  }

  const midpoint = new THREE.Vector3().lerpVectors(startVec, endVec, 0.5)
  midpoint.y += arcHeight

  return [
    start,
    { x: midpoint.x, y: midpoint.y, z: midpoint.z },
    end
  ]
}

/**
 * Calculate smooth interpolation between two values using easing
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} t - Progress (0 to 1)
 * @param {string} [ease='linear'] - Easing function name
 * @returns {number} Interpolated value
 */
export function interpolate(start, end, t, ease = 'linear') {
  const easedT = applyEasing(t, ease)
  return start + (end - start) * easedT
}

/**
 * Apply easing function to progress value
 * @param {number} t - Progress (0 to 1)
 * @param {string} ease - Easing function name
 * @returns {number} Eased value
 */
export function applyEasing(t, ease) {
  switch (ease) {
    case 'linear':
      return t
    case 'easeInOut':
    case 'power2.inOut':
      return t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2
    case 'easeIn':
    case 'power2.in':
      return t * t
    case 'easeOut':
    case 'power2.out':
      return 1 - (1 - t) * (1 - t)
    case 'easeInOutCubic':
    case 'power3.inOut':
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2
    case 'easeInOutQuart':
    case 'power4.inOut':
      return t < 0.5
        ? 8 * t * t * t * t
        : 1 - Math.pow(-2 * t + 2, 4) / 2
    default:
      return t
  }
}

/**
 * Clamp value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

/**
 * Linear interpolation between two values
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Progress (0 to 1)
 * @returns {number} Interpolated value
 */
export function lerp(a, b, t) {
  return a + (b - a) * t
}

/**
 * Linear interpolation between two Vector3 positions
 * @param {Vector3} a - Start position
 * @param {Vector3} b - End position
 * @param {number} t - Progress (0 to 1)
 * @returns {Vector3} Interpolated position
 */
export function lerpVector3(a, b, t) {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    z: lerp(a.z, b.z, t)
  }
}

/**
 * Calculate distance between two Vector3 positions
 * @param {Vector3} a - First position
 * @param {Vector3} b - Second position
 * @returns {number} Distance
 */
export function distance(a, b) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const dz = b.z - a.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

/**
 * Normalize angle to range [0, 2π]
 * @param {number} angle - Angle in radians
 * @returns {number} Normalized angle
 */
export function normalizeAngle(angle) {
  while (angle < 0) {
    angle += Math.PI * 2
  }
  while (angle >= Math.PI * 2) {
    angle -= Math.PI * 2
  }
  return angle
}

/**
 * Calculate shortest angular distance between two angles
 * @param {number} from - Start angle in radians
 * @param {number} to - End angle in radians
 * @returns {number} Shortest angular distance
 */
export function shortestAngle(from, to) {
  const diff = normalizeAngle(to - from)
  if (diff > Math.PI) {
    return diff - Math.PI * 2
  }
  return diff
}

/**
 * Debounce a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle a function call
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
export function degToRad(degrees) {
  return degrees * (Math.PI / 180)
}

/**
 * Convert radians to degrees
 * @param {number} radians - Angle in radians
 * @returns {number} Angle in degrees
 */
export function radToDeg(radians) {
  return radians * (180 / Math.PI)
}

export default {
  calculateCameraPath,
  interpolate,
  applyEasing,
  clamp,
  lerp,
  lerpVector3,
  distance,
  normalizeAngle,
  shortestAngle,
  debounce,
  throttle,
  degToRad,
  radToDeg
}
