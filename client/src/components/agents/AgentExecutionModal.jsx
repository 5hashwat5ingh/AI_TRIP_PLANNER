import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

export const AgentExecutionModal = ({ isOpen, tripDetails }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const executionSteps = [
    { id: 'routes', num: '01', agent: 'ROUTES', action: 'Finding suitable flights & routes' },
    { id: 'stays', num: '02', agent: 'STAYS', action: 'Comparing neighborhoods & hotel tariffs' },
    { id: 'experiences', num: '03', agent: 'EXPERIENCES', action: 'Matching tailored attractions & food spots' },
    { id: 'transit', num: '04', agent: 'TRANSIT', action: 'Structuring bullet train & metro passes' },
    { id: 'weather', num: '05', agent: 'WEATHER', action: 'Checking conditions & rain probabilities' },
    { id: 'budget', num: '06', agent: 'BUDGET', action: 'Optimizing spending & category allocation' },
    { id: 'itinerary', num: '07', agent: 'ITINERARY', action: 'Arranging realistic day-by-day timetable' },
    { id: 'validation', num: '08', agent: 'VALIDATION', action: 'Checking budget limits & geographic flow' },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < executionSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 380);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const destination = tripDetails?.destination || 'Destination';
  const duration = tripDetails?.duration || 7;
  const travelers = tripDetails?.travelers?.total || tripDetails?.adults || 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-[#FFFFFF] border border-sand-border shadow-2xl p-6 sm:p-8 text-ink rounded-none relative overflow-hidden"
      >
        {/* Header */}
        <div className="pb-4 border-b border-sand-border">
          <span className="text-[10px] font-mono tracking-widest text-terracotta uppercase font-bold block mb-1">
            DOSSIER SYNTHESIS IN PROGRESS
          </span>
          <h2 className="text-2xl font-serif text-ink tracking-tight uppercase">
            BUILDING YOUR JOURNEY
          </h2>
          <p className="text-xs font-mono text-ink-muted mt-1 uppercase tracking-wider">
            {destination} · {duration} DAYS · {travelers} TRAVELERS
          </p>
        </div>

        {/* Thin Progress Line */}
        <div className="w-full bg-sand h-[2px] my-5 overflow-hidden">
          <div
            className="bg-terracotta h-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.round(((currentStepIndex + 1) / executionSteps.length) * 100))}%` }}
          />
        </div>

        {/* Editorial Agent Checklist */}
        <div className="space-y-3 font-mono text-xs my-6">
          {executionSteps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isRunning = idx === currentStepIndex;
            const isQueued = idx > currentStepIndex;

            return (
              <div
                key={step.id}
                className={`py-2 px-3 flex items-center justify-between border-b border-sand-border/50 transition-colors ${
                  isRunning
                    ? 'bg-sand/60 font-bold text-ink'
                    : isCompleted
                    ? 'text-ink'
                    : 'text-ink-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-ink-muted">{step.num}</span>
                  <span className="font-bold tracking-wider uppercase">{step.agent}</span>
                  <span className="hidden sm:inline-block text-[11px] text-ink-muted font-sans font-normal">
                    · {step.action}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase">
                  {isCompleted ? (
                    <span className="text-olive font-bold flex items-center gap-1">
                      COMPLETE ✓
                    </span>
                  ) : isRunning ? (
                    <span className="text-terracotta font-bold flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      RESEARCHING ●
                    </span>
                  ) : (
                    <span className="text-ink-muted/60">
                      QUEUED —
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-sand-border flex items-center justify-between text-[10px] font-mono text-ink-muted uppercase">
          <span>PIPELINE: PROMISE.ALL() PARALLEL</span>
          <span>EST. TIME: ~2.4 SEC</span>
        </div>
      </motion.div>
    </div>
  );
};

export default AgentExecutionModal;
