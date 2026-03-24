import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#4A2C2A', '#D4AF37', '#8B5E3C', '#C8A882', '#6B3A2A'];

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics')
      .then(res => setData(res.data))
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  const styles = {
    page: { padding: '24px' },
    title: { fontSize: '24px', fontWeight: '700', color: '#4A2C2A', marginBottom: '24px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px' },
    card: { background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    cardTitle: { fontSize: '16px', fontWeight: '700', color: '#4A2C2A', marginBottom: '20px' }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#4A2C2A' }}>Loading analytics...</div>;
  if (!data) return <div style={{ padding: '40px', textAlign: 'center', color: '#e74c3c' }}>Failed to load analytics</div>;

  const revenueData = data.revenueByDay || [];
  const ordersByType = data.ordersByType || [];
  const paymentDist = data.paymentDistribution || [];
  const peakHours = data.peakHours || [];

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Analytics</h1>
      <div style={styles.grid}>
        <div style={{ ...styles.card, gridColumn: 'span 2' }}>
          <div style={styles.cardTitle}>📈 Revenue (Last 7 Days)</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${v}`} />
              <Tooltip formatter={v => [`₹${v}`, 'Revenue']} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} dot={{ fill: '#4A2C2A' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>🍽️ Orders by Type</div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={ordersByType} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={90} label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}>
                {ordersByType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>💳 Payment Distribution</div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={paymentDist} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={90} label={({ _id, percent }) => `${_id?.toUpperCase()} ${(percent * 100).toFixed(0)}%`}>
                {paymentDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...styles.card, gridColumn: 'span 2' }}>
          <div style={styles.cardTitle}>⏰ Peak Order Hours</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={peakHours}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="_id" tick={{ fontSize: 12 }} tickFormatter={h => `${h}:00`} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip labelFormatter={h => `${h}:00`} />
              <Bar dataKey="count" fill="#4A2C2A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
