"use client";

import { useEffect } from 'react';
import ClaimForm from '@/components/claim/ClaimForm';

export const metadata = {
  title: 'Submit Your Claim | Claim Connectors',
  description: 'Submit your rideshare accident claim and get the compensation you deserve. Fast, easy, and hassle-free process.',
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