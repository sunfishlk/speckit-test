/**
 * @fileoverview JSDoc type definitions for 3D House Viewer
 * Provides type safety without TypeScript
 */

/**
 * @typedef {Object} Vector3
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 * @property {number} z - Z coordinate
 */

/**
 * @typedef {Object} BoundingBox
 * @property {Vector3} min - Minimum corner of bounding box
 * @property {Vector3} max - Maximum corner of bounding box
 */

/**
 * @typedef {Object} Viewpoint
 * @property {string} id - Unique identifier
 * @property {string} name - Display name (e.g., "Front Entrance", "Living Room")
 * @property {string} [description] - Optional description
 * @property {Vector3} position - Camera position in 3D space
 * @property {Vector3} target - Point the camera is looking at
 * @property {number} fov - Field of view in degrees (default: 75)
 * @property {string} category - "exterior" | "interior" | "overview"
 * @property {number} order - Display order in UI (ascending)
 * @property {string} [icon] - Optional icon name or URL
 */

/**
 * @typedef {Object} CameraConstraints
 * @property {number} minDistance - Minimum zoom distance
 * @property {number} maxDistance - Maximum zoom distance
 * @property {number} minPolarAngle - Minimum vertical angle (radians)
 * @property {number} maxPolarAngle - Maximum vertical angle (radians)
 * @property {boolean} enablePan - Whether panning is allowed
 * @property {BoundingBox} [panBounds] - Optional pan limits
 */

/**
 * @typedef {Object} CameraState
 * @property {Vector3} position - Current camera position
 * @property {Vector3} target - Current look-at point
 * @property {number} zoom - Current zoom level (1.0 = default)
 * @property {number} fov - Current field of view
 * @property {boolean} isAnimating - Whether camera is currently transitioning
 * @property {CameraConstraints} constraints - Movement boundaries
 */

/**
 * @typedef {Object} LightingConfig
 * @property {Object} ambientLight - Ambient light settings
 * @property {string} ambientLight.color - Hex color (e.g., "#ffffff")
 * @property {number} ambientLight.intensity - Light intensity (0.0 to 1.0)
 * @property {Object} directionalLight - Directional light settings
 * @property {string} directionalLight.color - Hex color
 * @property {number} directionalLight.intensity - Light intensity (0.0 to 2.0)
 * @property {Vector3} directionalLight.position - Light source position
 * @property {boolean} directionalLight.castShadow - Enable shadow casting
 */

/**
 * @typedef {Object} EnvironmentConfig
 * @property {string} background - Background color or texture path
 * @property {string} [skybox] - Optional HDR environment map path
 * @property {Object} [fog] - Optional fog settings
 * @property {string} fog.color - Fog color
 * @property {number} fog.near - Fog start distance
 * @property {number} fog.far - Fog end distance
 */

/**
 * @typedef {Object} RendererConfig
 * @property {boolean} antialias - Enable antialiasing
 * @property {boolean} shadowMapEnabled - Enable shadow maps
 * @property {string} shadowMapType - "basic" | "pcf" | "pcfsoft"
 * @property {string} toneMapping - "linear" | "aces" | "cineon"
 * @property {number} toneMappingExposure - Exposure value (0.5 to 2.0)
 * @property {number} pixelRatio - Device pixel ratio (1.0 to 2.0)
 */

/**
 * @typedef {Object} PerformanceConfig
 * @property {boolean} lodEnabled - Enable level of detail
 * @property {boolean} frustumCulling - Enable frustum culling
 * @property {number} maxTextureSize - Maximum texture dimension (512, 1024, 2048, 4096)
 */

/**
 * @typedef {Object} SceneConfiguration
 * @property {LightingConfig} lighting - Light configuration
 * @property {EnvironmentConfig} environment - Background and environment
 * @property {RendererConfig} renderer - Rendering quality settings
 * @property {PerformanceConfig} performance - Performance settings
 */

/**
 * @typedef {Object} HouseModelMetadata
 * @property {number} polygonCount - Total polygon count
 * @property {number} textureCount - Number of textures
 * @property {number} fileSize - Model file size in bytes
 * @property {string} compressionType - "draco" | "none"
 */

/**
 * @typedef {Object} HouseModel
 * @property {string} id - Unique identifier
 * @property {string} url - Path to GLTF/GLB file
 * @property {string} name - Display name
 * @property {string} [description] - Optional brief description
 * @property {BoundingBox} boundingBox - Model dimensions
 * @property {Viewpoint} defaultViewpoint - Initial camera configuration
 * @property {string} [thumbnail] - Optional preview image URL
 * @property {HouseModelMetadata} metadata - Additional properties
 */

/**
 * @typedef {('idle'|'loading'|'loaded'|'error')} LoadingStatus
 */

/**
 * @typedef {Object} LoadingState
 * @property {LoadingStatus} status - Current loading status
 * @property {number} progress - Loading progress (0.0 to 1.0)
 * @property {number} bytesLoaded - Bytes downloaded
 * @property {number} bytesTotal - Total bytes to download
 * @property {Error} [error] - Error object if status is "error"
 * @property {number} timestamp - Timestamp of last status change
 */

/**
 * @typedef {Object} LoadProgressEvent
 * @property {number} loaded - Bytes loaded
 * @property {number} total - Total bytes
 * @property {number} percentage - Progress percentage (0-100)
 */

/**
 * @typedef {Object} LoadedModelData
 * @property {THREE.Group} model - Loaded Three.js model
 * @property {Object} metadata - Model metadata
 * @property {number} metadata.polygonCount - Polygon count
 * @property {number} metadata.textureCount - Texture count
 * @property {BoundingBox} metadata.boundingBox - Model bounds
 * @property {string[]} metadata.animations - Animation names
 * @property {string[]} metadata.cameras - Camera names
 */

/**
 * @typedef {Object} PerformanceMetrics
 * @property {number} fps - Frames per second
 * @property {number} memory - Memory usage in MB
 * @property {number} drawCalls - Number of draw calls per frame
 * @property {number} triangles - Number of triangles rendered
 */

/**
 * @typedef {Object} UIState
 * @property {boolean} controlsEnabled - Whether controls are enabled
 * @property {boolean} viewpointPanelOpen - Whether viewpoint panel is open
 * @property {boolean} settingsPanelOpen - Whether settings panel is open
 * @property {boolean} performanceStatsVisible - Whether performance stats are visible
 */

/**
 * @typedef {Object} ViewerState
 * @property {HouseModel} [currentModel] - Current model being viewed
 * @property {Viewpoint[]} viewpoints - Available viewpoints for current model
 * @property {string} [activeViewpoint] - Active viewpoint ID (null if user-controlled)
 * @property {CameraState} camera - Current camera state
 * @property {SceneConfiguration} scene - Scene configuration
 * @property {LoadingState} loading - Loading status
 * @property {UIState} ui - UI state
 * @property {PerformanceMetrics} performance - Performance metrics
 */

export {}
