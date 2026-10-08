import { siteConfig } from '../data/siteConfig';
import React from 'react'
import { Head } from 'vite-react-ssg'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import FeaturedProperties from '../components/FeaturedProperties'
import ExploreTypes from '../components/ExploreTypes'
import FeaturedProject from '../components/FeaturedProject'
import PopularLocations from '../components/PopularLocations'
import WhyUs from '../components/WhyUs'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import AboutIntro from '../components/AboutIntro'
import CTA from '../components/CTA'
import EmiCtaBanner from '../components/EmiCtaBanner'
import Reveal from '../components/Reveal'

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        "name": "The Pink Realty",
        "image": "https://thepinkrealty.com/logo.webp",
        "url": "https://thepinkrealty.com",
        "telephone": "{siteConfig.contact.displayWhatsapp}",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Navi Mumbai",
          "addressRegion": "Maharashtra",
          "addressCountry": "IN"
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "09:00",
          "closes": "19:00"
        },
        "sameAs": [
          "https://facebook.com/thepinkrealty",
          "https://instagram.com/thepinkrealty",
          "https://linkedin.com/company/thepinkrealty"
        ]
      },
      {
        "@type": "WebSite",
        "url": "https://thepinkrealty.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://thepinkrealty.com/projects?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What are the hidden costs when buying property?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Beyond the property price, consider stamp duty, registration charges, GST (for under-construction), society maintenance deposits, and brokerage if applicable."
            }
          },
          {
            "@type": "Question",
            "name": "Is Navi Mumbai a good place for real estate investment?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, with the upcoming international airport, trans-harbour link, and expanding metro, Navi Mumbai offers excellent appreciation potential and rental yields."
            }
          },
          {
            "@type": "Question",
            "name": "How do I check if a property is RERA approved?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can verify the project's RERA registration number on the official MahaRERA website to ensure compliance and legal safety."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <Head>
        <title>Property in Mumbai & Navi Mumbai | Buy, Sell, Rent – The Pink Realty</title>
        <meta name="description" content="Your trusted partner in buying, selling and finding the perfect property in Mumbai & Navi Mumbai. Discover premium residences, commercial spaces and expert guidance." />
        <link rel="canonical" href="https://thepinkrealty.com/" />
        <meta property="og:title" content="Property in Mumbai & Navi Mumbai | Buy, Sell, Rent – The Pink Realty" />
        <meta property="og:description" content="Your trusted partner in buying, selling and finding the perfect property in Mumbai & Navi Mumbai." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&fit=crop" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>
      
      <Hero />
      <Stats />
      <FeaturedProperties />
      <ExploreTypes />
      <FeaturedProject />
      <PopularLocations />
      <WhyUs />
      
      <EmiCtaBanner />

      <Testimonials />
      <FAQ />
      <AboutIntro />
      <CTA />
    </>
  )
}
