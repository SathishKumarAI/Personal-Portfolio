import { useState } from "react";
import { motion } from "framer-motion";
import { stackGroups, TERM_HINT } from "../constants";
import { fadeIn } from "../utils/motion";
import Reveal from "./Reveal";
import { SectionWrapper } from "../hoc";
import SectionHead from "./SectionHead";
import TokenStream from "./TokenStream";
import TagTerm from "./TagTerm";
import StackDiagram, { DiagramControls } from "./StackDiagram";

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
    className="hidden md:flex h-full min-h-[9rem] flex-col rounded-2xl border border-line bg-tertiary p-4"
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
         reads as something that failed to load.

         It is also the ONLY place the instruction is given now. There used to
         be a separate hint line under the intro -- "Dotted terms have a
         plain-English definition, tap one" -- which is the same sentence this
         panel was already saying, 400px away from it, and both were desktop
         only so a desktop reader got it twice. `TERM_HINT` moved in here
         rather than being retyped, so there is still one string. */
      <p className="m-auto text-center font-serif italic text-faint text-label leading-[1.5]">
        {TERM_HINT}
        <br />
        Tap one to keep it here.
      </p>
    )}
  </div>
);

/**
 * The offer, and it is phrased as an offer on purpose.
 *
 * The owner's instruction was to let the reader choose rather than deciding
 * for them: "let's give the chance to the user instead of just ourselves
 * deciding to either to show stacks or like system diagram". A segmented
 * control labelled "Tools / System" would be a setting; a question is an
 * invitation, and the second option is the one most readers will not know is
 * there.
 *
 * Both options stay rendered as real buttons rather than one button whose
 * label flips. A control that says "See the system diagram" and then says
 * "Back to the list" is two different controls in one position, and a reader
 * who looks away loses track of which state they are in. Two buttons with the
 * current one marked never has that problem, and `aria-pressed` says the same
 * thing to a screen reader that the fill says to an eye.
 *
 * `lg`, matching StackDiagram itself. Offering a view that the viewport will
 * refuse to render is worse than not offering it.
 */
const ViewToggle = ({ view, onChange }) => (
  <div className="hidden lg:flex items-center gap-3">
    {/* The invitation is only an invitation while the answer is still no.
        Asking "would you like to see this as a system diagram?" beside a
        system diagram the reader is already looking at reads as a control that
        has not noticed its own state. It also does not fit: in the diagram
        view this sits at the end of a row that already carries the `?`, the
        platform picker and the note, and the question alone is ~300px. */}
    {view !== "diagram" && (
      <span className="font-serif italic text-faint text-label">
        Would you like to see this as a system diagram?
      </span>
    )}
    <div
      role="group"
      aria-label="Stack view"
      className="flex items-center gap-1 rounded-full border border-line p-0.5"
    >
      {[
        ["list", "Tool list"],
        ["diagram", "System diagram"],
      ].map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          aria-pressed={view === id}
          className={`rounded-full px-3 py-1 font-mono text-micro uppercase tracking-[0.12em] transition-colors ${
            view === id
              ? "bg-accent text-white-100"
              : "text-faint hover:text-white-100"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
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

  /**
   * Which reading of the stack is on screen. Defaults to the list, and that
   * default is deliberate: the list is what a recruiter scanning for a
   * keyword needs, and it is the one that works at every width. The diagram
   * is the better answer to "do these fit together", which is a question the
   * reader has to be interested enough to ask.
   *
   * Not persisted. A remembered view means a reader returning to the page
   * lands on a diagram they chose once, weeks ago, with no memory of choosing
   * it -- which reads as the site being broken rather than as a preference
   * being honoured.
   */
  const [view, setView] = useState("list");

  // Lifted out of StackDiagram because its CONTROL sits in the header, where
  // there is free vertical space, while the thing it controls sits below the
  // header. See PlatformPicker's own comment.
  const [why, setWhy] = useState(false);
  const [clouds, setClouds] = useState(false);

  // Shared by both views, so a term pinned in the list is still pinned when
  // the reader switches to the diagram. Written once rather than inline in
  // each view: two copies of a toggle-the-pin rule is two chances for them to
  // disagree about what a second tap does.
  const pinTerm = (e) => setPinned((p) => (p?.name === e.name ? null : e));

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
      <div className="md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] md:gap-x-12 md:items-stretch">
        <div className="min-w-0">
          <SectionHead title="Stack" meta={STACK_META} />

          <motion.p
            variants={fadeIn("", "", 0.1, 1)}
            // Desktop only. On a phone this section is a list of tools and the
            // argument for them is three lines the reader scrolls past.
            className="hidden md:block mt-4 max-w-[46rem] font-sans text-secondary text-body leading-[1.65]"
          >
            {view === "diagram" ? (
              /* VIEW-SPECIFIC, and not as a trick to save height -- though it
                 saves 56px, which is why it got looked at. The list's sentence
                 says the tools are "grouped by where it sits on the path from
                 raw data to a running product". In the diagram that path is
                 drawn, with the stages named and the edges labelled, so the
                 sentence is describing something the reader is looking at.
                 What they need instead is how to READ the drawing. */
              <>
                The same tools, filed by the job they do in a system rather
                than by what I would call the skill. Hover any one for what it
                is; pick a platform to see what fills its role there.
              </>
            ) : (
              <>
                Not a badge collection: this is what I actually reach for,
                grouped by where it sits on the path from raw data to a running
                product. I pick tools that are boring in production:
                measurable, reproducible, and easy to hand off.
              </>
            )}
          </motion.p>

        </div>

        {/* The panel is the whole right column now, and it STRETCHES to the
            row rather than hanging off the bottom of it. Bottom-aligned it
            left its own gap above itself once the toggle moved out; filling
            the row also gives a long definition more room before it has to
            wrap, which is the only thing that was ever cramped about it. */}
        <div className="flex flex-col gap-3">
          <DefinitionPanel entry={shown} pinned={Boolean(pinned)} />
          {/* LIST VIEW ONLY, and it is free here. The right column holds a
              144px panel against a 229px left column, so a 30px control fits
              in the slack and the section does not grow. Given its own strip
              below the header it cost a measured 54px — for a control that
              had somewhere free to be.

              In the diagram view it moves to the end of the controls row,
              which is where it was asked to go and where its siblings are.
              Both positions are right-aligned and directly above the content,
              so the control does not travel far when the view changes. */}
          {view === "list" && (
            <div className="hidden md:flex justify-end">
              <ViewToggle view={view} onChange={setView} />
            </div>
          )}
        </div>
      </div>

      {/* Two shapes, because a phone and a desktop want different things here.
          On a phone this is one block with six labelled rows: six bordered cards
          each carrying a description was most of a screen per card for content
          that is really a list. Cards return at md, where there is room for the
          description to earn its place. Each row and each card still reveals on
          its own viewport entry, so the section animates as the reader arrives
          at it rather than all at once. */}
      {/* The diagram's own controls: `?`, platform, and the view toggle at
          the end. Rendered only for the view they act on — a vendor picker
          above a tool list would be a control with nothing to change. */}
      {view === "diagram" && (
        <div className="mt-6 hidden md:block">
          <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
            <div className="min-w-0 flex-1">
              <DiagramControls
                why={why}
                onWhy={() => setWhy((v) => !v)}
                clouds={clouds}
                onClouds={() => setClouds((v) => !v)}
              />
            </div>
            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>
      )}

      <div className="mt-6">
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
        {/* THE PATH RULE CAME OUT, and it was the fourth statement of one fact.

           It was a segmented rail of six tinted bars, then a line reading
           "FROM RAW DATA ---- TO A RUNNING PRODUCT". The columns already run
           left to right, they are already numbered 01-06, they already carry
           their own tint bar, and the intro paragraph directly above already
           says "grouped by where it sits on the path from raw data to a
           running product" -- the same words. A label with no sentence around
           it is what made "what does RAW DATA mean here?" a fair question;
           the sentence that answers it was always three lines up.

           It also cost 41px of a section under a one-screen budget that now
           carries 47 terms. Measured: 897px to 856px, 1.02 screens to 0.97. */}

        {/* SIX COLUMNS, ONE ROW — the pipeline IS the layout.
            A 3x2 grid of cards states six categories and throws the ordering
            away; the rail above had to draw it back. Laid left to right, the
            columns are the path, and the section stopped being 1.34 screens
            tall.

            Six only from `xl`. Below that the columns would be narrower than
            the longest chip ("Exploratory analysis"), so it steps down to
            three and then two rather than letting a tool name wrap mid-word. */}
        {/* The diagram, when it is asked for. Below `lg` the toggle is not
            offered and `view` can only be "list", so the grid remains the one
            thing a tablet or a phone can reach. */}
        {view === "diagram" && (
          <StackDiagram onDefine={setHovered} onPin={pinTerm} shown={shown} />
        )}

        <div
          className={`${
            view === "diagram" ? "hidden" : "hidden md:grid"
          } md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-x-4 gap-y-7 items-start`}
        >
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
                <div className="mt-3 flex flex-col items-start gap-y-0.5">
                  {g.items.map((it) => (
                    <TagTerm
                      key={it}
                      name={it}
                      flow
                      dense
                      primary={g.primary?.includes(it)}
                      onDefine={setHovered}
                      onPin={pinTerm}
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
