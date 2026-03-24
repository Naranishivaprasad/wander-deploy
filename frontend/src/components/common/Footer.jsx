import { Link } from 'react-router-dom';
import { FiCompass, FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="border-t border-ink-600/40 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sand-400 to-sand-600 flex items-center justify-center">
                <FiCompass className="text-ink-900 w-5 h-5" />
              </div>
              <div>
                <span className="font-display text-xl text-sand-200">Wander</span>
                <span className="font-display text-xl text-sand-400">India</span>
              </div>
            </Link>
            <p className="text-sand-500 text-sm leading-relaxed">
              Crafting unforgettable journeys across the length and breadth of incredible India since 2018.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-ink-700/60 border border-ink-600/60 flex items-center justify-center text-sand-500 hover:text-sand-300 hover:border-sand-500/40 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sand-300 font-mono text-xs tracking-widest uppercase mb-5">Explore</h4>
            <ul className="space-y-3">
              {[['/', 'Home'], ['/packages', 'All Packages'], ['/packages?featured=true', 'Featured Tours'], ['/packages?location=Kerala', 'South India'], ['/packages?location=Rajasthan', 'Rajasthan']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sand-500 text-sm hover:text-sand-300 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sand-300 font-mono text-xs tracking-widest uppercase mb-5">Account</h4>
            <ul className="space-y-3">
              {[['/login', 'Sign In'], ['/register', 'Register'], ['/my-bookings', 'My Bookings']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sand-500 text-sm hover:text-sand-300 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sand-300 font-mono text-xs tracking-widest uppercase mb-5">Contact</h4>
            <ul className="space-y-4">
              {[
                [FiMapPin, '12 Connaught Place, New Delhi 110001'],
                [FiMail, 'hello@wanderindia.com'],
                [FiPhone, '+91 98765 43210'],
              ].map(([Icon, text], i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-sand-500">
                  <Icon className="w-4 h-4 mt-0.5 text-sand-600 flex-shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-ink-600/40 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sand-600 text-xs font-mono">© {new Date().getFullYear()} WanderIndia. All rights reserved.</p>
          <p className="text-sand-600 text-xs font-mono">Built with ♥ for explorers</p>
        </div>
      </div>
    </footer>
  );
}
