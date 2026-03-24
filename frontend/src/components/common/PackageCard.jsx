import { Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiUsers, FiStar } from 'react-icons/fi';
import { MdHotel, MdRestaurant, MdDirectionsBus, MdRecordVoiceOver } from 'react-icons/md';

const facilityIcons = {
  hotel: { icon: MdHotel, label: 'Hotel' },
  food: { icon: MdRestaurant, label: 'Food' },
  transport: { icon: MdDirectionsBus, label: 'Transport' },
  guide: { icon: MdRecordVoiceOver, label: 'Guide' },
};

export default function PackageCard({ pkg, index = 0 }) {
  const enabledFacilities = Object.entries(pkg.facilities || {}).filter(([, v]) => v);
  const delay = (index % 6) * 100;

  return (
    <Link
      to={`/packages/${pkg._id}`}
      className="group block card hover:border-sand-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-sand-500/5 hover:-translate-y-1 animate-fade-up opacity-0-init"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden rounded-t-2xl">
        <img
          src={pkg.image?.url || `https://images.unsplash.com/photo-1548013146-72479768bada?w=600`}
          alt={pkg.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent" />

        {/* Featured badge */}
        {pkg.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sand-400/90 backdrop-blur-sm text-ink-900 text-xs font-bold font-mono">
            <FiStar className="w-3 h-3 fill-current" /> Featured
          </div>
        )}

        {/* Price */}
        <div className="absolute bottom-3 right-3 glass px-3 py-1.5 rounded-lg">
          <span className="text-sand-300 font-mono text-xs">from</span>
          <p className="text-sand-100 font-display font-semibold text-lg leading-none">
            ₹{pkg.price?.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-lg text-sand-100 group-hover:text-sand-300 transition-colors line-clamp-1 mb-2">
          {pkg.title}
        </h3>
        <p className="text-sand-500 text-sm leading-relaxed line-clamp-2 mb-4">{pkg.description}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-sand-400 text-xs">
            <FiMapPin className="w-3.5 h-3.5 text-sand-500" />
            <span className="truncate max-w-[100px]">{pkg.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sand-400 text-xs">
            <FiClock className="w-3.5 h-3.5 text-sand-500" />
            <span>{pkg.duration} {pkg.duration === 1 ? 'day' : 'days'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sand-400 text-xs">
            <FiUsers className="w-3.5 h-3.5 text-sand-500" />
            <span>Max {pkg.maxGroupSize}</span>
          </div>
        </div>

        {/* Facilities */}
        {enabledFacilities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-4 border-t border-ink-600/40">
            {enabledFacilities.map(([key]) => {
              const { icon: Icon, label } = facilityIcons[key] || {};
              return Icon ? (
                <span key={key} className="facility-chip bg-forest-900/40 border border-forest-700/30 text-forest-400">
                  <Icon className="w-3 h-3" /> {label}
                </span>
              ) : null;
            })}
          </div>
        )}
      </div>
    </Link>
  );
}
