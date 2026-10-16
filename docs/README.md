# docs/ — account-level notes

**This is not the site's documentation.** Two documentation sets live in this
repository and they are deliberately separate:

| Set | Covers | Governed by |
| --- | --- | --- |
| `portfolio/docs/` | The site: architecture, decisions, worklog, backlog, the stack taxonomy | `portfolio/docs/manifest.md` — one canonical file per topic |
| **`docs/` (here)** | The GitHub **account and repository** around the site | this file |

The split is by subject, not by importance. Branch protection is a property of
the account, not of a React component; filing it with the component docs would
mean a reader looking for "how is this deployed" has to read past it, and a
reader looking for repository settings has to guess which of twelve files
holds them.

## What is in here

| File | Owns |
| --- | --- |
| `REPO-SECURITY.md` | Branch protection, required checks, and the rule set that once locked the owner out of his own `main`. Read before changing any protection setting |
| `REPO-SHOWCASE.md` | How the repository itself presents: description, topics, pinned items, social preview |

## Before adding a file here

Ask which subject it belongs to. If it is about **what the site does or why it
is built that way**, it goes in `portfolio/docs/` — and `manifest.md` there
will tell you which existing file already owns the topic, because the usual
answer is that one does.

Only genuinely account- or repository-level material belongs here. That set is
small on purpose; two files is the right size for it.
