// LP Dr. Sérgio Daniel — interações (sem dependências)
(function () {
  'use strict';

  // FAQ accordion (um aberto por vez)
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  // Reveal on scroll
  var reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // CTA flutuante — aparece após sair do hero
  var floatCta = document.getElementById('floatCta');
  if (floatCta) {
    var onScroll = function () {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      floatCta.classList.toggle('show', y > window.innerHeight * 0.7);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Lightbox antes/depois
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbImg = lb.querySelector('.lightbox__img');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.transf-card'));
    var idx = 0, lastFocus = null;
    var closeBtn = lb.querySelector('.lightbox__close');
    function show(i) { idx = (i + cards.length) % cards.length; lbImg.src = cards[idx].getAttribute('data-full'); }
    function openLb(i) {
      lastFocus = document.activeElement; show(i);
      lb.hidden = false; requestAnimationFrame(function () { lb.classList.add('open'); });
      document.body.style.overflow = 'hidden'; closeBtn.focus();
    }
    function closeLb() {
      lb.classList.remove('open'); document.body.style.overflow = '';
      window.setTimeout(function () { lb.hidden = true; }, 280);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    cards.forEach(function (c, i) { c.addEventListener('click', function () { openLb(i); }); });
    closeBtn.addEventListener('click', closeLb);
    lb.querySelector('.lightbox__prev').addEventListener('click', function () { show(idx - 1); });
    lb.querySelector('.lightbox__next').addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  // Ano no rodapé
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
