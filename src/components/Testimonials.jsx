import React, { useState, useEffect } from 'react';
import SectionHeader from './SectionHeader';
import { testimonials } from '../data/mockData';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import Reveal from './Reveal';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-16 md:py-24 max-w-5xl mx-auto px-4 xl:px-8 text-center">
      <SectionHeader title="What Our Clients Say" subtitle="Real stories. Happy homeowners." />
      {testimonials.length === 0 ? (
        <div className="mt-8 text-gray-500 italic">No testimonials available yet.</div>
      ) : (
        <div className="mt-12 relative">
          <Reveal>
            <div className="bg-white dark:bg-surface p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 relative overflow-hidden min-h-[300px] flex flex-col justify-center transition-all">
              <Quote className="w-12 h-12 text-pink/20 mb-6 mx-auto" />
              <div 
                className="transition-opacity duration-500 animate-fade-in"
                key={currentIndex}
              >
                <p className="text-gray-600 dark:text-gray-300 italic mb-8 text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
                  "{testimonials[currentIndex].quote}"
                </p>
                <div className="mt-auto">
                  <h4 className="font-bold text-gray-900 dark:text-white text-base">{testimonials[currentIndex].name}</h4>
                </div>
              </div>
            </div>
          </Reveal>
          
          <button 
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-surface-elevated border border-gray-100 dark:border-white/10 rounded-full flex items-center justify-center text-gray-500 hover:text-pink shadow-md transition-colors z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-surface-elevated border border-gray-100 dark:border-white/10 rounded-full flex items-center justify-center text-gray-500 hover:text-pink shadow-md transition-colors z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'w-8 bg-pink' : 'bg-gray-300 dark:bg-white/20 hover:bg-gray-400'}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
