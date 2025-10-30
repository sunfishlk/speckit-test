# Data Model: 3D House Viewer

**Feature**: 001-3d-house-viewer  
**Date**: 2025-10-30  
**Purpose**: Define entities, state structures, and data relationships

---

## Entity Definitions

### 1. HouseModel

Represents a 3D house model with its associated metadata and rendering configuration.

**Fields**:
- `id` (string): Unique identifier for the model
- `url` (string): Path to GLTF/GLB file
- `name` (string): Display name (e.g., "Modern Villa", "City Apartment")
- `description` (string, optional): Brief description of the property
- `boundingBox` (BoundingBox): Model dimensions for camera positioning
- `defaultViewpoint` (Viewpoint): Initial camera configuration
- `thumbnail` (string, optional): Preview image URL
- `metadata` (object): Additional properties
  - `polygonCount` (number): Total polygon count
  - `textureCount` (number): Number of textures
  - `fileSize` (number): Model file size in bytes
  - `compressionType` (string): "draco" | "none"

**Relationships**:
- Has many `Viewpoint` (preset camera positions)
- References one `SceneConfiguration`

**Validation Rules**:
- `url` must be valid GLTF/GLB file path
- `boundingBox` must have positive dimensions
- `polygonCount` should be ≤ 100,000 for performance targets

**Example**:
```javascript
{
  id: "house-001",
  url: "/models/modern-villa.glb",
  name: "Modern Villa",
  description: "3-bedroom contemporary home",
  boundingBox: {
    min: { x: -10, y: 0, z: -10 },
    max: { x: 10, y: 8, z: 10 }
  },
  defaultViewpoint: { /* Viewpoint object */ },
  thumbnail: "/thumbnails/modern-villa.jpg",
  metadata: {
    polygonCount: 85000,
    textureCount: 12,
    fileSize: 2400000,
    compressionType: "draco"
  }
}
```

---

### 2. Viewpoint

Represents a predefined camera configuration for quick navigation.

**Fields**:
- `id` (string): Unique identifier
- `name` (string): Display name (e.g., "Front Entrance", "Living Room")
- `description` (string, optional): Brief description
- `position` (Vector3): Camera position in 3D space
  - `x` (number): X coordinate
  - `y` (number): Y coordinate
  - `z` (number): Z coordinate
- `target` (Vector3): Point the camera is looking at
- `fov` (number): Field of view in degrees (default: 75)
- `category` (string): "exterior" | "interior" | "overview"
- `order` (number): Display order in UI (ascending)
- `icon` (string, optional): Icon name or URL

**Relationships**:
- Belongs to one `HouseModel`

**Validation Rules**:
- `position` and `target` cannot be identical
- `fov` must be between 30 and 120 degrees
- `order` must be unique within model's viewpoints

**Example**:
```javascript
{
  id: "vp-001",
  name: "Front Entrance",
  description: "Main entrance with driveway view",
  position: { x: 15, y: 2, z: 15 },
  target: { x: 0, y: 1.5, z: 0 },
  fov: 75,
  category: "exterior",
  order: 1,
  icon: "door"
}
```

---

### 3. CameraState

Represents the current runtime camera configuration.

**Fields**:
- `position` (Vector3): Current camera position
- `target` (Vector3): Current look-at point
- `zoom` (number): Current zoom level (1.0 = default)
- `fov` (number): Current field of view
- `isAnimating` (boolean): Whether camera is currently transitioning
- `constraints` (CameraConstraints): Movement boundaries
  - `minDistance` (number): Minimum zoom distance
  - `maxDistance` (number): Maximum zoom distance
  - `minPolarAngle` (number): Minimum vertical angle (radians)
  - `maxPolarAngle` (number): Maximum vertical angle (radians)
  - `enablePan` (boolean): Whether panning is allowed
  - `panBounds` (BoundingBox, optional): Pan limits

**State Transitions**:
1. **Idle** → **Animating**: User selects preset viewpoint
2. **Animating** → **Idle**: Animation completes
3. **Idle** → **UserControlled**: User drags mouse
4. **UserControlled** → **Idle**: User releases mouse

**Validation Rules**:
- `zoom` must be within `minDistance` and `maxDistance`
- `position` must respect `panBounds` if defined
- Cannot modify position while `isAnimating` is true

**Example**:
```javascript
{
  position: { x: 10, y: 5, z: 10 },
  target: { x: 0, y: 0, z: 0 },
  zoom: 1.0,
  fov: 75,
  isAnimating: false,
  constraints: {
    minDistance: 5,
    maxDistance: 50,
    minPolarAngle: 0,
    maxPolarAngle: Math.PI / 2,
    enablePan: true,
    panBounds: {
      min: { x: -20, y: 0, z: -20 },
      max: { x: 20, y: 10, z: 20 }
    }
  }
}
```

---

### 4. SceneConfiguration

Represents global 3D scene settings (lighting, environment, rendering quality).

**Fields**:
- `lighting` (object): Light configuration
  - `ambientLight` (object): Ambient light settings
    - `color` (string): Hex color (e.g., "#ffffff")
    - `intensity` (number): 0.0 to 1.0
  - `directionalLight` (object): Main directional light
    - `color` (string): Hex color
    - `intensity` (number): 0.0 to 2.0
    - `position` (Vector3): Light source position
    - `castShadow` (boolean): Enable shadow casting
- `environment` (object): Background and environment
  - `background` (string): Background color or texture path
  - `skybox` (string, optional): HDR environment map path
  - `fog` (object, optional): Fog settings
    - `color` (string): Fog color
    - `near` (number): Fog start distance
    - `far` (number): Fog end distance
- `renderer` (object): Rendering quality settings
  - `antialias` (boolean): Enable antialiasing
  - `shadowMapEnabled` (boolean): Enable shadow maps
  - `shadowMapType` (string): "basic" | "pcf" | "pcfsoft"
  - `toneMapping` (string): "linear" | "aces" | "cineon"
  - `toneMappingExposure` (number): Exposure value (0.5 to 2.0)
  - `pixelRatio` (number): Device pixel ratio (1.0 to 2.0)
- `performance` (object): Performance settings
  - `lodEnabled` (boolean): Enable level of detail
  - `frustumCulling` (boolean): Enable frustum culling (default true)
  - `maxTextureSize` (number): Maximum texture dimension (512, 1024, 2048, 4096)

**Validation Rules**:
- All intensity values must be non-negative
- `pixelRatio` should not exceed `window.devicePixelRatio`
- `maxTextureSize` must be power of 2

**Example**:
```javascript
{
  lighting: {
    ambientLight: {
      color: "#ffffff",
      intensity: 0.5
    },
    directionalLight: {
      color: "#ffffff",
      intensity: 1.0,
      position: { x: 10, y: 20, z: 10 },
      castShadow: true
    }
  },
  environment: {
    background: "#87ceeb",
    skybox: "/textures/sky.hdr",
    fog: {
      color: "#cccccc",
      near: 50,
      far: 200
    }
  },
  renderer: {
    antialias: true,
    shadowMapEnabled: true,
    shadowMapType: "pcfsoft",
    toneMapping: "aces",
    toneMappingExposure: 1.0,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
  },
  performance: {
    lodEnabled: true,
    frustumCulling: true,
    maxTextureSize: 2048
  }
}
```

---

### 5. LoadingState

Represents the current model loading progress and status.

**Fields**:
- `status` (string): "idle" | "loading" | "loaded" | "error"
- `progress` (number): Loading progress (0.0 to 1.0)
- `bytesLoaded` (number): Bytes downloaded
- `bytesTotal` (number): Total bytes to download
- `error` (Error, optional): Error object if status is "error"
- `timestamp` (number): Timestamp of last status change

**State Transitions**:
1. **idle** → **loading**: Start model fetch
2. **loading** → **loaded**: Model parsed successfully
3. **loading** → **error**: Fetch or parse failed
4. **error** → **loading**: Retry attempt
5. **loaded** → **loading**: Load different model

**Example**:
```javascript
{
  status: "loading",
  progress: 0.65,
  bytesLoaded: 1560000,
  bytesTotal: 2400000,
  error: null,
  timestamp: 1698765432000
}
```

---

## Application State Structure

Complete state tree for the viewer application:

```javascript
const ViewerState = {
  // Current model being viewed
  currentModel: HouseModel | null,
  
  // Available viewpoints for current model
  viewpoints: Viewpoint[],
  
  // Active viewpoint (null if user-controlled)
  activeViewpoint: string | null, // Viewpoint ID
  
  // Current camera state
  camera: CameraState,
  
  // Scene configuration
  scene: SceneConfiguration,
  
  // Loading status
  loading: LoadingState,
  
  // UI state
  ui: {
    controlsEnabled: boolean,
    viewpointPanelOpen: boolean,
    settingsPanelOpen: boolean,
    performanceStatsVisible: boolean
  },
  
  // Performance metrics
  performance: {
    fps: number,
    memory: number, // MB
    drawCalls: number,
    triangles: number
  }
}
```

---

## Data Flow

### Model Loading Flow
```
1. User selects model
   ↓
2. Dispatch LOAD_MODEL action
   ↓
3. LoadingState → "loading"
   ↓
4. Fetch GLTF file (track progress)
   ↓
5. Parse and decompress
   ↓
6. Create Three.js scene objects
   ↓
7. LoadingState → "loaded"
   ↓
8. Set currentModel and viewpoints
   ↓
9. Apply defaultViewpoint to camera
```

### Viewpoint Transition Flow
```
1. User clicks viewpoint button
   ↓
2. Set activeViewpoint ID
   ↓
3. Set CameraState.isAnimating = true
   ↓
4. Start GSAP animation (position, target, fov)
   ↓
5. Update CameraState each frame
   ↓
6. Animation completes
   ↓
7. Set CameraState.isAnimating = false
```

### Manual Camera Control Flow
```
1. User drags mouse
   ↓
2. Set activeViewpoint = null
   ↓
3. OrbitControls updates camera position
   ↓
4. Validate against constraints
   ↓
5. Update CameraState
   ↓
6. Trigger re-render if needed
```

---

## Persistence (Optional Future Enhancement)

Currently no persistence required. All state is ephemeral.

**Potential future persistence needs**:
- Save user's favorite viewpoints to localStorage
- Remember quality settings across sessions
- Cache loaded models in IndexedDB

---

## Type Definitions (JSDoc)

```javascript
/**
 * @typedef {Object} Vector3
 * @property {number} x
 * @property {number} y
 * @property {number} z
 */

/**
 * @typedef {Object} BoundingBox
 * @property {Vector3} min - Minimum corner
 * @property {Vector3} max - Maximum corner
 */

/**
 * @typedef {Object} HouseModel
 * @property {string} id
 * @property {string} url
 * @property {string} name
 * @property {string} [description]
 * @property {BoundingBox} boundingBox
 * @property {Viewpoint} defaultViewpoint
 * @property {string} [thumbnail]
 * @property {Object} metadata
 */

/**
 * @typedef {Object} Viewpoint
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {Vector3} position
 * @property {Vector3} target
 * @property {number} fov
 * @property {string} category
 * @property {number} order
 * @property {string} [icon]
 */

// Additional type definitions...
```

---

## Next Steps

1. ✅ Data model complete
2. ⏳ Generate component interface contracts
3. ⏳ Create quickstart.md for setup
4. ⏳ Update agent context
