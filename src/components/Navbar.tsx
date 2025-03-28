"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { events } from '@/utils/metaPixel';
import { trackEventWithRedundancy } from '@/utils/metaConversionsApi';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCallClick = () => {
    trackEventWithRedundancy(
      events.CALL_INITIATED, 
      {}, // No user data for this event
      {
        location: 'navbar',
        phone_number: '+18339986906'
      }
    );
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">CC</span>
            </div>
            <span className="text-xl font-bold font-heading text-primary-800">Claim Connectors</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="font-medium text-gray-700 hover:text-primary-600">
              Home
            </Link>
            <Link href="/rideshare-rights" className="font-medium text-gray-700 hover:text-primary-600">
              Rideshare Rights
            </Link>
            <Link href="/claim" className="font-medium text-gray-700 hover:text-primary-600">
              Start Your Claim
            </Link>
            <a 
              href="tel:+18339986906" 
              className="font-medium text-primary-600 hover:text-primary-800"
              onClick={handleCallClick}
            >
              Call +1 (833) 998-6906
            </a>
          </div>

          {/* Mobile Navigation Button */}
          <button
            className="md:hidden h-10 w-10 flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="h-6 w-6 text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/rideshare-rights" 
                className="px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Rideshare Rights
              </Link>
              <Link 
                href="/claim" 
                className="px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Start Your Claim
              </Link>
              <a 
                href="tel:+18339986906" 
                className="px-4 py-2 font-medium text-primary-600 hover:bg-gray-100 rounded-md"
                onClick={(e) => {
                  handleCallClick();
                  setMobileMenuOpen(false);
                }}
              >
                Call +1 (833) 998-6906
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
} 