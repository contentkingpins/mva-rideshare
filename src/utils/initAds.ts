interface AdConfig {
  metaPixelId?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  tiktokPixelId?: string;
}

interface MetaPixelWindow extends Window {
  fbq: {
    callMethod?: (...args: any[]) => void;
    push: (...args: any[]) => void;
    queue: any[];
    loaded: boolean;
    version: string;
  };
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

export function initAds(config: AdConfig) {
  if (typeof window === 'undefined') return;

  const metaWindow = window as unknown as MetaPixelWindow;
  const googleWindow = window as unknown as GoogleWindow;
  const tiktokWindow = window as unknown as TikTokWindow;

  // Initialize Meta Pixel
  if (config.metaPixelId) {
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode?.insertBefore(t,s)}(window, document, 'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    metaWindow.fbq.push('init', config.metaPixelId);
  }

  // Initialize Google Analytics
  if (config.googleAnalyticsId) {
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', config.googleAnalyticsId);
    googleWindow.gtag = gtag;
  }

  // Initialize Google Tag Manager
  if (config.googleTagManagerId) {
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'startTime':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s) as HTMLScriptElement,dl=l!='dataLayer'?'&l='+l:'';
    j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
    f.parentNode?.insertBefore(j,f);
    })(window, document, 'script', 'dataLayer', config.googleTagManagerId);
  }

  // Initialize TikTok Pixel
  if (config.tiktokPixelId) {
    !function (w, d, t) {
      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode?.insertBefore(o,a)};
            ttq.load(config.tiktokPixelId);
            ttq.page();
          }(window, document, 'ttq');
  }
} 