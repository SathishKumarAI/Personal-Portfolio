/**
 * The six palettes, and the lookup the toggle uses.
 *
 * Split out of a single 885-line `index.js` on 2026-10-16. `index.js` is now a
 * barrel re-exporting every one of these, so every existing
 * `from "../constants"` import is unchanged.
 */

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
export const themes = [
  { id: "dark", label: "Slate", scheme: "dark", bar: "#0F2228", accent: "#FF4E3A",
    note: "Deep navy, easy on a long scroll." },
  { id: "ink", label: "Ink", scheme: "dark", bar: "#0B0D10", accent: "#FF5A42",
    note: "Near-black and cool, the highest contrast here. For a dark desktop." },
  { id: "light", label: "Paper", scheme: "light", bar: "#FFFFFF", accent: "#FF3621",
    note: "The default. Warm white, and what a first-time reader gets." },
  { id: "sepia", label: "Manuscript", scheme: "light", bar: "#F7F2E8", accent: "#BD4426",
    note: "Warm, low blue, gentle. Built for reading rather than scanning." },
  { id: "clean", label: "Clarity", scheme: "light", bar: "#FFFFFF", accent: "#D62D19",
    note: "Neutral and high contrast, accent pulled back. For reading fast." },
  { id: "paper", label: "Preprint", scheme: "light", bar: "#FFFFFF", accent: "#B31B1B",
    note: "An arXiv or IEEE page: white, near-black, Cornell red." },
];

export const themeById = (id) => themes.find((t) => t.id === id) || themes[0];

// Employment status. Verified from the LinkedIn profile header saved
// 2026-09-11: employer, headline, country and the on-site/hybrid/remote
// preference are his own published words, not inferred.
