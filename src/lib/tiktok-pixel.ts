// TikTok Pixel TypeScript Definition
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

// Function to initialize the TikTok pixel
export const initTikTokPixel = (pixelId: string): void => {
  if (typeof window === 'undefined') return;

  // Add TikTok Pixel base code - Using TypeScript compatible IIFE syntax
  (function (w: any, d: Document, t: string) {
    const ttq = w.ttq || [];
    w.ttq = ttq;
    w.TiktokAnalyticsObject = t;
    const n = d.createElement("script");
    const s = d.getElementsByTagName("script")[0];
    n.async = true;
    n.src = 'https://analytics.tiktok.com/i18n/pixel/events.js';
    s.parentNode?.insertBefore(n, s);
    ttq.init(pixelId);
  })(window, document, 'ttq');
};

// Track a TikTok pixel event
export const trackTikTokEvent = (event: string, params?: Record<string, any>): void => {
  if (typeof window === 'undefined' || !window.ttq) return;
  
  window.ttq('track', event, params || {});
};

// Identify user with TikTok pixel
export const identifyTikTokUser = (email?: string): void => {
  if (typeof window === 'undefined' || !window.ttq) return;
  
  window.ttq('identify', email);
}; 