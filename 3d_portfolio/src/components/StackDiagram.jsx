import {
  systemPlanes,
  systemSubstrate,
  platformMatrix,
  PLATFORMS,
  PLATFORM_NOTE,
  PLATFORM_DOCS,
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
/* The chosen platform's own colour. `oss` is the site accent, because the
   stack he actually runs is the point of the page; the three clouds get the
   categorical hues defined in index.css. */
const platTint = (platform) =>
  platform === "oss" ? "--c-accent" : `--c-plat-${platform}`;

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
const Node = ({ node, index, flow, platform, onDefine, onPin, shown }) => {
  const cloud = platform !== "oss";
  const roles = cloud ? platformMatrix.filter((r) => r.node === node.id) : [];
  return (
    <div
      className="node-walk flex min-w-0 flex-1 flex-col rounded-lg border border-line border-t-[3px] bg-tertiary/50 px-3 py-2"
      style={{
        borderTopColor: `rgb(var(${flow}))`,
        "--w": index,
        "--walk": `var(${flow})`,
      }}
    >
      {/* THE HEADER OF THE BOX: what it is, then what it is FOR. Three kinds
          of text live in this card and they used to differ only by weight, so
          a reader got "some kind of light change" rather than a structure.
          Each now has its own voice: the title is display, the responsibility
          is serif ITALIC — the page's register for commentary rather than
          data — and the contents below the rule are mono, which is what this
          site uses for things that are names. */}
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
      <p className="mt-0.5 font-serif italic text-label leading-[1.3] text-faint">
        {node.role}
      </p>

      {/* A LITERAL RULE between the card's argument and its contents. The
          reported fault was that the explanation and the tool names ran
          together; a hairline is the cheapest unambiguous separation there
          is, and it costs one pixel. */}
      <div className="mt-2 border-t border-line/60 pt-2">
        {cloud ? (
          roles.length ? (
            <ul className="list-none space-y-[3px]">
              {roles.map((r, i) => (
                /* ONE LINE PER ROLE, not two. Stacked, `Object store` over
                   `Blob Storage` made the store node twelve lines deep and
                   the cloud view 1,626px tall. The cards are wider now, so
                   the pair fits on one line, which halves it. */
                <li
                  key={r.role}
                  className="cloud-in flex items-baseline gap-2 leading-[1.45]"
                  style={{ "--i": i }}
                >
                  <span className="shrink-0 font-mono text-micro uppercase tracking-[0.08em] text-faint opacity-70">
                    {r.role}
                  </span>
                  <span
                    className="min-w-0 font-mono text-micro"
                    style={{ color: `rgb(var(${platTint(platform)}))` }}
                  >
                    {r[platform]}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            /* NOT A GAP — a finding. Federated training, the classical model,
               the interface and the language it is written in have no managed
               equivalent anywhere, because they are not platform choices.
               Saying so is more useful than a box that looks unfinished. */
            <p className="cloud-in font-serif italic text-label leading-[1.4] text-faint opacity-80">
              Unchanged — not a platform choice.
            </p>
          )
        ) : (
          <div className="flex flex-wrap content-start gap-x-3 gap-y-0.5">
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
        )}
      </div>
    </div>
  );
};

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
const Plane = ({ plane, offset, platform, onDefine, onPin, shown }) => (
  <section aria-label={plane.title}>
    {/* THE PLANE LABEL SITS ABOVE ITS ROW, not in a column beside it. As a
        9.5rem left column it took 152px off every row for two short lines of
        text that are read once. Above the row it costs ~18px of height and
        gives all of that width back to the cards, which is what the cards
        needed: wider boxes wrap their contents in fewer lines, so the change
        pays for its own height twice over. */}
    <h3 className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
      <span
        className="font-display text-[12px] font-semibold uppercase tracking-[0.12em]"
        style={{ color: `rgb(var(${plane.flow}))` }}
      >
        {plane.title}
      </span>
      <span className="font-serif italic text-label text-faint">
        {plane.role}
      </span>
      {plane.parallel && (
        <span className="font-mono text-micro uppercase tracking-[0.1em] text-faint opacity-60">
          · alternatives, not steps
        </span>
      )}
    </h3>
    <div className="mt-1.5 flex items-stretch gap-2">
      {plane.nodes.map((node, i) => (
        <Node
          key={node.id}
          node={node}
          index={offset + i}
          flow={plane.flow}
          platform={platform}
          onDefine={onDefine}
          onPin={onPin}
          shown={shown}
        />
      ))}
    </div>
  </section>
);

/**
 * THE PLATFORM PICKER, which now redraws the diagram rather than a table.
 *
 * Three designs, and the third is the one that earned its place. First a
 * per-tool switch that rewrote `S3` to `Cloud Storage` in place — compact, and
 * it hid the equivalence by only ever showing one side. Then a 33-row
 * comparison table beside the drawing, which showed both sides and put ~165
 * cells on top of the thing that was actually the argument.
 *
 * The owner's objection cut through both: "why show `Airflow -> MWAA` if you
 * are only showing AWS? You can directly show the image." Right on both
 * counts. The arrow is only worth its space when both ends are visible, and a
 * table next to a diagram is a description of a picture that is already there.
 *
 * So the DIAGRAM is the view. Pick a platform and the same architecture fills
 * with that platform's services — the planes, the nodes and the flow hold
 * still, and only the slots change. That is the claim stated as a demo rather
 * than as a mapping: the system is the same, the managed pieces are swappable.
 */
export const DiagramControls = ({ why, onWhy, platform, onPlatform }) => {
  const docs = PLATFORM_DOCS[platform];
  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <WhyPanel open={why} onToggle={onWhy} />
        <div
          role="group"
          aria-label="Platform"
          className="flex shrink-0 items-center gap-1 rounded-full border border-line p-0.5"
        >
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onPlatform(p.id)}
              aria-pressed={platform === p.id}
              /* Each platform wears its own colour when chosen, so the
                 diagram's state is readable without reading the label — and
                 the same hue then appears on every service name below, which
                 is what ties the control to what it changed. */
              style={
                platform === p.id
                  ? { background: `rgb(var(${platTint(p.id)}))`, color: "rgb(var(--c-bg-deep, 12 14 18))" }
                  : undefined
              }
              className={`rounded-full px-2.5 py-1 font-mono text-micro uppercase tracking-[0.1em] transition-colors ${
                platform === p.id ? "font-semibold" : "text-faint hover:text-white-100"
              }`}
            >
              {p.short}
            </button>
          ))}
        </div>
        {/* The provider's own reference, which is what was asked for. One
            stable root per platform rather than 99 deep service links: cloud
            vendors reorganise docs constantly and a dead link on a portfolio
            is worse than no link. */}
        {docs && (
          <a
            href={docs.href}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 font-mono text-micro hover:underline"
            style={{ color: `rgb(var(${platTint(platform)}))` }}
          >
            {docs.label} ↗
          </a>
        )}
      </div>
      <p className="mt-2 font-serif italic text-label leading-[1.5] text-faint">
        {PLATFORM_NOTE}
      </p>
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

const StackDiagram = ({ platform = "oss", onDefine, onPin, shown }) => {
  const pass = { platform, onDefine, onPin, shown };
  // Running count, so the node numbers read 01..16 straight down the drawing
  // rather than restarting inside every plane.
  let n = 0;

  return (
    /* `lg` and up. A layered architecture at 390px is sixteen stacked boxes,
       which is the tool list again with more borders. The phone keeps the
       list. */
    <Reveal delay={0.1} className="hidden lg:block">
      <div className="flex flex-col gap-2">
        {systemPlanes.map((plane) => {
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
