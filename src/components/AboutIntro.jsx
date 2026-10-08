import React from 'react';
import Reveal from './Reveal';

export default function AboutIntro() {
  return (
    <section className="py-16 md:py-24 max-w-4xl mx-auto px-4 xl:px-8 text-center">
      <Reveal>
        <div className="w-12 h-1 bg-pink-button mx-auto mb-6"></div>
        <h2 className="text-3xl font-heading font-bold text-text mb-6 transition-colors duration-300">
          Your Local Real Estate Experts
        </h2>
        <p className="text-text-muted text-base leading-relaxed mb-4 transition-colors duration-300">
          The Pink Realty is a premier real estate consultancy dedicated to helping you find the perfect property in Mumbai, Navi Mumbai, Thane, Panvel, and Pune. With over a decade of local market knowledge, we specialize in curating verified, RERA-approved residential and commercial opportunities. 
        </p>
        <p className="text-text-muted text-base leading-relaxed transition-colors duration-300">
          Whether you are looking to buy a luxury sea-facing apartment, rent a premium villa, or invest in emerging pre-launch projects, our personalized service ensures a seamless and stress-free experience. We understand that finding a home is more than a transaction; it is about finding a place that feels right. Trust our honest guidance to navigate legal documentation, home loans, and property management with complete transparency.
        </p>
      </Reveal>
    </section>
  );
}
