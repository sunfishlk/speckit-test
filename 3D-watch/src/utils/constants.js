/**
 * @fileoverview Configuration constants for 3D House Viewer
 */

export const DEFAULT_CAMERA_SETTINGS = {
  FOV: 75,
  NEAR: 0.1,
  FAR: 1000,
  INITIAL_POSITION: { x: 15, y: 5, z: 15 },
  INITIAL_TARGET: { x: 0, y: 0, z: 0 }
}

export const CAMERA_CONSTRAINTS = {
  MIN_DISTANCE: 5,
  MAX_DISTANCE: 50,
  MIN_POLAR_ANGLE: 0,
  MAX_POLAR_ANGLE: Math.PI / 2,
  ENABLE_PAN: true,
  ENABLE_DAMPING: true,
  DAMPING_FACTOR: 0.05
}

export const PERFORMANCE_TARGETS = {
  TARGET_FPS_DESKTOP: 60,
  TARGET_FPS_MOBILE: 30,
  MIN_FPS: 24,
  MAX_LOAD_TIME_MS: 3000,
  MAX_MEMORY_MB_DESKTOP: 1000,
  MAX_MEMORY_MB_MOBILE: 500,
  MAX_INTERACTION_RESPONSE_MS: 100
}

export const ANIMATION_SETTINGS = {
  DEFAULT_DURATION: 0.8,
  DEFAULT_EASE: 'power2.inOut',
  VIEWPOINT_TRANSITION_DURATION: 1.0,
  CAMERA_TRANSITION_DURATION: 0.8,
  UI_TRANSITION_DURATION: 0.3
}

export const INTERACTION_THRESHOLDS = {
  DRAG_THRESHOLD: 5,
  DOUBLE_CLICK_DELAY: 300,
  LONG_PRESS_DELAY: 500,
  PINCH_THRESHOLD: 0.1
}

export const RENDERER_SETTINGS = {
  ANTIALIAS: true,
  ALPHA: false,
  POWER_PREFERENCE: 'high-performance',
  MAX_PIXEL_RATIO: 2,
  SHADOW_MAP_ENABLED: true,
  SHADOW_MAP_TYPE: 'PCFSoft',
  TONE_MAPPING: 'ACESFilmic',
  TONE_MAPPING_EXPOSURE: 1.0
}

export const LIGHTING_DEFAULTS = {
  AMBIENT_COLOR: '#ffffff',
  AMBIENT_INTENSITY: 0.5,
  DIRECTIONAL_COLOR: '#ffffff',
  DIRECTIONAL_INTENSITY: 1.0,
  DIRECTIONAL_POSITION: { x: 10, y: 20, z: 10 },
  CAST_SHADOW: true
}

export const ENVIRONMENT_DEFAULTS = {
  BACKGROUND_COLOR: '#87ceeb',
  FOG_ENABLED: false,
  FOG_COLOR: '#cccccc',
  FOG_NEAR: 50,
  FOG_FAR: 200
}

export const MODEL_SETTINGS = {
  DEFAULT_DRACO_PATH: '/draco/',
  DRACO_CDN_FALLBACK: 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/',
  MAX_TEXTURE_SIZE: 2048,
  ENABLE_LOD: true,
  ENABLE_FRUSTUM_CULLING: true
}

export const UI_SETTINGS = {
  STATS_UPDATE_INTERVAL_MS: 16,
  STATS_TOGGLE_KEY: '`',
  LOADING_MIN_DISPLAY_MS: 500,
  ERROR_DISPLAY_DURATION_MS: 5000,
  TOOLTIP_DELAY_MS: 500
}

export const VIEWPOINT_CATEGORIES = {
  EXTERIOR: 'exterior',
  INTERIOR: 'interior',
  OVERVIEW: 'overview'
}

export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error'
}

export const ERROR_MESSAGES = {
  WEBGL_NOT_SUPPORTED: 'WebGL is not supported in your browser. Please use a modern browser like Chrome, Firefox, Safari, or Edge.',
  MODEL_LOAD_FAILED: 'Failed to load 3D model. Please check your connection and try again.',
  MODEL_NOT_FOUND: 'The requested 3D model could not be found.',
  DRACO_DECODER_FAILED: 'Failed to load Draco decoder. Model compression may not work properly.',
  CONTEXT_LOST: 'WebGL context was lost. Attempting to restore...',
  INSUFFICIENT_MEMORY: 'Insufficient memory to load this model. Try closing other tabs or applications.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please refresh the page and try again.'
}
