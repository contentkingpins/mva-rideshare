export const adConfig = {
  meta: {
    pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    events: {
      PAGE_VIEW: 'PageView',
      VIEW_CONTENT: 'ViewContent',
      ADD_TO_CART: 'AddToCart',
      PURCHASE: 'Purchase',
      LEAD: 'Lead',
      COMPLETE_REGISTRATION: 'CompleteRegistration',
      CONTACT: 'Contact',
      CUSTOMIZE_PRODUCT: 'CustomizeProduct',
      DONATE: 'Donate',
      FIND_LOCATION: 'FindLocation',
      SCHEDULE: 'Schedule',
      START_TRIAL: 'StartTrial',
      SUBSCRIBE: 'Subscribe'
    }
  },
  google: {
    analyticsId: process.env.NEXT_PUBLIC_GA_ID,
    tagManagerId: process.env.NEXT_PUBLIC_GTM_ID,
    events: {
      PAGE_VIEW: 'page_view',
      VIEW_CONTENT: 'view_content',
      ADD_TO_CART: 'add_to_cart',
      PURCHASE: 'purchase',
      LEAD: 'generate_lead',
      COMPLETE_REGISTRATION: 'complete_registration',
      CONTACT: 'contact',
      CUSTOMIZE_PRODUCT: 'customize_product',
      DONATE: 'donate',
      FIND_LOCATION: 'find_location',
      SCHEDULE: 'schedule',
      START_TRIAL: 'start_trial',
      SUBSCRIBE: 'subscribe'
    }
  },
  tiktok: {
    pixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
    events: {
      PAGE_VIEW: 'PageView',
      VIEW_CONTENT: 'ViewContent',
      ADD_TO_CART: 'AddToCart',
      PURCHASE: 'Purchase',
      LEAD: 'Lead',
      COMPLETE_REGISTRATION: 'CompleteRegistration',
      CONTACT: 'Contact',
      CUSTOMIZE_PRODUCT: 'CustomizeProduct',
      DONATE: 'Donate',
      FIND_LOCATION: 'FindLocation',
      SCHEDULE: 'Schedule',
      START_TRIAL: 'StartTrial',
      SUBSCRIBE: 'Subscribe'
    }
  }
};

export const adSpaces = {
  header: {
    id: 'header-ad',
    size: 'banner',
    position: 'header'
  },
  sidebar: {
    id: 'sidebar-ad',
    size: 'sidebar',
    position: 'sidebar'
  },
  inContent: {
    id: 'in-content-ad',
    size: 'in-content',
    position: 'in-content'
  },
  mobile: {
    id: 'mobile-ad',
    size: 'mobile',
    position: 'mobile'
  }
};

export const adSizes = {
  banner: {
    desktop: '728x90',
    mobile: '320x50'
  },
  sidebar: {
    desktop: '300x250',
    mobile: '300x250'
  },
  inContent: {
    desktop: '728x90',
    mobile: '320x50'
  },
  mobile: {
    desktop: '728x90',
    mobile: '320x50'
  }
}; 