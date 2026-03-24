const STATUSES = [
  { key: 'pending', label: 'Order Placed', emoji: '📋' },
  { key: 'accepted', label: 'Accepted', emoji: '✅' },
  { key: 'preparing', label: 'Preparing', emoji: '👨‍🍳' },
  { key: 'ready', label: 'Ready', emoji: '🎉' },
  { key: 'out-for-delivery', label: 'On the Way', emoji: '🚚' },
  { key: 'delivered', label: 'Delivered', emoji: '🎊' }
];

const STATUS_ORDER = STATUSES.map(s => s.key);

export default function OrderStatusTracker({ currentStatus }) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  if (currentStatus === 'cancelled') {
    return (
      <div style={{
        padding: '20px',
        background: '#fff5f5',
        borderRadius: '12px',
        textAlign: 'center',
        border: '2px solid #e74c3c'
      }}>
        <span style={{ fontSize: '32px' }}>❌</span>
        <div style={{ marginTop: '8px', fontWeight: '700', color: '#e74c3c', fontSize: '16px' }}>
          Order Cancelled
        </div>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', padding: '8px 0' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        minWidth: '500px',
        position: 'relative'
      }}>
        {STATUSES.map((step, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <div key={step.key} style={{ display: 'flex', alignItems: 'center', flex: index < STATUSES.length - 1 ? 1 : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  background: isDone ? '#4A2C2A' : isCurrent ? '#D4AF37' : '#F5E6D3',
                  border: `3px solid ${isDone ? '#4A2C2A' : isCurrent ? '#D4AF37' : '#e0d0c0'}`,
                  boxShadow: isCurrent ? '0 0 0 4px rgba(212,175,55,0.3)' : 'none',
                  transition: 'all 0.3s'
                }}>
                  {isDone ? '✓' : step.emoji}
                </div>
                <span style={{
                  fontSize: '10px',
                  fontWeight: isCurrent ? '700' : '500',
                  color: isDone ? '#4A2C2A' : isCurrent ? '#D4AF37' : '#aaa',
                  textAlign: 'center',
                  maxWidth: '70px',
                  lineHeight: '1.2'
                }}>
                  {step.label}
                </span>
              </div>

              {index < STATUSES.length - 1 && (
                <div style={{
                  flex: 1,
                  height: '3px',
                  background: isDone ? '#4A2C2A' : '#F5E6D3',
                  margin: '0 4px',
                  marginBottom: '20px',
                  borderRadius: '2px',
                  transition: 'background 0.3s'
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
