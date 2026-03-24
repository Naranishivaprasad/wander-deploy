import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCompass } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome aboard 🎉');
      navigate('/packages');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="min-h-screen flex">
      {/* Left — Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1000"
          alt="Kerala"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent" />
        <div className="absolute bottom-12 left-10 right-10">
          <p className="font-display text-3xl text-sand-100 italic mb-2">"Adventure is the best way to learn."</p>
          <p className="text-sand-400 text-sm font-mono">— Unknown</p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-up">
          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sand-400 to-sand-600 flex items-center justify-center">
              <FiCompass className="text-ink-900 w-5 h-5" />
            </div>
            <div>
              <span className="font-display text-xl text-sand-200">Wander</span>
              <span className="font-display text-xl text-sand-400">India</span>
            </div>
          </Link>

          <h1 className="font-display text-4xl text-sand-100 mb-2">Start your journey</h1>
          <p className="text-sand-500 mb-8">Create a free account to book packages</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-500" />
                <input type="text" value={form.name} onChange={set('name')}
                  placeholder="Your full name" className="input-field pl-10" required />
              </div>
            </div>

            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-500" />
                <input type="email" value={form.email} onChange={set('email')}
                  placeholder="you@example.com" className="input-field pl-10" required />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-500" />
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')}
                  placeholder="Min. 6 characters" className="input-field pl-10 pr-10" required />
                <button type="button" onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-500 hover:text-sand-300 transition-colors">
                  {showPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-500" />
                <input type={showPw ? 'text' : 'password'} value={form.confirm} onChange={set('confirm')}
                  placeholder="Repeat password" className="input-field pl-10" required />
              </div>
            </div>

            {/* Password strength indicator */}
            {form.password && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                      form.password.length >= i * 3
                        ? i <= 2 ? 'bg-red-400' : i === 3 ? 'bg-sand-400' : 'bg-forest-400'
                        : 'bg-ink-600'
                    }`} />
                  ))}
                </div>
                <p className="text-xs font-mono text-sand-600">
                  {form.password.length < 6 ? 'Too short' : form.password.length < 9 ? 'Weak' : form.password.length < 12 ? 'Good' : 'Strong'}
                </p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center h-12 text-base">
              {loading ? (
                <div className="w-5 h-5 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sand-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-sand-300 hover:text-sand-100 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
