import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users?page=${page}&limit=10`);
      setCustomers(res.data.users || res.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  const styles = {
    page: { padding: '24px' },
    topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
    title: { fontSize: '24px', fontWeight: '700', color: '#4A2C2A' },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' },
    statCard: { background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' },
    statNum: { fontSize: '28px', fontWeight: '700', color: '#4A2C2A' },
    statLabel: { fontSize: '13px', color: '#888', marginTop: '4px' },
    searchInput: { padding: '10px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', width: '300px', outline: 'none' },
    table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    th: { padding: '14px 16px', textAlign: 'left', background: '#4A2C2A', color: 'white', fontSize: '13px', fontWeight: '600' },
    td: { padding: '14px 16px', borderBottom: '1px solid #f0f0f0', fontSize: '13px', color: '#333' },
    avatar: { width: '36px', height: '36px', borderRadius: '50%', background: '#4A2C2A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', marginRight: '10px' },
    nameCell: { display: 'flex', alignItems: 'center' },
    pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '20px' },
    pageBtn: { padding: '8px 16px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', background: 'white', fontSize: '13px' },
    pageInfo: { fontSize: '13px', color: '#666' }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#4A2C2A' }}>Loading customers...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <h1 style={styles.title}>Customers</h1>
        <input style={styles.searchInput} placeholder="Search by name, email, phone..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statNum}>{customers.length}</div>
          <div style={styles.statLabel}>Total Customers (This Page)</div>
        </div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            {['Customer', 'Email', 'Phone', 'Joined', 'Role'].map(h => (
              <th key={h} style={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={5} style={{ ...styles.td, textAlign: 'center', padding: '32px', color: '#999' }}>No customers found</td></tr>
          ) : filtered.map(c => (
            <tr key={c._id}>
              <td style={styles.td}>
                <div style={styles.nameCell}>
                  <div style={styles.avatar}>{(c.name || 'U')[0].toUpperCase()}</div>
                  <span style={{ fontWeight: '600', color: '#2C1810' }}>{c.name || 'Unknown'}</span>
                </div>
              </td>
              <td style={styles.td}>{c.email}</td>
              <td style={styles.td}>{c.phone || '—'}</td>
              <td style={styles.td}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</td>
              <td style={styles.td}>
                <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: c.role === 'admin' ? '#fff3e0' : '#e8f5e9', color: c.role === 'admin' ? '#e65100' : '#2e7d32' }}>
                  {c.role || 'user'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button style={styles.pageBtn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
          <span style={styles.pageInfo}>Page {page} of {totalPages}</span>
          <button style={styles.pageBtn} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
        </div>
      )}
    </div>
  );
}
