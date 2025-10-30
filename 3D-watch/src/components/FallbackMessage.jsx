/**
 * @fileoverview Fallback UI for browsers without WebGL support
 */

/**
 * FallbackMessage Component
 * Displays when WebGL is not available
 * @param {Object} props
 * @param {string} [props.message] - Custom error message
 * @returns {JSX.Element}
 */
function FallbackMessage({ message }) {
  const defaultMessage = message || 'WebGL is not supported in your browser'

  return (
    <div style={styles.container} role="alert" aria-live="assertive">
      <div style={styles.content}>
        <div style={styles.icon}>⚠️</div>
        <h2 style={styles.title}>3D Viewing Not Available</h2>
        <p style={styles.message}>{defaultMessage}</p>
        
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Recommended Browsers</h3>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong>Chrome</strong> (version 90+)
            </li>
            <li style={styles.listItem}>
              <strong>Firefox</strong> (version 88+)
            </li>
            <li style={styles.listItem}>
              <strong>Safari</strong> (version 14+)
            </li>
            <li style={styles.listItem}>
              <strong>Edge</strong> (version 90+)
            </li>
          </ul>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Troubleshooting</h3>
          <ul style={styles.list}>
            <li style={styles.listItem}>Update your browser to the latest version</li>
            <li style={styles.listItem}>Enable hardware acceleration in browser settings</li>
            <li style={styles.listItem}>Update your graphics drivers</li>
            <li style={styles.listItem}>Try a different browser</li>
          </ul>
        </div>

        <div style={styles.helpText}>
          <p>For more information, visit:</p>
          <a 
            href="https://get.webgl.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={styles.link}
          >
            get.webgl.org
          </a>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  content: {
    maxWidth: '600px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  },
  icon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '16px',
    marginTop: 0
  },
  message: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '32px',
    lineHeight: '1.6'
  },
  section: {
    textAlign: 'left',
    marginBottom: '24px',
    paddingBottom: '24px',
    borderBottom: '1px solid #e0e0e0'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '12px',
    marginTop: 0
  },
  list: {
    margin: 0,
    paddingLeft: '20px'
  },
  listItem: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
    lineHeight: '1.6'
  },
  helpText: {
    fontSize: '14px',
    color: '#999',
    marginTop: '24px'
  },
  link: {
    color: '#2196F3',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '16px'
  }
}

export default FallbackMessage
