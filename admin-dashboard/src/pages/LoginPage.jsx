import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Coffee, AlertCircle } from 'lucide-react';

const COFFEE_BROWN = '#4A2C2A';
const GOLD = '#D4AF37';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Email is required'); return; }
    if (!password.trim()) { setError('Password is required'); return; }
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      backgroundColor: '#F5F5F5',
    }}>
      {/* Left panel */}
      <div style={{
        width: '40%', minWidth: 300,
        backgroundColor: COFFEE_BROWN,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 40,
      }}>
        <Coffee size={64} color={GOLD} />
        <h1 style={{ color: GOLD, fontSize: 28, fontWeight: 800, marginTop: 16, textAlign: 'center' }}>
          Café Tranquil
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8, textAlign: 'center', fontSize: 14 }}>
          Admin Management Portal
        </p>
        <div style={{
          marginTop: 48, padding: '20px 24px',
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderRadius: 12, width: '100%', maxWidth: 280
        }}>
          {['Manage orders in real-time', 'Track revenue & analytics', 'Manage menu & customers'].map(item => (
            <div key={item} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              color: 'rgba(255,255,255,0.8)', fontSize: 13,
              marginBottom: 12
            }}>
              <span style={{ color: GOLD, fontSize: 16 }}>✓</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div style={{
        flex: 1, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: 40,
      }}>
        <div style={{
          width: '100%', maxWidth: 400,
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 40,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: COFFEE_BROWN, marginBottom: 4 }}>
            Welcome back
          </h2>
          <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 28 }}>
            Sign in to your admin account
          </p>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              backgroundColor: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 8, padding: '10px 14px', marginBottom: 20,
              color: '#dc2626', fontSize: 14,
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@cafetranquil.com"
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1px solid #d1d5db', borderRadius: 8,
                  fontSize: 14, outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = COFFEE_BROWN}
                onBlur={e => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1px solid #d1d5db', borderRadius: 8,
                  fontSize: 14, outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = COFFEE_BROWN}
                onBlur={e => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px',
                backgroundColor: loading ? '#9ca3af' : COFFEE_BROWN,
                color: '#fff', border: 'none',
                borderRadius: 8, fontSize: 15, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
