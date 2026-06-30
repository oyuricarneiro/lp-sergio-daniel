// LP Dr. Sérgio Daniel — v2
// Intercepta todos os CTAs de WhatsApp: abre formulário (nome/email/telefone),
// valida, dispara evento de conversão no GTM e só então segue pro WhatsApp.
(function () {
  'use strict';

  var modal = document.getElementById('leadModal');
  var form = document.getElementById('leadForm');
  if (!modal || !form) return;

  var WA_FALLBACK = 'https://wa.me/5596981131105';
  var targetUrl = WA_FALLBACK;   // destino WhatsApp do CTA clicado
  var lastFocus = null;

  var fields = {
    nome: document.getElementById('lf-nome'),
    email: document.getElementById('lf-email'),
    telefone: document.getElementById('lf-telefone')
  };

  // --- Abrir / fechar -------------------------------------
  function openModal(url) {
    targetUrl = url || WA_FALLBACK;
    lastFocus = document.activeElement;
    modal.hidden = false;
    requestAnimationFrame(function () { modal.classList.add('open'); });
    document.body.style.overflow = 'hidden';
    window.setTimeout(function () { fields.nome.focus(); }, 80);
  }
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    window.setTimeout(function () { modal.hidden = true; }, 280);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // --- Intercepta TODOS os links de WhatsApp da página ----
  var waLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp.com"]');
  waLinks.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(a.getAttribute('href'));
    });
  });

  // Fechar: botão, backdrop, Esc
  modal.querySelectorAll('[data-lf-close]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', function (e) {
    if (!modal.hidden && e.key === 'Escape') closeModal();
  });

  // --- Máscara de telefone (BR) ---------------------------
  fields.telefone.addEventListener('input', function () {
    var d = this.value.replace(/\D/g, '').slice(0, 11);
    var out = d;
    if (d.length > 6) {
      out = '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length === 11 ? 7 : 6) +
            '-' + d.slice(d.length === 11 ? 7 : 6);
    } else if (d.length > 2) {
      out = '(' + d.slice(0, 2) + ') ' + d.slice(2);
    } else if (d.length > 0) {
      out = '(' + d;
    }
    this.value = out;
  });

  // --- Validação ------------------------------------------
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(key, msg) {
    var field = fields[key].closest('.lf-field');
    var err = document.getElementById('err-' + key);
    if (msg) {
      field.classList.add('invalid');
      if (err) err.textContent = msg;
    } else {
      field.classList.remove('invalid');
      if (err) err.textContent = '';
    }
  }

  function validate() {
    var ok = true;
    var nome = fields.nome.value.trim();
    var email = fields.email.value.trim();
    var tel = fields.telefone.value.replace(/\D/g, '');

    if (nome.length < 3 || nome.indexOf(' ') === -1) {
      setError('nome', 'Informe seu nome completo.'); ok = false;
    } else { setError('nome', ''); }

    if (!EMAIL_RE.test(email)) {
      setError('email', 'Informe um e-mail válido.'); ok = false;
    } else { setError('email', ''); }

    if (tel.length < 10 || tel.length > 11) {
      setError('telefone', 'Informe um WhatsApp com DDD.'); ok = false;
    } else { setError('telefone', ''); }

    return ok;
  }

  // Limpa o erro do campo assim que o usuário corrige
  Object.keys(fields).forEach(function (key) {
    fields[key].addEventListener('input', function () {
      if (fields[key].closest('.lf-field').classList.contains('invalid')) setError(key, '');
    });
  });

  // --- Submit ---------------------------------------------
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) {
      var firstInvalid = modal.querySelector('.lf-field.invalid input');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Evento de conversão para o GTM (GTM-5ZCB4FC5)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'lead_form_submit',
      form_id: 'lp-v2-whatsapp-gate',
      lead_destination: 'whatsapp'
    });

    // Segue para o WhatsApp (mensagem padrão do CTA clicado)
    var win = window.open(targetUrl, '_blank', 'noopener');
    if (!win) window.location.href = targetUrl;

    closeModal();
    form.reset();
  });
})();
