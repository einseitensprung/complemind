/* Adobe Fonts (ff-utility-web-pro) – complemind kit.
   The kit is domain-restricted; on localhost the CSS fallback font is used. */
(function () {
  var s = document.createElement('script');
  s.src = 'https://use.typekit.net/ik/8i63jHpEYma2Y34unrPWpEB6OxttEwFxqtCA4LkIuoIfeTGgfO2bvMJPH2j3wDqhw2gLw26kZRFc5Ab3F2MhZAmcZeFyFeJuZRF8FAbDjRjaFhj-wKG0jhNlSeU8dA80ZfoRdhXCjhNlSeU8dA80ZfoRdhXCiaiaOcFzdWgCZAuTdcb0jhNlJy4cZKuuie8C-WsoOWi8jKu3Scv7fbR2-UMMeMw6MKG4fwsnIMMjgPMfP6sFiWF8qMY6n-rwg6.js';
  s.async = true;
  s.onload = function () {
    try { window.Typekit.load({ async: true }); } catch (e) { /* fallback font stays */ }
  };
  document.head.appendChild(s);
})();
