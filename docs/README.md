# docs/

Every document in this repository, in one tree. There is no second `docs/`
anywhere — that was the problem this layout fixed.

```
docs/
|- site/      how the site works, and why it is built that way
|- repo/      the GitHub account and repository around it
|- prompts/   how to build something like this with a coding agent
`- notes/     personal working notes, predating the site
```

The split is by **subject**, not by importance. Branch protection is a property
of the account, not of a React component; a reader looking for "how is this
deployed" should not have to read past it.

## Start here

| You are | Read |
| --- | --- |
| **A recruiter or a curious visitor** | Nothing here. The site itself is the artefact |
| **An engineer reading the code** | [`../portfolio/README.md`](../portfolio/README.md) — the change-to-file table. Then [`site/ARCHITECTURE.md`](site/ARCHITECTURE.md) |
| **Picking up unfinished work** | [`../STATUS.md`](../STATUS.md) — where it stopped, the next action, the traps |
| **An AI agent working in this repo** | [`../CLAUDE.md`](../CLAUDE.md) for the rules, then the change-to-file table in each source directory |
| **Wanting to build your own** | [`prompts/BUILD-THIS-YOURSELF.md`](prompts/BUILD-THIS-YOURSELF.md) |

## site/ — the site's own documentation

Governed by [`site/manifest.md`](site/manifest.md): **one canonical file per
topic, and the names that must never be created beside it.** Read that before
adding a document here. It exists because doc sets rot into duplicates, and it
has now caught two.

| File | Owns |
| --- | --- |
| `ARCHITECTURE.md` | How the system works: data flow, chunking, the theme cascade, deploy topology |
| `DECISIONS.md` | What was chosen and what was rejected, reasoning compressed to a line |
| `WORKLOG.md` | What changed, when, and what was measured. Newest first, append-only |
| `BACKLOG.md` | Future work as tickets, with priority and effort |
| `STACK-TAXONOMY.md` | Why each tool sits in the box it sits in. **Read before moving one** |
| `LEARNING-NOTES.md` | Plain-English explanations of every technique used here |
| `TYPE-AUDIT.md` | Type scale and contrast, measured off the running page |
| `EMAIL-SETUP.md` | Historical: a contact form removed 2026-09-11 |
| `manifest.md` | The table above, as a rule |

## repo/ — the account, not the site

| File | Owns |
| --- | --- |
| `REPO-SECURITY.md` | Branch protection, required checks, and the rule set that once locked the owner out of `main` |
| `REPO-SHOWCASE.md` | How the repository presents: description, topics, pins, social preview |

## prompts/ — building one of these

`BUILD-THIS-YOURSELF.md` is a sequence of generalised prompts for a coding
agent, in the order that makes each phase checkable. It is deliberately not a
transcript of how this site was built: a one-shot prompt produces a template
with someone else's taste and a lot of invented numbers, and the order is the
part worth copying.

## notes/ — personal, unmaintained

Working notes that predate the site: command cheat-sheets, setup notes,
brainstorms. **Not maintained to the standard of `site/`, and not a reference
anyone should rely on.** Kept as a record; it has its own README saying so.

## Conventions

- **No frontmatter.** The existing pages have none.
- **Relative links, and they are checked** — every `](path)` in this tree
  resolves to a file that exists.
- **Numbers or nothing.** A claim about behaviour carries a measurement or
  names the mechanism. "It is fast" is not a sentence this repo writes.
- **Dated entries are never rewritten.** `WORKLOG.md` and `DECISIONS.md`
  describe what was true when written; editing them to match today makes the
  log worthless. Paths inside them are updated when a directory moves, because
  a path is navigation rather than a claim.
