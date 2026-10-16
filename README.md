# Personal portfolio

The personal site of Sathish Kumar. **The site is `portfolio/`** — everything else here
is supporting material.

```
portfolio/    the site. Vite + React. Start here.
docs/notes/   personal working notes, predating the site. Has a README
docs/            account/repo notes: branch protection, how the repo presents.
                 NOT the site's docs — those are docs/site/
STATUS.md        where work stopped, the next action, the traps. Read on return.
CONTRIBUTING.md  how to contribute, including with an LLM
LICENSE          MIT for the code; the written content and CV are reserved
```

**Reusing this?** The code is MIT — take it. The biography, role history,
project write-ups and CV are not covered; please do not republish someone
else's work history as your own. `LICENSE` says exactly where the line is.

**Want to build one like it?** `docs/prompts/BUILD-THIS-YOURSELF.md` is
a prompt pack for doing it with a coding agent — the order that makes each
phase checkable, rather than a template to fill in.

Despite the folder name there is no 3D in it; the name survives from a version that had it.

## Run

```bash
cd portfolio
npm install
npm run dev        # http://localhost:5173 (5174 if 5173 is taken)
npm run build
npm run lint
```

On Windows, a `node_modules` installed under Linux will not work — it has no `.bin` shims
and none of the platform binaries (`@rollup/rollup-win32-x64-msvc`, `@esbuild/win32-x64`).
Re-run `npm install` on the machine you are building on.

## Where the earlier drafts went

Six attempts at this site accumulated in this directory. On 2026-09-11 the five that are
not the site were moved out, keeping their git history. Nothing was deleted.

| Was | Now | Why it moved |
|---|---|---|
| `test/` | `~/coding/archive/portfolio-template-bundle` | A third-party starter kit ("Single Page Dev Portfolio Resource Bundle"), not our code |
| `portfolio/` | `~/coding/archive/portfolio-nextjs-july-2026` | One commit, three source files, abandoned July 2026 |
| `sathishkumarai.github.io/` | `~/coding/archive/portfolio-github-pages-annotated` | Superseded draft. **Read its `docs/DECISIONS.md` before redesigning anything** — it records three generations and why two were dropped |
| `innit/` | `~/coding/archive/innit-empty` | Empty |
| `SathishKumarAI/` | `~/coding/shelf/product/SathishKumarAI` | Not a draft — the GitHub *profile* README repo, with its own remote. Archived nowhere; it is live |

`test/` and `innit/` were tracked here, so they also remain on the branch
`archive/pre-consolidation-2026-09-11`, at commit `443d3e5`.

## Traps

- **`.gitignore` must stay ASCII.** It was corrupted once by a PowerShell `>>` redirect
  writing UTF-16LE; git stops parsing at the first NUL byte, so every rule after that point
  silently did nothing — including the block that was supposed to ignore these nested
  repos. Append with `printf` or an editor, never `>>` from Windows PowerShell.
- Nested clones in this directory are ignored by name. Cloning something new here will not
  be ignored automatically.

## Live

<https://sathishkumarai.github.io/> — GitHub Pages, built from `main` by
`.github/workflows/deploy.yml` in this repo. A merge that touches `portfolio/`
deploys it.

The repo name is load-bearing: only a repo named exactly `<user>.github.io` is
served from the domain root, which keeps Vite's `base` at `/` so one build
serves both Pages and any future Vercel deploy. Until 2026-10-16 that forced the
build into a second repository; `STATUS.md` has the history.

## License

**Code: [MIT](LICENSE).** Take the components, the canvas drawings, the build
setup, any of it.

**Content: not licensed for reuse.** The MIT grant covers the software. It is
not an invitation to republish the parts of this repository that are a person
rather than a program: the work history and its dates, the project write-ups,
the bio and headline copy, `portfolio/public/llms.txt`, and the images in
`portfolio/public/` including the headshot and the social card.

The distinction matters more here than on a normal repo, because on a portfolio
the text *is* the product. Someone can fork this site and put their own career
in it; they should not be able to fork it and keep Sathish's.

If you want to reuse the design, the honest path is: keep the code, replace
everything in `portfolio/src/constants/index.js`.
