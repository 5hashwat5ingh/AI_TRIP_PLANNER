import React, { useState } from 'react';
import { MapPin, Navigation, Building2, Landmark, Utensils, Compass } from 'lucide-react';
import Card from '../ui/Card';

export const InteractiveMap = ({ trip }) => {
  const activities = trip?.activities || [];
  const hotel = trip?.hotels?.selectedOption;
  const [selectedPin, setSelectedPin] = useState(hotel || activities[0] || null);

  const waypoints = [
    ...(hotel ? [{
      id: 'hotel-01',
      num: '01',
      name: hotel.name,
      type: 'Hotel / Stay',
      area: hotel.location,
      lat: 35.6938,
      lng: 139.7034,
      isHotel: true
    }] : []),
    ...activities.map((act, i) => ({
      id: act.id || `act-${i}`,
      num: String(i + (hotel ? 2 : 1)).padStart(2, '0'),
      name: act.name,
      type: act.category || 'Experience',
      area: act.area || act.city,
      lat: act.coordinates?.lat || (35.65 + (i * 0.02)),
      lng: act.coordinates?.lng || (139.70 + (i * 0.015)),
      highlights: act.highlights
    }))
  ];

  return (
    <div className="space-y-8 paper-card p-6 sm:p-10 bg-white border border-sand-border">
      {/* Header */}
      <div className="pb-6 border-b border-sand-border flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-terracotta uppercase font-bold block mb-1">
            GEOGRAPHIC VISUALIZER
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-ink tracking-tight uppercase">
            DESTINATION ROUTE MAP
          </h2>
        </div>
        <span className="text-xs font-mono text-ink-muted uppercase">
          {waypoints.length} WAYPOINTS · CLUSTERED TRANSIT
        </span>
      </div>

      {/* Map Interactive Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-[#F6F3ED] border border-sand-border p-6 relative min-h-[440px] flex flex-col justify-between overflow-hidden">
          {/* Subtle Grid Map Texture */}
          <div className="absolute inset-0 map-grid-pattern opacity-60 pointer-events-none" />

          <div className="flex items-center justify-between z-10 font-mono text-xs text-ink-muted">
            <span className="tracking-widest uppercase font-bold text-ink">
              ROUTE SCHEMATIC: {trip?.destination}
            </span>
            <span>COORDINATES: 35.6762° N, 139.6503° E</span>
          </div>

          {/* Interactive Waypoints Horizontal Ledger */}
          <div className="relative my-10 flex flex-wrap items-center justify-around gap-4 z-10">
            {waypoints.slice(0, 6).map((pin) => {
              const isSelected = selectedPin?.name === pin.name;
              return (
                <button
                  key={pin.id}
                  onClick={() => setSelectedPin(pin)}
                  className={`flex flex-col items-center group transition-transform ${
                    isSelected ? 'scale-110' : 'hover:scale-105'
                  }`}
                >
                  <div
                    className={`w-10 h-10 border flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                      pin.isHotel
                        ? 'bg-forest text-ivory border-forest'
                        : isSelected
                        ? 'bg-terracotta text-white border-terracotta'
                        : 'bg-white text-ink border-sand-border hover:border-ink'
                    }`}
                  >
                    {pin.num}
                  </div>
                  <span className="text-[11px] font-mono font-bold text-ink mt-2 max-w-[100px] truncate text-center bg-white px-2 py-0.5 border border-sand-border">
                    {pin.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] font-mono text-ink-muted uppercase mt-0.5">
                    {pin.type.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Waypoint Detail Box */}
          {selectedPin && (
            <div className="z-10 p-4 bg-white border border-sand-border flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono text-terracotta uppercase font-bold">
                  WAYPOINT {selectedPin.num || '01'} · {selectedPin.type || 'Stay'}
                </span>
                <h4 className="text-base font-serif font-bold text-ink mt-0.5">{selectedPin.name}</h4>
                <p className="text-xs font-mono text-ink-muted">{selectedPin.area || selectedPin.location}</p>
              </div>
              <span className="text-xs font-mono px-3 py-1 bg-sand border border-sand-border uppercase text-ink">
                Active Node
              </span>
            </div>
          )}
        </div>

        {/* Directory Ledger */}
        <div className="lg:col-span-4 space-y-2 max-h-[440px] overflow-y-auto pr-1 font-mono text-xs">
          <span className="text-[10px] text-ink-muted uppercase tracking-widest block mb-2 font-bold">
            WAYPOINT DIRECTORY:
          </span>
          {waypoints.map((pin) => {
            const isSelected = selectedPin?.name === pin.name;
            return (
              <div
                key={pin.id}
                onClick={() => setSelectedPin(pin)}
                className={`p-3 border transition-colors cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-ink text-white border-ink'
                    : 'bg-white text-ink border-sand-border hover:border-ink'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-bold text-terracotta">{pin.num}</span>
                  <span className="truncate font-semibold">{pin.name}</span>
                </div>
                <span className="text-[10px] opacity-75 uppercase flex-shrink-0 ml-2">{pin.type}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
