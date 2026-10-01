import React from 'react';
import { Building2, Check, Star } from 'lucide-react';

export const HotelDetails = ({ hotelData, currency = 'INR' }) => {
  const options = hotelData?.options || [];
  const selected = hotelData?.selectedOption || options[0];

  const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : `${currency} `;
  const formatCurrency = (amt) => `${symbol}${Number(amt).toLocaleString()}`;

  return (
    <div className="space-y-10 paper-card p-6 sm:p-10 bg-white border border-sand-border">
      {/* Header */}
      <div className="pb-6 border-b border-sand-border">
        <span className="text-[10px] font-mono tracking-[0.25em] text-terracotta uppercase font-bold block mb-1">
          HOSPITALITY LEDGER
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-ink tracking-tight uppercase">
          CURATED ACCOMMODATION
        </h2>
        <p className="text-xs font-sans text-ink-muted mt-1 max-w-lg">
          Evaluated by Hotel Agent: Prioritizing central neighborhood connectivity, high guest satisfaction, and price efficiency.
        </p>
      </div>

      {/* Selected Hotel Dossier Block */}
      {selected && (
        <div className="p-6 sm:p-8 bg-[#F6F3ED] border border-sand-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b border-sand-border gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-terracotta font-bold block mb-1">
                PRIMARY STAY RECOMMENDATION
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
                {selected.name}
              </h3>
              <p className="text-xs font-mono text-ink-muted mt-1">
                LOCATION: {selected.location} · ★ {selected.rating} / 5.0 GUEST RATING
              </p>
            </div>

            <div className="text-right font-mono">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-ink block">
                {formatCurrency(selected.totalPrice)}
              </span>
              <span className="text-xs text-ink-muted">
                {formatCurrency(selected.pricePerNight)} / night ({selected.totalNights} nights)
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono text-ink-muted uppercase tracking-widest block mb-3 font-bold">
              INCLUDED AMENITIES & HIGHLIGHTS:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-ink">
              {(selected.amenities || ['Artisan Breakfast', 'Fast WiFi', 'Near Subway Interchange', '24hr Front Desk']).map((amenity, i) => (
                <div key={i} className="p-3 bg-white border border-sand-border flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-olive flex-shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alternatives Grid */}
      {options.length > 1 && (
        <div className="space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-ink font-bold block">
            ALTERNATIVE STAYS CONSIDERED
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {options.filter(h => h.id !== selected?.id).map((hotel) => (
              <div key={hotel.id} className="p-5 bg-white border border-sand-border flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between font-mono text-xs mb-2">
                    <span className="text-terracotta font-bold">★ {hotel.rating}</span>
                    <span className="uppercase text-[10px] text-ink-muted">{hotel.tier}</span>
                  </div>
                  <h4 className="text-base font-serif font-bold text-ink">{hotel.name}</h4>
                  <p className="text-xs font-mono text-ink-muted mt-0.5">{hotel.location}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-sand-border flex items-center justify-between font-mono text-xs">
                  <span className="text-ink-muted">{hotel.totalNights} nights:</span>
                  <span className="font-serif font-bold text-ink">{formatCurrency(hotel.totalPrice)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetails;
