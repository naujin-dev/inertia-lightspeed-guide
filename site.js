/* Inertia 사이트 공통 스크립트: 화면 모드 전환과 날짜 계산 */
(function () {
  var KEY = 'inertia-theme';
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { if (v) localStorage.setItem(KEY, v); else localStorage.removeItem(KEY); } catch (e) {} }
  function apply(v) {
    if (v) document.documentElement.setAttribute('data-theme', v);
    else document.documentElement.removeAttribute('data-theme');
  }
  apply(get()); // 저장된 모드를 깜빡임 없이 바로 적용

  var LABEL = { auto: '화면 모드: 자동', light: '화면 모드: 라이트', dark: '화면 모드: 다크' };
  document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    function paint() {
      var text = LABEL[get() || 'auto'];
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].textContent = text;
        buttons[i].setAttribute('aria-label', text + ', 누르면 바뀐다');
      }
    }
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {
        var v = get();
        var next = v === null ? 'light' : (v === 'light' ? 'dark' : null);
        set(next); apply(next); paint();
      });
    }
    paint();
  });

  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var WD = ['일', '월', '화', '수', '목', '금', '토'];
  var Inertia = window.Inertia = {};

  Inertia.todayISO = function (d) {
    d = d || new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  };
  Inertia.daysBetween = function (aISO, bISO) {
    var a = aISO.split('-'), b = bISO.split('-');
    return Math.round((Date.UTC(+b[0], +b[1] - 1, +b[2]) - Date.UTC(+a[0], +a[1] - 1, +a[2])) / 864e5);
  };
  Inertia.ddayLabel = function (n) { return n === 0 ? 'D-DAY' : (n > 0 ? 'D-' + n : 'D+' + (-n)); };
  Inertia.weekday = function (iso) {
    var p = iso.split('-');
    return WD[new Date(+p[0], +p[1] - 1, +p[2]).getDay()];
  };
  // "ET 16:50~18:10" 에서 끝나는 시각(분). 시간이 없으면 하루 끝으로 본다.
  Inertia.endMinutes = function (slot) {
    var m = /(\d{1,2}):(\d{2})\s*~\s*(\d{1,2}):(\d{2})/.exec(slot || '');
    return m ? (+m[3]) * 60 + (+m[4]) : 24 * 60;
  };
  // 지금 기준으로 아직 끝나지 않은 첫 일정
  Inertia.nextItem = function (items, now) {
    now = now || new Date();
    var today = Inertia.todayISO(now);
    var minutes = now.getHours() * 60 + now.getMinutes();
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (it.date > today) return it;
      if (it.date === today && Inertia.endMinutes(it.slot) > minutes) return it;
    }
    return null;
  };
  // 엑셀 문장의 줄표(—)를 쌍점으로 바꿔 읽기 쉽게 한다
  Inertia.tidy = function (t) { return String(t || '').replace(/\s+[—–]\s+/g, ': ').trim(); };
  // 할 일 문장의 첫 덩어리만 (★ 표시는 뺀다)
  Inertia.firstChunk = function (task) {
    return Inertia.tidy(String(task || '').split(' · ')[0].replace(/\s*★\s*/g, ' '));
  };

  // 머리 띠 뒤에 흐르는 전자기파: 파랑은 전기장, 주황은 자기장
  Inertia.wave = function (canvas, opt) {
    if (!canvas || !canvas.getContext) return;
    opt = opt || {};
    var ctx = canvas.getContext('2d');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var E = opt.e || [125, 187, 232], B = opt.b || [238, 154, 118];
    var w = 0, h = 0, dpr = 1, t0 = performance.now(), raf = 0, visible = true;
    function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a.toFixed(3) + ')'; }
    function size() {
      var r = canvas.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, r.width); h = Math.max(1, r.height);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function env(x) { var u = Math.min(1, Math.max(0, x / w)); return Math.pow(Math.sin(Math.PI * u), 0.7); }
    function draw(now) {
      var t = (now - t0) / 1000;
      var cy = h * (opt.y || 0.5), A = Math.min(h * (opt.amp || 0.3), 130);
      var lam = Math.max(240, Math.min(460, w / (opt.waves || 3.2)));
      var k = 2 * Math.PI / lam, ph = t * (opt.speed || 1.5);
      var px = -0.34, py = 0.46; // 깊이 방향(자기장)을 비스듬히 눕혀 그린다
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255,255,255,.16)';
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
      var x, s, e, d, step = 11;
      for (x = 0; x <= w; x += step) {
        s = Math.sin(k * x - ph); e = env(x);
        ctx.strokeStyle = rgba(E, 0.26 * e);
        ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo(x, cy - A * s * e); ctx.stroke();
        d = A * 0.78 * s * e;
        ctx.strokeStyle = rgba(B, 0.2 * e);
        ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo(x + px * d, cy + py * d); ctx.stroke();
      }
      function curve(col, isB, width, alpha) {
        ctx.lineWidth = width; ctx.strokeStyle = rgba(col, alpha);
        ctx.beginPath();
        for (var x = 0; x <= w; x += 3) {
          var s = Math.sin(k * x - ph), e = env(x), X, Y;
          if (isB) { var d = A * 0.78 * s * e; X = x + px * d; Y = cy + py * d; } else { X = x; Y = cy - A * s * e; }
          if (x === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
        }
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'lighter';
      curve(B, true, 7, 0.07); curve(B, true, 1.6, 0.75);
      curve(E, false, 8, 0.08); curve(E, false, 1.8, 0.9);
      ctx.globalCompositeOperation = 'source-over';
    }
    function loop(now) { draw(now); raf = visible ? requestAnimationFrame(loop) : 0; }
    function start() { if (!raf && visible && !reduce && !document.hidden) raf = requestAnimationFrame(loop); }
    size();
    draw(t0 + 1200);
    if (reduce) { window.addEventListener('resize', function () { size(); draw(t0 + 1200); }); return; }
    window.addEventListener('resize', function () { size(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) start(); }).observe(canvas);
    }
    document.addEventListener('visibilitychange', function () { if (!document.hidden) start(); else { cancelAnimationFrame(raf); raf = 0; } });
    start();
  };
})();
