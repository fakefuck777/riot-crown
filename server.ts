import {
  createRequestHandler,
  storefrontRedirect,
  createStorefrontClient,
  createCartHandler,
  cartGetIdDefault,
  cartSetIdDefault,
} from '@shopify/hydrogen';
import { getStorefrontHeaders } from '~/lib/storefrontHeaders';
import { getStorefrontI18n, resolveStorefrontI18nForRequest } from '~/lib/storefrontI18n';
import type {ServerBuild} from '@remix-run/server-runtime';
import {
  createCookieSessionStorage,
  type SessionStorage,
  type Session,
} from '@shopify/remix-oxygen';
import * as remixBuild from 'virtual:remix/server-build';

/**
 * When `true`: Hydrogen `i18n` is fixed to EN+US (ignores URL locale / `riot_locale` / session for Storefront).
 * Catalog GraphQL here has no `@inContext`, but cart built-ins still inject `$country`/`$language` — this flattens that context.
 * Set back to `false` after debugging Markets vs. API.
 */
const STOREFRONT_I18N_DEBUG_FLAT_EN_US = true;

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

function warnIfStorefrontPublicTokenLooksWrong(publicToken: string, hasPrivateToken: boolean): void {
  const t = publicToken.trim();
  if (!t) return;
  // shpat_ = Admin API token; shpa = older Admin API token format — both are wrong for Storefront API
  const isAdminToken = t.startsWith('shpat_') || t.startsWith('shpa');
  if (isAdminToken) {
    const level = hasPrivateToken ? 'warn' : 'error';
    console[level](
      '[storefront] PUBLIC_STOREFRONT_API_TOKEN looks like a Shopify Admin API token (' + t.slice(0, 6) + '…). ' +
        'This will cause Storefront API requests to be rejected (403/empty results). ' +
        'Go to Shopify Admin → Apps → Develop apps → your Headless/Hydrogen app → API credentials → ' +
        '"Storefront API access token" (starts with a different prefix, e.g. 2b10…). ' +
        (hasPrivateToken ? 'PRIVATE_STOREFRONT_API_TOKEN is set so GraphQL uses that — but fix PUBLIC too.' : ''),
    );
  }
}

function logStorefrontAuthModeOnce(privateTok: string, publicTok: string): void {
  const g = globalThis as { __riotStorefrontAuthLogged?: boolean };
  if (g.__riotStorefrontAuthLogged) return;
  g.__riotStorefrontAuthLogged = true;
  if (privateTok) {
    console.log(
      '[storefront] Storefront GraphQL uses PRIVATE_STOREFRONT_API_TOKEN (Shopify-Storefront-Private-Token).',
    );
  } else if (publicTok) {
    console.log('[storefront] Storefront GraphQL uses PUBLIC_STOREFRONT_API_TOKEN (X-Shopify-Storefront-Access-Token).');
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

      let privateTok = (env.PRIVATE_STOREFRONT_API_TOKEN ?? '').trim();
      const publicTok = (env.PUBLIC_STOREFRONT_API_TOKEN ?? '').trim();
      const storeDomain = normalizeStoreDomain(env.PUBLIC_STORE_DOMAIN ?? '');

      // If private token looks like an Admin API token (shpat_), disable it and use public token instead
      if (privateTok.startsWith('shpat_')) {
        console.warn(
          '[storefront] PRIVATE_STOREFRONT_API_TOKEN starts with "shpat_" — this is an Admin API token, not a Storefront API token. Disabling it and using PUBLIC_STOREFRONT_API_TOKEN instead.',
        );
        privateTok = '';
      }

      if (!storeDomain.includes('mock.shop') && !privateTok && !publicTok) {
        console.error(
          '[storefront] Missing both PRIVATE_STOREFRONT_API_TOKEN and PUBLIC_STOREFRONT_API_TOKEN — Storefront API calls will fail.',
        );
      }

      warnIfStorefrontPublicTokenLooksWrong(env.PUBLIC_STOREFRONT_API_TOKEN ?? '', Boolean(privateTok));
      logStorefrontAuthModeOnce(privateTok, publicTok);

      // Diagnostic: log the first 6 chars of whichever token will be used for Storefront requests.
      // Private token → Shopify-Storefront-Private-Token header; public → X-Shopify-Storefront-Access-Token.
      const activeTokenPreview = privateTok
        ? `PRIVATE:${privateTok.slice(0, 6)}…`
        : publicTok
          ? `PUBLIC:${publicTok.slice(0, 6)}…`
          : 'NONE';
      console.log('[storefront] active token mode:', activeTokenPreview);

      if (publicTok && publicTok.startsWith('shpa')) {
        console.error(
          '[storefront] CRITICAL: PUBLIC_STOREFRONT_API_TOKEN starts with "shpa" — this is a Shopify Admin API token, NOT a Storefront API token. ' +
          'Go to Shopify Admin → Apps → Develop apps → your Headless app → API credentials → Storefront API access token.',
        );
      }

      const i18n = STOREFRONT_I18N_DEBUG_FLAT_EN_US
        ? getStorefrontI18n({ PUBLIC_STOREFRONT_LANGUAGE: 'EN', PUBLIC_STOREFRONT_COUNTRY: 'US' })
        : resolveStorefrontI18nForRequest(request, env, session);

      const { storefront } = createStorefrontClient({
        cache,
        waitUntil,
        i18n,
        // When PRIVATE_STOREFRONT_API_TOKEN is set, Hydrogen uses Shopify-Storefront-Private-Token header.
        // publicStorefrontToken must ONLY be the Storefront API public token (starts with 2b10 / similar),
        // NEVER the Admin API token (shpat_ / shpa). If only a private token is available, pass empty string
        // for publicStorefrontToken so Hydrogen does not accidentally send the private token as a public header.
        ...(privateTok ? { privateStorefrontToken: privateTok } : {}),
        publicStorefrontToken: publicTok || '',
        storeDomain,
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
  /** Storefront API public access token (optional if `PRIVATE_STOREFRONT_API_TOKEN` is set). */
  PUBLIC_STOREFRONT_API_TOKEN?: string;
  /**
   * Storefront API private access token (Oxygen). When set, Hydrogen uses
   * `Shopify-Storefront-Private-Token` for server-side GraphQL.
   */
  PRIVATE_STOREFRONT_API_TOKEN?: string;
  PUBLIC_STORE_DOMAIN: string;
  PUBLIC_CHECKOUT_DOMAIN?: string;
  PUBLIC_STOREFRONT_LANGUAGE?: string;
  PUBLIC_STOREFRONT_COUNTRY?: string;
  /** Home / search / sitemap: use this collection handle; if unset or missing, uses all published products. */
  PUBLIC_HOME_COLLECTION_HANDLE?: string;
}
