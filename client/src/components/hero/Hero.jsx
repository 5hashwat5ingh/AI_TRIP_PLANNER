import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Compass, Navigation } from 'lucide-react';
import Button from '../ui/Button';

export const Hero = () => {
  const navigate = useNavigate();

  const curatedDestinations = [
    { name: 'Tokyo', country: 'Japan', duration: '7 Days', price: '₹1,78,400', coords: '35.6762° N · 139.6503° E', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80', tag: 'Culture / Gastronomy' },
    { name: 'Kyoto', country: 'Japan', duration: '5 Days', price: '₹1,42,000', coords: '35.0116° N · 135.7681° E', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80', tag: 'Temples / Gardens' },
    { name: 'Paris', country: 'France', duration: '5 Days', price: '₹1,85,000', coords: '48.8566° N · 2.3522° E', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80', tag: 'Art / Architecture' },
    { name: 'Lucerne', country: 'Switzerland', duration: '6 Days', price: '₹2,60,000', coords: '47.0502° N · 8.3093° E', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80', tag: 'Alpine / Lakes' },
  ];

  return (
    <section className="relative pt-8 pb-20 sm:pt-14 sm:pb-28 bg-[#F6F3ED] overflow-hidden border-b border-sand-border">
      {/* Subtle Map Grid Texture */}
      <div className="absolute inset-0 map-grid-pattern opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Micro Header Label */}
        <div className="flex items-center justify-between pb-6 border-b border-sand-border mb-10 text-xs font-mono text-ink-muted">
          <span className="tracking-widest uppercase">
            TRAVEL PLANNING SYSTEM / 01
          </span>
          <span className="hidden sm:inline-block tracking-widest uppercase">
            AUTONOMOUS AGENT ORCHESTRATION
          </span>
        </div>

        {/* Editorial Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-terracotta font-semibold block mb-3">
                INTELLIGENT TRAVEL COMMAND CENTER
              </span>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal text-ink leading-[1.08] tracking-tight">
                THE WORLD IS <br />
                <span className="italic font-normal">WAITING.</span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-ink-muted font-sans max-w-lg leading-relaxed font-normal">
              Your bespoke journey, researched and arranged by a coordinated team of specialized AI travel agents — flights, stays, curated experiences, and realistic day-by-day itineraries.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button
                variant="accent"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => navigate('/plan')}
                className="shadow-none"
              >
                Plan Your Journey
              </Button>
              <a href="#how-it-works">
                <Button variant="secondary" size="lg">
                  How It Works
                </Button>
              </a>
            </div>

            {/* Micro Details Row */}
            <div className="pt-6 border-t border-sand-border grid grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <span className="text-ink-muted uppercase block text-[10px] tracking-wider">Agents</span>
                <span className="font-bold text-ink text-sm">9 Specialized</span>
              </div>
              <div>
                <span className="text-ink-muted uppercase block text-[10px] tracking-wider">Replanning</span>
                <span className="font-bold text-ink text-sm">Automated QA</span>
              </div>
              <div>
                <span className="text-ink-muted uppercase block text-[10px] tracking-wider">Constraint</span>
                <span className="font-bold text-ink text-sm">Budget & Time</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Destination Card & Imagery */}
          <div className="lg:col-span-6 relative">
            <div className="relative paper-card border-sand-border p-3 sm:p-4 bg-white shadow-lg">
              {/* Image with geographic stamp */}
              <div className="relative h-[380px] sm:h-[460px] overflow-hidden">
                <img
                  src={curatedDestinations[0].image}
                  alt="Tokyo Japan Destination"
                  className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
                />
                
                {/* Geographic Stamp Overlay */}
                <div className="absolute top-4 left-4 bg-ink/90 text-ivory px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase">
                  {curatedDestinations[0].coords}
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 sm:p-5 border border-sand-border flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-terracotta uppercase font-bold">
                      CURATED DOSSIER #01
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif text-ink tracking-tight">
                      TOKYO
                    </h2>
                    <p className="text-xs font-sans text-ink-muted">
                      Japan · 7 Days · Apr 10 — Apr 17
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-ink-muted block uppercase">Estimated</span>
                    <span className="text-base sm:text-lg font-serif font-bold text-ink">
                      ₹1,78,400
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Asymmetric Floating Metadata Label */}
            <div className="hidden sm:flex items-center gap-3 absolute -bottom-6 -left-6 bg-sand border border-sand-border px-4 py-2.5 text-xs font-mono text-ink">
              <Navigation className="w-3.5 h-3.5 text-terracotta" />
              <span>ACTIVE ROUTE: DEL ✈ HND / JR RAIL CONNECTED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
