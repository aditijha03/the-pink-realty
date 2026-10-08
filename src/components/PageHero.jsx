import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Reveal from './Reveal';

export default function PageHero({ titleHTML, subtitle, bgImage = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80" }) {
  const location = useLocation();
  const path = location.pathname.split('/').filter(Boolean)[0];
  const pageName = path ? path.replace('-', ' ') : '';
  
  return (
    <section className="relative pt-28 pb-12 md:pt-36 md:pb-20 overflow-hidden flex items-center min-h-[320px]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed transition-all duration-300"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0710]/95 via-[#0A0710]/80 to-[#0A0710]/40 transition-colors duration-300" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 xl:px-8 relative z-10 w-full">
        <Reveal>
          <div className="flex items-center text-sm font-medium text-white/70 mb-6">
            <Link to="/" className="hover:text-pink transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2 text-white/40" />
            <span className="capitalize text-pink">{pageName}</span>
          </div>
          
          <h1 
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-white mb-4 md:mb-6 leading-tight max-w-3xl"
            dangerouslySetInnerHTML={{ __html: titleHTML }}
          />
          
          {subtitle && (
            <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
