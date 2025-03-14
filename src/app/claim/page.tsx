"use client";

import { useEffect } from 'react';
import type { Metadata } from 'next';
import ClaimForm from '@/components/claim/ClaimForm';

// Metadata is already defined in layout.tsx, can't be used in client components
// export const metadata = {
//   title: 'Submit Your Claim | Claim Connectors',
//   description: 'Submit your rideshare accident claim and get the compensation you deserve. Fast, easy, and hassle-free process.',
// };

export const metadata: Metadata = {
  title: 'File Your Rideshare Claim | MVA Rideshare Claims',
  description: 'Complete our simple form to start your rideshare accident claim today. Get the compensation you deserve for your Uber or Lyft accident.',
  // Use other for cache control headers
  other: {
    'cache-control': 'no-cache, no-store, must-revalidate, max-age=0',
  },
};

export default function ClaimPage() {
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