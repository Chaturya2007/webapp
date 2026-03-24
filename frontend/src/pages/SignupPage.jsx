import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password, form.phone);
      toast.success('Account created! Welcome ☕');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
      maxWidth: '440px',
      boxShadow: '0 24px 48px rgba(0,0,0,0.3)'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    logo: { fontSize: '48px', lineHeight: 1, marginBottom: '8px' },
    brand: { fontSize: '24px', fontWeight: '800', color: '#4A2C2A', marginBottom: '4px' },
    subtitle: { color: '#888', fontSize: '14px' },
    label: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '600',
      color: '#4A2C2A',
      marginBottom: '6px'
    },
    inputWrap: { position: 'relative', marginBottom: '16px' },
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
    }
  };

  const inputFocus = (e) => { e.target.style.borderColor = '#4A2C2A'; };
  const inputBlur = (e) => { e.target.style.borderColor = '#e8d5c0'; };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>☕</div>
          <div style={styles.brand}>Café Tranquil</div>
          <div style={styles.subtitle}>Create your account</div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div style={styles.error}>{error}</div>}

          <label style={styles.label}>Full Name</label>
          <div style={styles.inputWrap}>
            <span style={styles.inputIcon}><User size={16} /></span>
            <input style={styles.input} name="name" placeholder="John Doe" value={form.name}
              onChange={handleChange} required onFocus={inputFocus} onBlur={inputBlur} />
          </div>

          <label style={styles.label}>Email Address</label>
          <div style={styles.inputWrap}>
            <span style={styles.inputIcon}><Mail size={16} /></span>
            <input style={styles.input} type="email" name="email" placeholder="you@example.com" value={form.email}
              onChange={handleChange} required onFocus={inputFocus} onBlur={inputBlur} />
          </div>

          <label style={styles.label}>Phone Number</label>
          <div style={styles.inputWrap}>
            <span style={styles.inputIcon}><Phone size={16} /></span>
            <input style={styles.input} type="tel" name="phone" placeholder="+91 9876543210" value={form.phone}
              onChange={handleChange} onFocus={inputFocus} onBlur={inputBlur} />
          </div>

          <label style={styles.label}>Password</label>
          <div style={styles.inputWrap}>
            <span style={styles.inputIcon}><Lock size={16} /></span>
            <input style={styles.input} type={showPass ? 'text' : 'password'} name="password"
              placeholder="Min. 6 characters" value={form.password}
              onChange={handleChange} required onFocus={inputFocus} onBlur={inputBlur} />
            <button type="button" style={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <label style={styles.label}>Confirm Password</label>
          <div style={styles.inputWrap}>
            <span style={styles.inputIcon}><Lock size={16} /></span>
            <input style={styles.input} type={showPass ? 'text' : 'password'} name="confirmPassword"
              placeholder="Repeat password" value={form.confirmPassword}
              onChange={handleChange} required onFocus={inputFocus} onBlur={inputBlur} />
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#4A2C2A', fontWeight: '700' }}>Sign in →</Link>
        </div>
      </div>
    </div>
  );
}
