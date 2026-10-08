import { siteConfig } from '../data/siteConfig';
import React, { useState } from 'react';
import { Head } from 'vite-react-ssg';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

export default function ContactUs() {
  const [formStatus, setFormStatus] = useState('idle'); // idle, loading, success

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact The Pink Realty",
    "mainEntity": {
      "@type": "LocalBusiness",
      "name": "The Pink Realty",
      "image": "https://thepinkrealty.com/logo.webp",
      "telephone": "+91 8756250303",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Shop 4, Vashi Plaza",
        "addressLocality": "Navi Mumbai",
        "addressRegion": "MH",
        "postalCode": "400703",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 19.077065,
        "longitude": 72.998993
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "19:00"
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('loading');
    const formData = {
      name: e.target.name.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
      message: `Interested in: ${e.target.interest.value}. Location: ${e.target.location.value}. Message: ${e.target.message.value}`
    };
    try {
      await fetch(import.meta.env.VITE_API_URL + '/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      setFormStatus('success');
      e.target.reset();
      setTimeout(() => setFormStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setFormStatus('idle');
      alert('Failed to send enquiry. Please try again.');
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us | The Pink Realty</title>
        <meta name="description" content="Get in touch with The Pink Realty. We are here to help you buy, sell, or rent properties in Mumbai and Navi Mumbai." />
        <link rel="canonical" href="https://thepinkrealty.com/contact-us" />
        <meta property="og:title" content="Contact Us | The Pink Realty" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>

      <PageHero 
        titleHTML="Let's find your <em class='text-pink not-italic font-serif italic'>next</em> home."
        subtitle="Our team is ready to answer your questions and guide you through your real estate journey."
        bgImage="https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=1920&q=80"
      />

      <section className="py-20 bg-surface relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 xl:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            
            {/* Form Column */}
            <Reveal direction="right">
              <div className="bg-surface-2 p-8 md:p-10 rounded-3xl shadow-soft dark:shadow-[0_0_30px_var(--glow)] border border-border transition-colors duration-300">
                <h2 className="text-2xl font-heading font-semibold mb-6 text-text">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1" htmlFor="name">Full Name *</label>
                      <input required type="text" id="name" className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-pink bg-surface text-text transition-colors duration-300" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1" htmlFor="phone">Phone Number *</label>
                      <input required type="tel" id="phone" className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-pink bg-surface text-text transition-colors duration-300" placeholder="+91 90000 00000" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1" htmlFor="email">Email Address</label>
                    <input type="email" id="email" className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-pink bg-surface text-text transition-colors duration-300" placeholder={siteConfig.contact.emailPlaceholder} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1" htmlFor="interest">I'm interested in</label>
                      <select id="interest" className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-pink bg-surface text-text transition-colors duration-300">
                        <option>Buy</option>
                        <option>Sell</option>
                        <option>Rent</option>
                        <option>Investment</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1" htmlFor="location">Preferred Location</label>
                      <input type="text" id="location" className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-pink bg-surface text-text transition-colors duration-300" placeholder="e.g. Navi Mumbai" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1" htmlFor="message">Message</label>
                    <textarea id="message" rows="4" className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-pink bg-surface text-text resize-none transition-colors duration-300" placeholder="How can we help you?"></textarea>
                  </div>
                  <div className="flex items-start gap-2">
                    <input required type="checkbox" id="consent" className="mt-1" />
                    <label htmlFor="consent" className="text-sm text-text-muted">I consent to being contacted by The Pink Realty team regarding my inquiry.</label>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={formStatus === 'loading' || formStatus === 'success'}
                    className={`relative overflow-hidden w-full py-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 group ${
                      formStatus === 'success' ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'bg-pink-button text-white shadow-[0_0_15px_var(--glow)] hover:shadow-[0_0_25px_var(--glow)] hover:bg-pink-button-hover'
                    }`}
                  >
                    {formStatus === 'idle' && (
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_0.7s_ease-out_forwards]" />
                    )}
                    <span className="relative z-10">
                      {formStatus === 'loading' ? 'Sending...' : formStatus === 'success' ? 'Message Sent!' : 'Send Message'}
                    </span>
                  </button>
                </form>
              </div>
            </Reveal>

            {/* Info Column */}
            <Reveal direction="left">
              <h2 className="text-2xl font-heading font-semibold mb-8 text-text">Get in touch</h2>
              
              <div className="space-y-6 mb-10">
                <a href="tel:+918756250303" className="flex items-start gap-4 p-4 rounded-2xl hover:bg-pink-light/20 transition-colors group">
                  <div className="bg-pink-light/20 p-3 rounded-xl text-pink border border-border group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-text-muted font-medium mb-1">Call Us</div>
                    <div className="font-semibold text-text text-lg">+91 87562 50303</div>
                  </div>
                </a>
                
                <a href="mailto:info@thepinkrealty.com" className="flex items-start gap-4 p-4 rounded-2xl hover:bg-pink-light/20 transition-colors group">
                  <div className="bg-pink-light/20 p-3 rounded-xl text-pink border border-border group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-text-muted font-medium mb-1">Email Us</div>
                    <div className="font-semibold text-text text-lg">info@thepinkrealty.com</div>
                  </div>
                </a>

                <a href="https://wa.me/918756250303" target="_blank" rel="noreferrer" className="flex items-start gap-4 p-4 rounded-2xl hover:bg-pink-light/20 transition-colors group">
                  <div className="bg-[#25D366]/20 p-3 rounded-xl text-[#25D366] border border-[#25D366]/30 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-text-muted font-medium mb-1">WhatsApp</div>
                    <div className="font-semibold text-text text-lg">Chat with us</div>
                  </div>
                </a>
                
                <div className="flex items-start gap-4 p-4 rounded-2xl">
                  <div className="bg-surface-2 p-3 rounded-xl text-text-muted border border-border">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-text-muted font-medium mb-1">Office Address</div>
                    <div className="font-semibold text-text">Office No.007, Shah Heritage Chs Limited, Plot No 09,<br/>Seawoods West, Sector 42A, Seawoods<br/>Navi Mumbai, Maharashtra 400706</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl">
                  <div className="bg-surface-2 p-3 rounded-xl text-text-muted border border-border">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-text-muted font-medium mb-1">Working Hours</div>
                    <div className="font-semibold text-text">Mon - Sat: 9:00 AM - 7:00 PM</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-text-muted font-medium mb-4 pl-4">Follow Us</div>
                <div className="flex gap-4 pl-4">
                  <a href={siteConfig.social.twitter} aria-label="Follow us on Instagram" className="w-10 h-10 bg-surface-2 rounded-full flex items-center justify-center text-text-muted border border-border hover:bg-pink-button hover:text-white hover:border-pink transition-all">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href={siteConfig.social.facebook} aria-label="Follow us on Facebook" className="w-10 h-10 bg-surface-2 rounded-full flex items-center justify-center text-text-muted border border-border hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                  <a href={siteConfig.social.linkedin} aria-label="Connect on LinkedIn" className="w-10 h-10 bg-surface-2 rounded-full flex items-center justify-center text-text-muted border border-border hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-all">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[400px] w-full relative">
        <iframe 
          src="https://maps.google.com/maps?q=Shah%20Heritage%20Chs%20Limited,%20Seawoods,%20Navi%20Mumbai&t=&z=15&ie=UTF8&iwloc=&output=embed" 
          className="absolute inset-0 w-full h-full border-0 grayscale contrast-125 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700" 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="The Pink Realty Office Location"
        />
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_10px_20px_rgba(0,0,0,0.05)]" />
      </section>

      <FAQ />
      <CTA />
    </>
  );
}
