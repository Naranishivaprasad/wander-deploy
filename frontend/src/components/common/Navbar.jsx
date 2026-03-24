import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiCompass, FiMenu, FiX, FiUser, FiLogOut,
  FiPackage, FiBookOpen, FiSettings, FiChevronDown
} from 'react-icons/fi';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const navLinks = [
    { to: '/packages', label: 'Packages' },
    ...(user ? [{ to: '/my-bookings', label: 'My Bookings' }] : []),
    ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'glass shadow-2xl shadow-black/40' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sand-400 to-sand-600 flex items-center justify-center shadow-lg shadow-sand-500/20 group-hover:shadow-sand-400/40 transition-shadow">
              <FiCompass className="text-ink-900 w-5 h-5" />
            </div>
            <div>
              <span className="font-display text-xl text-sand-200 leading-none">Wander</span>
              <span className="font-display text-xl text-sand-400 leading-none">India</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-sand-400/15 text-sand-300'
                      : 'text-sand-400 hover:text-sand-200 hover:bg-ink-700/60'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((p) => !p)}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-ink-700/60 border border-ink-600/60 hover:border-sand-500/40 transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-forest-400 to-forest-600 flex items-center justify-center text-xs font-bold text-white">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-sand-200">{user.name.split(' ')[0]}</span>
                  <FiChevronDown className={`w-4 h-4 text-sand-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 card shadow-2xl shadow-black/50 py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-ink-600/50 mb-1">
                      <p className="text-xs text-sand-500 font-mono">{user.email}</p>
                      <p className="text-xs text-sand-400 font-mono uppercase mt-0.5">{user.role}</p>
                    </div>
                    <Link to="/my-bookings" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-sand-300 hover:bg-ink-700/60 hover:text-sand-100 transition-colors">
                      <FiBookOpen className="w-4 h-4" /> My Bookings
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-sand-300 hover:bg-ink-700/60 hover:text-sand-100 transition-colors">
                        <FiSettings className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-ink-600/50 mt-1 pt-1">
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
                        <FiLogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary py-2 text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary py-2 text-sm">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen((p) => !p)}
            className="md:hidden p-2 rounded-lg text-sand-400 hover:text-sand-200 hover:bg-ink-700/60 transition-colors">
            {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-ink-600/40 animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'bg-sand-400/15 text-sand-300' : 'text-sand-400 hover:bg-ink-700/60 hover:text-sand-200'
                  }`
                }>
                {l.label}
              </NavLink>
            ))}
            <div className="border-t border-ink-600/40 pt-3 mt-3">
              {user ? (
                <div className="space-y-2">
                  <div className="px-4 py-2">
                    <p className="text-sm font-medium text-sand-200">{user.name}</p>
                    <p className="text-xs text-sand-500 font-mono">{user.email}</p>
                  </div>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                    <FiLogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary justify-center">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary justify-center">Get Started</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
