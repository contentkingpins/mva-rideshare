"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Step5Final() {
  return (
    <div className="text-center py-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
          <svg 
            className="w-16 h-16 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
      </motion.div>
      
      <h2 className="text-3xl font-bold mb-4">Application Submitted!</h2>
      
      <p className="text-gray-600 mb-8 max-w-lg mx-auto">
        Based on your information, we are escalating your claim to a case manager.
      </p>
      
      <div className="bg-primary-50 p-6 rounded-lg mb-8 max-w-lg mx-auto text-left">
        <h3 className="font-bold text-xl mb-2">What happens next?</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 text-primary-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Your claim has been prioritized for immediate review</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 text-primary-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>A case manager is standing by to discuss your options</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 text-primary-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>If your claim qualifies, we'll connect you with legal counsel</span>
          </li>
        </ul>
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        <a href="tel:8885555555" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
          <div className="flex items-center justify-center">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            Please Click to Call Now
          </div>
        </a>
        
        <div className="mt-6 text-sm text-gray-500">
          Our case managers are available 24/7 to help with your claim
        </div>
        
        <div className="flex mt-6 space-x-4">
          <Link href="/" className="text-primary-600 hover:text-primary-800 underline">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 