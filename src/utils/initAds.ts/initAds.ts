   // Meta Pixel initialization utility

   // Define the proper window extension for Facebook Pixel
   declare global {
     interface Window {
       fbq: (
         method: string, 
         eventName: string, 
         params?: Record<string, any>
       ) => void & {
         callMethod?: (...args: any[]) => void;
         push: (...args: any[]) => void;
         queue: any[];
         loaded: boolean;
         version: string;
       };
     }
   }

   /**
    * Initialize Meta Pixel (formerly Facebook Pixel)
    * @param pixelId - The Meta Pixel ID to initialize
    */
   export const initializeMetaPixel = (pixelId: string) => {
     if (typeof window === 'undefined') return;
     
     // Initialize the pixel if not already loaded
     if (!window.fbq) {
       window.fbq = function() {
         // @ts-ignore - This is the Facebook standard initialization
         window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments);
       };
       
       if (!window._fbq) window._fbq = window.fbq;
       window.fbq.push = window.fbq;
       window.fbq.loaded = true;
       window.fbq.version = '2.0';
       window.fbq.queue = [];
     }
     
     // Load the pixel script
     const script = document.createElement('script');
     script.async = true;
     script.src = `https://connect.facebook.net/en_US/fbevents.js`;
     
     const firstScript = document.getElementsByTagName('script')[0];
     firstScript.parentNode?.insertBefore(script, firstScript);
     
     // Initialize the pixel
     window.fbq('init', pixelId);
     window.fbq('track', 'PageView');
     
     // Log in development
     if (process.env.NODE_ENV === 'development') {
       console.log(`[Meta Pixel] Initialized with ID: ${pixelId}`);
     }
   };

   export default initializeMetaPixel;