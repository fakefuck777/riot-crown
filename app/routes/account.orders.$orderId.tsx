import { redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { shopifyStorefrontOrigin } from '~/lib/shopifyStoreBaseUrl';

export function loader({ context, params }: LoaderFunctionArgs) {
  const origin = shopifyStorefrontOrigin(context);
  const id = params.orderId;
  if (origin && id) return redirect(`${origin}/account/orders/${encodeURIComponent(id)}`);
  return redirect('/');
}

export default function AccountOrderStub() {
  return null;
}
