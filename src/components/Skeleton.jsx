export function SkeletonBox({ width = '100%', height = '20px', radius = '6px', style = {} }) {
  return (
    <div style={{
      width, height,
      borderRadius: radius,
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      ...style
    }} />
  )
}

export function SkeletonCard() {
  return (
    <div style={{
      background: 'white', borderRadius: '12px',
      padding: '16px 20px', border: '1px solid #e0e0e0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
    }}>
      <SkeletonBox width="32px" height="32px" radius="50%" style={{ marginBottom: '12px' }} />
      <SkeletonBox width="60%" height="12px" style={{ marginBottom: '8px' }} />
      <SkeletonBox width="80%" height="28px" style={{ marginBottom: '6px' }} />
      <SkeletonBox width="50%" height="10px" />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      gap: '12px', padding: '12px 0',
      borderBottom: '1px solid #f5f5f5'
    }}>
      <SkeletonBox width="8px" height="8px" radius="50%" style={{ flexShrink: 0 }} />
      <SkeletonBox width="60%" height="13px" />
      <SkeletonBox width="15%" height="13px" style={{ marginLeft: 'auto' }} />
    </div>
  )
}

export function SkeletonItemCard() {
  return (
    <div style={{
      background: 'white', borderRadius: '14px',
      padding: '18px', border: '1px solid #eeeeee',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <SkeletonBox width="50%" height="16px" style={{ marginBottom: '6px' }} />
          <SkeletonBox width="35%" height="12px" />
        </div>
        <SkeletonBox width="70px" height="22px" radius="99px" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
        <SkeletonBox height="12px" />
        <SkeletonBox height="12px" />
        <SkeletonBox height="12px" />
        <SkeletonBox height="12px" />
      </div>
      <SkeletonBox height="32px" radius="8px" />
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div>
      <SkeletonBox width="40%" height="32px" style={{ marginBottom: '8px' }} />
      <SkeletonBox width="25%" height="14px" style={{ marginBottom: '24px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {[1,2].map(i => (
          <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #eeeeee' }}>
            <SkeletonBox width="40%" height="15px" style={{ marginBottom: '14px' }} />
            {[1,2,3,4].map(j => <SkeletonRow key={j} />)}
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonList({ count = 4 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          background: 'white', borderRadius: '12px',
          padding: '16px 18px', border: '1px solid #eeeeee',
          display: 'flex', alignItems: 'center', gap: '14px'
        }}>
          <SkeletonBox width="22px" height="22px" radius="50%" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <SkeletonBox width="55%" height="14px" style={{ marginBottom: '6px' }} />
            <SkeletonBox width="35%" height="11px" />
          </div>
          <SkeletonBox width="60px" height="28px" radius="6px" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonGrid({ count = 4 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
      {Array.from({ length: count }).map((_, i) => <SkeletonItemCard key={i} />)}
    </div>
  )
}

// Global shimmer animation
const style = document.createElement('style')
style.textContent = `
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`
document.head.appendChild(style)