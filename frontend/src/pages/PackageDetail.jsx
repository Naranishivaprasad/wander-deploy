import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiMapPin, FiClock, FiUsers, FiArrowLeft, FiCalendar, FiArrowRight, FiCheck
} from 'react-icons/fi';
import { MdHotel, MdRestaurant, MdDirectionsBus, MdRecordVoiceOver } from 'react-icons/md';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const facilityConfig = {
  hotel:     { icon: MdHotel,              label: 'Hotel Stay',      color: 'text-blue-400',   bg: 'bg-blue-400/10 border-blue-400/20' },
  food:      { icon: MdRestaurant,         label: 'Meals Included',  color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20' },
  transport: { icon: MdDirectionsBus,      label: 'Transportation',  color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20' },
  guide:     { icon: MdRecordVoiceOver,    label: 'Expert Guide',    color: 'text-green-400',  bg: 'bg-green-400/10 border-green-400/20' },
};

export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ travelDate: '', numberOfPeople: 1, specialRequests: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/packages/${id}`)
      .then(({ data }) => setPkg(data.data))
      .catch(() => navigate('/packages'))
      .finally(() => setLoading(false));
  }, [id]);

  const totalCost = pkg ? pkg.price * booking.numberOfPeople : 0;

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!booking.travelDate) { toast.error('Please select a travel date'); return; }

    setSubmitting(true);
    try {
      await api.post('/bookings', { packageId: id, ...booking });
      toast.success('Booking confirmed! 🎉');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-sand-400/30 border-t-sand-400 rounded-full animate-spin" />
    </div>
  );
  if (!pkg) return null;

  const enabledFacilities = Object.entries(pkg.facilities || {}).filter(([, v]) => v);
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Image */}
      <div className="relative h-[50vh] overflow-hidden">
        <img
          src={pkg.image?.url || 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1400'}
          alt={pkg.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/40 via-transparent to-ink-900" />

        <button onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 glass px-4 py-2 rounded-xl text-sand-300 text-sm hover:text-sand-100 transition-colors">
          <FiArrowLeft className="w-4 h-4" /> Back
        </button>

        {pkg.featured && (
          <div className="absolute top-6 right-6 px-3 py-1.5 rounded-lg bg-sand-400/90 text-ink-900 text-xs font-bold font-mono">
            ★ Featured
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Meta */}
            <div className="card p-8 animate-fade-up">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="font-display text-3xl md:text-4xl text-sand-100 mb-3">{pkg.title}</h1>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1.5 text-sand-400 text-sm">
                      <FiMapPin className="w-4 h-4 text-sand-500" /> {pkg.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-sand-400 text-sm">
                      <FiClock className="w-4 h-4 text-sand-500" /> {pkg.duration} Days
                    </div>
                    <div className="flex items-center gap-1.5 text-sand-400 text-sm">
                      <FiUsers className="w-4 h-4 text-sand-500" /> Max {pkg.maxGroupSize} people
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sand-500 text-xs font-mono">per person</p>
                  <p className="font-display text-4xl text-sand-300">₹{pkg.price?.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <p className="text-sand-400 leading-relaxed">{pkg.description}</p>
            </div>

            {/* Facilities */}
            {enabledFacilities.length > 0 && (
              <div className="card p-8 animate-fade-up animate-delay-100">
                <h2 className="font-display text-xl text-sand-200 mb-6">What's Included</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {enabledFacilities.map(([key]) => {
                    const cfg = facilityConfig[key];
                    if (!cfg) return null;
                    const Icon = cfg.icon;
                    return (
                      <div key={key} className={`flex flex-col items-center gap-3 p-5 rounded-xl border ${cfg.bg} text-center`}>
                        <Icon className={`w-7 h-7 ${cfg.color}`} />
                        <span className="text-sand-300 text-sm font-medium">{cfg.label}</span>
                        <FiCheck className="w-4 h-4 text-forest-400" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Trip Highlights */}
            <div className="card p-8 animate-fade-up animate-delay-200">
              <h2 className="font-display text-xl text-sand-200 mb-6">Trip Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  `${pkg.duration} days of curated travel`,
                  `Expert local knowledge of ${pkg.location}`,
                  'Small group experience',
                  'Flexible scheduling options',
                  'Memorable cultural experiences',
                  '24/7 support throughout the trip',
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-forest-500/20 border border-forest-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiCheck className="w-3 h-3 text-forest-400" />
                    </div>
                    <span className="text-sand-400 text-sm">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Booking Form */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24 animate-fade-up animate-delay-100">
              <h2 className="font-display text-xl text-sand-200 mb-6">Book This Package</h2>

              <form onSubmit={handleBook} className="space-y-5">
                <div>
                  <label className="label">Travel Date</label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-500" />
                    <input
                      type="date"
                      min={minDate}
                      value={booking.travelDate}
                      onChange={(e) => setBooking((b) => ({ ...b, travelDate: e.target.value }))}
                      className="input-field pl-9"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Number of People</label>
                  <div className="relative">
                    <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-500" />
                    <input
                      type="number"
                      min={1}
                      max={pkg.maxGroupSize}
                      value={booking.numberOfPeople}
                      onChange={(e) => setBooking((b) => ({ ...b, numberOfPeople: e.target.value }))}
                      className="input-field pl-9"
                      required
                    />
                  </div>
                  <p className="text-sand-600 text-xs mt-1 font-mono">Max {pkg.maxGroupSize} people</p>
                </div>

                <div>
                  <label className="label">Special Requests</label>
                  <textarea
                    value={booking.specialRequests}
                    onChange={(e) => setBooking((b) => ({ ...b, specialRequests: e.target.value }))}
                    placeholder="Dietary needs, accessibility, etc."
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>

                {/* Price Breakdown */}
                <div className="bg-ink-700/40 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-sand-500">₹{pkg.price?.toLocaleString('en-IN')} × {booking.numberOfPeople} person{booking.numberOfPeople > 1 ? 's' : ''}</span>
                    <span className="text-sand-400">₹{totalCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t border-ink-600/50 pt-2 flex justify-between">
                    <span className="text-sand-300 font-medium">Total</span>
                    <span className="font-display text-xl text-sand-200">₹{totalCost.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {user ? (
                  <button type="submit" disabled={submitting} className="btn-primary w-full justify-center text-base h-12">
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
                    ) : (
                      <> Confirm Booking <FiArrowRight className="w-4 h-4" /> </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <Link to="/login" className="btn-primary w-full justify-center text-base h-12">
                      Sign In to Book <FiArrowRight className="w-4 h-4" />
                    </Link>
                    <p className="text-sand-500 text-xs text-center font-mono">
                      No account? <Link to="/register" className="text-sand-400 hover:text-sand-300 underline">Register free</Link>
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
