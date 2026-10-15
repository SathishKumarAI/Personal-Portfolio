import { stackGroups } from "../constants";
import Reveal from "./Reveal";
import TagTerm from "./TagTerm";

/**
 * Owns, the Stack section read as a system rather than as a vocabulary.
 * Does not own: the tools, or what any of them means. Both views render
 * `stackGroups` and both feed the same definition panel, so there is exactly
 * one list of tools in this repo and two ways of looking at it. A diagram
 * maintained as its own copy of the stack would be wrong within a month.
 *
 * WHY THIS EXISTS. A tool list answers "what does he know". It cannot answer
 * "does he know how they fit together", and the second question is the one
 * that separates someone who has shipped a system from someone who has
 * finished a course. The list is not wrong -- a recruiter scanning for a
 * keyword needs exactly that -- which is why this is offered ALONGSIDE it
 * rather than replacing it, and why the reader is the one who picks.
 *
 * WHY IT IS NOT A GENERIC ARCHITECTURE. "client to API to service to
 * database" appears on every system-design page ever drawn and says nothing
 * about this person. The shape here is the one the section's own sentence
 * already claims -- from raw data to a running product -- with his six areas
 * in the order they actually run: data is moved, then understood, then two
 * model tracks work in parallel on it, then something serves the result.
 *
 * WHY NO MEASURED CONNECTORS. The obvious build anchors an SVG to the boxes
 * and redraws on resize. That is what NeuralField3D does for the hero and it
 * cost this repo its longest bug of the session: a canvas that measured
 * correctly and drew wrong, because a replaced element does not size the way
 * the insets say. Here the connectors are LAYOUT -- flex children sitting
 * between the nodes -- so there is nothing to measure, nothing to resync on
 * resize, and no second opinion about where a box is. An arrow cannot drift
 * from its boxes when it is their sibling.
 */

const byTitle = Object.fromEntries(stackGroups.map((g, i) => [g.title, { ...g, i }]));
const stageNo = (i) => String(i + 1).padStart(2, "0");

const PLATFORM = "MLOps & infra";

/* THE TWO TERMINI CAME OUT, for the reason the path rule did.
   They read "RAW DATA" and "A RUNNING PRODUCT" at the ends of the row, which
   is the fifth time this section would have said one sentence: the intro
   paragraph says "from raw data to a running product" in those words, three
   lines above this drawing. They also cost 160px of fixed width plus their two
   arrows -- about 200px of a 1280px row -- and that width is exactly what the
   nodes need in order to wrap their terms in fewer lines. Measured: removing
   them took the row from 314px to 231px, because every node got wider.

/* A connector: a rule and a head. `shrink-0` is load-bearing -- without it
   flex takes the arrows' width first when the row is tight, so the diagram
   loses the only part that makes it a diagram before it loses anything else. */
const Flow = () => (
  <span aria-hidden="true" className="mt-[2.6rem] shrink-0 flex items-center w-5">
    <span className="h-px flex-1 bg-line" />
    <svg width="6" height="6" viewBox="0 0 6 6" className="shrink-0 fill-line">
      <path d="M0 0l6 3-6 3z" />
    </svg>
  </span>
);

const Terms = ({ g, onDefine, onPin, shown }) => (
  /* FLOWING, not the list view's one-per-line. These boxes are wider than the
     six columns are, so stacked terms would leave a node ten lines tall and
     push the section well past the one screen the list was cut down to.
     Measured: wrapping holds the tallest node to three lines. */
  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5">
    {g.items.map((it) => (
      <TagTerm
        key={it}
        name={it}
        flow
        dense
        primary={g.primary?.includes(it)}
        onDefine={onDefine}
        onPin={onPin}
        active={shown?.name === it}
      />
    ))}
  </div>
);

const Node = ({ g, onDefine, onPin, shown }) => (
  <div
    className="min-w-0 flex-1 rounded-xl border border-line bg-tertiary/60 p-2.5"
    style={{ "--cat": `var(${g.tint})` }}
  >
    <span
      aria-hidden="true"
      className="block h-[3px] w-full rounded-full"
      style={{ background: `rgb(var(${g.tint}))`, opacity: 0.75 }}
    />
    <div className="mt-2.5 flex items-baseline gap-2">
      <h3 className="min-w-0 font-display text-[14px] font-semibold text-white-100 tracking-[-0.01em] leading-tight">
        {g.title}
      </h3>
      <span className="stack-index ml-auto shrink-0 font-mono text-[13px] font-medium leading-none">
        {stageNo(g.i)}
      </span>
    </div>
    <Terms g={g} onDefine={onDefine} onPin={onPin} shown={shown} />
  </div>
);

const StackDiagram = ({ onDefine, onPin, shown }) => {
  const node = (title) => (
    <Node g={byTitle[title]} onDefine={onDefine} onPin={onPin} shown={shown} />
  );
  const platform = byTitle[PLATFORM];

  return (
    /* `lg` and up, where the list view also stops being a phone list. A
       diagram whose entire content is left-to-right flow degrades at 390px
       into a vertical stack of boxes -- which is the tool list again, except
       taller and with arrows between the items. The phone keeps the list, and
       the toggle that offers this is hidden there for the same reason. */
    <Reveal delay={0.1} className="hidden lg:block mt-3">
      {/* `items-start`, not `items-stretch`. Stretched, every single-stage box
          grew to the height of the branch column beside it -- measured 392px
          of box around ~180px of content, four times over, which is a row of
          mostly empty rectangles. Each box is now its own content's height and
          the arrows still line up, because they are centred on themselves
          rather than on the row. */}
      <div className="flex items-start gap-2">
        {node("Data engineering")}
        <Flow />
        {node("Data science")}
        <Flow />
        {/* THE PARALLEL PAIR, and it is the one claim the list cannot make.
            Side by side in a six-column row, LLM / RAG and Computer vision
            read as areas three and four of six, in sequence. They are not in
            sequence: both consume the same prepared data and both feed the
            same product, which is visible in the projects and invisible in
            the list. The bracket is the only mark in this drawing that is an
            assertion rather than a restatement of something above. */}
        <div className="relative min-w-0 flex-[2] flex flex-col gap-2 pl-3">
          {/* A BRACKET, not a hairline. This started as `w-px bg-line` and at
              1px it was invisible against the ground -- the one mark in the
              drawing that carries an actual claim, and it read as nothing.
              Three borders and a rounded left edge make a "[" that spans both
              boxes, which is the conventional way a diagram says "these two,
              together, from one input". */}
          <span
            aria-hidden="true"
            className="absolute left-0 top-5 bottom-5 w-2 rounded-l-md border-y border-l border-line"
          />
          {node("LLM / RAG")}
          {node("Computer vision")}
        </div>
        <Flow />
        {node("Backend & apps")}
      </div>

      {/* UNDERNEATH, not in the row. MLOps is the one group that is not a
          stage: nothing flows into it and nothing flows out of it. Putting it
          fifth in a left-to-right pipeline would make the drawing assert
          something the six-column list never asserted, because the list claims
          no sequence between neighbours at all. Drawn as the floor the other
          five stand on, dashed so it reads as the surrounding condition rather
          than as another box in the chain. */}
      <div className="mt-2 flex items-stretch gap-2">
        <div
          className="min-w-0 flex-1 rounded-xl border border-dashed border-line px-3 py-2.5"
          style={{ "--cat": `var(${platform.tint})` }}
        >
          {/* ONE ROW, not a heading above its terms. The band spans the full
              width of the diagram, which is enough for the title, the caption
              and all seven tools on a single line -- and stacking them cost
              24px of a section that has to fit a screen. It wraps on its own
              at narrower widths, so nothing is assumed about the fit. */}
          <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1">
            <h3 className="shrink-0 font-display text-[14px] font-semibold text-white-100 tracking-[-0.01em]">
              {platform.title}
            </h3>
            <span className="shrink-0 font-serif italic text-faint text-label">
              everything above runs on this
            </span>
            {platform.items.map((it) => (
              <TagTerm
                key={it}
                name={it}
                flow
                dense
                primary={platform.primary?.includes(it)}
                onDefine={onDefine}
                onPin={onPin}
                active={shown?.name === it}
              />
            ))}
            <span className="stack-index ml-auto shrink-0 font-mono text-[13px] font-medium leading-none">
              {stageNo(platform.i)}
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  );
};

export default StackDiagram;
