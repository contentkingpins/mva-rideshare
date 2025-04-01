import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat, Outfit } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Script from 'next/script';
import ConsentManager from '@/components/ConsentManager';

// Make the loadFacebookPixel and loadTikTokPixel functions available globally
declare global {
  interface Window {
    loadFacebookPixel?: () => void;
    loadTikTokPixel?: () => void;
    performance?: Performance;
  }
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800'],
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const viewport: Viewport = {
  themeColor: '#1e40af',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: 'Rideshare Rights | Get Your Case Reviewed by Uber & Lyft Accident Experts',
  description: 'Have you been injured in a rideshare accident? Our expert attorneys can help you get the compensation you deserve. Get your free case review today.',
  authors: [{ name: 'Rideshare Rights' }],
  keywords: 'rideshare accident, uber accident, lyft accident, rideshare lawyer, uber lawyer, lyft lawyer, rideshare accident claim',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${outfit.variable}`}>
      <head>
        {/* Performance optimizations for connections */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.ridesharerights.com'}`} crossOrigin="anonymous" />
        <link rel="preconnect" href="https://randomuser.me" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://analytics.tiktok.com" />
        
        {/* Performance timing mark for page start */}
        <script dangerouslySetInnerHTML={{ __html: `
          performance.mark('page_start');
          
          // Preload critical fonts - load only what's needed
          const fontPreload = document.createElement('link');
          fontPreload.rel = 'preload';
          fontPreload.href = '/_next/static/media/${outfit.style.fontFamily.replace(/["']/g, '')}-latin-wght-normal.woff2';
          fontPreload.as = 'font';
          fontPreload.type = 'font/woff2';
          fontPreload.crossOrigin = 'anonymous';
          document.head.appendChild(fontPreload);
        `}} />
        
        {/* Inline critical CSS */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Critical CSS for initial render */
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { height: 100%; width: 100%; }
          body { font-family: var(--font-inter); }
          .container { width: 100%; max-width: 1280px; margin-left: auto; margin-right: auto; padding-left: 1rem; padding-right: 1rem; }
          @media (min-width: 640px) { .container { max-width: 640px; } }
          @media (min-width: 768px) { .container { max-width: 768px; } }
          @media (min-width: 1024px) { .container { max-width: 1024px; } }
          @media (min-width: 1280px) { .container { max-width: 1280px; } }
          .btn-primary { display: inline-block; background-color: #1d4ed8; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; }
          .text-white { color: white; }
          .font-bold { font-weight: 700; }
          .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
          .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
          .mb-4 { margin-bottom: 1rem; }
          .mb-8 { margin-bottom: 2rem; }
          .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
          .flex { display: flex; }
          .flex-col { flex-direction: column; }
          .relative { position: relative; }
          .absolute { position: absolute; }
          .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
          .z-0 { z-index: 0; }
          .z-10 { z-index: 10; }
          .bg-primary-900 { background-color: #1e3a8a; }
          .bg-primary-800 { background-color: #1e40af; }
          .bg-gradient-to-b { background-image: linear-gradient(to bottom, var(--tw-gradient-stops)); }
          .min-h-\[90vh\] { min-height: 90vh; }
          .w-full { width: 100%; }
          .h-full { height: 100%; }
          .from-primary-900\/20 { --tw-gradient-from: rgb(30 58 138 / 0.2); --tw-gradient-to: rgb(30 58 138 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
          .to-primary-800\/20 { --tw-gradient-to: rgb(30 64 175 / 0.2); }
          
          /* Header navigation styles */
          .mx-auto { margin-left: auto; margin-right: auto; }
          .items-center { align-items: center; }
          .justify-center { justify-content: center; }
          .justify-between { justify-content: space-between; }
          .px-5 { padding-left: 1.25rem; padding-right: 1.25rem; }
          .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
          .fixed { position: fixed; }
          .top-0 { top: 0; }
          .left-0 { left: 0; }
          .right-0 { right: 0; }
          .shadow-md { --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color); box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow); }
          .z-50 { z-index: 50; }
          
          /* Hero section initial styles */
          .leading-tight { line-height: 1.25; }
          .gap-6 { gap: 1.5rem; }
          .pb-24 { padding-bottom: 6rem; }
          .pt-16 { padding-top: 4rem; }
          .overflow-hidden { overflow: hidden; }
          .lg\:w-1\/2 { width: 50%; }
          .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
          .lg\:text-5xl { font-size: 3rem; line-height: 1; }
        ` }}/>
        
        {/* Meta tags for viewport control */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body>
        {/* Script to mark when the body starts rendering */}
        <script dangerouslySetInnerHTML={{ __html: `performance.mark('body_render');` }} />
        
        {/* Performance optimization for image loading */}
        <Script id="perf-optimizer" strategy="beforeInteractive">
          {`
            // Mark when navigation started for faster metrics
            if (window.performance && window.performance.mark) {
              window.performance.mark('navigation_start');
            }
            
            // Ensure proper CSS loading to avoid MIME type errors
            (function() {
              // Create stylesheet element with inline @import to force correct MIME type
              const styleElement = document.createElement('style');
              styleElement.textContent = '@import url("/_next/static/css/app/layout.css")';
              document.head.appendChild(styleElement);
              
              // Add CSS with correct MIME type
              const loadCSS = (href) => {
                return new Promise((resolve, reject) => {
                  const link = document.createElement('link');
                  link.rel = 'stylesheet';
                  link.type = 'text/css';
                  link.href = href;
                  link.onload = resolve;
                  link.onerror = reject;
                  document.head.appendChild(link);
                });
              };
              
              // Load CSS in priority order
              Promise.all([
                loadCSS('/_next/static/css/app/layout.css')
              ]).catch(err => {
                console.warn('CSS loading error, falling back to inline styles', err);
                // If external CSS fails, ensure basic styling works
                const fallbackStyle = document.createElement('style');
                fallbackStyle.textContent = 'body{font-family:system-ui,-apple-system,sans-serif;color:#333}';
                document.head.appendChild(fallbackStyle);
              });
            })();
            
            // Apply a solid color background immediately as fallback
            document.addEventListener('DOMContentLoaded', function() {
              const heroSection = document.querySelector('.hero-section');
              if (heroSection) {
                // Add a low-resolution solid color as immediate fallback
                const fallbackStyle = document.createElement('style');
                fallbackStyle.textContent = '.hero-section::before { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: #1e40af; z-index: -1; }';
                document.head.appendChild(fallbackStyle);
              }
            });
          `}
        </Script>
        
        {/* Navbar component */}
        <Navbar />
        
        {/* Main content */}
        <main>
          {children}
        </main>
        
        {/* Footer component */}
        <Footer />
        
        {/* Consent Manager for handling cookie preferences */}
        <ConsentManager />
        
        {/* Meta Pixel Code - Loads conditionally based on consent */}
        <Script id="facebook-pixel" strategy="lazyOnload" data-test="fb-script">
          {`
            // Defer Facebook Pixel loading until idle callback
            window.fbPixelReady = function() {
              // Only load when browser is idle
              if ('requestIdleCallback' in window) {
                window.requestIdleCallback(function() {
                  loadFacebookPixel();
                }, { timeout: 10000 });
              } else {
                setTimeout(loadFacebookPixel, 10000);
              }
            };
            
            // Actual loading logic
            const loadFacebookPixel = () => {
              if (window.fbq) return; // Already loaded
              
              // Create a lightweight version of fbq first to queue calls
              window.fbq = function() {
                if (window._fbq && window._fbq.callMethod) {
                  window._fbq.callMethod.apply(window._fbq, arguments);
                } else {
                  if (!window._fbq) window._fbq = [];
                  window._fbq.push(arguments);
                }
              };
              
              // Initialize fbq with consent handling
              (function(f,b,e,v,n,t,s){
                if(f.fbq)return;
                n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)
              })(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
              
              // Check for stored consent
              const hasConsent = localStorage.getItem('marketing_consent') === 'true';
              
              // Initialize with consent mode
              fbq('consent', hasConsent ? 'grant' : 'revoke');
              
              // Initialize with the correct Pixel ID
              fbq('init', '1718356202366164', {
                external_id: 'website_visitor_' + Math.floor(Math.random() * 10000000)
              });
              
              // Only track PageView if consent is granted
              if (hasConsent) {
                fbq('track', 'PageView');
              }
            };
            
            // Make this function available globally for the ConsentManager
            window.loadFacebookPixel = loadFacebookPixel;

            // Only load after page is fully loaded and user has interacted
            if (document.readyState === 'complete') {
              window.fbPixelReady();
            } else {
              window.addEventListener('load', function() {
                // Add with delay to prevent layout shift
                setTimeout(window.fbPixelReady, 2000);
              });
            }
          `}
        </Script>

        {/* TikTok Pixel - load with low priority */}
        <Script id="tiktok-pixel" strategy="lazyOnload">
          {`
            // Only load TikTok pixel after user interaction and when browser is idle
            const loadTikTokPixel = () => {
              const tikTokScript = document.createElement('script');
              tikTokScript.defer = true;
              tikTokScript.async = true;
              tikTokScript.src = "https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=CG702TBC77U5VTCL7T50";
              
              document.body.appendChild(tikTokScript);
              
              tikTokScript.onload = function() {
                if (window.ttq) {
                  window.ttq.page();
                }
              };
            };
            
            // Initialize TikTok object before loading script
            window.TiktokAnalyticsObject = 'ttq';
            window.ttq = window.ttq || [];
            
            // Helper function to add methods
            window.ttq.methods = ["page", "track", "identify", "instances"];
            window.ttq.setAndDefer = function(t, e) {
              t[e] = function() { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) }
            };
            for(var i = 0; i < window.ttq.methods.length; i++) {
              window.ttq.setAndDefer(window.ttq, window.ttq.methods[i]);
            }
            
            // Only load after user interaction and when browser is idle
            let hasInteracted = false;
            const events = ['click', 'scroll', 'keydown', 'mousemove', 'touchstart'];
            
            const onUserInteraction = () => {
              if (!hasInteracted) {
                hasInteracted = true;
                
                // Remove all listeners after first interaction
                events.forEach(e => window.removeEventListener(e, onUserInteraction));
                
                if ('requestIdleCallback' in window) {
                  window.requestIdleCallback(() => loadTikTokPixel(), { timeout: 5000 });
                } else {
                  setTimeout(loadTikTokPixel, 5000);
                }
              }
            };
            
            // Add interaction listeners
            events.forEach(e => window.addEventListener(e, onUserInteraction, { passive: true }));
            
            // Add a timeout fallback
            setTimeout(() => {
              if (!hasInteracted) onUserInteraction();
            }, 15000);
          `}
        </Script>
        
        {/* Performance timing marker for page end */}
        <script dangerouslySetInnerHTML={{ __html: `
          window.addEventListener('load', function() {
            performance.mark('page_fully_loaded');
            performance.measure('page_load_time', 'page_start', 'page_fully_loaded');
            
            // Log performance metrics to console in development
            if (process.env.NODE_ENV === 'development') {
              const loadMetric = performance.getEntriesByName('page_load_time')[0];
              console.log('Total page load time:', loadMetric.duration);
            }
          });
        `}} />
      </body>
    </html>
  );
}