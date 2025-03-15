import Link from 'next/link';

export const metadata = {
  title: 'Legal Disclaimer | Claim Connectors',
  description: 'Legal disclaimer for Claim Connectors - Important information about our services.',
};

export default function DisclaimerPage() {
  return (
    <div className="bg-gray-50 py-12 md:py-20">
      <div className="container max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Legal Disclaimer</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="lead">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <h2>Not Legal Advice</h2>
            <p>The information provided on this website is for general informational purposes only. It is not intended to constitute legal advice or create an attorney-client relationship. You should consult with a qualified attorney for advice regarding your specific situation.</p>
            
            <h2>No Attorney-Client Relationship</h2>
            <p>Use of this website or submission of information through our forms does not create an attorney-client relationship between you and Claim Connectors or any of our partner attorneys. An attorney-client relationship will only be established after you have signed a written agreement with a specific attorney.</p>
            
            <h2>No Guarantee of Results</h2>
            <p>Every legal case is unique, and past results do not guarantee similar outcomes in future cases. Any testimonials or case results presented on this website represent specific cases and do not guarantee that your case will have the same outcome.</p>
            
            <h2>Third-Party Links</h2>
            <p>Our website may contain links to third-party websites. We are not responsible for the content or privacy practices of these sites. We encourage you to review the terms and privacy policies of any third-party sites you visit.</p>
            
            <h2>Information Accuracy</h2>
            <p>While we strive to keep the information on our website accurate and up-to-date, we make no warranties or representations about the accuracy or completeness of the content. We assume no liability for any errors or omissions in the content of this website.</p>
            
            <h2>Limitation of Liability</h2>
            <p>Claim Connectors shall not be liable for any damages arising from the use of, or inability to use, this website or the information contained herein, including but not limited to direct, indirect, incidental, punitive, and consequential damages.</p>
            
            <h2>Jurisdiction</h2>
            <p>The laws governing rideshare accidents vary by state and jurisdiction. The information on this website may not be applicable to your specific location. You should consult with an attorney familiar with the laws in your jurisdiction.</p>
            
            <h2>Contact Us</h2>
            <p>If you have any questions about this Legal Disclaimer, please contact us at:</p>
            <p>
              Phone: <a href="tel:+18339986906">+1 (833) 998-6906</a>
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