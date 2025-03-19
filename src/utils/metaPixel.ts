// Meta Pixel Event Tracking Utility

// Define the fbq function type to avoid TypeScript errors
declare global {
  interface Window {
    fbq: (
      method: string, 
      eventName: string, 
      params?: Record<string, any>
    ) => void;
  }
}

// Standard event parameter types
export interface StandardEventParams {
  value?: number;
  currency?: string;
  content_name?: string;
  content_type?: string;
  content_ids?: string[];
  content_category?: string;
  search_string?: string;
  num_items?: number;
  status?: string;
  predicted_ltv?: number;
  
  // Custom properties for our application
  step?: number;
  step_name?: string;
  reason?: string;
  location?: string;
  phone_number?: string;
}

// Purchase event parameters
export interface PurchaseEventParams extends StandardEventParams {
  transaction_id?: string;
  value: number; // Required for purchase events
  currency: string; // Required for purchase events
}

// Lead event parameters
export interface LeadEventParams extends StandardEventParams {
  lead_id?: string;
  lead_type?: string;
}

/**
 * Track a standard event with the Meta Pixel
 * @param eventName - The name of the event to track
 * @param params - Optional parameters for the event
 */
export const trackEvent = (eventName: string, params?: StandardEventParams) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
    
    // Log event in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Meta Pixel] Tracked event: ${eventName}`, params);
    }
  } else {
    console.warn('Meta Pixel not loaded or not in browser environment');
  }
};

/**
 * Track a custom event with the Meta Pixel
 * @param eventName - The name of the custom event to track
 * @param params - Optional parameters for the event
 */
export const trackCustomEvent = (eventName: string, params?: StandardEventParams) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, params);
    
    // Log event in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Meta Pixel] Tracked custom event: ${eventName}`, params);
    }
  } else {
    console.warn('Meta Pixel not loaded or not in browser environment');
  }
};

/**
 * Initialize consent mode for the Meta Pixel
 * Should be called before any tracking if using consent management
 * @param hasConsent - Whether the user has given consent for tracking
 */
export const initializeConsent = (hasConsent: boolean) => {
  if (typeof window !== 'undefined' && window.fbq) {
    if (hasConsent) {
      window.fbq('consent', 'grant');
    } else {
      window.fbq('consent', 'revoke');
    }
    
    // Log consent status in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Meta Pixel] Consent ${hasConsent ? 'granted' : 'revoked'}`);
    }
  }
};

// Standard Meta Pixel events
export const events = {
  // Conversion events
  ADD_PAYMENT_INFO: 'AddPaymentInfo',
  ADD_TO_CART: 'AddToCart',
  ADD_TO_WISHLIST: 'AddToWishlist',
  COMPLETE_REGISTRATION: 'CompleteRegistration',
  CONTACT: 'Contact',
  CUSTOMIZE_PRODUCT: 'CustomizeProduct',
  DONATE: 'Donate',
  FIND_LOCATION: 'FindLocation',
  INITIATE_CHECKOUT: 'InitiateCheckout',
  LEAD: 'Lead',
  PURCHASE: 'Purchase',
  SCHEDULE: 'Schedule',
  START_TRIAL: 'StartTrial',
  SUBMIT_APPLICATION: 'SubmitApplication',
  SUBSCRIBE: 'Subscribe',
  
  // Discovery events
  SEARCH: 'Search',
  VIEW_CONTENT: 'ViewContent',
  
  // Custom events for our application
  DOWNLOAD_GUIDE: 'DownloadGuide',
  START_CLAIM: 'StartClaim',
  COMPLETE_CLAIM_STEP: 'CompleteClaimStep',
  SUBMIT_CLAIM: 'SubmitClaim',
  CALL_INITIATED: 'CallInitiated',
};

export default {
  trackEvent,
  trackCustomEvent,
  initializeConsent,
  events,
}; 