# Documentation style

Two registers, and the mistake is using one for both.

Aviation maintenance manuals are written in **ASD-STE100, Simplified
Technical English**: a controlled vocabulary of roughly 900 approved words,
one meaning per word, short sentences, active voice, one instruction per
sentence. It exists because an engineer on a wet apron at 3am, reading in a
second language, must not be able to misread a procedure. It is the most
battle-tested technical writing standard there is.

It is also the wrong tool for half of this documentation set, and knowing
which half is the whole of this page.

---

## The split

| Register | Used for | Why |
| --- | --- | --- |
| **Procedural** — STE rules apply | README, setup, prompts, runbooks, the change-to-file tables, test descriptions | The reader is *doing something*. Ambiguity costs them a wrong edit |
| **Explanatory** — STE rules do not apply | `DECISIONS.md`, `WORKLOG.md`, the long comments in source, `STACK-TAXONOMY.md` | The reader is *deciding something*. These carry rejected options, measurements and the reasoning behind a trade-off, and controlled vocabulary strips exactly that |

Applying STE to a decision log would turn *"two wide columns never wrapped a
row but needed seven of them: 1,113px against 1,067px for three columns"*
into *"Use three columns."* The instruction survives. The evidence does not,
and the evidence is why the document exists.

---

## Procedural rules (STE, adapted)

These apply to anything a reader follows.

1. **One instruction per sentence.** Not "run the build and check the output";
   two sentences.
2. **Active voice, present tense.** "The test reads `og-card.html`", not "the
   file is read by the test".
3. **Short sentences.** 20 words for an instruction, 25 for a description.
   Long sentences in a procedure hide the step.
4. **One meaning per word, one word per meaning.** This repo says *section*
   for a page region, always. Never *block*, *panel* or *area* for the same
   thing. Pick the word once.
5. **No ambiguous pronouns.** "It" and "this" at the start of a sentence are
   the most common source of misreading. Name the thing.
6. **Say the condition before the action.** "If the deck does not fit, the
   effect turns itself off" — not the reverse. The reader needs to know
   whether the sentence applies to them before reading what to do.
7. **No synonyms for emphasis.** "Fast, rapid, quick" reads as three things.
8. **Negatives are explicit.** "Do not run this at the root" beats "this is
   not intended to be run at the root".

### Approved terms in this repo

Pick the left column, always.

| Use | Not |
| --- | --- |
| section | block, area, panel, region |
| component | widget, element, module |
| tool | tech, technology, skill |
| role (in the cloud matrix) | slot, job, function |
| measure (verb) | check, confirm, validate |
| archive (verb) | remove, clean up, retire |
| stale | outdated, old, legacy |

---

## Explanatory rules

These apply to anything a reader reasons with.

1. **Lead with what was decided**, then why, then what was rejected.
2. **Every claim about behaviour carries a measurement or names the
   mechanism.** "It is fast" is not a sentence this repo writes. "133 kB
   gzipped, in a chunk a phone never fetches" is.
3. **Record the rejected option and its cost.** The alternative that was not
   taken is the most reusable part of a decision.
4. **Say when you were wrong.** The corrections in this set are load-bearing:
   they stop the same mistake twice. A log of only successes teaches nothing.
5. **Dated entries are never rewritten.** `WORKLOG.md` and `DECISIONS.md`
   describe what was true when written. Paths inside them are updated when a
   directory moves, because a path is navigation and not a claim.

---

## Rules both registers share

- **No frontmatter.** No page in this set has it.
- **Relative links**, and they resolve — every `](…)` target is checked.
- **Tables for anything with more than two parallel facts.** Prose comparing
  four things is a puzzle.
- **Code spans for every path, file, identifier and command.** A bare
  `src/index.css` in running text reads as prose and gets skipped.
- **British spelling**, matching the existing set: *colour*, *behaviour*,
  *organise*, *licence* for the noun.

---

## Writing for an LLM reader as well as a human

This repository is read by agents, and the two audiences want nearly the same
thing. Where they differ:

- **Put the answer in the heading.** "Why the colours are one hue" beats
  "Colour notes". Both readers scan headings; only one can skim the body
  quickly.
- **State the ground truth once, in a place that is obviously canonical**, and
  link to it. Two statements of the same number will disagree eventually, and
  a model has no way to tell which is current.
- **Date anything that will age.** "Checked October 2026" lets both readers
  discount it correctly. An undated claim is read as permanent.
- **Never bury a constraint in a paragraph.** Constraints go in a list, a
  table, or a sentence that begins with the negative.

---

## Applying this to an existing page

Do not rewrite a document to match this file. Rewrite it when you are already
editing it for another reason, and only the parts you touch. A documentation
set rewritten wholesale loses the specific, hard-won sentences that made it
worth keeping — and those sentences are usually the ones that break the style
rules, because they were written the day something went wrong.
