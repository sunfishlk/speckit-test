/**
 * @fileoverview OrbitController wrapper for mouse-based camera control
 * Wraps @react-three/drei OrbitControls with project-specific configuration
 */

import { useRef, useEffect } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useViewer } from '../context/ViewerContext'
import { CAMERA_CONTROLS } from '../utils/constants'

/**
 * @typedef {import('../types/index.js').CameraConstraints} CameraConstraints
 */

/**
 * OrbitController Component
 * Configures OrbitControls with camera constraints
 * @param {Object} props
 * @param {CameraConstraints} props.constraints - Camera constraints
 * @param {Function} [props.onUpdate] - Callback when camera updates
 * @param {boolean} [props.enabled=true] - Whether controls are enabled
 * @returns {JSX.Element}
 */
export function OrbitController({ constraints, onUpdate, enabled = true }) {
  const controlsRef = useRef()
  const { actions } = useViewer()

  useEffect(() => {
    if (!controlsRef.current || !constraints) return

    const controls = controlsRef.current

    controls.minDistance = constraints.minDistance
    controls.maxDistance = constraints.maxDistance
    controls.minPolarAngle = constraints.minPolarAngle
    controls.maxPolarAngle = constraints.maxPolarAngle
    controls.enablePan = constraints.enablePan

    if (constraints.panBounds && constraints.enablePan) {
      controls.maxTargetRadius = Math.max(
        Math.abs(constraints.panBounds.max.x - constraints.panBounds.min.x),
        Math.abs(constraints.panBounds.max.z - constraints.panBounds.min.z)
      ) / 2
    }
  }, [constraints])

  const handleChange = () => {
    if (!controlsRef.current) return

    const camera = controlsRef.current.object
    const target = controlsRef.current.target

    const cameraState = {
      position: {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      },
      target: {
        x: target.x,
        y: target.y,
        z: target.z
      },
      fov: camera.fov,
      isAnimating: false
    }

    actions.updateCamera(cameraState)
    actions.setActiveViewpoint(null)

    if (onUpdate) {
      onUpdate(cameraState)
    }
  }

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={enabled}
      enableDamping={true}
      dampingFactor={CAMERA_CONTROLS.DAMPING_FACTOR}
      rotateSpeed={CAMERA_CONTROLS.ROTATE_SPEED}
      zoomSpeed={CAMERA_CONTROLS.ZOOM_SPEED}
      panSpeed={CAMERA_CONTROLS.PAN_SPEED}
      mouseButtons={{
        LEFT: 0,
        MIDDLE: 1,
        RIGHT: 2
      }}
      touches={{
        ONE: 0,
        TWO: 2
      }}
      onChange={handleChange}
      makeDefault
    />
  )
}

export default OrbitController
