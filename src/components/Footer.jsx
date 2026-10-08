import { siteConfig } from '../data/siteConfig';
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Phone, Mail, MapPin, Send } from 'lucide-react';
import Reveal from './Reveal';

export default function Footer() {
  return (
    <>
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-pink to-transparent opacity-0 dark:opacity-100 transition-opacity duration-300" />
      <footer className="bg-[#0B1120] dark:bg-[#05030A] pt-16 pb-24 md:pb-8 text-white/80 text-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 xl:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand */}
          <Reveal delay={100}>
            <Link to="/" className="flex items-center mb-6">
              <img 
                src="/logo.webp" 
                alt="The Pink Realty Logo" 
                width="64"
                height="64"
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-white/60 mb-6 leading-relaxed">
              Your trusted partner in buying, selling and finding the perfect property in Mumbai & Navi Mumbai. Your Property, Our Priority.
            </p>
            <button className="text-pink font-medium border-b border-pink pb-1 hover:text-white hover:border-white transition-colors">
              List your property
            </button>
          </Reveal>

          {/* Quick Links */}
          <Reveal delay={200}>
            <h4 className="text-white font-heading font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'About us', 'Services', 'Property List', 'EMI Calculator', 'Contact us'].map(link => (
                <li key={link}>
                  <Link 
                    to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-')}`} 
                    className="hover:text-pink transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Contact */}
          <Reveal delay={300}>
            <h4 className="text-white font-heading font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-pink shrink-0" />
                <a href={`tel:+${siteConfig.contact.whatsappNumber}`} className="hover:text-pink transition-colors">{siteConfig.contact.displayWhatsapp}</a>
              </li>
              <li className="flex gap-3">
                <Mail className="w-5 h-5 text-pink shrink-0" />
                <a href="mailto:info@thepinkrealty.com" className="hover:text-pink transition-colors">info@thepinkrealty.com</a>
              </li>
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-pink shrink-0" />
                <span>Office No.007, Shah Heritage Chs Limited, Plot No 09, Seawoods West, Sector 42A, Seawoods<br/>Navi Mumbai, Maharashtra 400706</span>
              </li>
            </ul>
          </Reveal>

          {/* Newsletter */}
          <Reveal delay={400}>
            <h4 className="text-white font-heading font-bold text-lg mb-6">Follow Us</h4>
            <div className="flex gap-4 mb-8">
              <a href={siteConfig.social.facebook} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-pink-button hover:border-pink transition-colors" aria-label="Facebook">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href={siteConfig.social.instagram} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-pink-button hover:border-pink transition-colors" aria-label="Instagram">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href={siteConfig.social.linkedin} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-pink-button hover:border-pink transition-colors" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
            <p className="mb-3">Get the latest updates</p>
            <form className="flex" onSubmit={e => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-white/5 border border-white/10 rounded-l-lg px-4 py-2 w-full focus:outline-none focus:border-pink text-white"
                required
              />
              <button type="submit" className="bg-pink-button hover:bg-pink-button-hover px-4 rounded-r-lg transition-colors flex items-center justify-center" aria-label="Subscribe">
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </Reveal>
        </div>

        {/* Bottom */}
        <Reveal delay={500}>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-white/50">
            <p>Ac {new Date().getFullYear()} The Pink Realty. All rights reserved.</p>
            <div className="flex gap-4">
              <a href={siteConfig.social.privacyPolicy} className="hover:text-white transition-colors">Privacy Policy</a>
              <a href={siteConfig.social.termsConditions} className="hover:text-white transition-colors">Terms & Conditions</a>
            </div>
          </div>
        </Reveal>

      </div>
    </footer>
    </>
  );
}
