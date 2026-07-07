import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage({ onNavigateToSignup }) {
  const { signIn } = useAuth()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!form.email.trim()) return setError('Email is required')
    if (!form.password)     return setError('Password is required')

    setLoading(true)
    setError('')

    try {
      await signIn({ email: form.email, password: form.password })
      // Auth context will handle redirect automatically
    } catch (err) {
      setError(err.message || 'Login failed. Check your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        background: 'white', borderRadius: '20px',
        padding: '40px', width: '100%', maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🌱</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#1B5E20', fontFamily: 'Cambria, serif' }}>
            AgriMateKE
          </div>
          <div style={{ fontSize: '13px', color: '#9E9E9E', marginTop: '4px' }}>
            Your Smart Farming Companion
          </div>
        </div>

        <div style={{ fontSize: '18px', fontWeight: '700', color: '#212121', marginBottom: '20px' }}>
          Welcome back 👋
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#FFEBEE', border: '1px solid #FFCDD2',
            borderRadius: '8px', padding: '10px 14px',
            fontSize: '13px', color: '#C62828', marginBottom: '16px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161', display: 'block', marginBottom: '6px' }}>
            Email Address
          </label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="farmer@email.com"
            style={{
              width: '100%', padding: '11px 14px',
              border: '1.5px solid #E0E0E0', borderRadius: '8px',
              fontSize: '14px', fontFamily: 'Outfit, sans-serif',
              outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161', display: 'block', marginBottom: '6px' }}>
            Password
          </label>
          <input
            type="password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="••••••••"
            style={{
              width: '100%', padding: '11px 14px',
              border: '1.5px solid #E0E0E0', borderRadius: '8px',
              fontSize: '14px', fontFamily: 'Outfit, sans-serif',
              outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%', padding: '13px',
            background: loading ? '#A5D6A7' : '#2E7D32',
            color: 'white', border: 'none', borderRadius: '10px',
            fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Outfit, sans-serif', marginBottom: '16px'
          }}>
          {loading ? '⏳ Signing in...' : '🌱 Sign In'}
        </button>

        {/* Divider */}
        <div style={{ textAlign: 'center', fontSize: '13px', color: '#9E9E9E', marginBottom: '16px' }}>
          Don't have an account?{' '}
          <span
            onClick={onNavigateToSignup}
            style={{ color: '#2E7D32', fontWeight: '700', cursor: 'pointer' }}>
            Sign up free
          </span>
        </div>

      </div>
    </div>
  )
}