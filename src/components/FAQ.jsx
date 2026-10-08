import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import { faqs } from '../data/mockData';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="py-16 md:py-24 bg-surface-2 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 xl:px-8">
        <SectionHeader 
          title="Frequently Asked Questions" 
          subtitle="Everything you need to know about buying property with us."
        />

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <Reveal key={idx} delay={idx * 80}>
                <div className={`bg-surface rounded-2xl border transition-all duration-300 ${isOpen ? 'border-pink shadow-soft dark:shadow-[0_0_15px_var(--glow)]' : 'border-border hover:border-pink/50 hover:shadow-soft dark:hover:shadow-[0_0_15px_var(--glow)]'}`}>
                  <button 
                    onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <h3 className="font-heading font-bold text-lg text-text pr-4 transition-colors duration-300">
                      {faq.question}
                    </h3>
                    <ChevronDown className={`w-5 h-5 text-pink shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="px-6 pb-6 pt-0 text-text-muted text-[15px] leading-relaxed transition-colors duration-300">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
