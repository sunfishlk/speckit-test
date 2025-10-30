/**
 * @fileoverview Main App component
 * Entry point for the 3D House Viewer application
 */

import { ViewerProvider } from './context/ViewerContext'
import ErrorBoundary from './components/ErrorBoundary'
import Viewer3D from './components/Viewer3D'

/**
 * Main App Component
 * Sets up the application with context providers and error boundaries
 * @returns {JSX.Element}
 */
function App() {
  return (
    <ErrorBoundary>
      <ViewerProvider>
        <div style={styles.container}>
          <Viewer3D />
          <div style={styles.info}>
            <h1 style={styles.title}>3D House Viewer</h1>
            <p style={styles.subtitle}>MVP - User Story 1: Basic 3D Viewing</p>
          </div>
        </div>
      </ViewerProvider>
    </ErrorBoundary>
  )
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  info: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    zIndex: 10,
    maxWidth: '400px'
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    color: '#333'
  },
  subtitle: {
    margin: '0.5rem 0 0 0',
    fontSize: '0.9rem',
    color: '#666'
  }
}

export default App
