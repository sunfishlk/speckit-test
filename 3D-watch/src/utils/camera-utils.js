/**
 * @fileoverview Camera utility functions for constraints and calculations
 */

import * as THREE from 'three'

/**
 * @typedef {import('../types/index.js').Vector3} Vector3
 * @typedef {import('../types/index.js').BoundingBox} BoundingBox
 * @typedef {import('../types/index.js').CameraConstraints} CameraConstraints
 */

/**
 * Calculate camera constraints from model bounding box
 * @param {BoundingBox} boundingBox - Model bounding box
 * @param {Object} [options] - Constraint options
 * @param {number} [options.minDistanceMultiplier=0.5] - Min distance as multiple of model size
 * @param {number} [options.maxDistanceMultiplier=5.0] - Max distance as multiple of model size
 * @returns {CameraConstraints} Camera constraints
 */
export function calculateCameraConstraints(boundingBox, options = {}) {
  const {
    minDistanceMultiplier = 0.5,
    maxDistanceMultiplier = 5.0
  } = options

  const min = new THREE.Vector3(boundingBox.min.x, boundingBox.min.y, boundingBox.min.z)
  const max = new THREE.Vector3(boundingBox.max.x, boundingBox.max.y, boundingBox.max.z)
  
  const size = new THREE.Vector3()
  size.subVectors(max, min)
  
  const modelSize = size.length()
  
  const minDistance = modelSize * minDistanceMultiplier
  const maxDistance = modelSize * maxDistanceMultiplier

  const panBounds = {
    min: {
      x: boundingBox.min.x - modelSize,
      y: boundingBox.min.y,
      z: boundingBox.min.z - modelSize
    },
    max: {
      x: boundingBox.max.x + modelSize,
      y: boundingBox.max.y + modelSize,
      z: boundingBox.max.z + modelSize
    }
  }

  return {
    minDistance: Math.max(minDistance, 1),
    maxDistance: Math.max(maxDistance, 10),
    minPolarAngle: 0,
    maxPolarAngle: Math.PI / 2,
    enablePan: true,
    panBounds
  }
}

/**
 * Validate camera position against constraints
 * @param {Vector3} position - Camera position
 * @param {Vector3} target - Camera target
 * @param {CameraConstraints} constraints - Constraints to enforce
 * @returns {Object} Validation result with corrected position
 */
export function validateCameraPosition(position, target, constraints) {
  const posVec = new THREE.Vector3(position.x, position.y, position.z)
  const targetVec = new THREE.Vector3(target.x, target.y, target.z)
  
  const distance = posVec.distanceTo(targetVec)
  
  let correctedPosition = { ...position }
  let needsCorrection = false

  if (distance < constraints.minDistance) {
    const direction = new THREE.Vector3().subVectors(posVec, targetVec).normalize()
    const corrected = new THREE.Vector3()
      .copy(targetVec)
      .add(direction.multiplyScalar(constraints.minDistance))
    
    correctedPosition = { x: corrected.x, y: corrected.y, z: corrected.z }
    needsCorrection = true
  }

  if (distance > constraints.maxDistance) {
    const direction = new THREE.Vector3().subVectors(posVec, targetVec).normalize()
    const corrected = new THREE.Vector3()
      .copy(targetVec)
      .add(direction.multiplyScalar(constraints.maxDistance))
    
    correctedPosition = { x: corrected.x, y: corrected.y, z: corrected.z }
    needsCorrection = true
  }

  if (constraints.panBounds && constraints.enablePan) {
    if (correctedPosition.x < constraints.panBounds.min.x) {
      correctedPosition.x = constraints.panBounds.min.x
      needsCorrection = true
    }
    if (correctedPosition.x > constraints.panBounds.max.x) {
      correctedPosition.x = constraints.panBounds.max.x
      needsCorrection = true
    }
    if (correctedPosition.y < constraints.panBounds.min.y) {
      correctedPosition.y = constraints.panBounds.min.y
      needsCorrection = true
    }
    if (correctedPosition.y > constraints.panBounds.max.y) {
      correctedPosition.y = constraints.panBounds.max.y
      needsCorrection = true
    }
    if (correctedPosition.z < constraints.panBounds.min.z) {
      correctedPosition.z = constraints.panBounds.min.z
      needsCorrection = true
    }
    if (correctedPosition.z > constraints.panBounds.max.z) {
      correctedPosition.z = constraints.panBounds.max.z
      needsCorrection = true
    }
  }

  return {
    valid: !needsCorrection,
    correctedPosition,
    distance
  }
}

/**
 * Calculate polar angle from position and target
 * @param {Vector3} position - Camera position
 * @param {Vector3} target - Camera target
 * @returns {number} Polar angle in radians
 */
export function calculatePolarAngle(position, target) {
  const dx = position.x - target.x
  const dy = position.y - target.y
  const dz = position.z - target.z
  
  const horizontalDistance = Math.sqrt(dx * dx + dz * dz)
  const polarAngle = Math.atan2(horizontalDistance, dy)
  
  return polarAngle
}

/**
 * Enforce polar angle constraints
 * @param {Vector3} position - Camera position
 * @param {Vector3} target - Camera target
 * @param {number} minPolarAngle - Minimum polar angle
 * @param {number} maxPolarAngle - Maximum polar angle
 * @returns {Vector3} Corrected position
 */
export function enforcePolarAngle(position, target, minPolarAngle, maxPolarAngle) {
  const currentAngle = calculatePolarAngle(position, target)
  
  if (currentAngle < minPolarAngle || currentAngle > maxPolarAngle) {
    const clampedAngle = Math.max(minPolarAngle, Math.min(maxPolarAngle, currentAngle))
    
    const posVec = new THREE.Vector3(position.x, position.y, position.z)
    const targetVec = new THREE.Vector3(target.x, target.y, target.z)
    const distance = posVec.distanceTo(targetVec)
    
    const offset = new THREE.Vector3().subVectors(posVec, targetVec)
    const azimuthalAngle = Math.atan2(offset.x, offset.z)
    
    const x = distance * Math.sin(clampedAngle) * Math.sin(azimuthalAngle)
    const y = distance * Math.cos(clampedAngle)
    const z = distance * Math.sin(clampedAngle) * Math.cos(azimuthalAngle)
    
    return {
      x: target.x + x,
      y: target.y + y,
      z: target.z + z
    }
  }
  
  return position
}

/**
 * Get optimal camera position for viewing a bounding box
 * @param {BoundingBox} boundingBox - Model bounding box
 * @param {number} [fov=75] - Camera field of view in degrees
 * @returns {Object} Optimal camera position and target
 */
export function getOptimalCameraPosition(boundingBox, fov = 75) {
  const min = new THREE.Vector3(boundingBox.min.x, boundingBox.min.y, boundingBox.min.z)
  const max = new THREE.Vector3(boundingBox.max.x, boundingBox.max.y, boundingBox.max.z)
  
  const center = new THREE.Vector3()
  center.addVectors(min, max).multiplyScalar(0.5)
  
  const size = new THREE.Vector3()
  size.subVectors(max, min)
  
  const maxDim = Math.max(size.x, size.y, size.z)
  const fovRad = (fov * Math.PI) / 180
  const distance = maxDim / (2 * Math.tan(fovRad / 2))
  
  const cameraDistance = distance * 1.5
  
  const angle = Math.PI / 4
  const elevation = cameraDistance * 0.5
  
  return {
    position: {
      x: center.x + cameraDistance * Math.cos(angle),
      y: center.y + elevation,
      z: center.z + cameraDistance * Math.sin(angle)
    },
    target: {
      x: center.x,
      y: center.y,
      z: center.z
    }
  }
}

export default {
  calculateCameraConstraints,
  validateCameraPosition,
  calculatePolarAngle,
  enforcePolarAngle,
  getOptimalCameraPosition
}
