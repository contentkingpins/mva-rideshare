// Meta Pixel Event Tracking Utility

// Define the fbq function type to avoid TypeScript errors
declare global {
  interface Window {
    fbq: any;
  }
}

/**
 * Track a standard event with the Meta Pixel
 * @param eventName - The name of the event to track
 * @param options - Optional parameters for the event
 */
export const trackEvent = (eventName: string, options?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, options);
  } else {
    console.warn('Meta Pixel not loaded or not in browser environment');
  }
};

/**
 * Track a custom event with the Meta Pixel
 * @param eventName - The name of the custom event to track
 * @param options - Optional parameters for the event
 */
export const trackCustomEvent = (eventName: string, options?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, options);
  } else {
    console.warn('Meta Pixel not loaded or not in browser environment');
  }
};

// Standard Meta Pixel events
export const events = {
  // Conversion events
  COMPLETE_REGISTRATION: 'CompleteRegistration',
  CONTACT: 'Contact',
  LEAD: 'Lead',
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
  events,
}; 