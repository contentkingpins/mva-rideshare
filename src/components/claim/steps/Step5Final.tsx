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
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Claim Successfully Uploaded</h2>
        <p className="text-gray-600">
          Based on your information, your file has been escalated to a case manager. Please call to finalize your claim.
        </p>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg max-w-md mx-auto">
        <h3 className="font-bold text-lg mb-3">Next Steps</h3>
        <div className="text-center mb-6">
          <p className="text-lg font-medium text-gray-900 mb-4">
            Your case manager is ready to assist you.
          </p>
          <a
            href="tel:+18339986906"
            className="btn-primary inline-flex items-center justify-center px-6 py-3 text-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span className="hidden md:inline">Call +1 (833) 998-6906</span>
            <span className="md:hidden">Click to Call</span>
          </a>
        </div>
      </div>
      
      <div className="mt-8">
        <p className="mb-6">
          If you have any questions or need immediate assistance:
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="tel:+18339986906"
            className="btn-primary flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span className="hidden md:inline">Call +1 (833) 998-6906</span>
            <span className="md:hidden">Call Us Now</span>
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