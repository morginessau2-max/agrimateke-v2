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

export default function ProfileSetupPage() {
  const { user, profile, updateProfile } = useAuth()
  const [step, setStep]       = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [form, setForm]       = useState({
    full_name: profile?.full_name || '',
    farm_name: '',
    county:    '',
    phone:     profile?.phone    || '',
    acres:     '',
    crops:     [],
    livestock: [],
  })

  const cropOptions     = ['Maize','Beans','Tomatoes','Kales','Cabbage','Tea','Coffee','Potatoes','Onions','Capsicum','Avocado','Other']
  const livestockOptions = ['Dairy Cattle','Beef Cattle','Layers','Broilers','Goats','Sheep','Pigs','Other']

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid #E0E0E0', borderRadius: '8px',
    fontSize: '14px', fontFamily: 'Outfit, sans-serif',
    outline: 'none', boxSizing: 'border-box',
    background: 'white'
  }

  function toggleItem(key, item) {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(item)
        ? f[key].filter(i => i !== item)
        : [...f[key], item]
    }))
  }

  function validateStep1() {
    if (!form.full_name.trim()) return 'Your name is required'
    if (!form.county)           return 'Please select your county'
    return null
  }

  async function handleFinish() {
    setLoading(true)
    setError('')
    try {
      await updateProfile({
        full_name: form.full_name.trim(),
        farm_name: form.farm_name.trim() || null,
        county:    form.county,
        phone:     form.phone.trim()     || null,
      })
    } catch (err) {
      setError(err.message || 'Failed to save profile. Please try again.')
      setLoading(false)
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
        padding: '36px', width: '100%', maxWidth: '480px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '40px', marginBottom: '6px' }}>🌱</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#1B5E20', fontFamily: 'Cambria, serif' }}>
            Welcome to AgriMateKE!
          </div>
          <div style={{ fontSize: '13px', color: '#9E9E9E', marginTop: '4px' }}>
            Let's set up your farm profile — takes 1 minute
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '28px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              flex: 1, height: '4px', borderRadius: '99px',
              background: s <= step ? '#2E7D32' : '#E0E0E0',
              transition: 'background 0.3s'
            }} />
          ))}
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

        {/* ── STEP 1 — Basic Info ── */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: '17px', fontWeight: '700', color: '#212121', marginBottom: '4px' }}>
              👤 About You
            </div>
            <div style={{ fontSize: '13px', color: '#9E9E9E', marginBottom: '20px' }}>
              Step 1 of 3 — Your basic details
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161', display: 'block', marginBottom: '6px' }}>
                  Your Full Name *
                </label>
                <input
                  value={form.full_name}
                  onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                  placeholder="e.g. John Kamau"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161', display: 'block', marginBottom: '6px' }}>
                  County *
                </label>
                <select
                  value={form.county}
                  onChange={e => setForm(f => ({ ...f, county: e.target.value }))}
                  style={inputStyle}>
                  <option value="">Select your county...</option>
                  {counties.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161', display: 'block', marginBottom: '6px' }}>
                  Phone Number
                </label>
                <input
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="e.g. 0712 345 678"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161', display: 'block', marginBottom: '6px' }}>
                  Farm Name
                </label>
                <input
                  value={form.farm_name}
                  onChange={e => setForm(f => ({ ...f, farm_name: e.target.value }))}
                  placeholder="e.g. Morgin Farms"
                  style={inputStyle}
                />
              </div>
            </div>

            <button
              onClick={() => {
                const err = validateStep1()
                if (err) return setError(err)
                setError('')
                setStep(2)
              }}
              style={{
                width: '100%', padding: '13px',
                background: '#2E7D32', color: 'white',
                border: 'none', borderRadius: '10px',
                fontSize: '15px', fontWeight: '700',
                cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                marginTop: '20px'
              }}>
              Next →
            </button>
          </div>
        )}

        {/* ── STEP 2 — What do you grow? ── */}
        {step === 2 && (
          <div>
            <div style={{ fontSize: '17px', fontWeight: '700', color: '#212121', marginBottom: '4px' }}>
              🌿 What do you grow?
            </div>
            <div style={{ fontSize: '13px', color: '#9E9E9E', marginBottom: '20px' }}>
              Step 2 of 3 — Select all that apply
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {cropOptions.map(crop => {
                const selected = form.crops.includes(crop)
                return (
                  <button
                    key={crop}
                    onClick={() => toggleItem('crops', crop)}
                    style={{
                      padding: '8px 14px', borderRadius: '99px',
                      fontSize: '13px', fontWeight: '600',
                      cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                      border: selected ? '2px solid #2E7D32' : '1.5px solid #E0E0E0',
                      background: selected ? '#E8F5E9' : 'white',
                      color: selected ? '#2E7D32' : '#616161',
                    }}>
                    {selected ? '✓ ' : ''}{crop}
                  </button>
                )
              })}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setStep(1); setError('') }}
                style={{
                  flex: 1, padding: '13px',
                  background: 'transparent', color: '#616161',
                  border: '1.5px solid #E0E0E0', borderRadius: '10px',
                  fontSize: '14px', fontWeight: '600',
                  cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
                }}>
                ← Back
              </button>
              <button
                onClick={() => { setError(''); setStep(3) }}
                style={{
                  flex: 2, padding: '13px',
                  background: '#2E7D32', color: 'white',
                  border: 'none', borderRadius: '10px',
                  fontSize: '14px', fontWeight: '700',
                  cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
                }}>
                Next →
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <span
                onClick={() => { setError(''); setStep(3) }}
                style={{ fontSize: '12px', color: '#9E9E9E', cursor: 'pointer' }}>
                Skip this step →
              </span>
            </div>
          </div>
        )}

        {/* ── STEP 3 — Livestock ── */}
        {step === 3 && (
          <div>
            <div style={{ fontSize: '17px', fontWeight: '700', color: '#212121', marginBottom: '4px' }}>
              🐄 Do you keep livestock?
            </div>
            <div style={{ fontSize: '13px', color: '#9E9E9E', marginBottom: '20px' }}>
              Step 3 of 3 — Select all that apply
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {livestockOptions.map(animal => {
                const selected = form.livestock.includes(animal)
                return (
                  <button
                    key={animal}
                    onClick={() => toggleItem('livestock', animal)}
                    style={{
                      padding: '8px 14px', borderRadius: '99px',
                      fontSize: '13px', fontWeight: '600',
                      cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                      border: selected ? '2px solid #2E7D32' : '1.5px solid #E0E0E0',
                      background: selected ? '#E8F5E9' : 'white',
                      color: selected ? '#2E7D32' : '#616161',
                    }}>
                    {selected ? '✓ ' : ''}{animal}
                  </button>
                )
              })}
            </div>

            {/* Summary */}
            <div style={{
              background: '#F9FBF9', borderRadius: '12px',
              padding: '14px 16px', marginBottom: '20px',
              border: '1px solid #E8F5E9'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Your Profile Summary
              </div>
              <div style={{ fontSize: '13px', color: '#424242', lineHeight: 1.8 }}>
                <div>👤 {form.full_name}</div>
                <div>📍 {form.county}</div>
                {form.farm_name && <div>🏡 {form.farm_name}</div>}
                {form.crops.length > 0 && <div>🌿 {form.crops.join(', ')}</div>}
                {form.livestock.length > 0 && <div>🐄 {form.livestock.join(', ')}</div>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setStep(2); setError('') }}
                style={{
                  flex: 1, padding: '13px',
                  background: 'transparent', color: '#616161',
                  border: '1.5px solid #E0E0E0', borderRadius: '10px',
                  fontSize: '14px', fontWeight: '600',
                  cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
                }}>
                ← Back
              </button>
              <button
                onClick={handleFinish}
                disabled={loading}
                style={{
                  flex: 2, padding: '13px',
                  background: loading ? '#A5D6A7' : '#2E7D32',
                  color: 'white', border: 'none',
                  borderRadius: '10px', fontSize: '14px',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'Outfit, sans-serif'
                }}>
                {loading ? '⏳ Saving...' : '🌱 Enter My Farm Dashboard'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}