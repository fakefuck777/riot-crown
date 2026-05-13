import { describe, expect, it } from 'vitest';
import { buildCatalogItemListJsonLd, buildProductJsonLd, buildRootJsonLd } from './schemaOrg';
import { getProduct } from './products';

describe('schemaOrg', () => {
  const site = 'https://example.com';

  it('buildRootJsonLd includes Organization and WebSite graph', () => {
    const j = buildRootJsonLd(site);
    expect(j['@context']).toBe('https://schema.org');
    const graph = (j as { '@graph': { '@type': string | string[] }[] })['@graph'];
    expect(graph).toHaveLength(2);
    expect(graph[0]['@type']).toContain('Organization');
    expect(graph[1]['@type']).toBe('WebSite');
  });

  it('buildCatalogItemListJsonLd lists all products', () => {
    const j = buildCatalogItemListJsonLd(site) as {
      numberOfItems: number;
      itemListElement: unknown[];
    };
    expect(j.numberOfItems).toBeGreaterThan(0);
    expect(j.itemListElement).toHaveLength(j.numberOfItems);
  });

  it('buildProductJsonLd includes Product and BreadcrumbList', () => {
    const p = getProduct('01');
    expect(p).toBeDefined();
    const j = buildProductJsonLd(site, p!) as {
      '@graph': ({ '@type': string; image?: string[] })[];
    };
    const types = j['@graph'].map(n => n['@type']);
    expect(types).toContain('Product');
    expect(types).toContain('BreadcrumbList');
    const productNode = j['@graph'].find(n => n['@type'] === 'Product');
    expect(productNode?.image?.[0]).toBe('https://example.com/og/product/01.svg');
  });
});
