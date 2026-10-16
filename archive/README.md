# archive/

Things the repository no longer uses but has not thrown away.

Nothing in here is built, imported, linked or deployed. It is kept because
deleting someone's material is a different decision from stopping using it,
and because the *reason* something was dropped is often worth more later than
the thing itself.

**Nothing here should be revived without reading why it was archived.** Each
entry carries its own note.

| Entry | Was | Why it is here |
| --- | --- | --- |
| `template-assets/` | `portfolio/src/assets/` | 6.0 MB of images from the forked starter template — demo project screenshots, a hero background, company and tech logos. Dead since at least 2026-09-11 |

## How `template-assets/` was proved dead

Not assumed — measured, twice, a year apart:

1. **Nothing imports it.** `src/assets/index.js` is a barrel of image imports
   that no component references. The only file mentioning `assets` is the
   barrel itself.
2. **The build emits none of it.** `npm run build` produces sixteen font files
   in `dist/assets/` and not one of these images. Vite only emits what is
   reachable from the entry, so an image that does not appear there is not
   reachable from anything.

That second check is the decisive one. A grep can miss a dynamic import; the
bundler cannot.

## If you are looking for the site's images

They are in `portfolio/public/` — the portrait, the favicons, the social card.
Those are referenced by URL rather than imported, which is why they live in
`public/` and are not subject to the check above.
