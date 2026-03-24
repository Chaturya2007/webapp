import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
    setUserMenuOpen(false);
  };

  const styles = {
    nav: {
      background: '#4A2C2A',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(74,44,42,0.3)'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '20px',
      fontWeight: '700',
      color: '#D4AF37',
      cursor: 'pointer',
      textDecoration: 'none'
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      listStyle: 'none'
    },
    navLink: {
      color: '#F5E6D3',
      fontWeight: '500',
      fontSize: '15px',
      transition: 'color 0.2s',
      cursor: 'pointer',
      textDecoration: 'none'
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    cartBtn: {
      position: 'relative',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#F5E6D3',
      display: 'flex',
      alignItems: 'center',
      padding: '8px'
    },
    badge: {
      position: 'absolute',
      top: '2px',
      right: '2px',
      background: '#D4AF37',
      color: '#2C1810',
      borderRadius: '50%',
      width: '18px',
      height: '18px',
      fontSize: '11px',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    userBtn: {
      background: 'rgba(255,255,255,0.15)',
      border: '1px solid rgba(212,175,55,0.5)',
      borderRadius: '50%',
      width: '36px',
      height: '36px',
      cursor: 'pointer',
      color: '#D4AF37',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    dropdown: {
      position: 'absolute',
      top: '64px',
      right: '16px',
      background: '#fff',
      border: '1px solid #F5E6D3',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(74,44,42,0.15)',
      minWidth: '180px',
      overflow: 'hidden',
      zIndex: 1001
    },
    dropdownItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 16px',
      color: '#2C1810',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background 0.2s',
      fontSize: '14px',
      textDecoration: 'none'
    },
    mobileMenu: {
      display: menuOpen ? 'flex' : 'none',
      flexDirection: 'column',
      position: 'absolute',
      top: '64px',
      left: 0,
      right: 0,
      background: '#4A2C2A',
      padding: '16px 24px',
      gap: '16px',
      borderTop: '1px solid rgba(212,175,55,0.3)',
      zIndex: 999
    }
  };

  return (
    <>
      <nav style={styles.nav}>
        <Link to="/" style={styles.logo}>
          <span style={{ fontSize: '24px' }}>☕</span>
          <span>Café Tranquil</span>
        </Link>

        {isAuthenticated && (
          <ul style={{ ...styles.navLinks, display: 'none', '@media(min-width:768px)': { display: 'flex' } }} className="nav-links-desktop">
            <li><Link to="/" style={styles.navLink}>Home</Link></li>
            <li><Link to="/menu" style={styles.navLink}>Menu</Link></li>
            <li><Link to="/orders" style={styles.navLink}>Orders</Link></li>
          </ul>
        )}

        <div style={styles.actions}>
          {isAuthenticated && (
            <>
              <Link to="/cart" style={{ ...styles.cartBtn, textDecoration: 'none' }}>
                <ShoppingCart size={22} color="#F5E6D3" />
                {itemCount > 0 && <span style={styles.badge}>{itemCount}</span>}
              </Link>

              <div style={{ position: 'relative' }}>
                <button style={styles.userBtn} onClick={() => setUserMenuOpen(!userMenuOpen)}>
                  <User size={18} />
                </button>
                {userMenuOpen && (
                  <div style={styles.dropdown}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #F5E6D3' }}>
                      <div style={{ fontWeight: '700', color: '#4A2C2A', fontSize: '14px' }}>{user?.name}</div>
                      <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{user?.email}</div>
                    </div>
                    <Link to="/profile" style={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}
                      onMouseEnter={e => e.currentTarget.style.background = '#FFF8F0'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <User size={15} /> Profile
                    </Link>
                    <Link to="/orders" style={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}
                      onMouseEnter={e => e.currentTarget.style.background = '#FFF8F0'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <Package size={15} /> My Orders
                    </Link>
                    <div style={{ ...styles.dropdownItem, color: '#c0392b', borderTop: '1px solid #F5E6D3' }}
                      onClick={handleLogout}
                      onMouseEnter={e => e.currentTarget.style.background = '#FFF8F0'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <LogOut size={15} /> Logout
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {isAuthenticated && (
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F5E6D3', display: 'none' }}
              className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}
        </div>
      </nav>

      {isAuthenticated && (
        <div style={styles.mobileMenu}>
          <Link to="/" style={{ color: '#F5E6D3', fontWeight: '500' }} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/menu" style={{ color: '#F5E6D3', fontWeight: '500' }} onClick={() => setMenuOpen(false)}>Menu</Link>
          <Link to="/orders" style={{ color: '#F5E6D3', fontWeight: '500' }} onClick={() => setMenuOpen(false)}>Orders</Link>
          <Link to="/profile" style={{ color: '#F5E6D3', fontWeight: '500' }} onClick={() => setMenuOpen(false)}>Profile</Link>
        </div>
      )}

      {userMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }} onClick={() => setUserMenuOpen(false)} />
      )}

      <style>{`
        @media (min-width: 768px) {
          .nav-links-desktop { display: flex !important; }
          .hamburger { display: none !important; }
        }
        @media (max-width: 767px) {
          .nav-links-desktop { display: none !important; }
          .hamburger { display: flex !important; }
        }
        .dropdown-item:hover { background: #FFF8F0; }
      `}</style>
    </>
  );
}
