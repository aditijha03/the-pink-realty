import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home as HomeIcon, Wallet } from 'lucide-react';
import Reveal from './Reveal';

export default function Hero() {
  const [activeTab, setActiveTab] = useState('Buy');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('Any Type');
  const navigate = useNavigate();
  const tabs = ['Buy', 'Rent', 'Sell', 'Projects'];

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Convert 'Buy' to 'buy', 'Rent' to 'rent' etc to match your frontend model
    const typeMap = {
      'Buy': 'buy',
      'Rent': 'rent',
      'Sell': 'buy', // If they want to sell, they might want to view similar properties for sale
      'Projects': 'all' // Assuming 'projects' isn't explicitly defined in listingType
    };

    const typeParam = typeMap[activeTab] || 'all';
    const propTypeParam = propertyType === 'Any Type' ? 'all' : propertyType.toLowerCase();
    
    navigate(`/property-list?type=${typeParam}&keyword=${encodeURIComponent(location)}&propertyType=${propTypeParam}`);
  };

  return (
    <section className="relative h-[90vh] min-h-[700px] flex items-center w-full">
      {/* Background Image with Ken Burns */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&h=1080&fit=crop" 
          alt="Luxury balcony view of Mumbai skyline"
          width="1920"
          height="1080"
          fetchPriority="high"
          className="w-full h-full object-cover animate-ken-burns transition-all duration-300"
        />
        {/* Gradient Overlay left-to-right */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent dark:to-transparent/20 transition-colors duration-300"></div>
      </div>
      
      <div className="relative z-30 max-w-7xl mx-auto px-4 xl:px-8 w-full pt-20 pointer-events-none">
        <div className="max-w-2xl pointer-events-auto">
          <Reveal delay={100}>
            <span className="inline-block text-pink font-semibold tracking-wider text-xs md:text-sm uppercase mb-4">
              Buy / Sell / Rent / Property Guidance
            </span>
          </Reveal>
          
          <Reveal delay={200}>
            <h1 className="text-5xl md:text-7xl font-heading font-bold leading-[1.1] mb-6 transition-colors duration-300">
              <span className="bg-gradient-to-br from-text via-text to-pink text-transparent bg-clip-text">
                Find a place<br/>that feels{' '}
              </span>
              <span className="hero-glow-word relative inline-block text-pink italic font-normal">
                right.
                {/* Shimmer sweep every ~6s */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 dark:opacity-100 pointer-events-none animate-[heroshimmer_6s_ease-in-out_infinite]" aria-hidden="true" />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={300}>
            <p className="text-[17px] md:text-lg text-gray-700 dark:text-gray-300 mb-10 max-w-lg leading-relaxed transition-colors duration-300">
              Your trusted partner in buying, selling and finding the perfect property in Mumbai & Navi Mumbai.
            </p>
          </Reveal>

          {/* Search Card Container */}
          <Reveal delay={400} className="max-w-4xl relative z-[100]">
            {/* Search Card with Rotating Conic Border */}
            <div className="relative p-[1px] rounded-2xl shadow-soft">
              {/* Rotating Gradient Wrapper */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-0">
                <div className="absolute inset-[-100%] w-[300%] h-[300%] bg-[conic-gradient(from_0deg,transparent_0_320deg,var(--conic-border-to)_360deg)] animate-[spin_8s_linear_infinite] mix-blend-screen transition-opacity duration-500"></div>
              </div>
              
              {/* Inner Surface */}
              <div className="relative z-10 bg-surface rounded-[15px] p-3 md:p-6 border border-border h-full transition-colors duration-300">
                {/* Tabs */}
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-6 border-b border-border pb-4 relative transition-colors duration-300">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`relative px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium rounded-full transition-colors z-10 ${
                        activeTab === tab 
                          ? 'text-white shadow-md' 
                          : 'text-text-muted hover:text-text'
                      }`}
                    >
                      {activeTab === tab && (
                        <div className="absolute inset-0 bg-pink-button rounded-full -z-10 transition-all shadow-[0_4px_12px_rgba(214,36,110,0.3)] dark:shadow-[0_0_20px_var(--glow)]" />
                      )}
                      {tab}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                  {/* Location Dropdown on Hover */}
                  <div 
                    className="flex-1 relative group"
                  >
                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 ml-1 transition-colors duration-300">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted z-10" />
                      <input 
                        type="text" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Any Location" 
                        className="w-full bg-surface-2 border border-border rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-pink focus:ring-1 focus:ring-pink transition-colors text-text cursor-default"
                        readOnly // Made read-only so they select from dropdown as requested, or keep it writable if they want to type. User said "instead of typing the location". Let's make it readOnly to force selection.
                      />
                      {/* Dropdown Menu */}
                      <div className="absolute top-full left-0 w-full mt-2 bg-surface border border-border rounded-xl shadow-xl opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50 overflow-hidden">
                        {['Mumbai', 'Navi Mumbai', 'Thane', 'Panvel', 'Pune'].map(city => (
                          <div 
                            key={city}
                            onClick={() => setLocation(city)}
                            className="px-4 py-3 text-sm text-text hover:bg-pink-light/20 hover:text-pink cursor-pointer transition-colors"
                          >
                            {city}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Property Type Dropdown on Hover */}
                  <div className="flex-1 relative group">
                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 ml-1 transition-colors duration-300">Property Type</label>
                    <div className="relative">
                      <HomeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted z-10" />
                      <div className="w-full bg-surface-2 border border-border rounded-xl pl-12 pr-4 py-3.5 transition-colors text-text cursor-default">
                        {propertyType}
                      </div>
                      {/* Dropdown Menu */}
                      <div className="absolute top-full left-0 w-full mt-2 bg-surface border border-border rounded-xl shadow-xl opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50 overflow-hidden">
                        {['Any Type', 'Apartment', 'Villa', 'Commercial', 'Plot / Land'].map(type => (
                          <div 
                            key={type}
                            onClick={() => setPropertyType(type)}
                            className="px-4 py-3 text-sm text-text hover:bg-pink-light/20 hover:text-pink cursor-pointer transition-colors"
                          >
                            {type}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:self-end pt-2 md:pt-0">
                    <button type="submit" className="relative w-full md:w-auto bg-pink-button hover:bg-pink-button-hover text-white px-8 py-3.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
                      <Search className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">Search</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Floating Chip */}
            <div className="absolute -top-5 -right-4 md:-right-10 bg-surface px-4 py-2 rounded-full shadow-lg border border-border flex items-center gap-2 animate-float hidden md:flex z-30 transition-colors duration-300">
              <span className="w-2 h-2 rounded-full bg-pink-button shadow-[0_0_10px_var(--glow)]"></span>
              <span className="text-sm font-medium text-text transition-colors duration-300">Featured property</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
