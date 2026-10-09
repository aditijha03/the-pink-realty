import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import Reveal from './Reveal';
import EnquireModal from './EnquireModal';

export default function CTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="py-16 bg-surface-2 border-t border-border relative overflow-hidden transition-colors duration-300">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 opacity-10 dark:opacity-20 pointer-events-none transform translate-x-1/3 -translate-y-1/3 transition-opacity duration-300">
          <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=400&fit=crop" className="w-[400px] h-[400px] rounded-full object-cover mix-blend-multiply dark:mix-blend-lighten" alt="Modern apartment balcony overlooking the city skyline" />
        </div>
        <div className="absolute bottom-0 left-0 opacity-10 dark:opacity-20 pointer-events-none transform -translate-x-1/4 translate-y-1/3 transition-opacity duration-300">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=400&fit=crop" className="w-[400px] h-[400px] rounded-full object-cover mix-blend-multiply dark:mix-blend-lighten" alt="Luxurious modern living room interior" />
        </div>

        <div className="max-w-7xl mx-auto px-4 xl:px-8 relative z-10">
          <Reveal className="flex flex-col md:flex-row items-center justify-between gap-8 bg-surface p-8 md:p-12 rounded-[24px] shadow-soft dark:shadow-[0_4px_20px_var(--glow)] border border-border transition-colors duration-300">
            <div className="max-w-2xl text-center md:text-left">
              <span className="flex items-center justify-center md:justify-start gap-2 text-pink font-semibold tracking-wider text-xs uppercase mb-3">
                <Sparkles className="w-4 h-4" /> Your Dream Home Awaits
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-text mb-3 transition-colors duration-300">
                Ready to find your next property?
              </h2>
              <p className="text-text-muted text-[15px] md:text-base transition-colors duration-300">
                Let our experts help you find the perfect home or investment opportunity tailored to your needs.
              </p>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="relative group overflow-hidden bg-pink-button hover:bg-pink-button-hover text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:-translate-y-1 whitespace-nowrap"
            >
              <span className="relative z-10">Enquire Now</span>
            </button>
          </Reveal>
        </div>
      </section>

      <EnquireModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
