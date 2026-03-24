import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiBookOpen, FiUsers, FiTrendingUp, FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios';

const STATUS_STYLES = {
  pending:   'bg-sand-400/15 text-sand-400 border-sand-400/30',
  confirmed: 'bg-forest-400/15 text-forest-400 border-forest-400/30',
  cancelled: 'bg-red-400/15 text-red-400 border-red-400/30',
};

export default function AdminDashboard() {
  const [tab, setTab] = useState('packages');
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pkgRes, bkgRes] = await Promise.all([api.get('/packages'), api.get('/bookings')]);
      setPackages(pkgRes.data.data);
      setBookings(bkgRes.data.data);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this package? This cannot be undone.')) return;
    try {
      await api.delete(`/packages/${id}`);
      setPackages((p) => p.filter((pkg) => pkg._id !== id));
      toast.success('Package deleted');
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      setBookings((b) => b.map((bk) => bk._id === id ? { ...bk, status } : bk));
      toast.success('Status updated');
    } catch { toast.error('Update failed'); }
  };

  const revenue = bookings.filter((b) => b.status !== 'cancelled').reduce((s, b) => s + b.totalPrice, 0);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <p className="text-sand-500 font-mono text-xs tracking-widest uppercase mb-2">Administration</p>
          <h1 className="section-title">Admin <span className="text-gradient">Dashboard</span></h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            [FiPackage, 'Total Packages', packages.length, 'from-sand-400/20 to-sand-600/10 border-sand-500/20', 'text-sand-300'],
            [FiBookOpen, 'Total Bookings', bookings.length, 'from-forest-400/20 to-forest-600/10 border-forest-500/20', 'text-forest-300'],
            [FiUsers, 'Unique Travellers', new Set(bookings.map((b) => b.user?._id)).size, 'from-blue-400/20 to-blue-600/10 border-blue-500/20', 'text-blue-300'],
            [FiTrendingUp, 'Revenue', `₹${revenue.toLocaleString('en-IN')}`, 'from-purple-400/20 to-purple-600/10 border-purple-500/20', 'text-purple-300'],
          ].map(([Icon, label, val, gradient, color]) => (
            <div key={label} className="card p-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} border flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className="text-sand-600 text-xs font-mono mb-1">{label}</p>
              <p className={`font-display text-2xl ${color}`}>{val}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['packages', 'bookings'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                tab === t ? 'bg-sand-400/20 text-sand-300 border border-sand-400/30' : 'text-sand-500 hover:text-sand-300 hover:bg-ink-700/60'
              }`}>
              {t === 'packages' ? `Packages (${packages.length})` : `Bookings (${bookings.length})`}
            </button>
          ))}
        </div>

        {/* Packages Tab */}
        {tab === 'packages' && (
          <div>
            <div className="flex justify-end mb-4">
              <Link to="/admin/packages/new" className="btn-primary">
                <FiPlus className="w-4 h-4" /> Add Package
              </Link>
            </div>

            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-ink-600/50">
                      <th className="text-left px-6 py-4 text-sand-500 font-mono text-xs tracking-widest uppercase">Package</th>
                      <th className="text-left px-6 py-4 text-sand-500 font-mono text-xs tracking-widest uppercase hidden md:table-cell">Location</th>
                      <th className="text-left px-6 py-4 text-sand-500 font-mono text-xs tracking-widest uppercase hidden sm:table-cell">Price</th>
                      <th className="text-left px-6 py-4 text-sand-500 font-mono text-xs tracking-widest uppercase hidden lg:table-cell">Days</th>
                      <th className="text-left px-6 py-4 text-sand-500 font-mono text-xs tracking-widest uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-600/30">
                    {loading ? (
                      [...Array(4)].map((_, i) => (
                        <tr key={i}>
                          {[...Array(5)].map((_, j) => (
                            <td key={j} className="px-6 py-4">
                              <div className="h-4 shimmer-box rounded" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : packages.map((pkg) => (
                      <tr key={pkg._id} className="hover:bg-ink-700/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={pkg.image?.url || 'https://images.unsplash.com/photo-1548013146-72479768bada?w=80'}
                              alt={pkg.title}
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80'; }}
                            />
                            <div>
                              <p className="text-sand-200 font-medium text-sm line-clamp-1">{pkg.title}</p>
                              {pkg.featured && <span className="text-xs text-sand-500 font-mono">★ Featured</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sand-400 text-sm hidden md:table-cell">{pkg.location}</td>
                        <td className="px-6 py-4 text-sand-300 font-mono text-sm hidden sm:table-cell">₹{pkg.price?.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 text-sand-400 text-sm hidden lg:table-cell">{pkg.duration}d</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link to={`/packages/${pkg._id}`}
                              className="p-2 rounded-lg text-sand-500 hover:text-sand-300 hover:bg-ink-700/60 transition-colors">
                              <FiEye className="w-4 h-4" />
                            </Link>
                            <Link to={`/admin/packages/${pkg._id}/edit`}
                              className="p-2 rounded-lg text-sand-500 hover:text-sand-300 hover:bg-ink-700/60 transition-colors">
                              <FiEdit2 className="w-4 h-4" />
                            </Link>
                            <button onClick={() => handleDelete(pkg._id)}
                              className="p-2 rounded-lg text-sand-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {tab === 'bookings' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ink-600/50">
                    <th className="text-left px-6 py-4 text-sand-500 font-mono text-xs tracking-widest uppercase">Traveller</th>
                    <th className="text-left px-6 py-4 text-sand-500 font-mono text-xs tracking-widest uppercase hidden md:table-cell">Package</th>
                    <th className="text-left px-6 py-4 text-sand-500 font-mono text-xs tracking-widest uppercase hidden sm:table-cell">Date</th>
                    <th className="text-left px-6 py-4 text-sand-500 font-mono text-xs tracking-widest uppercase hidden lg:table-cell">Amount</th>
                    <th className="text-left px-6 py-4 text-sand-500 font-mono text-xs tracking-widest uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-600/30">
                  {loading ? (
                    [...Array(4)].map((_, i) => (
                      <tr key={i}>
                        {[...Array(5)].map((_, j) => (
                          <td key={j} className="px-6 py-4"><div className="h-4 shimmer-box rounded" /></td>
                        ))}
                      </tr>
                    ))
                  ) : bookings.map((bk) => (
                    <tr key={bk._id} className="hover:bg-ink-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sand-200 text-sm font-medium">{bk.user?.name || '—'}</p>
                          <p className="text-sand-500 text-xs font-mono">{bk.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sand-400 text-sm hidden md:table-cell">
                        <span className="line-clamp-1">{bk.package?.title || '—'}</span>
                        <span className="text-sand-600 text-xs">{bk.numberOfPeople} pax</span>
                      </td>
                      <td className="px-6 py-4 text-sand-400 text-sm hidden sm:table-cell font-mono">
                        {new Date(bk.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 text-sand-300 font-mono text-sm hidden lg:table-cell">
                        ₹{bk.totalPrice?.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={bk.status}
                          onChange={(e) => handleStatusChange(bk._id, e.target.value)}
                          className={`badge border ${STATUS_STYLES[bk.status]} cursor-pointer bg-transparent capitalize text-xs font-mono`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!loading && bookings.length === 0 && (
                <div className="text-center py-12 text-sand-500 font-mono text-sm">No bookings yet</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
