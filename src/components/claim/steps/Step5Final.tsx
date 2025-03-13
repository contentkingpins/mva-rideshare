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
        Thank you for submitting your claim. One of our representatives will contact you within 24 hours to discuss your case.
      </p>
      
      <div className="bg-primary-50 p-6 rounded-lg mb-8 max-w-lg mx-auto text-left">
        <h3 className="font-bold text-xl mb-2">What happens next?</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 text-primary-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>A case specialist will review your claim details</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 text-primary-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>We'll contact you by phone or email within 24 hours</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 text-primary-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>If your claim qualifies, we'll connect you with legal counsel</span>
          </li>
        </ul>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Link href="/" className="btn-outline">
          Return to Home
        </Link>
        <Link href="/contact" className="btn-primary">
          Contact Support
        </Link>
      </div>
    </div>
  );
} 