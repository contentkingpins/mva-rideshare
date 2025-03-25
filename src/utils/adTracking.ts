interface AdEventParams {
  adId: string;
  adType: string;
  position?: string;
  value?: number;
  currency?: string;
}

// Import standard event names from metaPixel utility
import { events as standardEvents } from './metaPixel';

export const trackAdEvent = (eventName: string, params: AdEventParams) => {
  if (typeof window === 'undefined') return;

  // Meta Pixel tracking - ensure we're using a valid standard event
  if ((window as any).fbq) {
    // Check if this is a standard event or needs to be a custom event
    const isStandardEvent = Object.values(standardEvents).includes(eventName);
    
    if (isStandardEvent) {
      // Use standard event tracking for recognized events
      (window as any).fbq('track', eventName, {
        content_name: `ad_${params.adId}`,
        content_type: params.adType,
        content_category: 'advertisement',
        ad_position: params.position,
        value: params.value,
        currency: params.currency
      });
    } else {
      // Use custom event tracking for non-standard events
      (window as any).fbq('trackCustom', eventName, {
        content_name: `ad_${params.adId}`,
        content_type: params.adType,
        content_category: 'advertisement',
        ad_position: params.position,
        value: params.value,
        currency: params.currency
      });
    }
  }

  // Google Analytics tracking
  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, {
      'ad_id': params.adId,
      'ad_type': params.adType,
      'ad_position': params.position,
      'value': params.value,
      'currency': params.currency
    });
  }

  // TikTok Pixel tracking
  if ((window as any).ttq) {
    (window as any).ttq.track(eventName, {
      content_name: `ad_${params.adId}`,
      content_type: params.adType,
      ad_position: params.position,
      value: params.value,
      currency: params.currency
    });
  }
};

// Always use standard event names from Meta's predefined list
export const trackAdImpression = (params: AdEventParams) => {
  trackAdEvent(standardEvents.VIEW_CONTENT, params);
};

export const trackAdClick = (params: AdEventParams) => {
  // Use custom event for click tracking
  trackAdEvent('AdClick', params);
};

export const trackAdConversion = (params: AdEventParams) => {
  trackAdEvent(standardEvents.PURCHASE, params);
};

export const trackAdInteraction = (params: AdEventParams) => {
  trackAdEvent(standardEvents.ADD_TO_CART, params);
}; 