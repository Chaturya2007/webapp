import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed,
  Users, Star, BarChart3, LogOut, Coffee
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const COFFEE_BROWN = '#4A2C2A';
const GOLD = '#D4AF37';
const SIDEBAR_WIDTH = 240;

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/menu', icon: UtensilsCrossed, label: 'Menu' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/reviews', icon: Star, label: 'Reviews' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarStyle = {
    width: SIDEBAR_WIDTH,
    minHeight: '100vh',
    backgroundColor: COFFEE_BROWN,
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
    transition: 'transform 0.3s ease',
    boxShadow: '2px 0 8px rgba(0,0,0,0.3)',
  };

  const mobileSidebarStyle = {
    ...sidebarStyle,
    transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 99, display: isMobile ? 'block' : 'none'
          }}
        />
      )}
      <nav style={isMobile ? mobileSidebarStyle : sidebarStyle}>
        {/* Logo */}
        <div style={{
          padding: '24px 20px',
          borderBottom: `1px solid rgba(212,175,55,0.3)`,
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <Coffee size={28} color={GOLD} />
          <div>
            <div style={{ color: GOLD, fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>
              Café Tranquil
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Admin Panel</div>
          </div>
        </div>

        {/* Nav Items */}
        <div style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 20px',
                color: isActive ? GOLD : 'rgba(255,255,255,0.75)',
                textDecoration: 'none',
                backgroundColor: isActive ? 'rgba(212,175,55,0.15)' : 'transparent',
                borderLeft: isActive ? `3px solid ${GOLD}` : '3px solid transparent',
                fontWeight: isActive ? 600 : 400,
                fontSize: 14,
                transition: 'all 0.2s',
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Logout */}
        <div style={{ padding: '16px', borderTop: `1px solid rgba(212,175,55,0.3)` }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 16px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: 8,
              color: 'rgba(255,255,255,0.75)',
              cursor: 'pointer',
              fontSize: 14,
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,80,80,0.2)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}
