import { useEffect, useRef, useState } from "react";
import { HIDDEN } from "./netShape";

/**
 * Owns, the one place the hero field explains itself in words.
 * Does not own: the field (NeuralField.jsx / NeuralField3D.js) or the layer
 * labels, which those modules draw on their own surfaces.
 *
 * WHY IT IS A BUTTON AND NOT A CAPTION
 *
 * The field's claim — the contact dock is the input layer, the section rail is
 * the output layer — is demonstrated, not stated: an activation leaves an icon
 * and that icon pulses, and eight seconds later the section dot it reaches
 * pulses too. Most readers need nothing more than that.
 *
 * The ones who DO want the sentence are a minority, and spending a line of the
 * hero on them taxes everyone else. A marker that costs one 24px square until
 * it is asked costs the right people nothing and the curious one hover.
 *
 * WHY IT LIVES IN REACT RATHER THAN IN EITHER FIELD MODULE
 *
 * There are two fields: a WebGL one for desktop readers with a GPU, and a 2D
 * canvas for everyone else — reduced motion, no WebGL. Putting the control in
 * the 3D module would have given the explanation only to the readers least
 * likely to need it, and put a focusable element inside a lazily-imported
 * non-React module that React does not know is there. It is interface, not
 * scene, so it belongs with the interface.
 *
 * Gated on `rail:` for the same reason the docks are: below 1024px there is no
 * dock, no rail and no field, so there is nothing to explain.
 */
const SHAPE = `4 → ${HIDDEN.join(" → ")} → 5`;

const FieldLegend = () => {
  const [open, setOpen] = useState(false);
  const [onHero, setOnHero] = useState(true);
  const wrap = useRef(null);

  /**
   * SCOPED TO THE LANDING VIEW, like the thing it explains.
   *
   * This button was `fixed` with no scroll awareness, so it followed the
   * reader through Roles, Stack and every other section -- offering to explain
   * a diagram that had faded out a screen earlier. The field itself is already
   * scoped: both modules fade the canvas and the layer labels out as the hero
   * leaves. The caption has to leave with them.
   *
   * An observer on the hero rather than a scroll threshold, because the field
   * uses a scroll fade and duplicating that arithmetic here is two numbers to
   * keep in step. Intersection is the plain question being asked: is the thing
   * I describe still on screen?
   */
  useEffect(() => {
    const hero = document.querySelector('section[aria-label="Intro"]');
    if (!hero) return undefined;
    const io = new IntersectionObserver(([e]) => setOnHero(e.isIntersecting), {
      // A sliver is not enough: by the time the hero is a strip at the top the
      // field has already faded to nothing, so the caption would outlive it.
      threshold: 0.25,
    });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // Leaving the hero with the panel open would park it off-subject.
  useEffect(() => {
    if (!onHero) setOpen(false);
  }, [onHero]);

  // Escape closes, and a click anywhere else closes. Both are what a reader
  // expects of a disclosure, and neither is free on a bare button.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onDown = (e) => {
      if (!wrap.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div
      ref={wrap}
      // Bottom-left, beside where the INPUT label lands. `fixed`, like the two
      // docks it describes, so it does not scroll away from them.
      /* `bottom-20`, not `bottom-4`. The field's own layer labels sit at
         bottom 22px and stand 43px tall, so at bottom-4 this button sat on top
         of the INPUT caption -- measured, a 14 x 18px overlap with the words
         "ways to reach me". 80px clears that block with air to spare, and the
         popover still opens upward into empty hero. */
      /* The DISPLAY CLASS is what toggles, not the `hidden` attribute.
         `hidden` is a UA-stylesheet `display: none` with no !important, and
         this element also carries `rail:block` -- which sets `display: block`
         at >=1024px and wins on specificity. The attribute would have been
         silently ignored on exactly the widths where the legend exists.
         Dropping `rail:block` leaves plain `hidden`, which has nothing to
         fight. Not unmounted: the panel holds no state worth keeping, but a
         mount/unmount on every scroll past the hero is churn for one button. */
      className={`${onHero ? "hidden rail:block" : "hidden"} fixed left-2 xl:left-4 bottom-20 z-40`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-label="What is the diagram behind this page?"
        onClick={() => setOpen((v) => !v)}
        onFocus={() => setOpen(true)}
        className="flex h-6 w-6 items-center justify-center rounded-full border border-line bg-primary font-mono text-[11px] text-faint transition-colors hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent"
      >
        ?
      </button>

      {/* `hidden` rather than an opacity fade: this is prose, and prose that is
          present-but-transparent is still read aloud and still focusable. */}
      <div
        hidden={!open}
        role="note"
        className="absolute bottom-8 left-0 w-[19rem] rounded-xl border border-line bg-primary p-3.5 shadow-card"
      >
        <p className="font-sans text-[12px] font-medium uppercase tracking-[0.09em] text-accent-ink">
          The backdrop is a diagram
        </p>
        <p className="mt-2 font-sans text-[13px] leading-[1.55] text-secondary">
          The four contact icons down the left edge are its{" "}
          <span className="text-white-100">input layer</span>. The five section
          dots down the right are its{" "}
          <span className="text-white-100">output layer</span>. Two hidden
          layers sit between them, and the moving dots are activations
          travelling one to the other.
        </p>
        <p className="mt-2 font-sans text-[13px] leading-[1.55] text-secondary">
          Watch an icon pulse as a signal leaves it, and the section dot pulse
          when that signal arrives.
        </p>
        {/* The shape is derived, never typed: HIDDEN is the same constant both
            field modules build from, so this line cannot drift from the drawing
            the way a hand-written "4 → 8 → 6 → 5" would. */}
        <p className="mt-2.5 font-mono text-chip text-faint tabular-nums">
          {SHAPE}
          <span className="text-faint/60"> · positions read from the real controls</span>
        </p>
      </div>
    </div>
  );
};

export default FieldLegend;
