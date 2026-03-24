import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiArrowRight, FiMapPin, FiStar, FiShield, FiHeadphones } from 'react-icons/fi';
import { MdHotel, MdRestaurant, MdDirectionsBus, MdRecordVoiceOver } from 'react-icons/md';
import api from '../api/axios';
import PackageCard from '../components/common/PackageCard';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1548013146-72479768bada?w=1600',
  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600',
  'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1600',
];

const DESTINATIONS = [
  { name: 'Rajasthan', count: '12 tours', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400' },
  { name: 'Kerala', count: '8 tours', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400' },
  { name: 'Himachal', count: '10 tours', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400' },
  { name: 'Goa', count: '6 tours', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [heroIdx, setHeroIdx] = useState(0);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/packages?featured=true').then(({ data }) => setFeatured(data.data.slice(0, 3)));
    const interval = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/packages?search=${search}`);
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* BG slideshow */}
        {HERO_IMAGES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === heroIdx ? 1 : 0 }}
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-ink-900/60 via-ink-900/40 to-ink-900/90" />
          </div>
        ))}

        {/* Grain overlay */}
        <div className="absolute inset-0 bg-grain opacity-40 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sand-400/15 border border-sand-400/30 text-sand-400 text-xs font-mono tracking-widest uppercase mb-8 animate-fade-in">
            <FiMapPin className="w-3 h-3" /> Incredible India Awaits
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-sand-100 leading-tight mb-6 animate-fade-up">
            Journey Beyond
            <br />
            <span className="text-gradient italic">the Ordinary</span>
          </h1>

          <p className="text-sand-400 text-lg md:text-xl max-w-xl mx-auto mb-10 animate-fade-up animate-delay-200">
            Curated travel experiences through India's most breathtaking landscapes, cultures, and hidden gems.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-xl mx-auto animate-fade-up animate-delay-300">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search destinations, packages..."
                className="input-field pl-11 h-14 rounded-2xl text-base"
              />
            </div>
            <button type="submit" className="btn-primary h-14 px-8 rounded-2xl text-base whitespace-nowrap">
              Explore <FiArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-12 animate-fade-up animate-delay-400">
            {[['500+', 'Happy Travellers'], ['50+', 'Destinations'], ['4.9★', 'Avg Rating']].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="font-display text-2xl text-sand-300">{val}</p>
                <p className="text-sand-500 text-xs font-mono">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-10 bg-gradient-to-b from-sand-400/60 to-transparent" />
        </div>
      </section>

      {/* ── Popular Destinations ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-12">
          <p className="text-sand-500 font-mono text-xs tracking-widest uppercase mb-3">Popular Places</p>
          <h2 className="section-title">Top <span className="text-gradient">Destinations</span></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {DESTINATIONS.map((dest, i) => (
            <Link
              key={dest.name}
              to={`/packages?location=${dest.name}`}
              className="group relative h-48 md:h-64 rounded-2xl overflow-hidden animate-fade-up opacity-0-init"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
            >
              <img src={dest.img} alt={dest.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <h3 className="font-display text-xl text-sand-100">{dest.name}</h3>
                <p className="text-sand-400 text-xs font-mono">{dest.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Packages ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-sand-500 font-mono text-xs tracking-widest uppercase mb-3">Hand-Picked</p>
            <h2 className="section-title">Featured <span className="text-gradient">Packages</span></h2>
          </div>
          <Link to="/packages" className="btn-secondary hidden md:inline-flex">
            View All <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((pkg, i) => <PackageCard key={pkg._id} pkg={pkg} index={i} />)}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link to="/packages" className="btn-secondary">View All Packages <FiArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-sand-500 font-mono text-xs tracking-widest uppercase mb-3">Why WanderIndia</p>
          <h2 className="section-title">Travel With <span className="text-gradient">Confidence</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: FiStar, title: 'Curated Experiences', desc: 'Every package is handpicked and verified by our travel experts for quality.' },
            { icon: MdHotel, title: 'Premium Stay', desc: 'Carefully selected hotels and resorts that match your comfort standards.' },
            { icon: FiShield, title: 'Safe & Reliable', desc: 'Fully insured trips with 24/7 on-ground support throughout your journey.' },
            { icon: FiHeadphones, title: '24/7 Support', desc: 'Our dedicated team is always available to assist you whenever needed.' },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="card p-6 group hover:border-sand-500/30 transition-all duration-300 animate-fade-up opacity-0-init"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sand-400/20 to-sand-600/10 border border-sand-500/20 flex items-center justify-center mb-5 group-hover:border-sand-400/40 transition-all">
                <Icon className="w-5 h-5 text-sand-400" />
              </div>
              <h3 className="font-display text-lg text-sand-200 mb-2">{title}</h3>
              <p className="text-sand-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="relative rounded-3xl overflow-hidden">
          <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400" alt="" className="w-full h-72 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900/90 via-ink-900/70 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-16">
            <h2 className="font-display text-4xl text-sand-100 mb-3">Ready to explore?</h2>
            <p className="text-sand-400 mb-6 max-w-sm">Browse our complete catalogue of India's finest travel packages.</p>
            <div className="flex gap-3">
              <Link to="/packages" className="btn-primary">Explore Packages <FiArrowRight className="w-4 h-4" /></Link>
              <Link to="/register" className="btn-secondary">Join Free</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
