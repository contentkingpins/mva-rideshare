// Combined Tracking Utility for Meta and TikTok

import { UserData } from './metaConversionsApi';

/**
 * Track an event across all tracking platforms with redundancy
 * This provides a single interface to track events across multiple platforms
 * 
 * @param eventName - The name of the event to track
 * @param userData - User data for server-side events
 * @param eventParams - Parameters for the events
 */
export const trackAllPlatforms = async (
  eventName: string,
  userData: UserData = {},
  eventParams: Record<string, any> = {}
): Promise<void> => {
  try {
    // Dynamically import tracking utilities to avoid SSR issues
    const [
      { trackEventWithRedundancy },
      { trackTikTokEvent }
    ] = await Promise.all([
      import('./metaConversionsApi'),
      import('./tiktokPixel')
    ]);
    
    // Track with Meta (client and server-side)
    trackEventWithRedundancy(eventName, userData, eventParams);
    
    // Map Meta event names to TikTok event names
    const tiktokEventName = mapToTikTokEvent(eventName);
    
    // Track with TikTok (client-side only)
    trackTikTokEvent(tiktokEventName, eventParams);
    
    // Log in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Tracking Utils] Tracked event across all platforms: ${eventName}`);
    }
  } catch (error) {
    console.error('[Tracking Utils] Error:', error);
  }
};

/**
 * Map Meta event names to TikTok event names
 * This is needed because different platforms have different event naming conventions
 * 
 * @param metaEventName - The Meta event name to map
 * @returns The corresponding TikTok event name
 */
const mapToTikTokEvent = (metaEventName: string): string => {
  const eventMap: Record<string, string> = {
    'PageView': 'ViewContent',
    'Lead': 'SubmitForm',
    'CompleteRegistration': 'CompleteRegistration',
    'Contact': 'Contact',
    'Search': 'Search',
    'AddToCart': 'AddToCart',
    'InitiateCheckout': 'Checkout',
    'Purchase': 'Purchase',
    // Custom event mappings
    'StartClaim': 'StartClaim',
    'CompleteClaimStep': 'CompleteClaimStep',
    'SubmitClaim': 'SubmitClaim',
  };
  
  // Return the mapped event name or the original if no mapping exists
  return eventMap[metaEventName] || metaEventName;
};

export default {
  trackAllPlatforms
}; 