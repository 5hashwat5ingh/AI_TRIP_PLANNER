import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Plane, Building2, MapPin, CloudSun, Wallet, CalendarDays, ShieldCheck, Cpu } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export const AgentNetwork = () => {
  const agents = [
    {
      num: '01',
      name: 'Master Planner',
      dept: 'Intent & Architecture Desk',
      desc: 'Parses natural language requests and structured constraints. Formats traveler preferences and initializes the shared trip state.',
      tags: ['Intent Parser', 'Constraint Extraction', 'State Dispatch'],
      icon: <Cpu className="w-4 h-4 text-ink" />
    },
    {
      num: '02',
      name: 'Flight Agent',
      dept: 'Aviation Logistics Desk',
      desc: 'Compares airline tariffs, flight durations, layovers, and cabin luggage policies to pick candidate round-trip flights.',
      tags: ['Airfare Search', 'Layover Analysis', 'Cabin Selection'],
      icon: <Plane className="w-4 h-4 text-ink" />
    },
    {
      num: '03',
      name: 'Hotel Agent',
      dept: 'Accommodations & Stays Desk',
      desc: 'Scouts boutique and luxury accommodations balancing nightly tariffs, customer ratings, amenities, and transit access.',
      tags: ['Neighborhood Scouting', 'Review Scoring', 'Tariff Negotiation'],
      icon: <Building2 className="w-4 h-4 text-ink" />
    },
    {
      num: '04',
      name: 'Activity Agent',
      dept: 'Curated Experiences Desk',
      desc: 'Curates must-visit monuments, hidden gems, and culinary experiences tailored specifically to user interest tags.',
      tags: ['Attraction Matching', 'Duration Sizing', 'Admission Pricing'],
      icon: <Compass className="w-4 h-4 text-ink" />
    },
    {
      num: '05',
      name: 'Transportation Agent',
      dept: 'Regional Transit Desk',
      desc: 'Designs inter-city bullet train passes, regional rail passes, metro cards, and estimates realistic transit intervals.',
      tags: ['Rail Passes', 'Airport Transfers', 'Commute Calculation'],
      icon: <MapPin className="w-4 h-4 text-ink" />
    },
    {
      num: '06',
      name: 'Weather Agent',
      dept: 'Meteorological Desk',
      desc: 'Forecasts daily temperatures and rain probabilities, ensuring outdoor adventures are scheduled on optimal weather days.',
      tags: ['Climate Projections', 'Rain Risk Check', 'Activity Advisory'],
      icon: <CloudSun className="w-4 h-4 text-ink" />
    },
    {
      num: '07',
      name: 'Budget Agent',
      dept: 'Financial Audit Desk',
      desc: 'Aggregates all cost vectors (flights, lodging, dining, activities, transit, buffer) and verifies strict budget compliance.',
      tags: ['Cost Breakdown', 'Budget Cushion', 'Cost Alerts'],
      icon: <Wallet className="w-4 h-4 text-ink" />
    },
    {
      num: '08',
      name: 'Itinerary Agent',
      dept: 'Master Timetable Desk',
      desc: 'Assembles a realistic day-by-day timetable with clustered geography, curated dining breaks, and rest windows.',
      tags: ['Day Timetable', 'Geo-Clustering', 'Dining Integration'],
      icon: <CalendarDays className="w-4 h-4 text-ink" />
    },
    {
      num: '09',
      name: 'Validator Agent',
      dept: 'Quality Assurance & Replanning Desk',
      desc: 'Runs rigorous quality audits against budget limits, schedule conflicts, travel distances, and triggers automatic replanning if needed.',
      tags: ['Schedule Conflict Audit', 'Budget Gatekeeper', 'Automatic Replan'],
      icon: <ShieldCheck className="w-4 h-4 text-ink" />
    }
  ];

  return (
    <section id="agents" className="py-24 bg-[#F6F3ED] border-b border-sand-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-sand-border mb-16 gap-6">
          <div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-terracotta uppercase font-bold block mb-2">
              NEURAL AGENT DIRECTORY
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-ink tracking-tight">
              THE SPECIALIST DESKS
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-sans text-ink-muted max-w-md leading-relaxed">
            Nine specialized departments collaborating simultaneously to eliminate travel research friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="paper-card bg-white p-7 border border-sand-border flex flex-col justify-between hover:border-ink transition-colors duration-300"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-sand-border">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 bg-sand border border-sand-border">{agent.icon}</span>
                    <span className="text-xs font-mono font-bold text-ink uppercase tracking-wider">{agent.name}</span>
                  </div>
                  <span className="text-xs font-mono text-ink-muted">/{agent.num}</span>
                </div>

                <span className="text-[10px] font-mono text-terracotta uppercase tracking-wider block mb-2">
                  {agent.dept}
                </span>

                <p className="text-xs font-sans text-ink-muted leading-relaxed mb-6">
                  {agent.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-sand-border flex flex-wrap gap-1.5">
                {agent.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-mono px-2 py-0.5 bg-sand/80 text-ink border border-sand-border uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgentNetwork;
