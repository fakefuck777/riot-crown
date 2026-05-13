import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { json, redirect } from '@shopify/remix-oxygen';
import * as Search from './search';
import { localeFromUrlSlug } from '~/lib/localePath';
import { serializeLocaleCookie } from '~/lib/localeCookie';

export const meta = Search.meta;

export async function loader(args: LoaderFunctionArgs) {
  const loc = localeFromUrlSlug(args.params.locale?.toLowerCase());
  if (!loc) throw redirect('/search');
  const secure = new URL(args.request.url).protocol === 'https:';
  return json(
    {},
    { headers: { 'Set-Cookie': serializeLocaleCookie(loc, secure) } },
  );
}

export default Search.default;
