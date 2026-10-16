# archive/orphans/

Files that were at the repository root with nothing referencing them.

| File | Was | Why it is here |
| --- | --- | --- |
| `root-package-lock.json` | `/package-lock.json` | A 190 KB lockfile with **no `package.json` beside it**, committed 2024-08-28 in the initial "adding entire repo". `npm ci` at the root fails on it, and CI never used it — both workflows pin `portfolio/package-lock.json`. Dated more than a year before the current dependency set |

Kept rather than deleted so the owner can confirm before it goes.
