// Meta Conversions API Utility

/**
 * User data interface for Meta Conversions API
 */
export interface UserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  userId?: string;
}

/**
 * Send an event to the Meta Conversions API
 * This should be called from client-side code to trigger server-side tracking
 * 
 * @param eventName - The name of the event to track
 * @param userData - User data for the event
 * @param customData - Custom data for the event
 * @returns Promise with the API response
 */
export const sendServerEvent = async (
  eventName: string,
  userData: UserData = {},
  customData: Record<string, any> = {}
): Promise<any> => {
  try {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      return { error: 'Not in browser environment' };
    }

    const response = await fetch('/api/meta-conversions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName,
        eventTime: Math.floor(Date.now() / 1000),
        userData,
        customData,
        eventSourceUrl: window.location.href,
      }),
    });

    const result = await response.json();

    // Log in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Meta Conversions API] Sent event: ${eventName}`, result);
    }

    return result;
  } catch (error) {
    console.error('[Meta Conversions API] Error:', error);
    return { error: 'Failed to send event' };
  }
};

/**
 * Track an event using both the Meta Pixel (client-side) and Conversions API (server-side)
 * This provides redundancy and improves tracking accuracy
 * 
 * @param eventName - The name of the event to track
 * @param userData - User data for the server-side event
 * @param eventParams - Parameters for both client and server-side events
 */
export const trackEventWithRedundancy = async (
  eventName: string,
  userData: UserData = {},
  eventParams: Record<string, any> = {}
): Promise<void> => {
  try {
    // Import the client-side tracking utility dynamically to avoid SSR issues
    const { trackEvent } = await import('./metaPixel');
    
    // Track with client-side Pixel
    trackEvent(eventName, eventParams);
    
    // Track with server-side Conversions API
    sendServerEvent(eventName, userData, eventParams);
  } catch (error) {
    console.error('[Meta Tracking] Error:', error);
  }
};

export default {
  sendServerEvent,
  trackEventWithRedundancy,
}; 