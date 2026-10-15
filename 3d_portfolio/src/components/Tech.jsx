import { useState } from "react";
import { motion } from "framer-motion";
import { stackGroups, TERM_HINT } from "../constants";
import { fadeIn } from "../utils/motion";
import Reveal from "./Reveal";
import { SectionWrapper } from "../hoc";
import SectionHead from "./SectionHead";
import TokenStream from "./TokenStream";
import TagTerm from "./TagTerm";

// A set, not a sum: several tools appear in more than one group, and counting
// the arrays would claim more than he lists.
const STACK_META = `${stackGroups.length} areas · ${
  new Set(stackGroups.flatMap((g) => g.items)).size
} tools`;

const stageNo = (i) => String(i + 1).padStart(2, "0");

/**
 * Owns, the one place a tool's definition is read.
 * Does not own: which tool that is — the section decides, from hover and taps.
 *
 * It replaced thirty-three floating popovers. Those failed twice over: the
 * surface was `rgba(255 255 255 / 0.62)`, so a definition rendered over a card
 * full of chips could not be read through its own background, and hover-open
 * plus click-pin let two sit on screen overlapping each other.
 *
 * A fixed slot cannot cover anything, cannot be clipped by the row below, and
 * gives a reader ONE place to look — which matters more here than anywhere
 * else on the page, because a recruiter meeting an unfamiliar tool is exactly
 * who this section is for.
 *
 * It holds its height whether or not anything is selected. A panel that
 * appears and disappears would move the rail and the heading beside it on
 * every hover, and the fix for a jumpy section is not a jumpier one.
 */
const DefinitionPanel = ({ entry, pinned }) => (
  <div
    /* OPAQUE. `bg-tertiary/40` was the first attempt and it is the very
       fault this panel exists to fix: a translucent surface carrying prose
       lets whatever is behind it bleed into the words. The old popover was
       `rgba(255 255 255 / 0.62)` and unreadable for exactly that reason. */
    className="hidden md:flex min-h-[9rem] flex-col rounded-2xl border border-line bg-tertiary p-4"
    // Announced, but politely: the reader asked for this by pointing at a
    // chip, so it is a result, not an alert.
    aria-live="polite"
  >
    {entry ? (
      <>
        <p className="flex items-baseline gap-2">
          <span className="font-display text-[15px] font-semibold text-white-100 tracking-[-0.01em]">
            {entry.name}
          </span>
          {pinned && (
            <span className="font-mono text-micro uppercase tracking-[0.12em] text-accent-ink">
              pinned
            </span>
          )}
        </p>
        {entry.full && entry.full !== entry.name && (
          <p className="mt-0.5 font-mono text-label text-faint">{entry.full}</p>
        )}
        <p className="mt-2 font-sans text-data text-secondary leading-snug">
          {entry.def}
        </p>
        {entry.link && (
          <a
            href={entry.link}
            target="_blank"
            rel="noreferrer"
            className="mt-auto pt-2 font-mono text-chip text-accent-ink hover:underline"
          >
            Learn more ↗
          </a>
        )}
      </>
    ) : (
      /* The resting state says what the slot is FOR. An empty bordered box
         reads as something that failed to load. */
      <p className="m-auto text-center font-serif italic text-faint text-label leading-[1.5]">
        Point at any tool to read what it does.
        <br />
        Tap one to keep it here.
      </p>
    )}
  </div>
);

const Tech = () => {
  // Which group the pointer is on, or null. Drives only the rail above the
  // grid: the cards light themselves in CSS, which needs no state at all.
  const [active, setActive] = useState(null);

  /**
   * ONE definition panel for thirty-three terms.
   *
   * `hovered` is what the pointer is over; `pinned` is what a tap fixed in
   * place. Pinned wins, so a reader can park a definition and keep scanning
   * without it being stolen by whatever the cursor crosses next.
   *
   * Both live here rather than in the chips because "only one is showing" is a
   * fact about the section. Thirty-three components each owning a popover is
   * how two ended up on screen at once.
   */
  const [hovered, setHovered] = useState(null);
  const [pinned, setPinned] = useState(null);
  const shown = pinned ?? hovered;

  return (
    <>
      {/* The token stream, back and boxed.
          It belongs here -- this is the section with the LLM / RAG group, so a
          stream of sub-word pieces illustrates the content rather than
          decorating the page. What was wrong was its SIZE, not its presence:
          at `w-[52%]` it measured a 416x106px overlap with the intro paragraph
          (the whole paragraph) and another 416x19 with the hint. Deleting it
          was the wrong correction.

          Confined to the top-right block instead, which is the one region the
          new layout genuinely leaves empty -- above the definition panel and
          clear of the text column. The repo's rule is that ambient work must
          not cross text, not that it cannot exist. */}
      <TokenStream />

      {/* HEADER IN TWO COLUMNS, and the argument stays with the heading.
          The first attempt put the intro in the right column and the panel
          under it. That left 244px of measured dead space under "Stack" on the
          left, because the right column was the taller of the two and the grid
          waits for both. Reading order suffered too: the eye had to cross the
          page to find the sentence that explains the section.
          Heading and argument together on the left; the panel takes the right,
          which is the half that was empty to begin with.

          `items-end`, not `items-start`. Aligned to the top, the panel sat at
          the top right while the tools it describes were ~400px below it, so
          pointing at a chip meant reading the answer at the other end of the
          section. Dropped to the baseline of the header it sits directly above
          the columns, and the slack moves up beside the display-size heading,
          where open space reads as intent rather than as a gap. */}
      <div className="md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] md:gap-x-12 md:items-end">
        <div className="min-w-0">
          <SectionHead title="Stack" meta={STACK_META} />

          <motion.p
            variants={fadeIn("", "", 0.1, 1)}
            // Desktop only. On a phone this section is a list of tools and the
            // argument for them is three lines the reader scrolls past.
            className="hidden md:block mt-4 max-w-[46rem] font-sans text-secondary text-body leading-[1.65]"
          >
            Not a badge collection: this is what I actually reach for, grouped
            by where it sits on the path from raw data to a running product. I
            pick tools that are boring in production: measurable, reproducible,
            and easy to hand off.
          </motion.p>

          {/* The hint is an instruction about the interface, not part of the
              argument the intro is making, so it gets its own line, its own
              voice (serif italic, the reading face) and a mark. The info glyph
              is inline rather than in icons.js: that module owns brand marks
              and off-site destinations, not one-off affordances. */}
          <motion.p
            variants={fadeIn("", "", 0.18, 1)}
            className="hidden md:flex mt-3 items-start gap-2 font-serif italic text-faint text-label leading-[1.5]"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="mt-[3px] shrink-0"
            >
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16zm-1 3h2v2h-2V7zm0 4h2v6h-2v-6z" />
            </svg>
            {TERM_HINT}
          </motion.p>
        </div>

        <DefinitionPanel entry={shown} pinned={Boolean(pinned)} />
      </div>

      {/* Two shapes, because a phone and a desktop want different things here.
          On a phone this is one block with six labelled rows: six bordered cards
          each carrying a description was most of a screen per card for content
          that is really a list. Cards return at md, where there is room for the
          description to earn its place. Each row and each card still reveals on
          its own viewport entry, so the section animates as the reader arrives
          at it rather than all at once. */}
      <div className="mt-6 sm:mt-8">
        {/* phone: six labelled rows of flowing terms, no card and no chips.
            Boxed, this was thirty-three bordered rectangles about 50px tall — a
            form, not a vocabulary, and most of a screen per group. Bare terms
            carry the same two tiers in weight and colour, and the dotted
            underline still marks what is definable. The wave that used to sit
            above this is gone: at 390px it rendered as struck-through fragments
            in a band of its own and read as a glitch rather than a stream.

            The number on the right was the group's tool count and is now its
            stage number, so a phone and a desktop tell the same story about the
            order. The count was never the interesting number: the tools it
            counts are on the next line.

            The tinted left rule replaces the row divider and the dot. It does
            the same separating job a grey hairline did and, unlike the hairline,
            it carries the category colour down the whole row instead of into one
            8px circle. */}
        <div className="md:hidden flex flex-col gap-5">
          {stackGroups.map((g, i) => (
            <Reveal
              key={g.title}
              delay={i * 0.06}
              y={12}
              className="border-l-2 pl-4"
              style={{ borderColor: `rgb(var(${g.tint}) / 0.8)` }}
            >
              <h3 className="flex items-baseline gap-2">
                <span className="font-display text-[15px] font-semibold text-white-100 tracking-[-0.01em]">
                  {g.title}
                </span>
                {/* Inside the <h3>, unlike the desktop variant below, so
                    without this the group's accessible name is "Data
                    engineering01". Same reason the Roles stage numeral is
                    hidden: it is a position marker, not part of the name. */}
                <span
                  aria-hidden="true"
                  className="stack-index ml-auto font-mono text-micro"
                  style={{ "--cat": `var(${g.tint})` }}
                >
                  {stageNo(i)}
                </span>
              </h3>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0">
                {g.items.map((it) => (
                  <TagTerm key={it} name={it} flow primary={g.primary?.includes(it)} />
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        {/* md and up: the cards, with the descriptions.
            Reveal stays the motion wrapper and the card is a plain child of it,
            so the pointermove handler writes --mx/--my to an element that
            framer-motion is not also writing a style attribute to. */}
        {/* THE PATH, SAID ONCE.
            This was a segmented rail: six tinted bars with "raw data" and
            "running product" at the ends. It was drawn when the areas were a
            3x2 grid of cards, which states six categories and throws the
            ordering away -- the rail had to put the ordering back.

            The columns ARE the ordering now. They run left to right, they are
            numbered 01-06, and each carries its own tint bar. The rail was
            therefore saying the same thing a third time, which is why it read
            as decoration nobody could interpret: "what does RAW DATA mean
            here?" is the right question to ask of a label with no sentence
            around it.

            What survives is the part the columns genuinely cannot say -- where
            the path starts and where it ends -- written as the two halves of a
            sentence rather than as two bare labels. */}
        <Reveal
          delay={0.1}
          className="hidden md:flex items-baseline justify-between gap-4 mt-10 font-mono text-micro text-faint uppercase tracking-[0.14em]"
        >
          <span>from raw data</span>
          <span aria-hidden="true" className="h-px flex-1 bg-line" />
          <span>to a running product</span>
        </Reveal>

        {/* SIX COLUMNS, ONE ROW — the pipeline IS the layout.
            A 3x2 grid of cards states six categories and throws the ordering
            away; the rail above had to draw it back. Laid left to right, the
            columns are the path, and the section stopped being 1.34 screens
            tall.

            Six only from `xl`. Below that the columns would be narrower than
            the longest chip ("Exploratory analysis"), so it steps down to
            three and then two rather than letting a tool name wrap mid-word. */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-x-4 gap-y-7 items-start">
          {stackGroups.map((g, i) => (
            <Reveal
              key={g.title}
              // By column, so the row arrives as a row travelling left to
              // right — the same direction the pipeline reads.
              delay={(i % 6) * 0.06}
              className="min-w-0"
            >
              <div
                className="flex min-w-0 flex-col"
                style={{ "--cat": `var(${g.tint})` }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              >
                {/* The tint rule is what ties a column to its segment in the
                    rail above. It replaces the card border: six bordered boxes
                    side by side read as a table, and the colour already does
                    the grouping the border was doing. */}
                <span
                  aria-hidden="true"
                  className="h-[3px] w-full rounded-full"
                  style={{
                    background: `rgb(var(${g.tint}))`,
                    opacity: active === null ? 0.55 : active === i ? 1 : 0.2,
                  }}
                />
                <div className="mt-3 flex items-baseline gap-2">
                  <h3 className="font-display text-[15px] font-semibold text-white-100 tracking-[-0.01em] leading-tight">
                    {g.title}
                  </h3>
                  <span className="stack-index ml-auto shrink-0 font-mono text-[15px] font-medium leading-none">
                    {stageNo(i)}
                  </span>
                </div>
                {g.note && (
                  <p className="mt-1.5 font-serif text-secondary text-label leading-[1.45]">
                    {g.note}
                  </p>
                )}
                {/* BARE WORDS, not boxes — the treatment this file already
                    uses on a phone, for the reason it already gives there:
                    "the dotted underline does all the work the border was
                    doing... same information, a fifth of the ink."

                    Boxed, a 200px column could not hold "Detection & tracking"
                    or "Exploratory analysis" on one line, so those two chips
                    broke across two lines and stood 45px tall against 25px for
                    every other chip — measured. And the primary tier was a
                    solid near-black fill, so twelve of thirty-three tools were
                    the heaviest marks in the section, competing with the
                    heading for no stated reason.

                    Bare, a long name simply wraps as text, and the tier is
                    carried by weight and colour the way the rest of the page
                    carries emphasis. */}
                <div className="mt-3 flex flex-col items-start gap-y-1">
                  {g.items.map((it) => (
                    <TagTerm
                      key={it}
                      name={it}
                      flow
                      dense
                      primary={g.primary?.includes(it)}
                      onDefine={setHovered}
                      onPin={(e) => setPinned((p) => (p?.name === e.name ? null : e))}
                      active={shown?.name === it}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "stack");
