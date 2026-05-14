// TikTok Pixel tracking utility
// Initialize with your TikTok Pixel ID from environment

export interface TikTokPixelConfig {
  pixelId: string;
  enabled?: boolean;
}

export interface TikTokEvent {
  event: 'PageView' | 'ViewContent' | 'AddToCart' | 'Purchase' | 'InitiateCheckout' | 'CompletePayment';
  data?: Record<string, unknown>;
}

class TikTokPixelTracker {
  private pixelId: string;
  private enabled: boolean;
  private initialized: boolean = false;

  constructor(config: TikTokPixelConfig) {
    this.pixelId = config.pixelId;
    this.enabled = config.enabled !== false;
  }

  init() {
    if (this.initialized || !this.enabled || typeof window === 'undefined') return;

    // Load TikTok Pixel script
    const script = document.createElement('script');
    script.src = 'https://analytics.tiktok.com/i18n/pixel/sdk.js?sdkid=' + this.pixelId;
    script.async = true;
    document.head.appendChild(script);

    // Initialize TikTok Pixel
    script.onload = () => {
      const ttqWindow = window as unknown as { ttq?: { track: (event: string, data?: Record<string, unknown>) => void } };
      if (ttqWindow.ttq) {
        ttqWindow.ttq.track('PageView');
      }
    };

    this.initialized = true;
  }

  track(event: TikTokEvent) {
    if (!this.enabled || typeof window === 'undefined') return;

    const ttqWindow = window as unknown as { ttq?: { track: (event: string, data?: Record<string, unknown>) => void } };
    if (ttqWindow.ttq) {
      ttqWindow.ttq.track(event.event, event.data || {});
    } else {
      console.warn('[TikTok Pixel] Not initialized yet');
    }
  }

  trackPageView() {
    this.track({ event: 'PageView' });
  }

  trackViewContent(productId: string, productName: string, price: number) {
    this.track({
      event: 'ViewContent',
      data: {
        content_id: productId,
        content_name: productName,
        content_type: 'product',
        value: price,
        currency: 'USD',
      },
    });
  }

  trackAddToCart(productId: string, productName: string, price: number, quantity: number = 1) {
    this.track({
      event: 'AddToCart',
      data: {
        content_id: productId,
        content_name: productName,
        content_type: 'product',
        value: price * quantity,
        currency: 'USD',
        quantity,
      },
    });
  }

  trackInitiateCheckout(cartValue: number, itemCount: number) {
    this.track({
      event: 'InitiateCheckout',
      data: {
        value: cartValue,
        currency: 'USD',
        num_items: itemCount,
      },
    });
  }

  trackPurchase(orderId: string, cartValue: number, itemCount: number) {
    this.track({
      event: 'Purchase',
      data: {
        content_id: orderId,
        value: cartValue,
        currency: 'USD',
        num_items: itemCount,
      },
    });
  }

  trackCompletePayment(orderId: string, cartValue: number) {
    this.track({
      event: 'CompletePayment',
      data: {
        content_id: orderId,
        value: cartValue,
        currency: 'USD',
      },
    });
  }
}

// Singleton instance
let tiktokPixel: TikTokPixelTracker | null = null;

export function initTikTokPixel(config: TikTokPixelConfig) {
  if (!tiktokPixel) {
    tiktokPixel = new TikTokPixelTracker(config);
    tiktokPixel.init();
  }
  return tiktokPixel;
}

export function getTikTokPixel(): TikTokPixelTracker | null {
  return tiktokPixel;
}

export function trackTikTokEvent(event: TikTokEvent) {
  if (tiktokPixel) {
    tiktokPixel.track(event);
  }
}
