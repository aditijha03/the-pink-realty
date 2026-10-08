import React, { useState, useEffect } from 'react';
import SectionHeader from './SectionHeader';
import PropertyCard from './PropertyCard';
import Reveal from './Reveal';
import { featuredProperties as mockFeatured } from '../data/mockData';
import { Loader } from 'lucide-react';

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchFeatured = async () => {
      if (import.meta.env.VITE_USE_MOCK === 'true' && import.meta.env.DEV) {
        setProperties(mockFeatured);
        setLoading(false);
        return;
      }

      try {
        const { apiFetch } = await import('../lib/api');
        const data = await apiFetch('/public/properties', { signal: controller.signal });
        
        // Filter those marked as featured and map to frontend format
        const featured = data.filter(p => p.featured).map(p => ({
          id: p._id,
          slug: p.slug,
          title: p.title,
          price: p.price >= 10000000 ? `₹${(p.price / 10000000).toFixed(2)} Cr` : `₹${(p.price / 100000).toFixed(2)} Lac`,
          rawPrice: p.price,
          location: p.location,
          bhk: p.bedrooms,
          beds: p.bedrooms,
          baths: p.bathrooms,
          sqft: p.areaSqft,
          type: p.listingType,
          propertyType: p.propertyType,
          status: p.constructionStatus,
          image: p.images?.[0]?.url,
          isFeatured: true
        }));
        
        setProperties(featured.slice(0, 3));
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error(err);
        setProperties([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    
    fetchFeatured();
    return () => controller.abort();
  }, []);

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 xl:px-8">
      <SectionHeader 
        title="Featured Properties" 
        subtitle="Handpicked properties for your next big move."
        linkText="View All Properties"
        linkUrl="/property-list"
      />
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="w-8 h-8 animate-spin text-pink" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => (
            <Reveal key={property.id} delay={index * 90}>
              <PropertyCard property={property} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
