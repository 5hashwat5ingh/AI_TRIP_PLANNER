import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, ArrowRight, Trash2, Plus, MapPin } from 'lucide-react';
import { tripAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await tripAPI.getUserTrips();
        if (res.data.success) {
          setTrips(res.data.trips || []);
        }
      } catch (err) {
        console.error('Failed to load trips', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const handleDeleteTrip = async (e, tripId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to remove this itinerary dossier?')) return;
    try {
      await tripAPI.deleteTrip(tripId);
      setTrips(prev => prev.filter(t => (t._id || t.id) !== tripId));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const totalTrips = trips.length;
  const savedTrips = trips.filter(t => t.isSaved);
  const totalDaysPlanned = trips.reduce((sum, t) => sum + (t.duration || 0), 0);

  return (
    <div className="py-10 sm:py-16 min-h-screen bg-[#F6F3ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-sand-border gap-6">
          <div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-terracotta uppercase font-bold block mb-1">
              COMMAND CENTER & ARCHIVE
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-ink tracking-tight">
              TRAVELER DOSSIER LEDGER
            </h1>
            <p className="text-xs sm:text-sm font-sans text-ink-muted mt-1">
              Welcome, <strong className="text-ink">{user?.name || 'Explorer'}</strong>. Manage your multi-agent itineraries and bookmarked plans.
            </p>
          </div>
          <Button
            size="md"
            variant="accent"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/plan')}
          >
            Plan a New Journey
          </Button>
        </div>

        {/* 3 Metric Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
          <div className="paper-card p-6 bg-white border border-sand-border">
            <span className="text-ink-muted uppercase block text-[10px] tracking-widest">TOTAL ITINERARIES</span>
            <span className="text-3xl font-serif font-bold text-ink block mt-1">{totalTrips} DOSSIERS</span>
            <span className="text-ink-muted text-[10px] mt-1 block">Autonomous multi-agent plans</span>
          </div>

          <div className="paper-card p-6 bg-white border border-sand-border">
            <span className="text-ink-muted uppercase block text-[10px] tracking-widest">EXPEDITION DAYS</span>
            <span className="text-3xl font-serif font-bold text-ink block mt-1">{totalDaysPlanned} DAYS</span>
            <span className="text-ink-muted text-[10px] mt-1 block">Across curated destinations</span>
          </div>

          <div className="paper-card p-6 bg-white border border-sand-border">
            <span className="text-ink-muted uppercase block text-[10px] tracking-widest">SAVED EXPEDITIONS</span>
            <span className="text-3xl font-serif font-bold text-terracotta block mt-1">{savedTrips.length} BOOKMARKS</span>
            <span className="text-ink-muted text-[10px] mt-1 block">Flagged for execution</span>
          </div>
        </div>

        {/* Trips Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-sand-border">
            <span className="text-xs font-mono font-bold text-ink uppercase tracking-widest">
              RECENT ITINERARY DOSSIERS
            </span>
            <span className="text-xs font-mono text-ink-muted">
              {trips.length} AVAILABLE
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center font-mono text-xs text-ink-muted uppercase tracking-widest">
              LOADING DOSSIERS...
            </div>
          ) : trips.length === 0 ? (
            <div className="paper-card p-12 text-center bg-white border border-sand-border space-y-4">
              <h4 className="text-2xl font-serif text-ink">No Itineraries Found</h4>
              <p className="text-xs font-sans text-ink-muted max-w-sm mx-auto">
                Commission your first journey with our 9 specialized AI travel agents.
              </p>
              <div className="pt-2">
                <Button variant="primary" size="md" onClick={() => navigate('/plan')}>
                  Create Your First Trip →
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((tripItem) => {
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
                        <div className="flex items-center gap-2">
                          {tripItem.isSaved && (
                            <Bookmark className="w-3.5 h-3.5 text-terracotta fill-terracotta" />
                          )}
                          <button
                            onClick={(e) => handleDeleteTrip(e, tripId)}
                            className="text-ink-muted hover:text-red-700"
                            title="Remove Dossier"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-xl font-serif font-bold text-ink group-hover:text-terracotta transition-colors">
                        {tripItem.title || `${tripItem.destination} Journey`}
                      </h4>

                      <p className="text-xs font-mono text-ink-muted mt-1">
                        ORIGIN: {tripItem.origin} · {tripItem.duration} DAYS
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-sand-border flex items-baseline justify-between font-mono text-xs">
                      <div>
                        <span className="text-[9px] text-ink-muted uppercase block">ESTIMATED</span>
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
    </div>
  );
};

export default Dashboard;
