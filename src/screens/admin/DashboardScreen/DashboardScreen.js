import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, LogOut,
  Plus, Edit2, Trash2, ChevronRight, DollarSign,
  CheckCircle, Clock, XCircle, Search, X, Save,
  MapPin, CreditCard, Eye, BarChart2, ArrowUpRight
} from 'lucide-react';
import { adminAPI } from '../../../services/api';
import { useToast } from '../../Toast/ToastProvider';
import ConfirmationModal from '../../Modal/ConfirmationModal';

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    processing: { bg: 'bg-blue-50 text-blue-700 border-blue-100', label: 'Processing' },
    shipped: { bg: 'bg-yellow-50 text-yellow-700 border-yellow-100', label: 'Shipped' },
    delivered: { bg: 'bg-green-50 text-green-700 border-green-100', label: 'Delivered' },
    cancelled: { bg: 'bg-red-50 text-red-700 border-red-100', label: 'Cancelled' },
    pending: { bg: 'bg-gray-50 text-gray-600 border-gray-200', label: 'Pending' },
  };
  const s = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${s.bg}`}>
      {status === 'delivered' ? <CheckCircle size={10} /> : status === 'cancelled' ? <XCircle size={10} /> : <Clock size={10} />}
      {s.label}
    </span>
  );
};

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-base font-black text-gray-800 uppercase tracking-tight">{title}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X size={16} /></button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const FormField = ({ label, value, onChange, type = 'text', required, placeholder, disabled }) => (
  <div>
    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>
    <input
      type={type} value={value} onChange={e => onChange(e.target.value)}
      required={required} placeholder={placeholder} disabled={disabled}
      className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-xs font-bold text-gray-700 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all disabled:opacity-50"
    />
  </div>
);

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color }) => {
  const colors = {
    green: 'from-green-500/10 to-emerald-500/10 text-green-600',
    blue: 'from-blue-500/10 to-indigo-500/10 text-blue-600',
    purple: 'from-purple-500/10 to-pink-500/10 text-purple-600',
    orange: 'from-orange-500/10 to-amber-500/10 text-orange-600',
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-start gap-4">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors[color]} flex items-center justify-center flex-shrink-0`}>
        <Icon size={20} className={`${colors[color].split(' ')[2]}`} />
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
        <p className="text-2xl font-black text-gray-800 leading-none">{value}</p>
        {sub && <p className="text-[10px] text-gray-400 font-bold mt-1 flex items-center gap-1"><ArrowUpRight size={10} className="text-green-500" />{sub}</p>}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  SECTIONS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── DASHBOARD OVERVIEW ───────────────────────────────────────────────────────
const DashboardSection = ({ stats }) => {
  if (!stats) return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading stats...</div>;
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-black text-gray-800 tracking-tight">Dashboard Overview</h1>
        <p className="text-xs text-gray-400 mt-0.5 font-bold uppercase tracking-widest opacity-80">Live store analytics</p>
      </header>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingCart} label="Total Orders" value={stats.totalOrders} sub="All time" color="blue" />
        <StatCard icon={Users} label="Customers" value={stats.totalUsers} sub="Registered" color="purple" />
        <StatCard icon={Package} label="Products" value={stats.totalProducts} sub="In catalog" color="orange" />
        <StatCard icon={DollarSign} label="Revenue" value={`₹${Number(stats.totalRevenue).toLocaleString()}`} sub="Total earned" color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-xs font-black text-gray-700 uppercase tracking-widest mb-4">Sales Last 7 Days</h3>
          {stats.salesByDay && (() => {
            const max = Math.max(...stats.salesByDay.map(d => Number(d.total)), 1);
            return (
              <div className="space-y-2">
                {stats.salesByDay.map(({ day, total }) => (
                  <div key={day} className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-gray-400 w-20 flex-shrink-0">{new Date(day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${(Number(total) / max) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-black text-gray-700 w-16 text-right">₹{Number(total).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-xs font-black text-gray-700 uppercase tracking-widest mb-4">Order Status</h3>
          {stats.orderStatusCounts && (
            <div className="space-y-3">
              {Object.entries(stats.orderStatusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <StatusBadge status={status} />
                  <span className="text-base font-black text-gray-800">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── PRODUCTS SECTION ─────────────────────────────────────────────────────────
const ProductsSection = ({ addToast, askConfirm }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | product object
  const [form, setForm] = useState({ id: '', name: '', price: '', category: '', description: '', imageUrl: '', stock: '', rating: '' });
  const [saving, setSaving] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getProducts();
      setProducts(res.products || []);
    } catch { addToast('Failed to load products', 'error'); }
    finally { setLoading(false); }
  }, [addToast]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openAdd = () => {
    const autoId = `PROD-${Date.now().toString(36).toUpperCase()}`;
    setForm({ id: autoId, name: '', price: '', category: '', description: '', imageUrl: '', stock: '', rating: '' });
    setModal('add');
  };
  const openEdit = (p) => {
    setForm({ id: p.id, name: p.name, price: p.price, category: p.category || '', description: p.description || '', imageUrl: p.imageUrl || '', stock: p.stock || 0, rating: p.rating || 0 });
    setModal(p);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === 'add') {
        await adminAPI.createProduct({ ...form, price: Number(form.price), stock: Number(form.stock), rating: Number(form.rating) });
        addToast('Product created!', 'success');
      } else {
        await adminAPI.updateProduct(modal.id, { ...form, price: Number(form.price), stock: Number(form.stock), rating: Number(form.rating) });
        addToast('Product updated!', 'success');
      }
      setModal(null);
      fetchProducts();
    } catch { addToast('Save failed', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = (id) => {
    askConfirm('Delete Product', 'Are you sure you want to permanently delete this product? This action cannot be undone.', async () => {
      try {
        await adminAPI.deleteProduct(id);
        addToast('Product deleted', 'success');
        fetchProducts();
      } catch { addToast('Delete failed', 'error'); }
    });
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-800 tracking-tight">Products</h1>
          <p className="text-xs text-gray-400 mt-0.5 font-bold uppercase tracking-widest opacity-80">{products.length} items in catalog</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-green-700 transition-colors shadow-lg shadow-green-100">
          <Plus size={14} /> Add Product
        </button>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 outline-none focus:border-green-400 shadow-sm" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                {['Product', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[9px] font-black uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-contain p-1" /> : <Package size={16} className="text-gray-300" />}
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-800 line-clamp-1">{p.name}</p>
                        <p className="text-[9px] text-gray-400 font-bold">ID: {p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="text-[10px] font-black text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{p.category || '—'}</span></td>
                  <td className="px-4 py-3 text-xs font-black text-gray-800">₹{p.price}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${p.stock > 10 ? 'text-green-700 bg-green-50' : p.stock > 0 ? 'text-yellow-700 bg-yellow-50' : 'text-red-700 bg-red-50'}`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"><Edit2 size={13} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-8 text-gray-400 text-xs font-bold">No products found</div>}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'Add Product' : 'Edit Product'} onClose={() => setModal(null)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Product ID *" value={form.id} onChange={v => setForm(f => ({ ...f, id: v }))} required placeholder="e.g. prod-001" disabled={modal !== 'add'} />
              <FormField label="Product Name *" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required placeholder="e.g. Fresh Apples" />
              <FormField label="Price (₹) *" value={form.price} onChange={v => setForm(f => ({ ...f, price: v }))} type="number" required placeholder="0.00" />
              <FormField label="Category" value={form.category} onChange={v => setForm(f => ({ ...f, category: v }))} placeholder="e.g. Fruits" />
              <FormField label="Stock" value={form.stock} onChange={v => setForm(f => ({ ...f, stock: v }))} type="number" placeholder="0" />
              <FormField label="Rating" value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} type="number" placeholder="0.0" />
            </div>
            <FormField label="Image URL" value={form.imageUrl} onChange={v => setForm(f => ({ ...f, imageUrl: v }))} placeholder="https://..." />
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-xs font-bold text-gray-700 focus:bg-white focus:border-green-500 outline-none resize-none" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModal(null)} className="px-5 py-2.5 text-xs font-black uppercase text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase hover:bg-green-700 transition-colors disabled:opacity-50">
                <Save size={13} /> {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

// ─── ORDERS SECTION ───────────────────────────────────────────────────────────
const OrdersSection = ({ addToast, askConfirm }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getOrders();
      setOrders(res.orders || []);
    } catch { addToast('Failed to load orders', 'error'); }
    finally { setLoading(false); }
  }, [addToast]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await adminAPI.updateOrder(id, { status });
      addToast('Order status updated', 'success');
      fetchOrders();
    } catch { addToast('Update failed', 'error'); }
    finally { setUpdatingId(null); }
  };

  const filtered = orders.filter(o =>
    (o.id || '').toLowerCase().includes(search.toLowerCase()) ||
    (o.User?.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-gray-800 tracking-tight">Orders</h1>
        <p className="text-xs text-gray-400 mt-0.5 font-bold uppercase tracking-widest opacity-80">{orders.length} total orders</p>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID or customer email..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 outline-none focus:border-green-400 shadow-sm" />
      </div>

      {loading ? <div className="text-center py-12 text-gray-400 text-sm">Loading...</div> : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center">
                    <ShoppingCart size={16} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-800">#{order.id?.split('-')[0]?.toUpperCase()}</p>
                    <p className="text-[10px] font-bold text-gray-400">{order.User?.name || order.User?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs font-black text-gray-800">₹{order.totalPrice}</p>
                    <p className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <StatusBadge status={order.status} />
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order.id, e.target.value)}
                    disabled={updatingId === order.id}
                    className="text-[10px] font-black uppercase bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none cursor-pointer"
                  >
                    {['processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button onClick={() => setSelected(selected?.id === order.id ? null : order)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <ChevronRight size={14} className={`text-gray-400 transition-transform ${selected?.id === order.id ? 'rotate-90' : ''}`} />
                  </button>
                </div>
              </div>
              {selected?.id === order.id && order.items && (
                <div className="border-t border-gray-50 p-4 bg-gray-50/50">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Order Items</p>
                  <div className="space-y-2">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.product?.imageUrl && <img src={item.product.imageUrl} alt="" className="w-full h-full object-contain p-0.5" />}
                        </div>
                        <p className="text-xs font-bold text-gray-700 flex-1">{item.product?.name || 'Product'}</p>
                        <p className="text-[10px] font-black text-gray-500">x{item.quantity}</p>
                        <p className="text-xs font-black text-gray-800">₹{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-8 text-gray-400 text-xs font-bold">No orders found</div>}
        </div>
      )}
    </div>
  );
};

// ─── USERS SECTION ────────────────────────────────────────────────────────────
const UsersSection = ({ addToast, askConfirm }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [detailTab, setDetailTab] = useState('orders');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getUsers();
      setUsers(res.users || []);
    } catch { addToast('Failed to load users', 'error'); }
    finally { setLoading(false); }
  }, [addToast]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDeleteUser = (id) => {
    askConfirm('Delete User', 'Delete this user and all their data? This action is permanent.', async () => {
      try {
        await adminAPI.deleteUser(id);
        addToast('User deleted', 'success');
        setSelected(null);
        fetchUsers();
      } catch (err) {
        addToast(err.response?.data?.message || 'Delete failed', 'error');
      }
    });
  };

  const handleDeleteAddress = (userId, addrId) => {
    askConfirm('Delete Address', 'Remove this saved address?', async () => {
      try {
        await adminAPI.deleteUserAddress(userId, addrId);
        addToast('Address deleted', 'success');
        fetchUsers();
        setSelected(prev => prev ? { ...prev, addresses: prev.addresses.filter(a => a.id !== addrId) } : null);
      } catch { addToast('Failed to delete address', 'error'); }
    });
  };

  const handleDeleteCard = (userId, cardId) => {
    askConfirm('Delete Card', 'Remove this saved card?', async () => {
      try {
        await adminAPI.deleteUserCard(userId, cardId);
        addToast('Card deleted', 'success');
        fetchUsers();
        setSelected(prev => prev ? { ...prev, cards: prev.cards.filter(c => c.id !== cardId) } : null);
      } catch { addToast('Failed to delete card', 'error'); }
    });
  };

  const filtered = users.filter(u =>
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-gray-800 tracking-tight">Users</h1>
        <p className="text-xs text-gray-400 mt-0.5 font-bold uppercase tracking-widest opacity-80">{users.filter(u => u.role !== 'admin').length} customers registered</p>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users by name or email..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 outline-none focus:border-green-400 shadow-sm" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Users list */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? <div className="text-center py-12 text-gray-400 text-sm">Loading...</div> : (
            <div className="divide-y divide-gray-50">
              {filtered.map(user => (
                <button key={user.id} onClick={() => { setSelected(user); setDetailTab('orders'); }}
                  className={`w-full text-left px-4 py-3.5 hover:bg-gray-50 transition-colors flex items-center gap-3 ${selected?.id === user.id ? 'bg-green-50 border-l-2 border-green-500' : ''}`}>
                  <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center text-white text-sm font-black flex-shrink-0">
                    {(user.fullname || user.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-gray-800 truncate">{user.fullname || user.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold truncate">{user.email}</p>
                  </div>
                  {user.role === 'admin' && <span className="text-[8px] font-black bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full uppercase">Admin</span>}
                  <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
                </button>
              ))}
              {filtered.length === 0 && <div className="text-center py-8 text-gray-400 text-xs font-bold">No users found</div>}
            </div>
          )}
        </div>

        {/* User detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="p-5 border-b border-gray-50 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center text-white text-lg font-black">
                    {(selected.fullname || selected.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-800">{selected.fullname || selected.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold">{selected.email}</p>
                    <p className="text-[9px] text-gray-400 font-bold mt-0.5">Joined {new Date(selected.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {selected.role !== 'admin' && (
                  <button onClick={() => handleDeleteUser(selected.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <div className="flex border-b border-gray-50">
                {[
                  { id: 'orders', label: 'Orders', icon: ShoppingCart },
                  { id: 'addresses', label: 'Addresses', icon: MapPin },
                  { id: 'cards', label: 'Cards', icon: CreditCard },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setDetailTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${detailTab === tab.id ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-400 hover:text-gray-600'}`}>
                    <tab.icon size={12} /> {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-4 max-h-72 overflow-y-auto">
                {detailTab === 'orders' && (
                  <div className="space-y-2">
                    {(selected.orders || []).length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-6">No orders yet</p>
                    ) : (selected.orders || []).map(o => (
                      <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                        <div>
                          <p className="text-[10px] font-black text-gray-700">#{o.id?.split('-')[0]?.toUpperCase()}</p>
                          <p className="text-[9px] text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={o.status} />
                          <p className="text-xs font-black text-gray-800">₹{o.totalPrice}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {detailTab === 'addresses' && (
                  <div className="space-y-3">
                    {(selected.addresses || []).length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-6">No addresses saved</p>
                    ) : (selected.addresses || []).map(addr => (
                      <div key={addr.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          {addr.isDefault && <span className="text-[8px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase mb-1 inline-block">Default</span>}
                          <p className="text-[10px] font-black text-gray-800">{addr.name}</p>
                          <p className="text-[9px] text-gray-500 font-bold">{addr.addressLine1}, {addr.city}</p>
                          <p className="text-[9px] text-gray-400">{addr.state} - {addr.postalCode}</p>
                        </div>
                        <button onClick={() => handleDeleteAddress(selected.id, addr.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {detailTab === 'cards' && (
                  <div className="space-y-3">
                    {(selected.cards || []).length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-6">No payment cards saved</p>
                    ) : (selected.cards || []).map(card => (
                      <div key={card.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-xl text-white">
                        <div>
                          {card.isDefault && <span className="text-[8px] font-black bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full uppercase mb-1 inline-block">Default</span>}
                          <p className="text-[10px] font-black">•••• {card.cardNumber?.slice(-4)}</p>
                          <p className="text-[9px] opacity-60 font-bold">{card.cardHolderName} · Exp {card.expiryDate}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black opacity-60">{card.cardType || 'CARD'}</span>
                          <button onClick={() => handleDeleteCard(selected.id, card.id)} className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center h-72">
              <div className="text-center">
                <Eye size={32} className="text-gray-200 mx-auto mb-3" />
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Select a user to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN ADMIN PANEL
// ═══════════════════════════════════════════════════════════════════════════════
const AdminPanel = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/admin/login'); return; }
    adminAPI.getStats().then(res => setStats(res.stats)).catch(() => {
      addToast('Admin access denied. Please log in as admin.', 'error');
      navigate('/');
    });
  }, [navigate, addToast]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    navigate('/admin/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'users', label: 'Users', icon: Users },
  ];

  const [confModal, setConfModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const askConfirm = (title, message, onConfirm) => setConfModal({ isOpen: true, title, message, onConfirm });

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg shadow-green-100">
              <BarChart2 size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-black text-gray-800">FreshMart</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-green-600">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const isActive = activeSection === item.id;
            return (
              <button key={item.id} onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                  isActive ? 'bg-green-600 text-white shadow-lg shadow-green-100 font-black' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 font-bold'
                }`}>
                <item.icon size={16} />
                <span className="text-[11px] uppercase tracking-widest">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-bold">
            <LogOut size={16} />
            <span className="text-[11px] uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          {activeSection === 'dashboard' && <DashboardSection stats={stats} />}
          {activeSection === 'products' && <ProductsSection addToast={addToast} askConfirm={askConfirm} />}
          {activeSection === 'orders' && <OrdersSection addToast={addToast} askConfirm={askConfirm} />}
          {activeSection === 'users' && <UsersSection addToast={addToast} askConfirm={askConfirm} />}
        </div>
      </main>

      <ConfirmationModal
        isOpen={confModal.isOpen}
        onClose={() => setConfModal({ ...confModal, isOpen: false })}
        onConfirm={confModal.onConfirm}
        title={confModal.title}
        message={confModal.message}
      />
    </div>
  );
};

export default AdminPanel;
