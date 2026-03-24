import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function PaymentPage() {
  const { items, orderType, deliveryInfo, subtotal, tax, deliveryFee, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payMethod, setPayMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [upiPaid, setUpiPaid] = useState(false);

  const upiString = `upi://pay?pa=chaturya.01@ptaxis&pn=Cafe%20Tranquil&am=${total}&cu=INR`;

  const placeOrder = async () => {
    if (!payMethod) {
      toast.error('Please select a payment method');
      return;
    }
    if (payMethod === 'upi' && !upiPaid) {
      toast.error('Please confirm your UPI payment first');
      return;
    }
    setLoading(true);
    try {
      const orderData = {
        items: items.map(i => ({ menuItem: i._id, quantity: i.quantity, price: i.price })),
        orderType,
        deliveryInfo: orderType === 'delivery' ? deliveryInfo : undefined,
        tableNumber: orderType === 'dine-in' ? deliveryInfo.tableNumber : undefined,
        pickupTime: orderType === 'takeaway' ? deliveryInfo.pickupTime : undefined,
        paymentMethod: payMethod,
        subtotal,
        tax,
        deliveryFee,
        total
      };
      const res = await api.post('/orders', orderData);
      clearCart();
      toast.success('Order placed successfully! 🎉', { duration: 4000 });
      navigate(`/orders/${res.data._id || res.data.order?._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: { maxWidth: '700px', margin: '0 auto', padding: '24px' },
    title: { fontSize: '24px', fontWeight: '800', color: '#4A2C2A', marginBottom: '24px' },
    card: {
      background: '#fff', borderRadius: '16px', padding: '20px',
      boxShadow: '0 2px 8px rgba(74,44,42,0.07)', marginBottom: '16px'
    },
    sectionTitle: { fontWeight: '700', color: '#4A2C2A', marginBottom: '14px', fontSize: '15px' },
    methodCard: (active) => ({
      border: `2px solid ${active ? '#4A2C2A' : '#F5E6D3'}`,
      borderRadius: '12px',
      padding: '16px 20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      marginBottom: '10px',
      background: active ? '#FFF8F0' : '#fff',
      transition: 'all 0.2s'
    }),
    methodEmoji: { fontSize: '28px' },
    methodInfo: { flex: 1 },
    methodName: { fontWeight: '700', color: '#2C1810', fontSize: '15px' },
    methodDesc: { fontSize: '12px', color: '#888', marginTop: '2px' },
    radio: {
      width: '20px', height: '20px',
      border: `2px solid ${payMethod ? '#4A2C2A' : '#ccc'}`,
      borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    summaryRow: {
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: '10px', fontSize: '14px', color: '#555'
    },
    totalRow: {
      display: 'flex', justifyContent: 'space-between',
      borderTop: '2px solid #F5E6D3', paddingTop: '12px', marginTop: '4px',
      fontWeight: '800', fontSize: '18px', color: '#4A2C2A'
    },
    qrSection: {
      textAlign: 'center', padding: '24px',
      background: '#FFF8F0', borderRadius: '12px',
      border: '2px dashed #D4AF37', marginTop: '14px'
    },
    placeBtn: {
      width: '100%', background: '#4A2C2A', color: '#fff',
      border: 'none', borderRadius: '12px', padding: '14px',
      fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.7 : 1, transition: 'all 0.2s', marginTop: '8px'
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <p style={{ fontSize: '48px' }}>🛒</p>
        <h2 style={{ color: '#4A2C2A', margin: '16px 0 8px' }}>No items to checkout</h2>
        <button className="btn-primary" onClick={() => navigate('/menu')}>Go to Menu</button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.title}>💳 Payment</div>

      {/* Order Summary */}
      <div style={styles.card}>
        <div style={styles.sectionTitle}>📋 Order Summary</div>
        {items.map(i => (
          <div key={i._id} style={styles.summaryRow}>
            <span>{i.name} × {i.quantity}</span>
            <span>₹{i.price * i.quantity}</span>
          </div>
        ))}
        <div style={{ borderTop: '1px dashed #F5E6D3', margin: '8px 0' }} />
        <div style={styles.summaryRow}><span>Subtotal</span><span>₹{subtotal}</span></div>
        <div style={styles.summaryRow}><span>Tax (5%)</span><span>₹{tax}</span></div>
        <div style={styles.summaryRow}>
          <span>Delivery Fee</span>
          <span style={{ color: deliveryFee === 0 ? '#27ae60' : 'inherit' }}>
            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
          </span>
        </div>
        <div style={styles.totalRow}><span>Total Amount</span><span>₹{total}</span></div>
        <div style={{ marginTop: '10px', padding: '8px 12px', background: '#F5E6D3', borderRadius: '8px', fontSize: '13px' }}>
          <strong>Order Type:</strong> {orderType === 'dine-in' ? `Dine-In (Table ${deliveryInfo.tableNumber})` : orderType === 'takeaway' ? `Takeaway (${deliveryInfo.pickupTime})` : 'Home Delivery'}
        </div>
      </div>

      {/* Payment Methods */}
      <div style={styles.card}>
        <div style={styles.sectionTitle}>💰 Select Payment Method</div>

        <div style={styles.methodCard(payMethod === 'cod')} onClick={() => setPayMethod('cod')}>
          <span style={styles.methodEmoji}>💵</span>
          <div style={styles.methodInfo}>
            <div style={styles.methodName}>Cash on Delivery</div>
            <div style={styles.methodDesc}>Pay in cash when your order arrives</div>
          </div>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${payMethod === 'cod' ? '#4A2C2A' : '#ccc'}`, background: payMethod === 'cod' ? '#4A2C2A' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {payMethod === 'cod' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D4AF37' }} />}
          </div>
        </div>

        <div style={styles.methodCard(payMethod === 'upi')} onClick={() => setPayMethod('upi')}>
          <span style={styles.methodEmoji}>📱</span>
          <div style={styles.methodInfo}>
            <div style={styles.methodName}>UPI Payment</div>
            <div style={styles.methodDesc}>Pay via PhonePe, GPay, Paytm or any UPI app</div>
          </div>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${payMethod === 'upi' ? '#4A2C2A' : '#ccc'}`, background: payMethod === 'upi' ? '#4A2C2A' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {payMethod === 'upi' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D4AF37' }} />}
          </div>
        </div>

        {payMethod === 'upi' && (
          <div style={styles.qrSection}>
            <div style={{ fontWeight: '700', color: '#4A2C2A', marginBottom: '16px', fontSize: '16px' }}>
              📲 Scan & Pay with any UPI app
            </div>
            <div style={{ display: 'inline-block', padding: '12px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <QRCodeSVG value={upiString} size={200} fgColor="#4A2C2A" />
            </div>
            <div style={{ marginTop: '12px', fontSize: '14px', color: '#888' }}>
              UPI ID: <strong style={{ color: '#4A2C2A' }}>chaturya.01@ptaxis</strong>
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#4A2C2A', margin: '8px 0' }}>
              ₹{total}
            </div>
            {!upiPaid ? (
              <button
                style={{ background: '#27ae60', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 28px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', margin: '8px auto 0' }}
                onClick={() => { setUpiPaid(true); toast.success('Payment confirmed! ✅'); }}>
                <CheckCircle size={16} /> I have paid
              </button>
            ) : (
              <div style={{ color: '#27ae60', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
                <CheckCircle size={18} /> Payment Confirmed!
              </div>
            )}
          </div>
        )}
      </div>

      <button style={styles.placeBtn} onClick={placeOrder} disabled={loading}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#3a1e1c'; }}
        onMouseLeave={e => e.currentTarget.style.background = '#4A2C2A'}>
        {loading ? 'Placing Order...' : payMethod === 'upi' ? 'Confirm Order' : 'Place Order 🎉'}
      </button>
    </div>
  );
}
