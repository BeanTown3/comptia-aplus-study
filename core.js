/* Core: state, scoring, spaced repetition, routing, shared helpers. */
(function () {
  'use strict';
  const A = window.A = { views: {}, act: {}, chg: {}, inp: {}, after: {} };
  const KEY = 'aplus-study-v1';
  const DAY = 864e5;

  /* ---------- tiny helpers ---------- */
  A.$ = (s, r) => (r || document).querySelector(s);
  A.$$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = A.esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  A.shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  A.pct = (n, d) => d ? Math.round(100 * n / d) : 0;
  A.terms = q => (q || '').replace(/[*`]/g, ' ').split(/\s+/).filter(t => t.length >= 2);

  A.md = function (s, hl) {
    let t = String(s);
    if (hl && hl.length) {
      const re = new RegExp('(' + hl.map(x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');
      t = t.replace(re, '\u0001$1\u0002');
    }
    t = esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
    return t.replace(/\u0001/g, '<mark>').replace(/\u0002/g, '</mark>');
  };
  A.plain = s => String(s).replace(/\*\*/g, '').replace(/`/g, '');

  const ICONS = {
    today: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    notes: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    cards: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    practice: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    listen: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
    progress: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    play: '<polygon points="7 4 20 12 7 20 7 4" fill="currentColor"/>',
    pause: '<rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>',
    back: '<polygon points="19 20 9 12 19 4 19 20" fill="currentColor"/><line x1="5" y1="19" x2="5" y2="5"/>',
    fwd: '<polygon points="5 4 15 12 5 20 5 4" fill="currentColor"/><line x1="19" y1="5" x2="19" y2="19"/>',
    chev: '<polyline points="9 18 15 12 9 6"/>',
    chevl: '<polyline points="15 18 9 12 15 6"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    flame: '<path d="M12 2c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/>',
    alert: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    shuffle: '<polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/>',
    walk: '<circle cx="13" cy="4" r="2"/><path d="M7 21l3-7 3 3v5"/><path d="M10 14l2-5 4 2 2 3"/><path d="M8 11l4-2"/>'
  };
  A.ic = (n, cls) => `<svg class="ic ${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

  /* ---------- data lookups ---------- */
  const TOPIC = A.TOPIC = Object.fromEntries(TOPICS.map(t => [t.id, t]));
  const LESSON = A.LESSON = Object.fromEntries(LESSONS.map(l => [l.id, l]));
  const CARD = A.CARD = Object.fromEntries(CARDS.map(c => [c.id, c]));
  const QUES = A.QUES = Object.fromEntries(QUESTIONS.map(q => [q.id, q]));

  /* ---------- persistent state ---------- */
  const defaults = () => ({
    v: 1, cards: {}, q: {}, events: [], sessions: [], listen: [], days: {},
    tot: { c: 0, q: 0, ok: 0 },
    settings: { goal: 20, newPer: 10, speed: 1, voice: '', delay: 5, wake: true, sleep: 0 }
  });
  const S = A.S = (function () {
    const d = defaults();
    try {
      const r = JSON.parse(localStorage.getItem(KEY));
      if (r && r.v === 1) {
        Object.assign(d, r);
        d.settings = Object.assign(defaults().settings, r.settings || {});
        d.tot = Object.assign(defaults().tot, r.tot || {});
      }
    } catch (e) { /* storage blocked or corrupt: start fresh */ }
    return d;
  })();
  A.save = function () { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } };
  A.replaceState = function (obj) {
    Object.keys(S).forEach(k => delete S[k]);
    const d = defaults();
    Object.assign(S, d, obj || {});
    S.settings = Object.assign(d.settings, (obj && obj.settings) || {});
    S.tot = Object.assign(d.tot, (obj && obj.tot) || {});
    A.save();
  };

  /* ---------- dates ---------- */
  const dayKey = A.dayKey = d => { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  A.fmtIn = ms => {
    const m = Math.round(ms / 60000);
    if (m < 60) return Math.max(1, m) + 'm';
    const h = Math.round(m / 60);
    if (h < 24) return h + 'h';
    const d = Math.round(ms / DAY);
    if (d < 30) return d + 'd';
    return Math.round(d / 30) + 'mo';
  };
  A.ago = t => {
    const ms = Date.now() - t, m = Math.floor(ms / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return m + 'm ago';
    const h = Math.floor(m / 60);
    if (h < 24) return h + 'h ago';
    const d = Math.floor(h / 24);
    return d === 1 ? 'yesterday' : d + 'd ago';
  };
  A.shortDate = t => new Date(t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  /* ---------- activity / evidence ---------- */
  A.logEvent = function (topic, kind, score, ref, extra) {
    S.events.push({ t: Date.now(), topic, kind, s: score, ref, x: extra });
    if (S.events.length > 2500) S.events.splice(0, S.events.length - 2500);
    const k = dayKey();
    const d = S.days[k] || (S.days[k] = { c: 0, q: 0, l: 0 });
    d[kind] = (d[kind] || 0) + 1;
    if (kind === 'c') S.tot.c++;
    if (kind === 'q') { S.tot.q++; if (extra && extra.ok) S.tot.ok++; }
  };
  A.todayCount = () => { const d = S.days[dayKey()]; return d ? (d.c || 0) + (d.q || 0) : 0; };
  A.streak = function () {
    const has = k => { const v = S.days[k]; return !!v && ((v.c || 0) + (v.q || 0) + (v.l || 0)) > 0; };
    const d = new Date();
    if (!has(dayKey(d))) d.setDate(d.getDate() - 1);
    let n = 0;
    while (has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  };
  A.lastStudied = function () {
    const last = S.events[S.events.length - 1];
    const l = S.listen[S.listen.length - 1];
    return Math.max(last ? last.t : 0, l ? l.t : 0) || 0;
  };

  /* ---------- mastery and weak topics ---------- */
  A.qScore = (ok, conf) => ok ? (conf === 'sure' ? 1 : conf === 'think' ? 0.85 : 0.4) : (conf === 'guess' ? 0.1 : conf === 'think' ? 0.05 : 0);
  A.cScore = [0, 0.5, 0.85, 1];
  A.topicEvents = id => S.events.filter(e => e.topic === id && (e.kind === 'c' || e.kind === 'q')).slice(-12);
  A.mastery = function (id) {
    const ev = A.topicEvents(id);
    if (!ev.length) return null;
    return ev.reduce((a, e) => a + e.s, 0) / ev.length;
  };
  A.flagged = id => QUESTIONS.filter(q => (!id || q.topic === id) && S.q[q.id] && S.q[q.id].retest);
  A.weakTopics = function () {
    return TOPICS.map(t => ({ t, m: A.mastery(t.id), n: A.topicEvents(t.id).length, flagged: A.flagged(t.id).length }))
      .filter(x => x.m !== null && ((x.n >= 2 && x.m < 0.7) || x.flagged >= 2))
      .sort((a, b) => a.m - b.m);
  };
  A.lessonMastery = function (lessonId) {
    const ts = TOPICS.filter(t => t.lesson === lessonId).map(t => A.mastery(t.id)).filter(m => m !== null);
    return ts.length ? ts.reduce((a, b) => a + b, 0) / ts.length : null;
  };

  /* ---------- scope pickers shared by Cards, Practice, Listen ---------- */
  A.inScope = function (topic, scope) {
    if (!scope || scope === 'all') return true;
    if (scope === '4' || scope === '5') return TOPIC[topic].sec === +scope;
    if (scope === 'weak') return A.weakTopics().some(w => w.t.id === topic);
    if (scope.startsWith('topic:')) return topic === scope.slice(6);
    if (scope.startsWith('lesson:')) return TOPIC[topic].lesson === +scope.slice(7);
    return true;
  };
  A.scopeLabel = function (scope) {
    if (!scope || scope === 'all') return 'Sections 4 and 5';
    if (scope === '4') return 'Section 4: CPUs';
    if (scope === '5') return 'Section 5: RAM';
    if (scope === 'weak') return 'Weak topics';
    if (scope.startsWith('topic:')) return TOPIC[scope.slice(6)].name;
    if (scope.startsWith('lesson:')) { const l = LESSON[+scope.slice(7)]; return 'Lesson ' + l.id + ': ' + l.title; }
    return scope;
  };
  A.scopeSelect = function (cur, change, withWeak) {
    const o = (v, label) => `<option value="${v}"${cur === v ? ' selected' : ''}>${esc(label)}</option>`;
    let h = `<select class="sel" data-change="${change}" aria-label="Choose topics">`;
    h += o('all', 'Sections 4 and 5') + o('4', 'Section 4: CPUs') + o('5', 'Section 5: RAM');
    if (withWeak) h += o('weak', 'Weak topics only');
    h += '<optgroup label="Section 4">' + LESSONS.filter(l => l.sec === 4).map(l => o('lesson:' + l.id, 'Lesson ' + l.id + ': ' + l.title)).join('') + '</optgroup>';
    h += '<optgroup label="Section 5">' + LESSONS.filter(l => l.sec === 5).map(l => o('lesson:' + l.id, 'Lesson ' + l.id + ': ' + l.title)).join('') + '</optgroup>';
    if (cur && cur.startsWith('topic:')) h += o(cur, A.scopeLabel(cur));
    return h + '</select>';
  };

  /* ---------- spaced repetition (SM-2 style) ---------- */
  A.schedule = function (prev, r) {
    const c = prev ? Object.assign({}, prev) : { ease: 2.5, int: 0, reps: 0, lapses: 0 };
    const now = Date.now();
    if (r === 0) { c.lapses++; c.reps = 0; c.int = 0; c.ease = Math.max(1.3, c.ease - 0.2); c.due = now + 10 * 60000; }
    else if (r === 1) { c.int = c.reps === 0 ? 0.5 : Math.max(1, Math.round(c.int * 1.2)); c.ease = Math.max(1.3, c.ease - 0.15); c.reps++; c.due = now + c.int * DAY; }
    else if (r === 2) { c.int = c.reps === 0 ? 1 : c.reps === 1 ? 3 : Math.max(1, Math.round(c.int * c.ease)); c.reps++; c.due = now + c.int * DAY; }
    else { c.int = c.reps === 0 ? 4 : Math.max(2, Math.round(Math.max(c.int, 1) * c.ease * 1.3)); c.ease += 0.15; c.reps++; c.due = now + c.int * DAY; }
    c.last = now;
    return c;
  };
  A.dueCards = (scope) => CARDS.filter(c => S.cards[c.id] && S.cards[c.id].due <= Date.now() && A.inScope(c.topic, scope)).sort((a, b) => S.cards[a.id].due - S.cards[b.id].due);
  A.newCards = (scope) => CARDS.filter(c => !S.cards[c.id] && A.inScope(c.topic, scope));

  /* ---------- routing and rendering ---------- */
  const NAV = [
    ['today', 'Today'], ['notes', 'Notes'], ['cards', 'Cards'],
    ['practice', 'Quiz'], ['listen', 'Listen'], ['progress', 'Progress']
  ];
  // The route lives in memory so it still works where the page cannot change its own URL (embedded viewers).
  let cur = location.hash.replace(/^#\/?/, '');
  A.route = function () {
    const parts = cur.split('/');
    return { name: A.views[parts[0]] ? parts[0] : 'today', arg: parts[1] };
  };
  function setRoute(hash) {
    const next = hash.replace(/^#\/?/, '');
    const changed = next !== cur;
    cur = next;
    if (changed) { try { location.hash = '#/' + next; } catch (e) { /* URL is read-only here */ } }
    A.render(false);
  }
  A.go = setRoute;
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#/"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    setRoute(a.getAttribute('href'));
  });

  function navHTML(active, cls) {
    return NAV.map(([id, label]) =>
      `<a href="#/${id}" class="nav-item${id === active ? ' on' : ''}"${id === active ? ' aria-current="page"' : ''}>${A.ic(id)}<span>${label}</span></a>`).join('');
  }

  A.render = function (keep) {
    const y = window.scrollY;
    const r = A.route();
    const main = A.$('#main');
    try {
      main.innerHTML = A.views[r.name](r.arg);
    } catch (err) {
      console.error(err);
      main.innerHTML = '<div class="page"><h1 class="large">Something went wrong</h1><p class="muted">' + esc(err.message) + '</p></div>';
    }
    A.$('#tabbar').innerHTML = navHTML(r.name);
    A.$('#sidebar-nav').innerHTML = navHTML(r.name);
    if (A.after[r.name]) A.after[r.name](r.arg, !!keep);
    window.scrollTo(0, keep ? y : 0);
  };
  A.rerender = () => A.render(true);

  /* ---------- event delegation ---------- */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true') return;
    const fn = A.act[el.dataset.act];
    if (fn) { e.preventDefault(); fn(el.dataset, el, e); }
  });
  document.addEventListener('change', e => {
    const el = e.target.closest('[data-change]');
    if (el && A.chg[el.dataset.change]) A.chg[el.dataset.change](el, e);
  });
  document.addEventListener('input', e => {
    const el = e.target.closest('[data-inp]');
    if (el && A.inp[el.dataset.inp]) A.inp[el.dataset.inp](el, e);
  });
  window.addEventListener('hashchange', () => {
    const n = location.hash.replace(/^#\/?/, '');
    if (n !== cur) { cur = n; A.render(false); }
  });

  document.addEventListener('DOMContentLoaded', () => {
    A.render(false);
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
      navigator.serviceWorker.register('sw.js').catch(() => { /* offline cache is optional */ });
    }
  });
})();
