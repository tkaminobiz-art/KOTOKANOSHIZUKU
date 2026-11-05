// メニューの開閉と、計測するリンクの記録（計測のタグを入れたら dataLayer から送られる）
(function () {
  var btn = document.querySelector('[data-menu]');
  var nav = document.getElementById('site-nav');
  var wide = window.matchMedia('(min-width: 1024px)');

  function setOpen(open) {
    if (!btn || !nav) return;
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? '閉じる' : 'メニュー';
    if (open || wide.matches) nav.removeAttribute('hidden');
    else nav.setAttribute('hidden', '');
  }

  if (btn && nav) {
    setOpen(false);
    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && !wide.matches) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        btn.focus();
      }
    });
    wide.addEventListener('change', function () { setOpen(false); });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-track]');
    if (!a) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'lp_click', link_id: a.getAttribute('data-track'), link_url: a.href });
  });
})();
