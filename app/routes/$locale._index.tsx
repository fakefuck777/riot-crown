import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { redirect } from '@shopify/remix-oxygen';
import * as Index from './_index';
import { localeFromUrlSlug } from '~/lib/localePath';
import { serializeLocaleCookie } from '~/lib/localeCookie';

export const meta = Index.meta;

function appendSetCookie(res: Response, cookie: string): Response {
  const headers = new Headers(res.headers);
  headers.append('Set-Cookie', cookie);
  return new Response(res.body, { status: res.status, headers });
}

export async function loader(args: LoaderFunctionArgs) {
  const loc = localeFromUrlSlug(args.params.locale?.toLowerCase());
  if (!loc) throw redirect('/');
  const inner = await Index.loader(args);
  if (!(inner instanceof Response)) return inner;
  const secure = new URL(args.request.url).protocol === 'https:';
  return appendSetCookie(inner, serializeLocaleCookie(loc, secure));
}

export default Index.default;
