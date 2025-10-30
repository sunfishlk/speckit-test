/**
 * @fileoverview 3D Model component with GLTF loading
 */

import { useEffect, useState, useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { useViewer } from '../context/ViewerContext'
import { LOADING_STATES } from '../utils/constants'

/**
 * Model3D Component
 * Loads and displays a GLTF/GLB model
 * @param {Object} props
 * @param {string} props.url - Model URL
 * @returns {JSX.Element|null}
 */
function Model3D({ url }) {
  const { actions } = useViewer()
  const [error, setError] = useState(null)

  try {
    // Configure Draco loader
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')

    // Try to load the model
    const gltf = useLoader(GLTFLoader, url, (loader) => {
      loader.setDRACOLoader(dracoLoader)
    })

    useEffect(() => {
      if (gltf) {
        actions.updateLoading({
          status: LOADING_STATES.LOADED,
          progress: 100
        })
      }
    }, [gltf, actions])

    if (!gltf || !gltf.scene) {
      return null
    }

    return <primitive object={gltf.scene} />
  } catch (err) {
    console.error('Model loading error:', err)
    setError(err)
    
    useEffect(() => {
      if (error) {
        actions.setLoadingError(error)
      }
    }, [error, actions])

    return null
  }
}

export default Model3D
