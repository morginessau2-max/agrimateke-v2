import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function VerifyEmailPage({ email, onSignOut }) {
  const { resendVerification } = useAuth()
  const [sending,  setSending]  = useState(false)
  const [sent,     setSent]     = useState(false)
  const [error,    setError]    = useState('')

  async function handleResend() {
    setSending(true)
    setError('')
    try {
      await resendVerification(email)
      setSent(true)
      setTimeout(() => setSent(false), 5000)
    } catch (err) {
      setError(err.message || 'Failed to resend. Try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '24px'
    }}>
      <div style={{
        background: 'white', borderRadius: '20px',
        padding: '40px', width: '100%', maxWidth: '440px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>

        {/* Icon */}
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>📧</div>

        {/* Title */}
        <div style={{
          fontSize: '22px', fontWeight: '800',
          color: '#1B5E20', marginBottom: '10px',
          fontFamily: 'Cambria, serif'
        }}>
          Verify your email
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: '14px', color: '#616161',
          lineHeight: 1.7, marginBottom: '24px'
        }}>
          We sent a confirmation link to{' '}
          <strong style={{ color: '#212121' }}>{email}</strong>.
          <br />
          Click the link in your email to activate your account.
        </div>

        {/* Success message */}
        {sent && (
          <div style={{
            background: '#E8F5E9', border: '1px solid #A5D6A7',
            borderRadius: '8px', padding: '10px 14px',
            fontSize: '13px', color: '#2E7D32',
            marginBottom: '16px'
          }}>
            ✅ Verification email resent successfully!
          </div>
        )}

        {/* Error message */}
        {error && (
          <div style={{
            background: '#FFEBEE', border: '1px solid #FFCDD2',
            borderRadius: '8px', padding: '10px 14px',
            fontSize: '13px', color: '#C62828',
            marginBottom: '16px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Steps */}
        <div style={{
          background: '#F9FBF9', borderRadius: '12px',
          padding: '16px', marginBottom: '24px',
          textAlign: 'left'
        }}>
          <div style={{
            fontSize: '12px', fontWeight: '700',
            color: '#9E9E9E', textTransform: 'uppercase',
            letterSpacing: '0.06em', marginBottom: '10px'
          }}>
            What to do
          </div>
          {[
            'Check your email inbox',
            'Look for an email from AgriMateKE',
            'Click the "Confirm your email" link',
            'Come back here and refresh the page',
          ].map((step, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center',
              gap: '10px', marginBottom: '8px'
            }}>
              <div style={{
                width: '22px', height: '22px',
                borderRadius: '50%', background: '#2E7D32',
                color: 'white', fontSize: '11px',
                fontWeight: '700', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                {i + 1}
              </div>
              <div style={{ fontSize: '13px', color: '#424242' }}>{step}</div>
            </div>
          ))}
        </div>

        {/* Resend Button */}
        <button
          onClick={handleResend}
          disabled={sending}
          style={{
            width: '100%', padding: '13px',
            background: sending ? '#A5D6A7' : '#2E7D32',
            color: 'white', border: 'none',
            borderRadius: '10px', fontSize: '15px',
            fontWeight: '700', cursor: sending ? 'not-allowed' : 'pointer',
            fontFamily: 'Outfit, sans-serif', marginBottom: '12px'
          }}>
          {sending ? '⏳ Sending...' : '📧 Resend Verification Email'}
        </button>

        {/* Sign out link */}
        <button
          onClick={onSignOut}
          style={{
            width: '100%', padding: '11px',
            background: 'transparent', color: '#9E9E9E',
            border: '1px solid #E0E0E0', borderRadius: '10px',
            fontSize: '14px', fontWeight: '500',
            cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
          }}>
          Sign out and use different account
        </button>

        <div style={{
          fontSize: '12px', color: '#BDBDBD',
          marginTop: '16px', lineHeight: 1.5
        }}>
          Check your spam folder if you don't see the email.
          The link expires after 24 hours.
        </div>

      </div>
    </div>
  )
}