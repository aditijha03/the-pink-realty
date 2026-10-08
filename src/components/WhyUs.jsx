import React from 'react';
import { Shield, TrendingUp, CheckCircle, UserCheck } from 'lucide-react';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

const reasons = [
  {
    icon: Shield,
    title: "Trusted Guidance",
    desc: "Honest advice at every step of your journey."
  },
  {
    icon: TrendingUp,
    title: "Local Market Knowledge",
    desc: "In-depth insights for better decisions."
  },
  {
    icon: CheckCircle,
    title: "Verified Opportunities",
    desc: "Only genuine & RERA-approved properties."
  },
  {
    icon: UserCheck,
    title: "Personalized Service",
    desc: "Tailored solutions for your unique needs."
  }
];

export default function WhyUs() {
  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 xl:px-8">
      <SectionHeader 
        title="Why The Pink Realty" 
        subtitle="More than just properties — we offer trusted guidance."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {reasons.map((item, index) => {
          const Icon = item.icon;
          return (
            <Reveal key={index} delay={index * 100} className="bg-surface p-8 rounded-2xl border border-border hover:bg-surface-2 hover:shadow-[0_0_15px_var(--glow)] hover:border-pink transition-all duration-300 group">
              <div className="w-14 h-14 bg-pink-light rounded-xl flex items-center justify-center text-pink mb-6 border border-border group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-text mb-3">
                {item.title}
              </h3>
              <p className="text-text-muted text-[15px] leading-relaxed">
                {item.desc}
              </p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
