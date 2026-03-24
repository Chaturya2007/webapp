import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import api from '../api/axios';

const STATUS_COLORS = {
  pending: '#F97316', confirmed: '#3B82F6', preparing: '#8B5CF6',
  ready: '#14B8A6', delivered: '#22C55E', cancelled: '#EF4444',
};

const MOCK_ORDERS = Array.from({ length: 10 }, (_, i) => ({
  _id: `ORD00${i + 1}`,
  customer: { name: ['Rahul Sharma','Priya Singh','Amit Kumar','Sneha Patel','Vikram Nair','Deepa Reddy','Suresh Iyer','Meena Joshi','Karan Mehta','Lata Rao'][i] },
  items: [{ name: ['Cappuccino','Masala Chai','Club Sandwich','Cold Coffee','Veg Burger'][i % 5], quantity: (i % 3) + 1 }],
  orderType: ['dine-in','takeaway','delivery'][i % 3],
  totalAmount: 150 + i * 80,
  paymentMethod: ['cod','upi','card'][i % 3],
  status: ['pending','confirmed','preparing','ready','delivered','cancelled','pending','confirmed','preparing','delivered'][i],
  createdAt: new Date(Date.now() - i * 600000).toISOString(),
}));

const PER_PAGE = 10;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [payFilter, setPayFilter] = useState('all');
  const [page, setPage] = useState(1);

  const fetchOrders = useCallback(() => {
    api.get('/admin/orders')
      .then(r => setOrders(r.data?.orders || r.data || MOCK_ORDERS))
      .catch(() => setOrders(MOCK_ORDERS))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  useEffect(() => {
    const url = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
    const socket = io(url, { transports: ['websocket', 'polling'] });
    socket.on('new-order', fetchOrders);
    socket.on('order-updated', fetchOrders);
    return () => socket.disconnect();
  }, [fetchOrders]);

  useEffect(() => {
    let result = orders;
    if (statusFilter !== 'all') result = result.filter(o => o.status === statusFilter);
    if (typeFilter !== 'all') result = result.filter(o => o.orderType === typeFilter);
    if (payFilter !== 'all') result = result.filter(o => o.paymentMethod === payFilter);
    setFiltered(result);
    setPage(1);
  }, [orders, statusFilter, typeFilter, payFilter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const selStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, background: '#fff', cursor: 'pointer' };

  return (
    <div>
      <div style={{ background: '#fff', borderRadius: 12, padding: 16, marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <select style={selStyle} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {['all','pending','confirmed','preparing','ready','delivered','cancelled'].map(s => <option key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select style={selStyle} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          {['all','dine-in','takeaway','delivery'].map(s => <option key={s} value={s}>{s === 'all' ? 'All Types' : s}</option>)}
        </select>
        <select style={selStyle} value={payFilter} onChange={e => setPayFilter(e.target.value)}>
          {['all','cod','upi','card'].map(s => <option key={s} value={s}>{s === 'all' ? 'All Payments' : s.toUpperCase()}</option>)}
        </select>
        <span style={{ marginLeft: 'auto', color: '#888', fontSize: 13, alignSelf: 'center' }}>{filtered.length} orders</span>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#888' }}>Loading orders...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #f3f4f6' }}>
                  {['ID','Customer','Items','Type','Total','Payment','Status','Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: '#555', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map(o => (
                  <tr key={o._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px 14px', color: '#4A2C2A', fontWeight: 600 }}>#{o._id?.slice(-5) || o._id}</td>
                    <td style={{ padding: '12px 14px' }}>{o.customer?.name}</td>
                    <td style={{ padding: '12px 14px', color: '#666', maxWidth: 150 }}>{o.items?.map(i => `${i.name}×${i.quantity}`).join(', ')}</td>
                    <td style={{ padding: '12px 14px' }}><span style={{ background: '#f3f4f6', padding: '2px 8px', borderRadius: 12, fontSize: 12 }}>{o.orderType}</span></td>
                    <td style={{ padding: '12px 14px', fontWeight: 600 }}>₹{o.totalAmount}</td>
                    <td style={{ padding: '12px 14px', textTransform: 'uppercase', fontSize: 12, color: '#666' }}>{o.paymentMethod}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <select
                        value={o.status}
                        onChange={e => updateStatus(o._id, e.target.value)}
                        style={{ ...selStyle, background: STATUS_COLORS[o.status] + '22', color: STATUS_COLORS[o.status], fontWeight: 600, border: 'none' }}
                      >
                        {['pending','confirmed','preparing','ready','delivered','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#888' }}>{new Date(o.createdAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid #e5e7eb', background: page === 1 ? '#f9fafb' : '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', color: '#333' }}>Prev</button>
            <span style={{ color: '#666', fontSize: 13 }}>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid #e5e7eb', background: page === totalPages ? '#f9fafb' : '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer', color: '#333' }}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
