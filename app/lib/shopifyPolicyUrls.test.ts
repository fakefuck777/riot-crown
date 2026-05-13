import { describe, it, expect } from 'vitest';
import { shopifyPolicyUrl } from './shopifyPolicyUrls';

describe('shopifyPolicyUrl', () => {
  it('builds Online Store policy URL', () => {
    expect(shopifyPolicyUrl('riot.myshopify.com', 'privacy-policy')).toBe(
      'https://riot.myshopify.com/policies/privacy-policy',
    );
  });

  it('strips unsafe characters from handle', () => {
    expect(shopifyPolicyUrl('x.myshopify.com', 'privacy-policy"><')).toBe(
      'https://x.myshopify.com/policies/privacy-policy',
    );
  });
});
