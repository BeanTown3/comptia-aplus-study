/* Views: Cards (spaced repetition), Practice (quiz + PBQ), Listen (walking mode). */
(function () {
  'use strict';
  const A = window.A, S = A.S, esc = A.esc, md = A.md, ic = A.ic;

  const plural = (n, w) => n + ' ' + w + (n === 1 ? '' : 's');
  const seg = (items, cur, act) => `<div class="seg" role="group">${items.map(([v, l]) =>
    `<button class="${String(cur) === String(v) ? 'on' : ''}" data-act="${act}" data-v="${v}" aria-pressed="${String(cur) === String(v)}">${l}</button>`).join('')}</div>`;

  /* ================================ CARDS ================================ */
  // Rating is optional: Next just moves on. Three lights sit on top of the spaced-repetition schedule:
  // red = again (didn't know it), yellow = review (shaky), green = good (know it).
  // Rated red or yellow, a card recycles in the session until it turns green.
  const LIGHTS = [['red', 'Again'], ['yellow', 'Review'], ['green', 'Good']];
  const LIGHT_NAME = { red: 'Red', yellow: 'Yellow', green: 'Green', new: 'New' };
  const C = { phase: 'setup', scope: 'all', mode: 'due', filter: 'all', queue: [], i: 0, flipped: false, stats: [0, 0, 0], initial: 0, greened: new Set(), rated: new Set(), swipedAt: 0 };
  A.setCardScope = s => { C.scope = s; C.filter = 'all'; C.phase = 'setup'; };

  function lightOf(id) {
    const s = S.cards[id];
    if (!s) return 'new';
    if (s.light) return s.light;
    return s.reps === 0 ? 'red' : s.int < 1 ? 'yellow' : 'green'; // cards reviewed before the lights existed
  }

  function lightCounts() {
    const n = { red: 0, yellow: 0, green: 0, new: 0 };
    CARDS.forEach(c => { if (A.inScope(c.topic, C.scope)) n[lightOf(c.id)]++; });
    return n;
  }

  function cardQueue() {
    if (C.mode === 'due' && C.filter === 'all') {
      return A.dueCards(C.scope).map(c => c.id).concat(A.newCards(C.scope).slice(0, S.settings.newPer).map(c => c.id));
    }
    return A.shuffle(CARDS.filter(c => A.inScope(c.topic, C.scope) && (C.filter === 'all' || lightOf(c.id) === C.filter))).map(c => c.id);
  }

  function cardsSetup() {
    const n = cardQueue().length;
    const counts = lightCounts();
    const inDeck = counts.red + counts.yellow + counts.green + counts.new;
    const due = A.dueCards(C.scope).length;
    const barSeg = k => counts[k] ? `<i class="${k}" style="width:${(100 * counts[k] / inDeck).toFixed(1)}%"></i>` : '';
    const chips = [['all', 'All', inDeck], ['red', 'Red', counts.red], ['yellow', 'Yellow', counts.yellow], ['green', 'Green', counts.green], ['new', 'New', counts.new]];
    const browse = C.mode === 'browse';
    const modeNote = C.filter !== 'all' ? `Every ${LIGHT_NAME[C.filter].toLowerCase()} card in this deck, shuffled.`
      : C.mode === 'due' ? `${due} due now, plus up to ${S.settings.newPer} new.`
      : C.mode === 'cram' ? 'Every card in this deck, shuffled, whether due or not.'
      : 'Flip through the deck in random order with no rating.';
    return `<div class="page">
      <h1 class="large">Flashcards</h1>
      <p class="muted">Flip through the cards and tap <b>Next</b> to move on. Rating is optional. When you want to track a card, tap a light: <b class="c-red">Again</b> if you didn't know it, <b class="c-yellow">Review</b> if it's shaky, <b class="c-green">Good</b> if you know it. Again and Review cards come back later in the session.</p>
      <section class="card">
        <div class="lbar" role="img" aria-label="Card lights">${barSeg('red')}${barSeg('yellow')}${barSeg('green')}${barSeg('new')}</div>
        <div class="lchips">${chips.map(([k, l, c]) => `<button class="lchip${C.filter === k ? ' on' : ''}" data-act="cFilter" data-v="${k}" aria-pressed="${C.filter === k}">${k === 'all' ? '' : `<i class="ldot ${k}"></i>`}${l} <b>${c}</b></button>`).join('')}</div>
      </section>
      <div class="list">
        <div class="li stack-li"><b>Deck</b>${A.scopeSelect(C.scope, 'cScope', true)}</div>
        <div class="li stack-li"><b>Mode</b>${seg([['due', 'Due and new'], ['cram', 'Shuffle all'], ['browse', 'Browse']], C.mode, 'cMode')}</div>
      </div>
      <p class="muted small">${modeNote}</p>
      <button class="btn primary wide" data-act="cStart" ${n ? '' : 'disabled'}>${n ? (browse ? 'Browse ' : 'Start ') + plural(n, 'card') : 'Nothing to show here'}</button>
      ${!n ? '<p class="muted small center">Pick another color or mode, or come back when cards are due.</p>' : ''}
    </div>`;
  }

  function dotHTML(id) {
    const l = lightOf(id);
    return `<i class="ldot ${l}" title="${LIGHT_NAME[l]}"></i>`;
  }

  function cardsRun() {
    const id = C.queue[C.i], card = A.CARD[id], browse = C.mode === 'browse';
    const total = C.queue.length;
    const at = C.i + 1;
    const pct = total ? Math.round(100 * at / total) : 0;
    const t = A.TOPIC[card.topic];
    const long = A.plain(card.b).length > 120 ? ' long' : '';
    const dot = dotHTML(id);
    return `<div class="page study">
      <div class="topbar"><button class="icon-btn" data-act="cEnd" aria-label="End session">${ic('x')}</button>
        <div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>
        <span class="count">${at}/${total}</span></div>
      <div class="flip${C.flipped ? ' on' : ''}" data-act="cFlip" role="button" tabindex="0" aria-label="${C.flipped ? 'Showing answer' : 'Tap to show answer'}">
        <div class="flip-in">
          <div class="face front">${dot}<span class="chip">${esc(t.name)}</span><div class="ftxt">${md(card.f)}</div><span class="hint">Tap to reveal</span></div>
          <div class="face back${long}">${dot}<span class="chip">Answer</span><div class="ftxt">${md(card.b)}</div><span class="hint dimmer">${md(card.f)}</span></div>
        </div>
      </div>
      ${browse ? '' : `<div class="lights${C.flipped ? ' show' : ''}">
        ${LIGHTS.map(([c, l], r) => `<button class="lbtn ${c}" data-act="cRate" data-r="${r}" ${C.flipped ? '' : 'tabindex="-1"'}><i class="lamp"></i><b>${l}</b></button>`).join('')}
      </div>`}
      <div class="cnav">
        <button class="cn" data-act="cBack" ${C.i ? '' : 'disabled'}>${ic('chevl')} Back</button>
        <button class="cn" data-act="cShuffle">${ic('shuffle')} Shuffle</button>
        <button class="cn next" data-act="cNext">Next ${ic('chev')}</button>
      </div>
      <p class="muted small center kbd">Space to flip &middot; ${browse ? '' : '1 2 3 to rate (optional) &middot; '}arrows to move &middot; S to shuffle</p>
      <p class="muted small center swipehint">${browse ? 'Swipe the card left for next, right for back' : 'Swipe to move on. After flipping: left = red, down = yellow, right = green'}</p>
    </div>`;
  }

  function cardsDone() {
    if (C.mode === 'browse' || !C.stats.some(Boolean)) {
      return `<div class="page">
        <div class="done-badge">${ic('check')}</div>
        <h1 class="large center">End of deck</h1>
        <p class="muted center">You went through ${plural(C.queue.length, 'card')}.</p>
        <button class="btn primary wide" data-act="cStart">${ic('shuffle')} Shuffle and go again</button>
        <button class="btn tinted wide" data-act="cAgain">Back to decks</button>
      </div>`;
    }
    const total = C.stats.reduce((a, b) => a + b, 0);
    return `<div class="page">
      <div class="done-badge">${ic('check')}</div>
      <h1 class="large center">Session complete</h1>
      <p class="muted center">${plural(total, 'rating')} &middot; ${A.pct(C.stats[2], total)}% good</p>
      <div class="stat-row">
        <div class="stat"><b class="c-red">${C.stats[0]}</b><span>again</span></div>
        <div class="stat"><b class="c-yellow">${C.stats[1]}</b><span>review</span></div>
        <div class="stat"><b class="c-green">${C.stats[2]}</b><span>good</span></div>
      </div>
      <button class="btn primary wide" data-act="cAgain">Back to decks</button>
      <a class="btn tinted wide" href="#/practice">${ic('practice')} Take a quiz on this</a>
    </div>`;
  }

  A.views.cards = () => C.phase === 'run' ? cardsRun() : C.phase === 'done' ? cardsDone() : cardsSetup();
  A.chg.cScope = el => { C.scope = el.value; C.filter = 'all'; A.rerender(); };
  A.act.cMode = d => { C.mode = d.v; A.rerender(); };
  A.act.cFilter = d => { C.filter = d.v; A.rerender(); };
  A.act.cStart = () => {
    C.queue = cardQueue();
    if (!C.queue.length) return;
    C.i = 0; C.flipped = false; C.stats = [0, 0, 0]; C.initial = C.queue.length; C.greened = new Set(); C.rated = new Set(); C.phase = 'run';
    A.rerender();
  };
  A.act.cFlip = () => {
    if (C.phase !== 'run' || Date.now() - C.swipedAt < 400) return;
    C.flipped = !C.flipped;
    const f = A.$('.flip'), r = A.$('.lights');
    if (!f) { A.rerender(); return; }
    // toggle in place so the 3D flip animates instead of re-rendering
    f.classList.toggle('on', C.flipped);
    f.setAttribute('aria-label', C.flipped ? 'Showing answer' : 'Tap to show answer');
    if (r) {
      r.classList.toggle('show', C.flipped);
      A.$$('.lbtn', r).forEach(b => { b.tabIndex = C.flipped ? 0 : -1; });
    }
  };
  A.act.cEnd = () => { C.phase = C.stats.some(Boolean) ? 'done' : 'setup'; A.rerender(); };
  A.act.cAgain = () => { C.phase = 'setup'; A.rerender(); };
  A.act.cBack = () => { if (C.phase !== 'run' || !C.i) return; C.i--; C.flipped = false; A.rerender(); };
  A.act.cNext = () => {
    if (C.phase !== 'run') return;
    C.i++; C.flipped = false;
    while (C.i < C.queue.length && C.greened.has(C.queue[C.i])) C.i++; // stale copies of cards already marked green
    if (C.i >= C.queue.length) C.phase = 'done';
    A.rerender();
  };
  A.act.cShuffle = () => {
    if (C.phase !== 'run' || C.i >= C.queue.length - 1) return;
    C.queue = C.queue.slice(0, C.i).concat(A.shuffle(C.queue.slice(C.i)));
    C.flipped = false; A.rerender();
  };
  A.act.cRate = d => {
    if (C.phase !== 'run' || C.mode === 'browse' || !C.flipped) return;
    const l = +d.r, id = C.queue[C.i], card = A.CARD[id];
    let r = l; // 0 again, 1 hard, 2 good
    if (l === 2 && lightOf(id) === 'green' && !C.rated.has(id)) r = 3; // green twice in a row spaces it out further
    S.cards[id] = A.schedule(S.cards[id], r);
    S.cards[id].light = LIGHTS[l][0];
    C.rated.add(id);
    A.logEvent(card.topic, 'c', A.cScore[r], id, r);
    C.stats[l]++;
    if (l === 2) C.greened.add(id);
    else {
      C.greened.delete(id);
      C.queue.splice(Math.min(C.i + (l === 0 ? 4 : 9), C.queue.length), 0, id);
    }
    C.i++; C.flipped = false;
    while (C.i < C.queue.length && C.greened.has(C.queue[C.i])) C.i++; // stale copies of cards already marked green
    if (C.i >= C.queue.length) C.phase = 'done';
    A.save(); A.rerender();
  };

  document.addEventListener('keydown', e => {
    if (A.route().name !== 'cards' || C.phase !== 'run' || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === ' ' || e.key === 'Enter') { if (e.target.closest('button')) return; e.preventDefault(); A.act.cFlip(); }
    else if (C.flipped && '123'.includes(e.key) && e.key) A.act.cRate({ r: String(+e.key - 1) });
    else if (e.key === 'ArrowLeft') A.act.cBack();
    else if (e.key === 'ArrowRight') A.act.cNext();
    else if (e.key === 's' || e.key === 'S') A.act.cShuffle();
  });

  // Swipe the card: left = red, down = yellow, right = green (browse: left = next, right = back).
  let T = null;
  function swipeAction(dx, dy) {
    const ax = Math.abs(dx), ay = Math.abs(dy);
    if (C.mode === 'browse') return ax > ay && ax > 60 ? (dx < 0 ? 'cNext' : 'cBack') : null;
    if (!C.flipped) return ax > ay && ax > 60 ? (dx < 0 ? 'cNext' : 'cBack') : null;
    if (ax > ay && ax > 60) return dx < 0 ? 0 : 2;
    if (dy > 60 && dy > ax) return 1;
    return null;
  }
  document.addEventListener('touchstart', e => {
    const f = e.target.closest && e.target.closest('.flip');
    if (!f || C.phase !== 'run' || e.touches.length !== 1) { T = null; return; }
    f.classList.remove('snap');
    T = { x: e.touches[0].clientX, y: e.touches[0].clientY, el: f, moved: false };
  }, { passive: true });
  document.addEventListener('touchmove', e => {
    if (!T) return;
    const dx = e.touches[0].clientX - T.x, dy = e.touches[0].clientY - T.y;
    if (Math.abs(dx) + Math.abs(dy) > 12) T.moved = true;
    if (!T.moved) return;
    T.el.style.transform = `translate(${dx}px, ${Math.max(0, dy)}px) rotate(${dx / 25}deg)`;
    const a = swipeAction(dx, dy);
    const tint = typeof a === 'number' ? LIGHTS[a][0] : a === 'cNext' ? 'next' : a === 'cBack' ? 'prev' : '';
    if (tint) T.el.dataset.sw = tint; else delete T.el.dataset.sw;
  }, { passive: true });
  function swipeEnd(e) {
    if (!T) return;
    const t = T; T = null;
    if (!t.moved) return;
    C.swipedAt = Date.now();
    const p = (e.changedTouches && e.changedTouches[0]) || { clientX: t.x, clientY: t.y };
    const a = swipeAction(p.clientX - t.x, p.clientY - t.y);
    if (a === null || e.type === 'touchcancel') {
      t.el.classList.add('snap'); t.el.style.transform = ''; delete t.el.dataset.sw;
    } else if (typeof a === 'number') A.act.cRate({ r: String(a) });
    else A.act[a]();
  }
  document.addEventListener('touchend', swipeEnd);
  document.addEventListener('touchcancel', swipeEnd);

  /* ================================ PRACTICE ================================ */
  const KINDS = [['recall', 'Recall'], ['compare', 'Comparison'], ['scenario', 'Scenario'], ['pbq', 'PBQ-style']];
  const KIND_NAME = { recall: 'Recall', compare: 'Comparison', scenario: 'Scenario', pbq: 'PBQ-style' };
  const Q = { phase: 'setup', scope: 'all', kinds: new Set(['recall', 'compare', 'scenario', 'pbq']), count: 10, mode: 'mixed', list: [], i: 0, cur: null, res: [], label: '', msg: '' };
  A.setQuizScope = s => { Q.scope = s; Q.mode = 'mixed'; Q.phase = 'setup'; };

  function retestPool() {
    const weakIds = new Set(A.weakTopics().map(w => w.t.id));
    const flagged = A.flagged().filter(q => A.inScope(q.topic, Q.scope));
    const rest = QUESTIONS.filter(q => weakIds.has(q.topic) && A.inScope(q.topic, Q.scope) && !flagged.includes(q));
    return A.shuffle(flagged).concat(A.shuffle(rest));
  }
  function mixedPool() {
    return A.shuffle(QUESTIONS.filter(q => A.inScope(q.topic, Q.scope) && Q.kinds.has(q.kind)));
  }
  function poolSize() { return Q.mode === 'retest' ? retestPool().length : mixedPool().length; }

  function mkCur(q) {
    const c = { q, conf: null, mark: null, checked: false, ok: null };
    if (q.type === 'mc') { c.order = A.shuffle(q.opts.map((_, i) => i)); c.sel = null; }
    else if (q.type === 'multi') { c.opts = A.shuffle(q.good.map(t => ({ t, g: true })).concat(q.bad.map(t => ({ t, g: false })))); c.sel = new Set(); }
    else if (q.type === 'order') {
      let p; let guard = 0;
      do { p = A.shuffle(q.items.map((_, i) => i)); guard++; } while (p.every((v, i) => v === i) && guard < 10);
      c.pool = p; c.placed = [];
    } else if (q.type === 'match') { c.rows = q.pairs.map(([p, a]) => ({ p, a, sel: '' })); c.choices = A.shuffle(Array.from(new Set(q.pairs.map(p => p[1])))); }
    return c;
  }
  function answered(c) {
    const q = c.q;
    if (q.type === 'mc') return c.sel !== null;
    if (q.type === 'multi') return c.sel.size > 0;
    if (q.type === 'order') return c.placed.length === q.items.length;
    return c.rows.every(r => r.sel);
  }
  function grade(c) {
    const q = c.q;
    if (q.type === 'mc') return c.order[c.sel] === 0;
    if (q.type === 'multi') return c.opts.every((o, i) => o.g === c.sel.has(i));
    if (q.type === 'order') return c.placed.every((idx, pos) => idx === pos);
    return c.rows.every(r => r.sel === r.a);
  }

  function qSetup() {
    const n = poolSize();
    const wk = A.weakTopics(), fl = A.flagged().length;
    return `<div class="page">
      <h1 class="large">Practice</h1>
      <p class="muted">Original recall, comparison, scenario and PBQ-style questions. Rate how sure you are on each one.</p>
      <div class="list">
        <div class="li stack-li"><b>Mode</b>${seg([['mixed', 'Mixed quiz'], ['retest', 'Retest weak spots']], Q.mode, 'qMode')}</div>
        <div class="li stack-li"><b>Topics</b>${A.scopeSelect(Q.scope, 'qScope', true)}</div>
        ${Q.mode === 'mixed' ? `<div class="li stack-li"><b>Question types</b><div class="chips">${KINDS.map(([k, l]) => `<button class="chip toggle${Q.kinds.has(k) ? ' on' : ''}" data-act="qKind" data-k="${k}" aria-pressed="${Q.kinds.has(k)}">${l}</button>`).join('')}</div></div>` : ''}
        <div class="li stack-li"><b>Length</b>${seg([[5, '5'], [10, '10'], [20, '20']], Q.count, 'qCount')}</div>
      </div>
      ${Q.mode === 'retest' ? `<section class="card"><b>Weak spots</b>
        <p class="muted small">${fl ? plural(fl, 'question') + ' flagged (missed, or marked "don’t know it").' : 'No flagged questions yet.'} ${wk.length ? 'Weak topics: ' + wk.slice(0, 4).map(w => esc(w.t.name) + ' ' + Math.round(w.m * 100) + '%').join(', ') + '.' : 'No weak topics yet.'}</p></section>` : ''}
      ${Q.msg ? `<p class="warn-text">${esc(Q.msg)}</p>` : ''}
      <button class="btn primary wide" data-act="qStart" ${n ? '' : 'disabled'}>${n ? 'Start ' + Math.min(Q.count, n) + ' questions' : (Q.mode === 'retest' ? 'No weak spots to retest yet' : 'No questions match')}</button>
      <p class="muted small center">${n} available</p>
    </div>`;
  }

  function qBody(c) {
    const q = c.q, done = c.checked;
    if (q.type === 'mc') {
      return `<div class="opts">${c.order.map((oi, pos) => {
        let cls = 'opt';
        if (done) { if (oi === 0) cls += ' right'; else if (c.sel === pos) cls += ' wrong'; } else if (c.sel === pos) cls += ' sel';
        return `<button class="${cls}" data-act="qPick" data-i="${pos}" ${done ? 'disabled' : ''}><span class="ltr">${'ABCD'[pos]}</span><span>${md(q.opts[oi])}</span></button>`;
      }).join('')}</div>`;
    }
    if (q.type === 'multi') {
      return `<p class="muted small">Select all that apply.</p><div class="opts">${c.opts.map((o, i) => {
        const on = c.sel.has(i);
        let cls = 'opt' + (on ? ' sel' : '');
        if (done) cls = 'opt' + (on && o.g ? ' right' : on && !o.g ? ' wrong' : !on && o.g ? ' missed' : '');
        return `<button class="${cls}" data-act="qToggle" data-i="${i}" ${done ? 'disabled' : ''}><span class="ltr box">${on ? ic('check') : ''}</span><span>${md(o.t)}</span></button>`;
      }).join('')}</div>`;
    }
    if (q.type === 'order') {
      const n = q.items.length;
      let slots = '';
      for (let pos = 0; pos < n; pos++) {
        if (pos < c.placed.length) {
          const idx = c.placed[pos];
          const cls = done ? (idx === pos ? ' right' : ' wrong') : '';
          slots += `<li><button class="slot${cls}" data-act="qUnplace" data-i="${pos}" ${done ? 'disabled' : ''}>${md(q.items[idx])}</button></li>`;
        } else slots += '<li><span class="slot empty">&nbsp;</span></li>';
      }
      return `<p class="muted small">Tap steps in order. Tap a placed step to remove it.</p><ol class="slots">${slots}</ol>
        ${done ? '' : `<div class="pool">${c.pool.filter(i => !c.placed.includes(i)).map(i => `<button class="pill" data-act="qPlace" data-i="${i}">${md(q.items[i])}</button>`).join('')}</div>`}
        ${done && !c.ok ? `<div class="answer-key"><b>Correct order</b><ol>${q.items.map(t => `<li>${md(t)}</li>`).join('')}</ol></div>` : ''}`;
    }
    return `<div class="matchlist">${c.rows.map((r, i) => {
      const cls = done ? (r.sel === r.a ? ' right' : ' wrong') : '';
      return `<div class="mrow${cls}"><span class="mp">${md(r.p)}</span>
        <select class="sel" data-change="qMatch" data-i="${i}" ${done ? 'disabled' : ''} aria-label="Match for ${esc(A.plain(r.p))}"><option value="">Choose...</option>${c.choices.map(ch => `<option value="${esc(ch)}"${r.sel === ch ? ' selected' : ''}>${esc(ch)}</option>`).join('')}</select>
        ${done && r.sel !== r.a ? `<small class="fix">Correct: ${esc(r.a)}</small>` : ''}</div>`;
    }).join('')}</div>`;
  }

  function qRun() {
    const c = Q.cur, q = c.q, ready = answered(c);
    const t = A.TOPIC[q.topic];
    const pct = Math.round(100 * Q.i / Q.list.length);
    let fb = '';
    if (c.checked) {
      const st = S.q[q.id];
      let extra = '';
      if (c.ok && c.mark === 'guess') extra = 'Right, but you marked it "Don’t know it". It stays flagged for retest.';
      else if (!c.ok && c.mark === 'sure') extra = 'You said you knew it and it was wrong: that is the most useful miss. Reread the note.';
      else if (!c.ok) extra = 'Flagged for retest.';
      fb = `<div class="feedback ${c.ok ? 'good' : 'bad'}"><div class="fb-head">${ic(c.ok ? 'check' : 'x')}<b>${c.ok ? 'Correct' : 'Not quite'}</b></div>
        <p>${md(q.why)}</p>${extra ? `<p class="muted">${esc(extra)}</p>` : ''}
        <a class="link-btn" href="#/notes/${t.lesson}">Open Lesson ${t.lesson} notes</a></div>`;
    }
    return `<div class="page quiz">
      <div class="topbar"><button class="icon-btn" data-act="qEnd" aria-label="End quiz">${ic('x')}</button>
        <div class="progress"><i style="width:${pct}%"></i></div><span class="count">${Q.i + 1}/${Q.list.length}</span></div>
      <div class="chips"><span class="chip kind-${q.kind}">${KIND_NAME[q.kind]}</span><span class="chip">${esc(t.name)}</span></div>
      <h2 class="qtext">${md(q.q)}</h2>
      ${qBody(c)}
      ${c.checked ? fb + `<div class="mark"><b>Mark it <small>(optional)</small></b><div class="markbtns">
        <button class="mk know${c.mark === 'sure' ? ' on' : ''}" data-act="qMark" data-v="sure" aria-pressed="${c.mark === 'sure'}">${ic('check')} I know it</button>
        <button class="mk dont${c.mark === 'guess' ? ' on' : ''}" data-act="qMark" data-v="guess" aria-pressed="${c.mark === 'guess'}">${ic('x')} Don't know it</button></div></div>`
        : `<button class="btn primary wide" data-act="qCheck" ${ready ? '' : 'disabled'}>Check answer</button>`}
      ${c.checked ? `<button class="btn primary wide" data-act="qNext">${Q.i + 1 >= Q.list.length ? 'See results' : 'Next'}</button>` : ''}
    </div>`;
  }

  function qResult() {
    const res = Q.res, total = res.length, correct = res.filter(r => r.ok).length;
    const p = A.pct(correct, total);
    const by = k => { const e = res.filter(r => r.conf === k); return [e.length, e.filter(r => r.ok).length]; };
    const lucky = res.filter(r => r.ok && r.conf === 'guess').length;
    const sureWrong = res.filter(r => !r.ok && r.conf === 'sure').length;
    const missed = res.filter(r => !r.ok || r.conf === 'guess');
    const wk = A.weakTopics();
    const r = 46, circ = 2 * Math.PI * r;
    return `<div class="page">
      <h1 class="large center">${p >= 80 ? 'Nice work' : p >= 60 ? 'Getting there' : 'Keep going'}</h1>
      <div class="ring big"><svg viewBox="0 0 110 110" aria-hidden="true"><circle cx="55" cy="55" r="${r}" class="ring-bg"/><circle cx="55" cy="55" r="${r}" class="ring-fg ${p >= 80 ? 'good' : p >= 60 ? 'ok' : 'bad'}" stroke-dasharray="${(circ * p / 100).toFixed(1)} ${circ.toFixed(1)}" transform="rotate(-90 55 55)"/></svg><div class="ring-txt"><b>${p}%</b><span>${correct} of ${total}</span></div></div>
      <div class="list">${[['sure', 'Marked I know it'], ['think', 'Not marked'], ['guess', "Marked don't know it"]].map(([k, l]) => { const [n, ok] = by(k); return `<div class="li"><span class="li-body"><b>${l}</b><small>${n ? ok + ' of ' + n + ' correct' : 'none'}</small></span><span class="score ${n && ok === n ? 'good' : n && ok === 0 ? 'bad' : 'ok'}">${n ? A.pct(ok, n) + '%' : '-'}</span></div>`; }).join('')}</div>
      ${lucky ? `<p class="insight">${plural(lucky, 'right answer')} you marked "don't know it". Flagged for retest.</p>` : ''}
      ${sureWrong ? `<p class="insight bad">${plural(sureWrong, 'confident miss')}. Those are the ones to reread.</p>` : ''}
      ${wk.length ? `<p class="insight">Topics to firm up: ${wk.slice(0, 3).map(w => esc(w.t.name)).join(', ')}.</p>` : ''}
      <h2 class="section-title">Review</h2>
      <div class="list">${res.map(x => { const q = A.QUES[x.id]; return `<a class="li" href="#/notes/${A.TOPIC[q.topic].lesson}"><span class="li-ic ${x.ok ? 'green' : 'red'}">${ic(x.ok ? 'check' : 'x')}</span><span class="li-body"><b>${esc(A.plain(q.q).slice(0, 100))}${q.q.length > 100 ? '...' : ''}</b><small>${KIND_NAME[q.kind]} &middot; ${{ sure: 'know it', think: 'not marked', guess: "don't know it" }[x.conf]}</small></span>${ic('chev', 'dim')}</a>`; }).join('')}</div>
      ${missed.length ? `<button class="btn primary wide" data-act="qRetestMissed">${ic('alert')} Retest ${plural(missed.length, 'question')} now</button>` : ''}
      <button class="btn tinted wide" data-act="qAgain">New quiz</button>
      <a class="btn tinted wide" href="#/progress">${ic('progress')} See progress</a>
    </div>`;
  }

  A.views.practice = () => Q.phase === 'run' ? qRun() : Q.phase === 'result' ? qResult() : qSetup();

  A.act.qMode = d => { Q.mode = d.v; Q.msg = ''; A.rerender(); };
  A.chg.qScope = el => { Q.scope = el.value; Q.msg = ''; A.rerender(); };
  A.act.qKind = d => {
    if (Q.kinds.has(d.k)) { if (Q.kinds.size > 1) Q.kinds.delete(d.k); } else Q.kinds.add(d.k);
    A.rerender();
  };
  A.act.qCount = d => { Q.count = +d.v; A.rerender(); };

  function begin(list, label) {
    Q.list = list; Q.i = 0; Q.res = []; Q.label = label; Q.cur = mkCur(list[0]); Q.phase = 'run'; Q.msg = '';
  }
  function startFromSetup() {
    const pool = Q.mode === 'retest' ? retestPool() : mixedPool();
    if (!pool.length) { Q.msg = Q.mode === 'retest' ? 'No weak spots yet. Take a mixed quiz first.' : 'No questions match.'; return false; }
    begin(pool.slice(0, Q.count), (Q.mode === 'retest' ? 'Retest: ' : 'Quiz: ') + A.scopeLabel(Q.scope));
    return true;
  }
  A.act.qStart = () => { startFromSetup(); A.rerender(); };
  A.act.practiceTopic = d => { Q.scope = 'topic:' + d.id; Q.mode = 'mixed'; Q.kinds = new Set(KINDS.map(k => k[0])); Q.count = 10; startFromSetup(); A.go('#/practice'); };
  A.act.retestWeak = () => { Q.scope = 'all'; Q.mode = 'retest'; Q.count = 10; startFromSetup(); A.go('#/practice'); };
  A.act.qEnd = () => { Q.phase = Q.res.length ? 'result' : 'setup'; if (Q.res.length) finishQuiz(); A.rerender(); };
  A.act.qAgain = () => { Q.phase = 'setup'; A.rerender(); };
  A.act.qRetestMissed = () => {
    const ids = Q.res.filter(r => !r.ok || r.conf === 'guess').map(r => r.id);
    begin(A.shuffle(ids.map(id => A.QUES[id])), 'Retest of missed questions');
    A.rerender();
  };

  A.act.qPick = d => { if (Q.cur.checked) return; Q.cur.sel = +d.i; A.rerender(); };
  A.act.qToggle = d => { const s = Q.cur.sel, i = +d.i; if (Q.cur.checked) return; s.has(i) ? s.delete(i) : s.add(i); A.rerender(); };
  A.act.qPlace = d => { if (Q.cur.checked) return; Q.cur.placed.push(+d.i); A.rerender(); };
  A.act.qUnplace = d => { if (Q.cur.checked) return; Q.cur.placed.splice(+d.i, 1); A.rerender(); };
  A.chg.qMatch = el => { if (Q.cur.checked) return; Q.cur.rows[+el.dataset.i].sel = el.value; A.rerender(); };
  A.act.qCheck = () => {
    const c = Q.cur;
    if (c.checked || !answered(c)) return;
    c.ok = grade(c); c.checked = true; c.conf = 'think'; // 'think' = not marked; the optional mark below can change it
    const q = c.q;
    const st = S.q[q.id] || (S.q[q.id] = { right: 0, wrong: 0, retest: false, last: null });
    c.ok ? st.right++ : st.wrong++;
    st.last = { ok: c.ok, conf: c.conf, t: Date.now() };
    st.retest = !c.ok || c.conf === 'guess';
    A.logEvent(q.topic, 'q', A.qScore(c.ok, c.conf), q.id, { ok: c.ok, conf: c.conf });
    Q.res.push({ id: q.id, ok: c.ok, conf: c.conf });
    A.save(); A.rerender();
  };
  // Optional self-rating after the answer is shown: "I know it" counts as sure, "Don't know it" as a guess.
  A.act.qMark = d => {
    const c = Q.cur;
    if (!c.checked) return;
    c.mark = c.mark === d.v ? null : d.v;
    c.conf = c.mark || 'think';
    const q = c.q, st = S.q[q.id], e = S.events[S.events.length - 1];
    st.last.conf = c.conf;
    st.retest = !c.ok || c.conf === 'guess';
    if (e && e.kind === 'q' && e.ref === q.id) { e.s = A.qScore(c.ok, c.conf); e.x.conf = c.conf; }
    Q.res[Q.res.length - 1].conf = c.conf;
    A.save(); A.rerender();
  };
  A.act.qNext = () => {
    if (Q.i + 1 >= Q.list.length) { finishQuiz(); Q.phase = 'result'; }
    else { Q.i++; Q.cur = mkCur(Q.list[Q.i]); }
    A.rerender();
    window.scrollTo(0, 0);
  };
  function finishQuiz() {
    if (!Q.res.length || Q.saved === Q.res) return;
    S.sessions.push({
      t: Date.now(), label: Q.label, total: Q.res.length, correct: Q.res.filter(r => r.ok).length,
      guessRight: Q.res.filter(r => r.ok && r.conf === 'guess').length,
      sureWrong: Q.res.filter(r => !r.ok && r.conf === 'sure').length
    });
    if (S.sessions.length > 100) S.sessions.shift();
    Q.saved = Q.res;
    A.save();
  }

  /* ================================ LISTEN ================================ */
  const SYN = window.speechSynthesis || null;
  const L = { scope: 'all', mode: 'notes', queue: [], i: 0, playing: false, timer: null, tok: 0, sleepAt: 0, wake: null, entry: null, voices: [], finished: false };
  A.setListenScope = (s, mode) => { lsStop(); L.scope = s; if (mode) L.mode = mode; };

  function say(s) {
    return A.plain(s).replace(/\s>\s/g, ', then ').replace(/\^/g, ' to the power of ').replace(/~/g, 'about ')
      .replace(/\bx (\d)/gi, 'times $1').replace(/\bI\/O\b/g, 'I O').replace(/\//g, ' or ').replace(/_/g, ' ')
      .replace(/\+/g, ' plus ').replace(/=/g, ' equals ').replace(/&/g, ' and ')
      .replace(/\bGHz\b/g, 'gigahertz').replace(/\bGB\b/g, 'gigabytes').replace(/\bMB\b/g, 'megabytes').replace(/\bdB\b/g, 'decibels').replace(/\bHz\b/g, 'hertz')
      .replace(/\s*\|\s*/g, ', ').replace(/\s+/g, ' ').trim();
  }
  function lessonInScope(l, scope) { return A.TOPICS_OF(l.id).some(t => A.inScope(t.id, scope)); }
  A.TOPICS_OF = lid => TOPICS.filter(t => t.lesson === lid);

  function notesQueue() {
    const out = [];
    LESSONS.filter(l => lessonInScope(l, L.scope)).forEach(l => {
      const lab = 'Lesson ' + l.id + ': ' + l.title;
      out.push({ say: 'Lesson ' + l.id + '. ' + l.title + '.', label: lab, text: l.title, head: true, pause: 700 });
      l.blocks.forEach(b => {
        if (b.h) out.push({ say: say(b.h) + '.', label: lab, text: b.h, head: true, pause: 500 });
        if (b.p) b.p.forEach(x => out.push({ say: say(x), label: lab, text: x, pause: 350 }));
        if (b.table) b.table.rows.forEach(r => {
          const parts = [r[0]];
          for (let i = 1; i < r.length; i++) if (r[i]) parts.push((b.table.head[i] ? A.plain(b.table.head[i]) + ': ' : '') + r[i]);
          out.push({ say: say(parts.join('. ')), label: lab, text: r.filter(Boolean).join('  /  '), pause: 450 });
        });
        if (b.note) out.push({ say: 'Note. ' + say(b.note), label: lab, text: b.note, pause: 500 });
      });
    });
    return out;
  }
  function cardsQueue() {
    const out = [];
    A.shuffle(CARDS.filter(c => A.inScope(c.topic, L.scope))).forEach(c => {
      const lab = A.TOPIC[c.topic].name;
      out.push({ say: 'Question. ' + say(c.f), label: lab, text: c.f, part: 'q', pause: S.settings.delay * 1000 });
      out.push({ say: 'Answer. ' + say(c.b), label: lab, text: c.b, q: c.f, part: 'a', pause: 1600 });
    });
    return out;
  }
  function buildQueue() { L.queue = L.mode === 'cards' ? cardsQueue() : notesQueue(); L.i = 0; L.finished = false; }

  function chunk(text) {
    const parts = text.match(/[^.;!?]+[.;!?]*\s*/g) || [text];
    const out = []; let cur = '';
    parts.forEach(p => { if ((cur + p).length > 170 && cur) { out.push(cur); cur = p; } else cur += p; });
    if (cur) out.push(cur);
    return out;
  }
  function loadVoices() { if (SYN) L.voices = SYN.getVoices().filter(v => /^en/i.test(v.lang)); }
  if (SYN) { loadVoices(); SYN.onvoiceschanged = () => { loadVoices(); if (A.route().name === 'listen' && !L.playing) A.rerender(); }; }

  async function requestWake() {
    if (!S.settings.wake || !('wakeLock' in navigator) || L.wake) return;
    try { L.wake = await navigator.wakeLock.request('screen'); L.wake.addEventListener('release', () => { L.wake = null; }); } catch (e) { /* not allowed */ }
  }
  function releaseWake() { try { if (L.wake) L.wake.release(); } catch (e) { /* ignore */ } L.wake = null; }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && L.playing) requestWake(); });
  window.addEventListener('pagehide', () => { if (SYN) SYN.cancel(); });

  function speakNow() {
    clearTimeout(L.timer);
    const token = ++L.tok;
    if (SYN) SYN.cancel();
    const st = L.queue[L.i];
    if (!st) { lsFinish(); return; }
    if (L.sleepAt && Date.now() > L.sleepAt) { L.sleepAt = 0; lsPause(); return; }
    const chunks = chunk(st.say);
    let k = 0;
    const next = () => {
      if (token !== L.tok || !L.playing) return;
      if (k >= chunks.length) { lineDone(st, token); return; }
      const u = new SpeechSynthesisUtterance(chunks[k++]);
      u.rate = S.settings.speed;
      const v = L.voices.find(x => x.name === S.settings.voice);
      if (v) { u.voice = v; u.lang = v.lang; }
      u.onend = next;
      u.onerror = e => { if (token !== L.tok) return; if (e.error === 'canceled' || e.error === 'interrupted') return; lsPause(); };
      SYN.speak(u);
    };
    paint();
    L.timer = setTimeout(next, 80);
  }
  function lineDone(st, token) {
    if (L.entry) {
      L.entry.n++; L.entry.t = Date.now();
      const k = A.dayKey(); const d = S.days[k] || (S.days[k] = { c: 0, q: 0, l: 0 });
      d.l = (d.l || 0) + 1;
      if (L.entry.n % 5 === 0) A.save();
    }
    L.timer = setTimeout(() => { if (token !== L.tok || !L.playing) return; L.i++; speakNow(); }, st.pause || 300);
  }

  function lsPlay() {
    if (!SYN) return;
    if (!L.queue.length || L.finished) buildQueue();
    if (!L.queue.length) return;
    L.playing = true; L.finished = false;
    if (S.settings.sleep && !L.sleepAt) L.sleepAt = Date.now() + S.settings.sleep * 60000;
    if (!L.entry) { L.entry = { t: Date.now(), n: 0, mode: L.mode }; S.listen.push(L.entry); if (S.listen.length > 200) S.listen.shift(); }
    requestWake();
    speakNow();
  }
  function lsPause() {
    L.playing = false; L.tok++; clearTimeout(L.timer);
    if (SYN) SYN.cancel();
    releaseWake(); A.save(); paint();
  }
  function lsStop() {
    L.playing = false; L.tok++; clearTimeout(L.timer);
    if (SYN) SYN.cancel();
    releaseWake(); L.queue = []; L.i = 0; L.entry = null; L.sleepAt = 0; L.finished = false; A.save();
  }
  function lsFinish() {
    L.playing = false; L.finished = true; L.tok++; releaseWake(); L.entry = null; L.sleepAt = 0; A.save(); paint();
  }
  function jump(to) {
    L.i = Math.max(0, Math.min(L.queue.length - 1, to));
    L.finished = false;
    if (L.playing) speakNow(); else paint();
  }

  function paint() {
    if (A.route().name !== 'listen') return;
    const st = L.queue[L.i];
    const set = (id, html) => { const el = A.$('#' + id); if (el) el.innerHTML = id === 'ls-text' ? '<div>' + html + '</div>' : html; };
    const total = L.queue.length;
    if (L.finished) {
      set('ls-label', 'Finished'); set('ls-text', 'That is everything in this set. Press play to hear it again.');
    } else if (st) {
      set('ls-label', esc(st.label));
      set('ls-text', st.part === 'a' ? `<span class="dimmer">${md(st.q)}</span><br>${md(st.text)}` : md(st.text));
    } else {
      set('ls-label', 'Ready'); set('ls-text', L.mode === 'cards' ? 'Hear the question, think, then hear the answer.' : 'Press play to hear your notes read aloud.');
    }
    const bar = A.$('#ls-bar'); if (bar) bar.style.width = total ? Math.round(100 * (L.finished ? total : L.i) / total) + '%' : '0%';
    set('ls-count', total ? `${Math.min(L.i + 1, total)} of ${total}` : '');
    set('ls-play', ic(L.playing ? 'pause' : 'play'));
    const pb = A.$('#ls-play'); if (pb) pb.setAttribute('aria-label', L.playing ? 'Pause' : 'Play');
    const live = A.$('#ls-live'); if (live) live.classList.toggle('on', L.playing);
  }

  function listenView() {
    if (!L.queue.length && !L.finished) {
      L.queue = L.mode === 'cards' ? cardsQueue() : notesQueue(); L.i = Math.min(L.i, Math.max(0, L.queue.length - 1));
    }
    const estMin = L.mode === 'notes' ? Math.max(1, Math.round(L.queue.reduce((a, s) => a + s.say.length, 0) / 14 / 60 / S.settings.speed)) : Math.max(1, Math.round(L.queue.length / 2 * (S.settings.delay + 9) / 60));
    return `<div class="page">
      <h1 class="large">Listen</h1>
      <p class="muted">Hands-free study for walking. Screen can stay off if your browser keeps playing audio.</p>
      ${SYN ? '' : '<p class="warn-text">This browser has no speech synthesis, so audio is unavailable.</p>'}
      <div class="list">
        <div class="li stack-li"><b>What to hear</b>${seg([['notes', 'Read notes'], ['cards', 'Quiz me']], L.mode, 'lsMode')}</div>
        <div class="li stack-li"><b>Topics</b>${A.scopeSelect(L.scope, 'lsScope', true)}</div>
      </div>
      <section class="player card" id="ls-live">
        <p class="eyebrow" id="ls-label"></p>
        <div class="now" id="ls-text" aria-live="polite"></div>
        <div class="progress thin"><i id="ls-bar" style="width:0%"></i></div>
        <div class="between"><small class="muted" id="ls-count"></small><small class="muted">about ${estMin} min</small></div>
        <div class="transport">
          <button class="tbtn" data-act="lsBack" aria-label="Back">${ic('back')}</button>
          <button class="tbtn big" id="ls-play" data-act="lsToggle" aria-label="Play">${ic('play')}</button>
          <button class="tbtn" data-act="lsFwd" aria-label="Next">${ic('fwd')}</button>
        </div>
      </section>
      <div class="list">
        <div class="li stack-li"><b>Speed</b>${seg([[0.8, '0.8x'], [1, '1x'], [1.25, '1.25x'], [1.5, '1.5x'], [1.8, '1.8x']], S.settings.speed, 'lsSpeed')}</div>
        ${L.mode === 'cards' ? `<div class="li stack-li"><b>Think time before the answer</b>${seg([[3, '3s'], [5, '5s'], [8, '8s'], [12, '12s']], S.settings.delay, 'lsDelay')}</div>` : ''}
        <div class="li"><span class="li-body"><b>Voice</b></span><select class="sel sm wide-sel" data-change="lsVoice"><option value="">Default</option>${L.voices.map(v => `<option value="${esc(v.name)}"${S.settings.voice === v.name ? ' selected' : ''}>${esc(v.name)}</option>`).join('')}</select></div>
        <div class="li"><span class="li-body"><b>Sleep timer</b></span><select class="sel sm" data-change="lsSleep">${[[0, 'Off'], [15, '15 min'], [30, '30 min'], [60, '60 min']].map(([v, l]) => `<option value="${v}"${S.settings.sleep === v ? ' selected' : ''}>${l}</option>`).join('')}</select></div>
        <label class="li"><span class="li-body"><b>Keep screen on</b><small>Stops the phone sleeping and cutting audio</small></span><input type="checkbox" class="switch" data-change="lsWake" ${S.settings.wake ? 'checked' : ''}></label>
      </div>
    </div>`;
  }

  A.views.listen = listenView;
  A.after.listen = () => paint();
  A.act.lsToggle = () => { if (L.playing) lsPause(); else lsPlay(); };
  A.act.lsBack = () => {
    if (L.mode === 'cards') jump(L.queue[L.i] && L.queue[L.i].part === 'a' ? L.i - 1 : L.i - 2);
    else jump(L.i - 1);
  };
  A.act.lsFwd = () => {
    if (L.mode === 'cards') { let j = L.i + 1; while (j < L.queue.length && L.queue[j].part !== 'q') j++; jump(Math.min(j, L.queue.length - 1)); }
    else jump(L.i + 1);
  };
  A.act.lsMode = d => { lsStop(); L.mode = d.v; A.rerender(); };
  A.chg.lsScope = el => { lsStop(); L.scope = el.value; A.rerender(); };
  A.act.lsSpeed = d => { S.settings.speed = +d.v; A.save(); A.rerender(); };
  A.act.lsDelay = d => { S.settings.delay = +d.v; A.save(); if (L.mode === 'cards') { const wasPlaying = L.playing; const i = L.i; if (wasPlaying) lsPause(); buildQueue(); L.i = Math.min(i, L.queue.length - 1); } A.rerender(); };
  A.chg.lsVoice = el => { S.settings.voice = el.value; A.save(); };
  A.chg.lsSleep = el => { S.settings.sleep = +el.value; L.sleepAt = L.playing && S.settings.sleep ? Date.now() + S.settings.sleep * 60000 : 0; A.save(); };
  A.chg.lsWake = el => { S.settings.wake = el.checked; A.save(); if (!el.checked) releaseWake(); else if (L.playing) requestWake(); };
})();
