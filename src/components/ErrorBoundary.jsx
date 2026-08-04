import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('AgriMateKE Error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: 'white', borderRadius: '16px',
          padding: '48px', textAlign: 'center',
          border: '1px solid #FFCDD2',
          margin: '16px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>😔</div>
          <div style={{
            fontSize: '18px', fontWeight: '700',
            color: '#C62828', marginBottom: '8px'
          }}>
            Something went wrong
          </div>
          <div style={{
            fontSize: '13px', color: '#9E9E9E',
            marginBottom: '24px', lineHeight: 1.6,
            maxWidth: '400px', margin: '0 auto 24px'
          }}>
            This module ran into a problem. Your data is safe.
            Try refreshing or navigating to another section.
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                padding: '10px 20px', background: '#2E7D32',
                color: 'white', border: 'none', borderRadius: '8px',
                fontSize: '14px', fontWeight: '600',
                cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
              }}>
              🔄 Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px', background: 'transparent',
                color: '#616161', border: '1px solid #E0E0E0',
                borderRadius: '8px', fontSize: '14px',
                fontWeight: '600', cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif'
              }}>
              Refresh Page
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{
              marginTop: '24px', textAlign: 'left',
              background: '#F5F5F5', borderRadius: '8px',
              padding: '12px', fontSize: '11px',
              color: '#616161', fontFamily: 'monospace'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: '700', marginBottom: '8px' }}>
                🐛 Developer Details
              </summary>
              {this.state.error.toString()}
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}