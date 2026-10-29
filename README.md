# A+ Study

A dark, Apple-style study app for CompTIA A+ Core 1 (220-1201): notes, spaced-repetition flashcards,
original practice questions with confidence tracking, and a walking-friendly audio mode.

**Live app:** https://beantown3.github.io/comptia-aplus-study/ (works in Chrome and Safari, no sign-in)

## Built together

Designed and built by **Matthew ([@BeanTown3](https://github.com/BeanTown3))** together with **Claude** (Anthropic) in Claude Code.
Matthew set the goals, supplied the Section 4 and 5 study notes, and drove every decision. Claude wrote the code, flashcards,
questions and notes formatting. Commits carry a `Co-Authored-By: Claude` trailer so the history shows it.

## Run it locally

```
node serve.js
```

Open http://localhost:5173. Opening `index.html` directly also works, minus the offline cache.

## On your phone

Open the live link in Safari or Chrome, then **Share > Add to Home Screen** (Safari) or **Install app** (Chrome).
Safari can clear a website's saved data after about a week of not using it, and Home Screen apps are exempt. If you
use Safari in a tab, export a backup now and then from Progress > Export.

## What is in it

| Tab | What it does |
| --- | --- |
| Today | Cards due, daily goal ring, review reminders, recent quiz scores, `.ics` daily reminder |
| Notes | 12 lessons, full-text search with highlighting, the Exam-Critical Five per section |
| Cards | 121 flashcards with red / yellow / green lights (swipe or tap), shuffle, browse mode, filter by light, spaced repetition underneath |
| Quiz | 76 original questions: recall, comparison, scenario, PBQ-style (ordering, matching, select-all). Rate Sure / Think so / Guessing on each. Right-but-guessed answers stay flagged. Retest mode targets weak spots |
| Listen | Read notes aloud or "quiz me" (question, pause, answer). Speed, voice, think time, sleep timer, keep-screen-on |
| Progress | Topic mastery, confidence calibration, confident misses, 4-week activity map, export/import backup |

Progress is stored in the browser (`localStorage`), per device.

## Files

- `data-notes.js`, `data-cards.js`, `data-questions.js`: all content. Append only, so saved progress keeps matching card and question IDs.
- `core.js`: state, scoring, spaced repetition, routing. `views-a.js`: Today, Notes, Progress. `views-b.js`: Cards, Quiz, Listen.
- No build step and no dependencies.

## About the content

The notes are Matthew's own condensed study notes taken from a CompTIA A+ video course. This is an unofficial study aid, not affiliated
with or endorsed by CompTIA or the course publisher. Where the instructor's wording conflicts with standard A+ material, the note says so.
