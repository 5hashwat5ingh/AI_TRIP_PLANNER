import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, MapPin, Clock, CloudSun } from 'lucide-react';

export const ItineraryTimeline = ({ itinerary, currency = 'INR' }) => {
  const days = itinerary?.days || [];
  const [expandedDays, setExpandedDays] = useState(() => {
    const init = {};
    days.forEach((d) => {
      init[d.day] = true; // All days expanded in editorial view
    });
    return init;
  });

  const toggleDay = (dayNum) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayNum]: !prev[dayNum],
    }));
  };

  const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : `${currency} `;

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-sand-border gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-terracotta uppercase font-bold block mb-1">
            TIMETABLE & ROUTE LEDGER
          </span>
          <h2 className="text-3xl font-serif text-ink tracking-tight">
            DAY-BY-DAY EXPEDITION ROUTE
          </h2>
        </div>
        <span className="text-xs font-mono text-ink-muted uppercase">
          {days.length} DAYS · ZERO COMMUTE BACKTRACKING
        </span>
      </div>

      {/* Editorial Days List */}
      <div className="space-y-10">
        {days.map((day) => {
          const isExpanded = !!expandedDays[day.day];
          const weather = day.weather || { tempC: 22, condition: 'Clear' };
          const daySpend = day.estimatedDayCost || 4500;

          return (
            <div
              key={day.day}
              className="paper-card bg-white border border-sand-border overflow-hidden"
            >
              {/* Day Header */}
              <button
                type="button"
                onClick={() => toggleDay(day.day)}
                className="w-full p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between border-b border-sand-border hover:bg-sand/30 transition-colors text-left gap-4"
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-ink tracking-tight">
                    DAY {String(day.day).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-mono text-ink-muted uppercase tracking-wider">
                    {day.date}
                  </span>
                  <span className="text-sm font-serif italic text-ink font-normal">
                    — {day.location || day.title}
                  </span>
                </div>

                <div className="flex items-center gap-6 font-mono text-xs">
                  <span className="flex items-center gap-1.5 text-ink-muted bg-sand px-2.5 py-1 border border-sand-border">
                    <CloudSun className="w-3.5 h-3.5 text-terracotta" />
                    {weather.tempC}°C · {weather.condition}
                  </span>
                  <span className="text-ink font-bold">
                    EST. {symbol}{Number(daySpend).toLocaleString()}
                  </span>
                  <span className="text-xs text-ink-muted">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </div>
              </button>

              {/* Day Timeline Route Body */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-6 sm:p-8 bg-[#FAF8F5]"
                  >
                    <div className="space-y-6 relative pl-6 sm:pl-8 border-l border-terracotta/40">
                      {day.timeline?.map((event, idx) => (
                        <div key={idx} className="relative group">
                          {/* Route waypoint dot */}
                          <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-terracotta" />

                          {/* Event Row */}
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-6 pb-4 border-b border-sand-border/60">
                            <div className="sm:w-28 flex-shrink-0">
                              <span className="font-mono text-xs font-bold text-terracotta uppercase">
                                {event.time}
                              </span>
                              <span className="block text-[10px] font-mono text-ink-muted uppercase mt-0.5">
                                {event.period || 'Event'}
                              </span>
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h4 className="text-base font-serif font-bold text-ink">
                                  {event.title}
                                </h4>
                                {event.category && (
                                  <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 bg-sand border border-sand-border text-ink">
                                    {event.category}
                                  </span>
                                )}
                              </div>

                              {event.location && (
                                <p className="text-xs font-mono text-ink-muted flex items-center gap-1 mt-1">
                                  <MapPin className="w-3 h-3 text-terracotta" />
                                  {event.location}
                                  {event.duration && <span>· {event.duration}</span>}
                                </p>
                              )}

                              {event.highlights && (
                                <p className="text-xs font-sans text-ink/80 mt-2 leading-relaxed max-w-2xl">
                                  {event.highlights}
                                </p>
                              )}
                            </div>

                            <div className="text-right sm:w-28 flex-shrink-0 font-mono text-xs text-ink-muted">
                              <span>{event.cost}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItineraryTimeline;
