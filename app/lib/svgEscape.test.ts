import { describe, expect, it } from 'vitest';
import { escapeXml } from './svgEscape';

describe('escapeXml', () => {
  it('escapes special characters', () => {
    expect(escapeXml(`a & b < c > "d" 'e'`)).toBe('a &amp; b &lt; c &gt; &quot;d&quot; &apos;e&apos;');
  });
});
