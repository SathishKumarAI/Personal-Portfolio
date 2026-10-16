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

const Footer = () => (
  // Gutter on the <footer>, measure inside it — the split `SectionWrapper`
  // uses. `px-6 sm:px-16` used to sit on the capped div, which parked the
  // colophon 64px to the right of every section heading above it on any
  // viewport past 1280px. `sm:pr-24` stays on the measure: it is clearance for
  // the fixed BackToTop button, not a gutter.
  <footer className={`${styles.paddingX} relative z-10 border-t border-line bg-primary`}>
    <div className="max-w-7xl mx-auto pt-5 pb-20 sm:py-5 sm:pr-24 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between font-mono text-label text-faint">
      <span className="flex flex-wrap items-center gap-x-2">
        © {new Date().getFullYear()} Sathish Kumar <span className="text-faint">·</span> <LiveClock />
      </span>
      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span>Built with {BUILT_WITH}</span>
        <span aria-hidden="true">·</span>
        <span>Type: Barlow · Newsreader · JetBrains Mono</span>
        <span aria-hidden="true">·</span>
        {/* The licence is scoped: the code is MIT, the written content is not.
            Saying "MIT" alone on a portfolio would invite someone to republish
            a CV, so the link carries the distinction rather than the badge. */}
        <a
          href={`${SITE_REPO}/blob/main/LICENSE`}
          target="_blank"
          rel="noreferrer"
          className="text-accent-ink hover:underline"
        >
          Code MIT ↗
        </a>
        <span aria-hidden="true">·</span>
        <a
          href={`${SITE_REPO}/blob/main/3d_portfolio/docs/BUILD-THIS-YOURSELF.md`}
          target="_blank"
          rel="noreferrer"
          className="text-accent-ink hover:underline"
        >
          Build your own ↗
        </a>
        <span aria-hidden="true">·</span>
        <span className="text-secondary">
          Started {STARTED}, this version {THIS_VERSION}
        </span>
      </span>
    </div>
  </footer>
);

export default Footer;
