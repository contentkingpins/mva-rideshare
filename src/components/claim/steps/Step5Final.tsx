"use client";

export default function Step5Final() {
  return (
    <div className="space-y-6 text-center">
      <div className="mb-8">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-3 w-20 h-20 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Your Claim Has Been Submitted</h2>
        <p className="text-gray-600">
          Thank you for providing your information. Your claim has been successfully submitted.
        </p>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg max-w-md mx-auto">
        <h3 className="font-bold text-lg mb-3">What Happens Next?</h3>
        <ol className="text-left space-y-3">
          <li className="flex">
            <span className="bg-blue-200 text-blue-800 rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">1</span>
            <span>A claim specialist will review your information within 24 hours.</span>
          </li>
          <li className="flex">
            <span className="bg-blue-200 text-blue-800 rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">2</span>
            <span>We'll contact you via phone or email to gather any additional details needed.</span>
          </li>
          <li className="flex">
            <span className="bg-blue-200 text-blue-800 rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">3</span>
            <span>Our team will guide you through the next steps of the claims process.</span>
          </li>
        </ol>
      </div>
      
      <div className="mt-8">
        <p className="mb-6">
          If you have any questions or need immediate assistance:
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="tel:8885555555"
            className="btn-primary flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            Call Us Now
          </a>
          <a
            href="/faq"
            className="btn-outline flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            View FAQs
          </a>
        </div>
      </div>
    </div>
  );
} 