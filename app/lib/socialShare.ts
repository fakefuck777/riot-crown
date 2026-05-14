'use client';

export interface ShareConfig {
  productId: string;
  productName: string;
  discountCode?: string;
  discountPercent?: number;
}

export function generateDiscountCode(productId: string): string {
  return `RIOT${productId.toUpperCase().slice(0, 4)}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

export function generateShareLinks(config: ShareConfig) {
  const code = config.discountCode || generateDiscountCode(config.productId);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const productUrl = `${baseUrl}/products/${config.productId}?ref=share&code=${code}`;
  const encodedUrl = encodeURIComponent(productUrl);
  const encodedText = encodeURIComponent(
    `我发现了 RIOT CROWN 的限量珍珠 ${config.productName}。用我的折扣码 ${code} 获得 ${config.discountPercent || 10}% 折扣！`
  );

  return {
    code,
    tiktok: `https://www.tiktok.com/share/video?url=${encodedUrl}`,
    instagram: `https://www.instagram.com/share?url=${encodedUrl}`,
    xiaohongshu: `https://www.xiaohongshu.com/share?url=${encodedUrl}&text=${encodedText}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
  };
}

export function openShareWindow(url: string, platform: string) {
  if (platform === 'xiaohongshu') {
    navigator.clipboard.writeText(url);
    alert('分享链接已复制！请在小红书中粘贴');
  } else {
    window.open(url, '_blank', 'width=600,height=400');
  }
}

export const platformConfig = {
  tiktok: {
    label: 'TikTok',
    icon: '🎵',
    color: '#000000',
    hoverColor: '#25F4EE',
  },
  instagram: {
    label: 'Instagram',
    icon: '📷',
    color: '#E4405F',
    hoverColor: '#FF1D77',
  },
  xiaohongshu: {
    label: '小红书',
    icon: '✨',
    color: '#FF2B2B',
    hoverColor: '#FF5555',
  },
  twitter: {
    label: 'Twitter',
    icon: '𝕏',
    color: '#000000',
    hoverColor: '#1DA1F2',
  },
  whatsapp: {
    label: 'WhatsApp',
    icon: '💬',
    color: '#25D366',
    hoverColor: '#34A853',
  },
};

