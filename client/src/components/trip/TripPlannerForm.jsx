import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Calendar, Users, Wallet, Check, Plus, Sliders, MessageSquareQuote } from 'lucide-react';
import Button from '../ui/Button';

export const TripPlannerForm = ({ onSubmit, isLoading, initialValues }) => {
  const [formData, setFormData] = useState({
    destination: initialValues?.destination || 'Japan',
    origin: initialValues?.origin || 'Delhi',
    startDate: initialValues?.startDate || new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    endDate: initialValues?.endDate || new Date(Date.now() + 86400000 * 21).toISOString().split('T')[0],
    adults: initialValues?.travelers?.adults || 2,
    children: initialValues?.travelers?.children || 0,
    budget: initialValues?.budget || 200000,
    currency: initialValues?.currency || 'INR',
    preferences: initialValues?.preferences || ['Culture', 'Food', 'Nature', 'Anime', 'Photography'],
    travelStyle: initialValues?.travelStyle || 'balanced',
    specialInstructions: initialValues?.specialInstructions || 'Plan a relaxed 7-day trip to Japan for two people. We love Japanese food, anime, photography and nature, and we would like to stay under ₹2 lakh.',
  });

  const [customInterest, setCustomInterest] = useState('');

  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return 7;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const duration = calculateDuration();

  const availablePreferences = [
    'Nature', 'Food', 'Culture', 'Adventure', 'Photography',
    'Shopping', 'Nightlife', 'Anime', 'Beaches', 'Mountains', 'History', 'Romantic'
  ];

  const travelStyles = [
    { id: 'budget', label: 'Budget', desc: 'Hostels / smart stays, public transit, local street food' },
    { id: 'balanced', label: 'Balanced', desc: 'Boutique 3-4★ hotels, mixed dining, central sights' },
    { id: 'comfort', label: 'Comfort', desc: 'Premium 4★ hotels, private transfers, curated dining' },
    { id: 'luxury', label: 'Luxury', desc: '5★ luxury resorts, business cabin, private guides' },
  ];

  const destinationMetadata = {
    japan: { coords: '35.6762° N · 139.6503° E', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80', country: 'Japan' },
    paris: { coords: '48.8566° N · 2.3522° E', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80', country: 'France' },
    switzerland: { coords: '47.0502° N · 8.3093° E', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80', country: 'Switzerland' },
    goa: { coords: '15.2993° N · 74.1240° E', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80', country: 'India' },
    bali: { coords: '8.3405° S · 115.0920° E', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80', country: 'Indonesia' },
  };

  const currentMetaKey = Object.keys(destinationMetadata).find(k => formData.destination.toLowerCase().includes(k)) || 'japan';
  const activeMeta = destinationMetadata[currentMetaKey];

  const togglePreference = (pref) => {
    setFormData(prev => {
      const exists = prev.preferences.includes(pref);
      return {
        ...prev,
        preferences: exists ? prev.preferences.filter(p => p !== pref) : [...prev.preferences, pref]
      };
    });
  };

  const addCustomInterest = (e) => {
    e.preventDefault();
    if (!customInterest.trim()) return;
    if (!formData.preferences.includes(customInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        preferences: [...prev.preferences, customInterest.trim()]
      }));
    }
    setCustomInterest('');
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSubmit({
      destination: formData.destination,
      origin: formData.origin,
      startDate: formData.startDate,
      endDate: formData.endDate,
      duration: duration,
      travelers: {
        adults: Number(formData.adults),
        children: Number(formData.children),
        total: Number(formData.adults) + Number(formData.children)
      },
      budget: Number(formData.budget),
      currency: formData.currency,
      preferences: formData.preferences,
      travelStyle: formData.travelStyle,
      specialInstructions: formData.specialInstructions,
      userId: 'guest_user_default'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {/* 2-Column Travel Planning Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-8 paper-card p-6 sm:p-8 bg-white border border-sand-border">
          <div className="pb-4 border-b border-sand-border">
            <span className="text-[10px] font-mono tracking-widest text-terracotta uppercase font-bold block mb-1">
              SPECIFICATION FORM
            </span>
            <h2 className="text-2xl font-serif text-ink tracking-tight">
              PLAN YOUR JOURNEY
            </h2>
          </div>

          {/* Section 1: Route */}
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-ink-muted uppercase tracking-widest block">
              01 / DESTINATION & ORIGIN
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                  Where from? (Origin)
                </label>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  placeholder="e.g. Delhi, London, Mumbai"
                  className="w-full bg-[#F6F3ED] border border-sand-border rounded-none px-4 py-3 text-ink focus:outline-none focus:border-ink text-sm font-sans"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                  Where to? (Destination)
                </label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="e.g. Japan, Paris, Switzerland"
                  className="w-full bg-[#F6F3ED] border border-sand-border rounded-none px-4 py-3 text-ink focus:outline-none focus:border-ink text-sm font-sans"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Dates & Duration */}
          <div className="space-y-4 pt-4 border-t border-sand-border">
            <span className="text-[10px] font-mono text-ink-muted uppercase tracking-widest block">
              02 / DATES & TIMEFRAME ({duration} DAYS)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full bg-[#F6F3ED] border border-sand-border rounded-none px-4 py-2.5 text-ink focus:outline-none focus:border-ink text-sm font-sans"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full bg-[#F6F3ED] border border-sand-border rounded-none px-4 py-2.5 text-ink focus:outline-none focus:border-ink text-sm font-sans"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Travelers & Budget */}
          <div className="space-y-4 pt-4 border-t border-sand-border">
            <span className="text-[10px] font-mono text-ink-muted uppercase tracking-widest block">
              03 / TRAVELERS & BUDGET LIMIT
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                  Adults
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={formData.adults}
                  onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) || 1 })}
                  className="w-full bg-[#F6F3ED] border border-sand-border rounded-none px-4 py-2.5 text-ink focus:outline-none focus:border-ink text-sm font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                  Children
                </label>
                <input
                  type="number"
                  min="0"
                  max="8"
                  value={formData.children}
                  onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#F6F3ED] border border-sand-border rounded-none px-4 py-2.5 text-ink focus:outline-none focus:border-ink text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full bg-[#F6F3ED] border border-sand-border rounded-none px-3 py-2.5 text-ink focus:outline-none focus:border-ink text-sm font-mono"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Total Budget Ceiling
              </label>
              <input
                type="number"
                step="1000"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="200000"
                className="w-full bg-[#F6F3ED] border border-sand-border rounded-none px-4 py-3 text-ink focus:outline-none focus:border-ink text-sm font-mono font-bold"
                required
              />
            </div>
          </div>

          {/* Section 4: Travel Style */}
          <div className="space-y-4 pt-4 border-t border-sand-border">
            <span className="text-[10px] font-mono text-ink-muted uppercase tracking-widest block">
              04 / TRAVEL STYLE
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {travelStyles.map((s) => {
                const isSelected = formData.travelStyle === s.id;
                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setFormData({ ...formData, travelStyle: s.id })}
                    className={`p-3 text-left border transition-all ${
                      isSelected
                        ? 'bg-ink text-white border-ink'
                        : 'bg-[#F6F3ED] text-ink border-sand-border hover:border-ink'
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider block">{s.label}</span>
                    <span className="text-[10px] opacity-75 line-clamp-1 mt-0.5">{s.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Interests */}
          <div className="space-y-4 pt-4 border-t border-sand-border">
            <span className="text-[10px] font-mono text-ink-muted uppercase tracking-widest block">
              05 / WHAT ARE YOU LOOKING FOR?
            </span>
            <div className="flex flex-wrap gap-2">
              {availablePreferences.map((pref) => {
                const isSelected = formData.preferences.includes(pref);
                return (
                  <button
                    type="button"
                    key={pref}
                    onClick={() => togglePreference(pref)}
                    className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider border transition-all ${
                      isSelected
                        ? 'bg-terracotta text-white border-terracotta'
                        : 'bg-[#F6F3ED] text-ink border-sand-border hover:border-ink'
                    }`}
                  >
                    {pref}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 6: Editorial Travel Brief */}
          <div className="space-y-3 pt-4 border-t border-sand-border">
            <span className="text-[10px] font-mono text-ink-muted uppercase tracking-widest block">
              06 / TRAVEL BRIEF & INSTRUCTIONS
            </span>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider">
              Tell us how you want to travel.
            </label>
            <textarea
              rows={4}
              value={formData.specialInstructions}
              onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
              placeholder="Plan a relaxed 7-day trip to Japan for two people. We love Japanese food, anime, photography and nature, and we'd like to stay under ₹2 lakh..."
              className="w-full bg-[#F6F3ED] border border-sand-border rounded-none p-4 text-ink focus:outline-none focus:border-ink text-xs sm:text-sm font-sans leading-relaxed"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-sand-border">
            <Button
              type="submit"
              variant="accent"
              size="lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full py-4 shadow-none"
            >
              Build My Journey →
            </Button>
          </div>
        </div>

        {/* Right Column: Destination Visual Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="paper-card border border-sand-border bg-white p-4 shadow-sm sticky top-24">
            <div className="relative h-72 sm:h-80 overflow-hidden bg-sand mb-4">
              <img
                src={activeMeta.image}
                alt={formData.destination}
                className="w-full h-full object-cover grayscale-[10%]"
              />
              <div className="absolute top-3 left-3 bg-ink/90 text-ivory text-[9px] font-mono tracking-widest px-2.5 py-1 uppercase">
                {activeMeta.coords}
              </div>
            </div>

            <div className="p-4 bg-[#F6F3ED] border border-sand-border space-y-3">
              <div className="flex items-baseline justify-between pb-3 border-b border-sand-border">
                <div>
                  <span className="text-[10px] font-mono text-terracotta uppercase font-bold tracking-widest">
                    TARGET DOSSIER
                  </span>
                  <h3 className="text-2xl font-serif text-ink font-bold">
                    {formData.destination.toUpperCase()}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-ink">
                  {duration} DAYS
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-ink-muted">
                <div>ORIGIN: <strong className="text-ink">{formData.origin}</strong></div>
                <div>TRAVELERS: <strong className="text-ink">{Number(formData.adults) + Number(formData.children)}</strong></div>
                <div>BUDGET: <strong className="text-ink">{formData.currency} {Number(formData.budget).toLocaleString()}</strong></div>
                <div>STYLE: <strong className="text-ink capitalize">{formData.travelStyle}</strong></div>
              </div>

              <div className="pt-2 border-t border-sand-border text-[11px] font-mono text-ink-muted leading-snug">
                Interests: <span className="text-ink">{formData.preferences.join(', ') || 'General Sightseeing'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default TripPlannerForm;
