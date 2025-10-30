/**
 * @fileoverview WebGL capability detection utility
 */

/**
 * WebGL capability information
 * @typedef {Object} WebGLCapability
 * @property {boolean} supported - Whether WebGL is supported
 * @property {number} version - WebGL version (1 or 2, 0 if not supported)
 * @property {string} renderer - GPU renderer string
 * @property {string} vendor - GPU vendor string
 * @property {number} maxTextureSize - Maximum texture size
 * @property {number} maxCubeMapTextureSize - Maximum cube map texture size
 * @property {number} maxVertexAttributes - Maximum vertex attributes
 * @property {number} maxVaryingVectors - Maximum varying vectors
 * @property {number} maxVertexUniforms - Maximum vertex uniforms
 * @property {number} maxFragmentUniforms - Maximum fragment uniforms
 * @property {boolean} hasFloatTextures - Float texture support
 * @property {boolean} hasDepthTexture - Depth texture support
 * @property {boolean} hasInstancedArrays - Instanced arrays support
 */

/**
 * Detect WebGL support and capabilities
 * @returns {WebGLCapability} WebGL capability information
 */
export function detectWebGL() {
  const canvas = document.createElement('canvas')
  let gl = null
  let version = 0
  
  try {
    gl = canvas.getContext('webgl2')
    if (gl) {
      version = 2
    } else {
      gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (gl) {
        version = 1
      }
    }
  } catch (e) {
    console.error('WebGL detection error:', e)
  }

  if (!gl) {
    return {
      supported: false,
      version: 0,
      renderer: 'none',
      vendor: 'none',
      maxTextureSize: 0,
      maxCubeMapTextureSize: 0,
      maxVertexAttributes: 0,
      maxVaryingVectors: 0,
      maxVertexUniforms: 0,
      maxFragmentUniforms: 0,
      hasFloatTextures: false,
      hasDepthTexture: false,
      hasInstancedArrays: false
    }
  }

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
  const renderer = debugInfo
    ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    : 'Unknown'
  const vendor = debugInfo
    ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
    : 'Unknown'

  const floatTextureExt = gl.getExtension('OES_texture_float')
  const depthTextureExt = gl.getExtension('WEBGL_depth_texture') || gl.getExtension('WEBKIT_WEBGL_depth_texture')
  const instancedArraysExt = gl.getExtension('ANGLE_instanced_arrays')

  return {
    supported: true,
    version,
    renderer,
    vendor,
    maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
    maxCubeMapTextureSize: gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE),
    maxVertexAttributes: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
    maxVaryingVectors: gl.getParameter(gl.MAX_VARYING_VECTORS),
    maxVertexUniforms: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
    maxFragmentUniforms: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
    hasFloatTextures: !!floatTextureExt,
    hasDepthTexture: !!depthTextureExt,
    hasInstancedArrays: version === 2 || !!instancedArraysExt
  }
}

/**
 * Check if WebGL is supported
 * @returns {boolean} True if WebGL is supported
 */
export function isWebGLSupported() {
  const capability = detectWebGL()
  return capability.supported
}

/**
 * Get recommended quality settings based on WebGL capabilities
 * @returns {Object} Recommended quality settings
 */
export function getRecommendedQualitySettings() {
  const capability = detectWebGL()

  if (!capability.supported) {
    return {
      shadows: false,
      antialias: false,
      pixelRatio: 1,
      maxTextureSize: 512
    }
  }

  const isMobile = /Mobi|Android/i.test(navigator.userAgent)
  const isLowEnd = capability.maxTextureSize < 4096

  if (isMobile || isLowEnd) {
    return {
      shadows: false,
      antialias: false,
      pixelRatio: 1,
      maxTextureSize: Math.min(capability.maxTextureSize, 1024)
    }
  }

  return {
    shadows: true,
    antialias: true,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    maxTextureSize: Math.min(capability.maxTextureSize, 2048)
  }
}

/**
 * Format WebGL capability information as string
 * @param {WebGLCapability} capability - WebGL capability info
 * @returns {string} Formatted capability string
 */
export function formatCapabilityInfo(capability) {
  if (!capability.supported) {
    return 'WebGL is not supported in this browser'
  }

  return `WebGL ${capability.version} Supported
Renderer: ${capability.renderer}
Vendor: ${capability.vendor}
Max Texture Size: ${capability.maxTextureSize}px
Float Textures: ${capability.hasFloatTextures ? 'Yes' : 'No'}
Depth Textures: ${capability.hasDepthTexture ? 'Yes' : 'No'}
Instanced Arrays: ${capability.hasInstancedArrays ? 'Yes' : 'No'}`
}

export default {
  detectWebGL,
  isWebGLSupported,
  getRecommendedQualitySettings,
  formatCapabilityInfo
}
