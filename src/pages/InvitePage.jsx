import { useState, useEffect } from 'react'
import { acceptInvite } from '../hooks/useInvite'
import { useAuth } from '../context/AuthContext'

export default function InvitePage({ token, onDone, onLogin, onSignup }) {
  const { user } = useAuth()
  const [status,  setStatus]  = useState('loading')
  const [message, setMessage] = useState('')
  const [coopName, setCoopName] = useState('')

  useEffect(() => {
    if (user) {
      handleAccept()
    } else {
      setStatus('auth_required')
    }
  }, [user])

  async function handleAccept() {
    setStatus('loading')
    const result = await acceptInvite(token, user.id)
    if (result.error) {
      setStatus('error')
      setMessage(result.error)
    } else {
      setStatus('success')
      setCoopName(result.cooperativeName)
    }
  }

  // Loading
  if (status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '24px'
      }}>
        <div style={{
          background: 'white', borderRadius: '20px',
          padding: '48px 40px', textAlign: 'center',
          width: '100%', maxWidth: '420px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤝</div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#1B5E20' }}>
            Processing invite...
          </div>
        </div>
      </div>
    )
  }

  // Need to login/signup first
  if (status === 'auth_required') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '24px'
      }}>
        <div style={{
          background: 'white', borderRadius: '20px',
          padding: '40px', width: '100%', maxWidth: '440px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🤝</div>
          <div style={{
            fontSize: '22px', fontWeight: '800',
            color: '#1B5E20', marginBottom: '10px',
            fontFamily: 'Cambria, serif'
          }}>
            You've been invited!
          </div>
          <div style={{
            fontSize: '14px', color: '#616161',
            lineHeight: 1.7, marginBottom: '28px'
          }}>
            Your cooperative head has invited you to join their cooperative on AgriMateKE.
            Sign up or log in to accept the invitation.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => {
                onSignup()
              }}
              style={{
                width: '100%', padding: '13px',
                background: '#2E7D32', color: 'white',
                border: 'none', borderRadius: '10px',
                fontSize: '15px', fontWeight: '700',
                cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
              }}>
              🌱 Create Account & Join
            </button>
            <button
              onClick={() => {
                onLogin()
              }}
              style={{
                width: '100%', padding: '13px',
                background: 'transparent', color: '#2E7D32',
                border: '1.5px solid #2E7D32', borderRadius: '10px',
                fontSize: '15px', fontWeight: '700',
                cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
              }}>
              Sign In & Join
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Error
  if (status === 'error') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '24px'
      }}>
        <div style={{
          background: 'white', borderRadius: '20px',
          padding: '40px', width: '100%', maxWidth: '420px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>😔</div>
          <div style={{
            fontSize: '20px', fontWeight: '800',
            color: '#C62828', marginBottom: '10px',
            fontFamily: 'Cambria, serif'
          }}>
            Invite Error
          </div>
          <div style={{
            fontSize: '14px', color: '#616161',
            lineHeight: 1.7, marginBottom: '24px'
          }}>
            {message}
          </div>
          <button
            onClick={onDone}
            style={{
              width: '100%', padding: '13px',
              background: '#2E7D32', color: 'white',
              border: 'none', borderRadius: '10px',
              fontSize: '15px', fontWeight: '700',
              cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
            }}>
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Success
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '24px'
    }}>
      <div style={{
        background: 'white', borderRadius: '20px',
        padding: '40px', width: '100%', maxWidth: '420px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
        <div style={{
          fontSize: '22px', fontWeight: '800',
          color: '#1B5E20', marginBottom: '10px',
          fontFamily: 'Cambria, serif'
        }}>
          Welcome to the cooperative!
        </div>
        <div style={{
          fontSize: '14px', color: '#616161',
          lineHeight: 1.7, marginBottom: '24px'
        }}>
          You have successfully joined <strong>{coopName}</strong>.
          Your farm data is now linked to your cooperative head's dashboard.
        </div>
        <button
          onClick={onDone}
          style={{
            width: '100%', padding: '13px',
            background: '#2E7D32', color: 'white',
            border: 'none', borderRadius: '10px',
            fontSize: '15px', fontWeight: '700',
            cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
          }}>
          🌱 Go to My Dashboard
        </button>
      </div>
    </div>
  )
}