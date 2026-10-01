import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TripPlannerForm from '../components/trip/TripPlannerForm';
import AgentExecutionModal from '../components/agents/AgentExecutionModal';
import { tripAPI } from '../services/api';

export const PlanTrip = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilled = location.state?.prefill;

  const [isLoading, setIsLoading] = useState(false);
  const [executingTripInfo, setExecutingTripInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGenerateTrip = async (formData) => {
    setIsLoading(true);
    setExecutingTripInfo(formData);
    setErrorMessage('');

    try {
      const res = await tripAPI.generateTrip(formData);
      if (res.data.success && res.data.trip) {
        setTimeout(() => {
          setIsLoading(false);
          const tripId = res.data.trip._id || res.data.trip.id;
          navigate(`/trip/${tripId}`, { state: { trip: res.data.trip } });
        }, 2600);
      } else {
        throw new Error(res.data.message || 'Failed to orchestrate trip');
      }
    } catch (err) {
      console.error('[Generation Error]', err);
      setIsLoading(false);
      setErrorMessage(err.response?.data?.message || err.message || 'Something went wrong during trip generation. Please try again.');
    }
  };

  return (
    <div className="py-12 sm:py-16 min-h-[calc(100vh-80px)] bg-[#F6F3ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-8 border-b border-sand-border mb-10">
          <span className="text-[10px] font-mono tracking-[0.25em] text-terracotta uppercase font-bold block mb-1">
            DOSSIER BUILDER
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-ink tracking-tight">
            TRAVEL PLANNING WORKSPACE
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-sans text-ink-muted max-w-xl">
            Configure your journey parameters or specify a brief. Our 9 specialized agents coordinate to calculate optimal routes, accommodations, and schedules.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-8 p-4 bg-red-950/10 border border-red-800 text-red-900 text-xs font-mono flex items-center justify-between">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage('')} className="font-bold underline uppercase">Dismiss</button>
          </div>
        )}

        <TripPlannerForm
          onSubmit={handleGenerateTrip}
          isLoading={isLoading}
          initialValues={prefilled}
        />
      </div>

      {/* Redesigned Editorial Agent Processing Modal */}
      <AgentExecutionModal
        isOpen={isLoading}
        tripDetails={executingTripInfo}
      />
    </div>
  );
};

export default PlanTrip;
