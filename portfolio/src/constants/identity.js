/**
 * Who he is, how to reach him, and what he is currently open to.
 *
 * Split out of a single 885-line `index.js` on 2026-10-16. `index.js` is now a
 * barrel re-exporting every one of these, so every existing
 * `from "../constants"` import is unchanged.
 */
import { GH } from "./links.js";



// This site's own repository. Linked from the Collaborate band, which invites
// people into it, so it points at the repo root rather than at a file path:
// a deep link to CONTRIBUTING.md on a branch would 404 until that branch merges.
export const SITE_REPO = `${GH}/Personal-Portfolio`;

export const contact = {
  email: "sathishkumar786.ml@gmail.com",
  github: "SathishKumarAI",
  // Canonical slug is lowercase, it appears 72 times in his own saved
  // profile page, and the mixed-case form appears zero times.
  linkedin: "in/sathishkumarai",
  substack: "https://sathishkumarai.substack.com/",
  availability: "Open to roles",
  timezone: "US Central time",
};

// Portrait. Source is HeadShot.jpg at the repo root (1920x2879, kept out of
// git); this is a top-anchored 4:5 crop of it, resized to 600x750 and stripped
// of metadata. Regenerate with:
//   magick HeadShot.jpg -auto-orient -strip -crop 1920x2400+0+0 +repage //     -resize 600x750 -quality 82 -interlace Plane portfolio/public/headshot.jpg

// Portrait. Source is HeadShot.jpg at the repo root (1920x2879, kept out of
// git); this is a top-anchored 4:5 crop of it, resized to 600x750 and stripped
// of metadata. Regenerate with:
//   magick HeadShot.jpg -auto-orient -strip -crop 1920x2400+0+0 +repage //     -resize 600x750 -quality 82 -interlace Plane portfolio/public/headshot.jpg
export const profile = {
  photo: "/headshot.jpg",
  alt: "Sathish Kumar",
};

/**
 * The five reading themes.
 *
 * `scheme` is the second axis and it drives the structural CSS — the glass
 * shadows, the bloom and the grain all key off `data-scheme`, because
 * "everything that is not dark" stops being a usable selector once there is a
 * third palette.
 *
 * `note` is what the picker shows under the name. It says who a palette suits,
 * NOT what they will be shown: the content is identical in all five. A
 * portfolio that shows a recruiter different claims than it shows a professor
 * is not a theme, it is a lie with a switch on it.
 *
 * `bar` is the mobile browser-chrome colour, which has to match the ground or
 * the phone draws a seam across the top of the page. It doubles as the swatch's
 * ground, because it IS the ground.
 *
 * `accent` is here for the swatch and nowhere else. The palettes are
 * `:root[data-theme=...]` rules, so an element nested inside the page cannot
 * opt into another theme by carrying the attribute — the selector only ever
 * matches the document root. The swatch therefore paints from these two values
 * directly rather than inheriting.
 */

// Employment status. Verified from the LinkedIn profile header saved
// 2026-09-11: employer, headline, country and the on-site/hybrid/remote
// preference are his own published words, not inferred.
export const status = {
  company: "AdvanSoft International, Inc",
  // Confirmed by the owner: "AI Engineer" is the title. The LinkedIn header
  // reads "Machine Learning Engineer | LLMs | MLOps", but that is a headline,
  // not a job title, the two disagreed on the same page until this was settled.
  role: "AI Engineer",
  openTo: "AI engineering roles",
  // Was one string, "United States: on-site, hybrid or remote". Two fields now,
  // so the card can give the country and the arrangement a line each instead of
  // wrapping the sentence mid-phrase — it broke as "hybrid or / remote" at
  // 390px. The words are his, unchanged; only the punctuation between them is
  // gone, and the layout supplies what the colon used to.
  country: "United States",
  arrangement: "on-site, hybrid or remote",
};

// Roles, newest first. `start`/`end` are ISO "YYYY-MM" or null when not yet
// supplied; an entry renders whatever it has and nothing it does not, so a role
// with no dates shows no date range rather than an invented one.

export const quotes = [
  {
    text: "If you can't explain it simply, you don't understand it well enough.",
    author: "Albert Einstein",
  },
  {
    text: "An equation for me has no meaning unless it expresses a thought of God.",
    author: "Srinivasa Ramanujan",
  },
  {
    text: "Dream is not what you see in sleep; dream is the thing which does not let you sleep.",
    author: "A. P. J. Abdul Kalam",
  },
];

// plain-English definitions + a "learn more" link (curated: Wikipedia for
// concepts, official site for tools, Hugging Face for model/task terms).
// Any term without a link falls back to a Google search of the term.
