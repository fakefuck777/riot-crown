/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_GA_MEASUREMENT_ID?: string;
}

declare module 'react-dom/server.browser' {
  import type { ReactNode } from 'react';

  export function renderToReadableStream(
    element: ReactNode,
    options?: {
      signal?: AbortSignal;
      onError?: (error: unknown) => void;
    },
  ): Promise<ReadableStream<Uint8Array> & { allReady: Promise<void> }>;
}

declare module '*.css?url' {
  const href: string;
  export default href;
}

declare module 'virtual:remix/server-build' {
  import type { ServerBuild } from '@remix-run/server-runtime';

  const build: ServerBuild;
  export default build;
}

/** MiniOxygen / Cloudflare Workers execution context (not always in lib scope). */
interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}
