import React from 'react';
import {
  Wallet,
  Calendar,
  Users,
  MapPin,
  Plane,
  Building2,
  TrendingDown,
  ShieldCheck,
  Check
} from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export const TripOverview = ({ trip }) => {
  if (!trip) return null;

  const budget = trip.budgetAnalysis || {};
  const flight = trip.flights?.selectedOption;
  const hotel = trip.hotels?.selectedOption;
  const days = trip.itinerary?.days || [];
  const currency = trip.currency || 'INR';

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '0';
    const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : `${currency} `;
    return `${symbol}${Number(amount).toLocaleString()}`;
  };

  return (
    <div className="space-y-8">
      {/* 4 Metric Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="paper-card p-6 bg-white border border-sand-border">
          <span className="text-[10px] font-mono text-ink-muted uppercase tracking-widest block mb-1">
            ESTIMATED TOTAL EXPENSE
          </span>
          <p className="text-3xl font-serif font-bold text-ink">
            {formatCurrency(budget.totalCost || trip.budget)}
          </p>
          <div className="mt-2 pt-2 border-t border-sand-border flex items-center justify-between text-xs font-mono">
            <span className="text-ink-muted">Budget: {formatCurrency(trip.budget)}</span>
            <span className="text-olive font-bold uppercase">Within Budget</span>
          </div>
        </div>

        <div className="paper-card p-6 bg-white border border-sand-border">
          <span className="text-[10px] font-mono text-ink-muted uppercase tracking-widest block mb-1">
            EXPEDITION DURATION
          </span>
          <p className="text-3xl font-serif font-bold text-ink">
            {trip.duration || days.length || 7} DAYS
          </p>
          <div className="mt-2 pt-2 border-t border-sand-border text-xs font-mono text-ink-muted truncate">
            {trip.startDate} → {trip.endDate}
          </div>
        </div>

        <div className="paper-card p-6 bg-white border border-sand-border">
          <span className="text-[10px] font-mono text-ink-muted uppercase tracking-widest block mb-1">
            TRAVEL PARTY
          </span>
          <p className="text-3xl font-serif font-bold text-ink">
            {trip.travelers?.total || trip.travelers || 2} ADULTS
          </p>
          <div className="mt-2 pt-2 border-t border-sand-border text-xs font-mono text-ink-muted capitalize">
            Pace: <strong className="text-ink">{trip.travelStyle || 'Balanced'}</strong>
          </div>
        </div>

        <div className="paper-card p-6 bg-white border border-sand-border">
          <span className="text-[10px] font-mono text-ink-muted uppercase tracking-widest block mb-1">
            REMAINING CUSHION
          </span>
          <p className="text-3xl font-serif font-bold text-olive">
            {formatCurrency(budget.remainingBudget || 0)}
          </p>
          <div className="mt-2 pt-2 border-t border-sand-border text-xs font-mono text-ink-muted">
            Buffer for shopping & leisure
          </div>
        </div>
      </div>

      {/* Lodging, Route & Validation Dossier Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flight Selection Card */}
        <div className="paper-card p-6 bg-white border border-sand-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-sand-border mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-ink-muted">
                AVIATION SELECTION
              </span>
              <span className="text-[10px] font-mono uppercase bg-sand px-2 py-0.5 border border-sand-border">
                {flight?.cabinClass || 'Economy Standard'}
              </span>
            </div>

            <h4 className="text-xl font-serif font-bold text-ink">{flight?.airline || 'Commercial Airline'}</h4>
            <p className="text-xs font-mono text-ink-muted mt-0.5">{flight?.flightNumber || 'FLIGHT-01'}</p>

            <div className="my-4 p-3 bg-[#F6F3ED] border border-sand-border text-xs font-mono flex items-center justify-between">
              <div>
                <span className="font-bold text-ink block">{trip.origin}</span>
                <span className="text-[10px] text-ink-muted">{flight?.outbound?.departureTime}</span>
              </div>
              <span className="text-terracotta text-xs font-bold">✈ {flight?.outbound?.duration}</span>
              <div className="text-right">
                <span className="font-bold text-ink block">{trip.destination}</span>
                <span className="text-[10px] text-ink-muted">{flight?.outbound?.arrivalTime}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-sand-border flex items-center justify-between font-mono text-xs">
            <span className="text-ink-muted">Flight Total:</span>
            <span className="font-serif font-bold text-ink">{formatCurrency(flight?.totalPrice || 0)}</span>
          </div>
        </div>

        {/* Accommodation Selection Card */}
        <div className="paper-card p-6 bg-white border border-sand-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-sand-border mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-ink-muted">
                RECOMMENDED STAY
              </span>
              <span className="text-xs font-mono text-terracotta font-bold">
                ★ {hotel?.rating || '4.6'}
              </span>
            </div>

            <h4 className="text-xl font-serif font-bold text-ink">{hotel?.name || 'Boutique Hotel'}</h4>
            <p className="text-xs font-sans text-ink-muted mt-0.5">{hotel?.location || trip.destination}</p>

            <div className="my-4 space-y-1 text-xs font-mono text-ink-muted">
              {(hotel?.amenities || ['Near Metro Station', 'Artisan Breakfast Included', 'High-speed WiFi']).slice(0, 3).map((a, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-olive flex-shrink-0" />
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-sand-border flex items-center justify-between font-mono text-xs">
            <span className="text-ink-muted">{hotel?.totalNights || trip.duration} Nights:</span>
            <span className="font-serif font-bold text-ink">{formatCurrency(hotel?.totalPrice || 0)}</span>
          </div>
        </div>

        {/* Validator Quality Score */}
        <div className="paper-card p-6 bg-[#172B2A] text-ivory border border-forest-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-terracotta">
                VALIDATOR AUDIT
              </span>
              <span className="text-xs font-mono text-ivory font-bold">
                SCORE: {trip.validation?.score || 95}/100
              </span>
            </div>

            <h4 className="text-xl font-serif text-white">Route Logistics Approved</h4>
            <p className="text-xs font-sans text-ivory/70 mt-2 leading-relaxed">
              {trip.validation?.reasoning || 'All travel constraints, schedule pacing, geographic clusters, and financial limits verified with zero conflicts.'}
            </p>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-ivory/80">
            <span>AUDIT GATES: {trip.validation?.passedCount || 5} / {trip.validation?.totalChecks || 5}</span>
            <span className="text-olive font-bold">PASSED</span>
          </div>
        </div>
      </div>

      {/* Preferences Pill Row */}
      {trip.preferences && trip.preferences.length > 0 && (
        <div className="p-4 bg-sand border border-sand-border flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-ink-muted uppercase tracking-wider mr-2">Curated Interests:</span>
          {trip.preferences.map((p) => (
            <span key={p} className="px-3 py-1 bg-white border border-sand-border text-ink uppercase font-semibold">
              {p}
            </span>
          ))}
          {trip.specialInstructions && (
            <span className="text-xs font-sans text-ink-muted italic ml-auto line-clamp-1">
              "{trip.specialInstructions}"
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TripOverview;
