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
  // 할 일 문장의 첫 덩어리만 (★ 표시는 뺀다)
  Inertia.firstChunk = function (task) {
    return String(task || '').split(' · ')[0].replace(/\s*★\s*/g, ' ').trim();
  };
})();
