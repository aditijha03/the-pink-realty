import React, { useState } from 'react';
import { Head } from 'vite-react-ssg';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import { siteConfig } from '../data/siteConfig';
import { 
  Share2, 
  Handshake, 
  Gift, 
  Users, 
  Briefcase, 
  Building, 
  Scale, 
  ChevronDown, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock
} from 'lucide-react';

const cleanPhone = (val) => String(val || '').replace(/[\s\-()]/g, '');
const indianPhoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;

export default function ReferAndEarn() {
  const [activeTab, setActiveTab] = useState('referral'); // 'referral' | 'partner'
  
  // Accordion open states
  const [openFaq, setOpenFaq] = useState(null);
  const [termsOpen, setTermsOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    referrerName: '',
    referrerPhone: '',
    referrerEmail: '',
    referrerCity: '',
    referrerType: 'Individual',
    company: '',
    clientName: '',
    clientPhone: '',
    requirement: 'Buy',
    location: '',
    budget: '',
    note: '',
    message: '',
    website: '' // honeypot
  });

  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [apiErrorMessage, setApiErrorMessage] = useState('');

  const referralConfig = siteConfig.referral || {};
  const rewardSummary = referralConfig.rewardSummary || 'Attractive referral rewards on every successful deal';
  const hasRewardDetails = Boolean(referralConfig.rewardDetails);
  const hasPayoutTimeline = Boolean(referralConfig.payoutTimeline);
  const hasMinDeal = Boolean(referralConfig.minimumEligibleDeal);
  const programTerms = Array.isArray(referralConfig.programTerms) ? referralConfig.programTerms : [];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.referrerName.trim() || formData.referrerName.trim().length < 2) {
      errors.referrerName = 'Please enter your full name (at least 2 characters)';
    }

    const cleanedReferrerPhone = cleanPhone(formData.referrerPhone);
    if (!cleanedReferrerPhone) {
      errors.referrerPhone = 'Please enter your mobile number';
    } else if (!indianPhoneRegex.test(cleanedReferrerPhone)) {
      errors.referrerPhone = 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)';
    }

    if (!formData.referrerEmail.trim() || !/^\S+@\S+\.\S+$/.test(formData.referrerEmail.trim())) {
      errors.referrerEmail = 'Please enter a valid email address';
    }

    if (!formData.referrerCity.trim()) {
      errors.referrerCity = 'Please enter your city';
    }

    if (activeTab === 'referral') {
      if (!formData.clientName.trim() || formData.clientName.trim().length < 2) {
        errors.clientName = "Please enter referred person's name";
      }

      const cleanedClientPhone = cleanPhone(formData.clientPhone);
      if (!cleanedClientPhone) {
        errors.clientPhone = "Please enter referred person's mobile number";
      } else if (!indianPhoneRegex.test(cleanedClientPhone)) {
        errors.clientPhone = 'Please enter a valid 10-digit Indian mobile number';
      }

      if (!formData.location.trim()) {
        errors.location = 'Please specify the preferred location';
      }
    } else {
      if (!formData.message.trim() || formData.message.trim().length < 5) {
        errors.message = 'Please provide details about how you would like to collaborate (at least 5 characters)';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiErrorMessage('');

    if (!validateForm()) return;

    setFormStatus('loading');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const payload = {
        type: activeTab,
        referrerName: formData.referrerName.trim(),
        referrerPhone: formData.referrerPhone.trim(),
        referrerEmail: formData.referrerEmail.trim(),
        referrerCity: formData.referrerCity.trim(),
        referrerType: formData.referrerType,
        company: formData.company.trim(),
        website: formData.website, // honeypot
        ...(activeTab === 'referral' ? {
          clientName: formData.clientName.trim(),
          clientPhone: formData.clientPhone.trim(),
          requirement: formData.requirement,
          location: formData.location.trim(),
          budget: formData.budget.trim(),
          note: formData.note.trim()
        } : {
          message: formData.message.trim()
        })
      };

      const response = await fetch(`${apiUrl}/referrals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 429) {
        setFormStatus('error');
        setApiErrorMessage('Too many requests. Please try again in a little while.');
        return;
      }

      if (response.status === 403) {
        setFormStatus('error');
        setApiErrorMessage('Security validation failed. Please reload the page and try again.');
        return;
      }

      if (!response.ok || !data.success) {
        setFormStatus('error');
        setApiErrorMessage(data.error || data.message || 'Failed to submit referral. Please check your information and try again.');
        return;
      }

      setFormStatus('success');
    } catch (err) {
      console.error('Submission error:', err);
      setFormStatus('error');
      setApiErrorMessage('Unable to reach server. Please check your connection and try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      referrerName: '',
      referrerPhone: '',
      referrerEmail: '',
      referrerCity: '',
      referrerType: 'Individual',
      company: '',
      clientName: '',
      clientPhone: '',
      requirement: 'Buy',
      location: '',
      budget: '',
      note: '',
      message: '',
      website: ''
    });
    setFormErrors({});
    setFormStatus('idle');
    setApiErrorMessage('');
  };

  const steps = [
    {
      num: "01",
      title: "Share a lead",
      desc: "Introduce someone looking to buy, sell, or rent property in Mumbai & Navi Mumbai through our simple form.",
      icon: <Share2 className="w-6 h-6 text-pink" />
    },
    {
      num: "02",
      title: "We help them with their property",
      desc: "Our verified property advisors consult with them, organize site visits, and guide them through negotiations.",
      icon: <Handshake className="w-6 h-6 text-pink" />
    },
    {
      num: "03",
      title: "You earn your reward after the deal closes",
      desc: "Once the transaction is successfully completed, your referral reward is disbursed directly to you.",
      icon: <Gift className="w-6 h-6 text-pink" />
    }
  ];

  const partners = [
    {
      title: "Individuals and friends",
      desc: "Have a friend, neighbor, or family member searching for a home or investment property? Connect us and earn.",
      icon: <Users className="w-7 h-7 text-pink" />
    },
    {
      title: "Real estate agents & consultants",
      desc: "Co-broke or co-partner on buyer mandates, commercial leases, and luxury residential projects.",
      icon: <Briefcase className="w-7 h-7 text-pink" />
    },
    {
      title: "Builders and developers",
      desc: "Partner with us for dedicated channel sales, sole selling, and mandate marketing representation.",
      icon: <Building className="w-7 h-7 text-pink" />
    },
    {
      title: "Professionals",
      desc: "Bankers, mortgage advisors, advocates, and interior designers who regularly advise property buyers.",
      icon: <Scale className="w-7 h-7 text-pink" />
    }
  ];

  const faqItems = [
    {
      q: "Who can refer?",
      a: "Anyone can participate in our referral and partner program! This includes individuals, friends, existing clients, real estate consultants, developers, and working professionals such as chartered accountants, bankers, legal consultants, and interior designers."
    },
    {
      q: "When is the reward paid?",
      a: referralConfig.payoutTimeline
        ? `Referral rewards are disbursed according to our payout schedule: ${referralConfig.payoutTimeline}, following successful deal closure and full documentation completion.`
        : "Referral rewards are processed directly after the referred transaction successfully closes and all official documentation and brokerage arrangements are finalized."
    },
    {
      q: "Is there a limit on how many referrals I can make?",
      a: "No, there is absolutely no limit. You can refer as many genuine property buyers, sellers, or tenants as you wish, and you will earn referral rewards on every successfully closed deal."
    },
    {
      q: "How are referrals tracked?",
      a: "Every referral you submit is timestamped and recorded in our system under your profile. Our team coordinates consultations and keeps you informed as the deal progresses through site visits and agreement signing."
    },
    {
      q: "What if the client was already in touch with us?",
      a: "If the client reached out to The Pink Realty independently within the last 90 days, the referral will be reviewed for prior interaction. We ensure fair and transparent attribution for all genuine introductions."
    }
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  return (
    <>
      <Head>
        <title>Refer & Earn / Partner With Us | The Pink Realty</title>
        <meta 
          name="description" 
          content="Know someone looking for a home? Refer friends, clients, or partner with The Pink Realty to earn attractive rewards upon successful property deal closures." 
        />
        <link rel="canonical" href="https://thepinkrealty.com/refer-and-earn" />
        <meta property="og:title" content="Refer & Earn / Partner With Us | The Pink Realty" />
        <meta 
          property="og:description" 
          content="Know someone looking for a home? Refer and earn attractive rewards with The Pink Realty." 
        />
        <meta property="og:url" content="https://thepinkrealty.com/refer-and-earn" />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Head>

      <PageHero 
        titleHTML="Know someone looking for a home? Refer and <em class='text-pink not-italic font-serif italic'>earn</em>."
        subtitle="Turn your connections into rewards. Introduce clients or partner with The Pink Realty for seamless property deals."
        bgImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80"
      />

      {/* How it works */}
      <section className="py-20 bg-surface transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 xl:px-8">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-pink font-semibold text-sm uppercase tracking-wider mb-2 block">
                Simple 3-Step Process
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-semibold text-text mb-4">
                How It Works
              </h2>
              <p className="text-text-muted text-base md:text-lg">
                We take care of every detail from property shortlisting to legal paperwork, while you earn for the introduction.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, idx) => (
              <Reveal key={step.num} direction="up" delay={idx * 150}>
                <div className="bg-surface-2 p-8 rounded-2xl border border-border hover:border-pink hover:shadow-[0_0_20px_var(--glow)] transition-all duration-300 h-full flex flex-col relative group">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-pink-light flex items-center justify-center border border-pink/20 group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                    <span className="font-heading font-bold text-3xl text-pink/40 group-hover:text-pink transition-colors">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-text mb-3">{step.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who can join */}
      <section className="py-20 bg-surface-2 transition-colors duration-300 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 xl:px-8">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-pink font-semibold text-sm uppercase tracking-wider mb-2 block">
                Partnership Opportunities
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-semibold text-text mb-4">
                Who Can Join
              </h2>
              <p className="text-text-muted text-base md:text-lg">
                Whether you are an individual with a single lead or an established property business, there is a place for you in our partner ecosystem.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.map((p, idx) => (
              <Reveal key={p.title} direction="up" delay={idx * 100}>
                <div className="bg-surface p-7 rounded-2xl border border-border hover:border-pink transition-all duration-300 h-full flex flex-col hover:-translate-y-1 shadow-soft">
                  <div className="w-12 h-12 rounded-xl bg-pink-light flex items-center justify-center mb-5 border border-pink/20">
                    {p.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-text mb-2.5">{p.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed flex-grow">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Rewards Overview Section */}
      <section className="py-20 bg-surface transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 xl:px-8">
          <Reveal>
            <div className="bg-gradient-to-br from-surface to-surface-2 p-8 md:p-12 rounded-3xl border border-pink/30 shadow-[0_0_30px_-5px_var(--glow)] relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-light text-pink text-xs font-bold uppercase tracking-wider mb-4 border border-pink/20">
                  <Sparkles className="w-4 h-4" /> Program Rewards
                </div>

                <h2 className="text-2xl md:text-4xl font-heading font-bold text-text mb-4">
                  {rewardSummary}
                </h2>

                {hasRewardDetails && (
                  <p className="text-text-muted text-base md:text-lg leading-relaxed mb-6">
                    {referralConfig.rewardDetails}
                  </p>
                )}

                {(hasPayoutTimeline || hasMinDeal) && (
                  <div className="grid sm:grid-cols-2 gap-4 my-6">
                    {hasPayoutTimeline && (
                      <div className="bg-surface p-4 rounded-xl border border-border flex items-start gap-3">
                        <Clock className="w-5 h-5 text-pink shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold uppercase text-text-muted block">Payout Timeline</span>
                          <span className="text-sm font-semibold text-text">{referralConfig.payoutTimeline}</span>
                        </div>
                      </div>
                    )}

                    {hasMinDeal && (
                      <div className="bg-surface p-4 rounded-xl border border-border flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-pink shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold uppercase text-text-muted block">Eligible Deal Threshold</span>
                          <span className="text-sm font-semibold text-text">{referralConfig.minimumEligibleDeal}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Program Terms Accordion */}
                {programTerms.length > 0 && (
                  <div className="mt-8 border-t border-border pt-6">
                    <button
                      type="button"
                      onClick={() => setTermsOpen(!termsOpen)}
                      className="w-full flex items-center justify-between text-left text-sm font-semibold text-text hover:text-pink transition-colors focus:outline-none"
                      aria-expanded={termsOpen}
                    >
                      <span>Program Terms & Conditions</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${termsOpen ? 'rotate-180 text-pink' : ''}`} />
                    </button>
                    {termsOpen && (
                      <ul className="mt-4 space-y-2 text-xs md:text-sm text-text-muted list-disc pl-5">
                        {programTerms.map((term, i) => (
                          <li key={i} className="leading-relaxed">{term}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Interactive Form Section */}
      <section id="referral-form" className="py-20 bg-surface-2 transition-colors duration-300 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4 xl:px-8">
          <Reveal>
            <div className="text-center mb-10">
              <span className="text-pink font-semibold text-sm uppercase tracking-wider mb-2 block">
                Get Started Today
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-semibold text-text mb-4">
                Submit a Referral or Partner Request
              </h2>
              <p className="text-text-muted text-base">
                Choose a mode below to share a prospective client or collaborate with us.
              </p>
            </div>
          </Reveal>

          {/* Form Container */}
          <div className="bg-surface p-6 sm:p-10 rounded-3xl border border-border shadow-soft dark:shadow-[0_0_30px_var(--glow)] transition-all">
            {/* Mode Switch Tabs */}
            <div 
              role="tablist"
              aria-label="Submission type" 
              className="flex bg-surface-2 p-1.5 rounded-2xl border border-border mb-8"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'referral'}
                onClick={() => { setActiveTab('referral'); setFormErrors({}); }}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'referral'
                    ? 'bg-pink-button text-white shadow-md'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                <Gift className="w-4 h-4" />
                <span>Refer a client</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'partner'}
                onClick={() => { setActiveTab('partner'); setFormErrors({}); }}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'partner'
                    ? 'bg-pink-button text-white shadow-md'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                <Handshake className="w-4 h-4" />
                <span>Become a partner</span>
              </button>
            </div>

            {/* Submission Status Message */}
            {formStatus === 'success' ? (
              <div className="py-12 px-4 text-center flex flex-col items-center justify-center animate-[fadeIn_0.3s_ease-out]">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-10 h-10 animate-[bounce_0.6s_ease-in-out]" />
                </div>
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-text mb-3">
                  Thank You for Your Submission!
                </h3>
                <p className="text-text-muted text-base max-w-lg mb-8 leading-relaxed">
                  {activeTab === 'referral'
                    ? "We have received your referral details. Our advisory team will reach out to your client promptly and keep you updated on progress."
                    : "We have received your partnership request. Our business development team will contact you shortly to explore collaboration opportunities."}
                </p>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-pink-button hover:bg-pink-button-hover text-white font-medium rounded-xl transition-colors shadow-sm"
                >
                  Submit another {activeTab === 'referral' ? 'referral' : 'request'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Honeypot field for bot spam */}
                <div className="sr-only" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                  />
                </div>

                {/* API Error Box */}
                {formStatus === 'error' && (
                  <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-700 dark:text-red-400 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{apiErrorMessage}</span>
                  </div>
                )}

                {/* Referrer Details Group */}
                <div className="space-y-4">
                  <h3 className="font-heading font-semibold text-lg text-text border-b border-border pb-2 flex items-center gap-2">
                    <Users className="w-5 h-5 text-pink" />
                    Your Details (Referrer)
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="referrerName" className="block text-xs font-semibold text-text mb-1">
                        Full Name <span className="text-pink">*</span>
                      </label>
                      <input
                        type="text"
                        id="referrerName"
                        value={formData.referrerName}
                        onChange={(e) => handleInputChange('referrerName', e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full px-4 py-3 rounded-xl border bg-surface text-text text-sm focus:outline-none focus:border-pink transition-colors ${
                          formErrors.referrerName ? 'border-red-500 bg-red-50/10' : 'border-border'
                        }`}
                      />
                      {formErrors.referrerName && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.referrerName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="referrerPhone" className="block text-xs font-semibold text-text mb-1">
                        Mobile Number <span className="text-pink">*</span>
                      </label>
                      <input
                        type="tel"
                        id="referrerPhone"
                        value={formData.referrerPhone}
                        onChange={(e) => handleInputChange('referrerPhone', e.target.value)}
                        placeholder="e.g. 9876543210"
                        className={`w-full px-4 py-3 rounded-xl border bg-surface text-text text-sm focus:outline-none focus:border-pink transition-colors ${
                          formErrors.referrerPhone ? 'border-red-500 bg-red-50/10' : 'border-border'
                        }`}
                      />
                      {formErrors.referrerPhone && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.referrerPhone}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="referrerEmail" className="block text-xs font-semibold text-text mb-1">
                        Email Address <span className="text-pink">*</span>
                      </label>
                      <input
                        type="email"
                        id="referrerEmail"
                        value={formData.referrerEmail}
                        onChange={(e) => handleInputChange('referrerEmail', e.target.value)}
                        placeholder="e.g. rahul@example.com"
                        className={`w-full px-4 py-3 rounded-xl border bg-surface text-text text-sm focus:outline-none focus:border-pink transition-colors ${
                          formErrors.referrerEmail ? 'border-red-500 bg-red-50/10' : 'border-border'
                        }`}
                      />
                      {formErrors.referrerEmail && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.referrerEmail}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="referrerCity" className="block text-xs font-semibold text-text mb-1">
                        Your City <span className="text-pink">*</span>
                      </label>
                      <input
                        type="text"
                        id="referrerCity"
                        value={formData.referrerCity}
                        onChange={(e) => handleInputChange('referrerCity', e.target.value)}
                        placeholder="e.g. Navi Mumbai / Mumbai"
                        className={`w-full px-4 py-3 rounded-xl border bg-surface text-text text-sm focus:outline-none focus:border-pink transition-colors ${
                          formErrors.referrerCity ? 'border-red-500 bg-red-50/10' : 'border-border'
                        }`}
                      />
                      {formErrors.referrerCity && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.referrerCity}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="referrerType" className="block text-xs font-semibold text-text mb-1">
                        I am a <span className="text-pink">*</span>
                      </label>
                      <select
                        id="referrerType"
                        value={formData.referrerType}
                        onChange={(e) => handleInputChange('referrerType', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:border-pink transition-colors"
                      >
                        <option value="Individual">Individual</option>
                        <option value="Agent or consultant">Agent or consultant</option>
                        <option value="Builder or developer">Builder or developer</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-xs font-semibold text-text mb-1">
                        Company / Organization <span className="text-text-muted font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="e.g. Sharma Realty / Independent"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:border-pink transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Mode-Specific Details Group */}
                {activeTab === 'referral' ? (
                  <div className="space-y-4 pt-4">
                    <h3 className="font-heading font-semibold text-lg text-text border-b border-border pb-2 flex items-center gap-2">
                      <Gift className="w-5 h-5 text-pink" />
                      Client Information
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="clientName" className="block text-xs font-semibold text-text mb-1">
                          Referred Person's Name <span className="text-pink">*</span>
                        </label>
                        <input
                          type="text"
                          id="clientName"
                          value={formData.clientName}
                          onChange={(e) => handleInputChange('clientName', e.target.value)}
                          placeholder="e.g. Priya Mehta"
                          className={`w-full px-4 py-3 rounded-xl border bg-surface text-text text-sm focus:outline-none focus:border-pink transition-colors ${
                            formErrors.clientName ? 'border-red-500 bg-red-50/10' : 'border-border'
                          }`}
                        />
                        {formErrors.clientName && (
                          <p className="text-xs text-red-500 mt-1">{formErrors.clientName}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="clientPhone" className="block text-xs font-semibold text-text mb-1">
                          Referred Person's Mobile <span className="text-pink">*</span>
                        </label>
                        <input
                          type="tel"
                          id="clientPhone"
                          value={formData.clientPhone}
                          onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                          placeholder="e.g. 9812345678"
                          className={`w-full px-4 py-3 rounded-xl border bg-surface text-text text-sm focus:outline-none focus:border-pink transition-colors ${
                            formErrors.clientPhone ? 'border-red-500 bg-red-50/10' : 'border-border'
                          }`}
                        />
                        {formErrors.clientPhone && (
                          <p className="text-xs text-red-500 mt-1">{formErrors.clientPhone}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="requirement" className="block text-xs font-semibold text-text mb-1">
                          Requirement <span className="text-pink">*</span>
                        </label>
                        <select
                          id="requirement"
                          value={formData.requirement}
                          onChange={(e) => handleInputChange('requirement', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:border-pink transition-colors"
                        >
                          <option value="Buy">Buy a property</option>
                          <option value="Sell">Sell a property</option>
                          <option value="Rent">Rent a property</option>
                          <option value="Home loan">Home loan</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="location" className="block text-xs font-semibold text-text mb-1">
                          Preferred Location <span className="text-pink">*</span>
                        </label>
                        <input
                          type="text"
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="e.g. Seawoods, Vashi, Kharghar, Bandra"
                          className={`w-full px-4 py-3 rounded-xl border bg-surface text-text text-sm focus:outline-none focus:border-pink transition-colors ${
                            formErrors.location ? 'border-red-500 bg-red-50/10' : 'border-border'
                          }`}
                        />
                        {formErrors.location && (
                          <p className="text-xs text-red-500 mt-1">{formErrors.location}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="budget" className="block text-xs font-semibold text-text mb-1">
                          Approximate Budget <span className="text-text-muted font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          id="budget"
                          value={formData.budget}
                          onChange={(e) => handleInputChange('budget', e.target.value)}
                          placeholder="e.g. ₹1.5 Cr – ₹2 Cr"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:border-pink transition-colors"
                        />
                      </div>

                      <div>
                        <label htmlFor="note" className="block text-xs font-semibold text-text mb-1">
                          Additional Note <span className="text-text-muted font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          id="note"
                          value={formData.note}
                          onChange={(e) => handleInputChange('note', e.target.value)}
                          placeholder="e.g. Looking for 2 BHK near station"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:border-pink transition-colors"
                        />
                      </div>
                    </div>

                    {/* Consent Reminder Hint */}
                    <div className="p-3.5 bg-pink-light/20 rounded-xl border border-pink/20 text-xs text-text-muted flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-pink shrink-0 mt-0.5" />
                      <span>
                        Please share details only of people who are happy to be contacted. We respect their privacy and maintain complete confidentiality.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 pt-4">
                    <h3 className="font-heading font-semibold text-lg text-text border-b border-border pb-2 flex items-center gap-2">
                      <Handshake className="w-5 h-5 text-pink" />
                      Collaboration Details
                    </h3>

                    <div>
                      <label htmlFor="message" className="block text-xs font-semibold text-text mb-1">
                        How would you like to collaborate? <span className="text-pink">*</span>
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Tell us about your services, target market, properties you deal with, or how we can work together..."
                        className={`w-full px-4 py-3 rounded-xl border bg-surface text-text text-sm focus:outline-none focus:border-pink transition-colors ${
                          formErrors.message ? 'border-red-500 bg-red-50/10' : 'border-border'
                        }`}
                      />
                      {formErrors.message && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={formStatus === 'loading'}
                    className="w-full py-4 px-6 bg-pink-button hover:bg-pink-button-hover text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-base"
                  >
                    {formStatus === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit {activeTab === 'referral' ? 'Client Referral' : 'Partner Request'}</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 bg-surface transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 xl:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-pink font-semibold text-sm uppercase tracking-wider mb-2 block">
                Common Inquiries
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-semibold text-text mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-text-muted text-base">
                Everything you need to know about our referral program and partner collaborations.
              </p>
            </div>
          </Reveal>

          <div className="space-y-4">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <Reveal key={idx} direction="up" delay={idx * 80}>
                  <div className="bg-surface-2 rounded-2xl border border-border overflow-hidden transition-colors">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-6 text-left flex items-center justify-between gap-4 font-heading font-semibold text-lg text-text hover:text-pink transition-colors focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span>{item.q}</span>
                      <ChevronDown className={`w-5 h-5 text-pink shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-text-muted text-base leading-relaxed border-t border-border/50 pt-4 animate-[fadeIn_0.2s_ease-out]">
                        {item.a}
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
