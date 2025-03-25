// TikTok Pixel Event Tracking Utility

// Define the TikTok Pixel function type
interface TikTokPixel {
  (command: 'track', event: string, params?: Record<string, any>): void;
  (command: 'init', pixelId: string): void;
  (command: 'config', config: Record<string, any>): void;
  (command: 'identify', email?: string): void;
}

// Initialize window object with ttq property
declare global {
  interface Window {
    TiktokAnalyticsObject?: string;
    ttq?: TikTokPixel;
  }
}

// Standard event parameter types
export interface TiktokEventParams {
  value?: number;
  currency?: string;
  content_id?: string;
  content_type?: string;
  content_name?: string;
  content_category?: string;
  status?: string;
  
  // Custom properties for our application
  step?: number;
  step_name?: string;
  reason?: string;
}

/**
 * Track a standard event with the TikTok Pixel
 * @param eventName - The name of the event to track
 * @param params - Optional parameters for the event
 */
export const trackTikTokEvent = (eventName: string, params?: TiktokEventParams) => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq('track', eventName, params);
    
    // Log event in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[TikTok Pixel] Tracked event: ${eventName}`, params);
    }
  } else {
    console.warn('TikTok Pixel not loaded or not in browser environment');
  }
};

/**
 * Initialize consent mode for the TikTok Pixel
 * @param hasConsent - Whether the user has given consent for tracking
 */
export const initializeTikTokConsent = (hasConsent: boolean) => {
  // TikTok Pixel doesn't have a direct consent API like Meta
  // Instead we manage consent by conditionally loading the script
  if (typeof window !== 'undefined') {
    if (hasConsent) {
      // Store consent in localStorage for script loading
      localStorage.setItem('marketing_consent', 'true');
      
      // Check if TikTok script needs to be loaded
      if (!window.ttq) {
        // Script loading is handled in layout.tsx
        console.log('[TikTok Pixel] Consent granted, script should be loaded on next page load');
      }
    } else {
      // Remove consent
      localStorage.setItem('marketing_consent', 'false');
    }
  }
};

// Standard TikTok Pixel events
export const tiktokEvents = {
  // Standard TikTok events
  ADD_TO_CART: 'AddToCart',
  CHECKOUT: 'Checkout', 
  CLICK_BUTTON: 'ClickButton',
  COMPLETE_PAYMENT: 'CompletePayment',
  COMPLETE_REGISTRATION: 'CompleteRegistration',
  CONTACT: 'Contact',
  DOWNLOAD: 'Download',
  FORM_SUBMISSION: 'FormSubmission',
  LEAD: 'SubmitForm',
  PURCHASE: 'Purchase',
  SEARCH: 'Search',
  SUBSCRIBE: 'Subscribe',
  VIEW_CONTENT: 'ViewContent',
  
  // Custom events for our application
  START_CLAIM: 'StartClaim',
  COMPLETE_CLAIM_STEP: 'CompleteClaimStep',
  SUBMIT_CLAIM: 'SubmitClaim',
};

export default {
  trackTikTokEvent,
  initializeTikTokConsent,
  tiktokEvents,
}; 