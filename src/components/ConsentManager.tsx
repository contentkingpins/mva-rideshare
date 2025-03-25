"use client";

import { useState, useEffect } from 'react';
import { initializeConsent } from '@/utils/metaPixel';
import { initializeTikTokConsent } from '@/utils/tiktokPixel';

export default function ConsentManager() {
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    // Check if consent has been given before
    const hasConsent = localStorage.getItem('marketing_consent');
    
    // If no consent decision has been made, show the banner
    if (hasConsent === null) {
      setShowBanner(true);
    } else {
      // Initialize tracking pixels with the stored consent value
      const consentValue = hasConsent === 'true';
      initializeConsent(consentValue);
      initializeTikTokConsent(consentValue);
    }
  }, []);
  
  const acceptConsent = () => {
    localStorage.setItem('marketing_consent', 'true');
    
    // Initialize tracking for all platforms
    initializeConsent(true);
    initializeTikTokConsent(true);
    
    // Trigger a PageView event since it might not have been tracked on initial load
    if (typeof window !== 'undefined') {
      // Meta Pixel PageView
      if (window.fbq) {
        window.fbq('track', 'PageView');
      }
      
      // TikTok Pixel PageView (will reload on next page navigation due to how we load the script)
      if (window.ttq) {
        window.ttq('track', 'ViewContent');
      }
    }
    
    setShowBanner(false);
  };
  
  const declineConsent = () => {
    localStorage.setItem('marketing_consent', 'false');
    
    // Revoke tracking for all platforms
    initializeConsent(false);
    initializeTikTokConsent(false);
    
    setShowBanner(false);
  };
  
  if (!showBanner) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0 md:mr-4">
          <p className="text-sm md:text-base">
            We use cookies to improve your experience and for marketing purposes. 
            By continuing to browse our site, you agree to our use of cookies.
            See our <a href="/privacy" className="underline">Privacy Policy</a> for more information.
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={declineConsent}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
          >
            Decline
          </button>
          <button
            onClick={acceptConsent}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded text-sm"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
} 