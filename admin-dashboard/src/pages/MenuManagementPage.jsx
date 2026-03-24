import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const initialForm = {
  name: '', description: '', price: '', category: '',
  isVeg: true, isAvailable: true, image: '', tags: ''
};

export default function MenuManagementPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, catsRes] = await Promise.all([
        api.get('/admin/menu'),
        api.get('/admin/categories')
      ]);
      setItems(itemsRes.data.items || itemsRes.data || []);
      setCategories(catsRes.data.categories || catsRes.data || []);
    } catch {
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditItem(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name || '',
      description: item.description || '',
      price: item.price || '',
      category: item.category?._id || item.category || '',
      isVeg: item.isVeg !== undefined ? item.isVeg : true,
      isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
      image: item.image || '',
      tags: (item.tags || []).join(', ')
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      toast.error('Name, price and category are required');
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      price: parseFloat(form.price),
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    };
    try {
      if (editItem) {
        await api.put(`/admin/menu/${editItem._id}`, payload);
        toast.success('Item updated');
      } else {
        await api.post('/admin/menu', payload);
        toast.success('Item added');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/admin/menu/${id}`);
      toast.success('Item deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete item');
    }
  };

  const toggleAvailability = async (item) => {
    try {
      await api.put(`/admin/menu/${item._id}`, { isAvailable: !item.isAvailable });
      toast.success(`${item.name} ${!item.isAvailable ? 'enabled' : 'disabled'}`);
      fetchData();
    } catch {
      toast.error('Failed to update availability');
    }
  };

  const filtered = items.filter(i =>
    i.name?.toLowerCase().includes(search.toLowerCase()) ||
    i.description?.toLowerCase().includes(search.toLowerCase())
  );

  const styles = {
    page: { padding: '24px' },
    topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
    title: { fontSize: '24px', fontWeight: '700', color: '#4A2C2A' },
    searchInput: { padding: '10px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', width: '280px', outline: 'none' },
    addBtn: { background: '#4A2C2A', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
    table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    th: { padding: '14px 16px', textAlign: 'left', background: '#4A2C2A', color: 'white', fontSize: '13px', fontWeight: '600' },
    td: { padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontSize: '13px', color: '#333' },
    vegBadge: { display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' },
    toggle: { cursor: 'pointer', padding: '4px 12px', borderRadius: '20px', border: 'none', fontSize: '12px', fontWeight: '600' },
    editBtn: { background: '#D4AF37', color: '#2C1810', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', marginRight: '6px' },
    delBtn: { background: '#e74c3c', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modal: { background: 'white', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' },
    modalTitle: { fontSize: '20px', fontWeight: '700', color: '#4A2C2A', marginBottom: '24px' },
    formGroup: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '6px' },
    input: { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    btnRow: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' },
    cancelBtn: { padding: '10px 24px', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', background: 'white' },
    saveBtn: { padding: '10px 24px', background: '#4A2C2A', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#4A2C2A' }}>Loading menu...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <h1 style={styles.title}>Menu Management</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input style={styles.searchInput} placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} />
          <button style={styles.addBtn} onClick={openAdd}>+ Add Item</button>
        </div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            {['Item', 'Category', 'Price', 'Type', 'Available', 'Actions'].map(h => (
              <th key={h} style={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={6} style={{ ...styles.td, textAlign: 'center', padding: '32px', color: '#999' }}>No items found</td></tr>
          ) : filtered.map(item => (
            <tr key={item._id}>
              <td style={styles.td}>
                <div style={{ fontWeight: '600', color: '#2C1810' }}>{item.name}</div>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{item.description?.slice(0, 60)}...</div>
              </td>
              <td style={styles.td}>{item.category?.name || 'N/A'}</td>
              <td style={styles.td}>₹{item.price}</td>
              <td style={styles.td}>
                <span style={{ ...styles.vegBadge, background: item.isVeg ? '#e8f5e9' : '#fde8e8', color: item.isVeg ? '#2e7d32' : '#c62828' }}>
                  {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                </span>
              </td>
              <td style={styles.td}>
                <button
                  style={{ ...styles.toggle, background: item.isAvailable ? '#e8f5e9' : '#fde8e8', color: item.isAvailable ? '#2e7d32' : '#c62828' }}
                  onClick={() => toggleAvailability(item)}
                >
                  {item.isAvailable ? 'Available' : 'Hidden'}
                </button>
              </td>
              <td style={styles.td}>
                <button style={styles.editBtn} onClick={() => openEdit(item)}>Edit</button>
                <button style={styles.delBtn} onClick={() => handleDelete(item._id, item.name)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={styles.overlay} onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>{editItem ? 'Edit Item' : 'Add New Item'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Item Name *</label>
                <input style={styles.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Cappuccino" required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." />
              </div>
              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Price (₹) *</label>
                  <input style={styles.input} type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="149" required />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Category *</label>
                  <select style={styles.input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Type</label>
                  <select style={styles.input} value={form.isVeg ? 'veg' : 'nonveg'} onChange={e => setForm({ ...form, isVeg: e.target.value === 'veg' })}>
                    <option value="veg">🟢 Vegetarian</option>
                    <option value="nonveg">🔴 Non-Vegetarian</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Availability</label>
                  <select style={styles.input} value={form.isAvailable ? 'yes' : 'no'} onChange={e => setForm({ ...form, isAvailable: e.target.value === 'yes' })}>
                    <option value="yes">Available</option>
                    <option value="no">Hidden</option>
                  </select>
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Image URL</label>
                <input style={styles.input} value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tags (comma-separated)</label>
                <input style={styles.input} value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="hot, bestseller, spicy" />
              </div>
              <div style={styles.btnRow}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" style={styles.saveBtn} disabled={saving}>{saving ? 'Saving...' : editItem ? 'Update Item' : 'Add Item'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
