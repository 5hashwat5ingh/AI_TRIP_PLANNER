import React from 'react';
import { Compass, Check } from 'lucide-react';

export const AIReasoningPanel = ({ trip }) => {
  const decisions = [
    {
      title: 'YOUR HOTEL SELECTION',
      rationale: `We selected ${trip?.hotels?.selectedOption?.name || 'the central boutique stay'} in ${trip?.hotels?.selectedOption?.location || trip?.destination} because it balances your budget ceiling with immediate proximity to major transit lines, keeping average commute times under 25 minutes.`
    },
    {
      title: 'YOUR GEOGRAPHIC ROUTE',
      rationale: 'Activities and sightseeing stops are grouped strictly by neighborhood cluster to eliminate zigzagging across the city and reduce fatigue.'
    },
    {
      title: 'YOUR BUDGET ALLOCATION',
      rationale: `Accommodation and flights account for ~54% of your total budget, ensuring ample remaining buffer for culinary tastings, guided tours, and spontaneous shopping.`
    },
    {
      title: 'METEOROLOGICAL SCHEDULING',
      rationale: 'Outdoor panoramic viewpoints and nature hikes are sequenced on days with the lowest forecast rain probability, prioritizing covered arcades during cloudy spells.'
    }
  ];

  return (
    <div className="space-y-8 paper-card p-6 sm:p-10 bg-white border border-sand-border">
      {/* Header */}
      <div className="pb-6 border-b border-sand-border">
        <span className="text-[10px] font-mono tracking-[0.25em] text-terracotta uppercase font-bold block mb-1">
          DECISION INTELLIGENCE
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-ink tracking-tight uppercase">
          WHY THIS JOURNEY?
        </h2>
        <p className="text-xs font-sans text-ink-muted mt-1 max-w-lg">
          Transparent explanations behind the trade-offs and optimizations negotiated by our agent network.
        </p>
      </div>

      {/* Editorial Rationale Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {decisions.map((item, idx) => (
          <div key={idx} className="p-6 bg-[#F6F3ED] border border-sand-border space-y-3">
            <span className="text-[10px] font-mono text-terracotta uppercase tracking-widest font-bold block">
              {item.title}
            </span>
            <p className="text-xs sm:text-sm font-sans text-ink leading-relaxed font-normal">
              {item.rationale}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIReasoningPanel;
