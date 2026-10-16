/**
 * The sections, named exactly as their headings name them.
 *
 * Split out of a single 885-line `index.js` on 2026-10-16. `index.js` is now a
 * barrel re-exporting every one of these, so every existing
 * `from "../constants"` import is unchanged.
 */

/**
 * The nav is an index, so every entry says exactly what the section it points
 * at says. Three of them did not.
 *
 * "About" pointed at a section headed "Overview", and "Work" pointed at one
 * headed "Projects" — one section with two names each, which makes a reader
 * check whether they landed in the right place.
 *
 * "Work" was the worse of the two, because it also collided with "Experience":
 * a job is work, so the nav offered two words for the same idea and then used
 * neither of them as the heading. "Projects" is the specific word, and it is
 * what the section has always called itself.
 *
 * "Experience" went the same way afterwards. It is the conventional label and a
 * recruiter scans for it, which is why it survived the first pass — but it is
 * also a word that means everything and therefore nothing, and the section
 * holds four jobs with dates. "Roles" is what they are, it is what the spec
 * band already counts (`04 ROLES`), and the band now points at a section with
 * the same name on it.
 */
export const navLinks = [
  { id: "about", title: "About" },
  { id: "roles", title: "Roles" },
  { id: "stack", title: "Stack" },
  { id: "projects", title: "Projects" },
  { id: "contact", title: "Contact" },
];

// `services` lived here: six "focus areas" rendered as cards in About. Deleted
// with the cards, not orphaned, because the six `stackGroups` below already
// partition the same skills and do it with named tools instead of adjectives.
// Two taxonomies of one person is one too many; the specific one won.

// Grouped stack, six areas across the data-to-AI path.
/**
 * Each group carries its own scan-aid dot class and its own primary tools.
 * `dot` is a full Tailwind class, not a token fragment, because Tailwind scans
 * for literal class strings: `bg-${g.dot}` built from "cat-data" would be
 * purged, while the literal "bg-cat-data" sitting here is found.
 * `tint` is the SAME colour as a raw variable name, because the card's glow
 * and the pipeline rail need `rgb(var(--c-cat-data) / 0.2)` and a Tailwind
 * class cannot be taken apart back into its token. Two fields for one colour
 * is the price of Tailwind's literal-string scan; they are declared adjacent
 * so they cannot drift apart unnoticed.
 * `primary` marks the tools that get the filled chip. Everything else stays
 * outline. Two per group is the ceiling on purpose: mark four and nothing is
 * marked.
 */
