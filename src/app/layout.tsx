import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'Claim Connectors | Rideshare Injury Claims Made Easy',
  description: 'Get the compensation you deserve after a rideshare accident. Fast, easy, and hassle-free claims process.',
  keywords: 'rideshare accident, uber accident, lyft accident, rideshare injury, claim compensation, accident lawyer',
  authors: [{ name: 'Claim Connectors Team' }],
  creator: 'Claim Connectors',
  publisher: 'Claim Connectors',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
} 