import React from 'react';
import LegalLayout from '../components/LegalLayout';
import { terms } from '../data/legal';

export default function Terms() {
  return (
    <LegalLayout 
      doc={terms} 
      slug="/terms" 
      description="Read the Terms and Conditions of The Pink Realty. Learn about our services, policies, and website usage."
    />
  );
}
