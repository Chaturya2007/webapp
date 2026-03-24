import { useState } from 'react';
import { Star, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function MenuItemCard({ item }) {
  const { addToCart, removeFromCart, updateQuantity, getItemQuantity } = useCart();
  const [hovered, setHovered] = useState(false);
  const qty = getItemQuantity(item._id);

  const styles = {
    card: {
      background: '#fff',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: hovered ? '0 8px 24px rgba(74,44,42,0.15)' : '0 2px 8px rgba(74,44,42,0.08)',
      transition: 'all 0.25s ease',
      transform: hovered ? 'translateY(-4px)' : 'none',
      cursor: 'default',
      display: 'flex',
      flexDirection: 'column'
    },
    imgContainer: {
      height: '180px',
      background: '#F5E6D3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '64px',
      overflow: 'hidden',
      position: 'relative'
    },
    img: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    vegBadge: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: '#fff',
      borderRadius: '4px',
      padding: '2px 4px',
      border: `2px solid ${item.isVeg ? '#27ae60' : '#e74c3c'}`,
      fontSize: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    body: {
      padding: '14px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    },
    name: {
      fontWeight: '700',
      fontSize: '15px',
      color: '#2C1810',
      lineHeight: '1.3'
    },
    desc: {
      fontSize: '12px',
      color: '#888',
      lineHeight: '1.4',
      flex: 1,
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical'
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '10px'
    },
    price: {
      fontWeight: '700',
      fontSize: '17px',
      color: '#4A2C2A'
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '3px',
      fontSize: '12px',
      color: '#888'
    },
    addBtn: {
      background: '#4A2C2A',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      padding: '7px 16px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '13px',
      transition: 'background 0.2s'
    },
    qtyRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: '#4A2C2A',
      borderRadius: '8px',
      padding: '4px 8px'
    },
    qtyBtn: {
      background: 'none',
      border: 'none',
      color: '#D4AF37',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      padding: '2px'
    },
    qtyNum: {
      color: '#fff',
      fontWeight: '700',
      fontSize: '14px',
      minWidth: '20px',
      textAlign: 'center'
    }
  };

  const emoji = item.category === 'beverages' ? '☕'
    : item.category === 'desserts' ? '🍰'
    : item.category === 'breakfast' ? '🥐'
    : item.category === 'main-course' ? '🍽️'
    : item.category === 'starters' ? '🥗'
    : item.category === 'pizza' ? '🍕'
    : item.category === 'burgers' ? '🍔'
    : item.category === 'sandwiches' ? '🥪'
    : '🍴';

  return (
    <div style={styles.card} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={styles.imgContainer}>
        {item.image ? (
          <img src={item.image} alt={item.name} style={styles.img} />
        ) : (
          <span>{emoji}</span>
        )}
        <div style={styles.vegBadge}>
          <span style={{ fontSize: '10px' }}>{item.isVeg ? '🟢' : '🔴'}</span>
        </div>
        {!item.isAvailable && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>Unavailable</span>
          </div>
        )}
      </div>
      <div style={styles.body}>
        <div style={styles.name}>{item.name}</div>
        {item.description && <div style={styles.desc}>{item.description}</div>}
        <div style={styles.rating}>
          <Star size={12} fill="#D4AF37" color="#D4AF37" />
          <span>{item.rating || '4.2'}</span>
          {item.reviewCount && <span>({item.reviewCount})</span>}
        </div>
        <div style={styles.footer}>
          <div style={styles.price}>₹{item.price}</div>
          {item.isAvailable !== false && (
            qty === 0 ? (
              <button style={styles.addBtn} onClick={() => addToCart(item)}
                onMouseEnter={e => e.currentTarget.style.background = '#3a1e1c'}
                onMouseLeave={e => e.currentTarget.style.background = '#4A2C2A'}>
                Add +
              </button>
            ) : (
              <div style={styles.qtyRow}>
                <button style={styles.qtyBtn} onClick={() => updateQuantity(item._id, qty - 1)}>
                  <Minus size={14} />
                </button>
                <span style={styles.qtyNum}>{qty}</span>
                <button style={styles.qtyBtn} onClick={() => updateQuantity(item._id, qty + 1)}>
                  <Plus size={14} />
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
