interface AdConfig {
  metaPixelId?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  tiktokPixelId?: string;
}

interface MetaPixelWindow extends Window {
  fbq: any;
  _fbq: any;
}

interface GoogleWindow extends Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
}

interface TikTokWindow extends Window {
  ttq: any;
  TiktokAnalyticsObject: string;
}

export const initAds = (config: AdConfig) => {
  if (typeof window === 'undefined') return;

  // Cast window to our custom type
  const w = window as unknown as MetaPixelWindow & GoogleWindow & TikTokWindow;

  // Initialize Meta Pixel
  if (config.metaPixelId) {
    if (!w.fbq) {
      w.fbq = function() {
        const n = w.fbq;
        if (n.callMethod) {
          n.callMethod.apply(n, arguments);
        } else {
          n.queue.push(arguments);
        }
      };
      w._fbq = w.fbq;
      w.fbq.push = w.fbq;
      w.fbq.loaded = true;
      w.fbq.version = '2.0';
      w.fbq.queue = [];

      const t = document.createElement('script') as HTMLScriptElement;
      t.async = true;
      t.src = 'https://connect.facebook.net/en_US/fbevents.js';
      const s = document.getElementsByTagName('script')[0];
      s.parentNode?.insertBefore(t, s);
    }
    
    w.fbq('init', config.metaPixelId);
  }

  // Initialize Google Analytics
  if (config.googleAnalyticsId) {
    w.dataLayer = w.dataLayer || [];
    w.gtag = function(...args: any[]) {
      w.dataLayer.push(arguments);
    };
    w.gtag('js', new Date());
    w.gtag('config', config.googleAnalyticsId);
    
    // Load Google Analytics script
    const script = document.createElement('script') as HTMLScriptElement;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsId}`;
    document.head.appendChild(script);
  }

  // Initialize Google Tag Manager
  if (config.googleTagManagerId) {
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'startTime':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s) as HTMLScriptElement,dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode?.insertBefore(j,f);
    })(window,document,'script','dataLayer',config.googleTagManagerId);
  }

  // Initialize TikTok Pixel
  if (config.tiktokPixelId) {
    w.TiktokAnalyticsObject = 'ttq';
    w.ttq = w.ttq || function(){(w.ttq.q = w.ttq.q || []).push(arguments)};
    
    const js = document.createElement('script') as HTMLScriptElement;
    js.async = true;
    js.src = 'https://analytics.tiktok.com/i18n/pixel/events.js';
    
    // Handle script loading
    const handleLoad = () => {
      w.ttq('init', config.tiktokPixelId);
      w.ttq('track', 'PageView');
    };
    
    if (js.readyState === 'complete' || js.readyState === 'loaded') {
      handleLoad();
    } else {
      js.onload = handleLoad;
    }
    
    const os = document.getElementsByTagName('script')[0];
    os.parentNode?.insertBefore(js, os);
    
    w.ttq('init', config.tiktokPixelId);
    w.ttq('track', 'PageView');
  }
}; 