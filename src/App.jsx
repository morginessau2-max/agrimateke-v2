import { useState, useEffect } from 'react'

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
  
function Sales() {
  const [activeTab, setActiveTab] = useState('sales')
  
  const [sales, setSales] = useState([
    { id: 1, item: 'Eggs (30 trays)', total: 12600, buyer: 'Naivas', date: '2026-05-01', cat: 'eggs' },
    { id: 2, item: 'Kales 80kg', total: 2800, buyer: 'Githurai Market', date: '2026-04-30', cat: 'crops' },
    { id: 3, item: 'Milk 120L', total: 6600, buyer: 'Brookside', date: '2026-04-28', cat: 'milk' },
    { id: 4, item: 'Broilers x20', total: 13000, buyer: 'Local butcher', date: '2026-04-25', cat: 'livestock' },
  ])

  const [expenses, setExpenses] = useState([
    { id: 1, desc: 'Layer mash - 10 bags', amount: 8500, cat: 'feed', date: '2026-04-28' },
    { id: 2, desc: 'CAN Fertilizer x4', amount: 6200, cat: 'fertilizer', date: '2026-04-25' },
    { id: 3, desc: 'Weeding labour', amount: 3600, cat: 'labour', date: '2026-04-20' },
    { id: 4, desc: 'Newcastle vaccine', amount: 2800, cat: 'vet', date: '2026-04-10' },
  ])

  const [showForm, setShowForm] = useState(false)
  const [newSale, setNewSale] = useState({ item: '', total: '', buyer: '', date: '' })
  const [newExpense, setNewExpense] = useState({ desc: '', amount: '', cat: 'feed', date: '' })

  // ── LESSON 2 IN ACTION: reduce calculating totals ──
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const netProfit = totalRevenue - totalExpenses
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0

  function addSale() {
    if (!newSale.item || !newSale.total) { alert('Item and total are required'); return }
    setSales([{ ...newSale, id: Date.now(), total: parseFloat(newSale.total) }, ...sales])
    setNewSale({ item: '', total: '', buyer: '', date: '' })
    setShowForm(false)
  }

  function addExpense() {
    if (!newExpense.amount) { alert('Amount is required'); return }
    setExpenses([{ ...newExpense, id: Date.now(), amount: parseFloat(newExpense.amount) }, ...expenses])
    setNewExpense({ desc: '', amount: '', cat: 'feed', date: '' })
    setShowForm(false)
  }

  function deleteSale(id) { setSales(sales.filter(s => s.id !== id)) }
  function deleteExpense(id) { setExpenses(expenses.filter(e => e.id !== id)) }

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    border: '1.5px solid #e0e0e0', borderRadius: '8px',
    fontFamily: 'Outfit, sans-serif', fontSize: '14px', outline: 'none'
  }
  const labelStyle = {
    fontSize: '13px', fontWeight: '600',
    display: 'block', marginBottom: '5px'
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px' }}>
          Sales & Expenses
        </h2>
        <p style={{ fontSize: '13px', color: '#9e9e9e', marginTop: '2px' }}>
          Track your income and spending
        </p>
      </div>

      {/* ── LESSON 2 IN ACTION: Metric cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px', marginBottom: '24px'
      }}>
        {[
          { label: 'Total Revenue', value: `KSh ${totalRevenue.toLocaleString()}`, color: '#2e7d32', icon: '💰' },
          { label: 'Total Expenses', value: `KSh ${totalExpenses.toLocaleString()}`, color: '#ef5350', icon: '📋' },
          { label: 'Net Profit', value: `KSh ${Math.abs(netProfit).toLocaleString()}`, color: netProfit >= 0 ? '#2e7d32' : '#ef5350', icon: netProfit >= 0 ? '📈' : '📉' },
          { label: 'Profit Margin', value: `${profitMargin}%`, color: profitMargin >= 0 ? '#0277bd' : '#ef5350', icon: '🎯' },
        ].map(card => (
          <div key={card.label} style={{
            background: 'white', borderRadius: '12px',
            padding: '16px', border: '1px solid #eeeeee'
          }}>
            <div style={{ fontSize: '22px', marginBottom: '6px' }}>{card.icon}</div>
            <div style={{ fontSize: '11px', color: '#9e9e9e', textTransform: 'uppercase', fontWeight: '600' }}>
              {card.label}
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: card.color, marginTop: '4px' }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── LESSON 3 IN ACTION: Tab switcher ── */}
      <div style={{
        display: 'flex', gap: '0',
        background: '#f5f5f5', borderRadius: '8px',
        padding: '4px', marginBottom: '16px',
        width: 'fit-content'
      }}>
        {['sales', 'expenses'].map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setShowForm(false) }}
            style={{
              padding: '8px 20px', border: 'none', borderRadius: '6px',
              fontFamily: 'Outfit, sans-serif', fontSize: '14px',
              fontWeight: '600', cursor: 'pointer',
              // ── LESSON 3: ternary operator deciding styles ──
              background: activeTab === tab ? 'white' : 'transparent',
              color: activeTab === tab ? '#1b5e20' : '#9e9e9e',
              boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {tab === 'sales' ? '💰 Sales' : '📋 Expenses'}
          </button>
        ))}
      </div>

      {/* Add button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: '#2e7d32', color: 'white', border: 'none',
            borderRadius: '8px', padding: '10px 18px',
            fontSize: '14px', fontWeight: '600',
            cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
          }}
        >
          {/* ── LESSON 3: && operator ── */}
          {activeTab === 'sales' ? '+ Record Sale' : '+ Add Expense'}
        </button>
      </div>

      {/* ── LESSON 3 IN ACTION: Conditional form ── */}
      {showForm && activeTab === 'sales' && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px', border: '1px solid #eeeeee' }}>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>New Sale</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>Item Sold *</label>
              <input style={inputStyle} value={newSale.item} onChange={e => setNewSale({ ...newSale, item: e.target.value })} placeholder="e.g. Eggs (30 trays)"/>
            </div>
            <div>
              <label style={labelStyle}>Total (KSh) *</label>
              <input style={inputStyle} type="number" value={newSale.total} onChange={e => setNewSale({ ...newSale, total: e.target.value })} placeholder="0"/>
            </div>
            <div>
              <label style={labelStyle}>Buyer</label>
              <input style={inputStyle} value={newSale.buyer} onChange={e => setNewSale({ ...newSale, buyer: e.target.value })} placeholder="e.g. Naivas"/>
            </div>
            <div>
              <label style={labelStyle}>Date</label>
              <input style={inputStyle} type="date" value={newSale.date} onChange={e => setNewSale({ ...newSale, date: e.target.value })}/>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={addSale} style={{ background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Save Sale</button>
            <button onClick={() => setShowForm(false)} style={{ background: 'transparent', color: '#616161', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Cancel</button>
          </div>
        </div>
      )}

      {showForm && activeTab === 'expenses' && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px', border: '1px solid #eeeeee' }}>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>New Expense</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>Description</label>
              <input style={inputStyle} value={newExpense.desc} onChange={e => setNewExpense({ ...newExpense, desc: e.target.value })} placeholder="e.g. Layer mash 10 bags"/>
            </div>
            <div>
              <label style={labelStyle}>Amount (KSh) *</label>
              <input style={inputStyle} type="number" value={newExpense.amount} onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })} placeholder="0"/>
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select style={inputStyle} value={newExpense.cat} onChange={e => setNewExpense({ ...newExpense, cat: e.target.value })}>
                {['feed','fertilizer','seeds','labour','vet','pesticide','equipment','transport','other'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Date</label>
              <input style={inputStyle} type="date" value={newExpense.date} onChange={e => setNewExpense({ ...newExpense, date: e.target.value })}/>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={addExpense} style={{ background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Save Expense</button>
            <button onClick={() => setShowForm(false)} style={{ background: 'transparent', color: '#616161', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── LESSON 3 IN ACTION: Show sales OR expenses based on tab ── */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #eeeeee', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #eeeeee' }}>
              {activeTab === 'sales'
                ? ['Item', 'Buyer', 'Total', 'Date', ''].map(h => (
                    <th key={h} style={{ fontSize: '11px', fontWeight: '700', color: '#9e9e9e', textTransform: 'uppercase', padding: '12px 16px', textAlign: 'left', letterSpacing: '0.05em' }}>{h}</th>
                  ))
                : ['Description', 'Category', 'Amount', 'Date', ''].map(h => (
                    <th key={h} style={{ fontSize: '11px', fontWeight: '700', color: '#9e9e9e', textTransform: 'uppercase', padding: '12px 16px', textAlign: 'left', letterSpacing: '0.05em' }}>{h}</th>
                  ))
              }
            </tr>
          </thead>
          <tbody>
            {/* ── LESSON 3: Show sales rows OR expense rows ── */}
            {activeTab === 'sales'
              ? sales.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600' }}>{s.item}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#9e9e9e' }}>{s.buyer || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '700', color: '#2e7d32' }}>KSh {s.total.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#9e9e9e' }}>{s.date}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => deleteSale(s.id)} style={{ background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}>🗑️</button>
                    </td>
                  </tr>
                ))
              : expenses.map(e => (
                  <tr key={e.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600' }}>{e.desc}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: '#f5f5f5', color: '#616161', fontSize: '11px', fontWeight: '600', padding: '2px 10px', borderRadius: '99px' }}>{e.cat}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '700', color: '#ef5350' }}>KSh {e.amount.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#9e9e9e' }}>{e.date}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => deleteExpense(e.id)} style={{ background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}>🗑️</button>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>

        {/* Empty state */}
        {activeTab === 'sales' && sales.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9e9e9e' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
            <div style={{ fontSize: '14px' }}>No sales recorded yet</div>
          </div>
        )}
        {activeTab === 'expenses' && expenses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9e9e9e' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📋</div>
            <div style={{ fontSize: '14px' }}>No expenses recorded yet</div>
          </div>
        )}
      </div>
    </div>
  )
}

function Tasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Vaccinate layers — Newcastle', due: '2026-05-03', priority: 'high', done: false },
    { id: 2, title: 'Apply CAN to maize field', due: '2026-05-10', priority: 'medium', done: false },
    { id: 3, title: 'Restock layer mash', due: '2026-05-01', priority: 'high', done: false },
    { id: 4, title: 'Morning milking', due: '2026-05-07', priority: 'medium', done: true },
    { id: 5, title: 'Spray tomatoes for blight', due: '2026-05-12', priority: 'medium', done: false },
  ])

  const [showForm, setShowForm] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', due: '', priority: 'medium' })
  const [overdueCount, setOverdueCount] = useState(0)

  // ── useEffect IN ACTION ──────────────────────────────
  // This runs every time the tasks array changes
  // It checks for overdue tasks and updates the count
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    const overdue = tasks.filter(t => !t.done && t.due < today)
    setOverdueCount(overdue.length)
  }, [tasks]) // the [tasks] means: run this effect when tasks changes

  const today = new Date().toISOString().slice(0, 10)

  // Same logic from our JS lesson — now inside React
  const pending = tasks.filter(t => !t.done).sort((a, b) => a.due > b.due ? 1 : -1)
  const completed = tasks.filter(t => t.done)
  const overdueTasks = tasks.filter(t => !t.done && t.due < today)

  function addTask() {
    if (!newTask.title) { alert('Task title is required'); return }
    setTasks([...tasks, { ...newTask, id: Date.now(), done: false }])
    setNewTask({ title: '', due: '', priority: 'medium' })
    setShowForm(false)
  }

  function completeTask(id) {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: true } : t))
  }

  function deleteTask(id) {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const priorityColor = { low: '#29b6f6', medium: '#ffca28', high: '#ef5350' }
  const inputStyle = { width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontFamily: 'Outfit, sans-serif', fontSize: '14px', outline: 'none' }
  const labelStyle = { fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '5px' }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px' }}>Tasks & Reminders</h2>
          <p style={{ fontSize: '13px', color: '#9e9e9e', marginTop: '2px' }}>
            {pending.length} pending · {completed.length} completed
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
          + Add Task
        </button>
      </div>

      {/* ── useEffect RESULT: Overdue alert banner ── */}
      {overdueCount > 0 && (
        <div style={{ background: '#fff8e1', border: '1px solid #ffca28', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#f57f17' }}>
              {overdueCount} overdue task{overdueCount > 1 ? 's' : ''} need your attention
            </div>
            <div style={{ fontSize: '12px', color: '#f57f17', marginTop: '2px' }}>
              {overdueTasks.map(t => t.title).join(' · ')}
            </div>
          </div>
        </div>
      )}

      {/* Add Task Form */}
      {showForm && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px', border: '1px solid #eeeeee' }}>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>New Task</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Task Title *</label>
              <input
                style={inputStyle}
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="e.g. Vaccinate layers"
              />
            </div>
            <div>
              <label style={labelStyle}>Due Date</label>
              <input
                style={inputStyle}
                type="date"
                value={newTask.due}
                onChange={e => setNewTask({ ...newTask, due: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <select
                style={inputStyle}
                value={newTask.priority}
                onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={addTask} style={{ background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Save Task</button>
            <button onClick={() => setShowForm(false)} style={{ background: 'transparent', color: '#616161', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Two columns - pending and completed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Pending Tasks */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#9e9e9e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            Pending ({pending.length})
          </div>

          {pending.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px', color: '#9e9e9e', background: 'white', borderRadius: '12px', border: '1px solid #eeeeee' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎉</div>
              <div style={{ fontSize: '13px' }}>No pending tasks!</div>
            </div>
          )}

          {pending.map(task => {
            const isOverdue = !task.done && task.due < today
            return (
              <div
                key={task.id}
                style={{
                  background: 'white',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  marginBottom: '8px',
                  border: `1px solid ${isOverdue ? '#ffcdd2' : '#eeeeee'}`,
                  borderLeft: `4px solid ${isOverdue ? '#ef5350' : priorityColor[task.priority]}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                }}
              >
                {/* Complete button */}
                <button
                  onClick={() => completeTask(task.id)}
                  style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    border: `2px solid ${priorityColor[task.priority]}`,
                    background: 'transparent', cursor: 'pointer',
                    flexShrink: 0, marginTop: '1px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#212121' }}>
                    {task.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <span style={{ fontSize: '11px', color: isOverdue ? '#ef5350' : '#9e9e9e', fontWeight: isOverdue ? '700' : '400' }}>
                      {isOverdue ? '⚠️ Overdue · ' : ''}{task.due}
                    </span>
                    <span style={{ background: priorityColor[task.priority] + '22', color: priorityColor[task.priority], fontSize: '10px', fontWeight: '700', padding: '1px 7px', borderRadius: '99px' }}>
                      {task.priority}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  style={{ background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', borderRadius: '6px', padding: '3px 8px', cursor: 'pointer', fontSize: '12px', flexShrink: 0 }}
                >
                  🗑️
                </button>
              </div>
            )
          })}
        </div>

        {/* Completed Tasks */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#9e9e9e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            Completed ({completed.length})
          </div>

          {completed.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px', color: '#9e9e9e', background: 'white', borderRadius: '12px', border: '1px solid #eeeeee' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>📋</div>
              <div style={{ fontSize: '13px' }}>No completed tasks yet</div>
            </div>
          )}

          {completed.map(task => (
            <div
              key={task.id}
              style={{
                background: 'white', borderRadius: '10px',
                padding: '12px 14px', marginBottom: '8px',
                border: '1px solid #eeeeee', opacity: 0.6,
                display: 'flex', alignItems: 'center', gap: '10px',
              }}
            >
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#4caf50', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: 'white', fontSize: '11px' }}>✓</span>
              </div>
              <div style={{ fontSize: '13px', color: '#9e9e9e', textDecoration: 'line-through', flex: 1 }}>
                {task.title}
              </div>
              <button onClick={() => deleteTask(task.id)} style={{ background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', borderRadius: '6px', padding: '3px 8px', cursor: 'pointer', fontSize: '12px' }}>🗑️</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Livestock() {
  const [groups, setGroups] = useState([
    { id: 1, emoji: '🐔', name: 'Layer Flock A', type: 'Layers', count: 120, eggs: 98, milk: 0, notes: 'Lohmann Brown' },
    { id: 2, emoji: '🐓', name: 'Broilers Batch 3', type: 'Broilers', count: 220, eggs: 0, milk: 0, notes: 'Ross 308, 4 weeks' },
    { id: 3, emoji: '🐄', name: 'Dairy Herd', type: 'Dairy', count: 8, eggs: 0, milk: 48, notes: 'Friesian crossbreeds' },
  ])

  const [records, setRecords] = useState([
    { id: 1, groupId: 1, type: 'eggs', qty: 98, unit: 'eggs', date: '2026-05-08' },
    { id: 2, groupId: 3, type: 'milk', qty: 48, unit: 'litres', date: '2026-05-08' },
    { id: 3, groupId: 2, type: 'feed', qty: 15, unit: 'kg', date: '2026-05-08' },
  ])

  const [showGroupForm, setShowGroupForm] = useState(false)
  const [showRecordForm, setShowRecordForm] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)

  const [newGroup, setNewGroup] = useState({
    name: '', type: 'Layers', count: '', notes: ''
  })

  const [newRecord, setNewRecord] = useState({
    groupId: '', type: 'eggs', qty: '', date: new Date().toISOString().slice(0, 10)
  })

  // ── LIFTING STATE UP in action ──
  // These totals are computed from groups
  // If Dashboard was a sibling it would receive these as props
  const totalAnimals = groups.reduce((sum, g) => sum + g.count, 0)
  const totalEggs = groups.reduce((sum, g) => sum + g.eggs, 0)
  const totalMilk = groups.reduce((sum, g) => sum + g.milk, 0)

  const typeEmoji = {
    Layers: '🐔', Broilers: '🐓', Dairy: '🐄',
    Goats: '🐐', Pigs: '🐷', Other: '🐾'
  }

  function addGroup() {
    if (!newGroup.name) { alert('Group name is required'); return }
    const emoji = typeEmoji[newGroup.type] || '🐾'
    setGroups([...groups, {
      ...newGroup,
      id: Date.now(),
      emoji,
      count: parseInt(newGroup.count) || 0,
      eggs: 0,
      milk: 0
    }])
    setNewGroup({ name: '', type: 'Layers', count: '', notes: '' })
    setShowGroupForm(false)
  }

  function saveRecord() {
    if (!newRecord.groupId || !newRecord.qty) {
      alert('Select a group and enter quantity'); return
    }
    const qty = parseFloat(newRecord.qty)
    const gid = parseInt(newRecord.groupId)

    // Update group daily totals
    setGroups(groups.map(g => {
      if (g.id !== gid) return g
      if (newRecord.type === 'eggs') return { ...g, eggs: qty }
      if (newRecord.type === 'milk') return { ...g, milk: qty }
      return g
    }))

    // Add to records log
    const group = groups.find(g => g.id === gid)
    const units = { eggs: 'eggs', milk: 'litres', feed: 'kg', mortality: 'birds', vaccination: 'birds' }
    setRecords([{
      id: Date.now(),
      groupId: gid,
      groupName: group?.name,
      type: newRecord.type,
      qty,
      unit: units[newRecord.type],
      date: newRecord.date
    }, ...records])

    setNewRecord({ groupId: '', type: 'eggs', qty: '', date: new Date().toISOString().slice(0, 10) })
    setShowRecordForm(false)
  }

  function deleteGroup(id) {
    setGroups(groups.filter(g => g.id !== id))
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    border: '1.5px solid #e0e0e0', borderRadius: '8px',
    fontFamily: 'Outfit, sans-serif', fontSize: '14px', outline: 'none'
  }
  const labelStyle = {
    fontSize: '13px', fontWeight: '600',
    display: 'block', marginBottom: '5px'
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px' }}>Livestock & Poultry</h2>
          <p style={{ fontSize: '13px', color: '#9e9e9e', marginTop: '2px' }}>
            {totalAnimals} animals across {groups.length} groups
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => { setShowRecordForm(!showRecordForm); setShowGroupForm(false) }}
            style={{ background: 'white', color: '#2e7d32', border: '1.5px solid #2e7d32', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}
          >
            📋 Record Daily
          </button>
          <button
            onClick={() => { setShowGroupForm(!showGroupForm); setShowRecordForm(false) }}
            style={{ background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}
          >
            + Add Group
          </button>
        </div>
      </div>

      {/* Summary metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Animals', value: totalAnimals, icon: '🐾', color: '#212121' },
          { label: 'Eggs Today', value: totalEggs, icon: '🥚', color: '#2e7d32' },
          { label: 'Milk Today', value: totalMilk + 'L', icon: '🥛', color: '#0277bd' },
          { label: 'Groups', value: groups.length, icon: '🏡', color: '#7b1fa2' },
        ].map(m => (
          <div key={m.label} style={{ background: 'white', borderRadius: '12px', padding: '14px 16px', border: '1px solid #eeeeee' }}>
            <div style={{ fontSize: '22px', marginBottom: '6px' }}>{m.icon}</div>
            <div style={{ fontSize: '11px', color: '#9e9e9e', textTransform: 'uppercase', fontWeight: '600' }}>{m.label}</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: m.color, marginTop: '4px' }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Add Group Form */}
      {showGroupForm && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px', border: '1px solid #eeeeee' }}>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>New Livestock Group</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>Group Name *</label>
              <input style={inputStyle} value={newGroup.name} onChange={e => setNewGroup({ ...newGroup, name: e.target.value })} placeholder="e.g. Layer Flock B"/>
            </div>
            <div>
              <label style={labelStyle}>Type</label>
              <select style={inputStyle} value={newGroup.type} onChange={e => setNewGroup({ ...newGroup, type: e.target.value })}>
                {['Layers', 'Broilers', 'Dairy', 'Goats', 'Pigs', 'Other'].map(t => (
                  <option key={t} value={t}>{typeEmoji[t]} {t}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Number of Animals</label>
              <input style={inputStyle} type="number" value={newGroup.count} onChange={e => setNewGroup({ ...newGroup, count: e.target.value })} placeholder="100"/>
            </div>
            <div>
              <label style={labelStyle}>Notes (optional)</label>
              <input style={inputStyle} value={newGroup.notes} onChange={e => setNewGroup({ ...newGroup, notes: e.target.value })} placeholder="Breed, age, etc."/>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={addGroup} style={{ background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Save Group</button>
            <button onClick={() => setShowGroupForm(false)} style={{ background: 'transparent', color: '#616161', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Record Daily Form */}
      {showRecordForm && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px', border: '1px solid #eeeeee' }}>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Record Daily Production</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>Livestock Group *</label>
              <select style={inputStyle} value={newRecord.groupId} onChange={e => setNewRecord({ ...newRecord, groupId: e.target.value })}>
                <option value="">Select group...</option>
                {groups.map(g => <option key={g.id} value={g.id}>{g.emoji} {g.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Record Type</label>
              <select style={inputStyle} value={newRecord.type} onChange={e => setNewRecord({ ...newRecord, type: e.target.value })}>
                <option value="eggs">🥚 Eggs collected</option>
                <option value="milk">🥛 Milk (litres)</option>
                <option value="feed">🌾 Feed given (kg)</option>
                <option value="mortality">💀 Mortality</option>
                <option value="vaccination">💉 Vaccination</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Quantity</label>
              <input style={inputStyle} type="number" value={newRecord.qty} onChange={e => setNewRecord({ ...newRecord, qty: e.target.value })} placeholder="0"/>
            </div>
            <div>
              <label style={labelStyle}>Date</label>
              <input style={inputStyle} type="date" value={newRecord.date} onChange={e => setNewRecord({ ...newRecord, date: e.target.value })}/>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={saveRecord} style={{ background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Save Record</button>
            <button onClick={() => setShowRecordForm(false)} style={{ background: 'transparent', color: '#616161', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Groups Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        {groups.map(group => (
          <div key={group.id} style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #eeeeee' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>{group.emoji}</div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#212121' }}>{group.name}</div>
            <div style={{ fontSize: '12px', color: '#9e9e9e', marginTop: '2px' }}>{group.type}</div>
            {group.notes && <div style={{ fontSize: '11px', color: '#bdbdbd', marginTop: '4px' }}>{group.notes}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '14px' }}>
              {[
                { label: 'Count', value: group.count },
                { label: 'Eggs', value: group.eggs || '—' },
                { label: 'Milk L', value: group.milk || '—' },
              ].map(stat => (
                <div key={stat.label} style={{ background: '#f9fafb', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: '#9e9e9e', fontWeight: '700', textTransform: 'uppercase' }}>{stat.label}</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#212121', marginTop: '2px' }}>{stat.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button
                onClick={() => { setSelectedGroup(group.id); setNewRecord({ ...newRecord, groupId: String(group.id) }); setShowRecordForm(true); setShowGroupForm(false) }}
                style={{ flex: 1, background: '#f1f8f1', color: '#2e7d32', border: '1px solid #a5d6a7', borderRadius: '8px', padding: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}
              >
                📋 Record
              </button>
              <button
                onClick={() => deleteGroup(group.id)}
                style={{ background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontSize: '12px' }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Records Log */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #eeeeee', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #eeeeee', fontSize: '15px', fontWeight: '600' }}>
          Recent Records
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #eeeeee' }}>
              {['Group', 'Type', 'Quantity', 'Date'].map(h => (
                <th key={h} style={{ fontSize: '11px', fontWeight: '700', color: '#9e9e9e', textTransform: 'uppercase', padding: '10px 16px', textAlign: 'left', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.slice(0, 8).map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td style={{ padding: '11px 16px', fontSize: '13px', fontWeight: '600' }}>
                  {r.groupName || groups.find(g => g.id === r.groupId)?.name || '—'}
                </td>
                <td style={{ padding: '11px 16px' }}>
                  <span style={{ background: '#f1f8f1', color: '#2e7d32', fontSize: '11px', fontWeight: '700', padding: '2px 10px', borderRadius: '99px' }}>
                    {r.type}
                  </span>
                </td>
                <td style={{ padding: '11px 16px', fontSize: '13px', fontWeight: '600', color: '#212121' }}>
                  {r.qty} {r.unit}
                </td>
                <td style={{ padding: '11px 16px', fontSize: '13px', color: '#9e9e9e' }}>
                  {r.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
          {page === 'sales' && <Sales />}
          {page === 'tasks' && <Tasks />}
          {page === 'livestock' && <Livestock />}
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
