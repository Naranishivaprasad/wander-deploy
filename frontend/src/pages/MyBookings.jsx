import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMapPin, FiCalendar, FiUsers, FiClock, FiX, FiPackage } from 'react-icons/fi';
import api from '../api/axios';

const STATUS_STYLES = {
  pending:   'bg-sand-400/15 text-sand-400 border-sand-400/30',
  confirmed: 'bg-forest-400/15 text-forest-400 border-forest-400/30',
  cancelled: 'bg-red-400/15 text-red-400 border-red-400/30',
};

function BookingCard({ booking, onCancel }) {
  const pkg = booking.package;
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    if (!confirm('Cancel this booking?')) return;
    setCancelling(true);
    try {
      await api.put(`/bookings/${booking._id}/cancel`);
      toast.success('Booking cancelled');
      onCancel(booking._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="card overflow-hidden hover:border-sand-500/20 transition-all duration-300 animate-fade-up">
      <div className="flex flex-col sm:flex-row">
        {/* Package Image */}
        <div className="sm:w-48 h-40 sm:h-auto flex-shrink-0">
          <img
            src={pkg?.image?.url || 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400'}
            alt={pkg?.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'; }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="font-display text-xl text-sand-100 mb-1">
                {pkg?.title || 'Package Unavailable'}
              </h3>
              <div className="flex items-center gap-1.5 text-sand-500 text-sm">
                <FiMapPin className="w-3.5 h-3.5" /> {pkg?.location}
              </div>
            </div>
            <span className={`badge border ${STATUS_STYLES[booking.status]} capitalize`}>
              {booking.status}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            {[
              [FiCalendar, 'Travel Date', new Date(booking.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })],
              [FiUsers, 'People', booking.numberOfPeople],
              [FiClock, 'Duration', pkg ? `${pkg.duration} days` : '—'],
              [null, 'Total Price', `₹${booking.totalPrice?.toLocaleString('en-IN')}`],
            ].map(([Icon, label, value], i) => (
              <div key={label}>
                <p className="text-sand-600 text-xs font-mono mb-1">{label}</p>
                <div className="flex items-center gap-1.5">
                  {Icon && <Icon className="w-3.5 h-3.5 text-sand-500" />}
                  <span className={`text-sm font-medium ${i === 3 ? 'text-sand-300 font-display text-base' : 'text-sand-300'}`}>
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {booking.specialRequests && (
            <p className="text-sand-500 text-xs bg-ink-700/40 rounded-lg px-3 py-2 mb-4 font-mono">
              📝 {booking.specialRequests}
            </p>
          )}

          <div className="flex items-center gap-3">
            {pkg && (
              <Link to={`/packages/${pkg._id}`} className="btn-secondary py-2 px-4 text-sm">
                View Package
              </Link>
            )}
            {booking.status === 'pending' && (
              <button onClick={handleCancel} disabled={cancelling} className="btn-danger py-2 px-4 text-sm">
                {cancelling ? (
                  <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                ) : (
                  <><FiX className="w-3.5 h-3.5" /> Cancel</>
                )}
              </button>
            )}
            <p className="text-sand-600 text-xs font-mono ml-auto">
              Booked {new Date(booking.createdAt).toLocaleDateString('en-IN')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/bookings/my')
      .then(({ data }) => setBookings(data.data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = (id) =>
    setBookings((b) => b.map((bk) => bk._id === id ? { ...bk, status: 'cancelled' } : bk));

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    spent: bookings.filter((b) => b.status !== 'cancelled').reduce((sum, b) => sum + b.totalPrice, 0),
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <p className="text-sand-500 font-mono text-xs tracking-widest uppercase mb-2">My Account</p>
          <h1 className="section-title">My <span className="text-gradient">Bookings</span></h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            ['Total Bookings', stats.total, 'text-sand-300'],
            ['Confirmed', stats.confirmed, 'text-forest-400'],
            ['Pending', stats.pending, 'text-sand-400'],
            ['Total Spent', `₹${stats.spent.toLocaleString('en-IN')}`, 'text-sand-300'],
          ].map(([label, val, color]) => (
            <div key={label} className="card p-5">
              <p className="text-sand-600 text-xs font-mono mb-1">{label}</p>
              <p className={`font-display text-2xl ${color}`}>{val}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'confirmed', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                filter === s
                  ? 'bg-sand-400/20 text-sand-300 border border-sand-400/30'
                  : 'text-sand-500 hover:text-sand-300 hover:bg-ink-700/60'
              }`}
            >
              {s} {s === 'all' ? `(${bookings.length})` : `(${bookings.filter((b) => b.status === s).length})`}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card h-40 animate-pulse">
                <div className="flex h-full">
                  <div className="w-48 shimmer-box" />
                  <div className="flex-1 p-6 space-y-3">
                    <div className="h-5 shimmer-box rounded w-1/2" />
                    <div className="h-4 shimmer-box rounded w-1/3" />
                    <div className="h-4 shimmer-box rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-ink-700/60 border border-ink-600/50 flex items-center justify-center mb-5">
              <FiPackage className="w-7 h-7 text-sand-600" />
            </div>
            <h3 className="font-display text-xl text-sand-300 mb-2">No bookings yet</h3>
            <p className="text-sand-500 text-sm mb-6">Start exploring and book your first trip!</p>
            <Link to="/packages" className="btn-primary">Browse Packages</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((b, i) => (
              <div key={b._id} style={{ animationDelay: `${i * 80}ms` }}>
                <BookingCard booking={b} onCancel={handleCancel} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
