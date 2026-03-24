import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiArrowLeft, FiUpload, FiSave, FiPackage,
  FiMapPin, FiDollarSign, FiClock, FiUsers
} from 'react-icons/fi';
import { MdHotel, MdRestaurant, MdDirectionsBus, MdRecordVoiceOver } from 'react-icons/md';
import api from '../api/axios';

const FACILITIES = [
  { key: 'hotel',     Icon: MdHotel,            label: 'Hotel Stay' },
  { key: 'food',      Icon: MdRestaurant,       label: 'Meals Included' },
  { key: 'transport', Icon: MdDirectionsBus,    label: 'Transportation' },
  { key: 'guide',     Icon: MdRecordVoiceOver,  label: 'Expert Guide' },
];

const EMPTY = {
  title: '', description: '', price: '', duration: '',
  location: '', maxGroupSize: '20', featured: false,
  facilities: { hotel: false, food: false, transport: false, guide: false },
};

export default function AdminPackageForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  // Load existing package when editing
  useEffect(() => {
    if (!isEdit) return;
    api.get(`/packages/${id}`)
      .then(({ data }) => {
        const p = data.data;
        setForm({
          title: p.title || '',
          description: p.description || '',
          price: p.price || '',
          duration: p.duration || '',
          location: p.location || '',
          maxGroupSize: p.maxGroupSize || '20',
          featured: p.featured || false,
          facilities: p.facilities || EMPTY.facilities,
        });
        if (p.image?.url) setImagePreview(p.image.url);
      })
      .catch(() => { toast.error('Package not found'); navigate('/admin'); })
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const toggleFacility = (key) =>
    setForm((f) => ({ ...f, facilities: { ...f.facilities, [key]: !f.facilities[key] } }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.duration || !form.location) {
      toast.error('Please fill in all required fields'); return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'facilities') formData.append(k, JSON.stringify(v));
        else formData.append(k, v);
      });
      if (imageFile) formData.append('image', imageFile);

      if (isEdit) {
        await api.put(`/packages/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Package updated!');
      } else {
        await api.post('/packages', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Package created!');
      }
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save package');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-sand-400/30 border-t-sand-400 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => navigate('/admin')}
            className="p-2.5 rounded-xl bg-ink-700/60 border border-ink-600/60 text-sand-400 hover:text-sand-200 hover:border-sand-500/40 transition-all">
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-sand-500 font-mono text-xs tracking-widest uppercase mb-1">Admin</p>
            <h1 className="font-display text-3xl text-sand-100">
              {isEdit ? 'Edit Package' : 'Add New Package'}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="card p-6 space-y-5">
                <h2 className="font-display text-xl text-sand-200 flex items-center gap-2">
                  <FiPackage className="w-5 h-5 text-sand-400" /> Basic Information
                </h2>

                <div>
                  <label className="label">Package Title *</label>
                  <input value={form.title} onChange={set('title')}
                    placeholder="e.g. Golden Triangle Tour" className="input-field" required />
                </div>

                <div>
                  <label className="label">Description *</label>
                  <textarea value={form.description} onChange={set('description')}
                    placeholder="Describe the travel experience in detail..."
                    rows={5} className="input-field resize-none" required />
                  <p className="text-sand-600 text-xs font-mono mt-1">{form.description.length}/2000</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Price per Person (₹) *</label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-500" />
                      <input type="number" min="0" value={form.price} onChange={set('price')}
                        placeholder="15000" className="input-field pl-9" required />
                    </div>
                  </div>
                  <div>
                    <label className="label">Duration (Days) *</label>
                    <div className="relative">
                      <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-500" />
                      <input type="number" min="1" value={form.duration} onChange={set('duration')}
                        placeholder="7" className="input-field pl-9" required />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Location *</label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-500" />
                      <input value={form.location} onChange={set('location')}
                        placeholder="e.g. Rajasthan" className="input-field pl-9" required />
                    </div>
                  </div>
                  <div>
                    <label className="label">Max Group Size</label>
                    <div className="relative">
                      <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-500" />
                      <input type="number" min="1" value={form.maxGroupSize} onChange={set('maxGroupSize')}
                        className="input-field pl-9" />
                    </div>
                  </div>
                </div>

                {/* Featured toggle */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    className={`w-11 h-6 rounded-full transition-colors relative ${form.featured ? 'bg-sand-400' : 'bg-ink-600'}`}
                    onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.featured ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                  <div>
                    <span className="text-sand-300 text-sm font-medium">Mark as Featured</span>
                    <p className="text-sand-600 text-xs font-mono">Featured packages appear on the homepage</p>
                  </div>
                </label>
              </div>

              {/* Facilities */}
              <div className="card p-6">
                <h2 className="font-display text-xl text-sand-200 mb-5">Included Facilities</h2>
                <div className="grid grid-cols-2 gap-3">
                  {FACILITIES.map(({ key, Icon, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleFacility(key)}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left ${
                        form.facilities[key]
                          ? 'bg-forest-500/15 border-forest-500/40 text-forest-300'
                          : 'bg-ink-700/40 border-ink-600/50 text-sand-500 hover:border-sand-500/30 hover:text-sand-400'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{label}</span>
                      {form.facilities[key] && (
                        <div className="ml-auto w-4 h-4 rounded-full bg-forest-400 flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column — Image */}
            <div className="space-y-6">
              <div className="card p-6">
                <h2 className="font-display text-xl text-sand-200 mb-5">Package Image</h2>

                {/* Preview */}
                <div className="relative h-48 rounded-xl overflow-hidden bg-ink-700/60 border border-ink-600/50 mb-4">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-sand-600">
                      <FiUpload className="w-8 h-8 mb-2" />
                      <p className="text-sm font-mono">No image selected</p>
                    </div>
                  )}
                </div>

                <label className="btn-secondary w-full justify-center cursor-pointer">
                  <FiUpload className="w-4 h-4" />
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                  <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                </label>
                <p className="text-sand-600 text-xs font-mono mt-2 text-center">JPG, PNG, WebP — max 5MB</p>
              </div>

              {/* Price Preview */}
              {form.price && (
                <div className="card p-6 animate-fade-in">
                  <h3 className="text-sand-400 font-mono text-xs tracking-widest uppercase mb-4">Preview</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-sand-500">Per person</span>
                      <span className="text-sand-300 font-mono">₹{Number(form.price).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-sand-500">For 2 people</span>
                      <span className="text-sand-300 font-mono">₹{(Number(form.price) * 2).toLocaleString('en-IN')}</span>
                    </div>
                    {form.duration && (
                      <div className="flex justify-between text-sm border-t border-ink-600/50 pt-2 mt-2">
                        <span className="text-sand-500">Duration</span>
                        <span className="text-sand-300 font-mono">{form.duration} days</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink-600/40">
            <button type="button" onClick={() => navigate('/admin')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary px-8">
              {loading ? (
                <div className="w-5 h-5 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
              ) : (
                <><FiSave className="w-4 h-4" /> {isEdit ? 'Save Changes' : 'Create Package'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
