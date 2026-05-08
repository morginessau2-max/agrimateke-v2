import { useState } from 'react'

function MetricCard({ icon, label, value, sub, color }) {
  return (
    <div style={{
      background: 'white', border: '1px solid #e0e0e0',
      borderRadius: '12px', padding: '16px 20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
    }}>
      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '11px', color: '#9e9e9e', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>{label}</div>
      <div style={{ fontSize: '24px', fontWeight: '700', color: color || '#212121', marginTop: '4px' }}>{value}</div>
      <div style={{ fontSize: '11px', color: '#9e9e9e', marginTop: '4px' }}>{sub}</div>
    </div>
  )
}

function Sidebar({ activePage, onNavigate }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'crops', label: 'My Crops', icon: '🌿' },
    { id: 'livestock', label: 'Livestock', icon: '🐄' },
    { id: 'sales', label: 'Sales & Expenses', icon: '💰' },
    { id: 'tasks', label: 'Tasks', icon: '✅' },
    { id: 'weather', label: 'Weather', icon: '🌦️' },
    { id: 'market', label: 'Market Prices', icon: '📈' },
    { id: 'shamba', label: 'Shamba Bot', icon: '🤖' },
    { id: 'vets', label: 'Vet Directory', icon: '🏥' },
    { id: 'grants', label: 'Govt Grants', icon: '📋' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]
  return (
    <aside style={{
      width: '240px', background: 'linear-gradient(180deg, #1b5e20 0%, #1e5c22 100%)',
      display: 'flex', flexDirection: 'column', height: '100vh',
      position: 'fixed', left: 0, top: 0,
    }}>
      <div style={{ padding: '22px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '22px', color: 'white' }}>🌱 AgriMateKE</div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '3px' }}>Your Farming Companion</div>
      </div>
      <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
            color: activePage === item.id ? 'white' : 'rgba(255,255,255,0.65)',
            background: activePage === item.id ? 'rgba(255,255,255,0.15)' : 'transparent',
            fontWeight: activePage === item.id ? '600' : '400',
            fontSize: '14px', border: 'none', width: '100%',
            textAlign: 'left', fontFamily: 'Outfit, sans-serif', marginBottom: '2px',
          }}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#4caf50', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' }}>E</div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>Essau Morgin</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Free Plan</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

function Topbar({ page }) {
  const titles = {
    dashboard: 'Dashboard', crops: 'My Crops', livestock: 'Livestock',
    sales: 'Sales & Expenses', tasks: 'Tasks', weather: 'Weather',
    market: 'Market Prices', shamba: 'Shamba Bot',
    vets: 'Vet Directory', grants: 'Govt Grants', settings: 'Settings'
  }
  return (
    <header style={{
      background: 'white', borderBottom: '1px solid #eeeeee',
      padding: '0 24px', height: '58px', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      position: 'fixed', top: 0, left: '240px', right: 0, zIndex: 10,
    }}>
      <div style={{ fontSize: '17px', fontWeight: '600', color: '#212121' }}>
        {titles[page] || 'AgriMateKE'}
      </div>
      <button style={{
        padding: '6px 14px', background: 'linear-gradient(135deg, #f57f17, #ff8f00)',
        color: 'white', border: 'none', borderRadius: '8px',
        fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
      }}>⭐ Go Pro</button>
    </header>
  )
}

function Dashboard() {
  const farmData = {
    todayRevenue: 4200,
    netProfit: 13900,
    activeCrops: 3,
    pendingTasks: 4,
    overdueTasks: 2,
  }
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '26px', color: '#212121' }}>
          Good morning, Essau 👋
        </h2>
        <p style={{ fontSize: '13px', color: '#9e9e9e', marginTop: '4px' }}>
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <MetricCard icon="💰" label="Today's Revenue" value={`KSh ${farmData.todayRevenue.toLocaleString()}`} sub="From sales today" color="#2e7d32" />
        <MetricCard icon="📈" label="Net Profit (Month)" value={`KSh ${farmData.netProfit.toLocaleString()}`} sub="After all expenses" color="#2e7d32" />
        <MetricCard icon="🌿" label="Active Crops" value={farmData.activeCrops} sub="1 ready to harvest" color="#0277bd" />
        <MetricCard icon="✅" label="Pending Tasks" value={farmData.pendingTasks} sub={`${farmData.overdueTasks} overdue`} color="#ef5350" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #eeeeee' }}>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Revenue — Last 7 Days</div>
          <div style={{ height: '140px', background: '#f5f5f5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9e9e9e', fontSize: '13px' }}>
            📊 Chart coming next session
          </div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #1b5e20, #2e7d32)', borderRadius: '16px', padding: '20px', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '24px' }}>🤖</span>
            <div style={{ fontSize: '15px', fontWeight: '600' }}>Shamba Bot</div>
          </div>
          <p style={{ fontSize: '13px', opacity: 0.85, lineHeight: 1.6 }}>
            Your maize is ready to harvest and tomato prices are 18% above average this week. Good time to plan your market run!
          </p>
          <button style={{ marginTop: '12px', background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
            Ask Shamba Bot →
          </button>
        </div>
      </div>
    </div>
  )
}

function Crops() {
  const [crops, setCrops] = useState([
    { id: 1, name: 'Maize', variety: 'H614D', acres: 2, stage: 'ready', planted: '2026-01-15' },
    { id: 2, name: 'Kales', variety: '', acres: 0.5, stage: 'fruiting', planted: '2026-03-01' },
    { id: 3, name: 'Tomatoes', variety: 'Kilele F1', acres: 1, stage: 'flowering', planted: '2026-02-10' },
  ])
  const [showForm, setShowForm] = useState(false)
  const [newCrop, setNewCrop] = useState({ name: '', variety: '', acres: '', stage: 'seedling', planted: '' })

  const stagePct = { seedling: 10, vegetative: 35, flowering: 55, fruiting: 75, ready: 95, harvested: 100 }
  const stageColor = { seedling: '#29b6f6', vegetative: '#4caf50', flowering: '#ffca28', fruiting: '#ffca28', ready: '#4caf50', harvested: '#9e9e9e' }

  function addCrop() {
    if (!newCrop.name) { alert('Crop name is required'); return }
    setCrops([...crops, { ...newCrop, id: Date.now(), acres: parseFloat(newCrop.acres) || 0 }])
    setNewCrop({ name: '', variety: '', acres: '', stage: 'seedling', planted: '' })
    setShowForm(false)
  }

  function deleteCrop(id) { setCrops(crops.filter(c => c.id !== id)) }
  function updateStage(id, stage) { setCrops(crops.map(c => c.id === id ? { ...c, stage } : c)) }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px' }}>My Crops</h2>
          <p style={{ fontSize: '13px', color: '#9e9e9e', marginTop: '2px' }}>
            {crops.filter(c => c.stage !== 'harvested').length} active · {crops.filter(c => c.stage === 'ready').length} ready to harvest
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
          + Add Crop
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1px solid #eeeeee' }}>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>New Crop</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            {[
              { label: 'Crop Name *', key: 'name', placeholder: 'e.g. Maize', type: 'text' },
              { label: 'Variety', key: 'variety', placeholder: 'e.g. H614D', type: 'text' },
              { label: 'Acres', key: 'acres', placeholder: '1.5', type: 'number' },
              { label: 'Planted On', key: 'planted', placeholder: '', type: 'date' },
            ].map(field => (
              <div key={field.key}>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '5px' }}>{field.label}</label>
                <input
                  type={field.type}
                  value={newCrop[field.key]}
                  onChange={e => setNewCrop({ ...newCrop, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontFamily: 'Outfit, sans-serif', fontSize: '14px', outline: 'none' }}
                />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '5px' }}>Growth Stage</label>
            <select value={newCrop.stage} onChange={e => setNewCrop({ ...newCrop, stage: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontFamily: 'Outfit, sans-serif', fontSize: '14px', outline: 'none' }}>
              {['seedling', 'vegetative', 'flowering', 'fruiting', 'ready', 'harvested'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={addCrop} style={{ background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Save Crop</button>
            <button onClick={() => setShowForm(false)} style={{ background: 'transparent', color: '#616161', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
        {crops.map(crop => (
          <div key={crop.id} style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #eeeeee', borderTop: `3px solid ${stageColor[crop.stage]}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ fontSize: '15px', fontWeight: '600' }}>{crop.name}</div>
              <span style={{ background: stageColor[crop.stage] + '22', color: stageColor[crop.stage], fontSize: '11px', fontWeight: '600', padding: '2px 10px', borderRadius: '99px' }}>{crop.stage}</span>
            </div>
            {crop.variety && <div style={{ fontSize: '12px', color: '#9e9e9e' }}>Variety: {crop.variety}</div>}
            <div style={{ fontSize: '12px', color: '#9e9e9e', marginTop: '2px' }}>{crop.acres} acres · Planted {crop.planted}</div>
            <div style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9e9e9e', marginBottom: '4px' }}>
                <span>Growth</span><span>{stagePct[crop.stage]}%</span>
              </div>
              <div style={{ height: '5px', background: '#eeeeee', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${stagePct[crop.stage]}%`, background: stageColor[crop.stage], borderRadius: '3px', transition: 'width 0.4s ease' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <select value={crop.stage} onChange={e => updateStage(crop.id, e.target.value)} style={{ flex: 1, padding: '6px 8px', border: '1px solid #e0e0e0', borderRadius: '8px', fontFamily: 'Outfit, sans-serif', fontSize: '12px', outline: 'none' }}>
                {['seedling', 'vegetative', 'flowering', 'fruiting', 'ready', 'harvested'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={() => deleteCrop(crop.id)} style={{ padding: '6px 10px', background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ShambaBot() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: '🌾 Hello! I am Shamba Bot, your AI farming companion. Ask me anything about your farm!' }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)

  const replies = {
    weather: 'Current weather: 28°C, Sunny. Rain expected Friday. Good planting window today! 🌦️',
    price: 'Maize: KSh 3,800/90kg. Tomatoes: KSh 6,200/crate (18% above average). 💹',
    crop: 'Your maize is at 95% growth — ready to harvest within 5 days. 🌿',
    profit: 'This month: Revenue KSh 35,000 · Expenses KSh 21,100 · Net Profit KSh 13,900 ✅',
    pest: 'For tomato blight: apply Ridomil every 7 days. Avoid wetting leaves. 🐛',
    default: 'I can help with crops, market prices, weather, profit and livestock. What do you need? 🌱'
  }

  function getReply(msg) {
    const m = msg.toLowerCase()
    if (m.includes('weather') || m.includes('rain')) return replies.weather
    if (m.includes('price') || m.includes('market') || m.includes('sell')) return replies.price
    if (m.includes('crop') || m.includes('maize') || m.includes('harvest')) return replies.crop
    if (m.includes('profit') || m.includes('revenue') || m.includes('money')) return replies.profit
    if (m.includes('pest') || m.includes('disease') || m.includes('blight')) return replies.pest
    return replies.default
  }

  function sendMessage() {
    if (!input.trim()) return
    setMessages(prev => [...prev, { role: 'user', text: input }])
    const userInput = input
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: getReply(userInput) }])
      setTyping(false)
    }, 1200)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 106px)', background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #eeeeee' }}>
      <div style={{ background: 'linear-gradient(135deg, #1b5e20, #2e7d32)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🤖</div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>🌾 Shamba Bot</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>AI-powered farming assistant · Online</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#f9fafb', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', maxWidth: '75%' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: msg.role === 'bot' ? '#e8f5e9' : '#2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
              {msg.role === 'bot' ? '🤖' : '👤'}
            </div>
            <div style={{ padding: '10px 14px', borderRadius: '18px', fontSize: '13px', lineHeight: 1.55, background: msg.role === 'bot' ? 'white' : '#2e7d32', color: msg.role === 'bot' ? '#212121' : 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderBottomLeftRadius: msg.role === 'bot' ? '4px' : '18px', borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px' }}>
              {msg.text}
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🤖</div>
            <div style={{ padding: '12px 16px', background: 'white', borderRadius: '18px', borderBottomLeftRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', gap: '4px' }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9e9e9e', animation: 'blink 1.2s ease infinite', animationDelay: `${i * 0.2}s` }} />)}
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: '8px 16px', background: 'white', borderTop: '1px solid #eeeeee', display: 'flex', gap: '6px', overflowX: 'auto' }}>
        {['🌧️ Weather?', '💹 Market prices?', '🌿 My crops?', '📊 My profit?', '🐛 Pest advice?'].map(chip => (
          <button key={chip} onClick={() => setInput(chip)} style={{ background: '#f1f8f1', color: '#2e7d32', border: '1px solid #a5d6a7', borderRadius: '99px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Outfit, sans-serif' }}>{chip}</button>
        ))}
      </div>
      <div style={{ padding: '12px 16px', background: 'white', borderTop: '1px solid #eeeeee', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Ask Shamba Bot anything..." style={{ flex: 1, background: '#f5f5f5', border: '1.5px solid transparent', borderRadius: '99px', padding: '10px 16px', fontFamily: 'Outfit, sans-serif', fontSize: '14px', outline: 'none' }} />
        <button onClick={sendMessage} style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#2e7d32', border: 'none', color: 'white', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>➤</button>
      </div>
      <style>{`@keyframes blink { 0%,80%,100%{opacity:.25} 40%{opacity:1} }`}</style>
    </div>
  )
}

function App() {
  const [page, setPage] = useState('dashboard')
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar activePage={page} onNavigate={setPage} />
      <div style={{ marginLeft: '240px', flex: 1, minHeight: '100vh' }}>
        <Topbar page={page} />
        <main style={{ padding: '24px', marginTop: '58px' }}>
          {page === 'dashboard' && <Dashboard />}
          {page === 'crops' && <Crops />}
          {page === 'shamba' && <ShambaBot />}
          {page !== 'dashboard' && page !== 'crops' && page !== 'shamba' && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '48px', textAlign: 'center', color: '#9e9e9e', border: '1px solid #eeeeee' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🚧</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#424242' }}>Coming Soon</div>
              <div style={{ fontSize: '13px', marginTop: '6px' }}>We are building this module. Check back soon!</div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
