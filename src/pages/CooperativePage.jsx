import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function CooperativePage({ onNavigate }) {
  const { user, profile } = useAuth()
  const [view, setView]               = useState('loading')
  const [cooperative, setCooperative] = useState(null)
  const [members, setMembers]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [creating, setCreating]       = useState(false)
  const [form, setForm]               = useState({ name: '', county: '' })
  const [inviteLink, setInviteLink]   = useState('')
  const [generating, setGenerating]   = useState(false)
  const [selectedFarmer, setSelectedFarmer] = useState(null)

  const counties = [
    'Baringo','Bomet','Bungoma','Busia','Elgeyo Marakwet','Embu','Garissa',
    'Homa Bay','Isiolo','Kajiado','Kakamega','Kericho','Kiambu','Kilifi',
    'Kirinyaga','Kisii','Kisumu','Kitui','Kwale','Laikipia','Lamu','Machakos',
    'Makueni','Mandera','Marsabit','Meru','Migori','Mombasa',"Murang'a",
    'Nairobi','Nakuru','Nandi','Narok','Nyamira','Nyandarua','Nyeri','Samburu',
    'Siaya','Taita Taveta','Tana River','Tharaka Nithi','Trans Nzoia','Turkana',
    'Uasin Gishu','Vihiga','Wajir','West Pokot'
  ]

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid #E0E0E0', borderRadius: '8px',
    fontSize: '14px', fontFamily: 'Outfit, sans-serif',
    outline: 'none', boxSizing: 'border-box'
  }

  useEffect(() => { checkCooperative() }, [user])

  async function checkCooperative() {
    try {
      // Check if user heads a cooperative
      const { data: coop } = await supabase
        .from('cooperatives')
        .select('*')
        .eq('head_id', user.id)
        .maybeSingle()

      if (coop) {
        setCooperative(coop)
        await fetchMembers(coop.id)
        setView('dashboard')
      } else {
        // Check if user is a member
        const { data: memberProfile } = await supabase
          .from('profiles')
          .select('cooperative_id')
          .eq('id', user.id)
          .single()

        if (memberProfile?.cooperative_id) {
          const { data: memberCoop } = await supabase
            .from('cooperatives')
            .select('*')
            .eq('id', memberProfile.cooperative_id)
            .single()
          setCooperative(memberCoop)
          setView('member')
        } else {
          setView('none')
        }
      }
    } catch (err) {
      console.error('Error checking cooperative:', err)
      setView('none')
    } finally {
      setLoading(false)
    }
  }

  async function fetchMembers(coopId) {
  try {
    // First get all profiles in this cooperative
    const { data: memberProfiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, farm_name, county, phone, created_at')
      .eq('cooperative_id', coopId)

    if (profileError) throw profileError
    if (!memberProfiles || memberProfiles.length === 0) {
      setMembers([])
      return
    }

    const memberIds = memberProfiles.map(m => m.id)

    // Fetch all related data in parallel
    const [cropsRes, tasksRes, salesRes, expensesRes] = await Promise.all([
      supabase.from('crops').select('id, user_id, stage').in('user_id', memberIds),
      supabase.from('tasks').select('id, user_id, done').in('user_id', memberIds),
      supabase.from('sales').select('id, user_id, total').in('user_id', memberIds),
      supabase.from('expenses').select('id, user_id, amount').in('user_id', memberIds),
    ])

    // Merge data per farmer
    const enriched = memberProfiles.map(farmer => ({
      ...farmer,
      crops:    (cropsRes.data    || []).filter(c => c.user_id === farmer.id),
      tasks:    (tasksRes.data    || []).filter(t => t.user_id === farmer.id),
      sales:    (salesRes.data    || []).filter(s => s.user_id === farmer.id),
      expenses: (expensesRes.data || []).filter(e => e.user_id === farmer.id),
    }))

    setMembers(enriched)
  } catch (err) {
    console.error('Error fetching members:', err)
  }
}

  async function handleCreateCoop() {
    if (!form.name.trim()) return alert('Cooperative name is required')
    if (!form.county)      return alert('County is required')
    setCreating(true)
    try {
      const { data, error } = await supabase
        .from('cooperatives')
        .insert({
          name:    form.name.trim(),
          county:  form.county,
          head_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      setCooperative(data)
      setMembers([])
      setView('dashboard')
    } catch (err) {
      alert('Failed to create cooperative: ' + err.message)
    } finally {
      setCreating(false)
    }
  }

  async function generateInvite() {
    setGenerating(true)
    try {
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

      const { error } = await supabase
        .from('cooperative_invites')
        .insert({
          cooperative_id: cooperative.id,
          token,
          used:           false,
          expires_at:     expiresAt,
        })

      if (error) throw error
      const link = `${window.location.origin}?invite=${token}`
      setInviteLink(link)
    } catch (err) {
      alert('Failed to generate invite: ' + err.message)
    } finally {
      setGenerating(false)
    }
  }

  function copyInvite() {
    navigator.clipboard.writeText(inviteLink)
    alert('✅ Invite link copied to clipboard!')
  }

  // Helper calculations per farmer
  function getFarmerStats(farmer) {
    const activeCrops   = (farmer.crops || []).filter(c => c.stage !== 'harvested').length
    const pendingTasks  = (farmer.tasks || []).filter(t => !t.done).length
    const totalRevenue  = (farmer.sales || []).reduce((sum, s) => sum + (s.total || 0), 0)
    const totalExpenses = (farmer.expenses || []).reduce((sum, e) => sum + (e.amount || 0), 0)
    const netProfit     = totalRevenue - totalExpenses
    return { activeCrops, pendingTasks, totalRevenue, totalExpenses, netProfit }
  }

  function fmt(n) {
    return 'KSh ' + Math.abs(n).toLocaleString()
  }

  // ── LOADING ────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '64px' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔄</div>
        <div style={{ fontSize: '14px', color: '#9E9E9E' }}>Loading cooperative...</div>
      </div>
    )
  }

  // ── NO COOPERATIVE ─────────────────────────────────────
  if (view === 'none') {
    return (
      <div>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px', color: '#212121' }}>
            Cooperative Dashboard
          </h2>
          <p style={{ fontSize: '13px', color: '#9e9e9e', marginTop: '3px' }}>
            Manage your farming cooperative
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          {/* Create Cooperative */}
          <div style={{
            background: 'white', borderRadius: '16px',
            padding: '28px', border: '1.5px solid #A5D6A7',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>🤝</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1B5E20', marginBottom: '8px', fontFamily: 'Cambria, serif' }}>
              Start a Cooperative
            </div>
            <div style={{ fontSize: '13px', color: '#9E9E9E', marginBottom: '20px', lineHeight: 1.6 }}>
              Create a cooperative and invite up to 19 farmers.
              Monitor all members from one dashboard.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161', display: 'block', marginBottom: '6px' }}>
                  Cooperative Name *
                </label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Nakuru Farmers SACCO"
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
                  <option value="">Select county...</option>
                  {counties.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button
              onClick={handleCreateCoop}
              disabled={creating}
              style={{
                width: '100%', padding: '12px',
                background: creating ? '#A5D6A7' : '#2E7D32',
                color: 'white', border: 'none', borderRadius: '8px',
                fontSize: '14px', fontWeight: '700',
                cursor: creating ? 'not-allowed' : 'pointer',
                fontFamily: 'Outfit, sans-serif'
              }}>
              {creating ? '⏳ Creating...' : '🤝 Create Cooperative'}
            </button>
          </div>

          {/* Join via invite */}
          <div style={{
            background: '#F9FBF9', borderRadius: '16px',
            padding: '28px', border: '1px solid #E0E0E0'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>📨</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#212121', marginBottom: '8px', fontFamily: 'Cambria, serif' }}>
              Join a Cooperative
            </div>
            <div style={{ fontSize: '13px', color: '#9E9E9E', marginBottom: '20px', lineHeight: 1.6 }}>
              Have an invite link from your cooperative head?
              Ask them to share it with you and click to join.
            </div>
            <div style={{
              background: '#E8F5E9', borderRadius: '10px',
              padding: '14px', fontSize: '13px',
              color: '#2E7D32', lineHeight: 1.6
            }}>
              💡 Your cooperative head will generate an invite link and share it with you via WhatsApp or SMS.
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── MEMBER VIEW ────────────────────────────────────────
  if (view === 'member') {
    return (
      <div>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px', color: '#212121' }}>
            My Cooperative
          </h2>
          <p style={{ fontSize: '13px', color: '#9e9e9e', marginTop: '3px' }}>
            You are a member of {cooperative?.name}
          </p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #1b5e20, #2e7d32)',
          borderRadius: '16px', padding: '28px', color: 'white',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🤝</div>
          <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px', fontFamily: 'Cambria, serif' }}>
            {cooperative?.name}
          </div>
          <div style={{ fontSize: '13px', opacity: 0.8 }}>📍 {cooperative?.county}</div>
          <div style={{ fontSize: '13px', opacity: 0.7, marginTop: '8px' }}>
            You are a verified member of this cooperative.
            Your farm data contributes to the cooperative's aggregate reports.
          </div>
        </div>
      </div>
    )
  }

  // ── HEAD DASHBOARD ─────────────────────────────────────
  // Aggregate stats
  const totalRevenue  = members.reduce((sum, m) => sum + getFarmerStats(m).totalRevenue, 0)
  const totalExpenses = members.reduce((sum, m) => sum + getFarmerStats(m).totalExpenses, 0)
  const totalCrops    = members.reduce((sum, m) => sum + getFarmerStats(m).activeCrops, 0)
  const totalTasks    = members.reduce((sum, m) => sum + getFarmerStats(m).pendingTasks, 0)
  const netProfit     = totalRevenue - totalExpenses

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px', color: '#212121' }}>
            🤝 {cooperative?.name}
          </h2>
          <p style={{ fontSize: '13px', color: '#9e9e9e', marginTop: '3px' }}>
            📍 {cooperative?.county} · {members.length} / 19 members
          </p>
        </div>
        <button
          onClick={generateInvite}
          disabled={generating || members.length >= 19}
          style={{
            padding: '10px 18px',
            background: members.length >= 19 ? '#e0e0e0' : '#2e7d32',
            color: 'white', border: 'none', borderRadius: '8px',
            fontSize: '14px', fontWeight: '600',
            cursor: members.length >= 19 ? 'not-allowed' : 'pointer',
            fontFamily: 'Outfit, sans-serif'
          }}>
          {generating ? '⏳ Generating...' : members.length >= 19 ? '🔒 Full (19/19)' : '📨 Invite Farmer'}
        </button>
      </div>

      {/* Invite Link */}
      {inviteLink && (
        <div style={{
          background: '#E8F5E9', border: '1.5px solid #A5D6A7',
          borderRadius: '12px', padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#1B5E20', marginBottom: '8px' }}>
            📨 Share this invite link with your farmer:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{
              flex: 1, background: 'white', borderRadius: '8px',
              padding: '10px 14px', fontSize: '12px',
              color: '#424242', fontFamily: 'monospace',
              border: '1px solid #C8E6C9', wordBreak: 'break-all'
            }}>
              {inviteLink}
            </div>
            <button
              onClick={copyInvite}
              style={{
                padding: '10px 16px', background: '#2E7D32',
                color: 'white', border: 'none', borderRadius: '8px',
                fontSize: '13px', fontWeight: '600',
                cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                whiteSpace: 'nowrap'
              }}>
              📋 Copy
            </button>
          </div>
          <div style={{ fontSize: '11px', color: '#9E9E9E', marginTop: '8px' }}>
            Link expires in 7 days. Share via WhatsApp or SMS.
          </div>
        </div>
      )}

      {/* Aggregate Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px', marginBottom: '24px'
      }}>
        {[
          { icon: '👨‍🌾', label: 'Members',        value: members.length,    sub: 'of 19 slots used',     color: '#0277BD' },
          { icon: '💰', label: 'Total Revenue',   value: fmt(totalRevenue),  sub: 'across all farmers',   color: '#2E7D32' },
          { icon: '📈', label: 'Net Profit',       value: fmt(netProfit),     sub: netProfit >= 0 ? 'Profit' : 'Loss', color: netProfit >= 0 ? '#2E7D32' : '#EF5350' },
          { icon: '🌿', label: 'Active Crops',     value: totalCrops,         sub: 'across all farms',     color: '#2E7D32' },
          { icon: '✅', label: 'Pending Tasks',    value: totalTasks,         sub: 'across all farmers',   color: totalTasks > 10 ? '#EF5350' : '#2E7D32' },
        ].map(m => (
          <div key={m.label} style={{
            background: 'white', border: '1px solid #e0e0e0',
            borderRadius: '12px', padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>{m.icon}</div>
            <div style={{ fontSize: '10px', color: '#9e9e9e', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>{m.label}</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: m.color, marginTop: '4px' }}>{m.value}</div>
            <div style={{ fontSize: '10px', color: '#9e9e9e', marginTop: '2px' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Members Table */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #eeeeee', overflow: 'hidden', marginBottom: '20px' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #eeeeee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: '600', color: '#212121' }}>
            Member Farmers ({members.length})
          </div>
        </div>

        {members.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9e9e9e' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>👨‍🌾</div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#424242', marginBottom: '6px' }}>
              No members yet
            </div>
            <div style={{ fontSize: '13px' }}>
              Generate an invite link above and share it with your farmers
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafafa' }}>
                  {['Farmer', 'County', 'Active Crops', 'Pending Tasks', 'Revenue', 'Net Profit', 'Status'].map(h => (
                    <th key={h} style={{
                      padding: '10px 14px', textAlign: 'left',
                      fontSize: '11px', fontWeight: '700',
                      color: '#9e9e9e', textTransform: 'uppercase',
                      letterSpacing: '0.05em', borderBottom: '1px solid #eeeeee',
                      whiteSpace: 'nowrap'
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map((farmer, i) => {
                  const stats = getFarmerStats(farmer)
                  const isStruggling = stats.netProfit < 0 || stats.pendingTasks > 5
                  return (
                    <tr
                      key={farmer.id}
                      onClick={() => setSelectedFarmer(selectedFarmer?.id === farmer.id ? null : farmer)}
                      style={{
                        background: isStruggling ? '#FFF8E1' : i % 2 === 0 ? 'white' : '#fafafa',
                        cursor: 'pointer',
                        transition: 'background 0.15s'
                      }}>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid #f5f5f5' }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#212121' }}>
                          {farmer.full_name || 'Unnamed Farmer'}
                        </div>
                        {farmer.farm_name && (
                          <div style={{ fontSize: '11px', color: '#9e9e9e' }}>{farmer.farm_name}</div>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', color: '#616161', borderBottom: '1px solid #f5f5f5' }}>
                        {farmer.county || '—'}
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '600', color: '#0277BD', borderBottom: '1px solid #f5f5f5' }}>
                        {stats.activeCrops}
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '600', color: stats.pendingTasks > 5 ? '#EF5350' : '#424242', borderBottom: '1px solid #f5f5f5' }}>
                        {stats.pendingTasks}
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '600', color: '#2E7D32', borderBottom: '1px solid #f5f5f5' }}>
                        {fmt(stats.totalRevenue)}
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: stats.netProfit >= 0 ? '#2E7D32' : '#EF5350', borderBottom: '1px solid #f5f5f5' }}>
                        {fmt(stats.netProfit)}
                      </td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid #f5f5f5' }}>
                        <span style={{
                          fontSize: '11px', fontWeight: '700',
                          padding: '3px 8px', borderRadius: '99px',
                          background: isStruggling ? '#FFF3E0' : '#E8F5E9',
                          color: isStruggling ? '#E65100' : '#2E7D32'
                        }}>
                          {isStruggling ? '⚠️ Needs Attention' : '✅ On Track'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Selected Farmer Detail */}
      {selectedFarmer && (() => {
        const stats = getFarmerStats(selectedFarmer)
        return (
          <div style={{
            background: 'white', borderRadius: '16px',
            padding: '20px', border: '1px solid #eeeeee',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#212121' }}>
                👨‍🌾 {selectedFarmer.full_name}
              </div>
              <button
                onClick={() => setSelectedFarmer(null)}
                style={{
                  background: '#f5f5f5', border: 'none',
                  borderRadius: '6px', padding: '4px 10px',
                  fontSize: '12px', cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif', color: '#616161'
                }}>
                Close ✕
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
              {[
                { label: 'Farm Name',    value: selectedFarmer.farm_name || '—' },
                { label: 'County',       value: selectedFarmer.county    || '—' },
                { label: 'Phone',        value: selectedFarmer.phone     || '—' },
                { label: 'Active Crops', value: stats.activeCrops },
                { label: 'Revenue',      value: fmt(stats.totalRevenue) },
                { label: 'Expenses',     value: fmt(stats.totalExpenses) },
                { label: 'Net Profit',   value: fmt(stats.netProfit) },
                { label: 'Pending Tasks', value: stats.pendingTasks },
              ].map(item => (
                <div key={item.label} style={{
                  background: '#f9fafb', borderRadius: '8px',
                  padding: '10px 12px'
                }}>
                  <div style={{ fontSize: '10px', color: '#9e9e9e', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '3px' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#212121' }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })()}
    </div>
  )
}