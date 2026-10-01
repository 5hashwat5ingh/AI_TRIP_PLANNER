import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, ArrowRight } from 'lucide-react';
import { tripAPI } from '../services/api';
import Button from '../components/ui/Button';
import TripOverview from '../components/trip/TripOverview';
import ItineraryTimeline from '../components/trip/ItineraryTimeline';
import FlightDetails from '../components/trip/FlightDetails';
import HotelDetails from '../components/trip/HotelDetails';
import ActivityGrid from '../components/trip/ActivityGrid';
import BudgetDashboard from '../components/trip/BudgetDashboard';
import InteractiveMap from '../components/trip/InteractiveMap';
import WeatherWidget from '../components/trip/WeatherWidget';

export const SharedTripView = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const res = await tripAPI.getSharedTrip(id);
        if (res.data.success) {
          setTrip(res.data.trip);
        }
      } catch (err) {
        console.error('Failed to load shared trip', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShared();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F6F3ED]">
        <span className="font-mono text-xs uppercase tracking-widest text-ink">RETRIEVING SHARED DOSSIER...</span>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-[#F6F3ED]">
        <h3 className="text-2xl font-serif text-ink">Shared Dossier Not Found</h3>
        <p className="text-xs font-mono text-ink-muted mt-2 mb-6">THIS ITINERARY LINK MAY HAVE EXPIRED OR IS INVALID.</p>
        <Link to="/">
          <Button variant="primary">Return to Home →</Button>
        </Link>
      </div>
    );
  }

  const currency = trip.currency || 'INR';
  const tabs = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'itinerary', label: 'JOURNEY' },
    { id: 'stays', label: 'STAYS' },
    { id: 'flights', label: 'FLIGHTS' },
    { id: 'activities', label: 'EXPERIENCES' },
    { id: 'budget', label: 'BUDGET' },
    { id: 'map', label: 'MAP' },
    { id: 'weather', label: 'WEATHER' },
  ];

  return (
    <div className="py-8 sm:py-12 min-h-screen bg-[#F6F3ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Read-Only Banner */}
        <div className="mb-6 p-4 bg-sand border border-sand-border flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="text-ink">
            <span>PUBLIC DOSSIER VIEW · <strong>READ-ONLY MODE</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              leftIcon={<Printer className="w-3.5 h-3.5" />}
            >
              Print Dossier
            </Button>
            <Link to="/plan">
              <Button variant="accent" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Build Your Own Journey
              </Button>
            </Link>
          </div>
        </div>

        {/* Title Header */}
        <div className="paper-card p-6 sm:p-10 bg-white border border-sand-border mb-8">
          <div className="flex items-center gap-2 mb-2 font-mono text-xs text-ink-muted uppercase tracking-widest">
            <span>{trip.startDate} — {trip.endDate}</span>
            <span>·</span>
            <span>{trip.duration} DAYS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif text-ink tracking-tight uppercase">
            {trip.title || `${trip.destination} Expedition`}
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto pb-3 mb-8 border-b border-sand-border font-mono text-xs">
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

        {/* Panes */}
        <div>
          {activeTab === 'overview' && <TripOverview trip={trip} />}
          {activeTab === 'itinerary' && <ItineraryTimeline itinerary={trip.itinerary} currency={currency} />}
          {activeTab === 'stays' && <HotelDetails hotelData={trip.hotels} currency={currency} />}
          {activeTab === 'flights' && <FlightDetails flightsData={trip.flights} currency={currency} origin={trip.origin} destination={trip.destination} />}
          {activeTab === 'activities' && <ActivityGrid activities={trip.activities} currency={currency} />}
          {activeTab === 'budget' && <BudgetDashboard budgetData={trip.budgetAnalysis} currency={currency} totalBudget={trip.budget} />}
          {activeTab === 'map' && <InteractiveMap trip={trip} />}
          {activeTab === 'weather' && <WeatherWidget weatherData={trip.weather} destination={trip.destination} />}
        </div>
      </div>
    </div>
  );
};

export default SharedTripView;
