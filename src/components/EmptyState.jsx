export default function EmptyState({ icon, title, desc, action, onAction, secondaryAction, onSecondaryAction }) {
  return (
    <div style={{
      background: 'white', borderRadius: '16px',
      padding: '64px 32px', textAlign: 'center',
      border: '1px solid #eeeeee',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
    }}>
      <div style={{ fontSize: '56px', marginBottom: '16px' }}>{icon}</div>
      <div style={{
        fontSize: '18px', fontWeight: '700',
        color: '#212121', marginBottom: '8px',
        fontFamily: 'Cambria, serif'
      }}>
        {title}
      </div>
      <div style={{
        fontSize: '13px', color: '#9E9E9E',
        marginBottom: '28px', lineHeight: 1.7,
        maxWidth: '380px', margin: '0 auto 28px'
      }}>
        {desc}
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {action && (
          <button
            onClick={onAction}
            style={{
              padding: '11px 24px', background: '#2E7D32',
              color: 'white', border: 'none', borderRadius: '8px',
              fontSize: '14px', fontWeight: '700',
              cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
            }}>
            {action}
          </button>
        )}
        {secondaryAction && (
          <button
            onClick={onSecondaryAction}
            style={{
              padding: '11px 24px', background: 'transparent',
              color: '#616161', border: '1px solid #E0E0E0',
              borderRadius: '8px', fontSize: '14px',
              fontWeight: '600', cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif'
            }}>
            {secondaryAction}
          </button>
        )}
      </div>
    </div>
  )
}