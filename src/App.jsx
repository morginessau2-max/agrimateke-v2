// ── COMPONENTS ──────────────────────────────────────────

function MetricCard({ icon, label, value, sub, color }) {
  return (
    <div style={{
      background: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '16px 20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
    }}>
      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
      <div style={{
        fontSize: '11px', color: '#9e9e9e',
        textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600'
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '24px', fontWeight: '700',
        color: color || '#212121', marginTop: '4px'
      }}>
        {value}
      </div>
      <div style={{ fontSize: '11px', color: '#9e9e9e', marginTop: '4px' }}>
        {sub}
      </div>
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
      width: '240px',
      background: 'linear-gradient(180deg, #1b5e20 0%, #1e5c22 100%)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '22px 20px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          fontFamily: 'DM Serif Display, serif',
          fontSize: '22px',
          color: 'white',
        }}>
          🌱 AgriMateKE
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '3px' }}>
          Your Farming Companion
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              color: activePage === item.id ? 'white' : 'rgba(255,255,255,0.65)',
              background: activePage === item.id ? 'rgba(255,255,255,0.15)' : 'transparent',
              fontWeight: activePage === item.id ? '600' : '400',
              fontSize: '14px',
              border: 'none',
              width: '100%',
              textAlign: 'left',
              fontFamily: 'Outfit, sans-serif',
              marginBottom: '2px',
            }}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '12px 8px',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 12px'
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: '#4caf50', color: 'white',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: '700', fontSize: '14px'
          }}>
            E
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>
              Essau Morgin
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
              Free Plan
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

function Topbar({ page }) {
  const titles = {
    dashboard: 'Dashboard', crops: 'My Crops',
    livestock: 'Livestock', sales: 'Sales & Expenses',
    tasks: 'Tasks', weather: 'Weather',
    market: 'Market Prices', shamba: 'Shamba Bot',
    vets: 'Vet Directory', grants: 'Govt Grants',
    settings: 'Settings'
  }

  return (
    <header style={{
      background: 'white',
      borderBottom: '1px solid #eeeeee',
      padding: '0 24px',
      height: '58px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      position: 'fixed',
      top: 0,
      left: '240px',
      right: 0,
      zIndex: 10,
    }}>
      <div style={{ fontSize: '17px', fontWeight: '600', color: '#212121' }}>
        {titles[page] || 'AgriMateKE'}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button style={{
          padding: '6px 14px',
          background: 'linear-gradient(135deg, #f57f17, #ff8f00)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          fontFamily: 'Outfit, sans-serif'
        }}>
          ⭐ Go Pro
        </button>
      </div>
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
        <h2 style={{
          fontFamily: 'DM Serif Display, serif',
          fontSize: '26px', color: '#212121'
        }}>
          Good morning, Essau 👋
        </h2>
        <p style={{ fontSize: '13px', color: '#9e9e9e', marginTop: '4px' }}>
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'long', day: 'numeric',
            month: 'long', year: 'numeric'
          })}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <MetricCard
          icon="💰" label="Today's Revenue"
          value={`KSh ${farmData.todayRevenue.toLocaleString()}`}
          sub="From sales today" color="#2e7d32"
        />
        <MetricCard
          icon="📈" label="Net Profit (Month)"
          value={`KSh ${farmData.netProfit.toLocaleString()}`}
          sub="After all expenses" color="#2e7d32"
        />
        <MetricCard
          icon="🌿" label="Active Crops"
          value={farmData.activeCrops}
          sub="1 ready to harvest" color="#0277bd"
        />
        <MetricCard
          icon="✅" label="Pending Tasks"
          value={farmData.pendingTasks}
          sub={`${farmData.overdueTasks} overdue`}
          color="#ef5350"
        />
      </div>

      {/* Coming soon panels */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px'
      }}>
        <div style={{
          background: 'white', borderRadius: '16px',
          padding: '20px', border: '1px solid #eeeeee'
        }}>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            Revenue — Last 7 Days
          </div>
          <div style={{
            height: '140px', background: '#f5f5f5',
            borderRadius: '8px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: '#9e9e9e', fontSize: '13px'
          }}>
            📊 Chart coming next session
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1b5e20, #2e7d32)',
          borderRadius: '16px', padding: '20px', color: 'white'
        }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: '10px', marginBottom: '10px'
          }}>
            <span style={{ fontSize: '24px' }}>🤖</span>
            <div style={{ fontSize: '15px', fontWeight: '600' }}>
              Shamba Bot
            </div>
          </div>
          <p style={{ fontSize: '13px', opacity: 0.85, lineHeight: 1.6 }}>
            Your maize is ready to harvest and tomato prices
            are 18% above average this week. Good time to
            plan your market run!
          </p>
          <button style={{
            marginTop: '12px', background: 'rgba(255,255,255,0.15)',
            color: 'white', border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '8px', padding: '8px 14px',
            fontSize: '13px', fontWeight: '600',
            cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
          }}>
            Ask Shamba Bot →
          </button>
        </div>
      </div>
    </div>
  )
}

// ── MAIN APP ────────────────────────────────────────────
function App() {
  // useState - React's way of remembering things
  // When page changes, React re-renders automatically
  const [page, setPage] = useState('dashboard')

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar activePage={page} onNavigate={setPage} />
      <div style={{ marginLeft: '240px', flex: 1, minHeight: '100vh' }}>
        <Topbar page={page} />
        <main style={{ padding: '24px', marginTop: '58px' }}>
          {page === 'dashboard' && <Dashboard />}
          {page !== 'dashboard' && (
            <div style={{
              background: 'white', borderRadius: '16px',
              padding: '48px', textAlign: 'center',
              color: '#9e9e9e', border: '1px solid #eeeeee'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🚧</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#424242' }}>
                Coming Soon
              </div>
              <div style={{ fontSize: '13px', marginTop: '6px' }}>
                We are building this module. Check back soon!
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// Import useState at the top
import { useState } from 'react'

export default App