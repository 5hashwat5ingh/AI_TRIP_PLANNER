import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      agent: 'PLANNER',
      role: 'Trip Architect',
      title: 'Analyze Travel Brief',
      desc: 'Parses origin, destination, duration, budget constraints, travel pace, and traveler interests into structured requirements.',
    },
    {
      num: '02',
      agent: 'PARALLEL AGENTS',
      role: 'Flight, Stay, Activities, Weather',
      title: 'Concurrent Specialized Research',
      desc: 'Four specialized agents search flight tariffs, scout boutique stays, match cultural sights, and forecast weather simultaneously.',
    },
    {
      num: '03',
      agent: 'BUDGET & SCHEDULE',
      role: 'Transit, Budget, Itinerary',
      title: 'Synthesis & Cost Allocation',
      desc: 'Transportation and Budget agents calculate total expenses and assemble a realistic, geographically clustered timetable.',
    },
    {
      num: '04',
      agent: 'VALIDATOR',
      role: 'Quality Assurance & Replanning',
      title: 'Rigorous Constraint Audit',
      desc: 'Validates budget compliance, pacing fatigue, and transit distances. Automatically triggers adjustments if needed.',
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#E9E3D8] border-b border-sand-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-sand-border mb-16 gap-6">
          <div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-terracotta uppercase font-bold block mb-2">
              AGENT ORCHESTRATION PIPELINE
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-ink tracking-tight">
              A TEAM OF SPECIALISTS. <br />
              <span className="italic font-normal">ONE JOURNEY.</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-sans text-ink-muted max-w-md leading-relaxed">
            Independent AI agents collaborate through a shared trip state, executing in parallel and enforcing strict budget and geographic checks.
          </p>
        </div>

        {/* Horizontal Editorial Workflow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="paper-card p-6 sm:p-7 bg-white border border-sand-border relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-sand-border">
                  <span className="font-mono text-2xl font-serif font-bold text-ink">
                    {step.num}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 bg-sand border border-sand-border text-ink">
                    {step.agent}
                  </span>
                </div>

                <span className="text-[10px] font-mono text-terracotta uppercase tracking-wider block mb-1">
                  {step.role}
                </span>
                <h3 className="text-lg font-serif font-bold text-ink mb-2">
                  {step.title}
                </h3>
                <p className="text-xs font-sans text-ink-muted leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-sand-border flex items-center justify-between text-[10px] font-mono text-ink-muted">
                <span>STAGE {idx + 1} OF 4</span>
                <span className="text-olive font-bold">✓ VERIFIED</span>
              </div>
            </div>
          ))}
        </div>

        {/* Transit Line Diagram */}
        <div className="mt-14 p-6 sm:p-8 paper-card border border-sand-border bg-white">
          <div className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-4">
            AGENT ROUTE FLOW MAP
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-ink overflow-x-auto py-2">
            <span className="px-3 py-1.5 bg-sand border border-sand-border font-bold">TRAVELER BRIEF</span>
            <span className="text-terracotta font-bold">──→</span>
            <span className="px-3 py-1.5 bg-ink text-white font-bold">PLANNER</span>
            <span className="text-terracotta font-bold">──→</span>
            <span className="px-3 py-1.5 bg-sand border border-sand-border">FLIGHTS · STAYS · EXPERIENCES · WEATHER</span>
            <span className="text-terracotta font-bold">──→</span>
            <span className="px-3 py-1.5 bg-ink text-white font-bold">BUDGET & ITINERARY</span>
            <span className="text-terracotta font-bold">──→</span>
            <span className="px-3 py-1.5 bg-forest text-ivory font-bold">VALIDATOR</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
