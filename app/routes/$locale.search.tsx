import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { redirect } from '@shopify/remix-oxygen';
import * as Search from './search';
import { localeFromUrlSlug } from '~/lib/localePath';
import { serializeLocaleCookie } from '~/lib/localeCookie';

export const meta = Search.meta;

export async function loader(args: LoaderFunctionArgs) {
  const loc = localeFromUrlSlug(args.params.locale?.toLowerCase());
  if (!loc) throw redirect('/search');
  const secure = new URL(args.request.url).protocol === 'https:';
  const inner = await Search.loader(args);
  if (!(inner instanceof Response)) {
    return { ...inner, headers: { 'Set-Cookie': serializeLocaleCookie(loc, secure) } };
  }
  const headers = new Headers(inner.headers);
  headers.append('Set-Cookie', serializeLocaleCookie(loc, secure));
  return new Response(inner.body, { status: inner.status, headers });
}

export default Search.default;
