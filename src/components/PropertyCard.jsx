import React, { useState } from 'react';
import { MapPin, Bed, Maximize, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSpotlight } from '../hooks/useSpotlight';
import { calculateEmi, formatCurrency } from '../lib/emi';

export default function PropertyCard({ property, listView = false }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const spotlightRef = useSpotlight();
  const navigate = useNavigate();

  return (
    <Link 
      to={`/property/${property.slug}`} 
      ref={spotlightRef}
      className={`spotlight grad-border group bg-surface rounded-2xl overflow-hidden border border-border transition-all duration-300 hover:-translate-y-1.5 ${listView ? 'flex flex-col sm:flex-row' : 'block'}`}
      style={{ boxShadow: 'var(--card-shadow)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--card-shadow-hover)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--card-shadow)'}
    >
      <div className={`relative overflow-hidden ${listView ? 'sm:w-2/5 aspect-[4/3] sm:aspect-auto sm:min-h-full' : 'aspect-[4/3]'}`}>
        <div className="img-sheen absolute inset-0 z-10 pointer-events-none" />
        <img 
          src={property.image} 
          alt={property.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-surface-elevated/90 backdrop-blur text-text text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
          {property.type === 'Buy' ? 'For Sale' : 'For Rent'}
        </div>
        {property.isVerified && (
          <div className="absolute bottom-4 left-4 bg-green-500/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
            Verified
          </div>
        )}
        <div 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isWishlisted) {
              const el = e.currentTarget;
              const rect = el.getBoundingClientRect();
              const burst = document.createElement('div');
              burst.className = 'fixed pointer-events-none z-[100]';
              burst.style.left = `${rect.left + rect.width / 2}px`;
              burst.style.top = `${rect.top + rect.height / 2}px`;
              document.body.appendChild(burst);
              for (let i = 0; i < 6; i++) {
                const particle = document.createElement('div');
                particle.className = 'absolute animate-particle-burst';
                particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 70}px`);
                particle.style.setProperty('--ty', `${-30 - Math.random() * 50}px`);
                particle.style.animationDelay = `${Math.random() * 0.15}s`;
                burst.appendChild(particle);
              }
              setTimeout(() => document.body.removeChild(burst), 1200);
            }
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-4 right-4 bg-surface-elevated/90 backdrop-blur p-2 rounded-full shadow-sm text-text-muted hover:text-pink transition-colors z-20 cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label="Toggle wishlist"
        >
          <Heart className={`w-4 h-4 transition-transform ${isWishlisted ? 'fill-pink text-pink scale-110' : ''}`} />
        </div>
      </div>
      
      <div className={`p-5 flex flex-col justify-center relative z-20 pointer-events-none ${listView ? 'sm:w-3/5' : ''}`}>
        <h3 className="font-heading font-bold text-xl mb-2 text-text group-hover:text-pink transition-colors line-clamp-2 pointer-events-auto">
          {property.title}
        </h3>
        
        <div className="flex items-center gap-1.5 text-[15px] text-text-muted mb-4">
          <MapPin className="w-4 h-4" />
          {property.location}
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-pink" />
            <span>{property.beds} {property.beds > 1 ? 'Beds' : 'Bed'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize className="w-4 h-4 text-pink" />
            <span>{property.sqft} sq.ft</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-auto pointer-events-auto">
          <div>
            <div className="font-heading font-bold text-2xl text-text">
              {property.price}
            </div>
            {(property.type === 'Buy' || property.type === 'sale') && property.rawPrice && (
              <span 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/emi-calculator?price=${property.rawPrice}`);
                }}
                className="text-[11px] text-text-muted hover:text-pink transition-colors block mt-1 cursor-pointer"
              >
                EMI from {formatCurrency(calculateEmi(property.rawPrice * 0.8, 8.5, 20))}/month &middot; Calculate
              </span>
            )}
          </div>
          <span className="text-pink font-medium text-sm group-hover:underline whitespace-nowrap self-end cursor-pointer">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}
