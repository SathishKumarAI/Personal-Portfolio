import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { projects } from "../constants";
import { fadeIn } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import SectionHead from "./SectionHead";
import { readable } from "./icons";
import TagTerm from "./TagTerm";
import Reveal from "./Reveal";
import MobileCollapse from "./MobileCollapse";
import { ICON_PATHS } from "./icons";
import { hash, mulberry } from "../utils/draw";

/**
 * Owns, the Projects section: the cards, and the drawing on each cover.
 * Does not own: what a project IS. Every string comes from `projects` in
 * `constants`; this file decides only how it is shown.
 *
 * THE COVERS ARE DRAWN, NOT PHOTOGRAPHED, and that is the point of the
 * section. Each one is a small diagram of how that project actually works —
 * a question being embedded and its passages retrieved, a detector boxing an
 * object, training happening in three places at once. A screenshot of a UI
 * would say less, because the interesting part of this work is the shape of
 * the system behind it.
 *
 * Each cover is a function taking a 2D context, further down this file. They
 * are plain canvas calls on purpose: no library, no dependency, and the
 * drawing lives beside the card that uses it.
 *
 * THE TRAP. Every cover seeds its randomness from the PROJECT NAME
 * (`hash(name || cover)` with `mulberry` in `utils/draw.js`), so a drawing is
 * stable across reloads. Renaming a project silently changes its artwork, and
 * nothing in the build will mention it.
 *
 * A PHONE SHOWS THREE CARDS and offers the rest. `PHONE_CARDS` here and the
 * `.projects-grid[data-collapsed]` rule in `index.css` are ONE mechanism —
 * change one and you must change the other. A deep link to a hidden card has
 * to open the deck first, which is why links elsewhere point at
 * `#<project name>` rather than at `#projects`.
 */

/* The cover drawings live in `works/covers.js`: 250 lines of canvas calls
   that share nothing with the components below but the 2D context. See the
   header there for why the covers are drawn rather than screenshotted, and
   for the renaming trap. */
import { DRAWERS, LABELS, ANIMATED } from "./works/covers";


// How wide the leading edge of the build is, in px. A hard edge reads as a
// mask sliding across; 48px of feather reads as the drawing arriving.
const FEATHER = 48;

/**
 * The cover draws itself as the card comes up the screen.
 *
 * Every one of these diagrams is a left-to-right pipeline — query, then the
 * store, then the cited answer — so revealing it left to right is not a
 * transition dropped on top of the picture, it is the picture's own order. The
 * reader watches the system get built in the direction it runs.
 *
 * It is a composited wipe over the finished frame, not a build parameter
 * threaded through six drawers. The drawers are ~250 lines of bespoke canvas
 * each and they already take a `t` that means "where in the loop am I"; giving
 * them a second axis meaning "how much of me exists" would mean rewriting all
 * six and would put the same six-branch condition in each. `destination-out`
 * with a gradient does it once, for every cover, including ones added later.
 */
const ProjectCover = ({ cover = "retrieval", name }) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  // Built by the time the card reaches the middle of the screen, so it is
  // finished while the reader is still reading it rather than after they pass.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  useEffect(() => {
    const c = ref.current;
    const drawer = DRAWERS[cover];
    if (!c) return;
    if (!drawer) {
      // A typo in a cover key used to render as an empty panel labelled
      // "preview", which reads like an intentional placeholder. It is not.
      if (import.meta.env.DEV) {
        console.warn(`ProjectCover: no drawer named "${cover}". Keys: ${Object.keys(DRAWERS).join(", ")}`);
      }
      return;
    }
    const ctx = c.getContext("2d");
    const seed = hash(name || cover);
    let dpr = 1, w = 0, h = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
    };

    const render = (t, build = 1) => {
      if (!w || !h) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.textAlign = "left";
      drawer(ctx, w, h, t, mulberry(seed));
      if (build >= 1) return;
      // Erase what has not been drawn yet. The gradient runs transparent to
      // opaque across FEATHER, so the edge fades rather than cutting.
      const x = build * (w + FEATHER) - FEATHER;
      const g = ctx.createLinearGradient(x, 0, x + FEATHER, 0);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,1)");
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = g;
      ctx.fillRect(x, 0, w - x, h);
      ctx.globalCompositeOperation = "source-over";
    };

    resize();

    // Static covers draw exactly once, so they were the ones that stayed wrong:
    // squashed after a resize, and stuck in the fallback typeface if the canvas
    // won the race against the webfonts.
    if (reduced) {
      render(-1);
      const ro = new ResizeObserver(() => { resize(); render(-1); });
      ro.observe(c);
      let alive = true;
      document.fonts?.ready.then(() => { if (alive) render(-1); });
      return () => { alive = false; ro.disconnect(); };
    }

    // Every cover gets a loop now, because even a static diagram needs frames
    // while it is building. A static one that has finished building stops
    // asking for them again: `settled` is what keeps three of the six covers
    // from holding a rAF open for the life of the page.
    const animated = ANIMATED.has(cover);
    let raf, start = null, visible = true, settled = false;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) settled = false; // re-entering re-checks; resize may have changed w
    }, { threshold: 0.1 });
    io.observe(c);
    const ro = new ResizeObserver(() => { resize(); settled = false; });
    ro.observe(c);
    const loop = (ts) => {
      if (start === null) start = ts;
      if (visible && !settled) {
        const build = Math.max(0, Math.min(1, scrollYProgress.get()));
        render(animated ? ((ts - start) % 3200) / 3200 : -1, build);
        if (!animated && build >= 1) settled = true;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, [cover, name, reduced, scrollYProgress]);

  return (
    <div className="relative w-full rounded-[14px] overflow-hidden border border-line-strong bg-canvas" style={{ aspectRatio: "16 / 9" }}>
      <canvas ref={ref} className="absolute inset-0 w-full h-full" aria-hidden="true" />
      <span className="absolute top-2.5 left-3 font-mono text-micro tracking-label uppercase text-canvas-ink">
        {LABELS[cover] || "preview"}
      </span>
    </div>
  );
};

/**
 * An 8-degree tilt toward the pointer, written to the node as `--rx`/`--ry` for
 * the transform in `.project-card`. Same idiom as the Stack spotlight in
 * `Tech.jsx`, and imperative for the same reason: routing a pointermove through
 * React state would re-render six cards on every mouse pixel for an effect that
 * is pure compositing.
 *
 * This replaced `react-tilt`, a whole runtime dependency for one hover. The
 * library also wrote its transform to the style attribute of the element it
 * wrapped, which is exactly where framer-motion writes, so the two had to be
 * kept on separate elements. A CSS variable does not collide with anything.
 *
 * There is no matching "untilt": the transform is applied under `:hover` in
 * `.project-card`, so the pointer leaving resets it through the cascade and
 * cannot leave a card stuck at an angle because a handler did not fire.
 */
const MAX_TILT = 8;

const tilt = (e) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  // -0.5..0.5 from the centre. Y drives rotateX and X drives rotateY, which
  // looks backwards and is not: tilting "up at the top" is rotation about X.
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  el.style.setProperty("--rx", `${-y * MAX_TILT * 2}deg`);
  el.style.setProperty("--ry", `${x * MAX_TILT * 2}deg`);
};

const ProjectCard = ({ index, name, cover, outcome, description, tags, source_code_link, live_link, featured }) => {
  const reduced = useReducedMotion();
  const isLive = Boolean(live_link);
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  // Small on purpose: enough to read as depth, not enough to look like drift.
  // Note: framer logs "container has a non-static position" in dev. The container
  // here is <html>, which is position:static on every site by default; the warning
  // is dev-only (NODE_ENV guard in on-scroll-handler.mjs) and the measured offsets
  // are correct. Silencing it would mean position:relative on <html>, which is a
  // real cascade change for no production benefit.
  const coverY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [14, -14]);
  return (
    <Reveal
      ref={cardRef}
      // Column-based, so a row arrives together and the next row waits for the
      // reader. Indexing by absolute position staggered all six off one event,
      // which on a phone finished before the reader reached card three.
      // The anchor About links to. Also what lets the reveal below know a
      // specific card was asked for: a repo name is already unique in `projects`
      // and already the visible label, so it needs no separate id scheme.
      id={name}
      delay={(index % 3) * 0.07}
      className={`h-full scroll-mt-[5.5rem] ${featured ? "sm:col-span-2" : ""}`}
    >
      <div
        onPointerMove={reduced ? undefined : tilt}
        className="project-card h-full glass-card p-5 rounded-2xl hover:border-accent/40 transition-colors flex flex-col"
      >
        <motion.div style={{ y: coverY }}>
          <ProjectCover cover={cover} name={name} />
        </motion.div>

        <div className="mt-5 flex items-center gap-3">
          <span
            className={`font-sans text-[12px] font-medium uppercase tracking-[0.09em] px-2 py-0.5 rounded ${
              isLive ? "text-live border border-live/40" : "text-archive border border-archive/40"
            }`}
          >
            {isLive ? "live" : "source"}
          </span>
          <span className="font-mono text-data text-faint min-w-0 break-all sm:truncate" title={name}>{name}</span>
        </div>

        <h3 className="mt-3 font-display font-semibold text-[calc(clamp(1.15rem,1.6vw,1.5rem)*var(--type-scale,1))] leading-[1.2] tracking-[-0.01em] text-white-100">
          {outcome}
        </h3>
        {/* On a phone the outcome above is the card; this is the detail
            behind it. Collapsed there, inline everywhere else. */}
        <MobileCollapse label="What it does">
          <p className="mt-2 font-sans text-secondary text-body leading-[1.6] max-w-[28rem]">
            {description}
          </p>

          <div className="mt-4">
            <span className="font-sans text-[12px] font-medium uppercase tracking-[0.09em] text-faint">
              built with
            </span>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {tags.map((t) => (
                <TagTerm key={t} name={t} plain />
              ))}
            </div>
          </div>
        </MobileCollapse>

        <div className="mt-auto pt-4 border-t border-line flex flex-wrap gap-x-5 gap-y-1 font-mono text-data">
          <a href={source_code_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 min-h-11 sm:min-h-0 text-secondary hover:text-accent transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={ICON_PATHS.github} />
            </svg>
            GitHub repo ↗
          </a>
          {live_link && (
            <a href={live_link} target="_blank" rel="noreferrer" className="inline-flex items-center min-h-11 sm:min-h-0 text-live hover:text-accent transition-colors">
              {readable(live_link)} ↗
            </a>
          )}
        </div>
      </div>
    </Reveal>
  );
};

// "live" is the count with a deployed URL, which is the only claim here that a
// reader can go and check for themselves.
const LIVE = projects.filter((p) => p.live_link).length;
const WORK_META = `${projects.length} built${LIVE ? ` · ${LIVE} live` : ""}`;

/**
 * How many project cards a phone gets before it has to ask for the rest.
 *
 * Measured at 390x844: the six cards are 2,818px of a 9,825px page — 29% of
 * everything, and the reader crosses all of it to reach Contact. Three is the
 * number because the grid is one column below `sm` and three cards is about two
 * screens, which is as much as one section can ask for before it has to earn
 * more.
 *
 * Nothing is deleted. The cut is a disclosure, not a shorter list: every card
 * is still in the DOM, still in `llms.txt`, still in the `<noscript>` block, and
 * one tap away. Above `sm` the grid is two or three columns and the whole thing
 * turns itself off.
 */
const PHONE_CARDS = 3;

const Works = () => {
  // Deep link wins over the limit. About cites three projects by name and one
  // of them, `pb-card-deck`, is the sixth — so on a phone the limit added in the
  // same change that introduced it sent a reader to a section where the card
  // they tapped was not drawn. Any link to a card past the cut opens the deck
  // first. `useState` initialiser, not an effect: the card has to be in the
  // layout before the browser looks for the anchor to scroll to.
  const asked = () => {
    if (typeof window === "undefined") return false;
    const name = decodeURIComponent(window.location.hash.slice(1));
    return projects.findIndex((p) => p.name === name) >= PHONE_CARDS;
  };
  const [showAll, setShowAll] = useState(asked);
  const gridRef = useRef(null);
  const hiddenCount = projects.length - PHONE_CARDS;

  // Same again for a link followed while the page is already open, which changes
  // the hash without reloading. The browser has ALREADY scrolled to the anchor
  // by then, while the three cards above it were still hidden, so it lands about
  // 1,800px short of the card.
  const reaim = useRef(null);
  useEffect(() => {
    const onHash = () => {
      if (!asked()) return;
      reaim.current = decodeURIComponent(window.location.hash.slice(1));
      setShowAll(true);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Re-aim AFTER the commit, not in a `requestAnimationFrame` inside the
  // handler: that frame can run before React has painted the revealed cards, and
  // then the correction is computed against the same short layout that caused
  // the problem. An effect keyed on `showAll` cannot run too early.
  useEffect(() => {
    if (!showAll || !reaim.current) return;
    document.getElementById(reaim.current)?.scrollIntoView();
    reaim.current = null;
  }, [showAll]);

  /** The button removes itself once used, and a removed element takes the
   *  keyboard's place in the document with it: the next Tab would start again
   *  from the top of the page. So focus moves to the first card that just
   *  appeared, which is also where a reader's eye goes. */
  const revealAll = () => {
    setShowAll(true);
    requestAnimationFrame(() => {
      gridRef.current
        ?.children[PHONE_CARDS]?.querySelector("a, button")
        ?.focus({ preventScroll: true });
    });
  };

  return (
  <>
    <SectionHead title="Projects" meta={WORK_META} />

    <motion.p
      variants={fadeIn("", "", 0.1, 1)}
      className="mt-4 font-sans text-secondary text-lede max-w-[34rem] leading-[1.7]"
    >
      Production RAG on AWS, federated and real-time computer vision, multimodal
      search, and one app that is live and in use.
    </motion.p>

    {/* `items-stretch`, not `items-start`. Cards in a row now match height
        regardless of how long a description runs, because a ragged row of
        cards reads as an alignment error rather than as a design. */}
    {/* The limit is CSS, not a `slice`, and the reason is worth keeping: a
        `slice` would need JS to know the viewport width, which means a media
        query in JS, a listener, and a first render that guesses wrong. A
        `nth-child` rule inside a `max-width` block is the browser doing it. */}
    <div
      ref={gridRef}
      data-collapsed={showAll ? undefined : "true"}
      className="projects-grid mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
    >
      {projects.map((p, i) => (
        <ProjectCard key={p.name} index={i} featured={i === 0} {...p} />
      ))}
    </div>

    {/* `sm:hidden` alone, for the same reason: above `sm` the rule above does
        not apply, so a button offering to reveal what is already visible would
        be a lie. It removes itself from the tree once used. */}
    {!showAll && (
      <button
        type="button"
        onClick={revealAll}
        // Transparent, not `bg-canvas`: that token is the dark INK, not the page
        // ground, and it painted a near-black bar with 196,38,15 text on it at
        // about 2:1. The scene ground showing through puts `accent-ink` on
        // paper at 5.54:1 instead, and keeps this reading as a quiet control
        // rather than a second CTA competing with the hero's.
        className="sm:hidden mt-6 w-full min-h-11 rounded-xl border border-line-strong bg-transparent px-4 font-sans text-[13px] font-medium text-accent-ink"
      >
        Show {hiddenCount} more {hiddenCount === 1 ? "project" : "projects"}
      </button>
    )}
  </>
  );
};

export default SectionWrapper(Works, "projects");
