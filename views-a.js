/* Views: Today, Notes, Progress. */
(function () {
  'use strict';
  const A = window.A, S = A.S, esc = A.esc, md = A.md, ic = A.ic;

  const label = m => m === null ? ['Not started', 'idle'] : m >= 0.85 ? ['Strong', 'good'] : m >= 0.7 ? ['Solid', 'ok'] : m >= 0.5 ? ['Shaky', 'warn'] : ['Weak', 'bad'];
  const plural = (n, w) => n + ' ' + w + (n === 1 ? '' : 's');

  /* ================================ TODAY ================================ */
  function ring(frac, big, small) {
    const r = 46, c = 2 * Math.PI * r, f = Math.max(0, Math.min(1, frac));
    return `<div class="ring"><svg viewBox="0 0 110 110" aria-hidden="true"><circle cx="55" cy="55" r="${r}" class="ring-bg"/><circle cx="55" cy="55" r="${r}" class="ring-fg" stroke-dasharray="${(c * f).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 55 55)"/></svg><div class="ring-txt"><b>${big}</b><span>${small}</span></div></div>`;
  }

  function scoreBars(list) {
    if (!list.length) return '';
    return `<div class="bars" role="img" aria-label="Recent quiz scores">${list.map(s => {
      const p = A.pct(s.correct, s.total);
      return `<div class="bar-col"><div class="bar ${p >= 80 ? 'good' : p >= 60 ? 'ok' : 'bad'}" style="height:calc((100% - 22px) * ${Math.max(0.08, p / 100)})"><i>${p}</i></div><span>${A.shortDate(s.t)}</span></div>`;
    }).join('')}</div>`;
  }

  A.views.today = function () {
    const now = Date.now();
    const due = A.dueCards('all');
    const fresh = A.newCards('all');
    const newToday = Math.min(fresh.length, S.settings.newPer);
    const next24 = CARDS.filter(c => S.cards[c.id] && S.cards[c.id].due > now && S.cards[c.id].due <= now + 864e5).length;
    const future = CARDS.filter(c => S.cards[c.id] && S.cards[c.id].due > now).map(c => S.cards[c.id].due).sort((a, b) => a - b);
    const weak = A.weakTopics();
    const flagged = A.flagged();
    const last = A.lastStudied();
    const done = A.todayCount(), goal = S.settings.goal;
    const streak = A.streak();
    const mins = Math.max(1, Math.round((due.length + newToday) * 0.4));
    const hour = new Date().getHours();
    const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    const rem = [];
    if (due.length) rem.push(['cards', 'bell', 'orange', plural(due.length, 'card') + ' due for review', 'Spaced repetition says now is the time.']);
    if (next24) rem.push(['cards', 'clock', 'blue', plural(next24, 'card') + ' due in the next 24 hours', 'Review tomorrow to keep the interval growing.']);
    if (flagged.length) rem.push(['practice', 'alert', 'red', plural(flagged.length, 'question') + ' flagged for retest', 'Missed, or right but guessed.']);
    weak.slice(0, 2).forEach(w => rem.push(['practice', 'alert', 'orange', w.t.name + ' is ' + Math.round(w.m * 100) + '%', 'Weak topic. Retest it.']));
    if (last && Date.now() - last > 36 * 36e5) rem.push(['cards', 'flame', 'orange', 'Last studied ' + A.ago(last), streak ? 'Keep your streak alive.' : 'A quick 5-minute review restarts your streak.']);
    if (!rem.length) rem.push(['notes', 'check', 'green', last ? 'You are all caught up' : 'Welcome. Start with the notes', last ? (future.length ? 'Next card is due in ' + A.fmtIn(future[0] - now) + '.' : 'Nothing is due right now.') : 'Read a lesson, then review its flashcards.']);

    const sessions = S.sessions.slice(-6);

    return `<div class="page">
      <p class="eyebrow">${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      <h1 class="large">${greet}</h1>

      <section class="card hero">
        <div class="hero-main">
          <div class="hero-num">${due.length}</div>
          <div><div class="hero-title">cards due</div><div class="muted">${newToday} new ready &middot; about ${mins} min</div></div>
        </div>
        ${ring(goal ? done / goal : 0, done + '/' + goal, 'today')}
      </section>
      <div class="row-btns">
        <a class="btn primary" href="#/cards">${ic('cards')} ${due.length ? 'Start review' : 'Study cards'}</a>
        <a class="btn tinted" href="#/listen">${ic('walk')} Walking mode</a>
      </div>

      <div class="stat-row">
        <div class="stat"><b>${streak}</b><span>day streak</span></div>
        <div class="stat"><b>${S.tot.c}</b><span>cards reviewed</span></div>
        <div class="stat"><b>${S.tot.q ? A.pct(S.tot.ok, S.tot.q) + '%' : '-'}</b><span>quiz accuracy</span></div>
      </div>

      <h2 class="section-title">Review reminders</h2>
      <div class="list">${rem.map(r => `<a class="li" href="#/${r[0]}"><span class="li-ic ${r[2]}">${ic(r[1])}</span><span class="li-body"><b>${esc(r[3])}</b><small>${esc(r[4])}</small></span>${ic('chev', 'dim')}</a>`).join('')}</div>
      <button class="link-btn" data-act="ics">${ic('bell')} Add a daily study reminder to my calendar</button>

      <h2 class="section-title">Recent scores</h2>
      ${sessions.length ? `<section class="card">${scoreBars(sessions)}</section>
        <div class="list">${sessions.slice().reverse().map(s => {
          const p = A.pct(s.correct, s.total);
          return `<div class="li"><span class="li-body"><b>${esc(s.label || 'Quiz')}</b><small>${A.shortDate(s.t)} &middot; ${s.correct}/${s.total} correct${s.guessRight ? ' &middot; ' + s.guessRight + ' lucky' : ''}${s.sureWrong ? ' &middot; ' + s.sureWrong + ' confident miss' + (s.sureWrong > 1 ? 'es' : '') : ''}</small></span><span class="score ${p >= 80 ? 'good' : p >= 60 ? 'ok' : 'bad'}">${p}%</span></div>`;
        }).join('')}</div>`
        : `<div class="card empty"><p>No quiz scores yet.</p><a class="btn tinted" href="#/practice">${ic('practice')} Take a quiz</a></div>`}

      <h2 class="section-title">Pick up where you left off</h2>
      <div class="tiles">
        <a class="tile" href="#/notes">${ic('notes')}<b>Read notes</b><small>${LESSONS.length} lessons, searchable</small></a>
        <a class="tile" href="#/practice">${ic('practice')}<b>Practice</b><small>${QUESTIONS.length} original questions</small></a>
        <a class="tile" href="#/progress">${ic('progress')}<b>Progress</b><small>Evidence and weak topics</small></a>
      </div>
    </div>`;
  };

  A.act.ics = function () {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    const stamp = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//A+ Study//EN', 'BEGIN:VEVENT',
      'UID:aplus-study-daily@local', 'DTSTAMP:' + stamp + 'T120000Z',
      'DTSTART:' + stamp + 'T190000', 'DTEND:' + stamp + 'T193000', 'RRULE:FREQ=DAILY',
      'SUMMARY:CompTIA A+ study: review flashcards', 'DESCRIPTION:Review due flashcards and take a short quiz.',
      'BEGIN:VALARM', 'TRIGGER:-PT0M', 'ACTION:DISPLAY', 'DESCRIPTION:A+ study time', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'];
    sheet('aplus-study-reminder.ics', 'text/calendar', lines.join('\r\n'), 'Save this as a .ics file, then open it to add a daily 7 PM study event to your calendar.');
  };
  // Downloads are blocked in some viewers, so show the text with Copy as well as Save.
  function sheet(name, type, text, hint) {
    const old = A.$('#sheet'); if (old) old.remove();
    const d = document.createElement('div');
    d.id = 'sheet'; d.className = 'sheet'; d.dataset.name = name; d.dataset.type = type;
    d.innerHTML = `<div class="sheet-card" role="dialog" aria-modal="true" aria-label="${esc(name)}"><b>${esc(name)}</b><p class="muted small">${esc(hint)}</p><textarea id="sheet-text" readonly spellcheck="false">${esc(text)}</textarea><div class="row-btns"><button class="btn tinted" data-act="sheetCopy">Copy</button><button class="btn tinted" data-act="sheetSave">Save file</button><button class="btn primary" data-act="sheetClose">Done</button></div></div>`;
    document.body.appendChild(d);
  }
  A.act.sheetClose = () => { const s = A.$('#sheet'); if (s) s.remove(); };
  A.act.sheetCopy = (d, el) => {
    const t = A.$('#sheet-text');
    const done = () => { el.textContent = 'Copied'; };
    try { navigator.clipboard.writeText(t.value).then(done, () => { t.select(); }); } catch (e) { t.select(); }
  };
  A.act.sheetSave = () => { const s = A.$('#sheet'); download(s.dataset.name, s.dataset.type, A.$('#sheet-text').value); };
  function download(name, type, text) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type }));
    a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  /* ================================ NOTES ================================ */
  const N = { q: '', index: null };

  function buildIndex() {
    N.index = [];
    LESSONS.forEach(l => l.blocks.forEach((b, bi) => {
      const parts = [];
      if (b.h) parts.push(b.h);
      if (b.p) parts.push.apply(parts, b.p);
      if (b.table) { parts.push(b.table.head.join(' ')); b.table.rows.forEach(r => parts.push(r.join(' | '))); }
      if (b.note) parts.push(b.note);
      parts.forEach(t => N.index.push({ lesson: l.id, bi, head: b.h || '', text: A.plain(t) }));
    }));
  }

  function searchHTML(q) {
    const terms = A.terms(q).map(t => t.toLowerCase());
    if (!terms.length) return '';
    if (!N.index) buildIndex();
    const hits = N.index.filter(e => { const t = e.text.toLowerCase(); return terms.every(x => t.includes(x)); });
    if (!hits.length) return `<div class="card empty"><p>No notes match "${esc(q)}".</p></div>`;
    const seen = new Set(), out = [];
    hits.forEach(h => {
      const key = h.lesson + ':' + h.text;
      if (seen.has(key) || out.length >= 40) return;
      seen.add(key); out.push(h);
    });
    return `<p class="muted small">${hits.length} match${hits.length === 1 ? '' : 'es'}${hits.length > out.length ? ', showing ' + out.length : ''}</p><div class="list">` + out.map(h => {
      const lower = h.text.toLowerCase();
      const at = Math.max(0, lower.indexOf(terms[0]) - 50);
      const snip = (at > 0 ? '...' : '') + h.text.slice(at, at + 160) + (at + 160 < h.text.length ? '...' : '');
      const l = A.LESSON[h.lesson];
      return `<a class="li" href="#/notes/${h.lesson}"><span class="li-body"><small>Section ${l.sec} &middot; Lesson ${l.id}: ${esc(l.title)}</small><span class="snip">${md(snip, terms)}</span></span>${ic('chev', 'dim')}</a>`;
    }).join('') + '</div>';
  }

  function tableHTML(t, hl) {
    const head = t.head.some(Boolean) ? `<thead><tr>${t.head.map(h => `<th>${md(h, hl)}</th>`).join('')}</tr></thead>` : '';
    return `<div class="tbl-wrap"><table>${head}<tbody>${t.rows.map(r => `<tr>${r.map((c, i) => `<td${i === 0 ? ' class="first"' : ''}>${md(c, hl)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }

  function blockHTML(b, hl) {
    let o = '';
    if (b.h) o += `<h3>${md(b.h, hl)}</h3>`;
    if (b.p) o += `<ul class="bul">${b.p.map(x => `<li>${md(x, hl)}</li>`).join('')}</ul>`;
    if (b.table) o += tableHTML(b.table, hl);
    if (b.note) o += `<div class="callout ${b.kind || ''}">${md(b.note, hl)}</div>`;
    return o;
  }

  function notesHome() {
    return `<div class="page">
      <h1 class="large">Notes</h1>
      <label class="search">${ic('search')}<input type="search" id="nq" placeholder="Search notes" value="${esc(N.q)}" data-inp="nsearch" autocomplete="off" enterkeyhint="search" aria-label="Search notes"></label>
      <div id="nres">${searchHTML(N.q)}</div>
      <div id="nsections"${A.terms(N.q).length ? ' hidden' : ''}>
        ${SECTIONS.map(s => `
          <h2 class="section-title">Section ${s.n}: ${s.title}</h2>
          <p class="muted small">${s.chapter}. ${s.blurb}</p>
          <details class="card five"><summary>The Exam-Critical Five</summary><ol>${EXAM_FIVE[s.n].map(x => `<li>${md(x)}</li>`).join('')}</ol></details>
          <div class="list">${LESSONS.filter(l => l.sec === s.n).map(l => {
            const m = A.lessonMastery(l.id), lb = label(m);
            return `<a class="li" href="#/notes/${l.id}"><span class="num">${l.id}</span><span class="li-body"><b>${esc(l.title)}</b><small>${l.mins} min &middot; ${lb[0]}</small></span><span class="dot ${lb[1]}"></span>${ic('chev', 'dim')}</a>`;
          }).join('')}</div>`).join('')}
      </div>
    </div>`;
  }

  function lessonView(id) {
    const l = A.LESSON[id];
    if (!l) return notesHome();
    const hl = A.terms(N.q);
    const idx = LESSONS.indexOf(l), prev = LESSONS[idx - 1], next = LESSONS[idx + 1];
    const m = A.lessonMastery(l.id), lb = label(m);
    return `<div class="page">
      <a class="back" href="#/notes">${ic('chevl')} Notes</a>
      <p class="eyebrow">Section ${l.sec} &middot; Lesson ${l.id} &middot; ${l.mins} min</p>
      <h1 class="large">${esc(l.title)}</h1>
      <div class="chips"><span class="chip ${lb[1]}">${lb[0]}${m !== null ? ' ' + Math.round(m * 100) + '%' : ''}</span>${hl.length ? `<span class="chip">Highlighting "${esc(N.q)}"</span>` : ''}</div>
      <div class="row-btns">
        <button class="btn tinted" data-act="lessonCards" data-id="${l.id}">${ic('cards')} Flashcards</button>
        <button class="btn tinted" data-act="lessonQuiz" data-id="${l.id}">${ic('practice')} Quiz</button>
        <button class="btn tinted" data-act="lessonListen" data-id="${l.id}">${ic('listen')} Listen</button>
      </div>
      <article class="prose">${l.blocks.map(b => blockHTML(b, hl)).join('')}</article>
      <div class="pager">
        ${prev ? `<a class="btn tinted" href="#/notes/${prev.id}">${ic('chevl')} ${prev.id}</a>` : '<span></span>'}
        ${next ? `<a class="btn tinted" href="#/notes/${next.id}">${next.id} ${ic('chev')}</a>` : '<span></span>'}
      </div>
    </div>`;
  }

  A.views.notes = arg => arg ? lessonView(+arg) : notesHome();
  A.after.notes = arg => {
    if (!arg) return;
    const m = A.$('mark');
    if (m) setTimeout(() => m.scrollIntoView({ block: 'center' }), 30);
  };
  A.inp.nsearch = el => {
    N.q = el.value;
    const has = A.terms(N.q).length > 0;
    A.$('#nres').innerHTML = searchHTML(N.q);
    A.$('#nsections').hidden = has;
  };
  A.act.lessonCards = d => { A.setCardScope('lesson:' + d.id); A.go('#/cards'); };
  A.act.lessonQuiz = d => { A.setQuizScope('lesson:' + d.id); A.go('#/practice'); };
  A.act.lessonListen = d => { A.setListenScope('lesson:' + d.id, 'notes'); A.go('#/listen'); };

  /* =============================== PROGRESS =============================== */
  A.views.progress = function () {
    const now = Date.now();
    const states = Object.values(S.cards);
    const learning = states.filter(c => c.int < 7).length;
    const young = states.filter(c => c.int >= 7 && c.int < 21).length;
    const mature = states.filter(c => c.int >= 21).length;
    const fresh = CARDS.length - states.length;
    const qEv = S.events.filter(e => e.kind === 'q' && e.x);
    const conf = ['sure', 'think', 'guess'].map(k => {
      const e = qEv.filter(x => x.x.conf === k);
      return { k, n: e.length, ok: e.filter(x => x.x.ok).length };
    });
    const sure = conf[0], guess = conf[2];
    const misses = Object.keys(S.q).filter(id => A.QUES[id] && S.q[id].last && !S.q[id].last.ok && S.q[id].last.conf === 'sure');
    const weak = A.weakTopics();
    const listenLines = S.listen.reduce((a, b) => a + b.n, 0);
    const studyDays = Object.keys(S.days).filter(k => ((S.days[k].c || 0) + (S.days[k].q || 0) + (S.days[k].l || 0)) > 0).length;

    // 28-day heatmap
    const cells = [];
    for (let i = 27; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const v = S.days[A.dayKey(d)];
      const n = v ? (v.c || 0) + (v.q || 0) + Math.ceil((v.l || 0) / 5) : 0;
      const lvl = n === 0 ? 0 : n < 5 ? 1 : n < 15 ? 2 : n < 30 ? 3 : 4;
      cells.push(`<i class="hm l${lvl}" title="${A.shortDate(d.getTime())}: ${n}"></i>`);
    }

    const log = S.events.slice(-10).reverse().map(e => {
      const t = A.TOPIC[e.topic] ? A.TOPIC[e.topic].name : e.topic;
      let what;
      if (e.kind === 'c') what = 'Flashcard &middot; ' + ['Red', 'Yellow', 'Green', 'Green'][e.x];
      else what = 'Question &middot; ' + (e.x.ok ? 'correct' : 'missed') + ' &middot; ' + ({ sure: 'sure', think: 'think so', guess: 'guessing' }[e.x.conf]);
      return `<div class="li"><span class="li-body"><b>${esc(t)}</b><small>${what}</small></span><small class="dim">${A.ago(e.t)}</small></div>`;
    }).join('');

    const total = CARDS.length || 1;
    const seg = (n, c, name) => n ? `<i class="${c}" style="width:${(100 * n / total).toFixed(1)}%" title="${name}: ${n}"></i>` : '';

    return `<div class="page">
      <h1 class="large">Progress</h1>

      <div class="stat-grid">
        <div class="stat"><b>${A.streak()}</b><span>day streak</span></div>
        <div class="stat"><b>${studyDays}</b><span>study days</span></div>
        <div class="stat"><b>${S.tot.c}</b><span>card reviews</span></div>
        <div class="stat"><b>${S.tot.q}</b><span>questions</span></div>
        <div class="stat"><b>${S.tot.q ? A.pct(S.tot.ok, S.tot.q) + '%' : '-'}</b><span>accuracy</span></div>
        <div class="stat"><b>${listenLines}</b><span>lines heard</span></div>
      </div>

      <h2 class="section-title">Flashcard memory</h2>
      <section class="card">
        <div class="stack" role="img" aria-label="Card maturity">${seg(mature, 'mature', 'Mature')}${seg(young, 'young', 'Young')}${seg(learning, 'learning', 'Learning')}</div>
        <div class="legend"><span><i class="mature"></i>Mature ${mature}</span><span><i class="young"></i>Young ${young}</span><span><i class="learning"></i>Learning ${learning}</span><span><i class="new"></i>New ${fresh}</span></div>
        <p class="muted small">Mature means the next review is 21 days or more away.</p>
      </section>

      <h2 class="section-title">Topic mastery</h2>
      <div class="list">${TOPICS.map(t => {
        const m = A.mastery(t.id), lb = label(m), n = A.topicEvents(t.id).length;
        return `<div class="li topic"><span class="li-body"><b>${esc(t.name)}</b><small>Lesson ${t.lesson} &middot; ${n ? n + ' recent answers' : 'no answers yet'}</small><span class="meter"><i class="${lb[1]}" style="width:${m === null ? 0 : Math.round(m * 100)}%"></i></span></span><span class="tag ${lb[1]}">${lb[0]}</span><button class="mini" data-act="practiceTopic" data-id="${t.id}">Quiz</button></div>`;
      }).join('')}</div>
      ${weak.length ? `<button class="btn primary wide" data-act="retestWeak">${ic('alert')} Retest ${weak.length} weak topic${weak.length > 1 ? 's' : ''}</button>` : ''}

      <h2 class="section-title">Confidence check</h2>
      <section class="card">
        ${qEv.length ? `<div class="calib">${conf.map(c => `<div><b>${c.n ? A.pct(c.ok, c.n) + '%' : '-'}</b><span>${{ sure: 'When sure', think: 'When thinking', guess: 'When guessing' }[c.k]}</span><small>${c.ok}/${c.n} right</small></div>`).join('')}</div>
        <p class="muted small">${sure.n >= 5 && A.pct(sure.ok, sure.n) < 85 ? 'You are sometimes sure and wrong. Reread those notes: misplaced confidence is the costliest kind.' : guess.n >= 5 && A.pct(guess.ok, guess.n) >= 60 ? 'Your guesses land often. Check the concepts behind them so they turn into "sure."' : 'Keep rating how sure you are. The pattern shows where you really stand.'}</p>`
        : '<p class="muted">Answer a few quiz questions and rate your confidence to see your calibration.</p>'}
        ${misses.length ? `<h3 class="sub">Confident misses</h3><div class="list flat">${misses.slice(0, 5).map(id => { const q = A.QUES[id]; return `<a class="li" href="#/notes/${A.TOPIC[q.topic].lesson}"><span class="li-body"><b>${esc(A.plain(q.q).slice(0, 90))}${q.q.length > 90 ? '...' : ''}</b><small>Lesson ${A.TOPIC[q.topic].lesson}: open the note</small></span>${ic('chev', 'dim')}</a>`; }).join('')}</div>` : ''}
      </section>

      <h2 class="section-title">Last 4 weeks</h2>
      <section class="card"><div class="heat" role="img" aria-label="Study activity, last 28 days">${cells.join('')}</div></section>

      <h2 class="section-title">Recent activity</h2>
      ${log ? `<div class="list">${log}</div>` : '<div class="card empty"><p>Nothing yet. Review a card or take a quiz and it shows up here.</p></div>'}

      <h2 class="section-title">Settings</h2>
      <div class="list">
        <div class="li"><span class="li-body"><b>Daily goal</b><small>Cards and questions per day</small></span>
          <select class="sel sm" data-change="goal">${[10, 20, 40, 60].map(n => `<option value="${n}"${S.settings.goal === n ? ' selected' : ''}>${n}</option>`).join('')}</select></div>
        <div class="li"><span class="li-body"><b>New cards per session</b><small>How many unseen cards to add</small></span>
          <select class="sel sm" data-change="newPer">${[5, 10, 20, 40].map(n => `<option value="${n}"${S.settings.newPer === n ? ' selected' : ''}>${n}</option>`).join('')}</select></div>
        <button class="li btn-li" data-act="ics"><span class="li-ic blue">${ic('bell')}</span><span class="li-body"><b>Daily reminder</b><small>Download a calendar event for 7 PM</small></span></button>
        <button class="li btn-li" data-act="exportData"><span class="li-ic green">${ic('download')}</span><span class="li-body"><b>Export progress</b><small>Save a backup file</small></span></button>
        <label class="li btn-li"><span class="li-ic purple">${ic('upload')}</span><span class="li-body"><b>Import progress</b><small>Restore from a backup file</small></span><input type="file" accept="application/json" hidden data-change="importData"></label>
        <button class="li btn-li danger" data-act="resetData"><span class="li-ic red">${ic('x')}</span><span class="li-body"><b>Reset all progress</b><small>Clears cards, scores and history</small></span></button>
      </div>
      <p class="muted small center">Notes are a snapshot of your Notion pages for Section 4 (Chapter 3) and Section 5 (Chapter 4).</p>
    </div>`;
  };
  A.chg.goal = el => { S.settings.goal = +el.value; A.save(); };
  A.chg.newPer = el => { S.settings.newPer = +el.value; A.save(); };
  A.act.exportData = () => sheet('aplus-study-progress-' + A.dayKey() + '.json', 'application/json', JSON.stringify(S, null, 1), 'Your whole backup. Copy it or save the file. Import it later from Progress.');
  A.chg.importData = el => {
    const f = el.files && el.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const obj = JSON.parse(r.result);
        if (!obj || obj.v !== 1) throw new Error('Not an A+ Study backup');
        A.replaceState(obj); A.rerender();
      } catch (e) { alert('Could not import that file: ' + e.message); }
    };
    r.readAsText(f);
  };
  A.act.resetData = () => {
    if (confirm('Reset all flashcard schedules, quiz history and progress on this device?')) {
      A.replaceState({}); A.rerender();
    }
  };
})();
