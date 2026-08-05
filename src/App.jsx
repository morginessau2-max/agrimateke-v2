import { useState, useEffect, useRef } from 'react'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import LandingPage from './pages/LandingPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ProfileSetupPage from './pages/ProfileSetupPage'
import ErrorBoundary from './components/ErrorBoundary'
import { SkeletonBox, SkeletonGrid, SkeletonList, SkeletonCard, SkeletonDashboard } from './components/Skeleton'
import EmptyState from './components/EmptyState'
import { useCrops } from './hooks/useCrops'
import { useTasks } from './hooks/useTasks'
import { useSales } from './hooks/useSales'
import { useLivestock } from './hooks/useLivestock'
import { supabase} from './lib/supabase'


// ─────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────
function fmt(n) { return 'KSh ' + Math.abs(n).toLocaleString() }
function nid() { return Date.now() + Math.random() }
function today() { return new Date().toISOString().slice(0, 10) }
function greet() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}



// ─────────────────────────────────────────────────────────
//  METRIC CARD
// ─────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────
//  SIDEBAR
// ─────────────────────────────────────────────────────────
function Sidebar({ activePage, onNavigate, userName, profile }) {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard',      icon: '📊' },
    { id: 'crops',     label: 'My Crops',        icon: '🌿' },
    { id: 'livestock', label: 'Livestock',        icon: '🐄' },
    { id: 'sales',     label: 'Sales & Expenses', icon: '💰' },
    { id: 'tasks',     label: 'Tasks',            icon: '✅' },
    { id: 'weather',   label: 'Weather',          icon: '🌦️' },
    { id: 'market',    label: 'Market Prices',    icon: '📈' },
    { id: 'shamba',    label: 'Shamba Bot',       icon: '🤖' },
    { id: 'vets',      label: 'Vet Directory',    icon: '🏥' },
    { id: 'grants',    label: 'Govt Grants',      icon: '📋' },
    { id: 'settings',  label: 'Settings',         icon: '⚙️' },
    ...(profile?.is_admin ? [{ id: 'admin', label: 'Admin', icon: '🔐' }] : [])
  ]

  function handleNav(id) {
    onNavigate(id)
    setOpen(false)
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div style={{ padding: '22px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '22px', color: 'white' }}>
          🌱 AgriMateKE
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '3px' }}>
          Your Farming Companion
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => handleNav(item.id)} style={{
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

      {/* User */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: '#4caf50', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '700', fontSize: '14px', flexShrink: 0
          }}>
            {userName ? userName[0].toUpperCase() : '?'}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>{userName}</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Free Plan</div>
          </div>
        </div>
      </div>
    </>
  )

  // ── MOBILE ──────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        {/* Mobile Top Bar */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: 'linear-gradient(90deg, #1b5e20, #2e7d32)',
          height: '56px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '20px', color: 'white' }}>
            🌱 AgriMateKE
          </div>
          <button
            onClick={() => setOpen(!open)}
            style={{
              background: 'rgba(255,255,255,0.15)', border: 'none',
              color: 'white', fontSize: '20px', cursor: 'pointer',
              width: '40px', height: '40px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
            {open ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Drawer Overlay */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.5)'
            }}
          />
        )}

        {/* Mobile Drawer */}
        <div style={{
          position: 'fixed', top: 0, left: 0, bottom: 0,
          width: '280px', zIndex: 300,
          background: 'linear-gradient(180deg, #1b5e20 0%, #1e5c22 100%)',
          display: 'flex', flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          boxShadow: open ? '4px 0 20px rgba(0,0,0,0.3)' : 'none'
        }}>
          {sidebarContent}
        </div>

        {/* Mobile Bottom Nav — quick access to main modules */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          background: 'white', borderTop: '1px solid #e0e0e0',
          display: 'flex', height: '60px',
          boxShadow: '0 -2px 8px rgba(0,0,0,0.08)'
        }}>
          {[
            { id: 'dashboard', icon: '📊', label: 'Home' },
            { id: 'crops',     icon: '🌿', label: 'Crops' },
            { id: 'tasks',     icon: '✅', label: 'Tasks' },
            { id: 'sales',     icon: '💰', label: 'Sales' },
            { id: 'shamba',    icon: '🤖', label: 'Bot' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '2px',
                border: 'none', cursor: 'pointer',
                background: activePage === item.id ? '#e8f5e9' : 'white',
                borderTop: activePage === item.id ? '2px solid #2e7d32' : '2px solid transparent',
              }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span style={{ fontSize: '9px', fontWeight: '600', color: activePage === item.id ? '#2e7d32' : '#9e9e9e', fontFamily: 'Outfit, sans-serif' }}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </>
    )
  }

  // ── DESKTOP ──────────────────────────────────────────────
  return (
    <aside style={{
      width: '240px',
      background: 'linear-gradient(180deg, #1b5e20 0%, #1e5c22 100%)',
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'fixed', left: 0, top: 0,
    }}>
      {sidebarContent}
    </aside>
  )
}

// ─────────────────────────────────────────────────────────
//  TOPBAR
// ─────────────────────────────────────────────────────────
function Topbar({ page, isMobile }) {
  const titles = {
    dashboard: 'Dashboard', crops: 'My Crops', livestock: 'Livestock',
    sales: 'Sales & Expenses', tasks: 'Tasks', weather: 'Weather',
    market: 'Market Prices', shamba: 'Shamba Bot',
    vets: 'Vet Directory', grants: 'Govt Grants',
    settings: 'Settings', admin: 'Admin'
  }

  if (isMobile) return null // Mobile uses the top bar inside Sidebar

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

// ─────────────────────────────────────────────────────────
//  COMING SOON
// ─────────────────────────────────────────────────────────
function ComingSoon({ page }) {
  return (
    <div style={{
      background: 'white', borderRadius: '16px', padding: '48px',
      textAlign: 'center', color: '#9e9e9e', border: '1px solid #eeeeee'
    }}>
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>🚧</div>
      <div style={{ fontSize: '16px', fontWeight: '600', color: '#424242' }}>{page} — Coming Soon</div>
      <div style={{ fontSize: '13px', marginTop: '6px' }}>We are building this module. Check back soon!</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
//  INPUT STYLE
// ─────────────────────────────────────────────────────────
const inputStyle = {
  padding: '10px 12px', border: '1.5px solid #e0e0e0',
  borderRadius: '8px', fontFamily: 'Outfit, sans-serif',
  fontSize: '14px', color: '#212121', outline: 'none', width: '100%',
}

// ─────────────────────────────────────────────────────────
//  DASHBOARD
// ─────────────────────────────────────────────────────────
function Dashboard({ crops, tasks, sales, expenses, userName, onNavigate, loading }) {
  const now = today()

  const activeCrops   = crops.filter(c => c.stage !== 'harvested').length
  const readyCrops    = crops.filter(c => c.stage === 'ready').length
  const pendingTasks  = tasks.filter(t => !t.done).length
  const overdueTasks  = tasks.filter(t => !t.done && t.due_date && t.due_date < now).length
  const totalRevenue  = sales.reduce((sum, s) => sum + (s.total || 0), 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
  const netProfit     = totalRevenue - totalExpenses

  if (loading) return <SkeletonDashboard />

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '26px', color: '#212121' }}>
          {greet()}, {userName} 👋
        </h2>
        <p style={{ fontSize: '13px', color: '#9e9e9e', marginTop: '4px' }}>
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'long', day: 'numeric',
            month: 'long', year: 'numeric'
          })}
        </p>
      </div>

      {/* First time welcome banner */}
      {activeCrops === 0 && pendingTasks === 0 && totalRevenue === 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #E8F5E9, #F1F8E9)',
          border: '1.5px solid #A5D6A7', borderRadius: '14px',
          padding: '20px 24px', marginBottom: '20px',
          display: 'flex', alignItems: 'center',
          gap: '16px', flexWrap: 'wrap'
        }}>
          <div style={{ fontSize: '40px' }}>👋</div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#1B5E20', marginBottom: '4px' }}>
              Welcome to AgriMateKE, {userName}!
            </div>
            <div style={{ fontSize: '13px', color: '#2E7D32', lineHeight: 1.6 }}>
              Your farm dashboard is ready. Start by adding your crops to unlock insights and recommendations.
            </div>
          </div>
          <button
            onClick={() => onNavigate('crops')}
            style={{
              padding: '10px 20px', background: '#2E7D32',
              color: 'white', border: 'none', borderRadius: '8px',
              fontSize: '13px', fontWeight: '700',
              cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
              whiteSpace: 'nowrap'
            }}>
            🌱 Add First Crop
          </button>
        </div>
      )}

      {/* Overdue alert */}
      {overdueTasks > 0 && (
        <div style={{
          background: '#fff8e1', border: '1px solid #ffca28',
          borderRadius: '10px', padding: '12px 16px',
          marginBottom: '16px', display: 'flex',
          alignItems: 'center', gap: '10px'
        }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#f57f17' }}>
              {overdueTasks} overdue task{overdueTasks > 1 ? 's' : ''} need attention
            </div>
            <div style={{ fontSize: '12px', color: '#f57f17', marginTop: '2px' }}>
              {tasks
                .filter(t => !t.done && t.due_date && t.due_date < now)
                .map(t => t.title)
                .join(' · ')}
            </div>
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px', marginBottom: '24px'
      }}>
        <MetricCard
          icon="💰" label="Total Revenue"
          value={fmt(totalRevenue)}
          sub={totalRevenue === 0 ? 'Record a sale to start' : 'All time'}
          color="#2e7d32"
        />
        <MetricCard
          icon="📈" label="Net Profit"
          value={fmt(netProfit)}
          sub={netProfit >= 0 ? 'Profit' : 'Running at a loss'}
          color={netProfit >= 0 ? '#2e7d32' : '#ef5350'}
        />
        <MetricCard
          icon="🌿" label="Active Crops"
          value={activeCrops}
          sub={readyCrops > 0 ? `${readyCrops} ready to harvest` : 'Track your crops'}
          color="#0277bd"
        />
        <MetricCard
          icon="✅" label="Pending Tasks"
          value={pendingTasks}
          sub={overdueTasks > 0 ? `${overdueTasks} overdue` : pendingTasks === 0 ? 'All done! 🎉' : 'On track'}
          color={overdueTasks > 0 ? '#ef5350' : '#2e7d32'}
        />
      </div>

      {/* Bottom Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px'
      }}>

        {/* Today's Tasks */}
        <div style={{
          background: 'white', borderRadius: '16px',
          padding: '20px', border: '1px solid #eeeeee'
        }}>
          <div style={{
            fontSize: '15px', fontWeight: '600',
            marginBottom: '14px', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span>Today's Tasks</span>
            {pendingTasks > 0 && (
              <span style={{
                fontSize: '11px', background: '#e8f5e9',
                color: '#2e7d32', padding: '2px 8px',
                borderRadius: '99px', fontWeight: '700'
              }}>
                {pendingTasks} pending
              </span>
            )}
          </div>
          {pendingTasks === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#9e9e9e' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎉</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#2e7d32' }}>All caught up!</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>No pending tasks today</div>
            </div>
          ) : (
            tasks.filter(t => !t.done).slice(0, 4).map(task => {
              const isOverdue = task.due_date && task.due_date < now
              return (
                <div key={task.id} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 0', borderBottom: '1px solid #f5f5f5'
                }}>
                  <div style={{
                    width: '8px', height: '8px',
                    borderRadius: '50%', flexShrink: 0,
                    background:
                      task.priority === 'high'   ? '#ef5350' :
                      task.priority === 'medium' ? '#ffca28' : '#29b6f6'
                  }} />
                  <div style={{ flex: 1, fontSize: '13px', color: '#424242' }}>
                    {task.title}
                  </div>
                  {isOverdue && (
                    <span style={{
                      fontSize: '10px', background: '#ffebee',
                      color: '#c62828', padding: '2px 6px',
                      borderRadius: '99px', fontWeight: '700'
                    }}>
                      Overdue
                    </span>
                  )}
                </div>
              )
            })
          )}
          {pendingTasks > 4 && (
            <div
              onClick={() => onNavigate('tasks')}
              style={{
                textAlign: 'center', fontSize: '12px',
                color: '#2e7d32', fontWeight: '600',
                cursor: 'pointer', marginTop: '10px'
              }}>
              View all {pendingTasks} tasks →
            </div>
          )}
        </div>

        {/* Shamba Bot Teaser */}
        <div style={{
          background: 'linear-gradient(135deg, #1b5e20, #2e7d32)',
          borderRadius: '16px', padding: '20px', color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '24px' }}>🤖</span>
            <div style={{ fontSize: '15px', fontWeight: '600' }}>Shamba Bot</div>
          </div>
          <p style={{ fontSize: '13px', opacity: 0.85, lineHeight: 1.6 }}>
            {activeCrops === 0 && pendingTasks === 0
              ? 'Welcome! Start by adding your crops and tasks. I will help you manage your farm smarter.'
              : `You have ${activeCrops} active crop${activeCrops !== 1 ? 's' : ''} and ${pendingTasks} pending task${pendingTasks !== 1 ? 's' : ''}. Ask me anything!`
            }
          </p>
          <button
            onClick={() => onNavigate('shamba')}
            style={{
              marginTop: '12px', background: 'rgba(255,255,255,0.15)',
              color: 'white', border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px', padding: '8px 14px',
              fontSize: '13px', fontWeight: '600',
              cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
            }}>
            Ask Shamba Bot →
          </button>
        </div>

        {/* Financial Summary */}
        {(sales.length > 0 || expenses.length > 0) && (
          <div style={{
            background: 'white', borderRadius: '16px',
            padding: '20px', border: '1px solid #eeeeee'
          }}>
            <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '14px' }}>
              Financial Summary
            </div>
            {[
              { label: 'Total Revenue',  value: fmt(totalRevenue),  color: '#2e7d32' },
              { label: 'Total Expenses', value: fmt(totalExpenses), color: '#ef5350' },
              { label: 'Net Profit',     value: fmt(netProfit),     color: netProfit >= 0 ? '#2e7d32' : '#ef5350' },
            ].map(item => (
              <div key={item.label} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '9px 0', borderBottom: '1px solid #f5f5f5'
              }}>
                <div style={{ fontSize: '13px', color: '#616161' }}>{item.label}</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: item.color }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ready to Harvest Alert */}
        {readyCrops > 0 && (
          <div style={{
            background: '#fff8e1', border: '1.5px solid #ffca28',
            borderRadius: '16px', padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '24px' }}>🌾</span>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#f57f17' }}>
                Ready to Harvest!
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#f57f17', lineHeight: 1.6 }}>
              {readyCrops} crop{readyCrops !== 1 ? 's are' : ' is'} ready for harvest.
              Check your Crops module to update their status.
            </div>
            <button
              onClick={() => onNavigate('crops')}
              style={{
                marginTop: '12px', background: '#f57f17',
                color: 'white', border: 'none',
                borderRadius: '8px', padding: '8px 14px',
                fontSize: '13px', fontWeight: '600',
                cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
              }}>
              View Crops →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}




// ─────────────────────────────────────────────────────────
//  CROPS
// ─────────────────────────────────────────────────────────
function Crops({ crops, addCrop, updateCropStage, deleteCrop,loading }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', variety: '', acres: '', planted: '', harvest: '', stage: 'seedling', notes: '' })
  if (loading) return (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <div>
        <SkeletonBox width="120px" height="28px" style={{ marginBottom: '6px' }} />
        <SkeletonBox width="180px" height="14px" />
      </div>
      <SkeletonBox width="110px" height="40px" radius="8px" />
    </div>
    <SkeletonGrid count={4} />
  </div>
)
  
  const stages = ['seedling', 'growing', 'flowering', 'ready', 'harvested']
  const stageColor = {
    seedling:  { bg: '#e3f2fd', color: '#0277bd' },
    growing:   { bg: '#e8f5e9', color: '#2e7d32' },
    flowering: { bg: '#f3e5f5', color: '#7b1fa2' },
    ready:     { bg: '#fff8e1', color: '#f57f17' },
    harvested: { bg: '#eeeeee', color: '#616161' },
  }
  async function handleAdd() {
    if (!form.name.trim()) return alert('Crop name is required')
    try{
      await addCrop(form)
      setForm({ name: '', variety: '', acres: '', planted: '', harvest: '', stage: 'seedling', notes: '' })
      setShowForm(false)
    } catch (err) {
      alert('Failed to add crop: ' + err.message)}}
    
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px', color: '#212121' }}>My Crops</h2>
          <p style={{ fontSize: '13px', color: '#9e9e9e', marginTop: '3px' }}>{crops.length === 0 ? 'No crops yet' : `${crops.length} crop${crops.length !== 1 ? 's' : ''} tracked`}</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{ padding: '10px 18px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>🌱 Add Crop</button>
      </div>

      {crops.length === 0 && !showForm && (
        <EmptyState
          icon="🌿"
          title="No crops added yet"
          desc="Start tracking your crops to see insights on your dashboard.Know exactly when to plant, spray, and harvest for maximum yield."
          action="🌱 Add First Crop"
          onAction={() => setShowForm(true)}
        />

      )}

      {showForm && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #eeeeee', marginBottom: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#212121', marginBottom: '18px' }}>🌱 New Crop</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Crop Name *', key: 'name', placeholder: 'e.g. Maize, Tomatoes' },
              { label: 'Variety', key: 'variety', placeholder: 'e.g. H614D, Kilele F1' },
              { label: 'Acres Planted', key: 'acres', placeholder: 'e.g. 2.5', type: 'number' },
            ].map(f => (
              <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>{f.label}</label>
                <input type={f.type || 'text'} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inputStyle} />
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Stage</label>
              <select value={form.stage} onChange={e => setForm(p => ({ ...p, stage: e.target.value }))} style={inputStyle}>
                {stages.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Date Planted</label>
              <input type="date" value={form.planted} onChange={e => setForm(p => ({ ...p, planted: e.target.value }))} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Expected Harvest</label>
              <input type="date" value={form.harvest} onChange={e => setForm(p => ({ ...p, harvest: e.target.value }))} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Notes</label>
              <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Any additional notes..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
            <button onClick={handleAdd} style={{ padding: '10px 20px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Save Crop</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: 'transparent', color: '#616161', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Cancel</button>
          </div>
        </div>
      )}

      {crops.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
          {crops.map(crop => (
            <div key={crop.id} style={{ background: 'white', borderRadius: '14px', padding: '18px', border: '1px solid #eeeeee', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#212121' }}>{crop.name}</div>
                  {crop.variety && <div style={{ fontSize: '12px', color: '#9e9e9e', marginTop: '2px' }}>{crop.variety}</div>}
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '99px', background: stageColor[crop.stage]?.bg, color: stageColor[crop.stage]?.color }}>
                  {crop.stage.charAt(0).toUpperCase() + crop.stage.slice(1)}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                {crop.acres > 0 && <div style={{ fontSize: '12px', color: '#616161' }}>📐 <strong>{crop.acres}</strong> acres</div>}
                {crop.planted && <div style={{ fontSize: '12px', color: '#616161' }}>📅 Planted: <strong>{crop.planted}</strong></div>}
                {crop.harvest && <div style={{ fontSize: '12px', color: '#616161' }}>🌾 Harvest: <strong>{crop.harvest}</strong></div>}
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: '#9e9e9e', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Update Stage</div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {stages.map(s => (
                    <button key={s} onClick={() => updateCropStage(crop.id, s)} style={{ padding: '4px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', border: crop.stage === s ? '2px solid #2e7d32' : '1px solid #e0e0e0', background: crop.stage === s ? '#e8f5e9' : 'white', color: crop.stage === s ? '#2e7d32' : '#9e9e9e' }}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              {crop.notes && <div style={{ fontSize: '12px', color: '#757575', fontStyle: 'italic', marginBottom: '12px' }}>"{crop.notes}"</div>}
              <button onClick={() => { if (window.confirm('Remove this crop?')) deleteCrop(crop.id) }} style={{ fontSize: '12px', color: '#ef5350', background: '#ffebee', border: '1px solid #ffcdd2', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>🗑 Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


// ─────────────────────────────────────────────────────────
//  LIVESTOCK
// ─────────────────────────────────────────────────────────
function Livestock({ livestock, addLivestock, addRecord, deleteLivestock,loading }) {
  const [showForm, setShowForm]         = useState(false)
  const [showRecordForm, setShowRecordForm] = useState(null)
  const [form, setForm]   = useState({ emoji: '🐄', name: '', type: 'Dairy', count: '', notes: '' })
  const [record, setRecord] = useState({ type: 'milk', qty: '', date: today() })
  if (loading) return (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <div>
        <SkeletonBox width="120px" height="28px" style={{ marginBottom: '6px' }} />
        <SkeletonBox width="180px" height="14px" />
      </div>
      <SkeletonBox width="120px" height="40px" radius="8px" />
    </div>
    <SkeletonGrid count={3} />
  </div>
)

  const types  = ['Dairy', 'Beef', 'Layers', 'Broilers', 'Goats', 'Sheep', 'Pigs', 'Other']
  const emojis = ['🐄', '🐂', '🐔', '🐓', '🐐', '🐑', '🐖', '🦆']

  async function handleAdd() {
    if (!form.name.trim()) return alert('Group name is required')
  try {
await addLivestock(form)
setForm({ emoji: '🐄', name: '', type: 'Dairy', count: '', notes: '' })
setShowForm(false)
} catch (err) {
  alert('Failed to add livestock: ' + err.message)}}
    
async function handleRecord() {
    if (!record.qty) return alert('Enter a quantity')
    try {
      await addRecord(showRecordForm, record)
      setRecord({ type: 'milk', qty: '', date: today() })
      setShowRecordForm(null)
    } catch (err) {
      alert('Failed to add record: ' + err.message)
    }
  }

  function totalProd(animal, type) {
    return (animal.livestock_records || []).filter(r => r.type === type).reduce((sum, r) => sum + r.qty, 0)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px', color: '#212121' }}>Livestock</h2>
          <p style={{ fontSize: '13px', color: '#9e9e9e', marginTop: '3px' }}>{livestock.length === 0 ? 'No livestock yet' : `${livestock.length} group${livestock.length !== 1 ? 's' : ''} tracked`}</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{ padding: '10px 18px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>🐄 Add Group</button>
      </div>

      {livestock.length === 0 && !showForm && (
        <EmptyState
          icon="🐄"
          title="No livestock added yet"
          desc="Track your animals and record daily milk,egg and weight data.See your totals grow over time and make informed decisions for your farm."
          action="🐄 Add First Group"
          onAction={() => setShowForm(true)}
        />
      )}

      {showForm && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #eeeeee', marginBottom: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#212121', marginBottom: '18px' }}>🐄 New Livestock Group</div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161', display: 'block', marginBottom: '8px' }}>Animal Type</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {emojis.map(e => (
                <button key={e} onClick={() => setForm(f => ({ ...f, emoji: e }))} style={{ fontSize: '24px', padding: '8px', borderRadius: '8px', cursor: 'pointer', border: form.emoji === e ? '2px solid #2e7d32' : '1px solid #e0e0e0', background: form.emoji === e ? '#e8f5e9' : 'white' }}>{e}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Group Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Main Herd" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Category</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inputStyle}>
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Number of Animals</label>
              <input type="number" value={form.count} onChange={e => setForm(f => ({ ...f, count: e.target.value }))} placeholder="e.g. 12" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Notes</label>
              <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="e.g. Vaccinated" style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
            <button onClick={handleAdd} style={{ padding: '10px 20px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Save Group</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: 'transparent', color: '#616161', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Cancel</button>
          </div>
        </div>
      )}

      {showRecordForm && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #eeeeee', marginBottom: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#212121', marginBottom: '18px' }}>📋 Record Production</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Type</label>
              <select value={record.type} onChange={e => setRecord(r => ({ ...r, type: e.target.value }))} style={inputStyle}>
                <option value="milk">Milk (litres)</option>
                <option value="eggs">Eggs (pieces)</option>
                <option value="weight">Weight (kg)</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Quantity</label>
              <input type="number" value={record.qty} onChange={e => setRecord(r => ({ ...r, qty: e.target.value }))} placeholder="e.g. 25" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Date</label>
              <input type="date" value={record.date} onChange={e => setRecord(r => ({ ...r, date: e.target.value }))} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
            <button onClick={handleRecord} style={{ padding: '10px 20px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Save Record</button>
            <button onClick={() => setShowRecordForm(null)} style={{ padding: '10px 20px', background: 'transparent', color: '#616161', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Cancel</button>
          </div>
        </div>
      )}

      {livestock.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
          {livestock.map(animal => (
            <div key={animal.id} style={{ background: 'white', borderRadius: '14px', padding: '18px', border: '1px solid #eeeeee', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '32px' }}>{animal.emoji}</span>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#212121' }}>{animal.name}</div>
                    <div style={{ fontSize: '12px', color: '#9e9e9e' }}>{animal.type} · {animal.count} animals</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                {totalProd(animal, 'milk') > 0 && (
                  <div style={{ background: '#e3f2fd', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#0277bd' }}>{totalProd(animal, 'milk')}L</div>
                    <div style={{ fontSize: '11px', color: '#0277bd' }}>Total Milk</div>
                  </div>
                )}
                {totalProd(animal, 'eggs') > 0 && (
                  <div style={{ background: '#fff8e1', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#f57f17' }}>{totalProd(animal, 'eggs')}</div>
                    <div style={{ fontSize: '11px', color: '#f57f17' }}>Total Eggs</div>
                  </div>
                )}
              </div>
              {(animal.livestock_records || []).length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#9e9e9e', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>Recent Records</div>
                  {animal.livestock_records.slice(0, 3).map(r => (
                    <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f5f5f5', fontSize: '12px' }}>
                      <span style={{ color: '#616161' }}>{r.type.charAt(0).toUpperCase() + r.type.slice(1)}</span>
                      <span style={{ fontWeight: '600', color: '#212121' }}>{r.qty} · {r.date}</span>
                    </div>
                  ))}
                </div>
              )}
              {animal.notes && <div style={{ fontSize: '12px', color: '#757575', fontStyle: 'italic', marginBottom: '12px' }}>"{animal.notes}"</div>}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setShowRecordForm(animal.id)} style={{ flex: 1, padding: '8px', background: '#e8f5e9', color: '#2e7d32', border: '1px solid #c8e6c9', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>📋 Record Production</button>
                <button onClick={() => { if (window.confirm('Remove this group?')) deleteLivestock(animal.id) }} style={{ padding: '8px 12px', background: '#ffebee', color: '#ef5350', border: '1px solid #ffcdd2', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
//  SALES & EXPENSES
// ─────────────────────────────────────────────────────────
function Sales({ sales, setSales, expenses, setExpenses, addSale, deleteSale, addExpense, deleteExpense, loading }) {
  const [tab, setTab] = useState('overview')
  const [showSaleForm, setShowSaleForm]       = useState(false)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [saleForm, setSaleForm]     = useState({ item: '', qty: '', price: '', total: '', buyer: '', date: today() })
  const [expenseForm, setExpenseForm] = useState({ desc: '', cat: 'seeds', amount: '', date: today() })
  if (loading) return (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <div>
        <SkeletonBox width="180px" height="28px" style={{ marginBottom: '6px' }} />
        <SkeletonBox width="200px" height="14px" />
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <SkeletonBox width="110px" height="40px" radius="8px" />
        <SkeletonBox width="120px" height="40px" radius="8px" />
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
      {[1,2,3].map(i => <SkeletonCard key={i} />)}
    </div>
    <SkeletonList count={4} />
  </div>
)
  
  const expenseCats = ['seeds', 'fertiliser', 'labour', 'equipment', 'veterinary', 'fuel', 'transport', 'other']
  const totalRevenue  = sales.reduce((sum, s) => sum + s.total, 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const netProfit     = totalRevenue - totalExpenses

  async function handleAddSale() {
    if (!saleForm.item.trim()) return alert('Item name is required')
    if (!saleForm.total) return alert('Total amount is required')
  try{
    await addSale(saleForm)
    setSaleForm({ item: '', qty: '', price: '', total: '', buyer: '', date: today() })
    setShowSaleForm(false)
  } catch (err) {
    alert('Failed to add sale: ' + err.message)
  }}
  
async function handleAddExpense() {
    if (!expenseForm.amount) return alert('Amount is required')
  try{
    await addExpense(expenseForm)
    setExpenseForm({ desc: '', cat: 'seeds', amount: '', date: today() })
    setShowExpenseForm(false)
  } catch (err) {
    alert('Failed to add expense: ' + err.message)
  }
}
  function tabStyle(id) {
    const active = tab === id
    return { padding: '8px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', border: 'none', fontFamily: 'Outfit, sans-serif', background: active ? '#2e7d32' : 'transparent', color: active ? 'white' : '#9e9e9e' }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px', color: '#212121' }}>Sales & Expenses</h2>
          <p style={{ fontSize: '13px', color: '#9e9e9e', marginTop: '3px' }}>Track your farm income and costs</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => { setShowSaleForm(true); setShowExpenseForm(false) }} style={{ padding: '10px 16px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>💰 Add Sale</button>
          <button onClick={() => { setShowExpenseForm(true); setShowSaleForm(false) }} style={{ padding: '10px 16px', background: '#ef5350', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>📋 Add Expense</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <MetricCard icon="💰" label="Total Revenue" value={fmt(totalRevenue)} sub={`${sales.length} sale${sales.length !== 1 ? 's' : ''}`} color="#2e7d32" />
        <MetricCard icon="📋" label="Total Expenses" value={fmt(totalExpenses)} sub={`${expenses.length} expense${expenses.length !== 1 ? 's' : ''}`} color="#ef5350" />
        <MetricCard icon="📈" label="Net Profit" value={fmt(netProfit)} sub={netProfit >= 0 ? '🟢 In profit' : '🔴 At a loss'} color={netProfit >= 0 ? '#2e7d32' : '#ef5350'} />
      </div>

      {showSaleForm && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #eeeeee', marginBottom: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#212121', marginBottom: '18px' }}>💰 Record Sale</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Item Sold *</label>
              <input value={saleForm.item} onChange={e => setSaleForm(f => ({ ...f, item: e.target.value }))} placeholder="e.g. Maize, Milk" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Quantity</label>
              <input type="number" value={saleForm.qty} onChange={e => setSaleForm(f => ({ ...f, qty: e.target.value }))} onBlur={() => { const q = parseFloat(saleForm.qty); const p = parseFloat(saleForm.price); if (q && p) setSaleForm(f => ({ ...f, total: String(q * p) })) }} placeholder="e.g. 50" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Price per Unit (KSh)</label>
              <input type="number" value={saleForm.price} onChange={e => setSaleForm(f => ({ ...f, price: e.target.value }))} onBlur={() => { const q = parseFloat(saleForm.qty); const p = parseFloat(saleForm.price); if (q && p) setSaleForm(f => ({ ...f, total: String(q * p) })) }} placeholder="e.g. 40" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Total Amount (KSh) *</label>
              <input type="number" value={saleForm.total} onChange={e => setSaleForm(f => ({ ...f, total: e.target.value }))} placeholder="Auto-calculated or enter manually" style={{ ...inputStyle, background: saleForm.total ? '#e8f5e9' : 'white' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Buyer</label>
              <input value={saleForm.buyer} onChange={e => setSaleForm(f => ({ ...f, buyer: e.target.value }))} placeholder="e.g. Wakulima Market" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Date</label>
              <input type="date" value={saleForm.date} onChange={e => setSaleForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
            <button onClick={handleAddSale} style={{ padding: '10px 20px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Save Sale</button>
            <button onClick={() => setShowSaleForm(false)} style={{ padding: '10px 20px', background: 'transparent', color: '#616161', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Cancel</button>
          </div>
        </div>
      )}

      {showExpenseForm && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #eeeeee', marginBottom: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#212121', marginBottom: '18px' }}>📋 Record Expense</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Description</label>
              <input value={expenseForm.desc} onChange={e => setExpenseForm(f => ({ ...f, desc: e.target.value }))} placeholder="e.g. Bought DAP fertiliser" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Category</label>
              <select value={expenseForm.cat} onChange={e => setExpenseForm(f => ({ ...f, cat: e.target.value }))} style={inputStyle}>
                {expenseCats.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Amount (KSh) *</label>
              <input type="number" value={expenseForm.amount} onChange={e => setExpenseForm(f => ({ ...f, amount: e.target.value }))} placeholder="e.g. 3500" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Date</label>
              <input type="date" value={expenseForm.date} onChange={e => setExpenseForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
            <button onClick={handleAddExpense} style={{ padding: '10px 20px', background: '#ef5350', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Save Expense</button>
            <button onClick={() => setShowExpenseForm(false)} style={{ padding: '10px 20px', background: 'transparent', color: '#616161', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '4px', background: '#f5f5f5', borderRadius: '10px', padding: '4px', marginBottom: '16px', width: 'fit-content' }}>
        {['overview', 'sales', 'expenses'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={tabStyle(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #eeeeee' }}>
            <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '14px' }}>Recent Sales</div>
            {sales.length === 0 ? (<EmptyState
              icon="💰"
              title="No sales recorded yet"
              desc="Record your first sale to start tracking your farm income and see your earnings grow."
              action="💰 Record  First Sale"
              onAction={() => setShowSaleForm(true)}
            />) : sales.slice(0, 5).map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#212121' }}>{s.item}</div>
                    <div style={{ fontSize: '11px', color: '#9e9e9e' }}>{s.date}{s.buyer ? ` · ${s.buyer}` : ''}</div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#2e7d32' }}>{fmt(s.total)}</div>
                </div>
              ))}
          </div>
          <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #eeeeee' }}>
            <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '14px' }}>Recent Expenses</div>
            {expenses.length === 0 ? (<EmptyState
              icon="📋"
              title="No expenses recorded yet"
              desc="Track your farm costs - seeds, fertilizers,labour and more - to know your true profit."
              action="📋 Record First Expense"
              onAction={() => setShowExpenseForm(true)}
            /> ): expenses.slice(0, 5).map(e => (
                <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#212121' }}>{e.desc}</div>
                    <div style={{ fontSize: '11px', color: '#9e9e9e' }}>{e.date} · {e.cat}</div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#ef5350' }}>{fmt(e.amount)}</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {tab === 'sales' && (
        <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #eeeeee', overflow: 'hidden' }}>
          {sales.length === 0 ? <div style={{ textAlign: 'center', padding: '48px', color: '#9e9e9e', fontSize: '13px' }}>No sales recorded yet</div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafafa' }}>
                  {['Item', 'Qty', 'Price', 'Total', 'Buyer', 'Date', ''].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#9e9e9e', textTransform: 'uppercase', borderBottom: '1px solid #eeeeee' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sales.map(s => (
                  <tr key={s.id}>
                    <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '600', color: '#212121', borderBottom: '1px solid #f5f5f5' }}>{s.item}</td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', color: '#616161', borderBottom: '1px solid #f5f5f5' }}>{s.qty || '—'}</td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', color: '#616161', borderBottom: '1px solid #f5f5f5' }}>{s.price ? fmt(s.price) : '—'}</td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#2e7d32', borderBottom: '1px solid #f5f5f5' }}>{fmt(s.total)}</td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', color: '#616161', borderBottom: '1px solid #f5f5f5' }}>{s.buyer || '—'}</td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', color: '#616161', borderBottom: '1px solid #f5f5f5' }}>{s.date}</td>
                    <td style={{ padding: '12px 14px', borderBottom: '1px solid #f5f5f5' }}>
                      <button onClick={() => { if (window.confirm('Remove?')) deleteSale(s.id) }} style={{ background: '#ffebee', color: '#ef5350', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}>🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'expenses' && (
        <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #eeeeee', overflow: 'hidden' }}>
          {expenses.length === 0 ? <div style={{ textAlign: 'center', padding: '48px', color: '#9e9e9e', fontSize: '13px' }}>No expenses recorded yet</div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafafa' }}>
                  {['Description', 'Category', 'Amount', 'Date', ''].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#9e9e9e', textTransform: 'uppercase', borderBottom: '1px solid #eeeeee' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expenses.map(e => (
                  <tr key={e.id}>
                    <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '600', color: '#212121', borderBottom: '1px solid #f5f5f5' }}>{e.desc}</td>
                    <td style={{ padding: '12px 14px', borderBottom: '1px solid #f5f5f5' }}>
                      <span style={{ background: '#f3e5f5', color: '#7b1fa2', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '99px' }}>{e.cat}</span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#ef5350', borderBottom: '1px solid #f5f5f5' }}>{fmt(e.amount)}</td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', color: '#616161', borderBottom: '1px solid #f5f5f5' }}>{e.date}</td>
                    <td style={{ padding: '12px 14px', borderBottom: '1px solid #f5f5f5' }}>
                      <button onClick={() => { if (window.confirm('Remove?')) deleteExpense(e.id) }} style={{ background: '#ffebee', color: '#ef5350', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}>🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
//  TASKS
// ─────────────────────────────────────────────────────────
function Tasks({ tasks, addTask, toggleTask, deleteTask,loading }) {
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter]     = useState('all')
  const [form, setForm] = useState({ title: '', desc: '', priority: 'medium', category: 'general', due: '' })
  if (loading) return (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <div>
        <SkeletonBox width="100px" height="28px" style={{ marginBottom: '6px' }} />
        <SkeletonBox width="160px" height="14px" />
      </div>
      <SkeletonBox width="110px" height="40px" radius="8px" />
    </div>
    <SkeletonList count={5} />
  </div>
)
  
  const categories = ['general', 'crops', 'livestock', 'financial', 'maintenance', 'other']
  const priorities = ['low', 'medium', 'high']
  const priorityColor = { low: { bg: '#e3f2fd', color: '#0277bd' }, medium: { bg: '#fff8e1', color: '#f57f17' }, high: { bg: '#ffebee', color: '#c62828' } }
  const categoryIcon  = { general: '📌', crops: '🌿', livestock: '🐄', financial: '💰', maintenance: '🔧', other: '📋' }

  async function handleAdd() {
    if (!form.title.trim()) return alert('Task title is required')
    try{
      await addTask(form)
      setForm({ title: '', desc: '', priority: 'medium', category: 'general', due: '' })
      setShowForm(false)
    } catch (err) {
      alert('Failed to add task: ' + err.message)
    }
  }

  const now  = today()
  const filtered = tasks.filter(t => {
    if (filter === 'all')     return true
    if (filter === 'pending') return !t.done
    if (filter === 'done')    return t.done
    if (filter === 'overdue') return !t.done && t.due_date && t.due_date < now
    if (filter === 'today')   return t.due_date === now
    return true
  })
  const counts = { 
    all:     tasks.length,
    pending: tasks.filter(t => !t.done).length,
    overdue: tasks.filter(t => !t.done && t.due_date && t.due_date < now).length,
    today:   tasks.filter(t => t.due_date === now).length,
    done:    tasks.filter(t => t.done).length
  }

  
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px', color: '#212121' }}>Tasks</h2>
          <p style={{ fontSize: '13px', color: '#9e9e9e', marginTop: '3px' }}>{counts.pending === 0 ? 'All caught up! 🎉' : `${counts.pending} pending task${counts.pending !== 1 ? 's' : ''}`}</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{ padding: '10px 18px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>✅ Add Task</button>
      </div>

      {counts.overdue > 0 && (
        <div style={{ background: '#fff8e1', border: '1px solid #ffca28', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#f57f17' }}>{counts.overdue} overdue task{counts.overdue !== 1 ? 's' : ''}</div>
        </div>
      )}

      {showForm && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #eeeeee', marginBottom: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#212121', marginBottom: '18px' }}>✅ New Task</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Task Title *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Apply fertiliser to maize field" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Description</label>
              <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Any extra details..." rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Priority</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {priorities.map(p => (
                  <button key={p} onClick={() => setForm(f => ({ ...f, priority: p }))} style={{ flex: 1, padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', border: form.priority === p ? `2px solid ${priorityColor[p].color}` : '1px solid #e0e0e0', background: form.priority === p ? priorityColor[p].bg : 'white', color: form.priority === p ? priorityColor[p].color : '#9e9e9e' }}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
                {categories.map(c => <option key={c} value={c}>{categoryIcon[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Due Date</label>
              <input type="date" value={form.due} onChange={e => setForm(f => ({ ...f, due: e.target.value }))} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
            <button onClick={handleAdd} style={{ padding: '10px 20px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Save Task</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: 'transparent', color: '#616161', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '4px', background: '#f5f5f5', borderRadius: '10px', padding: '4px', marginBottom: '16px', width: 'fit-content', flexWrap: 'wrap' }}>
        {['all', 'pending', 'today', 'overdue', 'done'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: 'none', fontFamily: 'Outfit, sans-serif', background: filter === f ? '#2e7d32' : 'transparent', color: filter === f ? 'white' : '#9e9e9e', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {counts[f] > 0 && <span style={{ background: filter === f ? 'rgba(255,255,255,0.25)' : '#eeeeee', color: filter === f ? 'white' : '#616161', borderRadius: '99px', padding: '1px 7px', fontSize: '11px' }}>{counts[f]}</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <EmptyState
    icon={filter === 'done' ? '🎉' : filter === 'overdue' ? '✅' : '📋'}
    title={
      filter === 'all'     ? 'No tasks yet' :
      filter === 'done'    ? 'No completed tasks yet' :
      filter === 'overdue' ? 'No overdue tasks!' :
      filter === 'today'   ? 'Nothing due today' :
      'No pending tasks!'
    }
    desc={
      filter === 'all'     ? 'Plan your farm activities. Add tasks with due dates and priority levels to stay on top of your shamba.' :
      filter === 'done'    ? 'Complete some tasks and they will appear here.' :
      filter === 'overdue' ? 'Great work — you are all caught up on overdue tasks!' :
      filter === 'today'   ? 'Nothing is due today. Enjoy your day!' :
      'All caught up! You have no pending tasks right now. 🎉'
    }
    action={filter === 'all' || filter === 'pending' ? '✅ Add First Task' : null}
    onAction={() => setShowForm(true)}
  />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(task => {
          const isOverdue = !task.done && task.due_date && task.due_date < now
          const isToday   = task.due_date === now
          return (
            <div key={task.id} style={{ background: 'white', borderRadius: '12px', padding: '16px 18px', border: '1px solid #eeeeee', display: 'flex', alignItems: 'flex-start', gap: '14px', opacity: task.done ? 0.6 : 1, borderLeft: isOverdue ? '4px solid #ef5350' : isToday ? '4px solid #ffca28' : '4px solid transparent', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <button onClick={() => toggleTask(task.id, !task.done)} style={{ width: '22px', height: '22px', borderRadius: '50%', border: task.done ? 'none' : '2px solid #e0e0e0', background: task.done ? '#2e7d32' : 'white', cursor: 'pointer', flexShrink: 0, marginTop: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white', fontWeight: '700' }}>
                {task.done ? '✓' : ''}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#212121', textDecoration: task.done ? 'line-through' : 'none' }}>{categoryIcon[task.category]} {task.title}</div>
                  <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '99px', background: priorityColor[task.priority]?.bg, color: priorityColor[task.priority]?.color }}>{task.priority.toUpperCase()}</span>
                  {isOverdue && <span style={{ fontSize: '10px', background: '#ffebee', color: '#c62828', padding: '2px 8px', borderRadius: '99px', fontWeight: '700' }}>OVERDUE</span>}
                  {isToday && !task.done && <span style={{ fontSize: '10px', background: '#fff8e1', color: '#f57f17', padding: '2px 8px', borderRadius: '99px', fontWeight: '700' }}>TODAY</span>}
                </div>
                {task.description && <div style={{ fontSize: '12px', color: '#9e9e9e', marginTop: '4px' }}>{task.description}</div>}
                {task.due_date && <div style={{ fontSize: '11px', color: isOverdue ? '#ef5350' : '#9e9e9e', marginTop: '4px' }}>📅 Due: {task.due_date}</div>}
              </div>
              <button onClick={() => { if (window.confirm('Delete task?')) deleteTask(task.id) }} style={{ background: '#ffebee', color: '#ef5350', border: '1px solid #ffcdd2', borderRadius: '6px', padding: '5px 8px', fontSize: '12px', cursor: 'pointer', flexShrink: 0 }}>🗑</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
//  WEATHER
// ─────────────────────────────────────────────────────────
function Weather() {
  const [weather, setWeather]   = useState(null)
  const [location, setLocation] = useState(null)
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const weatherCode = {
    0: { label: 'Clear Sky', icon: '☀️' }, 1: { label: 'Mainly Clear', icon: '🌤️' },
    2: { label: 'Partly Cloudy', icon: '⛅' }, 3: { label: 'Overcast', icon: '☁️' },
    45: { label: 'Foggy', icon: '🌫️' }, 48: { label: 'Foggy', icon: '🌫️' },
    51: { label: 'Light Drizzle', icon: '🌦️' }, 61: { label: 'Light Rain', icon: '🌧️' },
    63: { label: 'Rain', icon: '🌧️' }, 65: { label: 'Heavy Rain', icon: '🌧️' },
    80: { label: 'Rain Showers', icon: '🌦️' }, 95: { label: 'Thunderstorm', icon: '⛈️' },
  }

  function getInfo(code) { return weatherCode[code] || { label: 'Unknown', icon: '🌡️' } }

  function farmingAdvice(code, rain, temp) {
    if ([95, 99].includes(code)) return { msg: 'Thunderstorm expected — keep livestock sheltered and avoid fieldwork.', color: '#c62828', bg: '#ffebee' }
    if ([61, 63, 65, 80, 81].includes(code)) return { msg: 'Rain expected — hold off spraying. Check drainage in your fields.', color: '#0277bd', bg: '#e3f2fd' }
    if (temp > 32) return { msg: 'Very hot — water crops early morning or evening. Keep animals hydrated.', color: '#e65100', bg: '#fff3e0' }
    if (temp < 12) return { msg: 'Cool temperatures — watch for frost risk. Protect sensitive seedlings.', color: '#4527a0', bg: '#ede7f6' }
    return { msg: 'Conditions look good for general farm activities today.', color: '#2e7d32', bg: '#e8f5e9' }
  }

  async function fetchWeather(lat, lon, name) {
    setLoading(true); setError(null)
    try {
      const res  = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=Africa%2FNairobi&forecast_days=7`)
      const data = await res.json()
      setWeather(data); setLocation(name)
    } catch { setError('Failed to fetch weather. Check your internet connection.') }
    finally { setLoading(false) }
  }

  function getLocation() {
    if (!navigator.geolocation) { setError('Geolocation not supported.'); return }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lon } = pos.coords
        try {
          const geo  = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
          const data = await geo.json()
          fetchWeather(lat, lon, data.address?.county || data.address?.city || 'Your Location')
        } catch { fetchWeather(lat, lon, 'Your Location') }
      },
      () => fetchWeather(-1.2921, 36.8219, 'Nairobi')
    )
  }

  useEffect(() => { getLocation() }, [])

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px', color: '#212121' }}>Weather</h2>
          <p style={{ fontSize: '13px', color: '#9e9e9e', marginTop: '3px' }}>{location ? `📍 ${location}` : 'Detecting your location...'}</p>
        </div>
        <button onClick={getLocation} style={{ padding: '10px 18px', background: '#0277bd', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>🔄 Refresh</button>
      </div>

      {loading && <div style={{ background: 'white', borderRadius: '16px', padding: '64px', textAlign: 'center', border: '1px solid #eeeeee' }}><div style={{ fontSize: '40px', marginBottom: '12px' }}>🌍</div><div style={{ fontSize: '15px', color: '#9e9e9e' }}>Fetching weather for your farm...</div></div>}
      {error && !loading && <div style={{ background: '#ffebee', borderRadius: '16px', padding: '32px', textAlign: 'center', border: '1px solid #ffcdd2' }}><div style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</div><div style={{ fontSize: '15px', color: '#c62828', marginBottom: '16px' }}>{error}</div><button onClick={getLocation} style={{ padding: '10px 20px', background: '#c62828', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Try Again</button></div>}

      {weather && !loading && (
        <div>
          <div style={{ background: 'linear-gradient(135deg, #0277bd, #0288d1)', borderRadius: '20px', padding: '28px', color: 'white', marginBottom: '16px', boxShadow: '0 4px 20px rgba(2,119,189,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '72px', fontWeight: '700', lineHeight: 1 }}>{Math.round(weather.current.temperature_2m)}°C</div>
                <div style={{ fontSize: '20px', marginTop: '8px', opacity: 0.9 }}>{getInfo(weather.current.weather_code).icon} {getInfo(weather.current.weather_code).label}</div>
                <div style={{ fontSize: '13px', opacity: 0.7, marginTop: '4px' }}>📍 {location}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { icon: '💧', label: 'Humidity', value: `${weather.current.relative_humidity_2m}%` },
                  { icon: '💨', label: 'Wind', value: `${Math.round(weather.current.wind_speed_10m)} km/h` },
                  { icon: '🌧️', label: 'Precipitation', value: `${weather.current.precipitation} mm` },
                  { icon: '🌡️', label: 'Feels Like', value: `${Math.round(weather.current.temperature_2m)}°C` },
                ].map(s => (
                  <div key={s.label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px' }}>{s.icon}</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', marginTop: '2px' }}>{s.value}</div>
                    <div style={{ fontSize: '10px', opacity: 0.75, marginTop: '2px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {(() => {
            const a = farmingAdvice(weather.current.weather_code, weather.current.precipitation, weather.current.temperature_2m)
            return (
              <div style={{ background: a.bg, border: `1px solid ${a.color}33`, borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '22px' }}>🌾</span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: a.color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>Farming Advice</div>
                  <div style={{ fontSize: '13px', color: a.color }}>{a.msg}</div>
                </div>
              </div>
            )
          })()}

          <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #eeeeee' }}>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#212121', marginBottom: '16px' }}>7-Day Forecast</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
              {weather.daily.time.map((date, i) => {
                const d = new Date(date); const info = getInfo(weather.daily.weather_code[i]); const isToday = i === 0
                return (
                  <div key={date} style={{ textAlign: 'center', padding: '12px 6px', borderRadius: '12px', background: isToday ? '#e3f2fd' : '#fafafa', border: isToday ? '1px solid #90caf9' : '1px solid #f0f0f0' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: isToday ? '#0277bd' : '#9e9e9e', marginBottom: '6px' }}>{isToday ? 'Today' : days[d.getDay()]}</div>
                    <div style={{ fontSize: '22px', marginBottom: '6px' }}>{info.icon}</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#ef5350' }}>{Math.round(weather.daily.temperature_2m_max[i])}°</div>
                    <div style={{ fontSize: '12px', color: '#9e9e9e' }}>{Math.round(weather.daily.temperature_2m_min[i])}°</div>
                    {weather.daily.precipitation_sum[i] > 0 && <div style={{ fontSize: '10px', color: '#0277bd', marginTop: '4px', fontWeight: '600' }}>{weather.daily.precipitation_sum[i]}mm</div>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
//  MARKET PRICES
// ─────────────────────────────────────────────────────────
function MarketPrices() {
  const [search, setSearch]       = useState('')
  const [category, setCategory]   = useState('all')
  const [showForm, setShowForm]   = useState(false)
  const [submitted, setSubmitted] = useState([])
  const [form, setForm] = useState({ crop: '', price: '', unit: 'kg', market: '', county: '' })

  const basePrices = [
    { id: 1,  name: 'Maize (Dry)',       category: 'cereals',    price: 45,   unit: 'kg',    market: 'Wakulima Market',  county: 'Nairobi',     trend: 'up',     change: 5  },
    { id: 2,  name: 'Wheat',             category: 'cereals',    price: 55,   unit: 'kg',    market: 'Eldoret Market',   county: 'Uasin Gishu', trend: 'stable', change: 0  },
    { id: 3,  name: 'Sorghum',           category: 'cereals',    price: 38,   unit: 'kg',    market: 'Kisumu Market',    county: 'Kisumu',      trend: 'down',   change: 3  },
    { id: 4,  name: 'Tomatoes',          category: 'vegetables', price: 80,   unit: 'kg',    market: 'Wakulima Market',  county: 'Nairobi',     trend: 'down',   change: 20 },
    { id: 5,  name: 'Kale (Sukuma)',     category: 'vegetables', price: 15,   unit: 'bunch', market: 'Marikiti Market',  county: 'Nairobi',     trend: 'stable', change: 0  },
    { id: 6,  name: 'Cabbage',           category: 'vegetables', price: 40,   unit: 'head',  market: 'Wakulima Market',  county: 'Nairobi',     trend: 'up',     change: 8  },
    { id: 7,  name: 'Onions',            category: 'vegetables', price: 90,   unit: 'kg',    market: 'Wakulima Market',  county: 'Nairobi',     trend: 'up',     change: 10 },
    { id: 8,  name: 'Capsicum',          category: 'vegetables', price: 150,  unit: 'kg',    market: 'Wakulima Market',  county: 'Nairobi',     trend: 'up',     change: 20 },
    { id: 9,  name: 'Beans (Dry)',       category: 'legumes',    price: 130,  unit: 'kg',    market: 'Wakulima Market',  county: 'Nairobi',     trend: 'up',     change: 10 },
    { id: 10, name: 'Green Grams',       category: 'legumes',    price: 120,  unit: 'kg',    market: 'Kisumu Market',    county: 'Kisumu',      trend: 'stable', change: 0  },
    { id: 11, name: 'Avocado',           category: 'fruits',     price: 15,   unit: 'piece', market: 'Wakulima Market',  county: 'Nairobi',     trend: 'up',     change: 3  },
    { id: 12, name: 'Mango',             category: 'fruits',     price: 10,   unit: 'piece', market: 'Marikiti Market',  county: 'Nairobi',     trend: 'down',   change: 2  },
    { id: 13, name: 'Milk (Fresh)',      category: 'livestock',  price: 55,   unit: 'litre', market: 'Nakuru Market',    county: 'Nakuru',      trend: 'stable', change: 0  },
    { id: 14, name: 'Eggs (Tray)',       category: 'livestock',  price: 380,  unit: 'tray',  market: 'Wakulima Market',  county: 'Nairobi',     trend: 'up',     change: 20 },
    { id: 15, name: 'Chicken (Live)',    category: 'livestock',  price: 700,  unit: 'piece', market: 'Wakulima Market',  county: 'Nairobi',     trend: 'up',     change: 50 },
    { id: 16, name: 'Coffee (Dry)',      category: 'cash',       price: 350,  unit: 'kg',    market: 'Thika Market',     county: 'Kiambu',      trend: 'up',     change: 30 },
    { id: 17, name: 'Tea Leaves',        category: 'cash',       price: 22,   unit: 'kg',    market: 'Nakuru Market',    county: 'Nakuru',      trend: 'stable', change: 0  },
    { id: 18, name: 'Sugarcane',         category: 'cash',       price: 4,    unit: 'kg',    market: 'Kisumu Market',    county: 'Kisumu',      trend: 'down',   change: 1  },
  ]

  const allPrices = [...basePrices, ...submitted]
  const categories = [
    { id: 'all', label: 'All', icon: '🛒' }, { id: 'cereals', label: 'Cereals', icon: '🌽' },
    { id: 'vegetables', label: 'Vegetables', icon: '🥬' }, { id: 'legumes', label: 'Legumes', icon: '🫘' },
    { id: 'fruits', label: 'Fruits', icon: '🍎' }, { id: 'livestock', label: 'Livestock', icon: '🐄' },
    { id: 'cash', label: 'Cash Crops', icon: '☕' },
  ]

  const filtered = allPrices.filter(p => {
    const matchCat    = category === 'all' || p.category === category
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.market.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  function trendIcon(trend, change) {
    if (trend === 'up')   return { icon: '↑', color: '#2e7d32', label: `+${change}` }
    if (trend === 'down') return { icon: '↓', color: '#ef5350', label: `-${change}` }
    return { icon: '→', color: '#9e9e9e', label: 'Stable' }
  }

  function handleSubmit() {
    if (!form.crop.trim() || !form.price || !form.market.trim()) return alert('Crop, price and market are required')
    setSubmitted(prev => [{ id: nid(), name: form.crop, category: 'other', price: parseFloat(form.price), unit: form.unit, market: form.market, county: form.county, trend: 'stable', change: 0, submitted: true }, ...prev])
    setForm({ crop: '', price: '', unit: 'kg', market: '', county: '' })
    setShowForm(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px', color: '#212121' }}>Market Prices</h2>
          <p style={{ fontSize: '13px', color: '#9e9e9e', marginTop: '3px' }}>Current produce prices across Kenyan markets</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{ padding: '10px 18px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>📊 Submit Price</button>
      </div>

      <div style={{ background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '20px' }}>💡</span>
        <div style={{ fontSize: '13px', color: '#2e7d32' }}>Prices are indicative. Submit a price to help fellow farmers get accurate local rates.</div>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #eeeeee', marginBottom: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#212121', marginBottom: '18px' }}>📊 Submit a Market Price</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Crop / Product *</label>
              <input value={form.crop} onChange={e => setForm(f => ({ ...f, crop: e.target.value }))} placeholder="e.g. Tomatoes" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Price (KSh) *</label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="e.g. 80" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Unit</label>
              <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} style={inputStyle}>
                {['kg', 'litre', 'bunch', 'piece', 'tray', 'head'].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Market *</label>
              <input value={form.market} onChange={e => setForm(f => ({ ...f, market: e.target.value }))} placeholder="e.g. Eldoret Market" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>County</label>
              <input value={form.county} onChange={e => setForm(f => ({ ...f, county: e.target.value }))} placeholder="e.g. Uasin Gishu" style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
            <button onClick={handleSubmit} style={{ padding: '10px 20px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Submit Price</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: 'transparent', color: '#616161', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Cancel</button>
          </div>
        </div>
      )}

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search crop, market or county..." style={{ ...inputStyle, fontSize: '14px', padding: '12px 16px', marginBottom: '16px' }} />

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setCategory(cat.id)} style={{ padding: '7px 14px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: 'none', fontFamily: 'Outfit, sans-serif', background: category === cat.id ? '#2e7d32' : '#f5f5f5', color: category === cat.id ? 'white' : '#616161' }}>
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #eeeeee', overflow: 'hidden' }}>
        {filtered.length === 0 ? <div style={{ textAlign: 'center', padding: '48px', color: '#9e9e9e', fontSize: '13px' }}>No prices found</div> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {['Crop / Product', 'Price', 'Unit', 'Market', 'County', 'Trend'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#9e9e9e', textTransform: 'uppercase', borderBottom: '1px solid #eeeeee' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const t = trendIcon(p.trend, p.change)
                return (
                  <tr key={p.id} style={{ background: p.submitted ? '#f9fbe7' : 'white' }}>
                    <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '600', color: '#212121', borderBottom: '1px solid #f5f5f5' }}>
                      {p.name}{p.submitted && <span style={{ fontSize: '10px', background: '#f9fbe7', color: '#827717', padding: '1px 6px', borderRadius: '99px', marginLeft: '6px', fontWeight: '700' }}>Community</span>}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '14px', fontWeight: '700', color: '#2e7d32', borderBottom: '1px solid #f5f5f5' }}>KSh {p.price.toLocaleString()}</td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', color: '#616161', borderBottom: '1px solid #f5f5f5' }}>per {p.unit}</td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', color: '#616161', borderBottom: '1px solid #f5f5f5' }}>{p.market}</td>
                    <td style={{ padding: '12px 14px', borderBottom: '1px solid #f5f5f5' }}><span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '99px', background: '#f3e5f5', color: '#7b1fa2' }}>{p.county}</span></td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: t.color, borderBottom: '1px solid #f5f5f5' }}>{t.icon} {t.label}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
//  SHAMBA BOT
// ─────────────────────────────────────────────────────────
function ShambaBot({ crops, tasks, livestock, sales, expenses, userName }) {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: `Habari ${userName}! 👋 Mimi ni Shamba Bot, msaidizi wako wa kilimo akili bandia.\n\nHello ${userName}! I'm Shamba Bot — a real AI farming assistant that knows your farm. Ask me anything about crops, livestock, pests, markets or farm planning! 🌱`
    }
  ])
  const [input, setInput]   = useState('')
  const [typing, setTyping] = useState(false)
  const chatRef             = useRef(null)

  const chips = [
    '🌿 Best fertiliser for maize?',
    '🐛 My tomatoes have brown spots',
    '🐄 Why is milk production dropping?',
    '💰 When should I sell my maize?',
    '🌧️ How do I interpret the weather?',
    '📋 How do I apply for AFC loan?',
  ]

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  function buildContext() {
    const activeCrops   = crops.filter(c => c.stage !== 'harvested')
    const pendingTasks  = tasks.filter(t => !t.done)
    const totalRevenue  = sales.reduce((sum, s) => sum + s.total, 0)
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
    return `FARMER: ${userName}
ACTIVE CROPS: ${activeCrops.length === 0 ? 'None yet' : activeCrops.map(c => `${c.name} (${c.stage}, ${c.acres} acres)`).join(', ')}
LIVESTOCK: ${livestock.length === 0 ? 'None yet' : livestock.map(l => `${l.name} - ${l.count} ${l.type}`).join(', ')}
PENDING TASKS: ${pendingTasks.length === 0 ? 'None' : pendingTasks.map(t => t.title).join(', ')}
REVENUE: KSh ${totalRevenue.toLocaleString()}
EXPENSES: KSh ${totalExpenses.toLocaleString()}
NET PROFIT: KSh ${(totalRevenue - totalExpenses).toLocaleString()}`
  }

  async function send(msgText) {
    const text = (msgText || input).trim()
    if (!text || typing) return
    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')
    setTyping(true)

    try {
      const history = messages.slice(1).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }))
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: `You are Shamba Bot, an expert AI farming assistant for AgriMateKE — a smart farming app for Kenyan farmers. You are warm, practical, and deeply knowledgeable about Kenyan agriculture.

PERSONALITY:
- Friendly and encouraging like a trusted agricultural officer
- Use simple language farmers understand
- Naturally mix in Swahili words (shamba, mazao, mifugo, bei)
- Give specific actionable advice — never vague
- Always relate advice to Kenyan context
- Use bullet points and emojis to make responses easy to read

EXPERTISE: Crops, livestock, soil health, fertilisers, pest control, market prices, weather interpretation, Kenya government programs (KALRO, AFA, AFC loans)

CURRENT FARMER DATA:
${buildContext()}

RULES:
- Always reference this farmer's actual data when relevant
- If asked in Swahili respond in Swahili, if English respond in English
- Never invent specific prices — refer them to the Market Prices section
- Always end with one practical tip or follow-up question`,
          messages: [...history, { role: 'user', content: text }]
        })
      })

      const data  = await res.json()
      const reply = data.content?.[0]?.text
      if (!reply) throw new Error('Empty response')
      setMessages(prev => [...prev, { role: 'bot', text: reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: `⚠️ Debug: ${err.message}` }])
    } finally {
      setTyping(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 106px)', background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #eeeeee' }}>
      <div style={{ background: 'linear-gradient(135deg, #1b5e20, #2e7d32)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🤖</div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>🌾 Shamba Bot</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>Powered by Claude AI · Knows your farm</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4caf50' }} />
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Online</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#f9fafb', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', maxWidth: '80%' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: msg.role === 'bot' ? '#e8f5e9' : '#2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
              {msg.role === 'bot' ? '🤖' : '👤'}
            </div>
            <div style={{ padding: '10px 14px', borderRadius: '18px', fontSize: '13px', lineHeight: 1.6, background: msg.role === 'bot' ? 'white' : '#2e7d32', color: msg.role === 'bot' ? '#212121' : 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderBottomLeftRadius: msg.role === 'bot' ? '4px' : '18px', borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px', whiteSpace: 'pre-line' }}>
              {msg.text}
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', alignSelf: 'flex-start' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🤖</div>
            <div style={{ padding: '12px 16px', background: 'white', borderRadius: '18px', borderBottomLeftRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', gap: '4px', alignItems: 'center' }}>
              {[0, 1, 2].map(j => <div key={j} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9e9e9e', animation: 'blink 1.2s ease infinite', animationDelay: `${j * 0.2}s` }} />)}
            </div>
          </div>
        )}
        <div ref={chatRef} />
      </div>

      <div style={{ padding: '8px 16px', background: 'white', borderTop: '1px solid #eeeeee', display: 'flex', gap: '6px', overflowX: 'auto', flexShrink: 0 }}>
        {chips.map(chip => (
          <button key={chip} onClick={() => send(chip)} style={{ background: '#f1f8f1', color: '#2e7d32', border: '1px solid #a5d6a7', borderRadius: '99px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Outfit, sans-serif', flexShrink: 0 }}>{chip}</button>
        ))}
      </div>

      <div style={{ padding: '12px 16px', background: 'white', borderTop: '1px solid #eeeeee', display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask Shamba Bot anything about your farm..." style={{ flex: 1, background: '#f5f5f5', border: '1.5px solid transparent', borderRadius: '99px', padding: '10px 16px', fontFamily: 'Outfit, sans-serif', fontSize: '14px', outline: 'none' }} />
        <button onClick={() => send()} disabled={!input.trim() || typing} style={{ width: '40px', height: '40px', borderRadius: '50%', background: !input.trim() || typing ? '#e0e0e0' : '#2e7d32', border: 'none', color: 'white', fontSize: '16px', cursor: !input.trim() || typing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>➤</button>
      </div>

      <style>{`@keyframes blink { 0%, 80%, 100% { opacity: 0.25 } 40% { opacity: 1 } }`}</style>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
//  VET DIRECTORY
// ─────────────────────────────────────────────────────────
function VetDirectory({ user, profile }) {
  const [vets,        setVets]        = useState([])
  const [search,      setSearch]      = useState('')
  const [county,      setCounty]      = useState('all')
  const [showForm,    setShowForm]    = useState(false)
  const [loading,     setLoading]     = useState(true)
  const [submitting,  setSubmitting]  = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', county: '', speciality: '',
    location: '', kvb_number: '', available: true
  })

  useEffect(() => { fetchVets() }, [])

  async function fetchVets() {
    try {
      const { data, error } = await supabase
        .from('vets')
        .select('*')
        .eq('verified', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setVets(data || [])
    } catch (err) {
      console.error('Error fetching vets:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.phone.trim() || !form.county.trim()) {
      return alert('Name, phone and county are required')
    }
    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('vets')
        .insert({
          name:         form.name,
          phone:        form.phone,
          county:       form.county,
          speciality:   form.speciality,
          location:     form.location,
          kvb_number:   form.kvb_number,
          available:    form.available,
          verified:     false,
          submitted_by: user.id,
        })

      if (error) throw error
      alert('✅ Vet submitted successfully! It will appear after admin verification.')
      setForm({ name: '', phone: '', county: '', speciality: '', location: '', kvb_number: '', available: true })
      setShowForm(false)
    } catch (err) {
      alert('Failed to submit: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const counties = ['all', 'Baringo','Bomet','Bungoma','Busia','Elgeyo Marakwet',
    'Embu','Garissa','Homa Bay','Isiolo','Kajiado','Kakamega','Kericho','Kiambu',
    'Kilifi','Kirinyaga','Kisii','Kisumu','Kitui','Kwale','Laikipia','Lamu',
    'Machakos','Makueni','Mandera','Marsabit','Meru','Migori','Mombasa',
    "Murang'a",'Nairobi','Nakuru','Nandi','Narok','Nyamira','Nyandarua','Nyeri',
    'Samburu','Siaya','Taita Taveta','Tana River','Tharaka Nithi','Trans Nzoia',
    'Turkana','Uasin Gishu','Vihiga','Wajir','West Pokot']

  const filtered = vets.filter(v => {
    const matchCounty = county === 'all' || v.county === county
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
                        (v.speciality || '').toLowerCase().includes(search.toLowerCase()) ||
                        (v.location   || '').toLowerCase().includes(search.toLowerCase())
    return matchCounty && matchSearch
  })

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px', color: '#212121' }}>Vet Directory</h2>
          <p style={{ fontSize: '13px', color: '#9e9e9e', marginTop: '3px' }}>
            {loading ? 'Loading...' : `${vets.length} verified veterinarian${vets.length !== 1 ? 's' : ''} across Kenya`}
          </p>
        </div>
        <button onClick={() => setShowForm(true)} style={{
          padding: '10px 18px', background: '#2e7d32', color: 'white',
          border: 'none', borderRadius: '8px', fontSize: '14px',
          fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
        }}>🏥 Add Vet</button>
      </div>

      {/* Info Banner */}
      <div style={{ background: '#e3f2fd', border: '1px solid #90caf9', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '20px' }}>✅</span>
        <div style={{ fontSize: '13px', color: '#0277bd' }}>
          All vets are verified by the AgriMateKE admin team. Know a vet not listed? Submit them for verification.
        </div>
      </div>

      {/* Submit Form */}
      {showForm && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #eeeeee', marginBottom: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#212121', marginBottom: '18px' }}>🏥 Submit a Veterinarian</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Full Name *',       key: 'name',       placeholder: 'e.g. Dr. Jane Doe' },
              { label: 'Phone Number *',    key: 'phone',      placeholder: 'e.g. 0712 345 678' },
              { label: 'County *',          key: 'county',     placeholder: 'e.g. Nakuru' },
              { label: 'Speciality',        key: 'speciality', placeholder: 'e.g. Dairy Cattle' },
              { label: 'Location / Town',   key: 'location',   placeholder: 'e.g. Nakuru Town' },
              { label: 'KVB Reg Number',    key: 'kvb_number', placeholder: 'e.g. KVB/2024/1234' },
            ].map(f => (
              <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>{f.label}</label>
                <input
                  value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
            <button onClick={handleSubmit} disabled={submitting} style={{
              padding: '10px 20px', background: submitting ? '#a5d6a7' : '#2e7d32',
              color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px',
              fontWeight: '600', cursor: submitting ? 'not-allowed' : 'pointer',
              fontFamily: 'Outfit, sans-serif'
            }}>
              {submitting ? '⏳ Submitting...' : 'Submit for Verification'}
            </button>
            <button onClick={() => setShowForm(false)} style={{
              padding: '10px 20px', background: 'transparent', color: '#616161',
              border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px',
              cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search by name, speciality or location..."
          style={{ ...inputStyle, flex: 1, minWidth: '200px', padding: '12px 16px' }}
        />
        <select
          value={county}
          onChange={e => setCounty(e.target.value)}
          style={{ ...inputStyle, width: 'auto', minWidth: '160px' }}>
          {counties.map(c => (
            <option key={c} value={c}>{c === 'all' ? 'All Counties' : c}</option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '48px', textAlign: 'center', border: '1px solid #eeeeee' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔄</div>
          <div style={{ fontSize: '14px', color: '#9e9e9e' }}>Loading verified vets...</div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '48px', textAlign: 'center', border: '1px solid #eeeeee' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏥</div>
          <div style={{ fontSize: '15px', color: '#9e9e9e' }}>
            {vets.length === 0 ? 'No verified vets yet — be the first to submit one!' : 'No vets found for that search'}
          </div>
        </div>
      )}

      {/* Vet Cards */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
          {filtered.map(vet => (
            <div key={vet.id} style={{ background: 'white', borderRadius: '14px', padding: '18px', border: '1px solid #eeeeee', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #1b5e20, #2e7d32)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🩺</div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#212121' }}>{vet.name}</div>
                    <div style={{ fontSize: '12px', color: '#9e9e9e', marginTop: '2px' }}>{vet.speciality || 'General Veterinarian'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '99px', background: vet.available ? '#e8f5e9' : '#ffebee', color: vet.available ? '#2e7d32' : '#ef5350' }}>
                    {vet.available ? 'Available' : 'Unavailable'}
                  </span>
                  {vet.kvb_number && (
                    <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '99px', background: '#e3f2fd', color: '#0277bd' }}>
                      ✅ KVB Verified
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                <div style={{ fontSize: '13px', color: '#616161' }}>📍 {vet.location ? `${vet.location}, ` : ''}{vet.county}</div>
                <div style={{ fontSize: '13px', color: '#616161' }}>📞 {vet.phone}</div>
                {vet.kvb_number && <div style={{ fontSize: '12px', color: '#9e9e9e' }}>KVB: {vet.kvb_number}</div>}
              </div>
              <a href={`tel:${vet.phone.replace(/\s/g, '')}`} style={{
                display: 'block', marginTop: '12px', padding: '9px',
                background: vet.available ? '#2e7d32' : '#e0e0e0',
                color: 'white', borderRadius: '8px', textAlign: 'center',
                textDecoration: 'none', fontSize: '13px', fontWeight: '600',
                fontFamily: 'Outfit, sans-serif'
              }}>
                {vet.available ? '📞 Call Now' : '📞 Try Anyway'}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
//  GOVT GRANTS
// ─────────────────────────────────────────────────────────
function GovtGrants() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const grants = [
    { id: 1, title: 'AFC Agricultural Loan', org: 'Agricultural Finance Corporation', category: 'loan', amount: 'Up to KSh 5,000,000', deadline: 'Rolling', desc: 'Low-interest loans for farmers to buy inputs, equipment, land development and agri-business expansion.', link: 'https://www.afc.co.ke', eligibility: 'Registered farmers, cooperatives, agribusinesses', status: 'open' },
    { id: 2, title: 'KALRO Research Grants', org: 'Kenya Agricultural & Livestock Research Org', category: 'grant', amount: 'Varies', deadline: 'Annual', desc: 'Research partnerships and technology transfer grants for innovative farming solutions.', link: 'https://www.kalro.org', eligibility: 'Research institutions, farmer groups', status: 'open' },
    { id: 3, title: 'e-Voucher Subsidy Program', org: 'Ministry of Agriculture', category: 'subsidy', amount: 'KSh 5,000 subsidy', deadline: 'Seasonal', desc: 'Government subsidy on certified seeds, fertilisers and other farm inputs via digital vouchers.', link: 'https://www.agriculture.go.ke', eligibility: 'Smallholder farmers with at least 0.5 acres', status: 'open' },
    { id: 4, title: 'Youth in Agribusiness Fund', org: 'Ministry of Youth Affairs', category: 'grant', amount: 'Up to KSh 500,000', deadline: 'December 2025', desc: 'Grants for young entrepreneurs starting agribusiness ventures including processing, marketing and production.', link: 'https://www.youth.go.ke', eligibility: 'Youth aged 18-35 with agribusiness plan', status: 'open' },
    { id: 5, title: 'Women Enterprise Fund - Agri', org: 'Women Enterprise Fund', category: 'loan', amount: 'Up to KSh 500,000', deadline: 'Rolling', desc: 'Low-interest loans specifically for women farmers and agribusiness entrepreneurs.', link: 'https://www.wef.co.ke', eligibility: 'Women farmers and agribusiness owners', status: 'open' },
    { id: 6, title: 'USAID Kenya Crops & Dairy', org: 'USAID / Kenya Market Systems', category: 'grant', amount: 'Varies by project', deadline: 'Rolling', desc: 'Technical assistance and grants for improving crop production, dairy value chains and market linkages.', link: 'https://www.usaid.gov/kenya', eligibility: 'Cooperatives, farmer groups, agribusinesses', status: 'open' },
    { id: 7, title: 'Greenhouse Horticulture Grant', org: 'Horticultural Crops Directorate', category: 'subsidy', amount: '50% subsidy on greenhouse', deadline: 'March 2026', desc: 'Subsidised greenhouses for horticultural farmers to boost year-round vegetable production.', link: 'https://www.hcd.go.ke', eligibility: 'Registered horticultural farmers', status: 'open' },
    { id: 8, title: 'Livestock Insurance Subsidy', org: 'APA Insurance / State Dept Livestock', category: 'subsidy', amount: '50% premium subsidy', deadline: 'Rolling', desc: 'Government-subsidised insurance for cattle, goats, sheep and camels against drought and disease.', link: 'https://www.kilimo.go.ke', eligibility: 'Livestock farmers in ASAL areas', status: 'open' },
    { id: 9, title: 'IFC Agri-Finance Program', org: 'International Finance Corporation', category: 'loan', amount: 'USD 10,000 - 500,000', deadline: 'Rolling', desc: 'Blended finance and loans for agribusinesses looking to scale operations and access international markets.', link: 'https://www.ifc.org', eligibility: 'Established agribusinesses with 2+ years trading', status: 'open' },
    { id: 10, title: 'Drip Irrigation Subsidy', org: 'National Irrigation Authority', category: 'subsidy', amount: '40% subsidy on drip kits', deadline: 'June 2026', desc: 'Subsidised drip irrigation kits for smallholder farmers to improve water efficiency and crop yields.', link: 'https://www.irrigation.go.ke', eligibility: 'Smallholder farmers, irrigated agriculture', status: 'open' },
  ]

  const categories = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'grant', label: 'Grants', icon: '🎁' },
    { id: 'loan', label: 'Loans', icon: '💰' },
    { id: 'subsidy', label: 'Subsidies', icon: '🏷️' },
  ]

  const catColor = { grant: { bg: '#e8f5e9', color: '#2e7d32' }, loan: { bg: '#e3f2fd', color: '#0277bd' }, subsidy: { bg: '#fff8e1', color: '#f57f17' } }

  const filtered = grants.filter(g => {
    const matchCat    = filter === 'all' || g.category === filter
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase()) ||
                        g.org.toLowerCase().includes(search.toLowerCase()) ||
                        g.desc.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px', color: '#212121' }}>Govt Grants & Programs</h2>
          <p style={{ fontSize: '13px', color: '#9e9e9e', marginTop: '3px' }}>Available funding for Kenyan farmers</p>
        </div>
      </div>

      <div style={{ background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '20px' }}>💡</span>
        <div style={{ fontSize: '13px', color: '#2e7d32' }}>Always verify program status directly with the organisation before applying. Ask Shamba Bot for help with applications!</div>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search grants, loans and subsidies..." style={{ ...inputStyle, fontSize: '14px', padding: '12px 16px', marginBottom: '16px' }} />

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setFilter(cat.id)} style={{ padding: '7px 14px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: 'none', fontFamily: 'Outfit, sans-serif', background: filter === cat.id ? '#2e7d32' : '#f5f5f5', color: filter === cat.id ? 'white' : '#616161' }}>
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '14px' }}>
        {filtered.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '48px', textAlign: 'center', border: '1px solid #eeeeee', gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
            <div style={{ fontSize: '15px', color: '#9e9e9e' }}>No programs found for that search</div>
          </div>
        ) : filtered.map(grant => (
          <div key={grant.id} style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #eeeeee', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#212121', marginBottom: '4px' }}>{grant.title}</div>
                <div style={{ fontSize: '12px', color: '#9e9e9e' }}>{grant.org}</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '99px', background: catColor[grant.category]?.bg, color: catColor[grant.category]?.color, whiteSpace: 'nowrap' }}>
                {grant.category.charAt(0).toUpperCase() + grant.category.slice(1)}
              </span>
            </div>

            <div style={{ fontSize: '13px', color: '#616161', lineHeight: 1.6 }}>{grant.desc}</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '10px' }}>
                <div style={{ fontSize: '10px', color: '#9e9e9e', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Amount</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#2e7d32', marginTop: '3px' }}>{grant.amount}</div>
              </div>
              <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '10px' }}>
                <div style={{ fontSize: '10px', color: '#9e9e9e', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Deadline</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#212121', marginTop: '3px' }}>{grant.deadline}</div>
              </div>
            </div>

            <div style={{ background: '#f5f5f5', borderRadius: '8px', padding: '10px' }}>
              <div style={{ fontSize: '10px', color: '#9e9e9e', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '3px' }}>Eligibility</div>
              <div style={{ fontSize: '12px', color: '#616161' }}>{grant.eligibility}</div>
            </div>

            <a href={grant.link} target="_blank" rel="noreferrer" style={{ display: 'block', padding: '10px', background: '#2e7d32', color: 'white', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontSize: '13px', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>
              🔗 Apply / Learn More
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
//  SETTINGS
// ─────────────────────────────────────────────────────────
function Settings({ userName, setUserName, profile, onSignOut,updateProfile }) {
  const [form, setForm] = useState({ 
    name: profile?.full_name || userName || '', 
    farmName: profile?.farm_name || '', 
    county: profile?.county || '', 
    phone: profile?.phone || '', 
    language: 'english' })
  const [saved, setSaved] = useState(false)

  async function handleSave() {
  if (!form.name.trim()) return alert('Name is required')
  try {
    await updateProfile({
      full_name: form.name,
      farm_name: form.farmName,
      county:    form.county,
      phone:     form.phone,
    })
    setUserName(form.name)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  } catch (err) {
    alert('Failed to save: ' + err.message)
  }
}
    
    
const counties = ['Baringo','Bomet','Bungoma','Busia','Elgeyo Marakwet','Embu','Garissa','Homa Bay','Isiolo','Kajiado','Kakamega','Kericho','Kiambu','Kilifi','Kirinyaga','Kisii','Kisumu','Kitui','Kwale','Laikipia','Lamu','Machakos','Makueni','Mandera','Marsabit','Meru','Migori','Mombasa','Murang\'a','Nairobi','Nakuru','Nandi','Narok','Nyamira','Nyandarua','Nyeri','Samburu','Siaya','Taita Taveta','Tana River','Tharaka Nithi','Trans Nzoia','Turkana','Uasin Gishu','Vihiga','Wajir','West Pokot']

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px', color: '#212121' }}>Settings</h2>
        <p style={{ fontSize: '13px', color: '#9e9e9e', marginTop: '3px' }}>Manage your profile and preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>

        {/* Profile */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #eeeeee' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#212121', marginBottom: '18px' }}>👤 Your Profile</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Full Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Farm Name</label>
              <input value={form.farmName} onChange={e => setForm(f => ({ ...f, farmName: e.target.value }))} placeholder="e.g. Morgin Farms" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>County</label>
              <select value={form.county} onChange={e => setForm(f => ({ ...f, county: e.target.value }))} style={inputStyle}>
                <option value="">Select county...</option>
                {counties.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Phone Number</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="e.g. 0712 345 678" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#616161' }}>Language</label>
              <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} style={inputStyle}>
                <option value="english">English</option>
                <option value="swahili">Kiswahili (Coming Soon)</option>
              </select>
            </div>
            <button onClick={handleSave} style={{
              padding: '12px', background: '#2e7d32', color: 'white',
              border: 'none', borderRadius: '8px', fontSize: '14px',
              fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
              width: '100%'
              }}>
              {saved ? '✅ Saved!' : 'Save Changes'}
            </button>

            <button onClick={onSignOut} style={{
              width: '100%', padding: '12px', marginTop: '8px',
              background: '#FFEBEE', color: '#C62828',
              border: '1px solid #FFCDD2', borderRadius: '8px',
              fontSize: '14px', fontWeight: '600',
              cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
            }}>
              🚪 Sign Out
            </button>
          </div>
        </div>

        {/* Plan */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #eeeeee' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#212121', marginBottom: '18px' }}>⭐ Your Plan</div>
          <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px', marginBottom: '16px', border: '2px solid #e0e0e0' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#212121', marginBottom: '4px' }}>Free Plan</div>
            <div style={{ fontSize: '12px', color: '#9e9e9e', marginBottom: '12px' }}>Current plan</div>
            {['Dashboard & Analytics', 'Crop Tracking', 'Livestock Management', 'Sales & Expenses', 'Tasks', 'Weather', 'Market Prices'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', fontSize: '13px', color: '#424242' }}>
                <span style={{ color: '#2e7d32' }}>✓</span> {f}
              </div>
            ))}
          </div>

          <div style={{ background: 'linear-gradient(135deg, #f57f17, #ff8f00)', borderRadius: '12px', padding: '16px', color: 'white' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>⭐ Pro Plan — KSh 500/mo</div>
            <div style={{ fontSize: '12px', opacity: 0.85, marginBottom: '12px' }}>Everything in Free, plus:</div>
            {['Unlimited Shamba Bot AI', 'Advanced Analytics', 'Export Reports (PDF/Excel)', 'Priority Support', 'Multi-Farm Management', 'SMS Alerts'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', fontSize: '13px' }}>
                <span>✓</span> {f}
              </div>
            ))}
            <button style={{ marginTop: '14px', width: '100%', padding: '10px', background: 'white', color: '#f57f17', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
              Upgrade via M-Pesa
            </button>
          </div>
        </div>

        {/* About */}
        <div style={{ background: 'linear-gradient(135deg, #1b5e20, #2e7d32)', borderRadius: '16px', padding: '24px', color: 'white' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🌱</div>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '22px', marginBottom: '8px' }}>AgriMateKE</div>
          <div style={{ fontSize: '13px', opacity: 0.8, lineHeight: 1.6, marginBottom: '16px' }}>
            Smart farming companion for Kenyan farmers. Built to help you track, plan, and grow your farm business.
          </div>
          <div style={{ fontSize: '12px', opacity: 0.6 }}>Version 2.0 · Phase 2</div>
          <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '4px' }}>Built with ❤️ for Kenyan farmers</div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
//  ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────
function AdminDashboard({ user }) {
  const [pending,     setPending]     = useState([])
  const [loading,     setLoading]     = useState(true)
  const [processing,  setProcessing]  = useState(null)

  useEffect(() => { fetchPending() }, [])

  async function fetchPending() {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    

    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'fetch_pending',
        token:  session.access_token
      })
    })

    const result = await res.json()
    
    

    if (!res.ok) throw new Error(result.error)
    setPending(result.vets || [])
  } catch (err) {
    console.error('Error fetching pending vets:', err)
  } finally {
    setLoading(false)
  }
}

  async function handleAction(vetId, action) {
    setProcessing(vetId)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          vetId,
          token: session.access_token
        })
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error)

      alert(`✅ Vet ${action === 'approve' ? 'approved' : 'rejected'} successfully!`)
      setPending(prev => prev.filter(v => v.id !== vetId))
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px', color: '#212121' }}>
          🔐 Admin Dashboard
        </h2>
        <p style={{ fontSize: '13px', color: '#9e9e9e', marginTop: '3px' }}>
          Manage vet verification — only visible to admins
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', border: '1px solid #eeeeee', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>⏳</div>
          <div style={{ fontSize: '11px', color: '#9e9e9e', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>Pending Verification</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#f57f17', marginTop: '4px' }}>{pending.length}</div>
        </div>
      </div>

      {/* Pending Vets */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #eeeeee' }}>
        <div style={{ fontSize: '15px', fontWeight: '600', color: '#212121', marginBottom: '16px' }}>
          Pending Vet Submissions
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '32px', color: '#9e9e9e' }}>Loading...</div>}

        {!loading && pending.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px', color: '#9e9e9e' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎉</div>
            <div>No pending submissions — all caught up!</div>
          </div>
        )}

        {!loading && pending.map(vet => (
          <div key={vet.id} style={{
            border: '1px solid #eeeeee', borderRadius: '12px',
            padding: '16px', marginBottom: '12px',
            background: '#fafafa'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#212121' }}>{vet.name}</div>
                <div style={{ fontSize: '12px', color: '#9e9e9e', marginTop: '2px' }}>{vet.speciality || 'No speciality listed'}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                  <div style={{ fontSize: '13px', color: '#616161' }}>📍 {vet.location ? `${vet.location}, ` : ''}{vet.county}</div>
                  <div style={{ fontSize: '13px', color: '#616161' }}>📞 {vet.phone}</div>
                  {vet.kvb_number && <div style={{ fontSize: '13px', color: '#0277bd' }}>🪪 KVB: {vet.kvb_number}</div>}
                  <div style={{ fontSize: '11px', color: '#bdbdbd' }}>Submitted: {new Date(vet.created_at).toLocaleDateString()}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleAction(vet.id, 'approve')}
                  disabled={processing === vet.id}
                  style={{
                    padding: '8px 16px', background: '#2e7d32', color: 'white',
                    border: 'none', borderRadius: '8px', fontSize: '13px',
                    fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
                  }}>
                  {processing === vet.id ? '⏳' : '✅ Approve'}
                </button>
                <button
                  onClick={() => handleAction(vet.id, 'reject')}
                  disabled={processing === vet.id}
                  style={{
                    padding: '8px 16px', background: '#ffebee', color: '#c62828',
                    border: '1px solid #ffcdd2', borderRadius: '8px', fontSize: '13px',
                    fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
                  }}>
                  {processing === vet.id ? '⏳' : '❌ Reject'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
//  APP
// ─────────────────────────────────────────────────────────
function App() {
  const { user, profile, loading, signOut, updateProfile } = useAuth()
  const [authPage, setAuthPage] = useState('landing')
  const [page, setPage]         = useState('dashboard')
  const isMobile = useIsMobile() 
  const {crops,addCrop, updateCropStage, deleteCrop, loading: cropsLoading}    = useCrops(user?.id)
  const {tasks, addTask, toggleTask, deleteTask, loading: tasksLoading}     = useTasks(user?.id)
  const {sales, expenses, addSale, deleteSale, addExpense, deleteExpense, loading: salesLoading}     = useSales(user?.id)
  const {livestock, addLivestock, addRecord, deleteLivestock, loading: livestockLoading} = useLivestock(user?.id)

  // Loading screen
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: '16px'
      }}>
        <div style={{ fontSize: '56px' }}>🌱</div>
        <div style={{ fontSize: '18px', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
          Loading AgriMateKE...
        </div>
      </div>
    )
  }
  // Logged in but email not verified
if (user && !user.email_confirmed_at) {
  return (
    <VerifyEmailPage
      email={user.email}
      onSignOut={async () => { await signOut() }}
    />
  )
}

//Logged in, verified but profile not complete
if (user && user.email_confirmed_at && profile !== null && !profile?.county) {
  return <ProfileSetupPage/>
}

  // Not logged in — show auth pages
  if (!user) {
    if (authPage === 'landing') {
      return (
        <LandingPage 
        onGetStarted={() => setAuthPage('signup')}
        onLogin={() => setAuthPage('login')}
        />
      )
    }
    if (authPage === 'login') {
      return <LoginPage onNavigateToSignup={() => setAuthPage('signup')} onNavigateToLanding={() => setAuthPage('landing')} />
    }
    return <SignupPage onNavigateToLogin={() => setAuthPage('login')} />
  }
// Logged in — show main app
  const userName = profile?.full_name || user.email?.split('@')[0] || 'Farmer'


  function renderPage() {
    const wrap = (component) => (
      <ErrorBoundary key={page}>
        {component}
      </ErrorBoundary>
    )
    switch (page) {
      case 'dashboard': return wrap (<Dashboard crops={crops} tasks={tasks} sales={sales} expenses={expenses} userName={userName} onNavigate={setPage} loading={cropsLoading || tasksLoading || salesLoading || livestockLoading } />)
      case 'crops':     return wrap (
        <Crops 
        crops={crops} 
        setCrops={(fn) => {}}
        addCrop={addCrop}
        updateCropStage={updateCropStage}
        deleteCrop={deleteCrop}
        loading={cropsLoading}
        />
      )
      case 'livestock': return wrap(
        <Livestock 
        livestock={livestock} 
        setLivestock={(fn) => {}}
        addLivestock={addLivestock}
        addRecord={addRecord}
        deleteLivestock={deleteLivestock}
        loading={livestockLoading}
        />
      )
      case 'sales':  return wrap(
        <Sales 
        sales={sales} 
        expenses={expenses}
        setSales={(fn) => {}} 
        setExpenses={(fn) => {}}
        addSale={addSale}
        deleteSale={deleteSale}
        addExpense={addExpense}
        deleteExpense={deleteExpense}
        loading={salesLoading}
        />
      )
      case 'tasks':  return wrap(
        <Tasks 
        tasks={tasks} 
        setTasks={(fn) => {}}
        addTask={addTask}
        toggleTask={toggleTask}
        deleteTask={deleteTask}
        loading={tasksLoading}
        />
      )
      case 'admin':     return wrap (<AdminDashboard user={user} />)
      case 'weather':   return wrap (<Weather />)
      case 'market':    return wrap (<MarketPrices />)
      case 'shamba':    return wrap (<ShambaBot crops={crops} tasks={tasks} livestock={livestock} sales={sales} expenses={expenses} userName={userName} />)
      case 'vets':      return wrap (<VetDirectory user={user} profile={profile} />)
      case 'grants':    return wrap (<GovtGrants />)
      case 'settings':  return wrap (

     <Settings
  userName={userName}
  setUserName={() => {}}
  profile={profile}
  onSignOut={async () => { await signOut() }}
  updateProfile={updateProfile}
/>
);
 default:return wrap(<ComingSoon page={page} />);
    }
  }

 return (
  <div style={{ display: 'flex' }}>
    <Sidebar activePage={page} onNavigate={setPage} userName={userName} profile={profile} />
    <div style={{
      marginLeft: isMobile ? '0' : '240px',
      flex: 1,
      minHeight: '100vh',
      background: '#f9fafb',
      paddingBottom: isMobile ? '70px' : '0'
    }}>
      <Topbar page={page} isMobile={isMobile} />
      <main style={{ padding: isMobile ? '16px' : '24px', marginTop: isMobile ? '56px' : '58px' }}>
        {renderPage()}
      </main>
    </div>
  </div>
)

}

export default App 
