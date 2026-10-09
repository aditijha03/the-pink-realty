import React from 'react';
import LegalLayout from '../components/LegalLayout';
import { privacy } from '../data/legal';

export default function PrivacyPolicy() {
  return (
    <LegalLayout 
      doc={privacy} 
      slug="/privacy-policy" 
      description="Read the Privacy Policy of The Pink Realty. Learn how we collect, use, and protect your personal information."
    />
  );
}
