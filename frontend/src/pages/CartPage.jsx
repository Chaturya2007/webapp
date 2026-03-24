import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, MapPin, Clock, Utensils, Truck, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import toast from 'react-hot-toast';

export default function CartPage() {
  const {
    items, orderType, setOrderType, deliveryInfo, setDeliveryInfo,
    subtotal, tax, deliveryFee, total, clearCart
  } = useCart();
  const navigate = useNavigate();

  const handleDeliveryChange = (e) => {
    setDeliveryInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateAndProceed = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    if (orderType === 'dine-in' && !deliveryInfo.tableNumber) {
      toast.error('Please enter your table number');
      return;
    }
    if (orderType === 'takeaway' && !deliveryInfo.pickupTime) {
      toast.error('Please select a pickup time');
      return;
    }
    if (orderType === 'delivery') {
      if (!deliveryInfo.address || !deliveryInfo.city || !deliveryInfo.pincode || !deliveryInfo.phone) {
        toast.error('Please fill all delivery details');
        return;
      }
    }
    navigate('/payment');
  };

  const styles = {
    page: { maxWidth: '900px', margin: '0 auto', padding: '24px' },
    title: {
      fontSize: '24px', fontWeight: '800', color: '#4A2C2A',
      display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px'
    },
    layout: { display: 'flex', gap: '24px', flexWrap: 'wrap' },
    cartSection: { flex: '2', minWidth: '300px' },
    summarySection: { flex: '1', minWidth: '280px' },
    emptyState: {
      textAlign: 'center', padding: '80px 24px',
      background: '#fff', borderRadius: '16px'
    },
    orderTypeSection: {
      background: '#fff', borderRadius: '16px', padding: '20px',
      boxShadow: '0 2px 8px rgba(74,44,42,0.07)', marginBottom: '16px'
    },
    orderTypeTitle: { fontWeight: '700', color: '#4A2C2A', marginBottom: '14px', fontSize: '15px' },
    typeCards: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
    typeCard: (active) => ({
      flex: 1, minWidth: '80px', padding: '12px 8px', borderRadius: '12px', cursor: 'pointer',
      border: `2px solid ${active ? '#4A2C2A' : '#F5E6D3'}`,
      background: active ? '#4A2C2A' : '#fff',
      textAlign: 'center', transition: 'all 0.2s'
    }),
    typeEmoji: { fontSize: '24px', display: 'block', marginBottom: '4px' },
    typeLabel: (active) => ({ fontSize: '12px', fontWeight: '700', color: active ? '#D4AF37' : '#4A2C2A' }),
    infoSection: {
      background: '#fff', borderRadius: '16px', padding: '20px',
      boxShadow: '0 2px 8px rgba(74,44,42,0.07)', marginBottom: '16px'
    },
    inputLabel: { fontSize: '13px', fontWeight: '600', color: '#4A2C2A', marginBottom: '6px', display: 'block' },
    input: {
      width: '100%', padding: '10px 14px', border: '1.5px solid #e8d5c0',
      borderRadius: '8px', fontSize: '14px', outline: 'none',
      color: '#2C1810', marginBottom: '12px', background: '#FAFAFA'
    },
    summaryCard: {
      background: '#fff', borderRadius: '16px', padding: '20px',
      boxShadow: '0 2px 8px rgba(74,44,42,0.07)', position: 'sticky', top: '80px'
    },
    summaryTitle: { fontWeight: '800', color: '#4A2C2A', marginBottom: '16px', fontSize: '16px' },
    summaryRow: {
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: '10px', fontSize: '14px', color: '#555'
    },
    totalRow: {
      display: 'flex', justifyContent: 'space-between',
      borderTop: '2px solid #F5E6D3', paddingTop: '12px', marginTop: '4px',
      fontWeight: '800', fontSize: '18px', color: '#4A2C2A'
    },
    proceedBtn: {
      width: '100%', background: '#4A2C2A', color: '#fff', border: 'none',
      borderRadius: '12px', padding: '14px', fontSize: '16px', fontWeight: '700',
      cursor: 'pointer', marginTop: '16px', transition: 'all 0.2s'
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
        <div style={styles.emptyState}>
          <p style={{ fontSize: '64px' }}>🛒</p>
          <h2 style={{ color: '#4A2C2A', marginTop: '16px', marginBottom: '8px' }}>Your cart is empty</h2>
          <p style={{ color: '#888', marginBottom: '24px' }}>Add some delicious items to get started</p>
          <button className="btn-primary" onClick={() => navigate('/menu')}>Browse Menu</button>
        </div>
      </div>
    );
  }

  const timeSlots = [];
  const now = new Date();
  for (let i = 1; i <= 8; i++) {
    const t = new Date(now.getTime() + i * 15 * 60000);
    timeSlots.push(t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }

  return (
    <div style={styles.page}>
      <div style={styles.title}>
        <ShoppingCart size={24} /> Your Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
      </div>

      <div style={styles.layout}>
        <div style={styles.cartSection}>
          {items.map(item => <CartItem key={item._id} item={item} />)}

          {/* Order Type */}
          <div style={styles.orderTypeSection}>
            <div style={styles.orderTypeTitle}>📦 Order Type</div>
            <div style={styles.typeCards}>
              {[
                { id: 'dine-in', emoji: '🍽️', label: 'Dine-In' },
                { id: 'takeaway', emoji: '🛍️', label: 'Takeaway' },
                { id: 'delivery', emoji: '🚚', label: 'Delivery' }
              ].map(t => (
                <div key={t.id} style={styles.typeCard(orderType === t.id)} onClick={() => setOrderType(t.id)}>
                  <span style={styles.typeEmoji}>{t.emoji}</span>
                  <span style={styles.typeLabel(orderType === t.id)}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Info */}
          {orderType === 'dine-in' && (
            <div style={styles.infoSection}>
              <label style={styles.inputLabel}><Utensils size={14} style={{ display: 'inline', marginRight: '6px' }} />Table Number</label>
              <input style={styles.input} type="number" name="tableNumber" placeholder="Enter table number"
                value={deliveryInfo.tableNumber} onChange={handleDeliveryChange}
                onFocus={e => e.target.style.borderColor = '#4A2C2A'}
                onBlur={e => e.target.style.borderColor = '#e8d5c0'} />
            </div>
          )}

          {orderType === 'takeaway' && (
            <div style={styles.infoSection}>
              <label style={styles.inputLabel}><Clock size={14} style={{ display: 'inline', marginRight: '6px' }} />Pickup Time</label>
              <select style={styles.input} name="pickupTime" value={deliveryInfo.pickupTime} onChange={handleDeliveryChange}>
                <option value="">Select a time slot</option>
                {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}

          {orderType === 'delivery' && (
            <div style={styles.infoSection}>
              <div style={{ fontWeight: '700', color: '#4A2C2A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} /> Delivery Address
              </div>
              <label style={styles.inputLabel}>Street Address</label>
              <input style={styles.input} name="address" placeholder="House no, Street, Area"
                value={deliveryInfo.address} onChange={handleDeliveryChange}
                onFocus={e => e.target.style.borderColor = '#4A2C2A'}
                onBlur={e => e.target.style.borderColor = '#e8d5c0'} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={styles.inputLabel}>City</label>
                  <input style={styles.input} name="city" placeholder="City"
                    value={deliveryInfo.city} onChange={handleDeliveryChange}
                    onFocus={e => e.target.style.borderColor = '#4A2C2A'}
                    onBlur={e => e.target.style.borderColor = '#e8d5c0'} />
                </div>
                <div>
                  <label style={styles.inputLabel}>Pincode</label>
                  <input style={styles.input} name="pincode" placeholder="600001"
                    value={deliveryInfo.pincode} onChange={handleDeliveryChange}
                    onFocus={e => e.target.style.borderColor = '#4A2C2A'}
                    onBlur={e => e.target.style.borderColor = '#e8d5c0'} />
                </div>
              </div>
              <label style={styles.inputLabel}>Phone Number</label>
              <input style={styles.input} name="phone" type="tel" placeholder="+91 9876543210"
                value={deliveryInfo.phone} onChange={handleDeliveryChange}
                onFocus={e => e.target.style.borderColor = '#4A2C2A'}
                onBlur={e => e.target.style.borderColor = '#e8d5c0'} />
            </div>
          )}
        </div>

        {/* Summary */}
        <div style={styles.summarySection}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryTitle}>🧾 Order Summary</div>
            {items.map(item => (
              <div key={item._id} style={{ ...styles.summaryRow, marginBottom: '6px' }}>
                <span style={{ flex: 1 }}>{item.name} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px dashed #F5E6D3', margin: '12px 0' }} />
            <div style={styles.summaryRow}><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div style={styles.summaryRow}><span>Tax (5%)</span><span>₹{tax}</span></div>
            <div style={styles.summaryRow}>
              <span>Delivery Fee</span>
              <span style={{ color: deliveryFee === 0 ? '#27ae60' : 'inherit' }}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </span>
            </div>
            <div style={styles.totalRow}><span>Total</span><span>₹{total}</span></div>
            <button style={styles.proceedBtn} onClick={validateAndProceed}
              onMouseEnter={e => e.currentTarget.style.background = '#3a1e1c'}
              onMouseLeave={e => e.currentTarget.style.background = '#4A2C2A'}>
              Proceed to Payment →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
