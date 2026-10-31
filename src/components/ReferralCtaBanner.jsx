import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import { Gift, ArrowRight } from 'lucide-react';

export default function ReferralCtaBanner() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-surface transition-colors duration-300">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <Reveal>
          <div className="relative bg-white dark:bg-surface-elevated rounded-[24px] p-8 md:p-12 border border-border shadow-sm overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group">
            
            {/* Subtle shine effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent group-hover:animate-[shimmer_1.5s_ease-out_forwards]" />
            
            <div className="flex-1 relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-text mb-4 transition-colors">
                Know someone looking for a home? Refer & earn.
              </h2>
              <p className="text-text-muted mb-8 text-lg">
                Introduce property buyers or sellers, or collaborate with us as a partner. Earn attractive rewards upon successful deal closures.
              </p>
              
              <div>
                <Link
                  to="/refer-and-earn"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-pink-button hover:bg-pink-button-hover text-white rounded-xl font-bold transition-colors shadow-sm whitespace-nowrap"
                >
                  <span>Refer and earn</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="hidden md:flex relative z-10 w-48 h-48 items-center justify-center">
              <div className="absolute inset-0 bg-pink-light/10 dark:bg-pink-light/5 rounded-full animate-pulse-slow"></div>
              <Gift className="w-24 h-24 text-pink opacity-80" strokeWidth={1.5} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
