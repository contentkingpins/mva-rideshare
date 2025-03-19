import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Script from 'next/script';
import ConsentManager from '@/components/ConsentManager';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Claim Connectors | Rideshare Injury Claims Made Easy',
  description: 'Submit your rideshare accident into our claim calculator—in just a few seconds, we can determine if you qualify for legal representation.',
  keywords: 'rideshare accident, uber accident, lyft accident, rideshare injury, claim compensation, accident lawyer, rideshare rights, rideshare legal guide',
  authors: [{ name: 'Claim Connectors Team' }],
  creator: 'Claim Connectors',
  publisher: 'Claim Connectors',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
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
      <head>
        {/* Meta Pixel Code - Loads conditionally based on consent */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            // Initialize fbq with consent handling
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            
            // Check for stored consent
            const hasConsent = localStorage.getItem('marketing_consent') === 'true';
            
            // Initialize with consent mode
            fbq('consent', hasConsent ? 'grant' : 'revoke');
            fbq('init', '1718356202366164');
            
            // Only track PageView if consent is granted
            if (hasConsent) {
              fbq('track', 'PageView');
            }
          `}
        </Script>
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1718356202366164&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <ConsentManager />
      </body>
    </html>
  );
} 