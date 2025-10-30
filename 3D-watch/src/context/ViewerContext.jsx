/**
 * @fileoverview React Context for global viewer state management
 */

import { createContext, useContext, useReducer, useCallback } from 'react'
import { LOADING_STATES, DEFAULT_CAMERA_SETTINGS, CAMERA_CONSTRAINTS } from '../utils/constants'

/**
 * @typedef {import('../types/index.js').ViewerState} ViewerState
 * @typedef {import('../types/index.js').HouseModel} HouseModel
 * @typedef {import('../types/index.js').Viewpoint} Viewpoint
 * @typedef {import('../types/index.js').LoadingState} LoadingState
 * @typedef {import('../types/index.js').PerformanceMetrics} PerformanceMetrics
 */

const initialState = {
  currentModel: null,
  viewpoints: [],
  activeViewpoint: null,
  camera: {
    position: DEFAULT_CAMERA_SETTINGS.INITIAL_POSITION,
    target: DEFAULT_CAMERA_SETTINGS.INITIAL_TARGET,
    zoom: 1.0,
    fov: DEFAULT_CAMERA_SETTINGS.FOV,
    isAnimating: false,
    constraints: {
      minDistance: CAMERA_CONSTRAINTS.MIN_DISTANCE,
      maxDistance: CAMERA_CONSTRAINTS.MAX_DISTANCE,
      minPolarAngle: CAMERA_CONSTRAINTS.MIN_POLAR_ANGLE,
      maxPolarAngle: CAMERA_CONSTRAINTS.MAX_POLAR_ANGLE,
      enablePan: CAMERA_CONSTRAINTS.ENABLE_PAN
    }
  },
  scene: null,
  loading: {
    status: LOADING_STATES.IDLE,
    progress: 0,
    bytesLoaded: 0,
    bytesTotal: 0,
    error: null,
    timestamp: Date.now()
  },
  ui: {
    controlsEnabled: true,
    viewpointPanelOpen: false,
    settingsPanelOpen: false,
    performanceStatsVisible: false
  },
  performance: {
    fps: 60,
    memory: 0,
    drawCalls: 0,
    triangles: 0
  }
}

const ViewerContext = createContext(null)

const actionTypes = {
  SET_MODEL: 'SET_MODEL',
  SET_VIEWPOINTS: 'SET_VIEWPOINTS',
  SET_ACTIVE_VIEWPOINT: 'SET_ACTIVE_VIEWPOINT',
  UPDATE_CAMERA: 'UPDATE_CAMERA',
  SET_CAMERA_ANIMATING: 'SET_CAMERA_ANIMATING',
  UPDATE_LOADING: 'UPDATE_LOADING',
  SET_LOADING_ERROR: 'SET_LOADING_ERROR',
  UPDATE_UI: 'UPDATE_UI',
  UPDATE_PERFORMANCE: 'UPDATE_PERFORMANCE',
  RESET: 'RESET'
}

/**
 * Viewer state reducer
 * @param {ViewerState} state - Current state
 * @param {Object} action - Action object
 * @returns {ViewerState} New state
 */
function viewerReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_MODEL:
      return {
        ...state,
        currentModel: action.payload,
        loading: {
          ...state.loading,
          status: LOADING_STATES.LOADED,
          timestamp: Date.now()
        }
      }

    case actionTypes.SET_VIEWPOINTS:
      return {
        ...state,
        viewpoints: action.payload
      }

    case actionTypes.SET_ACTIVE_VIEWPOINT:
      return {
        ...state,
        activeViewpoint: action.payload
      }

    case actionTypes.UPDATE_CAMERA:
      return {
        ...state,
        camera: {
          ...state.camera,
          ...action.payload
        }
      }

    case actionTypes.SET_CAMERA_ANIMATING:
      return {
        ...state,
        camera: {
          ...state.camera,
          isAnimating: action.payload
        }
      }

    case actionTypes.UPDATE_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload,
          timestamp: Date.now()
        }
      }

    case actionTypes.SET_LOADING_ERROR:
      return {
        ...state,
        loading: {
          ...state.loading,
          status: LOADING_STATES.ERROR,
          error: action.payload,
          timestamp: Date.now()
        }
      }

    case actionTypes.UPDATE_UI:
      return {
        ...state,
        ui: {
          ...state.ui,
          ...action.payload
        }
      }

    case actionTypes.UPDATE_PERFORMANCE:
      return {
        ...state,
        performance: {
          ...state.performance,
          ...action.payload
        }
      }

    case actionTypes.RESET:
      return initialState

    default:
      return state
  }
}

/**
 * ViewerContext Provider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element}
 */
export function ViewerProvider({ children }) {
  const [state, dispatch] = useReducer(viewerReducer, initialState)

  const setModel = useCallback((model) => {
    dispatch({ type: actionTypes.SET_MODEL, payload: model })
  }, [])

  const setViewpoints = useCallback((viewpoints) => {
    dispatch({ type: actionTypes.SET_VIEWPOINTS, payload: viewpoints })
  }, [])

  const setActiveViewpoint = useCallback((viewpointId) => {
    dispatch({ type: actionTypes.SET_ACTIVE_VIEWPOINT, payload: viewpointId })
  }, [])

  const updateCamera = useCallback((cameraUpdate) => {
    dispatch({ type: actionTypes.UPDATE_CAMERA, payload: cameraUpdate })
  }, [])

  const setCameraAnimating = useCallback((isAnimating) => {
    dispatch({ type: actionTypes.SET_CAMERA_ANIMATING, payload: isAnimating })
  }, [])

  const updateLoading = useCallback((loadingUpdate) => {
    dispatch({ type: actionTypes.UPDATE_LOADING, payload: loadingUpdate })
  }, [])

  const setLoadingError = useCallback((error) => {
    dispatch({ type: actionTypes.SET_LOADING_ERROR, payload: error })
  }, [])

  const updateUI = useCallback((uiUpdate) => {
    dispatch({ type: actionTypes.UPDATE_UI, payload: uiUpdate })
  }, [])

  const updatePerformance = useCallback((perfUpdate) => {
    dispatch({ type: actionTypes.UPDATE_PERFORMANCE, payload: perfUpdate })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: actionTypes.RESET })
  }, [])

  const value = {
    state,
    actions: {
      setModel,
      setViewpoints,
      setActiveViewpoint,
      updateCamera,
      setCameraAnimating,
      updateLoading,
      setLoadingError,
      updateUI,
      updatePerformance,
      reset
    }
  }

  return (
    <ViewerContext.Provider value={value}>
      {children}
    </ViewerContext.Provider>
  )
}

/**
 * Hook to access viewer context
 * @returns {Object} Context value
 * @throws {Error} If used outside ViewerProvider
 */
export function useViewer() {
  const context = useContext(ViewerContext)
  if (!context) {
    throw new Error('useViewer must be used within ViewerProvider')
  }
  return context
}

export default ViewerContext
