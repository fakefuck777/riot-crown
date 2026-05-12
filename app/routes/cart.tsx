import { redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';

/** Hydrogen standard route — cart UI lives in-app (`CartDrawer`); keep URL stable for platform links. */
export function loader(_args: LoaderFunctionArgs) {
  return redirect('/');
}

export default function CartRouteStub() {
  return null;
}
