import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/hero/Hero';
import AgentNetwork from '../components/agents/AgentNetwork';
import HowItWorks from '../components/hero/HowItWorks';
import Button from '../components/ui/Button';
import { ArrowRight, MapPin, Navigation } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();

  const curatedDestinations = [
    {
      name: 'Japan',
      city: 'Tokyo & Kyoto',
      tag: 'Culture / Gastronomy / Nature',
      duration: '7 Days',
      price: '₹1,78,400',
      coords: '35.6762° N · 139.6503° E',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      size: 'large' // Spans 2 columns in magazine collage
    },
    {
      name: 'France',
      city: 'Paris & Versailles',
      tag: 'History / Art / Romance',
      duration: '5 Days',
      price: '₹1,85,000',
      coords: '48.8566° N · 2.3522° E',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      size: 'normal'
    },
    {
      name: 'Switzerland',
      city: 'Lucerne & Alps',
      tag: 'Alpine / Glacier / Lakes',
      duration: '6 Days',
      price: '₹2,60,000',
      coords: '47.0502° N · 8.3093° E',
      image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
      size: 'normal'
    },
    {
      name: 'Bali',
      city: 'Ubud & Seminyak',
      tag: 'Beaches / Wellness / Waterfalls',
      duration: '5 Days',
      price: '₹68,000',
      coords: '8.3405° S · 115.0920° E',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      size: 'normal'
    },
    {
      name: 'Goa',
      city: 'North & South Coastal',
      tag: 'Heritage / Coastal Cafes / Sunsets',
      duration: '4 Days',
      price: '₹38,500',
      coords: '15.2993° N · 74.1240° E',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      size: 'normal'
    }
  ];

  const handleSelectDestination = (dest) => {
    navigate('/plan', { state: { prefill: { destination: dest.name, origin: 'Delhi' } } });
  };

  return (
    <div className="min-h-screen bg-[#F6F3ED]">
      <Hero />
      
      {/* Editorial Destination Showcase Section */}
      <section id="destinations" className="py-24 bg-[#FFFFFF] border-b border-sand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-sand-border mb-16 gap-6">
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-terracotta uppercase font-bold block mb-2">
                CURATED EXPEDITIONS
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-ink tracking-tight">
                WHERE WILL YOU GO NEXT?
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-sans text-ink-muted max-w-md leading-relaxed">
              Select an editorial dossier to prefill your planning parameters or build a completely bespoke itinerary from scratch.
            </p>
          </div>

          {/* Magazine Collage Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {curatedDestinations.map((dest, idx) => (
              <div
                key={dest.name}
                onClick={() => handleSelectDestination(dest)}
                className={`group paper-card border border-sand-border p-4 bg-white hover:border-ink transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  dest.size === 'large' ? 'md:col-span-2' : ''
                }`}
              >
                <div className="relative h-64 sm:h-72 overflow-hidden mb-4 bg-sand">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-ink/90 text-ivory text-[9px] font-mono tracking-widest px-2.5 py-1 uppercase">
                    {dest.coords}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-sand-border mb-3">
                    <span className="text-[10px] font-mono text-terracotta uppercase tracking-wider font-semibold">
                      {dest.tag}
                    </span>
                    <span className="text-xs font-mono text-ink-muted font-bold">
                      {dest.duration}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-ink group-hover:text-terracotta transition-colors">
                        {dest.name}
                      </h3>
                      <p className="text-xs text-ink-muted font-sans mt-0.5">{dest.city}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-mono text-ink-muted uppercase block">Estimated</span>
                      <span className="text-sm font-serif font-bold text-ink">{dest.price}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-sand-border flex items-center justify-between text-xs font-mono text-ink uppercase tracking-wider group-hover:text-terracotta">
                  <span>Open Itinerary Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />
      <AgentNetwork />

      {/* Editorial Quote & CTA Banner */}
      <section className="py-24 bg-[#172B2A] text-ivory border-b border-forest-border relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-terracotta font-bold block">
            THE ART OF INTELLIGENT TRAVEL
          </span>

          <h2 className="text-3xl sm:text-5xl font-serif font-normal leading-tight text-white">
            PLAN LESS. <br />
            <span className="italic">TRAVEL BETTER.</span>
          </h2>

          <p className="text-sm sm:text-base font-sans text-ivory/80 max-w-xl mx-auto leading-relaxed">
            Eliminate weeks of chaotic bookmarking and tabs. Let 9 coordinated specialists organize your complete travel dossier.
          </p>

          <div className="pt-4">
            <Button
              variant="accent"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate('/plan')}
              className="px-8 shadow-none"
            >
              Plan This Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Minimal Editorial Footer */}
      <footer className="py-12 bg-[#F6F3ED] text-ink border-t border-sand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-sans font-extrabold text-sm tracking-[0.2em] text-ink uppercase block">
              AI TRAVELOPS
            </span>
            <span className="text-[10px] font-mono text-ink-muted uppercase">
              Autonomous Travel Intelligence & Editorial Dossiers
            </span>
          </div>

          <div className="flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-ink-muted">
            <a href="#destinations" className="hover:text-ink">Destinations</a>
            <a href="#how-it-works" className="hover:text-ink">Pipeline</a>
            <a href="#agents" className="hover:text-ink">Agents</a>
            <button onClick={() => navigate('/plan')} className="hover:text-ink">Plan</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
