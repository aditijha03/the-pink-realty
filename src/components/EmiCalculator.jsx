import React, { useState, useEffect } from 'react';
import { calculateEmi, generateAmortizationSchedule, formatCurrency, formatCurrencyCompact } from '../lib/emi';
import EnquireModal from './EnquireModal';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function EmiCalculator({ defaultPrice = 5000000, compact = false, showCta = false }) {
  const [price, setPrice] = useState(defaultPrice || 5000000);
  const [downPayment, setDownPayment] = useState(defaultPrice ? defaultPrice * 0.2 : 1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAmortization, setShowAmortization] = useState(false);

  // Normalize inputs safely
  const safePrice = Math.max(0, Number(price) || 0);
  const safeDownPayment = Math.min(safePrice, Math.max(0, Number(downPayment) || 0));
  const principal = safePrice - safeDownPayment;
  const safeRate = Math.max(0, Number(interestRate) || 0);
  const safeTenure = Math.max(1, Number(tenure) || 1);

  const emi = calculateEmi(principal, safeRate, safeTenure);
  const totalInterest = Math.max(0, (emi * safeTenure * 12) - principal);
  const totalPayable = principal + totalInterest;

  const dpPercentage = safePrice > 0 ? ((safeDownPayment / safePrice) * 100).toFixed(1) : 0;

  // Donut chart logic
  const principalPercent = totalPayable > 0 ? (principal / totalPayable) * 100 : 100;
  const interestPercent = totalPayable > 0 ? (totalInterest / totalPayable) * 100 : 0;
  const dashArray = `${interestPercent} ${100 - interestPercent}`;

  const schedule = !compact ? generateAmortizationSchedule(principal, safeRate, safeTenure) : [];

  const handlePriceChange = (val) => {
    setPrice(val);
  };

  const handleDownPaymentChange = (val) => {
    setDownPayment(val);
  };

  const priceWarning = false;
  const dpWarning = Number(downPayment) > safePrice;

  const enquiryMessage = `Property Price: ${formatCurrency(safePrice)}
Down Payment: ${formatCurrency(safeDownPayment)}
Loan Amount: ${formatCurrency(principal)}
Interest Rate: ${safeRate}%
Tenure: ${safeTenure} years
Estimated EMI: ${formatCurrency(emi)}/month`;

  const getSliderBg = (val, min, max) => {
    if (max <= min) return `linear-gradient(to right, var(--slider-bg, #e5e7eb) 100%, var(--slider-bg, #e5e7eb) 100%)`;
    const percent = Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100));
    return `linear-gradient(to right, #D6246E 0%, #D6246E ${percent}%, var(--slider-bg, #e5e7eb) ${percent}%, var(--slider-bg, #e5e7eb) 100%)`;
  };

  return (
    <div className={`bg-white dark:bg-surface-elevated rounded-[24px] shadow-sm border border-border dark:border-pink/20 overflow-hidden ${compact ? 'max-w-3xl mx-auto' : ''}`}>
      <style dangerouslySetInnerHTML={{__html: `
        .emi-slider {
          -webkit-appearance: none;
          height: 6px;
          border-radius: 9999px;
          outline: none;
          --slider-bg: #e5e7eb;
        }
        .dark .emi-slider {
          --slider-bg: rgba(255, 255, 255, 0.1);
        }
        .emi-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 4px solid #D6246E;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
          cursor: pointer;
        }
        .dark .emi-slider::-webkit-slider-thumb {
          background: #1a1a2e; /* dark mode surface contrast */
          border: 4px solid #D6246E;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.2);
        }
      `}} />
      <div className={`p-6 md:p-8 flex flex-col ${compact ? 'md:flex-row gap-8' : 'lg:flex-row gap-10'}`}>
        
        {/* Controls Section */}
        <div className="flex-1 space-y-8">
          {/* Price */}
          <div>
            <div className="flex justify-between items-end mb-3">
              <label htmlFor="emi-price" className="text-sm font-medium text-text-muted">Property Price / Loan Value</label>
              <div className="relative w-1/2 max-w-[140px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-medium">₹</span>
                <input 
                  id="emi-price"
                  type="number" 
                  value={price === 0 ? '' : price} 
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 bg-gray-50 dark:bg-surface-2 border border-border rounded-lg text-text font-bold text-right focus:outline-none focus:border-pink transition-colors"
                />
              </div>
            </div>
            <input 
              type="range" 
              min="1000000" 
              max={Math.max(50000000, safePrice)} 
              step="100000" 
              value={safePrice} 
              onChange={(e) => handlePriceChange(e.target.value)}
              className="emi-slider w-full cursor-pointer"
              style={{ background: getSliderBg(safePrice, 1000000, Math.max(50000000, safePrice)) }}
            />
            <div className="flex justify-between mt-2 text-xs font-medium text-text-muted">
              <span>₹10.00 Lakh</span>
              <span>{formatCurrencyCompact(Math.max(50000000, safePrice))}</span>
            </div>
          </div>

          {/* Down Payment */}
          <div>
            <div className="flex justify-between items-end mb-3">
              <label htmlFor="emi-downpayment" className="text-sm font-medium text-text-muted">
                Down Payment <span className="text-pink ml-1 font-bold">({dpPercentage}%)</span>
              </label>
              <div className="relative w-1/2 max-w-[140px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-medium">₹</span>
                <input 
                  id="emi-downpayment"
                  type="number" 
                  value={downPayment === 0 ? '' : downPayment} 
                  onChange={(e) => handleDownPaymentChange(e.target.value)}
                  className={`w-full pl-7 pr-3 py-2 bg-gray-50 dark:bg-surface-2 border ${dpWarning ? 'border-red-500' : 'border-border'} rounded-lg text-text font-bold text-right focus:outline-none focus:border-pink transition-colors`}
                />
              </div>
            </div>
            <input 
              type="range" 
              min="0" 
              max={safePrice} 
              step="50000" 
              value={safeDownPayment} 
              onChange={(e) => handleDownPaymentChange(e.target.value)}
              className="emi-slider w-full cursor-pointer"
              style={{ background: getSliderBg(safeDownPayment, 0, safePrice) }}
              aria-label="Down Payment slider"
            />
            {dpWarning && (
              <p className="text-red-500 text-xs mt-2 font-medium">Down payment can't exceed the property price</p>
            )}
          </div>

          {/* Interest Rate & Tenure Row */}
          <div className="grid grid-cols-2 gap-6 items-end">
            {/* Interest */}
            <div className="flex flex-col h-full">
              <label htmlFor="emi-interest" className="text-sm font-medium text-text-muted mb-2 whitespace-nowrap">Interest Rate</label>
              <div className="relative w-full mb-3 mt-auto">
                <input 
                  id="emi-interest"
                  type="number" 
                  value={interestRate} 
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full pr-8 pl-3 py-2 bg-gray-50 dark:bg-surface-2 border border-border rounded-lg text-text font-bold text-right focus:outline-none focus:border-pink transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted font-medium">%</span>
              </div>
              <input 
                type="range" 
                min="6" 
                max="15" 
                step="0.1" 
                value={safeRate} 
                onChange={(e) => setInterestRate(e.target.value)}
                className="emi-slider w-full cursor-pointer mt-auto"
                style={{ background: getSliderBg(safeRate, 6, 15) }}
                aria-label="Interest Rate slider"
              />
            </div>
            
            {/* Tenure */}
            <div className="flex flex-col h-full">
              <label htmlFor="emi-tenure" className="text-sm font-medium text-text-muted mb-2 whitespace-nowrap">Tenure (Years)</label>
              <div className="relative w-full mb-3 mt-auto">
                <input 
                  id="emi-tenure"
                  type="number" 
                  value={tenure} 
                  onChange={(e) => setTenure(e.target.value)}
                  className="w-full pr-8 pl-3 py-2 bg-gray-50 dark:bg-surface-2 border border-border rounded-lg text-text font-bold text-right focus:outline-none focus:border-pink transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted font-medium text-xs">Yr</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="30" 
                step="1" 
                value={safeTenure} 
                onChange={(e) => setTenure(e.target.value)}
                className="emi-slider w-full cursor-pointer mt-auto"
                style={{ background: getSliderBg(safeTenure, 5, 30) }}
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className={`flex flex-col justify-center ${compact ? 'w-full md:w-[280px]' : 'w-full lg:w-[360px]'} bg-pink-light/10 dark:bg-surface-2 p-6 rounded-2xl border border-pink/10`}>
          <div className="text-center mb-6">
            <p className="text-sm font-medium text-text-muted uppercase tracking-wider mb-2">Monthly EMI</p>
            <h3 className="font-heading text-4xl font-bold text-pink">{formatCurrency(emi)}</h3>
          </div>
          
          <div className="flex justify-center mb-6">
            <svg viewBox="0 0 36 36" className="w-32 h-32 transform -rotate-90">
              <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-[#3b82f6] dark:text-[#2563eb]" />
              <circle 
                cx="18" cy="18" r="15.91549430918954" 
                fill="transparent" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeDasharray={dashArray} 
                strokeDashoffset="0"
                className="text-pink transition-all duration-500 ease-in-out" 
              />
            </svg>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#3b82f6] dark:bg-[#2563eb]"></div>
                <span className="text-text-muted">Principal Amount</span>
              </div>
              <span className="font-bold text-text">{formatCurrency(principal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink"></div>
                <span className="text-text-muted">Total Interest</span>
              </div>
              <span className="font-bold text-text">{formatCurrency(totalInterest)}</span>
            </div>
            <div className="pt-3 border-t border-border flex justify-between items-center">
              <span className="font-medium text-text-muted">Total Payable</span>
              <span className="font-bold text-text">{formatCurrency(totalPayable)}</span>
            </div>
          </div>

          {compact && (
            <div className="mt-6 text-center">
              <a href={`/emi-calculator?price=${safePrice}`} className="text-sm font-semibold text-pink hover:underline">
                Check full calculator &rarr;
              </a>
            </div>
          )}
        </div>
      </div>

      {showCta && !compact && (
        <div className="px-6 md:px-8 pb-8 pt-4 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted max-w-lg">
            * EMI values are indicative; actual rates and eligibility depend on the lender.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto px-6 py-3 bg-pink-button hover:bg-pink-button-hover text-white rounded-xl font-bold transition-colors shadow-sm"
          >
            Get home loan assistance
          </button>
        </div>
      )}

      {/* Amortization Schedule (Full version only) */}
      {!compact && totalPayable > 0 && (
        <div className="border-t border-border">
          <button 
            onClick={() => setShowAmortization(!showAmortization)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-surface-2 transition-colors text-text font-semibold"
          >
            Yearly Amortization Schedule
            {showAmortization ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
          </button>
          
          {showAmortization && (
            <div className="p-6 pt-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 px-4 text-xs font-bold text-text-muted uppercase tracking-wider">Year</th>
                    <th className="py-3 px-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Principal Paid</th>
                    <th className="py-3 px-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Interest Paid</th>
                    <th className="py-3 px-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {schedule.map((row) => (
                    <tr key={row.year} className="hover:bg-gray-50 dark:hover:bg-surface-2 transition-colors text-sm">
                      <td className="py-3 px-4 font-medium text-text">Year {row.year}</td>
                      <td className="py-3 px-4 text-right text-text">{formatCurrency(row.principalPaid)}</td>
                      <td className="py-3 px-4 text-right text-text">{formatCurrency(row.interestPaid)}</td>
                      <td className="py-3 px-4 text-right font-medium text-text">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <EnquireModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultInterest="Home loan"
        defaultMessage={enquiryMessage}
      />
    </div>
  );
}
