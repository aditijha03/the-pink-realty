import React from 'react';
import { Home, Users, MapPin, Heart, BadgeCheck } from 'lucide-react';
import { useCountUp } from '../hooks/useCountUp';
import Reveal from './Reveal';

function StatItem({ icon: Icon, end, suffix = "+", label }) {
  const { count, countRef } = useCountUp(end);
  
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="w-12 h-12 bg-pink-light text-pink rounded-full flex items-center justify-center mb-3 border border-border dark:shadow-[0_0_15px_var(--glow)] transition-colors duration-300">
        <Icon className="w-6 h-6" />
      </div>
      <div 
        className="text-3xl font-bold font-heading text-text dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-white dark:to-pink dark:drop-shadow-[0_0_10px_rgba(255,77,148,0.3)] mb-1 transition-colors duration-300" 
        ref={countRef}
      >
        {count}{suffix}
      </div>
      <div className="text-[15px] text-text-muted transition-colors duration-300">{label}</div>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 xl:px-8 mb-24">
      <Reveal>
        <div className="bg-surface rounded-2xl shadow-soft dark:shadow-[0_4px_20px_var(--glow)] border border-border p-6 md:p-8 flex flex-col items-center transition-colors duration-300">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full divide-x-0 md:divide-x divide-border">
            <Reveal delay={100}><StatItem icon={Home} end={500} label="Properties Sold" /></Reveal>
            <Reveal delay={200}><StatItem icon={Users} end={10} label="Years of Experience" /></Reveal>
            <Reveal delay={300}><StatItem icon={MapPin} end={15} label="Prime Locations" /></Reveal>
            <Reveal delay={400}><StatItem icon={Heart} end={1000} label="Happy Clients" /></Reveal>
          </div>

          <Reveal delay={500} className="mt-8 pt-6 border-t border-border w-full flex justify-center transition-colors duration-300">
            <div className="inline-flex items-center gap-2 bg-pink-light px-4 py-2 rounded-full border border-border transition-colors duration-300">
              <BadgeCheck className="w-5 h-5 text-pink" />
              <span className="text-sm font-medium text-text transition-colors duration-300">RERA-approved properties</span>
            </div>
          </Reveal>

        </div>
      </Reveal>
    </section>
  );
}
