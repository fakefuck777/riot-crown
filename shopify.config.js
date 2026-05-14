import {defineConfig} from '@shopify/hydrogen/config';
import {CookieSessionStorage} from '@shopify/hydrogen';

export default defineConfig({
  storefront: {
    id: process.env.PUBLIC_STOREFRONT_ID,
    domain: process.env.PUBLIC_STORE_DOMAIN,
    storefrontToken: process.env.PUBLIC_STOREFRONT_API_TOKEN,
  },
  session: CookieSessionStorage('__session', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 60 * 60 * 24 * 30,
  }),
});
