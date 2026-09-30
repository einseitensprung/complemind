/* ==========================================================================
   complemind – site script (vanilla JS, no dependencies)
   1. Scroll effects (homepage, desktop only)
   2. Slideshows
   3. Scaled website previews in the iMac mockups
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ------------------------------------------------------------------------
     1. Scroll effects
     Each element carries data-fx with up to three effects, all keyed to a
     scroll position k:
       pos: [k, [sx, sy] before k, [sx, sy] after k]  -> offset = speed * (scroll - k)
            sy = 0 keeps the element pinned, sy = -1 lets it scroll with the page
       op:  [k, [fade, target] before, [fade, target] after]
            fully visible at k, reaching "target" (0-100) after "fade" px
            (fade 0 = jump straight to target)
       bg:  [k, [sx, sy] before, [sx, sy] after]  -> horizontal background shift
     ------------------------------------------------------------------------ */
  var desktop = window.matchMedia('(min-width: 961px)');
  var fxItems = Array.prototype.map.call(document.querySelectorAll('[data-fx]'), function (el) {
    return { el: el, fx: JSON.parse(el.getAttribute('data-fx')) };
  });

  function offset(s, def, axis) {
    var k = def[0];
    var speed = (s < k ? def[1] : def[2])[axis] || 0;
    return speed * (s - k);
  }

  function opacity(s, def) {
    var k = def[0];
    if (s === k) return 1;
    var side = s < k ? def[1] : def[2];
    var fade = side[0], target = side[1] / 100;
    if (!fade) return target;
    var p = Math.min(Math.abs(s - k) / fade, 1);
    return 1 + (target - 1) * p;
  }

  function applyFx() {
    var s = window.pageYOffset;
    for (var i = 0; i < fxItems.length; i++) {
      var el = fxItems[i].el, fx = fxItems[i].fx;
      if (fx.pos) {
        el.style.setProperty('--dx', offset(s, fx.pos, 0) + 'px');
        el.style.setProperty('--dy', offset(s, fx.pos, 1) + 'px');
      }
      if (fx.bg) el.style.setProperty('--bx', offset(s, fx.bg, 0) + 'px');
      if (fx.op) {
        var o = opacity(s, fx.op);
        el.style.opacity = o;
        el.style.visibility = o <= 0 ? 'hidden' : '';
      }
    }
  }

  function clearFx() {
    fxItems.forEach(function (item) {
      ['--dx', '--dy', '--bx', 'opacity', 'visibility'].forEach(function (p) { item.el.style.removeProperty(p); });
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { ticking = false; applyFx(); });
  }

  function setupFx() {
    if (!fxItems.length) return;
    if (desktop.matches) {
      window.addEventListener('scroll', onScroll, { passive: true });
      applyFx();
    } else {
      window.removeEventListener('scroll', onScroll);
      clearFx();
    }
  }
  setupFx();
  if (desktop.addEventListener) desktop.addEventListener('change', setupFx);

  /* ------------------------------------------------------------------------
     2. Slideshows
     <div class="slideshow" data-autoplay="5000" data-transition="fade|slide">
       <div class="slides"><img class="slide">...</div>
       <div class="ss-bar"><button data-prev>…</button><p class="ss-caption"></p><button data-next>…</button></div>
       <div class="thumbs">…</div>   (optional)
     </div>
     ------------------------------------------------------------------------ */
  Array.prototype.forEach.call(document.querySelectorAll('.slideshow'), function (root) {
    var track = root.querySelector('.slides');
    var slides = root.querySelectorAll('.slide');
    var thumbs = root.querySelectorAll('.thumbs button');
    var slideMode = root.getAttribute('data-transition') === 'slide';
    var delay = parseInt(root.getAttribute('data-autoplay'), 10) || 0;
    var index = 0, timer = null;
    if (slides.length < 2) return;

    function show(i) {
      index = (i + slides.length) % slides.length;
      Array.prototype.forEach.call(slides, function (s, n) {
        s.classList.toggle('is-active', n === index);
        s.setAttribute('aria-hidden', n === index ? 'false' : 'true');
        if (slideMode) s.style.transform = 'translateX(' + (-100 * index) + '%)';
      });
      Array.prototype.forEach.call(thumbs, function (t, n) {
        t.setAttribute('aria-current', n === index ? 'true' : 'false');
      });
    }
    function play() {
      stop();
      if (delay && !reduceMotion.matches) timer = window.setInterval(function () { show(index + 1); }, delay);
    }
    function stop() { if (timer) window.clearInterval(timer); timer = null; }
    function go(i) { show(i); play(); }

    var prev = root.querySelector('[data-prev]'), next = root.querySelector('[data-next]');
    if (prev) prev.addEventListener('click', function () { go(index - 1); });
    if (next) next.addEventListener('click', function () { go(index + 1); });
    Array.prototype.forEach.call(thumbs, function (t, n) { t.addEventListener('click', function () { go(n); }); });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') go(index - 1);
      if (e.key === 'ArrowRight') go(index + 1);
    });

    // swipe
    var startX = null;
    track.addEventListener('pointerdown', function (e) { startX = e.clientX; });
    track.addEventListener('pointerup', function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    });

    // pause while hidden / hovered
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', play);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? play() : stop();
      }).observe(root);
    } else {
      play();
    }
    show(0);
  });

  /* ------------------------------------------------------------------------
     3. iMac mockups: scale the 1440px wide live website to the screen size
     ------------------------------------------------------------------------ */
  var screens = document.querySelectorAll('.imac .screen');
  function scaleScreens() {
    Array.prototype.forEach.call(screens, function (sc) {
      sc.style.setProperty('--s', (sc.clientWidth / 1440).toFixed(4));
    });
  }
  if (screens.length) {
    scaleScreens();
    window.addEventListener('resize', scaleScreens);
  }
})();
