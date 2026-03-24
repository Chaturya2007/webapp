import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import MenuItemCard from '../components/MenuItemCard';
import CategoryCard from '../components/CategoryCard';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '🍴' },
  { id: 'beverages', label: 'Beverages', emoji: '☕' },
  { id: 'breakfast', label: 'Breakfast', emoji: '🥐' },
  { id: 'starters', label: 'Starters', emoji: '🥗' },
  { id: 'main-course', label: 'Main Course', emoji: '🍽️' },
  { id: 'pizza', label: 'Pizza', emoji: '🍕' },
  { id: 'burgers', label: 'Burgers', emoji: '🍔' },
  { id: 'sandwiches', label: 'Sandwiches', emoji: '🥪' },
  { id: 'desserts', label: 'Desserts', emoji: '🍰' },
];

export default function HomePage() {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/menu')
      .then(res => setMenuItems(res.data?.items || res.data || []))
      .catch(() => toast.error('Failed to load menu'))
      .finally(() => setLoading(false));
  }, []);

  const featured = menuItems.filter(i => i.isAvailable !== false).slice(0, 6);
  const filtered = search
    ? menuItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.description?.toLowerCase().includes(search.toLowerCase()))
    : [];

  const styles = {
    hero: {
      background: 'linear-gradient(135deg, #4A2C2A 0%, #2C1810 60%, #6b3a35 100%)',
      padding: '60px 24px',
      textAlign: 'center',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden'
    },
    heroEmoji: { fontSize: '56px', marginBottom: '16px', display: 'block' },
    heroTitle: {
      fontSize: 'clamp(28px, 5vw, 48px)',
      fontWeight: '800',
      color: '#D4AF37',
      marginBottom: '12px',
      lineHeight: 1.2
    },
    heroSub: {
      fontSize: '16px',
      color: '#F5E6D3',
      marginBottom: '32px',
      opacity: 0.9
    },
    searchBar: {
      display: 'flex',
      alignItems: 'center',
      background: '#fff',
      borderRadius: '50px',
      padding: '12px 20px',
      maxWidth: '480px',
      margin: '0 auto',
      gap: '10px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
    },
    searchInput: {
      flex: 1,
      border: 'none',
      outline: 'none',
      fontSize: '15px',
      color: '#2C1810',
      background: 'transparent'
    },
    section: { padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' },
    sectionTitle: {
      fontSize: '22px',
      fontWeight: '800',
      color: '#4A2C2A',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    categoryRow: {
      display: 'flex',
      gap: '14px',
      overflowX: 'auto',
      paddingBottom: '8px',
      scrollbarWidth: 'thin'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: '20px'
    },
    orderBtn: {
      background: '#D4AF37',
      color: '#2C1810',
      border: 'none',
      borderRadius: '50px',
      padding: '14px 32px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      marginTop: '16px',
      transition: 'all 0.2s'
    },
    spinner: {
      display: 'flex',
      justifyContent: 'center',
      padding: '60px',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px'
    }
  };

  return (
    <div>
      {/* Hero */}
      <div style={styles.hero}>
        <span style={styles.heroEmoji}>☕</span>
        <h1 style={styles.heroTitle}>Order from Café Tranquil</h1>
        <p style={styles.heroSub}>Freshly brewed coffee, artisan food — delivered to you</p>
        <div style={styles.searchBar}>
          <Search size={18} color="#4A2C2A" />
          <input
            style={styles.searchInput}
            placeholder="Search for coffee, food, desserts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button style={styles.orderBtn} onClick={() => navigate('/menu')}
          onMouseEnter={e => { e.currentTarget.style.background = '#b8962d'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#D4AF37'; e.currentTarget.style.transform = 'none'; }}>
          Explore Full Menu →
        </button>
      </div>

      {/* Search Results */}
      {search && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>🔍 Search Results for "{search}"</div>
          {filtered.length === 0
            ? <p style={{ color: '#888' }}>No items found.</p>
            : <div style={styles.grid}>{filtered.map(item => <MenuItemCard key={item._id} item={item} />)}</div>
          }
        </div>
      )}

      {/* Categories */}
      {!search && (
        <>
          <div style={styles.section}>
            <div style={styles.sectionTitle}>🗂️ Categories</div>
            <div style={styles.categoryRow}>
              {CATEGORIES.map(cat => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  selected={false}
                  onClick={() => navigate(`/menu?category=${cat.id}`)}
                />
              ))}
            </div>
          </div>

          {/* Featured */}
          <div style={{ ...styles.section, paddingTop: 0 }}>
            <div style={styles.sectionTitle}>⭐ Recommended for You</div>
            {loading ? (
              <div style={styles.spinner}>
                <div style={{
                  width: '40px', height: '40px',
                  border: '4px solid #F5E6D3',
                  borderTop: '4px solid #4A2C2A',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ color: '#4A2C2A' }}>Loading menu...</p>
              </div>
            ) : (
              <>
                <div style={styles.grid}>
                  {featured.map(item => <MenuItemCard key={item._id} item={item} />)}
                </div>
                {featured.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    <p style={{ fontSize: '48px' }}>🍽️</p>
                    <p>No items available right now.</p>
                  </div>
                )}
                {menuItems.length > 6 && (
                  <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <button className="btn-primary" onClick={() => navigate('/menu')}>
                      View Full Menu ({menuItems.length} items)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
