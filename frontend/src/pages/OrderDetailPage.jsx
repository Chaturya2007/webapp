import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, X } from 'lucide-react';
import api from '../api/axios';
import OrderStatusTracker from '../components/OrderStatusTracker';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending: { bg: '#fff3e0', color: '#e65100' },
  accepted: { bg: '#e8f5e9', color: '#2e7d32' },
  preparing: { bg: '#e3f2fd', color: '#1565c0' },
  ready: { bg: '#f3e5f5', color: '#6a1b9a' },
  'out-for-delivery': { bg: '#e0f7fa', color: '#00695c' },
  delivered: { bg: '#e8f5e9', color: '#1b5e20' },
  cancelled: { bg: '#ffebee', color: '#b71c1c' }
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [ratingModal, setRatingModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  const fetchOrder = () => {
    api.get(`/orders/${id}`)
      .then(res => setOrder(res.data?.order || res.data))
      .catch(() => toast.error('Failed to load order'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const cancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      await api.patch(`/orders/${id}/cancel`);
      toast.success('Order cancelled');
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const submitRating = async () => {
    setSubmittingRating(true);
    try {
      await api.post(`/orders/${id}/rate`, { rating, review });
      toast.success('Thank you for your feedback! ⭐');
      setRatingModal(false);
      fetchOrder();
    } catch (err) {
      toast.error('Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #F5E6D3', borderTop: '4px solid #4A2C2A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: '80px' }}>
        <p style={{ fontSize: '48px' }}>❌</p>
        <h2 style={{ color: '#4A2C2A', marginTop: '16px' }}>Order not found</h2>
        <button className="btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/orders')}>Back to Orders</button>
      </div>
    );
  }

  const statusInfo = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
  const canCancel = order.status === 'pending';
  const canRate = order.status === 'delivered' && !order.rated;

  const styles = {
    page: { maxWidth: '800px', margin: '0 auto', padding: '24px' },
    backBtn: { display: 'flex', alignItems: 'center', gap: '6px', color: '#4A2C2A', fontWeight: '600', marginBottom: '20px', cursor: 'pointer', background: 'none', border: 'none', fontSize: '14px', padding: 0 },
    header: { background: '#4A2C2A', borderRadius: '16px', padding: '20px', color: '#fff', marginBottom: '16px' },
    orderId: { fontSize: '18px', fontWeight: '800', color: '#D4AF37', marginBottom: '4px' },
    orderDate: { fontSize: '13px', color: '#F5E6D3', opacity: 0.8, marginBottom: '12px' },
    statusBadge: { padding: '5px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', background: statusInfo.bg, color: statusInfo.color, display: 'inline-block' },
    card: { background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(74,44,42,0.07)', marginBottom: '16px' },
    cardTitle: { fontWeight: '700', color: '#4A2C2A', marginBottom: '14px', fontSize: '15px' },
    itemRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F5E6D3', fontSize: '14px' },
    priceRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#555', marginBottom: '8px' },
    totalRow: { display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '18px', color: '#4A2C2A', borderTop: '2px solid #F5E6D3', paddingTop: '10px', marginTop: '4px' },
    cancelBtn: { background: '#fff', color: '#e74c3c', border: '2px solid #e74c3c', borderRadius: '10px', padding: '10px 24px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', transition: 'all 0.2s' },
    rateBtn: { background: '#D4AF37', color: '#2C1810', border: 'none', borderRadius: '10px', padding: '10px 24px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' },
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '24px' },
    modal: { background: '#fff', borderRadius: '20px', padding: '28px', maxWidth: '400px', width: '100%', boxShadow: '0 24px 48px rgba(0,0,0,0.3)' }
  };

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={() => navigate('/orders')}>
        <ArrowLeft size={16} /> Back to Orders
      </button>

      <div style={styles.header}>
        <div style={styles.orderId}>Order #{order._id?.slice(-8).toUpperCase()}</div>
        <div style={styles.orderDate}>
          {new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
        <span style={styles.statusBadge}>{order.status?.toUpperCase()}</span>
      </div>

      {/* Status Tracker */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>📍 Order Status</div>
        <OrderStatusTracker currentStatus={order.status} />
      </div>

      {/* Items */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>🛒 Ordered Items</div>
        {order.items?.map((item, idx) => (
          <div key={idx} style={styles.itemRow}>
            <div>
              <span style={{ fontWeight: '600' }}>{item.menuItem?.name || item.name}</span>
              <span style={{ color: '#888', fontSize: '12px', marginLeft: '8px' }}>× {item.quantity}</span>
            </div>
            <span style={{ fontWeight: '600', color: '#4A2C2A' }}>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div style={{ marginTop: '12px' }}>
          <div style={styles.priceRow}><span>Subtotal</span><span>₹{order.subtotal}</span></div>
          <div style={styles.priceRow}><span>Tax (5%)</span><span>₹{order.tax}</span></div>
          <div style={styles.priceRow}>
            <span>Delivery Fee</span>
            <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
          </div>
          <div style={styles.totalRow}><span>Total</span><span>₹{order.total}</span></div>
        </div>
      </div>

      {/* Payment & Delivery Info */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>💳 Payment & Delivery</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
          <div>
            <div style={{ color: '#888', marginBottom: '3px' }}>Payment Method</div>
            <div style={{ fontWeight: '600' }}>{order.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '📱 UPI'}</div>
          </div>
          <div>
            <div style={{ color: '#888', marginBottom: '3px' }}>Order Type</div>
            <div style={{ fontWeight: '600' }}>
              {order.orderType === 'dine-in' ? `🍽️ Dine-In${order.tableNumber ? ` (Table ${order.tableNumber})` : ''}` : order.orderType === 'takeaway' ? `🛍️ Takeaway${order.pickupTime ? ` (${order.pickupTime})` : ''}` : '🚚 Home Delivery'}
            </div>
          </div>
          {order.deliveryInfo?.address && (
            <div style={{ gridColumn: '1/-1' }}>
              <div style={{ color: '#888', marginBottom: '3px' }}>Delivery Address</div>
              <div style={{ fontWeight: '600' }}>{order.deliveryInfo.address}, {order.deliveryInfo.city} - {order.deliveryInfo.pincode}</div>
              <div style={{ color: '#888', fontSize: '12px' }}>{order.deliveryInfo.phone}</div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {canCancel && (
          <button style={styles.cancelBtn} onClick={cancelOrder} disabled={cancelling}
            onMouseEnter={e => { e.currentTarget.style.background = '#e74c3c'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#e74c3c'; }}>
            {cancelling ? 'Cancelling...' : '❌ Cancel Order'}
          </button>
        )}
        {canRate && (
          <button style={styles.rateBtn} onClick={() => setRatingModal(true)}>
            ⭐ Rate Order
          </button>
        )}
        {order.rated && (
          <div style={{ padding: '10px 16px', background: '#F5E6D3', borderRadius: '10px', fontSize: '13px', color: '#4A2C2A', fontWeight: '600' }}>
            ⭐ You rated this order {order.rating}/5
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {ratingModal && (
        <div style={styles.overlay} onClick={e => e.target === e.currentTarget && setRatingModal(false)}>
          <div style={styles.modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#4A2C2A', fontWeight: '800' }}>Rate Your Order</h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }} onClick={() => setRatingModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '32px', transition: 'transform 0.1s' }}
                  onClick={() => setRating(n)}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  <Star size={32} fill={n <= rating ? '#D4AF37' : 'none'} color={n <= rating ? '#D4AF37' : '#ddd'} />
                </button>
              ))}
            </div>
            <textarea
              style={{ width: '100%', border: '1.5px solid #e8d5c0', borderRadius: '10px', padding: '12px', fontSize: '14px', outline: 'none', resize: 'vertical', minHeight: '80px', fontFamily: 'inherit', marginBottom: '16px' }}
              placeholder="Tell us about your experience (optional)"
              value={review}
              onChange={e => setReview(e.target.value)}
            />
            <button className="btn-primary" style={{ width: '100%' }} onClick={submitRating} disabled={submittingRating}>
              {submittingRating ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
