/**
 * @fileoverview Main 3D viewer component using React Three Fiber
 */

import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useViewer } from '../context/ViewerContext'
import LoadingIndicator from './LoadingIndicator'
import { isWebGLSupported } from '../utils/webgl-detection'
import { ERROR_MESSAGES, LOADING_STATES } from '../utils/constants'
import { DEFAULT_MODEL } from '../config/models'

/**
 * Viewer3D Component
 * Main 3D viewing component with Three.js integration
 * @param {Object} props - Component props
 * @param {string} [props.modelUrl] - URL of model to load
 * @returns {JSX.Element}
 */
function Viewer3D({ modelUrl }) {
  const { state, actions } = useViewer()
  const [webglError, setWebglError] = useState(null)

  useEffect(() => {
    if (!isWebGLSupported()) {
      setWebglError(ERROR_MESSAGES.WEBGL_NOT_SUPPORTED)
      actions.setLoadingError(new Error(ERROR_MESSAGES.WEBGL_NOT_SUPPORTED))
      return
    }

    actions.updateLoading({
      status: LOADING_STATES.IDLE,
      progress: 0
    })
  }, [])

  if (webglError) {
    return (
      <div style={styles.errorContainer}>
        <h2 style={styles.errorTitle}>WebGL Not Supported</h2>
        <p style={styles.errorMessage}>{webglError}</p>
        <p style={styles.errorHint}>
          Please use a modern browser like Chrome, Firefox, Safari, or Edge.
        </p>
      </div>
    )
  }

  const showLoading = state.loading.status === LOADING_STATES.LOADING

  return (
    <div style={styles.container}>
      <Canvas
        camera={{
          position: [15, 5, 15],
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        shadows
        style={styles.canvas}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        }}
      >
        <Scene modelUrl={modelUrl || DEFAULT_MODEL.url} />
      </Canvas>

      {showLoading && (
        <LoadingIndicator
          progress={state.loading.progress}
          message="Loading 3D model..."
          show={true}
        />
      )}
    </div>
  )
}

/**
 * Scene Component
 * Contains 3D scene elements
 * @param {Object} props
 * @param {string} props.modelUrl - Model URL
 * @returns {JSX.Element}
 */
function Scene({ modelUrl }) {
  return (
    <>
      <color attach="background" args={['#87ceeb']} />
      
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#90EE90" />
      </mesh>

      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#ff6b6b" />
      </mesh>

      <axesHelper args={[5]} />
      <gridHelper args={[20, 20]} />
    </>
  )
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden'
  },
  canvas: {
    width: '100%',
    height: '100%',
    display: 'block'
  },
  errorContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    backgroundColor: '#f5f5f5'
  },
  errorTitle: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#d32f2f'
  },
  errorMessage: {
    fontSize: '1.2rem',
    marginBottom: '1rem',
    color: '#666',
    textAlign: 'center'
  },
  errorHint: {
    fontSize: '1rem',
    color: '#999',
    textAlign: 'center'
  }
}

export default Viewer3D
