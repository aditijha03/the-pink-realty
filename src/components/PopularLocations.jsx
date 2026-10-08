import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import { popularLocations } from '../data/mockData';
import { useSpotlight } from '../hooks/useSpotlight';

function LocationCard({ loc }) {
  const spotlightRef = useSpotlight();

  return (
    <Link 
      to={`/property-list?location=${encodeURIComponent(loc.city)}`}
      ref={spotlightRef}
      className="spotlight group block relative h-[280px] rounded-2xl overflow-hidden bg-surface shadow-soft border border-border dark:hover:border-pink/50 hover:shadow-[0_0_20px_var(--glow)] transition-all duration-300 hover:-translate-y-1.5"
    >
      <img 
        src={loc.image} 
        alt={`Properties in ${loc.city}`}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0710]/95 via-[#0A0710]/40 to-transparent transition-opacity duration-300"></div>
      
      {/* Glow Border on Hover */}
      <div className="absolute inset-0 border border-transparent rounded-2xl dark:group-hover:border-pink transition-colors duration-300 z-20 pointer-events-none" />

      <div className="absolute inset-x-0 bottom-0 p-5 pb-6 transform transition-transform duration-300 z-20">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-pink" />
          <h3 className="font-heading font-bold text-lg md:text-xl text-white">
            {loc.city}
          </h3>
        </div>
        <p className="text-white/80 text-sm mb-3">
          {loc.count} Properties
        </p>
        <div className="flex items-center gap-1 text-pink text-sm font-semibold opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          View properties <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}

export default function PopularLocations() {
  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 xl:px-8">
      <SectionHeader 
        title="Popular Locations" 
        subtitle="Explore the best places to live, work and invest."
        linkText="View All Locations"
        linkUrl="/property-list"
      />
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {popularLocations.map((loc, index) => (
          <Reveal key={loc.id} delay={index * 90}>
            <LocationCard loc={loc} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
