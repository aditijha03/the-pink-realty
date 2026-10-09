import React, { useState, useEffect } from 'react';
import { Head } from 'vite-react-ssg';
import { Link } from 'react-router-dom';
import PageHero from './PageHero';
import { siteConfig } from '../data/siteConfig';
import { ChevronDown, ArrowUp, Phone, Mail, MapPin } from 'lucide-react';

const replaceTokens = (text) => {
  if (typeof text !== 'string') return text;
  let t = text;
  
  if (t.includes('{{legalName}}')) {
    t = siteConfig.legalName ? t.replace('{{legalName}}', siteConfig.legalName) : t.replace('{{legalName}}', '');
  }
  
  if (t.includes('{{rera}}')) {
    t = siteConfig.rera ? t.replace('{{rera}}', `MahaRERA registration no.: ${siteConfig.rera}`) : t.replace('{{rera}}', '');
  }
  
  if (t.includes('{{jurisdiction}}')) {
    if (siteConfig.jurisdiction) {
      t = t.replace('{{jurisdiction}}', siteConfig.jurisdiction);
    } else {
      // Remove the whole sentence if missing
      t = t.replace(/Subject to applicable law, the courts at \{\{jurisdiction\}\}, Maharashtra will have jurisdiction\./g, '').trim();
    }
  }
  
  if (t.includes('{{grievanceOfficer}}')) {
    t = siteConfig.grievanceOfficer ? t.replace('{{grievanceOfficer}}, The Pink Realty', `${siteConfig.grievanceOfficer}, The Pink Realty`) : t.replace('{{grievanceOfficer}}, The Pink Realty', 'The Pink Realty');
  }
  
  if (t.includes('{{dataRetention}}')) {
    t = siteConfig.dataRetention ? t.replace('{{dataRetention}}', `(for example, up to ${siteConfig.dataRetention})`) : t.replace(' {{dataRetention}}', '');
  }
  
  return t.replace(/\s+/g, ' ').trim(); // cleanup double spaces
};

const renderBlock = (block, idx) => {
  if (typeof block === 'string') {
    if (block.startsWith('- ')) {
      // It's a bullet item, but wait, the data has blocks as separate strings. 
      // If we render them one by one, we'll have multiple ul>li. It's fine to wrap it here or outside.
      // Wait, the data parser split them. Let's just handle it as a bullet.
      let html = replaceTokens(block.substring(2));
      // bold markers: **text**
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <li key={idx} dangerouslySetInnerHTML={{ __html: html }} className="ml-4 mb-2 list-disc" />;
    } else {
      let html = replaceTokens(block);
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={idx} dangerouslySetInnerHTML={{ __html: html }} className="mb-4 text-[17px] md:text-[18px] leading-relaxed text-text" />;
    }
  } else if (block.type === 'contact') {
    return (
      <div key={idx} className="bg-surface-2 p-6 rounded-xl border border-border my-6">
        {block.lines.map((line, i) => (
          <p key={i} className="mb-2 text-[17px] md:text-[18px] text-text last:mb-0">
            {replaceTokens(line)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function LegalLayout({ doc, slug, description }) {
  const [activeSection, setActiveSection] = useState('');
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 500);

      const sections = document.querySelectorAll('h2[id]');
      let current = '';
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (window.scrollY >= section.offsetTop - 150) {
          current = section.getAttribute('id');
          break;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const titleHTML = doc.title.replace('Policy', '<em class="text-pink not-italic font-serif italic">Policy</em>')
                             .replace('Conditions', '<em class="text-pink not-italic font-serif italic">Conditions</em>');

  const canonicalUrl = `https://thepinkrealty.com${slug}`;

  // Print stylesheet styles
  const printStyles = `
    @media print {
      header, footer, nav, aside, button[aria-label="Back to top"], .no-print { display: none !important; }
      body, main { background: white !important; color: black !important; }
      h1, h2, h3, p, li { color: black !important; }
      .print-content { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
    }
  `;

  return (
    <>
      <Head>
        <title>{doc.title} | The Pink Realty</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${doc.title} | The Pink Realty`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <style>{printStyles}</style>
      </Head>

      <PageHero 
        titleHTML={titleHTML}
        subtitle={`Last updated: ${doc.lastUpdated}`}
      />

      <div className="max-w-7xl mx-auto px-4 xl:px-8 py-16 flex flex-col lg:flex-row gap-12 relative print-content">
        
        {/* Mobile TOC */}
        <div className="lg:hidden no-print mb-8">
          <button 
            onClick={() => setIsTocOpen(!isTocOpen)}
            className="w-full flex items-center justify-between bg-surface p-4 rounded-xl border border-border text-text font-medium"
            aria-expanded={isTocOpen}
          >
            On this page
            <ChevronDown className={`w-5 h-5 transition-transform ${isTocOpen ? 'rotate-180' : ''}`} />
          </button>
          {isTocOpen && (
            <div className="mt-2 bg-surface rounded-xl border border-border p-4 max-h-[50vh] overflow-y-auto">
              <nav className="flex flex-col gap-3">
                {doc.sections.map(s => (
                  <a 
                    key={s.id} 
                    href={`#${s.id}`}
                    onClick={() => setIsTocOpen(false)}
                    className="text-[15px] text-text-muted hover:text-pink transition-colors"
                  >
                    {s.number}. {s.heading}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* Desktop TOC Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 no-print">
          <div className="sticky top-28">
            <h3 className="font-heading font-bold text-lg text-text mb-4">On this page</h3>
            <nav className="flex flex-col gap-3 border-l-2 border-border pl-4">
              {doc.sections.map(s => (
                <a 
                  key={s.id} 
                  href={`#${s.id}`}
                  className={`text-[14px] leading-tight transition-colors hover:text-pink ${
                    activeSection === s.id ? 'text-pink font-semibold' : 'text-text-muted'
                  }`}
                >
                  {s.number}. {s.heading}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 max-w-[720px] lg:max-w-[800px]">
          <p className="mb-10 text-[17px] md:text-[18px] leading-relaxed text-text">
            {doc.intro}
          </p>
          
          <div className="space-y-12">
            {doc.sections.map(section => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="text-2xl md:text-3xl font-heading font-semibold text-text mb-6">
                  {section.number}. {section.heading}
                </h2>
                <div>
                  {section.blocks.map((block, idx) => {
                    const isBullet = typeof block === 'string' && block.startsWith('- ');
                    const nextIsBullet = section.blocks[idx + 1] && typeof section.blocks[idx + 1] === 'string' && section.blocks[idx + 1].startsWith('- ');
                    const prevIsBullet = idx > 0 && typeof section.blocks[idx - 1] === 'string' && section.blocks[idx - 1].startsWith('- ');
                    
                    if (isBullet && !prevIsBullet) {
                      // Start of list
                      let listItems = [];
                      for (let i = idx; i < section.blocks.length; i++) {
                        if (typeof section.blocks[i] === 'string' && section.blocks[i].startsWith('- ')) {
                          listItems.push(section.blocks[i]);
                        } else {
                          break;
                        }
                      }
                      return (
                        <ul key={`ul-${idx}`} className="mb-4">
                          {listItems.map((item, i) => renderBlock(item, i))}
                        </ul>
                      );
                    } else if (isBullet && prevIsBullet) {
                      // Already rendered in the group
                      return null;
                    }

                    return renderBlock(block, idx);
                  })}
                </div>
              </section>
            ))}
          </div>
          
          {/* Bottom Contact Card */}
          <div className="mt-16 bg-pink-light/20 p-8 rounded-2xl border border-pink/20 flex flex-col items-center text-center no-print">
            <h3 className="font-heading font-bold text-xl text-text mb-2">Need further assistance?</h3>
            <p className="text-text-muted mb-6">Our team is here to help with any questions you may have.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a 
                href={`tel:+${siteConfig.contact.whatsappNumber}`}
                className="flex items-center justify-center gap-2 bg-pink-button hover:bg-pink-button-hover text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                <Phone className="w-5 h-5" />
                Tap to Call
              </a>
              <a 
                href={`mailto:${siteConfig.contact.emailPlaceholder}`}
                className="flex items-center justify-center gap-2 bg-white dark:bg-surface border border-border hover:border-pink text-text px-6 py-3 rounded-xl font-medium transition-colors"
              >
                <Mail className="w-5 h-5" />
                Email Us
              </a>
            </div>
            
            <div className="flex items-start gap-2 mt-8 text-left max-w-sm text-text-muted">
              <MapPin className="w-5 h-5 text-pink shrink-0 mt-1" />
              <p className="text-sm">
                Office No. 007, Shah Heritage CHS Limited, Plot No. 09, Seawoods West, Sector 42A, Seawoods, Navi Mumbai, Maharashtra 400706
              </p>
            </div>
          </div>

        </main>
      </div>

      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-24 md:bottom-8 right-4 md:right-24 z-30 p-3 rounded-full bg-surface shadow-soft border border-border text-pink hover:bg-pink hover:text-white transition-all duration-300 no-print ${
          showTopBtn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </>
  );
}
