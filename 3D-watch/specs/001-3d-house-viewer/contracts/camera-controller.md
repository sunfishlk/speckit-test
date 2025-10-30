# Contract: CameraController

**Module**: `src/core/camera-controller.js`  
**Purpose**: Manage camera positioning, animations, and viewpoint transitions  
**Dependencies**: Three.js, GSAP

---

## Interface

### Class: CameraController

Manages camera state, viewpoint transitions, and constraint enforcement.

#### Constructor

```javascript
/**
 * @param {THREE.PerspectiveCamera} camera - Three.js camera instance
 * @param {CameraConstraints} constraints - Movement constraints
 */
constructor(camera, constraints)
```

**Parameters**:
- `camera` (THREE.PerspectiveCamera): The camera to control
- `constraints` (CameraConstraints): { minDistance, maxDistance, minPolarAngle, maxPolarAngle, enablePan, panBounds }

---

#### Methods

##### `getCamera()`

Returns the controlled camera instance.

```javascript
/**
 * @returns {THREE.PerspectiveCamera}
 */
getCamera()
```

---

##### `setViewpoint(viewpoint, options)`

Animates camera to a preset viewpoint.

```javascript
/**
 * @param {Viewpoint} viewpoint - Target viewpoint
 * @param {Object} [options] - Animation options
 * @param {number} [options.duration=0.8] - Animation duration in seconds
 * @param {string} [options.ease='power2.inOut'] - GSAP easing function
 * @param {Function} [options.onComplete] - Callback when animation completes
 * @returns {Promise<void>} Resolves when animation completes
 */
async setViewpoint(viewpoint, options = {})
```

**Parameters**:
- `viewpoint` (Viewpoint): { position, target, fov }
- `options.duration` (number, default: 0.8): Animation time
- `options.ease` (string, default: 'power2.inOut'): Easing curve
- `options.onComplete` (function, optional): Completion callback

**Returns**: Promise resolving when transition completes

**Side Effects**: Updates camera position, target, and FOV

**Example**:
```javascript
await cameraController.setViewpoint(
  { position: { x: 10, y: 5, z: 10 }, target: { x: 0, y: 0, z: 0 }, fov: 75 },
  { duration: 1.0, ease: 'power3.out' }
)
```

---

##### `getCurrentState()`

Returns current camera state.

```javascript
/**
 * @returns {CameraState}
 */
getCurrentState()
```

**Returns**: { position, target, zoom, fov, isAnimating, constraints }

**Example**:
```javascript
const state = cameraController.getCurrentState()
console.log(state.position) // { x: 10, y: 5, z: 10 }
```

---

##### `setConstraints(constraints)`

Updates camera movement constraints.

```javascript
/**
 * @param {CameraConstraints} constraints - New constraints
 * @returns {void}
 */
setConstraints(constraints)
```

**Parameters**:
- `constraints` (CameraConstraints): { minDistance, maxDistance, etc. }

**Example**:
```javascript
cameraController.setConstraints({
  minDistance: 3,
  maxDistance: 30,
  minPolarAngle: 0,
  maxPolarAngle: Math.PI / 2
})
```

---

##### `isAnimating()`

Checks if camera is currently animating.

```javascript
/**
 * @returns {boolean}
 */
isAnimating()
```

**Returns**: true if animation in progress

---

##### `stopAnimation()`

Stops any ongoing camera animation.

```javascript
/**
 * @returns {void}
 */
stopAnimation()
```

**Side Effects**: Kills GSAP tweens, sets isAnimating to false

---

##### `reset()`

Resets camera to default viewpoint.

```javascript
/**
 * @param {Viewpoint} defaultViewpoint - Default camera position
 * @param {Object} [options] - Animation options
 * @returns {Promise<void>}
 */
async reset(defaultViewpoint, options = {})
```

**Parameters**:
- `defaultViewpoint` (Viewpoint): Initial camera configuration
- `options`: Same as `setViewpoint` options

---

##### `lookAt(target)`

Points camera at a target position.

```javascript
/**
 * @param {Vector3} target - Point to look at
 * @returns {void}
 */
lookAt(target)
```

**Parameters**:
- `target` (Vector3): { x, y, z }

**Example**:
```javascript
cameraController.lookAt({ x: 0, y: 2, z: 0 })
```

---

##### `dispose()`

Cleans up controller resources.

```javascript
/**
 * @returns {void}
 */
dispose()
```

**Side Effects**: Kills all GSAP tweens

---

## Events

The CameraController emits events for state changes:

### `viewpoint-start`

Fired when viewpoint transition begins.

**Payload**: `{ viewpoint: Viewpoint }`

### `viewpoint-complete`

Fired when viewpoint transition completes.

**Payload**: `{ viewpoint: Viewpoint }`

### `camera-move`

Fired when camera position changes (during manual control).

**Payload**: `{ position: Vector3, target: Vector3 }`

---

## Usage Example

```javascript
import { CameraController } from './core/camera-controller.js'

// Initialize
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
const constraints = {
  minDistance: 5,
  maxDistance: 50,
  minPolarAngle: 0,
  maxPolarAngle: Math.PI / 2,
  enablePan: true
}
const controller = new CameraController(camera, constraints)

// Set viewpoint
await controller.setViewpoint(
  { position: { x: 15, y: 5, z: 15 }, target: { x: 0, y: 0, z: 0 }, fov: 75 },
  { duration: 1.0, ease: 'power2.inOut' }
)

// Check state
if (controller.isAnimating()) {
  console.log('Camera is moving...')
}

// Listen to events
controller.on('viewpoint-complete', (event) => {
  console.log('Arrived at:', event.viewpoint.name)
})

// Cleanup
controller.dispose()
```

---

## Implementation Notes

- Use GSAP for smooth animations with easing
- Must enforce constraints during animation
- Should cancel previous animation when new one starts
- Consider path optimization for long transitions (avoid passing through objects)
- Support interrupting animations with user input
