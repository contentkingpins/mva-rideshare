import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Claim Connectors',
  description: 'Terms of Service for Claim Connectors - Understand our policies and your rights.',
  keywords: 'rideshare terms, uber accident terms, lyft accident policy',
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 