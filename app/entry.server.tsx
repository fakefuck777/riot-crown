import {RemixServer} from '@remix-run/react';
import {isbot} from 'isbot';
// Use the browser/worker-compatible SSR build — avoids Node's util.TextEncoder
// which is unavailable in the MiniOxygen Web Worker sandbox.
import {renderToReadableStream} from 'react-dom/server.browser';
import type {EntryContext, AppLoadContext} from '@shopify/remix-oxygen';
import {applySecurityHeaders} from '~/lib/securityHeaders';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  _context: AppLoadContext,
) {
  const body = await renderToReadableStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  applySecurityHeaders(responseHeaders, {
    enableHsts: process.env.NODE_ENV === 'production',
    enableCsp: process.env.NODE_ENV === 'production',
  });

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
