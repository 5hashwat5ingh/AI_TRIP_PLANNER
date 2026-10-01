import React from 'react';
import { Plane, ArrowRight, Luggage } from 'lucide-react';

export const FlightDetails = ({ flightsData, currency = 'INR', origin = 'Delhi', destination = 'Japan' }) => {
  const options = flightsData?.options || [];
  const selected = flightsData?.selectedOption || options[0];

  const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : `${currency} `;
  const formatCurrency = (amt) => `${symbol}${Number(amt).toLocaleString()}`;

  return (
    <div className="space-y-10 paper-card p-6 sm:p-10 bg-white border border-sand-border">
      {/* Header */}
      <div className="pb-6 border-b border-sand-border">
        <span className="text-[10px] font-mono tracking-[0.25em] text-terracotta uppercase font-bold block mb-1">
          AVIATION ITINERARY
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-ink tracking-tight uppercase">
          FLIGHT ROUTES & CARRIER TARIFFS
        </h2>
        <p className="text-xs font-sans text-ink-muted mt-1 max-w-lg">
          Analyzed by Flight Agent: Selecting optimal round-trip connections with balanced duration and luggage inclusions.
        </p>
      </div>

      {/* Selected Flight Dossier Block */}
      {selected && (
        <div className="p-6 sm:p-8 bg-[#F6F3ED] border border-sand-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b border-sand-border gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-terracotta font-bold block mb-1">
                RECOMMENDED CARRIER SELECTION
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
                {selected.airline}
              </h3>
              <p className="text-xs font-mono text-ink-muted mt-1">
                FLIGHT {selected.flightNumber} · {selected.cabinClass}
              </p>
            </div>

            <div className="text-right font-mono">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-ink block">
                {formatCurrency(selected.totalPrice)}
              </span>
              <span className="text-xs text-ink-muted">
                {formatCurrency(selected.pricePerTraveler)} / traveler
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            {/* Outbound */}
            <div className="p-4 bg-white border border-sand-border space-y-3">
              <div className="flex items-center justify-between text-ink-muted pb-2 border-b border-sand-border">
                <span className="font-bold text-ink uppercase">OUTBOUND LEG</span>
                <span>{selected.outbound?.date}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-bold text-ink block">{origin}</span>
                  <span className="text-xs text-ink-muted">{selected.outbound?.departureTime}</span>
                </div>
                <span className="text-terracotta font-bold text-xs">✈ {selected.outbound?.duration}</span>
                <div className="text-right">
                  <span className="font-bold text-ink block">{destination}</span>
                  <span className="text-xs text-ink-muted">{selected.outbound?.arrivalTime}</span>
                </div>
              </div>
            </div>

            {/* Return */}
            <div className="p-4 bg-white border border-sand-border space-y-3">
              <div className="flex items-center justify-between text-ink-muted pb-2 border-b border-sand-border">
                <span className="font-bold text-ink uppercase">RETURN LEG</span>
                <span>{selected.returnFlight?.date}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-bold text-ink block">{destination}</span>
                  <span className="text-xs text-ink-muted">{selected.returnFlight?.departureTime}</span>
                </div>
                <span className="text-terracotta font-bold text-xs">✈ {selected.returnFlight?.duration}</span>
                <div className="text-right">
                  <span className="font-bold text-ink block">{origin}</span>
                  <span className="text-xs text-ink-muted">{selected.returnFlight?.arrivalTime}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 text-xs font-mono text-ink-muted flex items-center justify-between">
            <span>Baggage Policy: <strong>{selected.baggage}</strong></span>
            <span className="text-olive font-bold uppercase">Reserved in Dossier</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightDetails;
