import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const counties = [
  'Baringo','Bomet','Bungoma','Busia','Elgeyo Marakwet','Embu','Garissa',
  'Homa Bay','Isiolo','Kajiado','Kakamega','Kericho','Kiambu','Kilifi',
  'Kirinyaga','Kisii','Kisumu','Kitui','Kwale','Laikipia','Lamu','Machakos',
  'Makueni','Mandera','Marsabit','Meru','Migori','Mombasa',"Murang'a",
  'Nairobi','Nakuru','Nandi','Narok','Nyamira','Nyandarua','Nyeri','Samburu',
  'Siaya','Taita Taveta','Tana River','Tharaka Nithi','Trans Nzoia','Turkana',
  'Uasin Gishu','Vihiga','Wajir','West Pokot'
]

export default function SignupPage({ onNavigateToLogin }) {
  const { signUp } = useAuth()
  const [step, setStep]       = useState(1) // 2-step signup
  const [form, setForm]       = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    phone: '', farmName: '', county: ''
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid #E0E0E0', borderRadius: '8px',
    fontSize: '14px', fontFamily: 'Outfit, sans-serif',
    outline: 'none', boxSizing: 'border-box'
  }

function validateStep1() {
  if (!form.fullName.trim())  return 'Full name is required'
  if (!form.email.trim())     return 'Email is required'
  if (!form.email.includes('@')) return 'Enter a valid email address'
  if (!form.password)         return 'Password is required'
  if (form.password.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(form.password)) return 'Password must contain at least one uppercase letter'
  if (!/[0-9]/.test(form.password)) return 'Password must contain at least one number'
  if (!/[^A-Za-z0-9]/.test(form.password)) return 'Password must contain at least one special character (!@#$%)'
  if (form.password !== form.confirmPassword) return 'Passwords do not match'
  return null
}

  async function handleSignup() {
    if (!form.county) return setError('Please select your county')

    setLoading(true)
    setError('')

    try {
      await signUp({
        email:    form.email,
        password: form.password,
        fullName: form.fullName,
        phone:    form.phone,
      })
      setSuccess(true)
    } catch (err) {
      if(err.message?.includes('already registered') || err.message?.includes('already exists')) {
        setError('An account with this email  already exists. Please sign in instead.')
      } else {
        setError(err.message || 'Signup failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Success screen
  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
      }}>
        <div style={{
          background: 'white', borderRadius: '20px', padding: '40px',
          width: '100%', maxWidth: '420px', textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#1B5E20', marginBottom: '10px' }}>
            Account Created!
          </div>
          <div style={{ fontSize: '14px', color: '#616161', lineHeight: 1.6, marginBottom: '24px' }}>
            We sent a confirmation email to <strong>{form.email}</strong>.
            Click the link in the email to verify your account then come back to sign in.
          </div>
          <button
            onClick={onNavigateToLogin}
            style={{
              width: '100%', padding: '13px',
              background: '#2E7D32', color: 'white',
              border: 'none', borderRadius: '10px',
              fontSize: '15px', fontWeight: '700',
              cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
            }}>
            Go to Login →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '40px',
        width: '100%', maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '40px', marginBottom: '6px' }}>🌱</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#1B5E20', fontFamily: 'Cambria, serif' }}>
            AgriMateKE
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[1, 2].map(s => (
            <div key={s} style={{
              flex: 1, height: '4px', borderRadius: '99px',
              background: s <= step ? '#2E7D32' : '#E0E0E0',
              transition: 'background 0.3s'
            }} />
          ))}
        </div>

        <div style={{ fontSize: '18px', fontWeight: '700', color: '#212121', marginBottom: '6px' }}>
          {step === 1 ? 'Create your account' : 'Tell us about your farm'}
        </div>
        <div style={{ fontSize: '13px', color: '#9E9E9E', marginBottom: '20px' }}>
          {step === 1 ? 'Step 1 of 2 — Account details' : 'Step 2 of 2 — Farm details'}
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

        {/* Step 1 */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161', display: 'block', marginBottom: '6px' }}>Full Name *</label>
              <input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="e.g. John Kamau" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161', display: 'block', marginBottom: '6px' }}>Email Address *</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="farmer@email.com" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161', display: 'block', marginBottom: '6px' }}>Password * (min 8 characters)</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" style={inputStyle} />
            </div>
        {form.password && (
  <div style={{ marginTop: '6px' }}>
    {/* Strength bar */}
    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
      {[1,2,3,4].map(level => {
        const strength =
          form.password.length === 0 ? 0 :
          form.password.length < 6   ? 1 :
          form.password.length < 8   ? 2 :
          (!/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)) ? 3 : 4

        return (
          <div key={level} style={{
            flex: 1, height: '4px', borderRadius: '99px',
            background: level <= strength
              ? strength === 1 ? '#EF5350'
              : strength === 2 ? '#FF9800'
              : strength === 3 ? '#FFC107'
              : '#2E7D32'
              : '#E0E0E0',
            transition: 'background 0.3s'
          }} />
        )
      })}
    </div>
    {/* Strength label */}
    <div style={{
      fontSize: '11px', fontWeight: '600',
      color:
        form.password.length < 6   ? '#EF5350' :
        form.password.length < 8   ? '#FF9800' :
        (!/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)) ? '#FFC107' :
        '#2E7D32'
    }}>
      {form.password.length === 0  ? '' :
       form.password.length < 6    ? 'Too weak' :
       form.password.length < 8    ? 'Weak — add more characters' :
       (!/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)) ? 'Fair — add uppercase and numbers' :
       !/[^A-Za-z0-9]/.test(form.password) ? 'Good — add a special character for strong' :
       '✅ Strong password'}
    </div>
    {/* Requirements checklist */}
    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
      {[
        { label: 'At least 8 characters',           pass: form.password.length >= 8 },
        { label: 'One uppercase letter (A-Z)',        pass: /[A-Z]/.test(form.password) },
        { label: 'One number (0-9)',                  pass: /[0-9]/.test(form.password) },
        { label: 'One special character (!@#$%)',     pass: /[^A-Za-z0-9]/.test(form.password) },
      ].map(req => (
        <div key={req.label} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '11px',
          color: req.pass ? '#2E7D32' : '#9E9E9E'
        }}>
          <span>{req.pass ? '✅' : '○'}</span>
          {req.label}
        </div>
      ))}
    </div>
  </div>
)}


            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161', display: 'block', marginBottom: '6px' }}>Confirm Password *</label>
              <input type="password" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} placeholder="••••••••" style={inputStyle} />
            </div>
            <button
              onClick={() => {
                const err = validateStep1()
                if (err) return setError(err)
                setError('')
                setStep(2)
              }}
              style={{
                width: '100%', padding: '13px', background: '#2E7D32',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif', marginTop: '6px'
              }}>
              Next →
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161', display: 'block', marginBottom: '6px' }}>Phone Number</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="e.g. 0712 345 678" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161', display: 'block', marginBottom: '6px' }}>Farm Name</label>
              <input value={form.farmName} onChange={e => setForm(f => ({ ...f, farmName: e.target.value }))} placeholder="e.g. Morgin Farms" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161', display: 'block', marginBottom: '6px' }}>County *</label>
              <select value={form.county} onChange={e => setForm(f => ({ ...f, county: e.target.value }))} style={inputStyle}>
                <option value="">Select your county...</option>
                {counties.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                onClick={() => { setStep(1); setError('') }}
                style={{
                  flex: 1, padding: '13px', background: 'transparent',
                  color: '#616161', border: '1.5px solid #E0E0E0',
                  borderRadius: '10px', fontSize: '14px', fontWeight: '600',
                  cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
                }}>
                ← Back
              </button>
              <button
                onClick={handleSignup}
                disabled={loading}
                style={{
                  flex: 2, padding: '13px',
                  background: loading ? '#A5D6A7' : '#2E7D32',
                  color: 'white', border: 'none', borderRadius: '10px',
                  fontSize: '14px', fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'Outfit, sans-serif'
                }}>
                {loading ? '⏳ Creating account...' : '🌱 Create Account'}
              </button>
            </div>
          </div>
        )}

        {/* Login link */}
        <div style={{ textAlign: 'center', fontSize: '13px', color: '#9E9E9E', marginTop: '20px' }}>
          Already have an account?{' '}
          <span onClick={onNavigateToLogin} style={{ color: '#2E7D32', fontWeight: '700', cursor: 'pointer' }}>
            Sign in
          </span>
        </div>

      </div>
    </div>
  )
}