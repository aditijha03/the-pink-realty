import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, ArrowLeft, Building2, Trees, Dumbbell, Waves, PartyPopper } from 'lucide-react';
import Reveal from './Reveal';
import EnquireModal from './EnquireModal';

const fallbackImages = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"
];

const allAmenities = [
  { name: 'Clubhouse', icon: PartyPopper },
  { name: 'Swimming Pool', icon: Waves },
  { name: 'Gym', icon: Dumbbell },
  { name: 'Children\'s Play Area', icon: Building2 },
  { name: 'Garden', icon: Trees },
];

export default function FeaturedProject() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [premiumProperty, setPremiumProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchPremium(isRefetch = false) {
      try {
        const { apiFetch } = await import('../lib/api');
        const data = await apiFetch('/public/properties?isPremium=true', { 
          signal: controller.signal,
          skipCache: isRefetch 
        });
        if (data && data.length > 0) {
          setPremiumProperty(data[0]);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error("Failed to fetch premium property", err);
      } finally {
        if (!controller.signal.aborted && !isRefetch) {
          setLoading(false);
        }
      }
    }
    
    fetchPremium();

    const onFocusOrVisibility = () => {
      if (document.visibilityState === 'visible') fetchPremium(true);
    };
    
    const onStorage = (e) => {
      if (e.key === 'properties-updated') fetchPremium(true);
    };

    const onSwrUpdate = (e) => {
      if (e.detail.endpoint === '/public/properties?isPremium=true') fetchPremium(true);
    };

    window.addEventListener('focus', onFocusOrVisibility);
    document.addEventListener('visibilitychange', onFocusOrVisibility);
    window.addEventListener('storage', onStorage);
    window.addEventListener('swr-update', onSwrUpdate);

    return () => {
      controller.abort();
      window.removeEventListener('focus', onFocusOrVisibility);
      document.removeEventListener('visibilitychange', onFocusOrVisibility);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('swr-update', onSwrUpdate);
    };
  }, []);

  if (loading) return null; // Or a skeleton loader
  
  // Use DB data if available, else use fallback
  const images = premiumProperty?.images?.length ? premiumProperty.images.map(i => i.url) : fallbackImages;
  const title = premiumProperty ? premiumProperty.title : "The Palms Residences";
  const location = premiumProperty ? (premiumProperty.location || "Mumbai") : "Kharghar, Navi Mumbai";
  const price = premiumProperty ? `₹ ${(premiumProperty.price / 10000000).toFixed(2)} Cr Onwards` : "₹ 1.20 Cr Onwards";
  const bhk = premiumProperty && premiumProperty.bedrooms ? `${premiumProperty.bedrooms} BHK` : "2 & 3 BHK";
  const description = premiumProperty ? premiumProperty.description : "Modern living, premium amenities and a prime location come together at The Palms Residences. Your perfect home awaits.";
  
  // Try to match DB amenities to our icons, fallback to defaults if none match
  let displayAmenities = [];
  if (premiumProperty && premiumProperty.amenities && premiumProperty.amenities.length > 0) {
    displayAmenities = premiumProperty.amenities.map(am => {
      const matched = allAmenities.find(a => am.toLowerCase().includes(a.name.toLowerCase()));
      return { icon: matched ? matched.icon : Building2, label: am };
    }).slice(0, 4); // Show max 4
  } else {
    displayAmenities = [
      { icon: PartyPopper, label: "Clubhouse" },
      { icon: Waves, label: "Swimming Pool" },
      { icon: Dumbbell, label: "Gym & Wellness" },
      { icon: Building2, label: "Children's Play Area" }
    ];
  }

  const next = () => setCurrentIdx((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 xl:px-8">
      <Reveal className="bg-surface rounded-[24px] shadow-soft dark:shadow-[0_4px_20px_var(--glow)] border border-border overflow-hidden transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* Carousel Side */}
          <div className="img-glow-wrap relative aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden group">
            <div className="absolute top-6 left-6 z-10 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
              Premium Project
            </div>
            
            <img 
              src={images[currentIdx]} 
              alt={title} 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Controls */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-6 flex items-center gap-4 bg-black/60 backdrop-blur-md rounded-full px-4 py-2">
                <button onClick={prev} className="text-white hover:text-pink transition-colors" aria-label="Previous image">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <span className="text-white text-sm font-medium tracking-widest">
                  {currentIdx + 1} / {images.length}
                </span>
                <button onClick={next} className="text-white hover:text-pink transition-colors" aria-label="Next image">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Details Side */}
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-surface transition-colors duration-300">
            <span className="text-pink font-semibold tracking-wider text-xs md:text-sm uppercase mb-3">
              Premium Residential
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-text mb-4 transition-colors duration-300 line-clamp-2">
              {title}
            </h2>
            
            <div className="flex items-center gap-2 text-[15px] text-text-muted mb-6 transition-colors duration-300">
              <MapPin className="w-4 h-4 shrink-0" />
              {location}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-text font-medium mb-6 pb-6 border-b border-border transition-colors duration-300">
              <div className="bg-pink-light px-4 py-2 rounded-lg text-sm transition-colors duration-300">{bhk}</div>
              <div className="bg-pink-light px-4 py-2 rounded-lg text-sm transition-colors duration-300">{price}</div>
            </div>

            <p className="text-text-muted leading-relaxed mb-8 text-[15px] md:text-base transition-colors duration-300 line-clamp-3">
              {description}
            </p>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-10">
              {displayAmenities.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-3 text-sm text-text-muted transition-colors duration-300">
                    <div className="w-8 h-8 rounded-full bg-pink-light flex items-center justify-center text-pink shrink-0 transition-colors duration-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-pink-button hover:bg-pink-button-hover text-white px-8 py-3.5 rounded-xl font-medium transition-colors w-full md:w-auto self-start shadow-[0_4px_12px_rgba(214,36,110,0.3)] dark:shadow-[0_0_15px_var(--glow)] hover:shadow-[0_6px_16px_rgba(214,36,110,0.4)] dark:hover:shadow-[0_0_25px_var(--glow)]"
            >
              Enquire Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </Reveal>

      <EnquireModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultInterest={title}
      />
    </section>
  );
}
