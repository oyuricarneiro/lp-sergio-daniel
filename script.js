// LP Dr. Sergio Daniel — interações leves (sem dependências)
(function () {
  'use strict';

  var header = document.getElementById('header');
  var floatCta = document.getElementById('floatCta');

  // Header sólido + CTA flutuante após sair do hero
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (header) header.classList.toggle('scrolled', y > 40);
    if (floatCta) floatCta.classList.toggle('show', y > window.innerHeight * 0.7);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal on scroll (fora do hero)
  var reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          var el = e.target;
          setTimeout(function () { el.classList.add('in'); }, i * 90);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // FAQ accordion (acessível)
  var faqButtons = document.querySelectorAll('.faq__q');
  faqButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq__item');
      var open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  // Ano no rodapé
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Lightbox antes/depois (acessível: Esc, setas, foco)
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbImg = lb.querySelector('.lightbox__img');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.transform-card'));
    var idx = 0, lastFocus = null;
    var closeBtn = lb.querySelector('.lightbox__close');
    function show(i) { idx = (i + cards.length) % cards.length; lbImg.src = cards[idx].getAttribute('data-full'); }
    function openLb(i) {
      lastFocus = document.activeElement;
      show(i);
      lb.hidden = false;
      requestAnimationFrame(function () { lb.classList.add('open'); });
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }
    function closeLb() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      window.setTimeout(function () { lb.hidden = true; }, 280);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    cards.forEach(function (c, i) { c.addEventListener('click', function () { openLb(i); }); });
    closeBtn.addEventListener('click', closeLb);
    lb.querySelector('.lightbox__prev').addEventListener('click', function () { show(idx - 1); });
    lb.querySelector('.lightbox__next').addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target === lb.querySelector('.lightbox__stage')) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  // Hero parallax (desktop, pós-load, respeita reduced-motion)
  var hero = document.querySelector('.hero');
  var heroMedia = document.getElementById('heroMedia');
  var heroGlow = document.querySelector('.hero__glow');
  var fine = window.matchMedia('(pointer: fine)').matches;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (hero && heroMedia && fine && !reduce) {
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var dx = (e.clientX - r.left) / r.width - 0.5;
      var dy = (e.clientY - r.top) / r.height - 0.5;
      heroMedia.style.transform = 'translate(' + (dx * -10).toFixed(1) + 'px,' + (dy * -8).toFixed(1) + 'px)';
      if (heroGlow) heroGlow.style.transform = 'translate(' + (dx * 24).toFixed(1) + 'px,' + (dy * 18).toFixed(1) + 'px)';
    });
    hero.addEventListener('mouseleave', function () {
      heroMedia.style.transform = '';
      if (heroGlow) heroGlow.style.transform = '';
    });
  }
})();
