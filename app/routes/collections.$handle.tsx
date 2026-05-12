import { redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';

export function loader(_args: LoaderFunctionArgs) {
  return redirect('/');
}

export default function CollectionHandleStub() {
  return null;
}
