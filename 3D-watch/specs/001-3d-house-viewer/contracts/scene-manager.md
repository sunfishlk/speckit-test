# Contract: SceneManager

**Module**: `src/core/scene-manager.js`  
**Purpose**: Initialize and manage the Three.js scene, lighting, and environment  
**Dependencies**: Three.js

---

## Interface

### Class: SceneManager

Manages the Three.js scene lifecycle, lighting configuration, and environment setup.

#### Constructor

```javascript
/**
 * @param {SceneConfiguration} config - Initial scene configuration
 */
constructor(config)
```

**Parameters**:
- `config` (SceneConfiguration): Lighting, environment, and renderer settings

**Throws**:
- `Error` if config is invalid

---

#### Methods

##### `getScene()`

Returns the Three.js scene instance.

```javascript
/**
 * @returns {THREE.Scene} The scene object
 */
getScene()
```

**Returns**: Three.js Scene object

**Example**:
```javascript
const scene = sceneManager.getScene()
scene.add(myMesh)
```

---

##### `updateLighting(lightingConfig)`

Updates scene lighting configuration.

```javascript
/**
 * @param {Object} lightingConfig - New lighting settings
 * @param {Object} lightingConfig.ambientLight - Ambient light config
 * @param {Object} lightingConfig.directionalLight - Directional light config
 * @returns {void}
 */
updateLighting(lightingConfig)
```

**Parameters**:
- `lightingConfig.ambientLight`: { color, intensity }
- `lightingConfig.directionalLight`: { color, intensity, position, castShadow }

**Side Effects**: Modifies scene lights

**Example**:
```javascript
sceneManager.updateLighting({
  ambientLight: { color: '#ffffff', intensity: 0.6 },
  directionalLight: { color: '#ffddaa', intensity: 1.2, position: { x: 10, y: 20, z: 10 }, castShadow: true }
})
```

---

##### `setBackground(background)`

Sets the scene background (color or texture).

```javascript
/**
 * @param {string} background - Hex color or texture path
 * @returns {void}
 */
setBackground(background)
```

**Parameters**:
- `background` (string): Hex color (e.g., "#87ceeb") or path to texture

**Example**:
```javascript
sceneManager.setBackground('#87ceeb')
```

---

##### `setEnvironment(environmentConfig)`

Configures environment settings (skybox, fog).

```javascript
/**
 * @param {Object} environmentConfig - Environment settings
 * @param {string} [environmentConfig.skybox] - HDR environment map path
 * @param {Object} [environmentConfig.fog] - Fog configuration
 * @returns {Promise<void>}
 */
async setEnvironment(environmentConfig)
```

**Parameters**:
- `environmentConfig.skybox` (string, optional): Path to HDR file
- `environmentConfig.fog` (object, optional): { color, near, far }

**Returns**: Promise that resolves when environment is loaded

**Example**:
```javascript
await sceneManager.setEnvironment({
  skybox: '/textures/sky.hdr',
  fog: { color: '#cccccc', near: 50, far: 200 }
})
```

---

##### `addObject(object)`

Adds a Three.js object to the scene.

```javascript
/**
 * @param {THREE.Object3D} object - Object to add
 * @returns {void}
 */
addObject(object)
```

**Parameters**:
- `object` (THREE.Object3D): Mesh, group, or other 3D object

**Example**:
```javascript
const mesh = new THREE.Mesh(geometry, material)
sceneManager.addObject(mesh)
```

---

##### `removeObject(object)`

Removes an object from the scene.

```javascript
/**
 * @param {THREE.Object3D} object - Object to remove
 * @returns {void}
 */
removeObject(object)
```

**Parameters**:
- `object` (THREE.Object3D): Object to remove

**Side Effects**: Disposes geometry and materials

**Example**:
```javascript
sceneManager.removeObject(mesh)
```

---

##### `clear()`

Removes all objects from the scene.

```javascript
/**
 * @returns {void}
 */
clear()
```

**Side Effects**: Disposes all scene objects, preserves lighting

**Example**:
```javascript
sceneManager.clear() // Remove all models
```

---

##### `dispose()`

Cleans up all scene resources.

```javascript
/**
 * @returns {void}
 */
dispose()
```

**Side Effects**: Disposes scene, lights, and all objects

**Example**:
```javascript
sceneManager.dispose() // Call on unmount
```

---

## Usage Example

```javascript
import { SceneManager } from './core/scene-manager.js'

// Initialize
const config = {
  lighting: {
    ambientLight: { color: '#ffffff', intensity: 0.5 },
    directionalLight: { color: '#ffffff', intensity: 1.0, position: { x: 10, y: 20, z: 10 }, castShadow: true }
  },
  environment: {
    background: '#87ceeb'
  }
}
const sceneManager = new SceneManager(config)

// Get scene
const scene = sceneManager.getScene()

// Add object
const mesh = new THREE.Mesh(geometry, material)
sceneManager.addObject(mesh)

// Update lighting
sceneManager.updateLighting({
  ambientLight: { color: '#ffeecc', intensity: 0.7 }
})

// Cleanup
sceneManager.dispose()
```

---

## Implementation Notes

- Must properly dispose Three.js objects to prevent memory leaks
- Lighting updates should be efficient (avoid recreating lights)
- Support both color backgrounds and HDR environments
- Shadow maps should be configurable for performance
- Fog is optional and may be null
