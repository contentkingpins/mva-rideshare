import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit Your Claim | Claim Connectors',
  description: 'Submit your rideshare accident claim details for a quick evaluation to see if you qualify for compensation.',
  keywords: 'rideshare accident claim, uber accident compensation, lyft accident claim',
};

export default function ClaimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 