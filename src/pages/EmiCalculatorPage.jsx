import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import PageHero from '../components/PageHero';
import EmiCalculator from '../components/EmiCalculator';

export default function EmiCalculatorPage() {
  const [searchParams] = useSearchParams();
  const initialPrice = Number(searchParams.get('price')) || 5000000;

  const faqs = [
    {
      question: "What is an EMI?",
      answer: "EMI stands for Equated Monthly Installment. It is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are used to pay off both interest and principal each month so that over a specified number of years, the loan is paid off in full."
    },
    {
      question: "How is Home Loan EMI calculated?",
      answer: "EMI is calculated using the formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1), where P is the Loan Amount, r is the monthly interest rate, and n is the tenure in months."
    },
    {
      question: "Does the EMI remain constant throughout the loan tenure?",
      answer: "If you opt for a fixed interest rate, your EMI will remain the same. If you choose a floating rate, the EMI may vary based on market changes in the interest rate."
    },
    {
      question: "What happens if I miss an EMI payment?",
      answer: "Missing an EMI payment can negatively impact your credit score, incur late payment penalties, and increase the overall interest burden on your loan."
    },
    {
      question: "Can I prepay my home loan?",
      answer: "Yes, you can prepay your home loan. Making partial prepayments can significantly reduce your outstanding principal and total interest cost over the tenure."
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "Home Loan EMI Calculator",
    "description": "Calculate your Equated Monthly Installment (EMI) for home loans, property investments, and real estate purchases.",
    "provider": {
      "@type": "Organization",
      "name": "The Pink Realty",
      "url": "https://thepinkrealty.com"
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>EMI Calculator | The Pink Realty</title>
        <meta name="description" content="Calculate your Home Loan EMI easily with The Pink Realty. Plan your property investment with our accurate and interactive EMI calculator." />
        <link rel="canonical" href="https://thepinkrealty.com/emi-calculator" />
        <meta property="og:title" content="EMI Calculator | The Pink Realty" />
        <meta property="og:description" content="Calculate your Home Loan EMI easily with The Pink Realty. Plan your property investment with our accurate and interactive EMI calculator." />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <PageHero 
        titleHTML="Plan your home loan with <em class='text-pink not-italic font-serif italic'>confidence</em>." 
        subtitle="Calculate your monthly EMI, view the amortization schedule, and find the perfect loan structure for your dream home." 
      />

      <div className="container mx-auto px-4 md:px-8 py-16 max-w-6xl">
        <EmiCalculator defaultPrice={initialPrice} showCta={true} />

        <div className="mt-20">
          <h2 className="font-heading text-3xl font-bold text-text mb-6">How EMI Works</h2>
          <p className="text-text-muted leading-relaxed mb-6">
            Equated Monthly Installment (EMI) is the fixed amount you pay to the bank every month to repay your home loan. 
            It consists of two parts: the principal amount and the interest. In the initial years of your loan, the interest 
            component makes up the bulk of your EMI, while the principal portion is smaller. Towards the end of the loan tenure, 
            this reverses, and you pay off more of the principal. 
          </p>
          <p className="text-text-muted leading-relaxed">
            <strong>Tips to lower your EMI:</strong> You can reduce your monthly burden by making a larger down payment, 
            negotiating a lower interest rate, or extending the tenure of your loan (though a longer tenure increases the 
            total interest paid).
          </p>
        </div>

        <div className="mt-20">
          <h2 className="font-heading text-3xl font-bold text-text mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group bg-white dark:bg-surface-elevated rounded-xl border border-border dark:border-pink/20 overflow-hidden">
                <summary className="px-6 py-4 cursor-pointer font-bold text-text flex items-center justify-between hover:bg-gray-50 dark:hover:bg-surface-2 transition-colors">
                  {faq.question}
                  <span className="transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 py-4 text-text-muted border-t border-border bg-gray-50 dark:bg-surface-2">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
