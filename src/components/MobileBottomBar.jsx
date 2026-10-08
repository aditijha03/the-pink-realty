import { siteConfig } from '../data/siteConfig';
import React, { useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import EnquireModal from './EnquireModal';

export default function MobileBottomBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.2)] z-40 flex transition-colors duration-300">
        <a 
          href={`tel:+${siteConfig.contact.whatsappNumber}`} 
          className="flex-1 flex flex-col items-center justify-center py-3 text-text hover:bg-pink-light/20 transition-colors"
        >
          <Phone className="w-5 h-5 mb-1 text-pink" />
          <span className="text-xs font-medium">Call</span>
        </a>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="relative group overflow-hidden flex-1 flex flex-col items-center justify-center py-3 bg-pink-button text-white hover:bg-pink-button-hover transition-colors shadow-[0_0_15px_var(--glow)]"
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_0.7s_ease-out_forwards]" />
          <Mail className="w-5 h-5 mb-1 relative z-10" />
          <span className="text-xs font-medium relative z-10">Enquire</span>
        </button>
      </div>

      <EnquireModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
