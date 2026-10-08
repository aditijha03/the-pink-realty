import React from 'react';
import { Shield, Home, Building, Search, Warehouse, MapPin } from 'lucide-react';
import Reveal from './Reveal';

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Experienced Team",
      desc: "Our seasoned real estate professionals bring years of local market expertise to guide you seamlessly."
    },
    {
      icon: <Home className="w-6 h-6" />,
      title: "Certified Properties",
      desc: "Every property we list undergoes strict legal and RERA verification for your complete peace of mind."
    },
    {
      icon: <Building className="w-6 h-6" />,
      title: "Fast Buy & Fast Process",
      desc: "Experience a streamlined, hassle-free transaction process from initial property selection to final handover."
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Discount Properties",
      desc: "Gain access to exclusive builder tie-ups and early-bird offers that guarantee the best market prices."
    },
    {
      icon: <Warehouse className="w-6 h-6" />,
      title: "Modern Design",
      desc: "We curate homes featuring contemporary architecture, premium amenities, and smart space utilization."
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Convenient Location",
      desc: "Find properties situated in prime neighborhoods with excellent connectivity to schools, offices, and transit."
    }
  ];

  return (
    <section className="py-24 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 xl:px-8">
        <div className="text-center mb-20">
          <Reveal>
            <p className="text-pink font-semibold tracking-widest text-sm uppercase mb-3">
              WHY CHOOSEUS
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white max-w-2xl mx-auto leading-tight">
              You will get best your dream home
            </h2>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {features.map((feature, idx) => (
            <Reveal key={idx} direction="up" delay={idx * 150}>
              <div className="relative group border border-white/10 rounded-3xl pt-14 pb-10 px-8 h-full bg-transparent hover:bg-white/5 hover:border-pink/50 hover:shadow-[0_10px_40px_-10px_rgba(214,36,110,0.3)] transition-all duration-500 hover:-translate-y-2 cursor-default">
                <div className="absolute -top-7 left-8 bg-pink-button w-14 h-14 flex items-center justify-center text-white rounded-t-2xl rounded-bl-2xl rounded-br-sm shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2 group-hover:shadow-[0_10px_20px_rgba(214,36,110,0.4)]">
                  {feature.icon}
                </div>
                <h3 className="font-heading font-bold text-xl text-white mb-3 transition-colors duration-300 group-hover:text-pink">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-[15px] leading-relaxed transition-colors duration-300 group-hover:text-gray-300">
                  {feature.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
