// Analytics event tracking for TikTok, Meta, Google

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, data?: Record<string, unknown>) => void;
    fbq?: (command: string, eventName: string, data?: Record<string, unknown>) => void;
    ttq?: {
      track: (eventName: string, data?: Record<string, unknown>) => void;
    };
  }
}

export type AnalyticsEvent =
  | 'view_item'
  | 'view_item_list'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'view_cart'
  | 'begin_checkout'
  | 'add_payment_info'
  | 'purchase'
  | 'view_3d_model'
  | 'switch_material'
  | 'try_ar'
  | 'add_to_wishlist'
  | 'share_product'
  | 'member_tier_unlock'
  | 'email_captured';

interface EventData {
  [key: string]: unknown;
}

export function trackEvent(eventName: AnalyticsEvent, data?: EventData) {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, data);
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, data);
  }

  // TikTok Pixel
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track(eventName, data);
  }

  // Console log for development
  if (process.env.NODE_ENV === 'development') {
  }
}

export function trackPageView(pageName: string) {
  trackEvent('view_item_list', {
    items: [{ item_name: pageName }],
  });
}

export function trackProductView(productId: string, productName: string, price: number) {
  trackEvent('view_item', {
    items: [
      {
        item_id: productId,
        item_name: productName,
        price: price,
        item_category: 'jewelry',
      },
    ],
  });
}

export function trackAddToCart(productId: string, productName: string, price: number, quantity: number = 1) {
  trackEvent('add_to_cart', {
    items: [
      {
        item_id: productId,
        item_name: productName,
        price: price,
        quantity: quantity,
      },
    ],
  });
}

export function track3DModelView(productId: string, productName: string) {
  trackEvent('view_3d_model', {
    product_id: productId,
    product_name: productName,
  });
}

export function trackMaterialSwitch(productId: string, material: string) {
  trackEvent('switch_material', {
    product_id: productId,
    material: material,
  });
}

export function trackARTryOn(productId: string, productName: string) {
  trackEvent('try_ar', {
    product_id: productId,
    product_name: productName,
  });
}

export function trackWishlistAdd(productId: string, productName: string) {
  trackEvent('add_to_wishlist', {
    product_id: productId,
    product_name: productName,
  });
}

export function trackMemberTierUnlock(tier: string, totalSpent: number) {
  trackEvent('member_tier_unlock', {
    tier: tier,
    total_spent: totalSpent,
  });
}

export function trackEmailCapture(email: string) {
  trackEvent('email_captured', {
    email: email,
  });
}
