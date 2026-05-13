/** Canonical Online Store policy URLs for `your-shop.myshopify.com`. */
export function shopifyPolicyUrl(storeDomain: string, policyHandle: string): string {
  const host = storeDomain.trim().toLowerCase();
  const handle = policyHandle.replace(/[^a-z0-9-]/gi, '');
  return `https://${host}/policies/${handle}`;
}
