/**
 * @fileoverview React Error Boundary component for graceful error handling
 */

import { Component } from 'react'
import { ERROR_MESSAGES } from '../utils/constants'

/**
 * Error Boundary component
 * Catches rendering errors and displays fallback UI
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  /**
   * @param {Error} error - Error object
   * @returns {Object} Updated state
   */
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    }
  }

  /**
   * @param {Error} error - Error object
   * @param {Object} errorInfo - Error information
   * @returns {void}
   */
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  /**
   * Handle retry button click
   * @returns {void}
   */
  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })

    if (this.props.onRetry) {
      this.props.onRetry()
    }
  }

  /**
   * @returns {JSX.Element}
   */
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          onRetry: this.handleRetry
        })
      }

      return (
        <div className="error-container" style={styles.container}>
          <div style={styles.content}>
            <h1 style={styles.title}>Oops! Something went wrong</h1>
            <p style={styles.message}>
              {this.state.error?.message || ERROR_MESSAGES.UNKNOWN_ERROR}
            </p>
            <div style={styles.actions}>
              <button 
                onClick={this.handleRetry}
                style={styles.button}
                aria-label="Retry loading"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{...styles.button, ...styles.secondaryButton}}
                aria-label="Reload page"
              >
                Reload Page
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details style={styles.details}>
                <summary style={styles.summary}>Error Details</summary>
                <pre style={styles.pre}>
                  {this.state.error?.stack}
                  {'\n\n'}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
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
    backgroundColor: '#f5f5f5',
    zIndex: 9999
  },
  content: {
    maxWidth: '600px',
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#333'
  },
  message: {
    fontSize: '1rem',
    marginBottom: '2rem',
    color: '#666',
    lineHeight: '1.5'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '500',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    transition: 'background-color 0.2s'
  },
  secondaryButton: {
    backgroundColor: '#6c757d'
  },
  details: {
    marginTop: '2rem',
    textAlign: 'left',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    maxHeight: '300px',
    overflow: 'auto'
  },
  summary: {
    cursor: 'pointer',
    fontWeight: '500',
    marginBottom: '0.5rem'
  },
  pre: {
    fontSize: '0.875rem',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    margin: 0
  }
}

export default ErrorBoundary
