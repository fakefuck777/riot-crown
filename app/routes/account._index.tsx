import { redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { shopifyStorefrontOrigin } from '~/lib/shopifyStoreBaseUrl';

export function loader({ context }: LoaderFunctionArgs) {
  const origin = shopifyStorefrontOrigin(context);
  if (origin) return redirect(`${origin}/account`);
  return redirect('/');
}

export default function AccountIndexStub() {
  return null;
}
