import React, { useState, useMemo, useEffect } from 'react';
import { Head } from 'vite-react-ssg';
import { useSearchParams, Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import PropertyCard from '../components/PropertyCard';
import Reveal from '../components/Reveal';
import { propertiesData as mockProperties } from '../data/properties';
import { SlidersHorizontal, Search, X, Grid, List as ListIcon, MapPin, Home, Info, Filter, Loader } from 'lucide-react';

export default function PropertyList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const [propertiesData, setPropertiesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchProperties(isRefetch = false) {
      if (import.meta.env.VITE_USE_MOCK === 'true' && import.meta.env.DEV) {
        setPropertiesData([]);
        if (!isRefetch) setLoading(false);
      } else {
        try {
          const { apiFetch } = await import('../lib/api');
          const rawResponse = await apiFetch('/public/properties', { 
            signal: controller.signal,
            skipCache: isRefetch 
          });
          
          
          
          
          const dataList = Array.isArray(rawResponse) ? rawResponse : (rawResponse?.data || []);
          

          const mappedData = dataList.map(p => ({
            ...p,
            id: p._id,
            rawPrice: typeof p.price === 'number' ? p.price : 0,
            type: (p.listingType?.toLowerCase() === 'sale' ? 'buy' : p.listingType?.toLowerCase()) || 'buy',
            bhk: p.bedrooms ? p.bedrooms.toString() : 'any',
            beds: p.bedrooms || 0,
            baths: p.bathrooms || 0,
            sqft: p.areaSqft || 0,
            status: (p.constructionStatus || p.status || 'ready to move').toLowerCase(),
            image: p.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
            location: (typeof p.location === 'object' ? (p.location?.city || p.location?.area || 'Mumbai') : (p.location || 'Mumbai')),
            propertyType: (p.propertyType || 'apartment').toLowerCase(),
            furnishing: (p.furnishing || 'unfurnished').toLowerCase(),
            title: p.title || '',
            description: p.description || ''
          }));
          
          
          setPropertiesData(mappedData);
        } catch (error) {
          if (error.name === 'AbortError') return;
          console.error("Error fetching properties:", error);
          setPropertiesData([]);
        } finally {
          if (!controller.signal.aborted && !isRefetch) {
            setLoading(false);
          }
        }
      }
    }
    
    fetchProperties();

    const onFocusOrVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchProperties(true);
      }
    };
    
    const onStorage = (e) => {
      if (e.key === 'properties-updated') {
        fetchProperties(true);
      }
    };

    const onSwrUpdate = (e) => {
      if (e.detail.endpoint === '/public/properties') {
        fetchProperties(true);
      }
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

  const [filters, setFilters] = useState({
    type: searchParams.get('type') || 'all',
    location: searchParams.get('location') || 'all',
    propertyType: searchParams.get('propertyType') || 'all',
    bhk: 'all',
    budgetMin: 0,
    budgetMax: 1000000000,
    status: 'all',
    furnishing: 'all',
    keyword: searchParams.get('keyword') || ''
  });

  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  // Sync state with URL if needed, but for simplicity we'll let state drive and update URL if it's 'type'
  useEffect(() => {
    if (searchParams.get('type') && filters.type !== searchParams.get('type')) {
      setFilters(prev => ({ ...prev, type: searchParams.get('type') || 'all' }));
    }
  }, [searchParams]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (key === 'type') {
      if (value === 'all') {
        searchParams.delete('type');
      } else {
        searchParams.set('type', value);
      }
      setSearchParams(searchParams);
    }
    setPage(1); // Reset to first page on filter change
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      location: 'all',
      propertyType: 'all',
      bhk: 'all',
      budgetMin: 0,
      budgetMax: 1000000000,
      status: 'all',
      furnishing: 'all',
      keyword: ''
    });
    setSearchParams({});
    setPage(1);
  };

  const dynamicLocations = useMemo(() => [...new Set(propertiesData.map(p => p.location))].filter(Boolean), [propertiesData]);
  const dynamicTypes = useMemo(() => [...new Set(propertiesData.map(p => p.propertyType))].filter(Boolean), [propertiesData]);
  const maxStoredPrice = useMemo(() => Math.max(0, ...propertiesData.map(p => p.rawPrice || 0)), [propertiesData]);

  const filteredProperties = useMemo(() => {
    
    let result = [...propertiesData];
    
    if (filters.type !== 'all') {
      result = result.filter(p => p.type === filters.type.toLowerCase());
      
    }
    
    if (filters.location !== 'all') {
      result = result.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
      
    }
    
    if (filters.propertyType !== 'all') {
      result = result.filter(p => p.propertyType === filters.propertyType.toLowerCase());
      
    }
    
    if (filters.bhk !== 'all' && filters.bhk !== 'any') {
      result = result.filter(p => p.bhk === filters.bhk);
      
    }
    
    if (filters.status !== 'all') {
      result = result.filter(p => p.status === filters.status.toLowerCase());
      
    }
    
    if (filters.furnishing !== 'all') {
      result = result.filter(p => p.furnishing === filters.furnishing.toLowerCase());
      
    }
    
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      result = result.filter(p => 
        (p.title && p.title.toLowerCase().includes(keyword)) || 
        (p.location && p.location.toLowerCase().includes(keyword)) ||
        (p.description && p.description.toLowerCase().includes(keyword))
      );
      
    }

    const currentMaxPrice = filters.budgetMax === 1000000000 && maxStoredPrice > 0 ? maxStoredPrice : filters.budgetMax;
    result = result.filter(p => p.rawPrice >= filters.budgetMin && p.rawPrice <= currentMaxPrice);
    

    // Sorting
    if (sort === 'price-low') {
      result.sort((a, b) => a.rawPrice - b.rawPrice);
    } else if (sort === 'price-high') {
      result.sort((a, b) => b.rawPrice - a.rawPrice);
    }

    return result;
  }, [propertiesData, filters, sort, maxStoredPrice]);

  const displayedProperties = filteredProperties.slice(0, page * itemsPerPage);
  const hasMore = displayedProperties.length < filteredProperties.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": displayedProperties.map((p, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "Product",
        "name": p.title,
        "url": `https://thepinkrealty.com/property/${p.slug}`,
        "image": p.image
      }
    }))
  };

  return (
    <>
      <Head>
        <title>Property List | The Pink Realty</title>
        <meta name="description" content="Explore our extensive list of properties for sale and rent in Mumbai and Navi Mumbai." />
        <link rel="canonical" href="https://thepinkrealty.com/property-list" />
        <meta property="og:title" content="Property List | The Pink Realty" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>

      <PageHero 
        titleHTML="Find your <em class='text-pink not-italic font-serif italic'>perfect</em> property."
        bgImage="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80"
      />

      <section className="py-12 bg-surface-2 relative min-h-screen transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 xl:px-8 flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <button 
            className="lg:hidden flex items-center justify-center gap-2 bg-surface border border-border px-4 py-3 rounded-xl font-medium w-full shadow-sm text-text"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <Filter className="w-5 h-5" /> Filters
          </button>

          {/* Filters Sidebar */}
          <aside className={`
            fixed inset-y-0 left-0 z-[100] w-full max-w-xs bg-surface shadow-soft dark:shadow-[0_0_20px_var(--glow)] p-6 overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0 lg:w-1/4 lg:bg-transparent lg:shadow-none lg:p-0 lg:z-auto lg:overflow-visible
            ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h3 className="font-heading text-xl font-semibold text-text">Filters</h3>
              <button onClick={() => setIsMobileFiltersOpen(false)} aria-label="Close filters">
                <X className="w-6 h-6 text-text-muted hover:text-text transition-colors" />
              </button>
            </div>

            <div className="bg-surface lg:p-5 lg:rounded-2xl lg:shadow-soft lg:sticky lg:top-24 space-y-4 lg:border lg:border-border transition-colors duration-300">
              <div className="flex justify-between items-center">
                <h3 className="font-heading font-semibold text-lg hidden lg:block text-text">Filters</h3>
                <button onClick={clearFilters} className="text-pink text-sm font-medium hover:underline">Clear all</button>
              </div>

              {/* Type Tabs */}
              <div className="flex bg-pink-light/20 rounded-xl p-1">
                {['all', 'buy', 'rent'].map(t => (
                  <button
                    key={t}
                    className={`flex-1 capitalize py-1.5 rounded-lg text-sm font-medium transition-colors ${filters.type === t ? 'bg-surface shadow-sm text-pink' : 'text-text-muted hover:text-text'}`}
                    onClick={() => updateFilter('type', t)}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Keyword */}
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    type="text" 
                    placeholder="Keywords, amenities..." 
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-surface text-text focus:outline-none focus:border-pink text-sm transition-colors duration-300"
                    value={filters.keyword}
                    onChange={(e) => updateFilter('keyword', e.target.value)}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Location</label>
                <select className="w-full px-4 py-2 rounded-xl border border-border bg-surface text-text focus:outline-none focus:border-pink text-sm transition-colors duration-300" value={filters.location} onChange={(e) => updateFilter('location', e.target.value)}>
                  <option value="all">Any Location</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="navi mumbai">Navi Mumbai</option>
                  <option value="thane">Thane</option>
                  <option value="panvel">Panvel</option>
                  <option value="pune">Pune</option>
                </select>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Property Type</label>
                <select className="w-full px-4 py-2 rounded-xl border border-border bg-surface text-text focus:outline-none focus:border-pink text-sm transition-colors duration-300" value={filters.propertyType} onChange={(e) => updateFilter('propertyType', e.target.value)}>
                  <option value="all">Any Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                  <option value="plot">Plot / Land</option>
                </select>
              </div>

              {/* BHK */}
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Bedrooms</label>
                <div className="flex flex-wrap gap-2">
                  {['all', '1', '2', '3', '4'].map(b => (
                    <button
                      key={b}
                      className={`px-3.5 py-1.5 rounded-xl text-sm transition-colors border ${filters.bhk === b ? 'bg-pink-button border-pink text-white' : 'bg-surface border-border text-text-muted hover:border-pink hover:text-text'}`}
                      onClick={() => updateFilter('bhk', b)}
                    >
                      {b === 'all' ? 'Any' : `${b} BHK`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Status</label>
                <select className="w-full px-4 py-2 rounded-xl border border-border bg-surface text-text focus:outline-none focus:border-pink text-sm transition-colors duration-300" value={filters.status} onChange={(e) => updateFilter('status', e.target.value)}>
                  <option value="all">Any Status</option>
                  <option value="Ready to move">Ready to move</option>
                  <option value="Under construction">Under construction</option>
                </select>
              </div>

              {/* Mobile apply button */}
              <button 
                className="lg:hidden w-full bg-pink-button text-white py-3 rounded-xl font-medium mt-4 shadow-soft"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Results Area */}
          <main className="lg:w-3/4 flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl font-medium text-text">
                {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
              </h2>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <select 
                  className="px-4 py-2 rounded-xl border border-border bg-surface text-text focus:outline-none focus:border-pink text-sm w-full sm:w-auto transition-colors duration-300"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="newest">Newest first</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>

                <div className="hidden sm:flex bg-surface rounded-xl border border-border p-1 transition-colors duration-300">
                  <button 
                    className={`p-1.5 rounded-lg transition-colors ${view === 'grid' ? 'bg-pink-light/20 text-pink' : 'text-text-muted hover:text-text'}`}
                    onClick={() => setView('grid')}
                    aria-label="Grid view"
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button 
                    className={`p-1.5 rounded-lg transition-colors ${view === 'list' ? 'bg-pink-light/20 text-pink' : 'text-text-muted hover:text-text'}`}
                    onClick={() => setView('list')}
                    aria-label="List view"
                  >
                    <ListIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex-grow flex items-center justify-center py-20">
                <Loader className="w-10 h-10 text-pink animate-spin" />
              </div>
            ) : displayedProperties.length > 0 ? (
              <>
                <div className={view === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-6'}>
                  {displayedProperties.map((prop, idx) => (
                    <Reveal key={prop.id} direction="up" delay={idx * 0.05}>
                      <PropertyCard property={prop} listView={view === 'list'} />
                    </Reveal>
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-12 text-center">
                    <button 
                      onClick={() => setPage(p => p + 1)}
                      className="bg-surface border-2 border-pink text-pink px-8 py-3 rounded-full font-medium hover:bg-pink-button hover:text-white transition-all duration-300 hover:shadow-soft dark:hover:shadow-[0_0_15px_var(--glow)]"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Reveal className="flex-grow flex flex-col items-center justify-center text-center py-20 bg-surface rounded-2xl shadow-soft border border-border transition-colors duration-300">
                <Search className="w-16 h-16 text-pink/50 mb-4" />
                <h3 className="text-2xl font-heading font-semibold mb-2 text-text">No properties found</h3>
                <p className="text-text-muted mb-6 max-w-md mx-auto">We couldn't find any matches for your current filters. Try adjusting your search criteria or let us help you.</p>
                <button onClick={clearFilters} className="bg-pink-button text-white px-8 py-3 rounded-full font-medium hover:bg-pink-button-hover transition-colors shadow-soft">
                  Clear all filters
                </button>
                <div className="mt-6">
                  <p className="text-text-muted text-sm mb-2">Can't find what you want?</p>
                  <Link to="/contact-us" className="text-pink font-medium hover:underline">Talk to an expert</Link>
                </div>
              </Reveal>
            )}

            {/* Bottom mini form strip */}
            <div className="mt-16 bg-surface p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t-2 border-pink rounded-2xl shadow-soft">
              <div>
                <h4 className="text-xl font-semibold mb-1 text-text">Can't find what you want?</h4>
                <p className="text-text-muted text-sm">Tell us your exact requirement and we'll find it for you.</p>
              </div>
              <Link to="/contact-us" className="bg-pink-button text-white px-6 py-3 rounded-xl font-medium shadow-soft hover:bg-pink-button-hover transition-all whitespace-nowrap">
                Post Requirement
              </Link>
            </div>
          </main>
        </div>
      </section>

      {/* Overlay for mobile filters */}
      {isMobileFiltersOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setIsMobileFiltersOpen(false)}
        />
      )}
    </>
  );
}
