import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'File Your Rideshare Claim | MVA Rideshare Claims',
  description: 'Complete our simple form to start your rideshare accident claim today. Get the compensation you deserve for your Uber or Lyft accident.',
  // Use metadata.other for cache control headers
  other: {
    'cache-control': 'no-cache, no-store, must-revalidate, max-age=0',
  },
}; 