import {
  systemStages,
  systemFloor,
  platformSwaps,
  PLATFORMS,
  PLATFORM_NOTE,
  DIAGRAM_WHY,
} from "../constants";
import Reveal from "./Reveal";
import TagTerm from "./TagTerm";

/**
 * Owns, the stack drawn the way it would be drawn on a whiteboard.
 * Does not own: which tools exist, or what any of them means. Those are
 * `systemStages` and `glossary` in `../constants`, and `utils/stages.test.mjs`
 * fails if this diagram and the tool list stop covering the same 47 terms.
 *
 * WHY THE BOXES ARE NOT HIS SKILL AREAS
 *
 * The first version drew one box per `stackGroups` entry: Data engineering,
 * Data science, Computer vision. It fit on a screen, it was tidy, and it was
 * the tool list with arrows added -- because the boxes were still categories
 * of a PERSON rather than parts of a SYSTEM.
 *
 * Nobody draws a box called "Data engineering" in a design interview. The
 * boxes are the jobs the system has to do, and the tools are what drops into
 * each slot. That reframing is what makes the useful sentence available:
 * "Airflow orchestrates here; on GCP that is Composer, on AWS that is MWAA --
 * same role." A list of skills cannot get near that sentence.
 *
 * WHY BANDS AND NOT COLUMNS
 *
 * Five boxes in a row gave each stage about 200px, and 47 tools wrapped inside
 * 200px look exactly like what they were reported as: "all the skills are
 * scattered... they are not looking like tool list." Ragged two- and
 * three-word wraps, every box breaking in a different place, no two tools
 * sharing a left edge.
 *
 * Full-width bands give every stage ~1,000px, so its tools sit on one line, in
 * one row, aligned. The pipeline still reads top to bottom through the labelled
 * arrows, which is how a layered system diagram is normally drawn anyway. The
 * fork is the one place two bands sit side by side, because that is the claim.
 *
 * WHY NO MEASURED CONNECTORS. The obvious build anchors an SVG to the boxes
 * and redraws on resize. That is what the hero field does and what cost this
 * repo its longest bug: a canvas that measured correctly and drew wrong,
 * because a replaced element does not size the way its insets say. Here the
 * connectors are LAYOUT, so there is nothing to measure and no second opinion
 * about where a box is.
 */

const stageById = Object.fromEntries(systemStages.map((s) => [s.id, s]));
const FORK = ["vision", "language"];
const stageNo = (i) => String(i + 1).padStart(2, "0");

/**
 * WHAT MOVES between two stages -- and it has to look nothing like a tool.
 *
 * This was a lowercase word in faint mono sitting between two hairlines, which
 * is the exact typographic treatment the tool names beside it use. Reported,
 * correctly: "I don't see a differentiate between the diagram and the tables,
 * the feature, they are looking the same kind of skills here." A reader
 * scanning the column saw `Airflow`, `PySpark`, `tables`, `pandas` and had no
 * way to know one of those is not a tool he uses.
 *
 * So the payload now carries every signal a tool name does not: a downward
 * arrowhead, a dashed capsule rather than a bare word, uppercase with wide
 * tracking, and the accent ink that nothing in the term list uses. A dashed
 * outline is also the convention for a thing in transit rather than a thing
 * that exists, which is what these are.
 */
const Step = ({ label }) => (
  <div className="flex flex-col items-center">
    <span aria-hidden="true" className="h-1.5 w-px bg-line" />
    <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-accent/45 px-2.5 py-[3px]">
      <svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        aria-hidden="true"
        className="shrink-0 fill-accent-ink"
      >
        <path d="M4 8 0 0h8z" />
      </svg>
      {/* The screen-reader text says what the capsule means, because the
          arrow and the dashes are the only thing carrying that meaning for a
          sighted reader and neither survives being read aloud. */}
      <span className="sr-only">passes to the next stage: </span>
      <span className="font-mono text-micro uppercase tracking-[0.16em] text-accent-ink">
        {label}
      </span>
    </span>
    <span aria-hidden="true" className="h-1.5 w-px bg-line" />
  </div>
);

/**
 * One stage, as a band: who it is on the left, what it uses on the right.
 *
 * The split is what fixes the scattering. With the identity in a fixed-width
 * column the tool rows all start at the same x, so the eye reads a list down
 * the right-hand side instead of hunting ragged wraps inside five boxes.
 * `narrow` is for the forked pair, which share one row and so get half the
 * width each.
 */
const Band = ({ stage, index, narrow, onDefine, onPin, shown }) => (
  <div
    className="flex min-w-0 flex-1 gap-4 rounded-lg border border-line border-l-[3px] bg-tertiary/50 px-3 py-2"
    style={{ borderLeftColor: `rgb(var(${stage.tint}))` }}
  >
    <div className={`shrink-0 ${narrow ? "w-[8.5rem]" : "w-[13rem]"}`}>
      <h3 className="flex items-baseline gap-2 font-display text-[14px] font-semibold leading-tight tracking-[-0.01em] text-white-100">
        {/* A ringed node, not a numeral in the heading. The list view already
            prints `01`-`06` as plain figures beside its column titles, so a
            plain figure here said "same thing again"; a ring says "node in a
            graph", which is the only claim this view is making that the list
            is not. */}
        <span
          aria-hidden="true"
          className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border font-mono text-[10px] font-semibold leading-none"
          style={{
            borderColor: `rgb(var(${stage.tint}))`,
            color: `rgb(var(${stage.tint}))`,
          }}
        >
          {stageNo(index)}
        </span>
        {stage.title}
      </h3>
      {/* The RESPONSIBILITY, not a description of the tools. This line is what
          turns the band from a label into a slot something has to fill, and it
          is the whole difference between this view and the list. */}
      <p className="mt-0.5 font-serif text-label leading-[1.35] text-faint">
        {stage.role}
      </p>
    </div>
    <div className="flex min-w-0 flex-1 flex-wrap content-start gap-x-4 gap-y-0.5">
      {stage.items.map((it) => (
        <TagTerm
          key={it}
          name={it}
          flow
          dense
          onDefine={onDefine}
          onPin={onPin}
          active={shown?.name === it}
        />
      ))}
    </div>
  </div>
);

/* Buttons only. This used to carry `PLATFORM_NOTE` beside them, which put the
   honesty line here AND an equivalent sentence in the swap block -- the same
   claim twice, 20px apart, for 30px of height. */
const PlatformPicker = ({ platform, onChange }) => (
  <div
    role="group"
    aria-label="Platform"
    className="flex shrink-0 items-center gap-1 rounded-full border border-line p-0.5"
  >
    {PLATFORMS.map((p) => (
      <button
        key={p.id}
        type="button"
        onClick={() => onChange(p.id)}
        aria-pressed={platform === p.id}
        className={`rounded-full px-2.5 py-1 font-mono text-micro uppercase tracking-[0.1em] transition-colors ${
          platform === p.id
            ? "bg-accent text-white-100"
            : "text-faint hover:text-white-100"
        }`}
      >
        {p.short}
      </button>
    ))}
  </div>
);

/**
 * The portability story.
 *
 * Keyed by ROLE, in an aligned grid, because thirteen mappings separated by
 * interpuncts was four lines of unbroken mono text and was reported as
 * unreadable. A lookup table exists to be scanned DOWN for one row -- someone
 * asking "how do I orchestrate on GCP?" should not have to parse the other
 * twelve.
 *
 * It never REPLACES a tool name. Overwriting "S3" with "Cloud Storage" would
 * have the page claiming he runs GCP; showing both, under a caption saying
 * these are equivalents, claims only that he knows what fills the role
 * elsewhere. That is the difference between a portfolio and a fabrication.
 */
/* EXPORTED, and rendered by `Tech` rather than from inside the diagram.
   The section's controls were in two places -- the view toggle up beside the
   heading, the `?` and the platform picker down here -- so a reader met the
   mode switch, then the drawing's own controls, 400px apart. They are all
   controls over the same drawing and now share one strip, with the toggle
   handed in as `trailing` so this row keeps ownership of its own layout. */
export const DiagramControls = ({ platform, onChange, why, onWhy, trailing }) => {
  const vendor = PLATFORMS.find((p) => p.id === platform);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <WhyPanel open={why} onToggle={onWhy} />
        <PlatformPicker platform={platform} onChange={onChange} />
        {/* `trailing` is the view toggle, handed down so it can sit at the end
            of this row rather than in a strip of its own. The row owns its own
            layout, so the caller supplies the control and not its placement. */}
        {platform === "oss" ? (
          <p className="min-w-0 flex-1 font-serif italic text-label leading-[1.5] text-faint">
            {PLATFORM_NOTE}
          </p>
        ) : (
          <p className="font-mono text-micro uppercase tracking-[0.12em] text-secondary">
            on {vendor.label}
            <span className="normal-case tracking-normal text-faint opacity-70">
              {" "}
              — same roles, not deployments
            </span>
          </p>
        )}
        {trailing && <div className="ml-auto shrink-0">{trailing}</div>}
      </div>
      {platform !== "oss" && (
        /* Three columns, not two. Two wide columns never wrapped a row but
           needed seven of them: measured 1,113px against 1,067px for three
           columns with two rows wrapping. No `truncate` on the mapping --
           clipping hides the vendor name, which is the only reason the row
           exists. */
        <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-0.5 2xl:grid-cols-3">
          {Object.entries(platformSwaps).map(([tool, s]) => (
            <p
              key={tool}
              className="flex items-baseline gap-2 font-mono text-micro leading-[1.7]"
            >
              <span className="w-[8rem] shrink-0 text-faint opacity-70">
                {s.role}
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-faint">{tool}</span>
                <span className="opacity-40"> → </span>
                <span className="text-secondary">{s[platform]}</span>
              </span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * The `?`, and it is the same affordance the hero field carries.
 *
 * A visualisation that needs explaining should carry its own explanation. The
 * owner asked for this directly -- "just like you have question mark for the
 * neural network so that the user understands what we are trying to say here"
 * -- and the reasoning is the same in both places: the author knows why the
 * picture is shaped this way and the reader has three seconds to work it out.
 *
 * In FLOW, not a popover. It costs height only while it is open, and it is
 * open only because a reader asked, so it can never cover anything.
 */
const WhyPanel = ({ open, onToggle }) => (
  <>
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-micro uppercase tracking-[0.1em] text-faint transition-colors hover:text-white-100"
    >
      <span aria-hidden="true" className="font-semibold">
        ?
      </span>
      why a diagram
    </button>
    {open && (
      <div className="mt-2 w-full rounded-lg border border-line bg-tertiary/50 px-3 py-2.5">
        {DIAGRAM_WHY.map((line) => (
          <p
            key={line}
            className="mt-1 font-serif text-label leading-[1.55] text-secondary first:mt-0"
          >
            {line}
          </p>
        ))}
      </div>
    )}
  </>
);

const StackDiagram = ({ onDefine, onPin, shown }) => {
  const pass = { onDefine, onPin, shown };

  return (
    /* `lg` and up, matching the toggle that offers it. A diagram whose content
       is a sequence of full-width bands would at 390px be a vertical list of
       boxes -- the tool list again, taller and with arrows. The phone keeps
       the list. */
    <Reveal delay={0.1} className="hidden lg:block mt-3">
      {/* ONE control row, not two. The `?` had a row of its own above the
          bands and the platform picker had another below them: 72px of a
          section under a one-screen budget spent on two strips each holding
          one small control. Both are controls over the same drawing, so they
          share a line, and each expands its panel underneath only when a
          reader asks for it. */}

      <div className="mt-3">
        <Band stage={stageById.ingest} index={0} {...pass} />
        <Step label={stageById.ingest.out} />
        <Band stage={stageById.prepare} index={1} {...pass} />
        <Step label={stageById.prepare.out} />

        {/* THE FORK, and it is the one claim the list cannot make. In a
            six-column list these read as areas three and four of six, in
            sequence. They are not: both consume the same prepared data and
            both feed the same product. Two bands sharing one row off one step
            is how a layered diagram says that; everywhere else in this drawing
            one row means one stage, so the shared row IS the statement. */}
        <div className="flex items-stretch gap-2">
          {FORK.map((id, i) => (
            <Band key={id} stage={stageById[id]} index={2 + i} narrow {...pass} />
          ))}
        </div>

        <Step label={stageById.language.out} />
        <Band stage={stageById.serve} index={4} {...pass} />

        {/* THE FLOOR, not a sixth stage. Nothing flows into `Ship & observe`
            and nothing flows out of it, so it gets no step above it -- it sits
            directly under the pipeline as the thing the pipeline stands on,
            dashed to read as a condition rather than another step. */}
        <div
          className="mt-2 flex gap-4 rounded-lg border border-dashed border-line px-3 py-2"
          style={{ "--cat": `var(${systemFloor.tint})` }}
        >
          <div className="w-[13rem] shrink-0">
            <h3 className="font-display text-[14px] font-semibold leading-tight tracking-[-0.01em] text-white-100">
              {systemFloor.title}
            </h3>
            <p className="mt-0.5 font-serif text-label leading-[1.35] text-faint">
              {systemFloor.role}
            </p>
          </div>
          <div className="flex min-w-0 flex-1 flex-wrap content-start gap-x-4 gap-y-0.5">
            {systemFloor.items.map((it) => (
              <TagTerm
                key={it}
                name={it}
                flow
                dense
                onDefine={onDefine}
                onPin={onPin}
                active={shown?.name === it}
              />
            ))}
          </div>
        </div>
      </div>

    </Reveal>
  );
};

export default StackDiagram;
