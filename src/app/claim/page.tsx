"use client";

import { useEffect } from 'react';
import ClaimForm from '@/components/claim/ClaimForm';

// Note: Metadata cannot be exported from a client component
// Metadata should be defined in layout.tsx or a separate metadata.ts file

export default function ClaimPage() {
  // Add cache control headers via a header tag since we can't use metadata
  useEffect(() => {
    // Add a meta tag for cache control
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Cache-Control';
    meta.content = 'no-cache, no-store, must-revalidate, max-age=0';
    document.head.appendChild(meta);
    
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div className="bg-gray-50 py-12 md:py-20">
      <div className="container max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Your Rideshare Accident Claim</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <ClaimForm />
        </div>
      </div>
    </div>
  );
} 