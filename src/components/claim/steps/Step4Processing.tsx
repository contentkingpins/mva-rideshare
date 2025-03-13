"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Step4Props {
  isLoading: boolean;
}

export default function Step4Processing({ isLoading }: Step4Props) {
  const [processingStep, setProcessingStep] = useState(1);
  const processingSteps = [
    "Verifying claim details...",
    "Assessing liability and insurance coverage...",
    "Running compensation estimator...",
    "Finalizing results..."
  ];

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProcessingStep(prev => {
          if (prev < processingSteps.length) {
            return prev + 1;
          }
          clearInterval(interval);
          return prev;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isLoading, processingSteps.length]);

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Processing Your Claim</h2>
        <p className="text-gray-600">
          Please wait while our system processes your information.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="bg-gray-50 rounded-lg border p-6">
          <div className="flex justify-center mb-8">
            <div className="relative">
              {isLoading ? (
                <svg className="animate-spin h-16 w-16 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {processingSteps.map((step, index) => (
              <div key={index} className="flex items-center">
                {index < processingStep ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-3 flex-shrink-0"
                  >
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                ) : index === processingStep - 1 ? (
                  <div className="h-5 w-5 rounded-full border-2 border-primary-600 border-t-transparent animate-spin mr-3 flex-shrink-0" />
                ) : (
                  <div className="h-5 w-5 rounded-full border border-gray-300 mr-3 flex-shrink-0" />
                )}
                
                <div className={`text-sm ${index < processingStep ? 'text-gray-800' : 'text-gray-500'}`}>
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          This process typically takes just a few seconds. Thank you for your patience!
        </div>
      </div>
    </div>
  );
} 