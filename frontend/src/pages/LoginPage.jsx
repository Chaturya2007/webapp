import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back! ☕');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4A2C2A 0%, #2C1810 50%, #4A2C2A 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    },
    card: {
      background: '#fff',
      borderRadius: '24px',
      padding: '40px',
      width: '100%',
      maxWidth: '420px',
      boxShadow: '0 24px 48px rgba(0,0,0,0.3)'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    logo: {
      fontSize: '48px',
      lineHeight: 1,
      marginBottom: '8px'
    },
    brand: {
      fontSize: '24px',
      fontWeight: '800',
      color: '#4A2C2A',
      marginBottom: '4px'
    },
    subtitle: {
      color: '#888',
      fontSize: '14px'
    },
    label: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '600',
      color: '#4A2C2A',
      marginBottom: '6px'
    },
    inputWrap: {
      position: 'relative',
      marginBottom: '18px'
    },
    inputIcon: {
      position: 'absolute',
      left: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#aaa'
    },
    input: {
      width: '100%',
      padding: '12px 14px 12px 42px',
      border: '1.5px solid #e8d5c0',
      borderRadius: '10px',
      fontSize: '15px',
      outline: 'none',
      background: '#FAFAFA',
      color: '#2C1810',
      transition: 'border-color 0.2s'
    },
    eyeBtn: {
      position: 'absolute',
      right: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#aaa'
    },
    error: {
      background: '#fff5f5',
      border: '1px solid #e74c3c',
      color: '#e74c3c',
      borderRadius: '8px',
      padding: '10px 14px',
      fontSize: '13px',
      marginBottom: '16px'
    },
    submitBtn: {
      width: '100%',
      background: '#4A2C2A',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      padding: '14px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.7 : 1,
      transition: 'all 0.2s',
      marginTop: '6px'
    },
    divider: {
      textAlign: 'center',
      margin: '20px 0',
      color: '#ccc',
      fontSize: '13px',
      position: 'relative'
    },
    signupLink: {
      textAlign: 'center',
      fontSize: '14px',
      color: '#666'
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>☕</div>
          <div style={styles.brand}>Café Tranquil</div>
          <div style={styles.subtitle}>Sign in to your account</div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div style={styles.error}>{error}</div>}

          <div>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}><Mail size={16} /></span>
              <input
                style={styles.input}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                onFocus={e => e.target.style.borderColor = '#4A2C2A'}
                onBlur={e => e.target.style.borderColor = '#e8d5c0'}
              />
            </div>
          </div>

          <div>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}><Lock size={16} /></span>
              <input
                style={styles.input}
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                onFocus={e => e.target.style.borderColor = '#4A2C2A'}
                onBlur={e => e.target.style.borderColor = '#e8d5c0'}
              />
              <button type="button" style={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={{ background: '#fff', padding: '0 12px', position: 'relative', zIndex: 1 }}>
            Don't have an account?
          </span>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: '#e8d5c0', zIndex: 0 }} />
        </div>

        <div style={styles.signupLink}>
          <Link to="/signup" style={{ color: '#4A2C2A', fontWeight: '700' }}>
            Create an account →
          </Link>
        </div>
      </div>
    </div>
  );
}
