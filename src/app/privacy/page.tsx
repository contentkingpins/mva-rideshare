import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Claim Connectors',
  description: 'Privacy policy for Claim Connectors - Learn how we protect your data and information.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 py-12 md:py-20">
      <div className="container max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="lead">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <p>At Claim Connectors, we take your privacy seriously. This Privacy Policy describes how we collect, use, and share information about you when you use our website and services.</p>
            
            <h2>Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you fill out a form, submit a claim, or contact us. This information may include:</p>
            <ul>
              <li>Contact information (name, email address, phone number)</li>
              <li>Accident details and information about your rideshare experience</li>
              <li>Any other information you choose to provide</li>
            </ul>
            
            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and evaluate your claim</li>
              <li>Connect you with appropriate legal representation</li>
              <li>Communicate with you about your claim and our services</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
            
            <h2>Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>Legal partners who can assist with your claim</li>
              <li>Service providers who help us operate our business</li>
              <li>As required by law or to protect our rights</li>
            </ul>
            
            <h2>Your Choices</h2>
            <p>You can opt out of marketing communications at any time. You may also request that we delete your information, subject to legal requirements that may require us to retain certain data.</p>
            
            <h2>Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
            
            <h2>Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p>
              Email: <a href="mailto:info@claimconnectors.com">info@claimconnectors.com</a><br />
              Phone: <a href="tel:8885555555">(888) 555-5555</a>
            </p>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/" className="btn-primary">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 