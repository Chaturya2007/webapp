import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import api from '../api/axios';
import MenuItemCard from '../components/MenuItemCard';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'all', label: 'All Items', emoji: '🍴' },
  { id: 'beverages', label: 'Beverages', emoji: '☕' },
  { id: 'breakfast', label: 'Breakfast', emoji: '🥐' },
  { id: 'starters', label: 'Starters', emoji: '🥗' },
  { id: 'main-course', label: 'Main Course', emoji: '🍽️' },
  { id: 'pizza', label: 'Pizza', emoji: '🍕' },
  { id: 'burgers', label: 'Burgers', emoji: '🍔' },
  { id: 'sandwiches', label: 'Sandwiches', emoji: '🥪' },
  { id: 'desserts', label: 'Desserts', emoji: '🍰' },
];

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [vegFilter, setVegFilter] = useState('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    api.get('/menu')
      .then(res => setItems(res.data?.items || res.data || []))
      .catch(() => toast.error('Failed to load menu'))
      .finally(() => setLoading(false));
  }, []);

  const setCategory = (id) => {
    setSearchParams(id === 'all' ? {} : { category: id });
  };

  const filtered = items.filter(item => {
    const matchCat = activeCategory === 'all' || item.category === activeCategory;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());
    const matchVeg = vegFilter === 'all' || (vegFilter === 'veg' ? item.isVeg : !item.isVeg);
    return matchCat && matchSearch && matchVeg;
  });

  const styles = {
    page: { background: '#FFF8F0', minHeight: '100vh' },
    header: {
      background: '#4A2C2A',
      padding: '20px 24px',
      color: '#fff'
    },
    title: { fontSize: '22px', fontWeight: '800', color: '#D4AF37', marginBottom: '12px' },
    searchRow: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    searchWrap: {
      display: 'flex',
      alignItems: 'center',
      background: '#fff',
      borderRadius: '10px',
      padding: '8px 14px',
      gap: '8px',
      flex: 1,
      minWidth: '200px'
    },
    searchInput: {
      border: 'none',
      outline: 'none',
      fontSize: '14px',
      flex: 1,
      color: '#2C1810',
      background: 'transparent'
    },
    filterBtn: (active) => ({
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '13px',
      background: active ? '#D4AF37' : 'rgba(255,255,255,0.15)',
      color: active ? '#2C1810' : '#fff',
      transition: 'all 0.2s'
    }),
    catRow: {
      display: 'flex',
      gap: '0',
      overflowX: 'auto',
      background: '#fff',
      borderBottom: '1px solid #F5E6D3',
      scrollbarWidth: 'none'
    },
    catTab: (active) => ({
      padding: '14px 20px',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      fontWeight: active ? '700' : '500',
      fontSize: '13px',
      color: active ? '#4A2C2A' : '#888',
      borderBottom: active ? '3px solid #4A2C2A' : '3px solid transparent',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      background: 'none',
      border: 'none',
      borderBottomWidth: '3px',
      borderBottomStyle: 'solid',
      borderBottomColor: active ? '#4A2C2A' : 'transparent'
    }),
    content: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
    countBadge: {
      background: '#4A2C2A',
      color: '#D4AF37',
      borderRadius: '20px',
      padding: '3px 10px',
      fontSize: '12px',
      fontWeight: '700'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: '20px',
      marginTop: '16px'
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.title}>☕ Our Menu</div>
        <div style={styles.searchRow}>
          <div style={styles.searchWrap}>
            <Search size={16} color="#888" />
            <input
              style={styles.searchInput}
              placeholder="Search dishes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button style={styles.filterBtn(vegFilter === 'all')} onClick={() => setVegFilter('all')}>All</button>
          <button style={styles.filterBtn(vegFilter === 'veg')} onClick={() => setVegFilter('veg')}>🟢 Veg</button>
          <button style={styles.filterBtn(vegFilter === 'nonveg')} onClick={() => setVegFilter('nonveg')}>🔴 Non-Veg</button>
        </div>
      </div>

      <div style={styles.catRow}>
        {CATEGORIES.map(cat => (
          <button key={cat.id} style={styles.catTab(activeCategory === cat.id)} onClick={() => setCategory(cat.id)}>
            <span>{cat.emoji}</span> {cat.label}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <span style={{ fontWeight: '700', color: '#4A2C2A', fontSize: '15px' }}>
            {CATEGORIES.find(c => c.id === activeCategory)?.label || 'All Items'}
          </span>
          <span style={styles.countBadge}>{filtered.length} items</span>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px', height: '48px',
              border: '4px solid #F5E6D3', borderTop: '4px solid #4A2C2A',
              borderRadius: '50%', animation: 'spin 0.8s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: '#4A2C2A' }}>Loading menu...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#888' }}>
            <p style={{ fontSize: '48px' }}>🔍</p>
            <p style={{ marginTop: '12px', fontSize: '16px' }}>No items found. Try a different filter.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map(item => <MenuItemCard key={item._id} item={item} />)}
          </div>
        )}
      </div>
    </div>
  );
}
