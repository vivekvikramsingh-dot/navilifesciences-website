// Navi Lifesciences — menu, scroll reveal, contact form
(function () {
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.nav ul');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  var form = document.getElementById('contact-form');
  if (!form) return;
  var msg = document.getElementById('form-msg');
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (form.querySelector('[name="_honey"]').value) return;
    var btn = form.querySelector('button[type="submit"]');
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    btn.disabled = true; btn.textContent = 'Sending…';
    msg.className = 'form-msg';
    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok && String(res.j.success) !== 'false') {
          form.reset();
          msg.className = 'form-msg ok';
          msg.textContent = 'Thank you. Your message has reached Dr. Singh, and you can expect a reply within one business day.';
        } else { throw new Error(); }
      })
      .catch(function () {
        msg.className = 'form-msg err';
        msg.innerHTML = 'Sorry, the message could not be sent. Please email <a href="mailto:vivek.singh@navilifesciences.com">vivek.singh@navilifesciences.com</a> or call +971 52 107 9931.';
      })
      .finally(function () { btn.disabled = false; btn.textContent = 'Send message'; });
  });
})();
