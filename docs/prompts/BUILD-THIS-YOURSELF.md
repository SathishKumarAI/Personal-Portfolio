# Build a portfolio like this one

A prompt pack for Claude Code, or any coding agent that can read and write
files and run commands.

This is not "generate me a portfolio". A one-shot prompt gives you a template
with someone else's taste and a lot of invented numbers. What follows is the
sequence that produced *this* site, written so you can run it against your own
material — the order matters more than any individual prompt, because each
phase makes the next one checkable.

**Use it like this:** paste one prompt, work through it with the agent until
its checks pass, then move on. Skipping to phase 4 is how you end up with a
pretty page that says nothing true.

---

## Phase 0 — the ground rules

Give the agent its constraints *before* it writes anything. Most of what makes
a portfolio feel unserious is decided in the first hour.

> You are building a personal engineering portfolio with me. Before writing any
> code, set up these standing rules and keep them for the whole project.
>
> **Honesty rails.** Every figure on the page is either measured or absent —
> never estimated, never rounded up, never invented to fill a layout. If I give
> you a claim you cannot verify, put it in the page as my words in quotes, or
> leave it out. If a section needs a number I have not given you, ask; do not
> generate one.
>
> **Measure, do not infer.** When you change something visual, verify it from
> the running page — computed styles, bounding boxes, contrast ratios — not by
> reading the CSS and believing it renders that way. Quote the numbers back to
> me. "Should work" is not verification.
>
> **One concern per file**, named after the concern. Target ~300 lines, 500 is
> the ceiling. Every file opens with a comment saying what it owns and what it
> explicitly does not.
>
> **Comments say why, not what.** Record the reasoning that is not visible in
> the diff: the option taken, the options rejected, the constraint that forced
> it. If a comment and the code ever disagree, find out which is lying.
>
> **Content lives in one module**, never typed into a component. If a fact
> appears in two places, one of them will go stale.
>
> Confirm you have these, then stop. Do not start building yet.

---

## Phase 1 — the content model, before any layout

The most common failure is designing boxes and then writing text to fill them.
Do it the other way round.

> Let's define the content model first — no components, no styling yet.
>
> Interview me about my work: roles with real dates, projects with outcomes I
> can point at, the tools I actually reach for. Push back when an answer is
> vague. If I say something performed well, ask for the number; if there is no
> number, we write it without one rather than inventing a percentage.
>
> Then write it as a single constants module: plain data, one exported
> structure per kind of thing. Nothing in it should be a sentence I would be
> embarrassed to be asked about in an interview.
>
> Finish by telling me which claims in there I would struggle to defend.

---

## Phase 2 — sections that each do one job

> Build the page as sections, each one answering a single question a reader
> has, in this order: who is this, what have they shipped, what can they do,
> how do I reach them.
>
> Rules:
> - No section may restate another. If two sections would say the same thing in
>   different words, delete the weaker one and tell me which you removed.
> - Every section derives its own facts from the constants module. A count, a
>   date or a total that is hard-coded in a component is a bug.
> - Reading order on a narrow screen must match the visual order on a wide one.
>
> After each section, show me what it looks like and what it costs in page
> height. I care about both.

---

## Phase 3 — the rails that keep it honest as it grows

This is the phase people skip, and it is the one that makes the rest durable.

> Add the checks that stop this rotting. Plain Node test files, no framework:
>
> 1. **Drift tests.** Anywhere the same set of facts is rendered two ways, a
>    test asserts both cover the same set. Adding an item in one place and
>    forgetting the other must fail the build, not render quietly.
> 2. **Mirror tests.** If the site ships a machine-readable copy of itself
>    (`/llms.txt` or similar), a test asserts it still matches the real content.
> 3. **Vocabulary test.** Every jargon term rendered on the page has a
>    plain-English definition attached. A term with no definition fails.
>
> Then **arm each test before you trust it**: deliberately break the thing it
> is meant to catch, show me it goes red, and put it back. A test that has only
> ever been green has not been tested.

---

## Phase 4 — one visualisation that means something

> Add exactly one piece of ambient motion or data visualisation. One. It must
> illustrate something true about the content, not decorate the page.
>
> Hard constraints:
> - It must never cross text. Measure the overlap and show me it is zero.
> - It plays, makes its point, and stops. Nothing loops forever behind
>   something a person is trying to read.
> - `prefers-reduced-motion: reduce` gets one correct still frame.
> - It only animates while on screen.
> - It reads correctly in every colour theme the site has.
>
> Before you build it, tell me what it is claiming and why that claim is worth
> a reader's attention. If the honest answer is "it looks nice", we skip it.

---

## Phase 5 — colour and type that carry information

> Audit every colour and typographic choice for whether it encodes something.
>
> Specifically: if a set of things has an **order**, colour them with one hue at
> varying intensity and verify the luminance is monotonic — a rainbow cannot
> express rank, and most "nice palettes" are rainbows. If a set of things is
> **unordered**, distinct hues are correct. Tell me which sets are which before
> you touch anything.
>
> Where several kinds of text sit together, make them differ by family or
> style, not only by weight — a reader should be able to tell a label from a
> definition from a value without reading them.
>
> Check contrast against the real background in every theme and quote the
> ratios.

---

## Phase 6 — budgets, and what they cost

> Set explicit budgets and hold me to them: how many screens of scroll each
> section may take, what the entry bundle may weigh, what loads lazily.
>
> When something I ask for breaks a budget, do not quietly absorb it. Tell me
> the number, tell me what the trade buys, and let me choose. If I add enough
> content that a budget becomes unreachable, say so plainly rather than
> degrading the thing I asked for.

---

## Phase 7 — documentation that survives you

> Write three documents and keep them true in the same commit as any change
> that invalidates them:
>
> 1. A **change → file table** at the top of each source directory. The first
>    thing a future session reads, so it never has to grep.
> 2. A **decision log**: what was chosen, what was rejected, what it cost.
>    Dated entries, never rewritten — a log that is edited to match today is
>    useless.
> 3. A **status file** written when you stop: where you stopped, the next
>    action, the traps. Read it when you come back.

---

## The habits that actually mattered

Independent of any prompt above, these are what separated a good result from a
plausible-looking one. Tell your agent to hold them.

| Habit | Why it earned its place |
|---|---|
| **Measure the running page, never the source** | A rule can read correctly and render wrong. Several bugs here measured as correct because the measurement shared the bug's assumption. |
| **A green check is a claim about coverage** | Ask what the check structurally cannot see. Then test that part by hand. |
| **Arm a test before trusting it** | A test that has never gone red is a test you have not run. |
| **Verify against a production build** | Dev-mode double-mounting makes scroll-triggered animation unreliable. It costs a false bug report every time. |
| **A placement is a claim** | Which box a tool is in asserts what *kind* of thing it is. Getting it wrong is the error an expert reader spots first. |
| **A measured figure still has to be usable** | A raw score with no units satisfies "measured" and tells a reader nothing. If they cannot act on the number, it is not finished. |
| **Delete before adding** | Most "this section needs more" turns out to be "this section says one thing three times". |

---

## What to change for your own version

This site's specific choices are not the point. Replace freely:

- **The subject.** Everything here is filed around one person's work. Yours
  will have different sections entirely.
- **The visualisation.** Pick something that illustrates *your* field.
- **The stack.** React, Vite, Tailwind and framer-motion are the vehicle here;
  nothing in the method depends on them.

What is worth copying is the order: content before layout, rails before
features, budgets before polish, and a number behind every claim.

---

## Licence

The code in this repository is MIT licensed — reuse it freely. The written
content, the personal and project information, and the CV are **not** covered
by that licence; please do not republish them as your own. See
[`LICENSE`](../../LICENSE).
