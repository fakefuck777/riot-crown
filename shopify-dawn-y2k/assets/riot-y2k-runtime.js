/**
 * RIOT Y2K — Dawn runtime (chrome hover + hero sparkles).
 * Load once via theme.liquid {% render 'riot-y2k-head' %} or defer script per section.
 */
(function () {
  'use strict';

  function reduced() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function bindChromeGrids() {
    if (reduced()) return;
    document.querySelectorAll('[data-riot-chrome-grid]:not([data-riot-chrome-bound])').forEach(function (grid) {
      grid.setAttribute('data-riot-chrome-bound', '1');
      grid.querySelectorAll('[data-riot-chrome-card]').forEach(function (card) {
        card.addEventListener(
          'pointermove',
          function (e) {
            var r = card.getBoundingClientRect();
            var x = ((e.clientX - r.left) / Math.max(r.width, 1)) * 100;
            var y = ((e.clientY - r.top) / Math.max(r.height, 1)) * 100;
            card.style.setProperty('--mx', x + '%');
            card.style.setProperty('--my', y + '%');
          },
          { passive: true },
        );
        card.addEventListener('pointerleave', function () {
          card.style.setProperty('--mx', '50%');
          card.style.setProperty('--my', '42%');
        });
      });
    });
  }

  function initSparkles() {
    if (reduced()) return;
    document.querySelectorAll('[data-riot-sparkles]:not([data-riot-sparkled])').forEach(function (field) {
      field.setAttribute('data-riot-sparkled', '1');
      var n = parseInt(field.getAttribute('data-sparkle-count') || '72', 10);
      if (isNaN(n) || n < 1) n = 72;
      n = Math.min(n, 160);
      for (var i = 0; i < n; i++) {
        var s = document.createElement('span');
        s.style.left = Math.random() * 100 + '%';
        s.style.top = Math.random() * 100 + '%';
        s.style.animationDelay = Math.random() * 4 + 's';
        s.style.animationDuration = 2.2 + Math.random() * 2.8 + 's';
        if (Math.random() > 0.65) {
          s.style.boxShadow =
            '0 0 8px rgba(200,255,0,0.7), 0 0 14px rgba(110,203,255,0.45)';
        }
        field.appendChild(s);
      }
    });
  }

  function boot() {
    bindChromeGrids();
    initSparkles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  document.addEventListener('shopify:section:load', boot);
})();
