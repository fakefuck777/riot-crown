import { redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { shopifyPolicyUrl } from '~/lib/shopifyPolicyUrls';

const POLICY_HANDLE: Record<string, string> = {
  'privacy-policy':   'privacy-policy',
  privacy:            'privacy-policy',
  'terms-of-service': 'terms-of-service',
  terms:              'terms-of-service',
  'refund-policy':    'refund-policy',
  'shipping-policy':  'shipping-policy',
  'legal-notice':     'legal-notice',
  'subscription-policy': 'terms-of-service',
};

export function loader({ params, context }: LoaderFunctionArgs) {
  const domain =
    (context as { env?: { PUBLIC_STORE_DOMAIN?: string } }).env?.PUBLIC_STORE_DOMAIN?.trim() ?? '';
  if (!domain) return redirect('/');

  const key = (params.policyHandle ?? '').toLowerCase();
  const handle = POLICY_HANDLE[key] ?? 'privacy-policy';
  return redirect(shopifyPolicyUrl(domain, handle));
}

export default function PolicyHandleStub() {
  return null;
}
