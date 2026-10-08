import React from 'react';
import { Head } from 'vite-react-ssg';

export default function PrivacyPolicy() {
  return (
    <div className="pt-32 pb-16 max-w-4xl mx-auto px-4">
      <Head>
        <title>Privacy Policy | The Pink Realty</title>
        <meta name="robots" content="noindex" />
      </Head>
      <h1 className="text-3xl font-heading text-text mb-6">Privacy Policy</h1>
      <div className="prose prose-pink dark:prose-invert">
        <p>Your privacy is important to us. This privacy policy explains how we collect and use your data.</p>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}
