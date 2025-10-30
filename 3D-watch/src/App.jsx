/**
 * @fileoverview Main App component
 * Entry point for the 3D House Viewer application
 */

import { ViewerProvider } from './context/ViewerContext'
import ErrorBoundary from './components/ErrorBoundary'

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
          <h1 style={styles.heading}>3D House Viewer</h1>
          <p style={styles.message}>
            Application structure is ready. 3D viewer will be implemented in Phase 3.
          </p>
          <div style={styles.info}>
            <h2 style={styles.subheading}>✅ Completed:</h2>
            <ul style={styles.list}>
              <li>Phase 1: Project setup and configuration</li>
              <li>Phase 2: Foundational infrastructure</li>
            </ul>
            <h2 style={styles.subheading}>🔄 Next Steps:</h2>
            <ul style={styles.list}>
              <li>Run <code style={styles.code}>npm install</code> to install dependencies</li>
              <li>Implement Phase 3: User Story 1 (Basic 3D Viewing)</li>
            </ul>
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    backgroundColor: '#f5f5f5'
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    color: '#333'
  },
  message: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    color: '#666'
  },
  info: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    maxWidth: '600px'
  },
  subheading: {
    fontSize: '1.3rem',
    marginTop: '1rem',
    marginBottom: '0.5rem',
    color: '#444'
  },
  list: {
    listStylePosition: 'inside',
    lineHeight: '1.8',
    color: '#555'
  },
  code: {
    backgroundColor: '#f0f0f0',
    padding: '0.2rem 0.4rem',
    borderRadius: '3px',
    fontFamily: 'monospace',
    fontSize: '0.9rem'
  }
}

export default App
