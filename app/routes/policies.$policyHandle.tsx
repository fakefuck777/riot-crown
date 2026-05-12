import { redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';

const POLICY_TO_LEGAL: Record<string, string> = {
  'privacy-policy': '/legal/privacy',
  privacy: '/legal/privacy',
  'terms-of-service': '/legal/terms',
  terms: '/legal/terms',
  'refund-policy': '/legal/returns',
  'shipping-policy': '/legal/returns',
  'legal-notice': '/legal/terms',
  'subscription-policy': '/legal/terms',
};

export function loader({ params }: LoaderFunctionArgs) {
  const key = (params.policyHandle ?? '').toLowerCase();
  return redirect(POLICY_TO_LEGAL[key] ?? '/legal/privacy');
}

export default function PolicyHandleStub() {
  return null;
}
