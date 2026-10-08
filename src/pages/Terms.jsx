import React from 'react';
import { Head } from 'vite-react-ssg';

export default function Terms() {
  return (
    <div className="pt-32 pb-16 max-w-4xl mx-auto px-4">
      <Head>
        <title>Terms & Conditions | The Pink Realty</title>
        <meta name="robots" content="noindex" />
      </Head>
      <h1 className="text-3xl font-heading text-text mb-6">Terms & Conditions</h1>
      <div className="prose prose-pink dark:prose-invert">
        <p>By using our services, you agree to these terms and conditions.</p>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}
