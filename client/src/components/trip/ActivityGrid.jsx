import React from 'react';
import { MapPin, Clock } from 'lucide-react';

export const ActivityGrid = ({ activities = [], currency = 'INR' }) => {
  const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : `${currency} `;
  const formatCurrency = (amt) => `${symbol}${Number(amt).toLocaleString()}`;

  return (
    <div className="space-y-10 paper-card p-6 sm:p-10 bg-white border border-sand-border">
      {/* Header */}
      <div className="pb-6 border-b border-sand-border">
        <span className="text-[10px] font-mono tracking-[0.25em] text-terracotta uppercase font-bold block mb-1">
          CURATED EXPERIENCES
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-ink tracking-tight uppercase">
          ACTIVITIES & SIGHTS DIRECTORY
        </h2>
        <p className="text-xs font-sans text-ink-muted mt-1 max-w-lg">
          Curated by Activity Agent: Matching your specific interests with admissions fees and visit durations.
        </p>
      </div>

      {/* Editorial Sights Directory */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((act) => (
          <div
            key={act.id}
            className="p-6 bg-[#F6F3ED] border border-sand-border flex flex-col justify-between hover:border-ink transition-colors"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-sand-border mb-3 font-mono text-[10px]">
                <span className="uppercase text-terracotta font-bold tracking-wider">{act.category}</span>
                <span className="text-ink-muted uppercase">{act.durationHours} HRS DURATION</span>
              </div>

              <h4 className="text-xl font-serif font-bold text-ink mb-2">
                {act.name}
              </h4>

              <p className="text-xs font-mono text-ink-muted flex items-center gap-1 mb-3">
                <MapPin className="w-3 h-3 text-terracotta" />
                {act.area || act.city}
              </p>

              {act.highlights && (
                <p className="text-xs font-sans text-ink/80 leading-relaxed bg-white p-3 border border-sand-border mb-4">
                  {act.highlights}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-sand-border flex items-center justify-between font-mono text-xs">
              <span className="text-ink-muted uppercase text-[10px]">ADMISSION:</span>
              <span className="font-serif font-bold text-ink">
                {act.totalCost > 0 ? formatCurrency(act.totalCost) : 'FREE ENTRY'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityGrid;
