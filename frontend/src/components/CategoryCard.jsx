export default function CategoryCard({ category, selected, onClick }) {
  const styles = {
    card: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      padding: '16px 20px',
      borderRadius: '16px',
      cursor: 'pointer',
      minWidth: '100px',
      background: selected ? '#4A2C2A' : '#fff',
      border: `2px solid ${selected ? '#4A2C2A' : '#F5E6D3'}`,
      boxShadow: selected ? '0 4px 12px rgba(74,44,42,0.2)' : '0 2px 8px rgba(74,44,42,0.06)',
      transition: 'all 0.2s ease',
      transform: selected ? 'scale(1.05)' : 'scale(1)'
    },
    emoji: {
      fontSize: '28px',
      lineHeight: 1
    },
    label: {
      fontSize: '12px',
      fontWeight: '600',
      color: selected ? '#D4AF37' : '#4A2C2A',
      textAlign: 'center',
      whiteSpace: 'nowrap'
    }
  };

  return (
    <div style={styles.card} onClick={onClick}>
      <span style={styles.emoji}>{category.emoji}</span>
      <span style={styles.label}>{category.label}</span>
    </div>
  );
}
