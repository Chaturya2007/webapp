import { useState, useEffect } from 'react';
import { User, Phone, MapPin, Plus, Trash2, Edit2, Save, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addingAddr, setAddingAddr] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: 'Home', address: '', city: '', pincode: '' });

  useEffect(() => {
    api.get('/auth/profile')
      .then(res => {
        const data = res.data?.user || res.data;
        setAddresses(data?.addresses || []);
        updateUser({ ...user, ...data });
        setForm({ name: data.name || user?.name || '', phone: data.phone || user?.phone || '' });
      })
      .catch(() => {});
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', form);
      updateUser({ ...user, ...form });
      toast.success('Profile updated! ✅');
      setEditing(false);
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const addAddress = async () => {
    if (!newAddr.address || !newAddr.city || !newAddr.pincode) {
      toast.error('Please fill all address fields');
      return;
    }
    try {
      const res = await api.post('/auth/addresses', newAddr);
      setAddresses(res.data?.addresses || [...addresses, newAddr]);
      setNewAddr({ label: 'Home', address: '', city: '', pincode: '' });
      setAddingAddr(false);
      toast.success('Address saved!');
    } catch {
      toast.error('Failed to save address');
    }
  };

  const deleteAddress = async (index) => {
    try {
      const res = await api.delete(`/auth/addresses/${index}`);
      setAddresses(res.data?.addresses || addresses.filter((_, i) => i !== index));
      toast.success('Address removed');
    } catch {
      toast.error('Failed to remove address');
    }
  };

  const styles = {
    page: { maxWidth: '700px', margin: '0 auto', padding: '24px' },
    title: { fontSize: '24px', fontWeight: '800', color: '#4A2C2A', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' },
    card: { background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(74,44,42,0.07)', marginBottom: '16px' },
    cardTitle: { fontWeight: '700', color: '#4A2C2A', marginBottom: '16px', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    avatar: {
      width: '72px', height: '72px', borderRadius: '50%', background: '#4A2C2A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '28px', color: '#D4AF37', fontWeight: '800', marginRight: '16px', flexShrink: 0
    },
    label: { fontSize: '12px', color: '#888', marginBottom: '3px' },
    value: { fontWeight: '600', color: '#2C1810', fontSize: '15px' },
    input: {
      width: '100%', padding: '10px 14px', border: '1.5px solid #e8d5c0',
      borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#2C1810',
      marginBottom: '10px', background: '#FAFAFA'
    },
    editBtn: { background: 'none', border: '1.5px solid #4A2C2A', color: '#4A2C2A', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' },
    saveBtn: { background: '#27ae60', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', marginRight: '8px' },
    cancelBtn: { background: 'none', border: '1.5px solid #ccc', color: '#888', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' },
    addrCard: { border: '1.5px solid #F5E6D3', borderRadius: '12px', padding: '14px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    logoutBtn: { width: '100%', background: '#fff', color: '#e74c3c', border: '2px solid #e74c3c', borderRadius: '12px', padding: '14px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }
  };

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div style={styles.page}>
      <div style={styles.title}><User size={24} /> My Profile</div>

      {/* Profile Info */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>
          <span>Personal Information</span>
          {!editing ? (
            <button style={styles.editBtn} onClick={() => setEditing(true)}>
              <Edit2 size={14} /> Edit
            </button>
          ) : (
            <div style={{ display: 'flex' }}>
              <button style={styles.saveBtn} onClick={saveProfile} disabled={saving}>
                <Save size={14} /> {saving ? 'Saving...' : 'Save'}
              </button>
              <button style={styles.cancelBtn} onClick={() => { setEditing(false); setForm({ name: user?.name || '', phone: user?.phone || '' }); }}>
                <X size={14} /> Cancel
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <div style={styles.avatar}>{initials}</div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '18px', color: '#4A2C2A' }}>{user?.name}</div>
            <div style={{ fontSize: '13px', color: '#888', marginTop: '3px' }}>{user?.email}</div>
            <div style={{ fontSize: '12px', background: '#F5E6D3', color: '#4A2C2A', padding: '2px 10px', borderRadius: '20px', display: 'inline-block', marginTop: '6px', fontWeight: '600' }}>
              {user?.role === 'admin' ? '👑 Admin' : '👤 Customer'}
            </div>
          </div>
        </div>

        {editing ? (
          <>
            <label style={styles.label}>Full Name</label>
            <input style={styles.input} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              onFocus={e => e.target.style.borderColor = '#4A2C2A'}
              onBlur={e => e.target.style.borderColor = '#e8d5c0'} />
            <label style={styles.label}>Phone Number</label>
            <input style={styles.input} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              placeholder="+91 9876543210"
              onFocus={e => e.target.style.borderColor = '#4A2C2A'}
              onBlur={e => e.target.style.borderColor = '#e8d5c0'} />
          </>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={styles.label}>Full Name</div>
              <div style={styles.value}>{user?.name || '—'}</div>
            </div>
            <div>
              <div style={styles.label}>Email</div>
              <div style={styles.value}>{user?.email || '—'}</div>
            </div>
            <div>
              <div style={styles.label}>Phone</div>
              <div style={styles.value}>{user?.phone || '—'}</div>
            </div>
            <div>
              <div style={styles.label}>Member Since</div>
              <div style={styles.value}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—'}</div>
            </div>
          </div>
        )}
      </div>

      {/* Saved Addresses */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>
          <span><MapPin size={15} style={{ display: 'inline', marginRight: '6px' }} />Saved Addresses</span>
          <button style={styles.editBtn} onClick={() => setAddingAddr(!addingAddr)}>
            <Plus size={14} /> Add New
          </button>
        </div>

        {addingAddr && (
          <div style={{ border: '1.5px dashed #D4AF37', borderRadius: '12px', padding: '16px', marginBottom: '12px', background: '#FFFDF5' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <select style={styles.input} value={newAddr.label} onChange={e => setNewAddr(p => ({ ...p, label: e.target.value }))}
                  onFocus={e => e.target.style.borderColor = '#4A2C2A'}
                  onBlur={e => e.target.style.borderColor = '#e8d5c0'}>
                  <option>Home</option><option>Work</option><option>Other</option>
                </select>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <input style={styles.input} placeholder="Street address" value={newAddr.address}
                  onChange={e => setNewAddr(p => ({ ...p, address: e.target.value }))}
                  onFocus={e => e.target.style.borderColor = '#4A2C2A'}
                  onBlur={e => e.target.style.borderColor = '#e8d5c0'} />
              </div>
              <input style={styles.input} placeholder="City" value={newAddr.city}
                onChange={e => setNewAddr(p => ({ ...p, city: e.target.value }))}
                onFocus={e => e.target.style.borderColor = '#4A2C2A'}
                onBlur={e => e.target.style.borderColor = '#e8d5c0'} />
              <input style={styles.input} placeholder="Pincode" value={newAddr.pincode}
                onChange={e => setNewAddr(p => ({ ...p, pincode: e.target.value }))}
                onFocus={e => e.target.style.borderColor = '#4A2C2A'}
                onBlur={e => e.target.style.borderColor = '#e8d5c0'} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ ...styles.saveBtn, flex: 1, justifyContent: 'center' }} onClick={addAddress}>Save Address</button>
              <button style={{ ...styles.cancelBtn }} onClick={() => setAddingAddr(false)}>Cancel</button>
            </div>
          </div>
        )}

        {addresses.length === 0 && !addingAddr && (
          <div style={{ textAlign: 'center', padding: '24px', color: '#888', fontSize: '14px' }}>
            <MapPin size={32} style={{ opacity: 0.3, display: 'block', margin: '0 auto 8px' }} />
            No saved addresses yet
          </div>
        )}

        {addresses.map((addr, idx) => (
          <div key={idx} style={styles.addrCard}>
            <div>
              <div style={{ fontWeight: '700', color: '#4A2C2A', marginBottom: '4px', fontSize: '13px' }}>
                {addr.label === 'Home' ? '🏠' : addr.label === 'Work' ? '🏢' : '📍'} {addr.label}
              </div>
              <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.5' }}>
                {addr.address}, {addr.city} — {addr.pincode}
              </div>
            </div>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c', padding: '4px' }} onClick={() => deleteAddress(idx)}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Logout */}
      <button style={styles.logoutBtn} onClick={handleLogout}
        onMouseEnter={e => { e.currentTarget.style.background = '#e74c3c'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#e74c3c'; }}>
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
}
