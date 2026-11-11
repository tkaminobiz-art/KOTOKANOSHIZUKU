// 最初の画面に金のかけらを降らせる（2026-11-11）。
// 小さいかけらを多く、ゆっくり。回る向きで光り、画面から外れたら止まる。
// 端末で「動きを減らす」が有効なときは描かない。
(function () {
  var cv = document.querySelector('.fv-flakes');
  if (!cv || !cv.getContext) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var ctx = cv.getContext('2d');
  var W = 0, H = 0, dpr = 1, flakes = [], raf = 0, last = 0, onScreen = true;
  var COLORS = ['#d9bb6a', '#e6cd86', '#e6cd86', '#f1dfa6', '#fff1cc'];   // 線や文字と同じ金の系統。夕空の上でも見えるよう明るい側へ寄せる

  function rnd(a, b) { return a + Math.random() * (b - a); }

  function make(anywhere) {
    var r = Math.random();
    // 7割強が 1〜2px の小さいかけら。大きいものはごく少し
    var size = r < 0.74 ? rnd(1.2, 2.1) : r < 0.96 ? rnd(2.1, 3.2) : rnd(3.2, 4.6);
    var depth = (size - 1.2) / 3.4;               // 0＝遠い（小さく遅く淡い）、1＝近い
    return {
      x: rnd(0, W), y: anywhere ? rnd(-10, H) : rnd(-40, -6),
      size: size, long: rnd(1.0, 1.7),
      vy: 6 + depth * 15 + rnd(0, 5),              // 1秒に 6〜26px
      swayA: rnd(4, 14) * (0.5 + depth), swayT: rnd(4, 9), swayP: rnd(0, 6.283),
      spin: rnd(0.5, 1.5) * (Math.random() < 0.5 ? -1 : 1), spinP: rnd(0, 6.283),
      rot: rnd(0, 6.283), rotV: rnd(-0.4, 0.4),
      alpha: 0.58 + depth * 0.32 + rnd(0, 0.1),
      color: COLORS[(Math.random() * COLORS.length) | 0]
    };
  }

  function target() {
    var per = W < 600 ? 3000 : 5200;               // 面積あたりの枚数。スマホは写真が小さいので少し密に
    return Math.max(30, Math.min(260, Math.round(W * H / per)));
  }

  function resize() {
    var b = cv.getBoundingClientRect();
    W = Math.max(1, Math.round(b.width)); H = Math.max(1, Math.round(b.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    var n = target();
    while (flakes.length < n) flakes.push(make(true));
    if (flakes.length > n) flakes.length = n;
  }

  function smooth(a, b, v) { var t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); }

  function frame(now) {
    raf = 0;
    var dt = Math.min(0.05, (now - last) / 1000 || 0); last = now;
    var t = now / 1000;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      f.y += f.vy * dt; f.rot += f.rotV * dt;
      if (f.y > H + 8) { flakes[i] = f = make(false); }
      var x = f.x + Math.sin(t * 6.283 / f.swayT + f.swayP) * f.swayA;
      var flip = Math.abs(Math.cos(t * f.spin + f.spinP));    // 面がこちらを向くと太く明るい
      var a = f.alpha * (0.45 + 0.55 * flip);
      if (flip > 0.97) a = Math.min(1, a + 0.3);               // 向きが合った一瞬だけ光る
      a *= Math.min(1, (f.y + 10) / 40) * Math.max(0, Math.min(1, (H - f.y) / (H * 0.12)));
      if (W >= 1024) a *= 0.4 + 0.6 * smooth(W * 0.30, W * 0.52, x);   // 文字とボタンの上では薄く
      if (a <= 0.01) continue;
      var c = Math.cos(f.rot) * dpr, s = Math.sin(f.rot) * dpr;
      ctx.setTransform(c, s, -s, c, x * dpr, f.y * dpr);
      ctx.globalAlpha = a; ctx.fillStyle = f.color;
      var w = f.size * f.long, h = Math.max(f.size * 0.28, f.size * flip);
      ctx.fillRect(-w / 2, -h / 2, w, h);
    }
    if (onScreen && !document.hidden && !reduce.matches) raf = requestAnimationFrame(frame);
  }

  function start() {
    if (raf || reduce.matches || !onScreen || document.hidden) return;
    last = performance.now(); raf = requestAnimationFrame(frame);
  }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

  resize();
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(cv);
  else window.addEventListener('resize', resize);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { onScreen = es[0].isIntersecting; if (onScreen) start(); else stop(); }).observe(cv);
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
  reduce.addEventListener('change', function () {
    if (reduce.matches) { stop(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); } else start();
  });
  start();
})();
