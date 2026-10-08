import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Reveal from './Reveal';
import { Calculator } from 'lucide-react';
import { formatCurrencyCompact } from '../lib/emi';

export default function EmiCtaBanner() {
  const [price, setPrice] = useState('');
  const navigate = useNavigate();

  const handleCalculate = () => {
    const url = price ? `/emi-calculator?price=${price}` : '/emi-calculator';
    navigate(url);
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-surface transition-colors duration-300">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <Reveal>
          <div className="relative bg-white dark:bg-surface-elevated rounded-[24px] p-8 md:p-12 border border-border shadow-sm overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group">
            
            {/* Subtle shine effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent group-hover:animate-[shimmer_1.5s_ease-out_forwards]" />
            
            <div className="flex-1 relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-text mb-4 transition-colors">
                Planning a home loan? Know your EMI in seconds.
              </h2>
              <p className="text-text-muted mb-8 text-lg">
                Check your monthly payment, total interest and loan breakdown.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative w-full sm:w-64">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-medium">₹</span>
                  <input 
                    type="number" 
                    placeholder="Property Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-8 pr-4 py-3.5 bg-gray-50 dark:bg-surface-2 border border-border rounded-xl text-text font-medium focus:outline-none focus:border-pink transition-colors"
                  />
                </div>
                <button 
                  onClick={handleCalculate}
                  className="w-full sm:w-auto px-8 py-3.5 bg-pink-button hover:bg-pink-button-hover text-white rounded-xl font-bold transition-colors shadow-sm whitespace-nowrap"
                >
                  Calculate my EMI
                </button>
              </div>
            </div>

            <div className="hidden md:flex relative z-10 w-48 h-48 items-center justify-center">
              <div className="absolute inset-0 bg-pink-light/10 dark:bg-pink-light/5 rounded-full animate-pulse-slow"></div>
              <Calculator className="w-24 h-24 text-pink opacity-80" strokeWidth={1.5} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
