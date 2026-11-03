/* Spokój Inwestora: minimalny JS landing page. Bez zależności. Strona działa bez niego (przełącznik programu jest wtedy ukryty). */
(function () {
  'use strict';
  var cfg = window.SI_CTA || {};

  // 1. CTA: adresy z cta-config.js; placeholdery pokazują komunikat zamiast przejścia dalej.
  var msg = document.getElementById('cta-msg');
  document.querySelectorAll('[data-cta]').forEach(function (el) {
    var url = cfg[el.getAttribute('data-cta')];
    if (url) el.setAttribute('href', url);
    el.addEventListener('click', function (e) {
      var href = el.getAttribute('href') || '';
      if (href.indexOf('#checkout-todo') === 0) {
        e.preventDefault();
        if (msg) { msg.hidden = false; msg.scrollIntoView({ block: 'center' }); }
      }
    });
  });

  // 2. Odcinek 1: placeholder do czasu wyboru platformy wideo.
  document.querySelectorAll('[data-video-src]').forEach(function (fig) {
    var btn = fig.querySelector('.play');
    var note = fig.querySelector('.player-msg');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var src = fig.getAttribute('data-video-src');
      if (src) {
        var f = document.createElement('iframe');
        f.src = src; f.title = 'Odcinek 1: Dlaczego budowy wymykają się spod kontroli';
        f.allow = 'fullscreen; picture-in-picture'; f.setAttribute('allowfullscreen', '');
        fig.innerHTML = ''; fig.appendChild(f);
      } else if (note) { note.hidden = false; }
    });
  });

  // 4. Pojawianie się sekcji (jedno, z opóźnieniem kolejnych elementów). Bez skryptu wszystko jest widoczne.
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('[data-reveal]');
  revealEls.forEach(function (el, i) { el.style.setProperty('--i', String(i % 4)); });
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else { revealEls.forEach(function (el) { el.classList.add('is-in'); }); }

  // 5. Liczniki: tekst końcowy jest w HTML, skrypt tylko odlicza od zera przy pierwszym wejściu w kadr.
  var fmt = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0'); };
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var end = parseInt(el.getAttribute('data-count'), 10);
    var final = el.textContent;
    var suffix = final.replace(/^[\d\s\u00a0]+/, '');
    if (reduce || !('IntersectionObserver' in window) || !end) return;
    var run = function () {
      var t0 = null, dur = end > 1000 ? 1600 : 900;
      var step = function (t) {
        if (t0 === null) t0 = t;
        var p = Math.min(1, (t - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
        el.textContent = fmt(v) + suffix;
        if (p < 1) requestAnimationFrame(step); else el.textContent = final;
      };
      requestAnimationFrame(step);
    };
    var co = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { co.disconnect(); run(); } }, { threshold: 0.6 });
    co.observe(el);
  });

  // 6. Sześć pytań: numer zapala się na złoto, gdy pytanie mija środek ekranu.
  var qs = document.querySelectorAll('[data-q]');
  if (qs.length && 'IntersectionObserver' in window) {
    var qo = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('is-on'); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    qs.forEach(function (q) { qo.observe(q); });
  }

  // 7. Taśma: przycisk wstrzymania (poza hover i fokusem, które też zatrzymują ruch).
  var track = document.querySelector('[data-marq]');
  var tbtn = document.querySelector('[data-marq-toggle]');
  if (track && tbtn) {
    tbtn.addEventListener('click', function () {
      var paused = track.classList.toggle('is-paused');
      tbtn.setAttribute('aria-pressed', String(paused));
      tbtn.textContent = paused ? 'Włącz ruch' : 'Zatrzymaj ruch';
    });
  }
  // 8. H1: zmienne słowo (dom, pensjonat…). Bez skryptu i przy ograniczonym ruchu zostaje „dom”.
  var rot = document.querySelector('[data-rot]');
  if (rot && !reduce) {
    var words = rot.getAttribute('data-rot').split('|'), w = rot.querySelector('.rot__w'), wi = 0;
    // Stała szerokość najdłuższego słowa: reszta nagłówka się nie przesuwa.
    var keep = w.textContent, maxW = 0;
    words.forEach(function (x) { w.textContent = x; maxW = Math.max(maxW, w.getBoundingClientRect().width); });
    w.textContent = keep; rot.style.minWidth = Math.ceil(maxW) + 'px';
    setInterval(function () {
      w.classList.add('is-out');
      setTimeout(function () { wi = (wi + 1) % words.length; w.textContent = words[wi]; w.classList.remove('is-out'); }, 220);
    }, 2600);
  }

  // 9. „Ile masz czasu?”: zakładki. Bez skryptu widać wszystkie trzy sytuacje.
  document.querySelectorAll('[data-tabs]').forEach(function (box) {
    var list = box.querySelector('[role="tablist"]');
    var tabs = Array.prototype.slice.call(box.querySelectorAll('[role="tab"]'));
    if (!list || !tabs.length) return;
    list.hidden = false;
    var select = function (t, focus) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) t.focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
        if (n === null) return;
        e.preventDefault();
        select(tabs[(n + tabs.length) % tabs.length], true);
      });
    });
    select(tabs[0]);
  });

  // 10. Pakiety na telefonie: przewijanie w bok startuje od pakietu środkowego.
  var tiers = document.querySelector('.tiers');
  var main = tiers && tiers.querySelector('.tier--main');
  if (main && tiers.scrollWidth > tiers.clientWidth) {
    tiers.scrollLeft = main.offsetLeft - tiers.offsetLeft - (tiers.clientWidth - main.clientWidth) / 2;
  }
})();
