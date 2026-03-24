import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiCompass } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1000"
          alt="India"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent" />
        <div className="absolute bottom-12 left-10 right-10">
          <p className="font-display text-3xl text-sand-100 italic mb-2">"To travel is to live."</p>
          <p className="text-sand-400 text-sm font-mono">— Hans Christian Andersen</p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-up">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sand-400 to-sand-600 flex items-center justify-center">
              <FiCompass className="text-ink-900 w-5 h-5" />
            </div>
            <div>
              <span className="font-display text-xl text-sand-200">Wander</span>
              <span className="font-display text-xl text-sand-400">India</span>
            </div>
          </Link>

          <h1 className="font-display text-4xl text-sand-100 mb-2">Welcome back</h1>
          <p className="text-sand-500 mb-8">Sign in to continue your journey</p>

          {/* Demo credentials hint */}
          <div className="card p-4 mb-6 border-sand-500/20">
            <p className="text-xs font-mono text-sand-500 mb-2">Demo credentials:</p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <p className="text-sand-400">Admin</p>
                <p className="text-sand-600">admin@travel.com</p>
                <p className="text-sand-600">admin123</p>
              </div>
              <div>
                <p className="text-sand-400">User</p>
                <p className="text-sand-600">user@travel.com</p>
                <p className="text-sand-600">user1234</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-500" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-500 hover:text-sand-300 transition-colors">
                  {showPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center h-12 text-base">
              {loading ? (
                <div className="w-5 h-5 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sand-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-sand-300 hover:text-sand-100 font-medium transition-colors">
              Register free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
