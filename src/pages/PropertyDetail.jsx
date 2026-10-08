import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import { propertiesData as mockProperties } from '../data/properties';
import Reveal from '../components/Reveal';
import PropertyCard from '../components/PropertyCard';
import { calculateEmi, formatCurrency } from '../lib/emi';
import { MapPin, Bed, Maximize, Bath, CheckCircle2, Share2, Heart, Loader } from 'lucide-react';

export default function PropertyDetail() {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const controller = new AbortController();
    async function fetchProperty(isRefetch = false) {
      if (import.meta.env.VITE_USE_MOCK === 'true' && import.meta.env.DEV) {
        const p = mockProperties.find(p => p.slug === slug);
        setProperty(p);
        setSimilarProperties(mockProperties
          .filter(sp => sp.id !== p?.id && sp.type === p?.type && sp.location === p?.location)
          .slice(0, 3)
        );
        if (!isRefetch) setLoading(false);
      } else {
        try {
          const { apiFetch } = await import('../lib/api');
          const p = await apiFetch(`/public/properties/${slug}`, { 
            signal: controller.signal,
            skipCache: isRefetch 
          });
          if (p.message === 'Not found') {
            setProperty(null);
            if (!isRefetch) setLoading(false);
            return;
          }
          const mappedProperty = {
            ...p,
            id: p._id,
            rawPrice: p.price,
            type: p.listingType || 'buy',
            bhk: p.bedrooms || 0,
            beds: p.bedrooms || 0,
            baths: p.bathrooms || 0,
            sqft: p.areaSqft || 0,
            status: p.constructionStatus || 'Ready to move',
            image: p.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
            location: p.location?.city || p.location?.area || p.location || 'Mumbai',
            propertyType: p.propertyType || 'apartment',
            furnishing: p.furnishing || 'unfurnished'
          };
          setProperty(mappedProperty);

          const allData = await apiFetch('/public/properties', { 
            signal: controller.signal,
            skipCache: isRefetch 
          });
          const mappedAll = allData.map(sp => ({
             ...sp,
             id: sp._id,
             type: sp.listingType || 'buy',
             location: sp.location?.city || sp.location?.area || sp.location || 'Mumbai',
             image: sp.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
             bhk: sp.bedrooms || 0,
             beds: sp.bedrooms || 0,
             baths: sp.bathrooms || 0,
             sqft: sp.areaSqft || 0,
             rawPrice: sp.price,
             status: sp.constructionStatus || 'Ready to move',
             propertyType: sp.propertyType || 'apartment',
             furnishing: sp.furnishing || 'unfurnished'
          }));
          setSimilarProperties(mappedAll
            .filter(sp => sp.id !== mappedProperty.id && sp.type === mappedProperty.type && sp.location === mappedProperty.location)
            .slice(0, 3)
          );
        } catch (error) {
          if (error.name === 'AbortError') return;
          console.error("Error fetching property:", error);
          if (!isRefetch) setProperty(null);
        } finally {
          if (!controller.signal.aborted && !isRefetch) {
            setLoading(false);
          }
        }
      }
    }
    fetchProperty();

    const onFocusOrVisibility = () => {
      if (document.visibilityState === 'visible') fetchProperty(true);
    };
    const onStorage = (e) => {
      if (e.key === 'properties-updated') fetchProperty(true);
    };
    const onSwrUpdate = (e) => {
      if (e.detail.endpoint === `/public/properties/${slug}` || e.detail.endpoint === '/public/properties') fetchProperty(true);
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
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <Loader className="w-12 h-12 text-pink animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="text-4xl font-heading font-bold mb-4">Property Not Found</h1>
          <Link to="/property-list" className="text-pink hover:underline">Back to properties</Link>
        </div>
      </div>
    );
  }



  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "image": property.image,
    "offers": {
      "@type": "Offer",
      "price": property.rawPrice,
      "priceCurrency": "INR"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.location,
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    }
  };

  const keyFacts = [
    { icon: <Bed />, label: "Bedrooms", value: property.beds },
    { icon: <Bath />, label: "Bathrooms", value: property.baths },
    { icon: <Maximize />, label: "Area", value: `${property.sqft} sq.ft` }
  ];

  return (
    <>
      <Head>
        <title>{property.title} | The Pink Realty</title>
        <meta name="description" content={property.description} />
        <link rel="canonical" href={`https://thepinkrealty.com/property/${property.slug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>

      <main className="pt-32 md:pt-36 pb-16 bg-surface-2 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 xl:px-8">
          
          {/* Breadcrumb */}
          <div className="flex items-center text-sm font-medium text-text-muted mb-6">
            <Link to="/" className="hover:text-pink transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to={`/property-list?type=${property.type.toLowerCase()}`} className="hover:text-pink transition-colors capitalize">{property.type}</Link>
            <span className="mx-2">/</span>
            <span className="text-text-muted opacity-70 truncate max-w-[200px] sm:max-w-md">{property.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              {/* Image Gallery */}
              <div className="bg-surface rounded-3xl overflow-hidden shadow-soft dark:shadow-[0_0_20px_var(--glow)] mb-8 border border-border">
                <div className="relative aspect-[16/9]">
                  <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-surface-elevated/90 backdrop-blur text-text text-sm font-semibold px-4 py-2 rounded-full shadow-sm">
                      For {property.type}
                    </span>
                    {property.isVerified && (
                      <span className="bg-green-500/90 backdrop-blur text-white text-sm font-semibold px-4 py-2 rounded-full shadow-sm">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="bg-surface-elevated/90 backdrop-blur p-2.5 rounded-full shadow-sm text-text-muted hover:text-pink transition-colors border border-border">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
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
                      className="bg-surface-elevated/90 backdrop-blur p-2.5 rounded-full shadow-sm text-text-muted hover:text-pink transition-colors border border-border"
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-pink text-pink' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Title & Price */}
              <div className="bg-surface p-6 md:p-8 rounded-3xl shadow-soft dark:shadow-[0_0_20px_var(--glow)] mb-8 border border-border transition-colors duration-300">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-heading font-semibold text-text mb-2 transition-colors duration-300">{property.title}</h1>
                    <div className="flex items-center gap-2 text-text-muted transition-colors duration-300">
                      <MapPin className="w-5 h-5 text-pink" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="text-3xl font-heading font-bold text-text transition-colors duration-300">{property.price}</div>
                    {(property.type === 'Buy' || property.type === 'sale') && property.rawPrice && (
                      <Link 
                        to={`/emi-calculator?price=${property.rawPrice}`}
                        className="text-sm text-text-muted mt-1 hover:text-pink transition-colors block"
                      >
                        EMI from {formatCurrency(calculateEmi(property.rawPrice * 0.8, 8.5, 20))}/month &middot; Calculate
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Key Facts */}
              <div className="bg-surface p-6 md:p-8 rounded-3xl shadow-soft dark:shadow-[0_0_20px_var(--glow)] mb-8 border border-border transition-colors duration-300">
                <h2 className="text-xl font-heading font-semibold mb-6 text-text">Property Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {keyFacts.map((fact, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="bg-pink-light/20 p-3 rounded-xl text-pink border border-border">
                        {fact.icon}
                      </div>
                      <div>
                        <div className="text-xs text-text-muted uppercase font-medium">{fact.label}</div>
                        <div className="font-semibold text-text">{fact.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-surface p-6 md:p-8 rounded-3xl shadow-soft dark:shadow-[0_0_20px_var(--glow)] mb-8 border border-border transition-colors duration-300">
                <h2 className="text-xl font-heading font-semibold mb-4 text-text">Description</h2>
                <p className="text-text-muted leading-relaxed">{property.description}</p>
              </div>

              {/* Amenities */}
              <div className="bg-surface p-6 md:p-8 rounded-3xl shadow-soft dark:shadow-[0_0_20px_var(--glow)] mb-8 border border-border transition-colors duration-300">
                <h2 className="text-xl font-heading font-semibold mb-6 text-text">Amenities</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities?.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-pink shrink-0" />
                      <span className="text-text-muted">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>


            </div>

            {/* Sidebar Enquire Form */}
            <div className="lg:w-1/3">
              <div className="bg-surface p-6 rounded-3xl shadow-soft dark:shadow-[0_0_20px_var(--glow)] sticky top-24 border border-border transition-colors duration-300">
                <h3 className="text-xl font-heading font-semibold mb-2 text-text">Interested in this property?</h3>
                <p className="text-sm text-text-muted mb-6">Schedule a visit or get more details.</p>
                <form className="space-y-4" onSubmit={async (e) => { 
                  e.preventDefault(); 
                  const btn = e.target.querySelector('button[type="submit"]');
                  const originalText = btn.innerHTML;
                  btn.innerHTML = '<span class="relative z-10 flex items-center justify-center gap-2"><svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Sending...</span>';
                  btn.disabled = true;

                  const formData = {
                    name: e.target.name.value,
                    phone: e.target.phone.value,
                    email: e.target.email.value,
                    propertyId: property._id,
                    message: `Interested in property: ${property.title} (${property.reference})`
                  };
                  try {
                    await fetch(import.meta.env.VITE_API_URL + '/enquiries', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                      credentials: 'include',
                      body: JSON.stringify(formData)
                    });
                    btn.className = "w-full bg-green-500 text-white py-3.5 rounded-xl font-medium transition-colors shadow-[0_0_15px_rgba(34,197,94,0.5)]";
                    btn.innerHTML = '<span class="relative z-10 flex items-center justify-center gap-2"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg> Enquiry Sent!</span>';
                    e.target.reset();
                    setTimeout(() => {
                      btn.className = "relative group overflow-hidden w-full bg-pink-button text-white py-3.5 rounded-xl font-medium hover:bg-pink-button-hover transition-all duration-300 shadow-[0_0_15px_var(--glow)] hover:shadow-[0_0_25px_var(--glow)]";
                      btn.innerHTML = originalText;
                      btn.disabled = false;
                    }, 3000);
                  } catch(err) {
                    alert('Error submitting enquiry.');
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                  }
                }}>
                  <input required type="text" name="name" placeholder="Full Name" className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text focus:outline-none focus:border-pink transition-colors duration-300" />
                  <input required type="tel" name="phone" placeholder="Phone Number" className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text focus:outline-none focus:border-pink transition-colors duration-300" />
                  <input type="email" name="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text focus:outline-none focus:border-pink transition-colors duration-300" />
                  <button type="submit" className="relative group overflow-hidden w-full bg-pink-button text-white py-3.5 rounded-xl font-medium hover:bg-pink-button-hover transition-all duration-300 shadow-[0_0_15px_var(--glow)] hover:shadow-[0_0_25px_var(--glow)]">
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_0.7s_ease-out_forwards]" />
                    <span className="relative z-10">Schedule a visit</span>
                  </button>
                  <a href={`https://wa.me/919876543210?text=I'm interested in ${property.title}`} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-xl font-medium hover:bg-[#20bd5a] transition-all duration-300 shadow-[0_0_15px_rgba(37,211,102,0.5)] hover:shadow-[0_0_25px_rgba(37,211,102,0.6)]">
                    WhatsApp Us
                  </a>
                </form>
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          {similarProperties.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-heading font-semibold mb-8 text-text">Similar Properties</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {similarProperties.map((prop, idx) => (
                  <Reveal key={prop.id} direction="up" delay={idx * 0.1}>
                    <PropertyCard property={prop} />
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
