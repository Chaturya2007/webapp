import { useState, useEffect } from 'react';
import { ShoppingBag, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import api from '../api/axios';

const MOCK_STATS = { todayOrders: 24, totalRevenue: 18450, pendingOrders: 7, deliveredOrders: 15 };
const MOCK_ORDERS = [
  { _id: 'ORD001', customer: { name: 'Rahul Sharma' }, items: [{ name: 'Cappuccino', quantity: 2 }], totalAmount: 350, status: 'pending', createdAt: new Date().toISOString() },
  { _id: 'ORD002', customer: { name: 'Priya Singh' }, items: [{ name: 'Club Sandwich', quantity: 1 }, { name: 'Cold Coffee', quantity: 1 }], totalAmount: 520, status: 'preparing', createdAt: new Date().toISOString() },
  { _id: 'ORD003', customer: { name: 'Amit Kumar' }, items: [{ name: 'Masala Chai', quantity: 3 }], totalAmount: 180, status: 'delivered', createdAt: new Date().toISOString() },
  { _id: 'ORD004', customer: { name: 'Sneha Patel' }, items: [{ name: 'Veg Burger', quantity: 2 }], totalAmount: 440, status: 'confirmed', createdAt: new Date().toISOString() },
  { _id: 'ORD005', customer: { name: 'Vikram Nair' }, items: [{ name: 'Cold Coffee', quantity: 1 }], totalAmount: 150, status: 'cancelled', createdAt: new Date().toISOString() },
];
const MOCK_TOP_ITEMS = [
  { name: 'Cappuccino', count: 48 },
  { name: 'Masala Chai', count: 35 },
  { name: 'Club Sandwich', count: 28 },
  { name: 'Veg Burger', count: 22 },
  { name: 'Cold Coffee', count: 18 },
];

const STATUS_COLORS = {
  pending: '#F97316', confirmed: '#3B82F6', preparing: '#8B5CF6',
  ready: '#14B8A6', delivered: '#22C55E', cancelled: '#EF4444',
};

function StatCard({ icon: Icon, value, label, bg, iconColor }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 24, flex: 1, minWidth: 160, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ background: bg, borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={24} color={iconColor || '#fff'} />
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a' }}>{value}</div>
        <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 24, flex: 1, minWidth: 160, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', animation: 'pulse 1.5s infinite' }}>
      <div style={{ background: '#e5e7eb', borderRadius: 8, height: 48, width: 48, marginBottom: 12 }} />
      <div style={{ background: '#e5e7eb', borderRadius: 4, height: 28, width: 80, marginBottom: 8 }} />
      <div style={{ background: '#e5e7eb', borderRadius: 4, height: 14, width: 120 }} />
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(r => {
        setStats(r.data.stats || MOCK_STATS);
        setOrders(r.data.recentOrders || MOCK_ORDERS);
        setTopItems(r.data.topItems || MOCK_TOP_ITEMS);
      })
      .catch(() => {
        setStats(MOCK_STATS);
        setOrders(MOCK_ORDERS);
        setTopItems(MOCK_TOP_ITEMS);
      })
      .finally(() => setLoading(false));
  }, []);

  const maxCount = topItems.length ? Math.max(...topItems.map(i => i.count)) : 1;

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        {loading ? (
          [1,2,3,4].map(k => <SkeletonCard key={k} />)
        ) : (
          <>
            <StatCard icon={ShoppingBag} value={stats.todayOrders} label="Today's Orders" bg="#D4AF37" iconColor="#fff" />
            <StatCard icon={TrendingUp} value={`₹${stats.totalRevenue?.toLocaleString()}`} label="Total Revenue" bg="#4A2C2A" iconColor="#D4AF37" />
            <StatCard icon={Clock} value={stats.pendingOrders} label="Pending Orders" bg="#F97316" iconColor="#fff" />
            <StatCard icon={CheckCircle} value={stats.deliveredOrders} label="Delivered Orders" bg="#22C55E" iconColor="#fff" />
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, flex: 2, minWidth: 300, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#4A2C2A', marginBottom: 16 }}>Recent Orders</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                {['Order ID','Customer','Items','Total','Status','Time'].map(h => (
                  <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: '#666', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <>
                  <tr key={o._id} onClick={() => setExpanded(expanded === o._id ? null : o._id)}
                    style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer', background: expanded === o._id ? '#fdf8f0' : 'transparent' }}>
                    <td style={{ padding: '10px 10px', color: '#4A2C2A', fontWeight: 600 }}>#{o._id?.slice(-5) || o._id}</td>
                    <td style={{ padding: '10px 10px' }}>{o.customer?.name || 'N/A'}</td>
                    <td style={{ padding: '10px 10px', color: '#666' }}>{o.items?.map(i => i.name).join(', ').slice(0,30)}{o.items?.length > 1 ? '...' : ''}</td>
                    <td style={{ padding: '10px 10px', fontWeight: 600 }}>₹{o.totalAmount}</td>
                    <td style={{ padding: '10px 10px' }}>
                      <span style={{ background: STATUS_COLORS[o.status] + '22', color: STATUS_COLORS[o.status], padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>{o.status}</span>
                    </td>
                    <td style={{ padding: '10px 10px', color: '#888', fontSize: 12 }}>{new Date(o.createdAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</td>
                  </tr>
                  {expanded === o._id && (
                    <tr key={o._id + '-exp'} style={{ background: '#fdf8f0' }}>
                      <td colSpan={6} style={{ padding: '10px 20px' }}>
                        <strong style={{ color: '#4A2C2A' }}>Items:</strong>
                        <ul style={{ margin: '6px 0 0 16px' }}>
                          {o.items?.map((item, idx) => (
                            <li key={idx} style={{ fontSize: 13, color: '#444', marginBottom: 2 }}>{item.name} × {item.quantity} — ₹{item.price || ''}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 20, flex: 1, minWidth: 220, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#4A2C2A', marginBottom: 16 }}>Top Selling Items</h3>
          {topItems.map((item, idx) => (
            <div key={idx} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span style={{ color: '#333', fontWeight: 500 }}>{item.name}</span>
                <span style={{ color: '#888' }}>{item.count}</span>
              </div>
              <div style={{ background: '#f3f4f6', borderRadius: 6, height: 8 }}>
                <div style={{ background: '#D4AF37', borderRadius: 6, height: 8, width: `${(item.count / maxCount) * 100}%`, transition: 'width 0.4s' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
