import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Claim Connectors',
  description: 'Get in touch with our team of rideshare accident experts. We are here to help with your claim.',
  keywords: 'rideshare accident contact, uber accident help, lyft accident support',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 