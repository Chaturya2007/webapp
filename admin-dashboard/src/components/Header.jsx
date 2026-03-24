import { Bell, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const COFFEE_BROWN = '#4A2C2A';
const GOLD = '#D4AF37';

export default function Header({ title, newOrderCount, onMenuClick }) {
  const { admin } = useAuth();

  return (
    <header style={{
      height: 64,
      backgroundColor: '#fff',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={onMenuClick}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'none', padding: 4,
            color: COFFEE_BROWN,
          }}
          className="mobile-menu-btn"
        >
          <Menu size={22} />
        </button>
        <h1 style={{
          fontSize: 20, fontWeight: 700,
          color: COFFEE_BROWN, margin: 0
        }}>
          {title}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <Bell size={22} color="#6b7280" />
          {newOrderCount > 0 && (
            <span style={{
              position: 'absolute',
              top: -6, right: -6,
              backgroundColor: '#ef4444',
              color: '#fff',
              borderRadius: '50%',
              width: 18, height: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700,
              animation: 'pulse 1s infinite',
            }}>
              {newOrderCount > 9 ? '9+' : newOrderCount}
            </span>
          )}
        </div>

        {/* Admin info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34,
            borderRadius: '50%',
            backgroundColor: COFFEE_BROWN,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: GOLD,
            fontWeight: 700,
            fontSize: 14,
          }}>
            {admin?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1f2937' }}>
              {admin?.name || 'Admin'}
            </div>
            <div style={{ fontSize: 11, color: '#6b7280' }}>Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
}
