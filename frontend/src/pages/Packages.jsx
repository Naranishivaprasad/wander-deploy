import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX, FiSliders } from 'react-icons/fi';
import api from '../api/axios';
import PackageCard from '../components/common/PackageCard';

const LOCATIONS = ['Rajasthan', 'Kerala', 'Goa', 'Himachal Pradesh', 'Andaman', 'Delhi', 'Agra', 'Jaipur'];

function Skeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-52 shimmer-box" />
      <div className="p-5 space-y-3">
        <div className="h-5 shimmer-box rounded w-3/4" />
        <div className="h-4 shimmer-box rounded w-full" />
        <div className="h-4 shimmer-box rounded w-2/3" />
        <div className="flex gap-2 mt-4">
          <div className="h-6 shimmer-box rounded w-16" />
          <div className="h-6 shimmer-box rounded w-16" />
        </div>
      </div>
    </div>
  );
}

// ✅ FilterPanel moved OUTSIDE Packages so it's never recreated on re-render
function FilterPanel({ filters, updateFilter, clearFilters, hasFilters }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="label">Search</label>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-500" />
          <input
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Keyword..."
            className="input-field pl-9"
          />
        </div>
      </div>

      <div>
        <label className="label">Location</label>
        <select
          value={filters.location}
          onChange={(e) => updateFilter('location', e.target.value)}
          className="input-field"
        >
          <option value="">All Locations</option>
          {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div>
        <label className="label">Price Range (₹)</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            placeholder="Min"
            className="input-field"
          />
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            placeholder="Max"
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="label">Duration (Days)</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={filters.minDays}
            onChange={(e) => updateFilter('minDays', e.target.value)}
            placeholder="Min"
            className="input-field"
          />
          <input
            type="number"
            value={filters.maxDays}
            onChange={(e) => updateFilter('maxDays', e.target.value)}
            placeholder="Max"
            className="input-field"
          />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer group">
        <div
          className={`w-10 h-5 rounded-full transition-colors ${filters.featured ? 'bg-sand-400' : 'bg-ink-600'} relative`}
          onClick={() => updateFilter('featured', filters.featured ? '' : 'true')}
        >
          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${filters.featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </div>
        <span className="text-sand-400 text-sm">Featured Only</span>
      </label>

      {hasFilters && (
        <button onClick={clearFilters} className="w-full btn-secondary text-sm justify-center">
          <FiX className="w-4 h-4" /> Clear Filters
        </button>
      )}
    </div>
  );
}

export default function Packages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minDays: searchParams.get('minDays') || '',
    maxDays: searchParams.get('maxDays') || '',
    featured: searchParams.get('featured') || '',
  });

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
      const { data } = await api.get(`/packages?${params}`);
      setPackages(data.data);
    } catch { setPackages([]); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchPackages(); }, [fetchPackages]);

  const updateFilter = (key, val) => setFilters((f) => ({ ...f, [key]: val }));
  const clearFilters = () => setFilters({ search: '', location: '', minPrice: '', maxPrice: '', minDays: '', maxDays: '', featured: '' });
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sand-500 font-mono text-xs tracking-widest uppercase mb-2">All Packages</p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="section-title">
              Discover <span className="text-gradient">India</span>
            </h1>
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden btn-secondary text-sm"
            >
              <FiSliders className="w-4 h-4" /> Filters {hasFilters && <span className="w-2 h-2 rounded-full bg-sand-400" />}
            </button>
          </div>
          {!loading && (
            <p className="text-sand-500 text-sm font-mono mt-2">
              {packages.length} package{packages.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="card p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <FiFilter className="w-4 h-4 text-sand-400" />
                <span className="text-sand-300 font-medium text-sm">Filters</span>
              </div>
              <FilterPanel
                filters={filters}
                updateFilter={updateFilter}
                clearFilters={clearFilters}
                hasFilters={hasFilters}
              />
            </div>
          </aside>

          {/* Mobile Sidebar Drawer */}
          {sidebarOpen && (
            <div className="md:hidden fixed inset-0 z-50">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-ink-800 border-l border-ink-600/50 p-6 overflow-y-auto animate-slide-in">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sand-200 font-medium">Filters</span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-lg text-sand-500 hover:text-sand-300 hover:bg-ink-700/60"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                <FilterPanel
                  filters={filters}
                  updateFilter={updateFilter}
                  clearFilters={clearFilters}
                  hasFilters={hasFilters}
                />
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <Skeleton key={i} />)}
              </div>
            ) : packages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-ink-700/60 border border-ink-600/50 flex items-center justify-center mb-5">
                  <FiSearch className="w-7 h-7 text-sand-600" />
                </div>
                <h3 className="font-display text-xl text-sand-300 mb-2">No packages found</h3>
                <p className="text-sand-500 text-sm mb-6">Try adjusting your search or filters</p>
                <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg, i) => <PackageCard key={pkg._id} pkg={pkg} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
