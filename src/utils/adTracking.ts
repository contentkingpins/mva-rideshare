interface AdEventParams {
  adId: string;
  adType: string;
  position?: string;
  value?: number;
  currency?: string;
}

export const trackAdEvent = (eventName: string, params: AdEventParams) => {
  if (typeof window === 'undefined') return;

  // Meta Pixel tracking
  if ((window as any).fbq) {
    (window as any).fbq('track', eventName, {
      content_name: `ad_${params.adId}`,
      content_type: params.adType,
      ad_position: params.position,
      value: params.value,
      currency: params.currency
    });
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

export const trackAdImpression = (params: AdEventParams) => {
  trackAdEvent('ViewContent', params);
};

export const trackAdClick = (params: AdEventParams) => {
  trackAdEvent('Click', params);
};

export const trackAdConversion = (params: AdEventParams) => {
  trackAdEvent('Purchase', params);
};

export const trackAdInteraction = (params: AdEventParams) => {
  trackAdEvent('AddToCart', params);
}; 