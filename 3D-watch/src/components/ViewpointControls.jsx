/**
 * @fileoverview Viewpoint selection UI component
 */

import { useState } from 'react'
import { useViewer } from '../context/ViewerContext'
import { VIEWPOINTS } from '../config/viewpoints'

/**
 * ViewpointControls Component
 * Renders UI for selecting preset viewpoints
 * @param {Object} props
 * @param {Function} props.onViewpointSelect - Callback when viewpoint is selected
 * @param {boolean} [props.disabled=false] - Whether controls are disabled
 * @returns {JSX.Element}
 */
function ViewpointControls({ onViewpointSelect, disabled = false }) {
  const { state } = useViewer()
  const [hoveredViewpoint, setHoveredViewpoint] = useState(null)

  const handleViewpointClick = (viewpoint) => {
    if (disabled || state.camera.isAnimating) {
      return
    }
    onViewpointSelect(viewpoint)
  }

  const isActive = (viewpointId) => {
    return state.activeViewpoint === viewpointId
  }

  const groupedViewpoints = VIEWPOINTS.reduce((acc, vp) => {
    if (!acc[vp.category]) {
      acc[vp.category] = []
    }
    acc[vp.category].push(vp)
    return acc
  }, {})

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Viewpoints</h3>
      
      {Object.entries(groupedViewpoints).map(([category, viewpoints]) => (
        <div key={category} style={styles.category}>
          <h4 style={styles.categoryTitle}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </h4>
          <div style={styles.buttonGrid}>
            {viewpoints.map(viewpoint => (
              <button
                key={viewpoint.id}
                onClick={() => handleViewpointClick(viewpoint)}
                onMouseEnter={() => setHoveredViewpoint(viewpoint.id)}
                onMouseLeave={() => setHoveredViewpoint(null)}
                disabled={disabled || state.camera.isAnimating}
                style={{
                  ...styles.button,
                  ...(isActive(viewpoint.id) ? styles.buttonActive : {}),
                  ...(hoveredViewpoint === viewpoint.id && !isActive(viewpoint.id) ? styles.buttonHover : {}),
                  ...(disabled || state.camera.isAnimating ? styles.buttonDisabled : {})
                }}
                aria-label={`View ${viewpoint.name}`}
                title={viewpoint.description}
              >
                <span style={styles.buttonIcon}>{getIcon(viewpoint.icon)}</span>
                <span style={styles.buttonText}>{viewpoint.name}</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {hoveredViewpoint && (
        <div style={styles.tooltip}>
          {VIEWPOINTS.find(vp => vp.id === hoveredViewpoint)?.description}
        </div>
      )}
    </div>
  )
}

/**
 * Get icon emoji for viewpoint
 * @param {string} iconName - Icon name
 * @returns {string} Icon emoji
 */
function getIcon(iconName) {
  const icons = {
    door: '🚪',
    sofa: '🛋️',
    utensils: '🍴',
    bed: '🛏️',
    tree: '🌳',
    eye: '👁️'
  }
  return icons[iconName] || '📍'
}

const styles = {
  container: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    padding: '20px',
    minWidth: '250px',
    maxWidth: '300px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    zIndex: 1000
  },
  title: {
    margin: '0 0 16px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#333'
  },
  category: {
    marginBottom: '16px'
  },
  categoryTitle: {
    margin: '0 0 8px 0',
    fontSize: '12px',
    fontWeight: '500',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  buttonGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    backgroundColor: '#fff',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    transition: 'all 0.2s ease',
    textAlign: 'left'
  },
  buttonHover: {
    backgroundColor: '#f5f5f5',
    borderColor: '#2196F3',
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 8px rgba(33, 150, 243, 0.2)'
  },
  buttonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)'
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  buttonIcon: {
    fontSize: '18px',
    flexShrink: 0
  },
  buttonText: {
    flex: 1
  },
  tooltip: {
    marginTop: '12px',
    padding: '8px 12px',
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: '6px',
    fontSize: '12px',
    lineHeight: '1.4'
  }
}

export default ViewpointControls
