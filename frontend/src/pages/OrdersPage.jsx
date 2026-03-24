import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending: { bg: '#fff3e0', color: '#e65100', label: 'Pending' },
  accepted: { bg: '#e8f5e9', color: '#2e7d32', label: 'Accepted' },
  preparing: { bg: '#e3f2fd', color: '#1565c0', label: 'Preparing' },
  ready: { bg: '#f3e5f5', color: '#6a1b9a', label: 'Ready' },
  'out-for-delivery': { bg: '#e0f7fa', color: '#00695c', label: 'Out for Delivery' },
  delivered: { bg: '#e8f5e9', color: '#1b5e20', label: 'Delivered' },
  cancelled: { bg: '#ffebee', color: '#b71c1c', label: 'Cancelled' }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders')
      .then(res => setOrders(res.data?.orders || res.data || []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const styles = {
    page: { maxWidth: '800px', margin: '0 auto', padding: '24px' },
    title: { fontSize: '24px', fontWeight: '800', color: '#4A2C2A', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' },
    orderCard: {
      background: '#fff', borderRadius: '16px', padding: '20px',
      boxShadow: '0 2px 8px rgba(74,44,42,0.08)', marginBottom: '14px',
      display: 'flex', flexDirection: 'column', gap: '10px',
      transition: 'all 0.2s', cursor: 'pointer',
      textDecoration: 'none', color: 'inherit'
    },
    orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    orderId: { fontWeight: '700', color: '#4A2C2A', fontSize: '13px' },
    orderDate: { fontSize: '12px', color: '#888', marginTop: '2px' },
    statusBadge: (status) => ({
      padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
      background: STATUS_COLORS[status]?.bg || '#f5f5f5',
      color: STATUS_COLORS[status]?.color || '#555'
    }),
    itemsList: { fontSize: '13px', color: '#666', lineHeight: '1.5' },
    orderFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F5E6D3', paddingTop: '10px', marginTop: '4px' },
    total: { fontWeight: '800', color: '#4A2C2A', fontSize: '16px' },
    viewLink: { display: 'flex', alignItems: 'center', color: '#4A2C2A', fontWeight: '600', fontSize: '13px', gap: '2px' },
    spinner: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px', flexDirection: 'column', gap: '16px' }
  };

  return (
    <div style={styles.page}>
      <div style={styles.title}>
        <Package size={24} /> My Orders
      </div>

      {loading ? (
        <div style={styles.spinner}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #F5E6D3', borderTop: '4px solid #4A2C2A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#4A2C2A' }}>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px', background: '#fff', borderRadius: '16px' }}>
          <p style={{ fontSize: '64px' }}>📦</p>
          <h2 style={{ color: '#4A2C2A', margin: '16px 0 8px' }}>No orders yet</h2>
          <p style={{ color: '#888', marginBottom: '24px' }}>Your order history will appear here</p>
          <Link to="/menu"><button className="btn-primary">Start Ordering</button></Link>
        </div>
      ) : (
        orders.map(order => {
          const statusInfo = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
          const itemSummary = order.items?.slice(0, 3).map(i => `${i.menuItem?.name || i.name} ×${i.quantity}`).join(', ');
          const extra = order.items?.length > 3 ? ` +${order.items.length - 3} more` : '';
          return (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              style={styles.orderCard}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(74,44,42,0.15)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(74,44,42,0.08)'}
            >
              <div style={styles.orderHeader}>
                <div>
                  <div style={styles.orderId}>Order #{order._id?.slice(-8).toUpperCase()}</div>
                  <div style={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span style={styles.statusBadge(order.status)}>
                  {statusInfo.label}
                </span>
              </div>
              <div style={styles.itemsList}>
                {itemSummary}{extra}
              </div>
              <div style={{ fontSize: '12px', color: '#aaa', background: '#F5E6D3', padding: '4px 10px', borderRadius: '20px', display: 'inline-block', alignSelf: 'flex-start' }}>
                {order.orderType === 'dine-in' ? '🍽️ Dine-In' : order.orderType === 'takeaway' ? '🛍️ Takeaway' : '🚚 Delivery'}
                {' · '}
                {order.paymentMethod === 'cod' ? '💵 COD' : '📱 UPI'}
              </div>
              <div style={styles.orderFooter}>
                <div style={styles.total}>₹{order.total}</div>
                <div style={styles.viewLink}>View Details <ChevronRight size={16} /></div>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
}
