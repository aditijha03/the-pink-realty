import React from 'react';
import SectionHeader from './SectionHeader';

export default function Testimonials() {
  const testimonials = []; // Empty for now until API is ready

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 xl:px-8 text-center">
      <SectionHeader title="What Our Clients Say" subtitle="Real stories. Happy homeowners." />
      {testimonials.length === 0 ? (
        <div className="mt-8 text-gray-500 italic">No testimonials available yet.</div>
      ) : (
        <div>Render testimonials here when available</div>
      )}
    </section>
  );
}
