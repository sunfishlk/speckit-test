/**
 * @fileoverview Loading indicator component with progress display
 */

import { useEffect, useState } from 'react'

/**
 * Loading Indicator Component
 * Displays loading progress with animated spinner and percentage
 * @param {Object} props - Component props
 * @param {number} props.progress - Loading progress (0-100)
 * @param {string} [props.message] - Optional loading message
 * @param {boolean} [props.show=true] - Whether to show the indicator
 * @returns {JSX.Element|null}
 */
function LoadingIndicator({ progress = 0, message, show = true }) {
  const [displayProgress, setDisplayProgress] = useState(0)

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      const diff = progress - displayProgress
      if (Math.abs(diff) > 0.1) {
        setDisplayProgress(displayProgress + diff * 0.1)
      } else {
        setDisplayProgress(progress)
      }
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [progress, displayProgress])

  if (!show) {
    return null
  }

  const percentage = Math.round(displayProgress)
  const circumference = 2 * Math.PI * 45

  return (
    <div className="loading-container" style={styles.container} role="status" aria-live="polite">
      <div style={styles.content}>
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          style={styles.svg}
          aria-hidden="true"
        >
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#007bff"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - displayProgress / 100)}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '60px 60px',
              transition: 'stroke-dashoffset 0.3s ease'
            }}
          />
          <text
            x="60"
            y="60"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              fill: '#333'
            }}
          >
            {percentage}%
          </text>
        </svg>
        {message && (
          <p style={styles.message}>
            {message}
          </p>
        )}
        <span className="visually-hidden">
          Loading {percentage}% complete
        </span>
      </div>
    </div>
  )
}

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    zIndex: 1000
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  },
  svg: {
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
  },
  message: {
    margin: 0,
    fontSize: '1rem',
    color: '#666',
    textAlign: 'center',
    maxWidth: '300px'
  }
}

export default LoadingIndicator
