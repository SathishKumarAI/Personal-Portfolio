import {
  systemPlanes,
  systemSubstrate,
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

const nodeNo = (i) => String(i + 1).padStart(2, "0");

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
 * One node: a job the system has to do, and what fills it.
 *
 * `flow` is the PLANE's colour, not the node's — every node in a plane shares
 * it, because the colour encodes depth in the flow and these are all at the
 * same depth. That is the whole reason the palette stopped being six hues:
 * identical intensity is a claim ("same stage"), and a categorical palette
 * cannot make it.
 */
const Node = ({ node, index, flow, onDefine, onPin, shown }) => (
  <div
    className="flex min-w-0 flex-1 flex-col rounded-lg border border-line border-t-[3px] bg-tertiary/50 px-3 py-2"
    style={{ borderTopColor: `rgb(var(${flow}))` }}
  >
    <h4 className="flex items-baseline gap-2 font-display text-[13px] font-semibold leading-tight tracking-[-0.01em] text-white-100">
      <span
        aria-hidden="true"
        className="font-mono text-[10px] font-medium leading-none"
        style={{ color: `rgb(var(${flow}))` }}
      >
        {nodeNo(index)}
      </span>
      {node.title}
    </h4>
    <p className="mt-1 font-serif text-label leading-[1.35] text-faint">
      {node.role}
    </p>
    <div className="mt-2 flex flex-wrap content-start gap-x-3 gap-y-0.5">
      {node.items.map((it) => (
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

/**
 * A plane: a row of nodes that sit at the same depth, with the plane's own
 * identity down the left.
 *
 * `parallel` changes what the row ASSERTS. In the data plane the nodes are a
 * sequence — ingest, then store, then shape — so thin rules sit between them.
 * In the model plane they are alternatives; most projects use one or two, and
 * a connector between "object detection" and "retrieval" would claim a
 * dependency that does not exist.
 */
const Plane = ({ plane, offset, onDefine, onPin, shown }) => (
  <section className="flex items-stretch gap-3" aria-label={plane.title}>
    <div className="w-[9.5rem] shrink-0 self-center">
      <h3
        className="font-display text-[13px] font-semibold uppercase tracking-[0.08em]"
        style={{ color: `rgb(var(${plane.flow}))` }}
      >
        {plane.title}
      </h3>
      <p className="mt-0.5 font-serif text-label leading-[1.35] text-faint">
        {plane.role}
      </p>
      {plane.parallel && (
        <p className="mt-1 font-mono text-micro uppercase tracking-[0.1em] text-faint opacity-70">
          alternatives
        </p>
      )}
    </div>
    <div className="flex min-w-0 flex-1 items-stretch gap-2">
      {plane.nodes.map((node, i) => (
        <Node
          key={node.id}
          node={node}
          index={offset + i}
          flow={plane.flow}
          onDefine={onDefine}
          onPin={onPin}
          shown={shown}
        />
      ))}
    </div>
  </section>
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
  // Running count, so the node numbers read 01..16 straight down the drawing
  // rather than restarting inside every plane.
  let n = 0;

  return (
    /* `lg` and up. A layered architecture at 390px is sixteen stacked boxes,
       which is the tool list again with more borders. The phone keeps the
       list. */
    <Reveal delay={0.1} className="hidden lg:block">
      <div className="flex flex-col gap-2">
        {systemPlanes.map((plane, i) => {
          const offset = n;
          n += plane.nodes.length;
          return (
            <div key={plane.id} className="flex flex-col gap-2">
              <Plane plane={plane} offset={offset} {...pass} />
              {plane.out && <Step label={plane.out} />}
            </div>
          );
        })}

        {/* THE SUBSTRATE, and it gets no arrow into it on purpose. Nothing
            flows into Python or Docker; everything above simply runs on them.
            Dashed and off the colour ramp, because it is not a position on
            the path -- it is the floor under all of it. */}
        <section
          className="mt-1 flex items-stretch gap-3 rounded-lg border border-dashed border-line px-3 py-2"
          aria-label={systemSubstrate.title}
        >
          <div className="w-[9.5rem] shrink-0 self-center">
            <h3 className="font-display text-[13px] font-semibold uppercase tracking-[0.08em] text-secondary">
              {systemSubstrate.title}
            </h3>
            <p className="mt-0.5 font-serif text-label leading-[1.35] text-faint">
              {systemSubstrate.role}
            </p>
          </div>
          <div className="flex min-w-0 flex-1 items-stretch gap-2">
            {systemSubstrate.nodes.map((node, i) => (
              <Node
                key={node.id}
                node={node}
                index={n + i}
                flow="--c-flow-off"
                {...pass}
              />
            ))}
          </div>
        </section>
      </div>
    </Reveal>
  );
};

export default StackDiagram;
