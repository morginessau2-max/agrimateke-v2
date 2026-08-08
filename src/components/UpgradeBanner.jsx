import { usePlan } from '../hooks/usePlan'

export default function UpgradeBanner({ message, onUpgrade }) {
  const { isFree } = usePlan()
  if (!isFree) return null

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fff8e1, #fff3e0)',
      border: '1.5px solid #FFE082',
      borderRadius: '12px', padding: '14px 18px',
      marginBottom: '16px',
      display: 'flex', alignItems: 'center',
      gap: '12px', flexWrap: 'wrap'
    }}>
      <span style={{ fontSize: '22px' }}>⭐</span>
      <div style={{ flex: 1, minWidth: '200px' }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#E65100', marginBottom: '2px' }}>
          Upgrade to Pro
        </div>
        <div style={{ fontSize: '12px', color: '#F57F17' }}>
          {message || 'Unlock all features for KSh 500/month'}
        </div>
      </div>
      <button
        onClick={onUpgrade}
        style={{
          padding: '8px 16px',
          background: 'linear-gradient(135deg, #f57f17, #ff8f00)',
          color: 'white', border: 'none', borderRadius: '8px',
          fontSize: '13px', fontWeight: '700',
          cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
          whiteSpace: 'nowrap'
        }}>
        Upgrade — KSh 500/mo
      </button>
    </div>
  )
}