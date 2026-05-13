import { redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { shopifyPolicyUrl } from '~/lib/shopifyPolicyUrls';

export function loader({ params, context }: LoaderFunctionArgs) {
  const key = (params.pageHandle ?? '').toLowerCase();
  const domain =
    (context as { env?: { PUBLIC_STORE_DOMAIN?: string } }).env?.PUBLIC_STORE_DOMAIN?.trim() ?? '';

  if (['contact', 'contact-us', 'faq'].includes(key)) {
    return redirect('/');
  }

  if (!domain) return redirect('/');

  switch (key) {
    case 'privacy':
    case 'privacy-policy':
      return redirect(shopifyPolicyUrl(domain, 'privacy-policy'));
    case 'terms':
    case 'terms-of-service':
      return redirect(shopifyPolicyUrl(domain, 'terms-of-service'));
    case 'returns':
    case 'shipping-returns':
      return redirect(shopifyPolicyUrl(domain, 'refund-policy'));
    default:
      return redirect('/');
  }
}

export default function PageHandleStub() {
  return null;
}
