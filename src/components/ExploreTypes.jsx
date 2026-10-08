import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Home, Map, Briefcase, Sparkles, ArrowRight } from 'lucide-react';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import { propertyTypes } from '../data/mockData';
import { useSpotlight } from '../hooks/useSpotlight';

const icons = {
  1: Building2,
  2: Home,
  3: Map,
  4: Briefcase,
  5: Sparkles
};

function TypeCard({ type }) {
  const Icon = icons[type.id];
  const spotlightRef = useSpotlight();

  const getQueryString = (label) => {
    if (label === 'Apartments') return '?propertyType=apartment';
    if (label === 'Villas') return '?propertyType=villa';
    if (label === 'Commercial') return '?propertyType=commercial';
    if (label === 'Plots') return '?keyword=plot';
    if (label === 'New Projects') return '?sort=newest';
    return '';
  };

  return (
    <Link 
      to={`/property-list${getQueryString(type.label)}`}
      ref={spotlightRef}
      className="spotlight group block relative h-[240px] md:h-[280px] rounded-2xl overflow-hidden bg-surface shadow-soft border border-border dark:hover:border-pink/50 hover:shadow-[0_0_20px_var(--glow)] transition-all duration-300 hover:-translate-y-1.5"
    >
      <img 
        src={type.image} 
        alt={`${type.label} properties`}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Dark bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0710]/90 via-[#0A0710]/40 to-transparent transition-opacity duration-300"></div>
      
      {/* Glow Border on Hover */}
      <div className="absolute inset-0 border border-transparent rounded-2xl dark:group-hover:border-pink transition-colors duration-300 z-20 pointer-events-none" />

      <div className="absolute inset-x-0 bottom-0 p-5 pb-6 flex flex-col items-start transform transition-transform duration-300 z-20">
        <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg mb-3">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-heading font-bold text-lg md:text-xl text-white mb-1">
          {type.label}
        </h3>
        <div className="flex items-center gap-1 text-pink text-sm font-semibold opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          View properties <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}

export default function ExploreTypes() {
  return (
    <section className="py-16 md:py-24 bg-surface-2 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 xl:px-8">
        <SectionHeader 
          title="Explore by Property Type" 
          subtitle="Find the perfect property that matches your lifestyle."
          linkText="View All"
          linkUrl="/property-list"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {propertyTypes.map((type, index) => (
            <Reveal key={type.id} delay={index * 90}>
              <TypeCard type={type} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
