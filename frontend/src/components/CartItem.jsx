import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  const emoji = item.category === 'beverages' ? '☕'
    : item.category === 'desserts' ? '🍰'
    : item.category === 'breakfast' ? '🥐'
    : item.category === 'main-course' ? '🍽️'
    : item.category === 'starters' ? '🥗'
    : '🍴';

  const styles = {
    row: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '14px',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 2px 6px rgba(74,44,42,0.07)',
      marginBottom: '10px'
    },
    img: {
      width: '64px',
      height: '64px',
      borderRadius: '10px',
      background: '#F5E6D3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px',
      overflow: 'hidden',
      flexShrink: 0
    },
    info: { flex: 1 },
    name: { fontWeight: '700', fontSize: '14px', color: '#2C1810', marginBottom: '4px' },
    price: { fontSize: '13px', color: '#4A2C2A', fontWeight: '600' },
    vegDot: { fontSize: '10px', marginLeft: '6px' },
    controls: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    qtyRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: '#4A2C2A',
      borderRadius: '8px',
      padding: '5px 10px'
    },
    qtyBtn: {
      background: 'none',
      border: 'none',
      color: '#D4AF37',
      cursor: 'pointer',
      display: 'flex',
      padding: 0
    },
    qtyNum: {
      color: '#fff',
      fontWeight: '700',
      fontSize: '14px',
      minWidth: '20px',
      textAlign: 'center'
    },
    removeBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#e74c3c',
      display: 'flex',
      padding: '6px'
    },
    itemTotal: {
      fontWeight: '700',
      fontSize: '15px',
      color: '#4A2C2A',
      minWidth: '60px',
      textAlign: 'right'
    }
  };

  return (
    <div style={styles.row}>
      <div style={styles.img}>
        {item.image
          ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
          : <span>{emoji}</span>}
      </div>
      <div style={styles.info}>
        <div style={styles.name}>
          {item.name}
          <span style={styles.vegDot}>{item.isVeg ? '🟢' : '🔴'}</span>
        </div>
        <div style={styles.price}>₹{item.price} each</div>
      </div>
      <div style={styles.controls}>
        <div style={styles.qtyRow}>
          <button style={styles.qtyBtn} onClick={() => updateQuantity(item._id, item.quantity - 1)}>
            <Minus size={14} />
          </button>
          <span style={styles.qtyNum}>{item.quantity}</span>
          <button style={styles.qtyBtn} onClick={() => updateQuantity(item._id, item.quantity + 1)}>
            <Plus size={14} />
          </button>
        </div>
        <button style={styles.removeBtn} onClick={() => removeFromCart(item._id)} title="Remove">
          <Trash2 size={16} />
        </button>
      </div>
      <div style={styles.itemTotal}>₹{item.price * item.quantity}</div>
    </div>
  );
}
