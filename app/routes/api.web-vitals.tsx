import type { ActionFunctionArgs } from '@shopify/remix-oxygen';

/**
 * Ingest Web Vitals from the browser (sendBeacon / fetch).
 * Enable server logging with DEBUG_WEB_VITALS=1 in Oxygen / Node env.
 */
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return new Response(null, { status: 405 });
  }
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    if (process.env.DEBUG_WEB_VITALS === '1') {
      console.info('[web-vitals]', JSON.stringify(payload));
    }
  } catch {
    /* ignore malformed body */
  }
  return new Response(null, { status: 204 });
}
