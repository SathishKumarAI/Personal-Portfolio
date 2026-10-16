# Docs manifest

One canonical file per topic, and the names that must never be created beside it.

This exists because doc sets rot into duplicates: six weeks apart, `improvements.md`
and `backlog.md` both get written, both half-finished, and neither is the one people
read. A filename check cannot catch that — `roadmap.md` and `BACKLOG.md` share no
substring and cover one subject — so it is written down here instead.

**Before creating any file in `docs/`, read this table.** If the topic is already
owned, add to that file.

| Canonical path | Owns | Never create instead | Tier |
| --- | --- | --- | --- |
| `README.md` (repo root of the app) | **Where to change what.** The change→file table, the stack, the content model, the traps that bite while editing | `CONTRIBUTING-CODE.md`, `DEVELOPING.md`, `SETUP.md` | P0 |
| `src/components/README.md` | **Which component owns what**, and the traps specific to that directory | `docs/COMPONENTS.md` | P0 |
| `../STATUS.md` | **Re-entry state.** Where work stopped, the next action, what is live | `docs/CURRENT.md`, `NOTES.md` | P0 |
| `docs/ARCHITECTURE.md` | **How the system works.** Data flow, module boundaries, the render path, chunk splitting, the theme cascade, test and deploy topology | `docs/DESIGN.md`, `docs/OVERVIEW.md`, `docs/HOW-IT-WORKS.md`, `docs/TECHNICAL.md` | P0 |
| `docs/DECISIONS.md` | **What was decided and what was rejected.** An index with the reasoning compressed to a line each, pointing at the WORKLOG entry that holds the evidence | `docs/ADR.md`, `docs/RATIONALE.md`, `docs/CHOICES.md`, `docs/adr/*.md` | P0 |
| `docs/LEARNING-NOTES.md` | **Plain-English explanations** of every technique this repo uses, for someone learning the craft: what it is, where it lives here, what to try next | `docs/TUTORIAL.md`, `docs/GUIDE.md`, `docs/BEGINNERS.md`, `docs/EXPLAINER.md` | P1 |
| `docs/BACKLOG.md` | **Future work as tickets**, with priority and effort. Everything not yet built goes here | `docs/IMPROVEMENTS.md`, `docs/ROADMAP.md`, `docs/TODO.md`, `docs/FUTURE.md` | P0 |
| `docs/WORKLOG.md` | **What changed, when, and what was measured.** Newest first, append-only | `docs/CHANGELOG.md`, `docs/HISTORY.md` | P0 |
| `docs/STACK-TAXONOMY.md` | **Why each tool is in the box it is in.** The rule the Stack's boxes follow, every tool with its reason, the judgement calls worth arguing with, and the claims only the owner can confirm | `docs/TOOLS.md`, `docs/SKILLS.md`, `docs/STACK.md` | P0 |
| `docs/BUILD-THIS-YOURSELF.md` | **How to build a portfolio this way with a coding agent.** Generalised prompts in the order that makes each phase checkable | `docs/PROMPTS.md`, `docs/RECIPE.md`, `docs/HOWTO.md` | P1 |
| `../LICENSE` | **What may be reused.** MIT for the code; the written content, CV and likeness are reserved | `COPYING`, `docs/LICENSE.md` | P0 |
| `src/utils/README.md` | **Which helper owns what**, and the failure each test is named for | `docs/TESTING.md` | P1 |
| `docs/TYPE-AUDIT.md` | **Type scale and contrast**, measured off the running page | `docs/A11Y.md`, `docs/TYPOGRAPHY.md` | P1 |
| `docs/EMAIL-SETUP.md` | Historical: a contact form removed 2026-09-11. Kept as history, not live guidance | — | P2 |

## The one that nearly happened

The request that produced this manifest asked for "a prioritised improvements
list". That is `docs/BACKLOG.md`, which has existed since 2026-09-11 with
priorities (P0/P1/P2) and effort (S/M/L) already in it. Writing
`docs/IMPROVEMENTS.md` would have produced two half-maintained lists of future
work, and within a month nobody would know which was current.

**New improvements are added to `BACKLOG.md`.** That is the whole job of this
table: catching the duplicate before the file exists, not after.

It nearly happened a second time. A request to "organise the docs" in the
2026-10-16 session was one step from producing `docs/README.md` — an index of
the docs, which is this file. The table caught it. What the set actually
needed was not a new map but two missing rows and four stale ones, which is
the usual shape of a documentation problem.

## What this manifest does NOT govern

`../../docs/` holds account- and repository-level notes — branch protection,
how the repo presents on GitHub. Different subject, different owner: that set
has its own `README.md`. This table governs the SITE's documentation only.

`../../docs/notes/` is personal working notes that predate the site. Not
maintained to this standard and not a reference; it says so itself.

## Conventions this set follows

- **No frontmatter.** The existing pages have none; matching local convention
  beats importing a different one.
- **Relative links**, percent-encoded where a filename contains a space or a
  bracket. Fix the link, never the filename — inbound references are relative and
  renaming is how they break.
- **Numbers or nothing.** A claim about behaviour carries a measurement or names
  the mechanism. "It is fast" is not a sentence this repo writes.
