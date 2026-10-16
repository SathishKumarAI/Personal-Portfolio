# Cloning this site for your own work

`BUILD-THIS-YOURSELF.md` teaches the method. This file is the shortcut: take
*this* repository and re-point it at you.

It is faster and it has a specific risk. The page's whole argument is that
every figure is measured and every claim is defensible. Clone it carelessly
and you inherit the voice of that argument with none of the substance, which
reads worse than a plain template — a reader who checks one number and finds
it borrowed stops believing the rest.

Work through the phases in order. Each ends with a check.

---

## Before anything: what you may and may not take

The code is MIT. The content is not. See [`../../LICENSE`](../../LICENSE).

| Take freely | Do not take |
| --- | --- |
| Components, hooks, utilities, build config | The biography, role descriptions, project write-ups |
| The test harness and the drift tests | Any figure attributed to someone else's project |
| The drawn concept marks (`conceptIcons.js`) | The portrait, the CV, the name |
| The structure, the budgets, the conventions | `public/llms.txt` as written |

---

## Phase 1 — strip the content, keep the shape

> Clone the repository and work through `portfolio/src/constants/index.js`.
> Replace every value with a placeholder that is obviously a placeholder —
> `TODO: your role here` — rather than deleting fields. I want the shape
> intact so I can see what the site expects me to have.
>
> Then run `npm test`. Several suites will fail, because they assert the
> rendered content matches the constants. Show me the failures and explain
> what each one is protecting. Do not fix them yet.

The failures are the point. They are a list of everywhere content is mirrored
and must stay in step — the crawler copy, the JSON-LD, the social card.

## Phase 2 — put your own facts in

> Interview me for the content, one section at a time. Push back when an
> answer is vague: if I say something performed well, ask for the number, and
> if there is no number we write the sentence without one.
>
> Fill `constants/index.js` as we go. After each section, run `npm test` and
> tell me which mirrors are now consistent and which still are not.

Stop when the suite is green. A green suite here means every copy of your
facts agrees with every other copy.

## Phase 3 — retire what does not apply to you

> Go through the sections and tell me which ones have no content in my case.
> For each, give me the cost of keeping it empty versus removing it.
>
> For anything removed: delete the component and its entry in `App.tsx`,
> **and** check `navLinks`, the right rail, the ask-box corpus and the scene
> tinting (`main > section:nth-of-type(even)` in `index.css` — removing a
> section flips which ones are tinted). Then run the tests.

That parenthetical is a real trap in this codebase and it is silent.

## Phase 4 — make the visualisation yours

The hero field draws a neural network because the owner is an ML engineer,
anchored to the actual contact and section controls on the page.

> The hero visualisation illustrates this person's field. Mine is `<yours>`.
> Propose three things it could illustrate instead that are true about my
> work, and for each say what it claims and why that claim earns a reader's
> attention. If the honest answer for all three is "it looks nice", we delete
> the canvas and keep the space.

Deleting it is a legitimate outcome. An ambient animation that illustrates
nothing is the most expensive decoration on a page.

## Phase 5 — re-derive the budgets

> The budgets in this repo were measured against its content, not mine.
> Re-measure: section heights in screens, entry bundle size, what loads
> lazily. Give me the numbers for my content and tell me which budgets I am
> now breaking.

Do not inherit "0.97 screens" as a target. Measure yours.

## Phase 6 — replace the identity layer

> Replace, and list anything you cannot: the portrait in `public/`, the
> favicons, the social card (`docs/site/og-card.html`, re-rendered over
> `public/og.png`), the site title and meta description, `public/llms.txt`,
> the JSON-LD block, and the colophon in `Footer.jsx`.
>
> Then grep the whole repo for the previous owner's name and show me every
> hit. Some will be in documentation that should keep it — attribution for
> the code — and some will be content I have to replace. Tell me which is
> which; do not decide for me.

## Phase 7 — re-point the deploy

> This repo is named `<user>.github.io` so Pages serves it from the domain
> root, and `.github/workflows/deploy.yml` pins the site subdirectory in
> `SITE_DIR`. Find every place a path, repo name or absolute URL is hard-coded
> — both workflows, `index.html`, the README, the footer links — and list them
> before changing anything.

Two traps here, both already paid for. The build used to live in a **second**
repository that pinned the source path; a directory rename in this one
succeeded, passed CI, and broke deploys with no error until someone tried to
deploy. And the repo name itself is load-bearing: rename it to anything but
`<user>.github.io` and Pages serves the site from a subpath, which breaks every
absolute URL unless Vite's `base` changes with it.

## Phase 8 — the honesty pass

Last, and the one that decides whether the clone is worth anything.

> Read the finished site as a hostile reviewer who knows my field. Find every
> claim I cannot defend in an interview: a tool I have listed but barely used,
> a number with no source, a category that misfiles something, copy inherited
> from the original author that reads as mine.
>
> Give me the list. Do not fix it — I need to decide each one.

This project filed a hosted model as inference infrastructure and shipped it.
It took a reader who knew the difference about four seconds to spot. Run this
phase before anyone else does.

---

## What to keep even if you change everything else

- **The drift tests.** Two copies of the same facts will separate. These catch it.
- **The glossary.** Every piece of jargon carries a plain-English definition.
- **"Measured or absent."** No estimated figures anywhere.
- **The change-to-file tables.** They are why a session can start by reading
  one table instead of the whole directory.
