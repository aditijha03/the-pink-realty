import React, { useState } from 'react';
import { Head } from 'vite-react-ssg';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import CTA from '../components/CTA';
import FAQ from '../components/FAQ';
import EnquireModal from '../components/EnquireModal';
import { Link } from 'react-router-dom';
import { Key, Home, Building2, TrendingUp, Globe2, FileCheck, ShieldCheck, Calculator, CheckCircle2, Target, Building, Handshake, FileText } from 'lucide-react';

export default function Services() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Real Estate Consulting",
    "provider": {
      "@type": "LocalBusiness",
      "name": "The Pink Realty"
    }
  };

  const services = [
    { id: "buy", icon: <Home className="w-8 h-8 text-pink" />, title: "Buy Property", desc: "Find your dream home from our curated list of verified properties." },
    { id: "sell", icon: <Key className="w-8 h-8 text-pink" />, title: "Sell Property", desc: "Get the best market value for your property with our expert marketing." },
    { id: "rent", icon: <Building2 className="w-8 h-8 text-pink" />, title: "Rent & Lease", desc: "Hassle-free renting for tenants and property management for owners." },
    { id: "new", icon: <Building className="w-8 h-8 text-pink" />, title: "New Projects", desc: "Exclusive access to pre-launch offers from top builders." },
    { id: "invest", icon: <TrendingUp className="w-8 h-8 text-pink" />, title: "Investment Advisory", desc: "Data-driven insights for high ROI real estate investments." },
    { id: "nri", icon: <Globe2 className="w-8 h-8 text-pink" />, title: "NRI Services", desc: "End-to-end property management and investment solutions for NRIs." }
  ];

  const serviceDetails = [
    {
      id: "buy",
      title: "Buy Property",
      desc: "We understand that buying a home is one of life's biggest decisions. Our team ensures you find exactly what you're looking for, at the right price.",
      benefits: ["Curated selection of verified properties", "Expert negotiation on your behalf", "Transparent pricing and fee structure", "End-to-end assistance till possession"],
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&w=800&q=80"
    },
    {
      id: "sell",
      title: "Sell Property",
      desc: "Maximize your property's value with our comprehensive marketing strategy. We connect your property with genuine, qualified buyers.",
      benefits: ["Professional valuation and pricing strategy", "High-quality photography and staging advice", "Extensive online and offline marketing", "Complete support during legal transfer"],
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&w=800&q=80"
    },
    {
      id: "rent",
      title: "Rent & Lease",
      desc: "Whether you're looking for a temporary home or want to lease out your commercial space, we make the process smooth and secure.",
      benefits: ["Rigorous tenant screening process", "Drafting of watertight lease agreements", "Assistance with police verification", "Rent collection and maintenance support"],
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&w=800&q=80"
    }
  ];

  const legalServices = [
    { icon: <FileCheck className="w-6 h-6 text-pink" />, title: "Agreement Drafting" },
    { icon: <Calculator className="w-6 h-6 text-pink" />, title: "Home Loan Assistance", link: "/emi-calculator", linkText: "EMI Calculator" },
    { icon: <ShieldCheck className="w-6 h-6 text-pink" />, title: "Registration & Stamp Duty" },
    { icon: <Building2 className="w-6 h-6 text-pink" />, title: "Society Transfer Help" }
  ];

  const processSteps = [
    { title: "Understand your needs", icon: <Target className="w-8 h-8 text-pink" />, desc: "Detailed consultation." },
    { title: "Shortlist verified options", icon: <Building className="w-8 h-8 text-pink" />, desc: "Curated list of properties." },
    { title: "Visit and negotiate", icon: <Handshake className="w-8 h-8 text-pink" />, desc: "Guided site visits." },
    { title: "Paperwork and handover", icon: <FileText className="w-8 h-8 text-pink" />, desc: "Hassle-free legal help." }
  ];

  const openEnquire = (service) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  return (
    <>
      <Head>
        <title>Our Services | The Pink Realty</title>
        <meta name="description" content="From buying and selling to legal assistance and NRI services, we are your one-stop partner for real estate." />
        <link rel="canonical" href="https://thepinkrealty.com/services" />
        <meta property="og:title" content="Our Services | The Pink Realty" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>

      <PageHero 
        titleHTML="Everything you need, <em class='text-pink not-italic font-serif italic'>one</em> trusted partner."
        subtitle="Comprehensive real estate solutions tailored to your unique requirements."
        bgImage="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1920&q=80"
      />

      {/* Services Grid */}
      <section className="py-20 bg-surface-2 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 xl:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <Reveal key={service.id} direction="up" delay={idx * 150}>
                <div className="bg-surface p-8 rounded-2xl shadow-soft h-full flex flex-col items-start border border-border hover:border-pink hover:shadow-[0_0_20px_var(--glow)] transition-all duration-300 hover:-translate-y-1.5">
                  <div className="bg-pink-light w-16 h-16 rounded-full flex items-center justify-center mb-6 text-pink border border-border">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-text">{service.title}</h3>
                  <p className="text-text-muted mb-6 flex-grow">{service.desc}</p>
                  <a href={`#${service.id}`} className="text-pink font-medium hover:underline inline-flex items-center gap-1">
                    Learn more <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Detail Sections */}
      {serviceDetails.map((detail, idx) => {
        const isEven = idx % 2 === 0;
        return (
          <section key={detail.id} id={detail.id} className={`py-20 ${!isEven ? 'bg-surface-2' : 'bg-surface'} scroll-mt-24 transition-colors duration-300`}>
            <div className="max-w-7xl mx-auto px-4 xl:px-8">
              <div className={`grid lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                <Reveal direction={isEven ? 'right' : 'left'} className={!isEven ? 'lg:order-2' : ''}>
                  <img src={detail.image} alt={detail.title} className="rounded-3xl shadow-soft dark:shadow-[0_0_20px_var(--glow)] object-cover w-full h-[400px]" loading="lazy" />
                </Reveal>
                <Reveal direction={isEven ? 'left' : 'right'} className={!isEven ? 'lg:order-1' : ''}>
                  <h2 className="text-3xl font-heading font-semibold mb-4 text-text">{detail.title}</h2>
                  <p className="text-text-muted text-lg mb-8">{detail.desc}</p>
                  <ul className="space-y-4 mb-8">
                    {detail.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-pink shrink-0" />
                        <span className="text-text">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => openEnquire(detail.title)} className="bg-pink-button text-white px-8 py-3 rounded-full font-medium hover:bg-pink-button-hover transition-colors shadow-soft hover:shadow-[0_0_20px_var(--glow)]">
                    Enquire about this
                  </button>
                </Reveal>
              </div>
            </div>
          </section>
        );
      })}

      {/* Legal Strip */}
      <section className="py-16 bg-pink-button text-white">
        <div className="max-w-7xl mx-auto px-4 xl:px-8">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-2">Legal & Documentation</h2>
              <p className="text-white/90">Complete peace of mind with our allied services</p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {legalServices.map((service, idx) => (
              <Reveal key={idx} direction="up" delay={idx * 0.1}>
                <div className="bg-white/10 backdrop-blur p-6 rounded-xl border border-white/20 flex flex-col items-center text-center">
                  <div className="bg-surface p-3 rounded-full mb-4">
                    {service.icon}
                  </div>
                  <h4 className="font-medium text-lg">{service.title}</h4>
                  {service.link && (
                    <Link to={service.link} className="mt-2 text-sm text-pink-light hover:text-white underline transition-colors">
                      {service.linkText}
                    </Link>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-surface-2 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 xl:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4 text-text">Our Process</h2>
            </div>
          </Reveal>
          <div className="flex flex-col md:flex-row justify-between items-start relative group">
            {/* Background line */}
            <div className="hidden md:block absolute top-12 left-[12.5%] w-[75%] h-0.5 bg-border -z-10" />
            {/* Animated train line over it */}
            <Reveal delay={0} className="hidden md:block absolute top-12 left-[12.5%] w-[75%] h-0.5 -z-10">
              <div 
                className="w-full h-full bg-pink-button origin-left"
                style={{ 
                  animation: 'trainLine 1.6s ease-in-out forwards',
                  animationDelay: '100ms',
                  transform: 'scaleX(0)'
                }}
              />
            </Reveal>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes trainLine {
                0% { transform: scaleX(0); }
                100% { transform: scaleX(1); }
              }
            `}} />
            {processSteps.map((step, idx) => (
              <Reveal key={idx} direction="left" delay={idx * 400} className="w-full md:w-1/4 px-4 mb-8 md:mb-0">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center shadow-[0_0_15px_var(--glow)] border-4 border-surface-2 mb-6 transition-colors duration-300">
                    {step.icon}
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-text">{step.title}</h4>
                  <p className="text-text-muted text-sm">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FAQ />
      <CTA />
      <EnquireModal isOpen={modalOpen} onClose={() => setModalOpen(false)} defaultInterest={selectedService} />
    </>
  );
}
