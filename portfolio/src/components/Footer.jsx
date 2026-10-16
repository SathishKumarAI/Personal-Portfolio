/**
 * Owns, the closing rule under the page, colophon only.
 * Does not own: navigation or contact links. Both sit above it and repeating
 * them here was the duplication this footer used to be made of.
 */
import LiveClock from "./LiveClock";
import { styles } from "../styles";
import { SITE_REPO } from "../constants";

// One date convention across the site: "Month YYYY", the same shape the
// Experience timeline prints. The old "2026.09" was the only place using
// YYYY.MM, which made it the odd one out on its own page.
const STARTED = "August 2024";
const THIS_VERSION = "October 2026";

/**
 * THE COLOPHON NAMES THE BUILD, not just the typefaces.
 *
 * A portfolio that argues for measured, boring, reproducible tools and then
 * declines to say what it was itself built with is being coy about the one
 * system the reader can actually inspect. The repository is public; the stack
 * is a fact either way, so stating it costs nothing and saves a curious reader
 * a trip to package.json.
 *
 * Read off the real dependencies rather than remembered: React and Vite build
 * it, Tailwind styles it, framer-motion moves it, three.js draws the hero.
 * If one of these is dropped, this line is wrong in the same commit.
 */
const BUILT_WITH = "React · Vite · Tailwind · framer-motion · three.js";

/**
 * One labelled group of the colophon.
 *
 * The colophon shipped as a single run-on line: five build tools, three
 * typefaces, two links and a date range, all separated by interpuncts. It was
 * reported as scattered, and it was the same failure the Stack diagram had —
 * nothing marked where one kind of fact ended and the next began, so the eye
 * had to read the punctuation to find the boundaries.
 *
 * A label in front of each group is the cheapest fix there is: four short
 * answers to four questions, rather than one sentence of eleven items.
 *
 * NO LOGOS HERE, deliberately. The brand marks live in a lazily-loaded chunk
 * precisely so 17kB of SVG paths stay out of the entry bundle, and the footer
 * renders on every page load. Pulling that chunk forward to decorate a
 * colophon would cost every reader first paint for ornament. No emoji either:
 * nothing else on this page uses them, and a row of them under a type-led
 * design reads as a different site's footer.
 */
const Group = ({ label, children }) => (
  <div className="flex flex-col gap-0.5">
    <span className="font-mono text-micro uppercase tracking-[0.14em] text-faint opacity-70">
      {label}
    </span>
    <span className="flex flex-wrap items-baseline gap-x-2 text-secondary">
      {children}
    </span>
  </div>
);

const Dot = () => (
  <span aria-hidden="true" className="text-faint opacity-50">
    ·
  </span>
);

const Footer = () => (
  // Gutter on the <footer>, measure inside it — the split `SectionWrapper`
  // uses. `px-6 sm:px-16` used to sit on the capped div, which parked the
  // colophon 64px to the right of every section heading above it on any
  // viewport past 1280px. `sm:pr-24` stays on the measure: it is clearance for
  // the fixed BackToTop button, not a gutter.
  <footer className={`${styles.paddingX} relative z-10 border-t border-line bg-primary`}>
    <div className="max-w-7xl mx-auto pt-5 pb-20 sm:py-5 sm:pr-24 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-10 font-mono text-label text-faint">
      <span className="flex flex-wrap items-center gap-x-2">
        © {new Date().getFullYear()} Sathish Kumar <span className="text-faint">·</span> <LiveClock />
      </span>
      {/* FOUR GROUPS, not one sentence. Each answers a different question —
          what it runs on, what it is set in, what you may do with it, and how
          old it is — and a reader looking for one of those can now find it
          without parsing the other three. */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:flex sm:flex-wrap sm:items-start sm:gap-x-10">
        <Group label="Built with">{BUILT_WITH}</Group>
        <Group label="Set in">Barlow <Dot /> Newsreader <Dot /> JetBrains Mono</Group>
        <Group label="Licence">
          {/* "Code MIT", never a bare MIT badge: the written content is not
              covered, and a badge would erase the distinction. */}
          <a
            href={`${SITE_REPO}/blob/main/LICENSE`}
            target="_blank"
            rel="noreferrer"
            className="text-accent-ink hover:underline"
          >
            Code MIT ↗
          </a>
          <Dot />
          <a
            href={`${SITE_REPO}/blob/main/portfolio/docs/BUILD-THIS-YOURSELF.md`}
            target="_blank"
            rel="noreferrer"
            className="text-accent-ink hover:underline"
          >
            Build your own ↗
          </a>
        </Group>
        <Group label="Since">
          {STARTED} <Dot /> this version {THIS_VERSION}
        </Group>
      </div>
    </div>
  </footer>
);

export default Footer;
