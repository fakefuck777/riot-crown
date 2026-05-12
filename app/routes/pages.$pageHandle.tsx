import { redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';

const PAGE_TO_PATH: Record<string, string> = {
  contact: '/legal/contact',
  'contact-us': '/legal/contact',
  faq: '/legal/contact',
  privacy: '/legal/privacy',
  'privacy-policy': '/legal/privacy',
  terms: '/legal/terms',
  'terms-of-service': '/legal/terms',
  returns: '/legal/returns',
  'shipping-returns': '/legal/returns',
};

export function loader({ params }: LoaderFunctionArgs) {
  const key = (params.pageHandle ?? '').toLowerCase();
  return redirect(PAGE_TO_PATH[key] ?? '/');
}

export default function PageHandleStub() {
  return null;
}
