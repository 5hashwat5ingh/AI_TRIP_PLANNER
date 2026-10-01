import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, ArrowRight, Trash2 } from 'lucide-react';
import { tripAPI } from '../services/api';
import Button from '../components/ui/Button';

export const SavedTrips = () => {
  const navigate = useNavigate();
  const [savedTrips, setSavedTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await tripAPI.getUserTrips();
        if (res.data.success) {
          const filtered = (res.data.trips || []).filter(t => t.isSaved);
          setSavedTrips(filtered);
        }
      } catch (err) {
        console.error('Failed to load saved trips', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  const handleRemoveSaved = async (e, tripId) => {
    e.stopPropagation();
    try {
      await tripAPI.updateTrip(tripId, { isSaved: false });
      setSavedTrips(prev => prev.filter(t => (t._id || t.id) !== tripId));
    } catch (err) {
      console.error('Failed to remove bookmark', err);
    }
  };

  return (
    <div className="py-10 sm:py-16 min-h-screen bg-[#F6F3ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-sand-border gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-terracotta uppercase font-bold block mb-1">
              BOOKMARKED ARCHIVE
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-ink tracking-tight">
              SAVED EXPEDITIONS
            </h1>
            <p className="text-xs sm:text-sm font-sans text-ink-muted mt-1">
              Curated itineraries saved for future reservations and dispatch.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/plan')}>
            Plan Another Trip →
          </Button>
        </div>

        {loading ? (
          <div className="py-16 text-center font-mono text-xs text-ink-muted uppercase tracking-widest">
            LOADING BOOKMARKS...
          </div>
        ) : savedTrips.length === 0 ? (
          <div className="paper-card p-12 text-center bg-white border border-sand-border space-y-4">
            <h4 className="text-2xl font-serif text-ink">No Bookmarked Plans</h4>
            <p className="text-xs font-sans text-ink-muted max-w-sm mx-auto">
              When viewing an itinerary dossier, click the "Save Plan" button to archive it here.
            </p>
            <div className="pt-2">
              <Button variant="primary" size="md" onClick={() => navigate('/plan')}>
                Explore Destinations →
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedTrips.map((tripItem) => {
              const tripId = tripItem._id || tripItem.id;
              const cost = tripItem.budgetAnalysis?.totalCost || tripItem.budget;
              const currency = tripItem.currency || 'INR';
              const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : `${currency} `;

              return (
                <div
                  key={tripId}
                  onClick={() => navigate(`/trip/${tripId}`, { state: { trip: tripItem } })}
                  className="paper-card p-6 bg-white border border-sand-border hover:border-ink transition-colors cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between pb-3 border-b border-sand-border mb-3 font-mono text-xs">
                      <span className="text-[10px] uppercase font-bold text-terracotta tracking-wider">
                        {tripItem.destination}
                      </span>
                      <button
                        onClick={(e) => handleRemoveSaved(e, tripId)}
                        className="text-ink-muted hover:text-red-700"
                        title="Remove Bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-xl font-serif font-bold text-ink group-hover:text-terracotta transition-colors">
                      {tripItem.title || `${tripItem.destination} Journey`}
                    </h4>

                    <p className="text-xs font-mono text-ink-muted mt-1">
                      {tripItem.duration} DAYS · FROM {tripItem.origin}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-sand-border flex items-baseline justify-between font-mono text-xs">
                    <div>
                      <span className="text-[9px] text-ink-muted uppercase block">TOTAL</span>
                      <span className="font-serif font-bold text-base text-ink">
                        {symbol}{Number(cost).toLocaleString()}
                      </span>
                    </div>
                    <span className="text-ink uppercase font-bold text-[10px] group-hover:text-terracotta flex items-center gap-1">
                      Open Dossier <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedTrips;
