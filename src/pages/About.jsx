import React from 'react';
import { Head } from 'vite-react-ssg';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import WhyChooseUs from '../components/WhyChooseUs';
import { teamData } from '../data/team';
import { Lightbulb, CheckCircle2, Shield, MapPin, Users, Target } from 'lucide-react';

export default function About() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About The Pink Realty",
    "description": "Learn about The Pink Realty, a trusted real estate consultancy serving Mumbai and Navi Mumbai for over 10 years.",
    "publisher": {
      "@type": "Organization",
      "name": "The Pink Realty",
      "logo": {
        "@type": "ImageObject",
        "url": "https://thepinkrealty.com/logo.webp"
      }
    }
  };

  const values = [
    { title: "Honesty", icon: <Shield className="w-6 h-6 text-pink" />, desc: "We believe in complete transparency in all our dealings." },
    { title: "Local Expertise", icon: <MapPin className="w-6 h-6 text-pink" />, desc: "Deep knowledge of Mumbai & Navi Mumbai markets." },
    { title: "Transparency", icon: <CheckCircle2 className="w-6 h-6 text-pink" />, desc: "No hidden fees, no surprise clauses." },
    { title: "Client First", icon: <Users className="w-6 h-6 text-pink" />, desc: "Your needs dictate our actions and recommendations." }
  ];


  return (
    <>
      <Head>
        <title>About Us | The Pink Realty</title>
        <meta name="description" content="Property guidance you can trust. Learn about The Pink Realty, a leading real estate consultant in Mumbai and Navi Mumbai." />
        <link rel="canonical" href="https://thepinkrealty.com/about-us" />
        <meta property="og:title" content="About Us | The Pink Realty" />
        <meta property="og:description" content="Property guidance you can trust. Learn about The Pink Realty." />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>

      <PageHero 
        titleHTML="Property guidance you can <em class='text-pink not-italic font-serif italic'>trust</em>."
        subtitle="Serving Mumbai and Navi Mumbai for over 10 years."
        bgImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 xl:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal direction="right">
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Our Office" className="rounded-3xl shadow-soft dark:shadow-[0_0_20px_var(--glow)] object-cover w-full h-[400px]" loading="lazy" />
            </Reveal>
            <Reveal direction="left">
              <h2 className="text-3xl font-heading font-semibold mb-6 text-text">Our Story</h2>
              <p className="text-text-muted text-lg mb-6 leading-relaxed">
                Founded over 10 years ago, The Pink Realty started with a simple vision: to make real estate transactions transparent, stress-free, and rewarding. What began as a small agency has grown into a leading consultancy serving thousands of happy families across Mumbai and Navi Mumbai.
              </p>
              <p className="text-text-muted text-lg mb-8 leading-relaxed">
                We pride ourselves on our deep local market knowledge, unwavering ethics, and a client-first approach that turns first-time buyers into lifelong partners.
              </p>
              <blockquote className="border-l-4 border-pink pl-6 italic text-xl text-text font-heading">
                "Our success is measured not by the number of properties sold, but by the smiles of the families we help."
              </blockquote>
            </Reveal>
          </div>
        </div>
      </section>

      <Stats />

      <WhyChooseUs />

      <section className="py-20 bg-surface-2">
        <div className="max-w-7xl mx-auto px-4 xl:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Reveal direction="up" delay={0.1}>
              <div className="bg-surface p-8 rounded-2xl shadow-soft dark:shadow-[0_4px_20px_var(--glow)] h-full border-t-4 border-pink border-x border-b border-border">
                <Target className="w-12 h-12 text-pink mb-6" />
                <h3 className="text-2xl font-heading font-semibold mb-4 text-text">Our Mission</h3>
                <p className="text-text-muted">To provide exceptional real estate services that exceed our clients' expectations through integrity, market expertise, and personalized attention.</p>
              </div>
            </Reveal>
            <Reveal direction="up" delay={0.2}>
              <div className="bg-surface p-8 rounded-2xl shadow-soft dark:shadow-[0_4px_20px_var(--glow)] h-full border-t-4 border-pink border-x border-b border-border">
                <Lightbulb className="w-12 h-12 text-pink mb-6" />
                <h3 className="text-2xl font-heading font-semibold mb-4 text-text">Our Vision</h3>
                <p className="text-text-muted">To be the most trusted and preferred real estate partner in Maharashtra, known for transforming the property buying and selling experience.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 xl:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">Our Values</h2>
              <p className="text-text-muted text-lg">The principles that guide every interaction.</p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <Reveal key={idx} direction="up" delay={idx * 150}>
                <div className="bg-pink-light/30 p-6 rounded-2xl text-center hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-border">
                    {value.icon}
                  </div>
                  <h4 className="text-xl font-semibold mb-2">{value.title}</h4>
                  <p className="text-text-muted text-sm">{value.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>



      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 xl:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">Meet the Team</h2>
              <p className="text-text-muted text-lg">The experts behind your successful property journey.</p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamData.map((member, idx) => (
              <Reveal key={member.id} direction="up" delay={idx * 150}>
                <div className="group rounded-2xl overflow-hidden shadow-soft border border-border hover:border-pink hover:shadow-[0_0_20px_var(--glow)] transition-all duration-300 hover:-translate-y-1.5 bg-surface">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-6 bg-surface border-t border-border">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-xl font-semibold">{member.name}</h4>
                        <p className="text-pink text-sm font-medium">{member.role}</p>
                      </div>
                      <a href={member.linkedin} className="text-text-muted hover:text-[#0A66C2] transition-colors" aria-label="LinkedIn Profile">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                      </a>
                    </div>
                    <p className="text-text-muted text-sm mt-3">{member.bio}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface-2 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 xl:px-8 text-center">
          <Reveal>
            <h3 className="text-xl font-medium mb-8 text-text-muted">Registered & Partnered With</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
              <div className="font-heading font-bold text-xl text-text">LODHA</div>
              <div className="font-heading font-bold text-xl text-text">GODREJ</div>
              <div className="font-heading font-bold text-xl text-text">HIRANANDANI</div>
              <div className="font-heading font-bold text-xl text-text">TATA HOUSING</div>
            </div>
          </Reveal>
        </div>
      </section>

      <Testimonials />
      <CTA />
    </>
  );
}
