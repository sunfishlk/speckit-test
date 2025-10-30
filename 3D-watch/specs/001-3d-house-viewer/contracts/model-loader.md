# Contract: ModelLoader

**Module**: `src/loaders/model-loader.js`  
**Purpose**: Load and parse 3D house models with progress tracking  
**Dependencies**: Three.js GLTFLoader, DRACOLoader

---

## Interface

### Class: ModelLoader

Handles asynchronous loading of GLTF/GLB models with Draco decompression and progress reporting.

#### Constructor

```javascript
/**
 * @param {Object} [options] - Loader options
 * @param {string} [options.dracoDecoderPath] - Path to Draco decoder
 * @param {boolean} [options.enableDraco=true] - Enable Draco compression
 */
constructor(options = {})
```

**Parameters**:
- `options.dracoDecoderPath` (string, optional): Path to Draco WASM files
- `options.enableDraco` (boolean, default: true): Enable Draco support

---

#### Methods

##### `load(url, onProgress)`

Loads a 3D model from URL.

```javascript
/**
 * @param {string} url - Path to GLTF/GLB file
 * @param {Function} [onProgress] - Progress callback
 * @returns {Promise<THREE.Group>} Loaded model
 * @throws {Error} If loading fails
 */
async load(url, onProgress = null)
```

**Parameters**:
- `url` (string): Model file path
- `onProgress` (function, optional): `(progress) => void` where progress = { loaded, total, percentage }

**Returns**: Promise resolving to Three.js Group containing the model

**Throws**: Error with message if fetch or parse fails

**Example**:
```javascript
const model = await loader.load('/models/house.glb', (progress) => {
  console.log(`Loading: ${progress.percentage}%`)
})
```

---

##### `loadWithMetadata(url, onProgress)`

Loads model and extracts metadata.

```javascript
/**
 * @param {string} url - Path to GLTF/GLB file
 * @param {Function} [onProgress] - Progress callback
 * @returns {Promise<LoadedModelData>}
 * @throws {Error} If loading fails
 */
async loadWithMetadata(url, onProgress = null)
```

**Returns**: Promise resolving to:
```javascript
{
  model: THREE.Group,
  metadata: {
    polygonCount: number,
    textureCount: number,
    boundingBox: { min: Vector3, max: Vector3 },
    animations: string[], // Animation names
    cameras: string[]     // Camera names (if any)
  }
}
```

**Example**:
```javascript
const { model, metadata } = await loader.loadWithMetadata('/models/house.glb')
console.log(`Polygons: ${metadata.polygonCount}`)
```

---

##### `preload(urls)`

Preloads multiple models in parallel.

```javascript
/**
 * @param {string[]} urls - Array of model URLs
 * @returns {Promise<void>}
 */
async preload(urls)
```

**Parameters**:
- `urls` (string[]): List of model paths to preload

**Returns**: Promise resolving when all models cached

**Example**:
```javascript
await loader.preload([
  '/models/house1.glb',
  '/models/house2.glb',
  '/models/house3.glb'
])
```

---

##### `clearCache()`

Clears cached models from memory.

```javascript
/**
 * @returns {void}
 */
clearCache()
```

**Side Effects**: Releases memory used by cached models

---

##### `dispose()`

Cleans up loader resources.

```javascript
/**
 * @returns {void}
 */
dispose()
```

**Side Effects**: Disposes Three.js loaders and clears cache

---

## Progress Callback Format

The `onProgress` callback receives an object:

```javascript
{
  loaded: number,      // Bytes loaded
  total: number,       // Total bytes
  percentage: number   // 0-100
}
```

---

## Error Handling

Errors include context for debugging:

```javascript
try {
  await loader.load('/models/missing.glb')
} catch (error) {
  // error.message = "Failed to load model: 404 Not Found"
  // error.url = "/models/missing.glb"
  // error.code = 404
}
```

---

## Usage Example

```javascript
import { ModelLoader } from './loaders/model-loader.js'

// Initialize
const loader = new ModelLoader({
  dracoDecoderPath: '/draco/',
  enableDraco: true
})

// Load with progress
const model = await loader.load('/models/house.glb', (progress) => {
  console.log(`Loaded ${progress.percentage}%`)
})

// Add to scene
scene.add(model)

// Load with metadata
const { model: house, metadata } = await loader.loadWithMetadata('/models/villa.glb')
console.log(`Model has ${metadata.polygonCount} polygons`)

// Preload multiple
await loader.preload(['/models/house1.glb', '/models/house2.glb'])

// Cleanup
loader.dispose()
```

---

## Implementation Notes

- Must support both GLTF and GLB formats
- Draco decompression should be optional but enabled by default
- Progress reporting should be accurate (not just 0% → 100%)
- Cache loaded models to avoid re-fetching
- Provide clear error messages for common issues (404, CORS, invalid format)
- Calculate bounding box for camera positioning
- Count polygons for LOD decisions
- Dispose geometry and materials when clearing cache
