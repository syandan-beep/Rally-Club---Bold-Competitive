/* RALLY HOUSE: rendering and interactions. Content lives in content.js. */
(function () {
  'use strict';
  const C = window.RH;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rupee = n => '₹' + n.toLocaleString('en-IN');
  const arrow = '<svg aria-hidden="true"><use href="#arrow"/></svg>';

  function pic(name, alt, sizes, eager) {
    return `<img src="assets/img/${name}-sm.webp" srcset="assets/img/${name}-sm.webp 800w, assets/img/${name}-lg.webp 1600w" sizes="${sizes}" alt="${esc(alt)}" ${eager ? '' : 'loading="lazy"'} decoding="async">`;
  }
  const statusChip = s => `<span class="status label ${s === 'Registration Open' ? 'status-open' : ''}">${s}</span>`;

  /* ---------- Render content ---------- */
  const views = {
    ticker: () => {
      const run = ['Own the Court', 'Play Hard. Rally Harder.', 'The City Plays Here', 'Your Game. Your Rules.'].map(t => `<span>${t}<img src="assets/logo/symbol-black.svg" alt=""></span>`).join('');
      return run + run + run + run;
    },
    courts: () => C.courts.map((c, i) => `
      <article class="court-card reveal" style="--d:${i * .08}s">
        <div class="ph">${pic(c.img, c.alt, '(max-width: 800px) 100vw, 60vw')}</div>
        <span class="court-no" aria-hidden="true">${c.no}</span>
        <div class="court-body">
          <h3>${c.name}</h3>
          <p>${c.desc}</p>
          <ul>${c.details.map(d => `<li>${d.replace(/\.$/, '')}</li>`).join('')}</ul>
          <button class="arrow-link stretch" data-action="court" data-arg="${c.id}" aria-label="Explore ${c.name}">Explore Court ${arrow}</button>
        </div>
      </article>`).join(''),
    experience: () => C.experience.map((x, i) => `
      <article class="exp-card exp-${i + 1} ${i === 2 ? 'exp-wide' : ''} reveal" style="--d:${i * .08}s">
        <div class="ph">${pic(x.img, x.alt, i ? '(max-width: 800px) 100vw, 40vw' : '(max-width: 800px) 100vw, 60vw')}</div>
        <div class="exp-txt">
          <span class="exp-no label">Experience ${x.no}</span>
          <h3>${x.name}</h3>
          <p>${x.desc}</p>
          <button class="arrow-link stretch" data-action="experience" data-arg="${i}" aria-label="Discover ${x.name}">Discover ${arrow}</button>
        </div>
      </article>`).join(''),
    plans: () => C.plans.map((p, i) => `
      <article class="plan plan-${i + 1} reveal ${p.featured ? 'featured' : ''}" style="--d:${i * .08}s">
        ${p.featured ? '<span class="plan-tag label">Most Popular</span>' : ''}
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <p class="plan-price"><span class="label">From</span><b>${p.price}</b><span class="label">${p.per}</span></p>
        <ul>${p.benefits.map((b, n) => `<li style="--i:${n}">${b}</li>`).join('')}</ul>
        <button class="btn ${p.featured ? 'btn-black' : i ? 'btn-lime' : 'btn-black'}" data-action="plan" data-arg="${p.id}">${p.cta}</button>
      </article>`).join(''),
    events: () => C.events.map((e, i) => `
      <article class="event reveal" style="--d:${i * .08}s">
        <span class="event-no" aria-hidden="true">${e.no}</span>
        <div class="ph">${pic(e.img, e.alt, '(max-width: 800px) 100vw, 26vw')}</div>
        <div class="event-main">
          <div class="event-tags"><span class="chip label chip-${e.tone}">${e.type}</span>${statusChip(e.status)}</div>
          <h3>${e.name}</h3>
          <p>${e.desc}</p>
          <p class="label event-det">${e.details}</p>
          <button class="arrow-link stretch" data-action="event" data-arg="${e.id}" aria-label="View details: ${e.name}, ${e.details}">Details ${arrow}</button>
        </div>
      </article>`).join(''),
    'board-tabs': () => Object.keys(C.leaderboard).map((k, i) => `<button role="tab" aria-selected="${!i}" aria-controls="boardBody" data-board="${esc(k)}">${k}</button>`).join(''),
    'coach-media': () => C.coaching.map((c, i) => pic(c.img, c.alt, '(max-width: 1100px) 100vw, 50vw').replace('<img', `<img class="${i ? '' : 'on'}" data-coach="${i}"`)).join(''),
    'coach-list': () => C.coaching.map((c, i) => `
      <div class="coach-item">
        <h3 style="margin:0;font:inherit"><button class="coach-trigger" aria-expanded="${!i}" aria-controls="cp${i}" data-coach-btn="${i}"><small>${c.no}</small>${c.name}<i class="coach-sign"></i></button></h3>
        <div class="coach-panel ${i ? '' : 'open'}" id="cp${i}"><div><p>${c.desc}</p><p>${c.more}</p></div></div>
      </div>`).join(''),
    stats: () => C.stats.map((s, i) => `
      <div class="stat reveal" style="--d:${i * .08}s"><dt>${s.label}</dt><dd data-count="${i}">${fmtStat(s, s.value)}</dd></div>`).join(''),
    gallery: () => C.gallery.map((g, i) => `
      <button class="g g-${g.area} reveal" style="--d:${(i % 3) * .06}s" data-lb-open="${i}" aria-label="Open photo: ${esc(g.cap)}">${pic(g.img, g.alt, '(max-width: 800px) 50vw, 33vw')}</button>`).join(''),
    contact: () => `<span>${C.contact.city}</span><span>${C.contact.hours}</span>`
  };
  function fmtStat(s, v) {
    let n = s.decimals ? v.toFixed(s.decimals) : String(Math.round(v));
    if (s.pad) n = n.padStart(s.pad, '0');
    return n + (s.suffix || '');
  }
  $$('[data-render]').forEach(el => { el.innerHTML = views[el.dataset.render](); });
  // Wipe images load eagerly: lazy loading never fires on an image that starts fully clipped
  $$('[data-pic]').forEach(el => { el.innerHTML = pic(el.dataset.pic, el.dataset.alt, el.dataset.sizes, el.classList.contains('wipe')); });
  // A missing image leaves its tinted container showing, not a broken icon
  document.addEventListener('error', e => { if (e.target.tagName === 'IMG') e.target.style.visibility = 'hidden'; }, true);

  /* ---------- Page load, scroll reveal, parallax ---------- */
  // Timeout as well as rAF: a tab opened in the background must not hold the hero hidden
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('loaded')));
  setTimeout(() => root.classList.add('loaded'), 300);

  const seen = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      seen.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: .06 });
  $$('.reveal, .wipe, .split').forEach(el => seen.observe(el));

  const nav = $('#nav');
  const layers = calm ? [] : $$('[data-parallax]').map(el => ({ el, k: +el.dataset.parallax }));
  let ticking = false;
  function onScroll() {
    nav.classList.toggle('scrolled', scrollY > 40);
    if (ticking || !layers.length) return;
    ticking = true;
    requestAnimationFrame(() => {
      const vh = innerHeight;
      layers.forEach(({ el, k }) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        el.style.transform = `translate3d(0, ${(r.top + r.height / 2 - vh / 2) * -k}px, 0)`;
      });
      ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Active nav indicator ---------- */
  const navLinks = $$('.nav-links a');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main > section, footer').forEach(s => spy.observe(s));

  /* ---------- Count up ---------- */
  const counter = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      counter.unobserve(en.target);
      const s = C.stats[+en.target.dataset.count];
      if (calm) return;
      const t0 = performance.now(), dur = 1200;
      (function tick(t) {
        const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        en.target.textContent = fmtStat(s, s.value * e);
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: .4 });
  $$('[data-count]').forEach(el => counter.observe(el));

  /* ---------- Mobile menu ---------- */
  const burger = $('#burger'), menu = $('#menu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    menu.inert = !open;
    nav.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    root.classList.toggle('lock', open);
  }
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); burger.focus(); } });
  matchMedia('(min-width: 1101px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* ---------- Leaderboard tabs ---------- */
  const boardBody = $('#boardBody'), boardTabs = $('[data-render="board-tabs"]');
  function showBoard(key) {
    $$('button', boardTabs).forEach(b => b.setAttribute('aria-selected', b.dataset.board === key));
    boardBody.innerHTML = `<div class="board-row head"><span>Pos</span><span>Player</span><span>P</span><span>Pts</span></div>` +
      C.leaderboard[key].map((r, i) => `<div class="board-row ${i ? '' : 'first'}"><b>${i + 1}</b><span>${esc(r[0])}</span><span>${r[1]}</span><span>${r[2]}</span></div>`).join('');
  }
  boardTabs.addEventListener('click', e => { const b = e.target.closest('[data-board]'); if (b) showBoard(b.dataset.board); });
  showBoard(Object.keys(C.leaderboard)[0]);

  /* ---------- Coaching accordion ---------- */
  let coachSel = C.coaching[0].id;
  $('[data-render="coach-list"]').addEventListener('click', e => {
    const b = e.target.closest('[data-coach-btn]');
    if (!b) return;
    const i = +b.dataset.coachBtn, wasOpen = b.getAttribute('aria-expanded') === 'true';
    $$('[data-coach-btn]').forEach((x, n) => {
      const on = n === i && !wasOpen;
      x.setAttribute('aria-expanded', on);
      $('#cp' + n).classList.toggle('open', on);
    });
    $$('[data-coach]').forEach((im, n) => im.classList.toggle('on', n === i));
    coachSel = C.coaching[i].id;
  });

  /* ---------- Modal shell ---------- */
  const modal = $('#modal'), inner = $('#modalInner');
  let closeTimer;
  const lockGutter = on => {
    root.style.paddingRight = on ? (innerWidth - root.clientWidth) + 'px' : '';
    root.classList.toggle('lock', on);
  };
  function openModal(html) {
    clearTimeout(closeTimer);
    inner.innerHTML = `<button class="m-close" data-action="close" aria-label="Close dialog">×</button>${html}`;
    inner.scrollTop = 0;
    if (!modal.open) {
      lockGutter(true);
      modal.showModal();
    }
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('show')));
    const t = $('.m-title', inner) || $('h2', inner);
    if (t) { t.id = 'modalTitle'; t.tabIndex = -1; t.focus({ preventScroll: true }); }
  }
  function closeModal() {
    modal.classList.remove('show');
    closeTimer = setTimeout(() => { modal.close(); lockGutter(false); inner.innerHTML = ''; }, calm ? 0 : 260);
  }
  modal.addEventListener('cancel', e => { e.preventDefault(); closeModal(); });
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  const photo = (name, alt) => `<div class="m-pic ph">${pic(name, alt, '720px', true)}</div>`;

  /* ---------- Validation shared by booking and enquiry forms ---------- */
  const rules = {
    name: v => v.trim().length >= 2 ? '' : 'Enter your full name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address.',
    phone: v => { const d = v.replace(/\D/g, ''); return /^[+\d\s()-]+$/.test(v.trim()) && d.length >= 7 && d.length <= 15 ? '' : 'Enter a valid phone number.'; }
  };
  function validate(form) {
    let first = null;
    $$('[data-rule]', form).forEach(inp => {
      const msg = rules[inp.dataset.rule](inp.value);
      inp.setAttribute('aria-invalid', !!msg);
      $('#' + inp.id + '-err', form).textContent = msg;
      if (msg && !first) first = inp;
    });
    if (first) first.focus();
    return !first;
  }
  const field = (id, label, type, val, rule, attrs = '', full) => `
    <div class="field ${full ? 'full' : ''}">
      <label for="${id}">${label}</label>
      <input id="${id}" name="${id}" type="${type}" value="${esc(val || '')}" ${rule ? `data-rule="${rule}"` : ''} aria-describedby="${id}-err" ${attrs}>
      <p class="err" id="${id}-err"></p>
    </div>`;

  /* ---------- Generic enquiry form ---------- */
  function enquiry({ eyebrow, title, sub, select, message, done }) {
    openModal(`<div class="m-body">
      <p class="label lime">${eyebrow}</p>
      <h2 class="m-title">${title}</h2>
      <p class="m-sub">${sub}</p>
      <form id="enq" novalidate>
        <div class="fields">
          ${select ? `<div class="field full"><label for="enqSel">${select.label}</label><select id="enqSel" name="sel">${select.options.map(o => `<option ${o === select.value ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select></div>` : ''}
          ${field('qname', 'Full name', 'text', '', 'name', 'autocomplete="name"', true)}
          ${field('qemail', 'Email address', 'email', '', 'email', 'autocomplete="email"')}
          ${field('qphone', 'Phone number', 'tel', '', 'phone', 'autocomplete="tel"')}
          ${message ? `<div class="field full"><label for="qmsg">Message (optional)</label><textarea id="qmsg" rows="3"></textarea></div>` : ''}
        </div>
        <div class="m-actions"><button class="btn btn-lime" type="submit">Send Enquiry</button></div>
      </form>
    </div>`);
    $('#enq').addEventListener('submit', e => {
      e.preventDefault();
      if (!validate(e.target)) return;
      const first = $('#qname').value.trim().split(/\s+/)[0];
      const sel = $('#enqSel') ? $('#enqSel').value : '';
      openModal(`<div class="m-body">
        <img class="done-mark" src="assets/logo/symbol-lime.svg" alt="">
        <p class="label lime">You're in the draw</p>
        <h2 class="m-title">Good call, ${esc(first)}.</h2>
        <p class="m-sub">${done(esc(sel))}</p>
          <div class="m-actions"><button class="btn btn-lime" data-action="close">Close</button></div>
      </div>`);
    });
  }

  /* ---------- Events ---------- */
  function nextDates(e, n) {
    const out = [], d = new Date();
    d.setHours(0, 0, 0, 0);
    if (e.monthly) {
      let m = d.getMonth(), y = d.getFullYear();
      while (out.length < n) {
        const f = new Date(y, m, 1);
        f.setDate(1 + (e.weekday - f.getDay() + 7) % 7);
        if (f >= d) out.push(f);
        m++;
      }
      return out;
    }
    d.setDate(d.getDate() + (e.weekday - d.getDay() + 7) % 7);
    for (let i = 0; i < n; i++) out.push(new Date(d.getFullYear(), d.getMonth(), d.getDate() + i * 7));
    return out;
  }
  const dateFmt = d => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const event = id => C.events.find(e => e.id === id);
  function showEvent(id) {
    const e = event(id), full = e.status === 'Full';
    openModal(`${photo(e.img, e.alt)}<div class="m-body">
      <div class="event-tags"><span class="chip label chip-${e.tone}">${e.type}</span>${statusChip(e.status)}</div>
      <h2 class="m-title">${e.name}</h2>
      <p class="m-sub">${e.desc} ${e.more}</p>
      <p class="m-meta"><strong>${e.details}</strong><br>Next date: ${dateFmt(nextDates(e, 1)[0])}</p>
      <div class="m-actions">
        <button class="btn btn-lime" data-action="event-join" data-arg="${e.id}">${full ? 'Join the Waitlist' : e.status === 'Upcoming' ? 'Register Interest' : 'Register Now'}</button>
        <button class="btn btn-outline" data-action="events">All Events</button>
      </div>
    </div>`);
  }
  function showCalendar() {
    const rows = C.events.flatMap(e => nextDates(e, e.monthly ? 2 : 3).map(d => ({ d, e }))).sort((a, b) => a.d - b.d);
    openModal(`<div class="m-body">
      <p class="label lime">Club Calendar</p>
      <h2 class="m-title">What's coming up</h2>
      <ul class="cal-list">${rows.map(({ d, e }) => `<li>
        <span>${dateFmt(d)} · ${e.time} · ${e.status}</span><b>${e.name}</b>
        <button class="arrow-link" data-action="event" data-arg="${e.id}" aria-label="View ${e.name}">View ${arrow}</button></li>`).join('')}</ul>
    </div>`);
  }

  /* ---------- Booking flow ---------- */
  const STEPS = ['Date', 'Court', 'Time', 'Details', 'Summary'];
  const fresh = () => { const n = new Date(); return { step: 1, y: n.getFullYear(), m: n.getMonth(), date: null, court: null, time: null, name: '', email: '', phone: '', players: 4 }; };
  let B = fresh();
  const dKey = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const parseKey = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  const longDate = k => parseKey(k).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const court = () => C.courts.find(c => c.id === B.court);
  function slotPassed(key, slot) {
    const t = new Date();
    if (key !== dKey(t.getFullYear(), t.getMonth(), t.getDate())) return false;
    const m = slot.match(/(\d+):(\d+) (AM|PM)/);
    const h = (+m[1] % 12) + (m[3] === 'PM' ? 12 : 0);
    return h * 60 + +m[2] <= t.getHours() * 60 + t.getMinutes();
  }

  function calHTML() {
    const t = new Date(), today = dKey(t.getFullYear(), t.getMonth(), t.getDate());
    const first = new Date(B.y, B.m, 1), days = new Date(B.y, B.m + 1, 0).getDate();
    const lead = (first.getDay() + 6) % 7;
    const atStart = B.y === t.getFullYear() && B.m === t.getMonth();
    let cells = '';
    for (let i = 0; i < lead; i++) cells += '<span></span>';
    for (let d = 1; d <= days; d++) {
      const k = dKey(B.y, B.m, d), past = k < today;
      cells += `<button type="button" data-date="${k}" ${past ? 'disabled' : ''} class="${k === today ? 'today' : ''}" aria-pressed="${B.date === k}" aria-label="${longDate(k)}${past ? ', unavailable' : ''}">${d}</button>`;
    }
    return `<div class="cal-head">
        <b aria-live="polite">${first.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</b>
        <div class="cal-nav">
          <button type="button" class="sq" data-month="-1" aria-label="Previous month" ${atStart ? 'disabled' : ''}><svg class="flip" aria-hidden="true"><use href="#arrow"/></svg></button>
          <button type="button" class="sq" data-month="1" aria-label="Next month"><svg aria-hidden="true"><use href="#arrow"/></svg></button>
        </div>
      </div>
      <div class="cal-grid">${['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(x => `<span class="cal-dow">${x}</span>`).join('')}${cells}</div>`;
  }

  const summaryRows = () => `
    <div><dt>Date</dt><dd>${longDate(B.date)}</dd></div>
    <div><dt>Court</dt><dd>${court().name}</dd></div>
    <div><dt>Time</dt><dd>${B.time}</dd></div>
    <div><dt>Players</dt><dd>${B.players}</dd></div>`;

  const stepViews = {
    1: () => `<h2 class="m-title" tabindex="-1">When do you play?</h2><div class="cal" id="cal">${calHTML()}</div>`,
    2: () => `<h2 class="m-title" tabindex="-1">Pick your court</h2>
      <div class="opt-courts">${C.courts.map(c => `<button type="button" class="opt-court" data-court="${c.id}" aria-pressed="${B.court === c.id}">
        <span class="ph">${pic(c.img, '', '110px', true)}</span>
        <span><b>${c.name}</b><small>${c.details[0]}</small></span>
        <em>${rupee(c.rate)}</em></button>`).join('')}</div>
      <p class="m-meta">Prices are per ${C.booking.session}.</p>`,
    3: () => `<h2 class="m-title" tabindex="-1">Pick your time</h2>
      <p class="m-sub">${court().name}, ${longDate(B.date)}.</p>
      <div class="opt-slots">${C.booking.slots.map(s => {
        const gone = slotPassed(B.date, s);
        return `<button type="button" data-slot="${s}" aria-pressed="${B.time === s}" ${gone ? 'disabled' : ''}>${s}</button>`;
      }).join('')}</div>`,
    4: () => `<h2 class="m-title" tabindex="-1">Who's playing?</h2>
      <form id="bkForm" novalidate><div class="fields">
        ${field('bname', 'Full name', 'text', B.name, 'name', 'autocomplete="name"', true)}
        ${field('bemail', 'Email address', 'email', B.email, 'email', 'autocomplete="email"')}
        ${field('bphone', 'Phone number', 'tel', B.phone, 'phone', 'autocomplete="tel"')}
        <fieldset class="field full"><legend>Number of players</legend>
          <div class="seg">${C.booking.players.map(n => `<label><input type="radio" name="players" value="${n}" ${B.players === n ? 'checked' : ''}><span>${n}</span></label>`).join('')}</div>
        </fieldset>
      </div><button type="submit" hidden></button></form>`,
    5: () => `<h2 class="m-title" tabindex="-1">Lock it in</h2>
      <dl class="summary">${summaryRows()}
        <div><dt>Booked by</dt><dd>${esc(B.name)}</dd></div>
        <div class="total"><dt>Price<br><small>${C.booking.session}</small></dt><dd>${rupee(court().rate)}</dd></div>
      </dl>`
  };

  function renderBooking() {
    if (B.step === 6) {
      const first = esc(B.name.trim().split(/\s+/)[0]);
      openModal(`<div class="booking"><div class="bk-top label">Book a Court</div>
        <div class="bk-step"><img class="done-mark" src="assets/logo/symbol-lime.svg" alt="">
        <h2 class="m-title">See you on court, ${first}.</h2>
        <p class="m-sub">Here's your booking.</p>
        <dl class="summary">${summaryRows()}</dl></div>
        <div class="bk-foot"><button class="bk-back" data-action="book-again">Book another</button><button class="btn btn-lime" data-action="close">Done</button></div></div>`);
      B = fresh();
      return;
    }
    openModal(`<div class="booking">
      <div class="bk-top label">Book a Court</div>
      <ol class="stepper" aria-label="Booking progress, step ${B.step} of 5">${STEPS.map((s, i) => {
        const n = i + 1;
        return `<li>${n < B.step ? `<button class="done" data-goto="${n}" aria-label="Back to ${s}">${s}</button>` : `<span class="${n === B.step ? 'now' : ''}" ${n === B.step ? 'aria-current="step"' : ''}>${s}</span>`}</li>`;
      }).join('')}</ol>
      <div class="bk-step">${stepViews[B.step]()}</div>
      <div class="bk-foot">
        ${B.step > 1 ? '<button class="bk-back" data-bk="back">← Back</button>' : '<span></span>'}
        <p class="err" id="bkErr" role="alert"></p>
        <button class="btn btn-lime" data-bk="next">${B.step === 5 ? 'Confirm Booking' : 'Continue'}</button>
      </div>
    </div>`);
  }
  function saveDetails() {
    const f = $('#bkForm');
    if (!f) return;
    B.name = $('#bname').value; B.email = $('#bemail').value; B.phone = $('#bphone').value;
    B.players = +$('input[name=players]:checked', f).value;
  }
  function bkNext() {
    const err = $('#bkErr');
    if (B.step === 1 && !B.date) { err.textContent = 'Choose a date to continue.'; return; }
    if (B.step === 2 && !B.court) { err.textContent = 'Choose a court to continue.'; return; }
    if (B.step === 3 && !B.time) { err.textContent = 'Choose a time to continue.'; return; }
    if (B.step === 4) { saveDetails(); if (!validate($('#bkForm'))) return; }
    B.step++;
    renderBooking();
  }
  inner.addEventListener('submit', e => { if (e.target.id === 'bkForm') { e.preventDefault(); bkNext(); } });
  inner.addEventListener('input', e => { if (e.target.closest('#bkForm')) saveDetails(); });
  inner.addEventListener('click', e => {
    const t = e.target;
    const pick = (sel, attr, set) => {
      const b = t.closest(sel);
      if (!b) return false;
      set(b.dataset[attr]);
      $$(sel, inner).forEach(x => x.setAttribute('aria-pressed', x === b));
      const er = $('#bkErr'); if (er) er.textContent = '';
      return true;
    };
    if (pick('[data-date]', 'date', v => { B.date = v; if (B.time && slotPassed(v, B.time)) B.time = null; })) return;
    if (pick('[data-court]', 'court', v => { B.court = v; })) return;
    if (pick('[data-slot]', 'slot', v => { B.time = v; })) return;
    const mon = t.closest('[data-month]');
    if (mon) {
      const d = new Date(B.y, B.m + +mon.dataset.month, 1);
      B.y = d.getFullYear(); B.m = d.getMonth();
      const dir = mon.dataset.month;
      $('#cal').innerHTML = calHTML();
      const again = $(`[data-month="${dir}"]`, inner);
      (again.disabled ? $('[data-month="1"]', inner) : again).focus();
      return;
    }
    const go = t.closest('[data-goto]');
    if (go) { saveDetails(); B.step = +go.dataset.goto; renderBooking(); return; }
    const bk = t.closest('[data-bk]');
    if (bk) {
      if (bk.dataset.bk === 'next') bkNext();
      else { saveDetails(); B.step--; renderBooking(); }
    }
  });
  function openBooking(courtId) {
    if (courtId) B.court = courtId;
    renderBooking();
  }

  /* ---------- Delegated actions ---------- */
  const actions = {
    close: closeModal,
    book: () => { setMenu(false); openBooking(); },
    'book-again': () => openBooking(),
    'book-court': id => { B.step = 1; openBooking(id); },
    court: id => {
      const c = C.courts.find(x => x.id === id);
      openModal(`${photo(c.img, c.alt)}<div class="m-body">
        <p class="label lime">Court ${c.no}</p>
        <h2 class="m-title">${c.name}</h2>
        <p class="m-sub">${c.desc}</p>
        <ul class="m-list">${c.details.map(d => `<li>${d}</li>`).join('')}</ul>
        <p class="m-meta">From ${rupee(c.rate)} per ${C.booking.session}.</p>
        <div class="m-actions"><button class="btn btn-lime" data-action="book-court" data-arg="${c.id}">Book This Court</button></div>
      </div>`);
    },
    experience: i => {
      const x = C.experience[+i];
      openModal(`${photo(x.img, x.alt)}<div class="m-body">
        <p class="label lime">Experience ${x.no}</p>
        <h2 class="m-title">${x.name}</h2>
        <p class="m-sub">${x.desc} ${x.more}</p>
        <div class="m-actions"><button class="btn btn-lime" data-action="book">Book a Court</button><button class="btn btn-outline" data-action="contact">Plan a Visit</button></div>
      </div>`);
    },
    plan: id => {
      const p = C.plans.find(x => x.id === id);
      enquiry({
        eyebrow: 'Membership Enquiry', title: p.name,
        sub: `From ${p.price} ${p.per}. Leave your details and the membership team will walk you through it.`,
        select: { label: 'Membership', options: C.plans.map(x => x.id), value: id }, message: true,
        done: v => `You've picked ${v}. The membership team will take it from here.`
      });
    },
    coaching: () => enquiry({
      eyebrow: 'Coaching Enquiry', title: 'Level up',
      sub: 'Tell us where your game is and we’ll point you to the right session.',
      select: { label: 'Session', options: C.coaching.map(x => x.id), value: coachSel }, message: true,
      done: v => `${v} is a solid place to start. A coach will follow up with you.`
    }),
    event: showEvent,
    events: showCalendar,
    'event-join': id => enquiry({
      eyebrow: event(id).status === 'Full' ? 'Waitlist' : 'Registration', title: event(id).name, sub: event(id).details,
      done: () => `You've put your name down for ${event(id).name}. The details will follow by email.`
    }),
    contact: () => enquiry({
      eyebrow: 'Get in Touch', title: 'Talk to the club', sub: 'Send us a message and the club will get back to you.', message: true,
      done: () => 'Message noted. Someone from the club will reply soon.'
    }),
    location: () => openModal(`<div class="m-body"><p class="label lime">Location</p><h2 class="m-title">${esc(C.contact.city)}</h2>
      <p class="m-sub">${esc(C.contact.hours)}. Members and guests welcome.</p>
      <div class="m-actions"><button class="btn btn-lime" data-action="book">Book a Court</button></div></div>`),
    faq: () => openModal(`<div class="m-body"><p class="label lime">FAQs</p><h2 class="m-title">Good to know</h2>
      <div style="width:100%">${C.faqs.map(([q, a]) => `<div class="faq-item"><h3>${q}</h3><p>${a}</p></div>`).join('')}</div></div>`),
    legal: k => openModal(`<div class="m-body"><p class="label lime">Legal</p><h2 class="m-title">${k === 'terms' ? 'Terms &amp; Conditions' : 'Privacy Policy'}</h2>
      <p class="m-sub">${k === 'terms' ? 'Court bookings and memberships are subject to the club rules.' : 'We only use the details you share to handle your bookings, memberships and enquiries. We never sell your information.'}</p></div>`)
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-action]');
    if (b) actions[b.dataset.action](b.dataset.arg);
  });

  /* ---------- Lightbox ---------- */
  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
  let lbI = 0, lbX = null;
  function lbShow(i) {
    const n = C.gallery.length;
    lbI = (i + n) % n;
    const g = C.gallery[lbI];
    lbImg.style.opacity = 0;
    const src = `assets/img/${g.img}-lg.webp`;
    const pre = new Image();
    pre.onload = pre.onerror = () => {
      if (C.gallery[lbI] !== g) return;
      lbImg.src = src;
      lbImg.alt = g.alt;
      lbCap.innerHTML = `<span>${esc(g.cap)}</span><span>${lbI + 1} / ${n}</span>`;
      lbImg.style.opacity = 1;
    };
    pre.src = src;
  }
  function lbClose() {
    lb.classList.remove('show');
    setTimeout(() => { lb.close(); lockGutter(false); }, calm ? 0 : 220);
  }
  $('[data-render="gallery"]').addEventListener('click', e => {
    const b = e.target.closest('[data-lb-open]');
    if (!b) return;
    lockGutter(true);
    lb.showModal();
    lbShow(+b.dataset.lbOpen);
    requestAnimationFrame(() => requestAnimationFrame(() => lb.classList.add('show')));
  });
  lb.addEventListener('click', e => {
    const b = e.target.closest('[data-lb]');
    if (b) ({ close: lbClose, prev: () => lbShow(lbI - 1), next: () => lbShow(lbI + 1) })[b.dataset.lb]();
    else if (e.target === lb || e.target.tagName === 'FIGURE') lbClose();
  });
  lb.addEventListener('cancel', e => { e.preventDefault(); lbClose(); });
  lb.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') lbShow(lbI - 1);
    if (e.key === 'ArrowRight') lbShow(lbI + 1);
  });
  lb.addEventListener('touchstart', e => { lbX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (lbX === null) return;
    const dx = e.changedTouches[0].clientX - lbX;
    if (Math.abs(dx) > 50) lbShow(lbI + (dx < 0 ? 1 : -1));
    lbX = null;
  });
})();
