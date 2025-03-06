import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <HeroSection />
      <HowItWorks />
      <Testimonials />
      <Footer />
      
      {/* Add a small diagnostic section at the very bottom, only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-0 right-0 bg-gray-800 text-white p-2 text-xs opacity-50 hover:opacity-100">
          <div>ENV: {process.env.NODE_ENV}</div>
          <div>AWS Config: {!!process.env['key_id'] && !!process.env['secret'] && !!process.env['region'] ? '✅' : '❌'}</div>
          <div>Table: {process.env['table name'] ? '✅' : '❌'}</div>
          <div>
            <Link href="/test" className="text-blue-300 hover:text-blue-100 underline mt-1 block">
              Open Debug Console
            </Link>
          </div>
        </div>
      )}
    </main>
  );
} 