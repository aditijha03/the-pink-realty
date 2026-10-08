import { siteConfig } from '../data/siteConfig';
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, Loader2 } from 'lucide-react';

export default function EnquireModal({ isOpen, onClose, defaultInterest, defaultMessage }) {
  const modalRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      // Reset states when opened
      setIsSubmitted(false);
      setIsSubmitting(false);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className="relative bg-white dark:bg-surface-elevated dark:backdrop-blur-2xl border border-border dark:border-pink/30 dark:shadow-[0_0_20px_-5px_var(--glow)] w-full max-w-md rounded-[24px] p-6 shadow-2xl animate-[modalFadeIn_0.25s_ease-out] z-10 transition-colors duration-300 overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-muted hover:text-pink transition-colors bg-pink-light/20 border border-border rounded-full z-20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-10 flex flex-col items-center justify-center text-center animate-[modalFadeIn_0.3s_ease-out]">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-text mb-2">Thank You!</h3>
            <p className="text-text-muted text-[15px] mb-6">Your enquiry has been submitted successfully. Our property expert will contact you shortly.</p>
            <button 
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 px-8 rounded-xl font-medium transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="font-heading text-2xl font-bold text-text mb-2 transition-colors duration-300">Enquire Now</h3>
              <p className="text-text-muted text-[15px] transition-colors duration-300">Fill out the form below and our property expert will contact you shortly.</p>
            </div>

            <form className="space-y-4" onSubmit={async (e) => { 
              e.preventDefault(); 
              setIsSubmitting(true);
              let msg = `Interested in: ${e.target.interest.value}`;
              if (defaultMessage) {
                msg += `\n\nDetails:\n${defaultMessage}`;
              }
              const formData = {
                name: e.target.name.value,
                phone: e.target.phone.value,
                email: e.target.email.value,
                message: msg
              };
              try {
                await fetch(import.meta.env.VITE_API_URL + '/enquiries', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                  credentials: 'include',
                  body: JSON.stringify(formData)
                });
                setIsSubmitted(true);
                // Auto close after 3 seconds
                setTimeout(() => {
                  if (document.body.style.overflow === 'hidden') {
                    onClose();
                  }
                }, 3000);
              } catch(err) {
                alert('Error submitting form');
                setIsSubmitting(false);
              }
            }}>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="name">Full Name *</label>
                <input required type="text" id="name" name="name" className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-surface-2 text-text focus:outline-none focus:border-pink focus:ring-1 focus:ring-pink transition-colors" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="phone">Phone Number *</label>
                <input required type="tel" id="phone" name="phone" className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-surface-2 text-text focus:outline-none focus:border-pink focus:ring-1 focus:ring-pink transition-colors" placeholder="+91 90000 00000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-surface-2 text-text focus:outline-none focus:border-pink focus:ring-1 focus:ring-pink transition-colors" placeholder={siteConfig.contact.emailPlaceholder} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="interest">I am looking to</label>
                <select defaultValue={defaultInterest || "Buy a property"} id="interest" className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-surface-2 text-text focus:outline-none focus:border-pink focus:ring-1 focus:ring-pink transition-colors">
                  <option value="Buy a property">Buy a property</option>
                  <option value="Rent a property">Rent a property</option>
                  <option value="Sell a property">Sell a property</option>
                  <option value="Invest in projects">Invest in projects</option>
                  {defaultInterest && !["Buy a property", "Rent a property", "Sell a property", "Invest in projects"].includes(defaultInterest) && (
                    <option value={defaultInterest}>{defaultInterest}</option>
                  )}
                </select>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-pink-button hover:bg-pink-button-hover text-white py-3.5 rounded-xl font-medium transition-colors mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                ) : (
                  'Submit Enquiry'
                )}
              </button>
            </form>
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}} />
    </div>,
    document.body
  );
}
