export default function NotFoundPage({ onGoHome }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '24px',
      fontFamily: 'Outfit, sans-serif'
    }}>
      <div style={{
        background: 'white', borderRadius: '20px',
        padding: '48px 40px', width: '100%',
        maxWidth: '480px', textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>

        {/* Illustration */}
        <div style={{ fontSize: '72px', marginBottom: '8px' }}>🌾</div>
        <div style={{
          fontSize: '64px', fontWeight: '900',
          color: '#E8F5E9', marginBottom: '8px',
          fontFamily: 'Cambria, serif',
          lineHeight: 1
        }}>
          404
        </div>

        <div style={{
          fontSize: '22px', fontWeight: '800',
          color: '#1B5E20', marginBottom: '10px',
          fontFamily: 'Cambria, serif'
        }}>
          Lost in the shamba?
        </div>

        <div style={{
          fontSize: '14px', color: '#9E9E9E',
          lineHeight: 1.7, marginBottom: '32px',
          maxWidth: '320px', margin: '0 auto 32px'
        }}>
          The page you are looking for does not exist or has been moved.
          Let's get you back to your farm dashboard.
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onGoHome}
            style={{
              padding: '12px 28px', background: '#2E7D32',
              color: 'white', border: 'none', borderRadius: '10px',
              fontSize: '15px', fontWeight: '700',
              cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
            }}>
            🌱 Go to Dashboard
          </button>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: '12px 20px', background: 'transparent',
              color: '#616161', border: '1px solid #E0E0E0',
              borderRadius: '10px', fontSize: '14px',
              fontWeight: '600', cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif'
            }}>
            ← Go Back
          </button>
        </div>

        <div style={{
          marginTop: '32px', fontSize: '12px',
          color: '#BDBDBD'
        }}>
          AgriMateKE · Smart Farming Companion 🌱
        </div>
      </div>
    </div>
  )
}