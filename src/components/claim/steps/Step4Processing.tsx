"use client";

interface Step4Props {
  isLoading: boolean;
}

export default function Step4Processing({ isLoading }: Step4Props) {
  return (
    <div className="space-y-6 text-center">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Processing Your Claim</h2>
        <p className="text-gray-600">
          Please wait while we process your information.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-8">
        <div className="mb-6">
          <svg className="animate-spin h-16 w-16 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <div className="space-y-6 max-w-md">
          <div className="text-lg font-medium">
            We're reviewing your claim information
          </div>
          <div className="text-gray-600">
            <ul className="space-y-2 text-left">
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Verifying contact information
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Checking rideshare accident details
              </li>
              <li className="flex items-center">
                {isLoading ? (
                  <svg className="w-5 h-5 mr-2 text-primary-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
                Processing eligibility
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md text-blue-800 text-sm mt-8">
        <p>
          Please don't close this window while we process your information. This should only take a moment.
        </p>
      </div>
    </div>
  );
} 