import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const STARS = [1, 2, 3, 4, 5];

function StarRating({ value }) {
  return (
    <span>
      {STARS.map(s => (
        <span key={s} style={{ color: s <= value ? '#D4AF37' : '#ddd', fontSize: '16px' }}>★</span>
      ))}
    </span>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/admin/reviews');
      setReviews(res.data.reviews || res.data || []);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const filtered = reviews.filter(r => {
    const matchRating = ratingFilter ? r.rating === parseInt(ratingFilter) : true;
    const matchSearch = search
      ? r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.menuItem?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.comment?.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchRating && matchSearch;
  });

  // Compute average rating per item
  const itemRatings = {};
  reviews.forEach(r => {
    const name = r.menuItem?.name || 'Unknown';
    if (!itemRatings[name]) itemRatings[name] = { total: 0, count: 0 };
    itemRatings[name].total += r.rating;
    itemRatings[name].count += 1;
  });
  const topItems = Object.entries(itemRatings)
    .map(([name, d]) => ({ name, avg: (d.total / d.count).toFixed(1), count: d.count }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 5);

  const overallAvg = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const styles = {
    page: { padding: '24px' },
    topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
    title: { fontSize: '24px', fontWeight: '700', color: '#4A2C2A' },
    filters: { display: 'flex', gap: '12px', alignItems: 'center' },
    searchInput: { padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', width: '240px' },
    select: { padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none' },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' },
    statCard: { background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' },
    statNum: { fontSize: '28px', fontWeight: '700', color: '#D4AF37' },
    statLabel: { fontSize: '13px', color: '#888', marginTop: '4px' },
    topItemsCard: { background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' },
    topItemsTitle: { fontSize: '16px', fontWeight: '700', color: '#4A2C2A', marginBottom: '16px' },
    itemRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f5f5f5' },
    table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    th: { padding: '14px 16px', textAlign: 'left', background: '#4A2C2A', color: 'white', fontSize: '13px', fontWeight: '600' },
    td: { padding: '14px 16px', borderBottom: '1px solid #f0f0f0', fontSize: '13px', color: '#333' },
    comment: { maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#555' }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#4A2C2A' }}>Loading reviews...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <h1 style={styles.title}>Reviews & Ratings</h1>
        <div style={styles.filters}>
          <input style={styles.searchInput} placeholder="Search reviews..." value={search} onChange={e => setSearch(e.target.value)} />
          <select style={styles.select} value={ratingFilter} onChange={e => setRatingFilter(e.target.value)}>
            <option value="">All Ratings</option>
            {STARS.map(s => <option key={s} value={s}>{s} ★</option>)}
          </select>
        </div>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statNum}>{overallAvg} ★</div>
          <div style={styles.statLabel}>Overall Rating</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNum}>{reviews.length}</div>
          <div style={styles.statLabel}>Total Reviews</div>
        </div>
        {[5, 4, 3].map(s => (
          <div key={s} style={styles.statCard}>
            <div style={styles.statNum}>{reviews.filter(r => r.rating === s).length}</div>
            <div style={styles.statLabel}>{s} Star Reviews</div>
          </div>
        ))}
      </div>

      {topItems.length > 0 && (
        <div style={styles.topItemsCard}>
          <div style={styles.topItemsTitle}>🏆 Top Rated Items</div>
          {topItems.map((item, i) => (
            <div key={i} style={styles.itemRow}>
              <span style={{ fontWeight: '600', color: '#2C1810' }}>{item.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#D4AF37', fontWeight: '700' }}>★ {item.avg}</span>
                <span style={{ fontSize: '12px', color: '#888' }}>({item.count} reviews)</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <table style={styles.table}>
        <thead>
          <tr>
            {['Customer', 'Item', 'Rating', 'Comment', 'Date'].map(h => (
              <th key={h} style={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={5} style={{ ...styles.td, textAlign: 'center', padding: '32px', color: '#999' }}>No reviews found</td></tr>
          ) : filtered.map(r => (
            <tr key={r._id}>
              <td style={styles.td}><span style={{ fontWeight: '600', color: '#2C1810' }}>{r.user?.name || 'Anonymous'}</span></td>
              <td style={styles.td}>{r.menuItem?.name || '—'}</td>
              <td style={styles.td}><StarRating value={r.rating} /></td>
              <td style={styles.td}><span style={styles.comment} title={r.comment}>{r.comment || '—'}</span></td>
              <td style={styles.td}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
