import ClaimForm from '@/components/ClaimForm';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Submit Your Claim | Claim Connectors',
  description: 'Submit your rideshare accident claim and get the compensation you deserve. Fast, easy, and hassle-free process.',
};

export default function ClaimPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container py-12">
        <h1 className="text-center text-4xl font-bold text-gray-900 mb-8">Submit Your Claim</h1>
        <div className="max-w-3xl mx-auto">
          <ClaimForm />
        </div>
      </div>
      <Footer />
    </main>
  );
} 