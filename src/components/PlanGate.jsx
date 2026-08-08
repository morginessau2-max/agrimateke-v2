import { usePlan } from '../hooks/usePlan'

export default function PlanGate({ feature, children, fallback }) {
  const { features, plan } = usePlan()

  if (features[feature]) return children

  if (fallback) return fallback

  return (
    <div style={{
      background: 'white', borderRadius: '16px',
      padding: '48px 32px', textAlign: 'center',
      border: '1.5px solid #FFE082',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
      <div style={{
        fontSize: '18px', fontWeight: '700',
        color: '#212121', marginBottom: '8px',
        fontFamily: 'Cambria, serif'
      }}>
        Pro Feature
      </div>
      <div style={{
        fontSize: '13px', color: '#9E9E9E',
        marginBottom: '24px', lineHeight: 1.7,
        maxWidth: '340px', margin: '0 auto 24px'
      }}>
        This feature is available on the Pro plan.
        Upgrade for KSh 500/month and unlock everything.
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => window.location.href = '#settings'}
          style={{
            padding: '11px 24px', background: 'linear-gradient(135deg, #f57f17, #ff8f00)',
            color: 'white', border: 'none', borderRadius: '8px',
            fontSize: '14px', fontWeight: '700',
            cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
          }}>
          ⭐ Upgrade to Pro
        </button>
      </div>
      <div style={{ fontSize: '11px', color: '#BDBDBD', marginTop: '16px' }}>
        Current plan: {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </div>
    </div>
  )
}