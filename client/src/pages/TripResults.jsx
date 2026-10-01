import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Share2,
  Printer,
  Sliders,
  RotateCcw,
  ChevronLeft,
  MapPin,
  Calendar,
  Users,
  Wallet,
  ArrowRight
} from 'lucide-react';
import { tripAPI } from '../services/api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import TripOverview from '../components/trip/TripOverview';
import ItineraryTimeline from '../components/trip/ItineraryTimeline';
import FlightDetails from '../components/trip/FlightDetails';
import HotelDetails from '../components/trip/HotelDetails';
import ActivityGrid from '../components/trip/ActivityGrid';
import BudgetDashboard from '../components/trip/BudgetDashboard';
import InteractiveMap from '../components/trip/InteractiveMap';
import WeatherWidget from '../components/trip/WeatherWidget';
import AIReasoningPanel from '../components/trip/AIReasoningPanel';
import TripModificationModal from '../components/trip/TripModificationModal';
import ShareTripModal from '../components/trip/ShareTripModal';
import AgentExecutionModal from '../components/agents/AgentExecutionModal';

export const TripResults = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(location.state?.trip || null);
  const [loading, setLoading] = useState(!location.state?.trip);
  const [activeTab, setActiveTab] = useState('overview');

  // Modals
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [isReplanning, setIsReplanning] = useState(false);
  const [isSaved, setIsSaved] = useState(trip?.isSaved || false);

  useEffect(() => {
    if (!trip && id) {
      const fetchTrip = async () => {
        try {
          const res = await tripAPI.getTripById(id);
          if (res.data.success) {
            setTrip(res.data.trip);
            setIsSaved(res.data.trip.isSaved || false);
          }
        } catch (err) {
          console.error('Failed to load trip', err);
        } finally {
          setLoading(false);
        }
      };
      fetchTrip();
    }
  }, [id, trip]);

  const handleToggleSave = async () => {
    const nextState = !isSaved;
    setIsSaved(nextState);
    try {
      const tripId = trip._id || trip.id || id;
      await tripAPI.updateTrip(tripId, { isSaved: nextState });
    } catch (e) {
      console.warn('Could not update saved status');
    }
  };

  const handleModifyTrip = async (prompt) => {
    setIsModifying(true);
    try {
      const tripId = trip._id || trip.id || id;
      const res = await tripAPI.modifyTrip(tripId, prompt);
      if (res.data.success && res.data.trip) {
        setTimeout(() => {
          setTrip(res.data.trip);
          setIsModifying(false);
          setIsModifyOpen(false);
        }, 1800);
      }
    } catch (err) {
      console.error('Modification failed', err);
      setIsModifying(false);
    }
  };

  const handleReplanTrip = async () => {
    setIsReplanning(true);
    try {
      const tripId = trip._id || trip.id || id;
      const res = await tripAPI.replanTrip(tripId);
      if (res.data.success && res.data.trip) {
        setTimeout(() => {
          setTrip(res.data.trip);
          setIsReplanning(false);
        }, 2200);
      }
    } catch (err) {
      console.error('Replanning failed', err);
      setIsReplanning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F6F3ED]">
        <span className="font-mono text-xs uppercase tracking-widest text-ink mb-2">RETRIEVING TRAVEL DOSSIER...</span>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-[#F6F3ED]">
        <h3 className="text-2xl font-serif text-ink">Dossier not found</h3>
        <p className="text-xs text-ink-muted mt-2 mb-6 font-mono">THE REQUESTED ITINERARY COULD NOT BE LOADED.</p>
        <Button variant="primary" onClick={() => navigate('/plan')}>
          Plan a New Journey
        </Button>
      </div>
    );
  }

  const currency = trip.currency || 'INR';
  const totalCost = trip.budgetAnalysis?.totalCost || trip.budget;
  const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : `${currency} `;

  const tabs = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'itinerary', label: 'JOURNEY' },
    { id: 'stays', label: 'STAYS' },
    { id: 'flights', label: 'FLIGHTS' },
    { id: 'activities', label: 'EXPERIENCES' },
    { id: 'budget', label: 'BUDGET' },
    { id: 'map', label: 'MAP' },
    { id: 'weather', label: 'WEATHER' },
    { id: 'reasoning', label: 'WHY THIS JOURNEY?' },
  ];

  return (
    <div className="py-8 sm:py-12 min-h-screen bg-[#F6F3ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Back Nav & Quick Info */}
        <div className="flex items-center justify-between pb-4 border-b border-sand-border mb-8 text-xs font-mono text-ink-muted no-print">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 hover:text-ink uppercase tracking-wider"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <span className="uppercase tracking-widest text-terracotta font-bold">
            DOSSIER #{trip.shareId || (trip._id ? String(trip._id).substring(0, 6).toUpperCase() : 'EXP-01')}
          </span>
        </div>

        {/* Editorial Header Banner */}
        <div className="paper-card p-6 sm:p-10 bg-white border border-sand-border mb-8 relative">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-sand-border">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-ink-muted uppercase tracking-widest">
                <span>{trip.startDate} — {trip.endDate}</span>
                <span>·</span>
                <span>{trip.origin} ✈ {trip.destination}</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-serif text-ink tracking-tight uppercase">
                {trip.destination}
              </h1>
              <p className="text-xs font-sans text-ink-muted mt-2">
                {trip.title || `Bespoke ${trip.duration}-Day Expedition to ${trip.destination}`}
              </p>
            </div>

            <div className="flex flex-wrap items-baseline gap-6 font-mono text-xs">
              <div>
                <span className="text-ink-muted uppercase block text-[10px] tracking-wider">Duration</span>
                <span className="text-xl font-serif font-bold text-ink">{trip.duration} DAYS</span>
              </div>
              <div>
                <span className="text-ink-muted uppercase block text-[10px] tracking-wider">Travelers</span>
                <span className="text-xl font-serif font-bold text-ink">{trip.travelers?.total || 2} ADULTS</span>
              </div>
              <div>
                <span className="text-ink-muted uppercase block text-[10px] tracking-wider">Estimated Total</span>
                <span className="text-xl font-serif font-bold text-terracotta">
                  {symbol}{Number(totalCost).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={isSaved ? 'secondary' : 'outline'}
                size="sm"
                onClick={handleToggleSave}
                leftIcon={<Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'text-terracotta fill-terracotta' : ''}`} />}
              >
                {isSaved ? 'Saved Plan' : 'Save Plan'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsModifyOpen(true)}
                leftIcon={<Sliders className="w-3.5 h-3.5 text-terracotta" />}
              >
                Change Journey
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsShareOpen(true)}
                leftIcon={<Share2 className="w-3.5 h-3.5" />}
              >
                Share Dossier
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                leftIcon={<Printer className="w-3.5 h-3.5" />}
              >
                Download PDF
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReplanTrip}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Replan All
            </Button>
          </div>
        </div>

        {/* Editorial Text Navigation Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto pb-3 mb-8 border-b border-sand-border no-print scrollbar-none font-mono text-xs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 whitespace-nowrap uppercase tracking-widest font-semibold transition-colors relative cursor-pointer ${
                  isActive
                    ? 'text-terracotta font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-terracotta'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panes */}
        <div className="min-h-[500px]">
          {activeTab === 'overview' && <TripOverview trip={trip} />}
          {activeTab === 'itinerary' && <ItineraryTimeline itinerary={trip.itinerary} currency={currency} />}
          {activeTab === 'stays' && <HotelDetails hotelData={trip.hotels} currency={currency} />}
          {activeTab === 'flights' && <FlightDetails flightsData={trip.flights} currency={currency} origin={trip.origin} destination={trip.destination} />}
          {activeTab === 'activities' && <ActivityGrid activities={trip.activities} currency={currency} />}
          {activeTab === 'budget' && <BudgetDashboard budgetData={trip.budgetAnalysis} currency={currency} totalBudget={trip.budget} />}
          {activeTab === 'map' && <InteractiveMap trip={trip} />}
          {activeTab === 'weather' && <WeatherWidget weatherData={trip.weather} destination={trip.destination} />}
          {activeTab === 'reasoning' && <AIReasoningPanel trip={trip} />}
        </div>
      </div>

      {/* Editorial Trip Modification Command Modal */}
      <TripModificationModal
        isOpen={isModifyOpen}
        onClose={() => setIsModifyOpen(false)}
        onModify={handleModifyTrip}
        isModifying={isModifying}
      />

      {/* Share Modal */}
      <ShareTripModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        tripId={trip._id || trip.id || id}
        shareId={trip.shareId}
        tripTitle={trip.title}
      />

      {/* Replan Loading Visualizer */}
      <AgentExecutionModal
        isOpen={isReplanning || isModifying}
        tripDetails={{
          destination: trip.destination,
          origin: trip.origin,
          duration: trip.duration,
          currency: trip.currency,
          budget: trip.budget,
          travelStyle: trip.travelStyle,
          preferences: trip.preferences
        }}
      />
    </div>
  );
};

export default TripResults;
