import {
  createRequestHandler,
  storefrontRedirect,
  createStorefrontClient,
  createCartHandler,
  cartGetIdDefault,
  cartSetIdDefault,
} from '@shopify/hydrogen';
import { getStorefrontHeaders } from '~/lib/storefrontHeaders';
import { resolveStorefrontI18nForRequest } from '~/lib/storefrontI18n';
import type {ServerBuild} from '@remix-run/server-runtime';
import {
  createCookieSessionStorage,
  type SessionStorage,
  type Session,
} from '@shopify/remix-oxygen';
import * as remixBuild from 'virtual:remix/server-build';

/** `createStorefrontClient` expects the shop’s `*.myshopify.com` host, not a customer-facing custom domain. */
function normalizeStoreDomain(raw: string): string {
  return raw.trim().replace(/^https?:\/\//i, '').split('/')[0] ?? '';
}

function warnIfStoreDomainIsNotMyshopify(storeDomain: string): void {
  const host = normalizeStoreDomain(storeDomain).toLowerCase();
  if (!host || host === 'mock.shop') return;
  if (!host.endsWith('.myshopify.com')) {
    console.warn(
      '[storefront] PUBLIC_STORE_DOMAIN should be your-store.myshopify.com (from Shopify admin), not a custom domain. Current value:',
      host,
    );
  }
}

export default {
  async fetch(
    request: Request,
    env: HydrogenWorkerEnv,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      const waitUntil = executionContext.waitUntil.bind(executionContext);
      const [cache, session] = await Promise.all([
        caches.open('hydrogen'),
        HydrogenSession.init(request, [env.SESSION_SECRET]),
      ]);

      warnIfStoreDomainIsNotMyshopify(env.PUBLIC_STORE_DOMAIN ?? '');

      const i18n = resolveStorefrontI18nForRequest(request, env, session);

      const {storefront} = createStorefrontClient({
        cache,
        waitUntil,
        i18n,
        // Oxygen: `PUBLIC_STOREFRONT_API_TOKEN` + `PUBLIC_STORE_DOMAIN` (myshopify.com only — see .env.example).
        publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
        storeDomain: normalizeStoreDomain(env.PUBLIC_STORE_DOMAIN ?? ''),
        storefrontHeaders: getStorefrontHeaders(request),
      });

      const cart = createCartHandler({
        storefront,
        getCartId: cartGetIdDefault(request.headers),
        setCartId: cartSetIdDefault(),
      });

      const handleRequest = createRequestHandler({
        build: remixBuild as unknown as ServerBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => ({session, storefront, cart, env, waitUntil}),
      });

      const response = await handleRequest(request);

      if (response.status === 404) {
        return storefrontRedirect({request, response, storefront});
      }

      return response;
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};

export class HydrogenSession {
  public isPending = false;

  static async init(request: Request, secrets: string[]) {
    const storage = createCookieSessionStorage({
      cookie: {
        name: 'session',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets,
      },
    });
    const session = await storage.getSession(request.headers.get('Cookie'));
    return new HydrogenSession(storage, session);
  }

  constructor(
    private sessionStorage: SessionStorage,
    private session: Session,
  ) {}

  get(key: string) { return this.session.get(key); }
  destroy() { return this.sessionStorage.destroySession(this.session); }
  flash(key: string, value: unknown) { this.session.flash(key, value); }
  unset(key: string) { this.isPending = true; this.session.unset(key); }
  set(key: string, value: unknown) { this.isPending = true; this.session.set(key, value); }
  commit() { return this.sessionStorage.commitSession(this.session); }
}

interface HydrogenWorkerEnv {
  SESSION_SECRET: string;
  PUBLIC_STOREFRONT_API_TOKEN: string;
  PUBLIC_STORE_DOMAIN: string;
  PUBLIC_CHECKOUT_DOMAIN?: string;
  PUBLIC_STOREFRONT_LANGUAGE?: string;
  PUBLIC_STOREFRONT_COUNTRY?: string;
  /** Home / search / sitemap: use this collection handle; if unset or missing, uses all published products. */
  PUBLIC_HOME_COLLECTION_HANDLE?: string;
}
