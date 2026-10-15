/**
 * Owns, the SHAPE of the hero network and the words that name its layers.
 * Does not own: where the layers land on screen — both field modules read that
 * from the live interface — or how any of it is drawn.
 *
 * It exists because `NeuralField.jsx` and `NeuralField3D.js` each carried their
 * own copy of both constants. They are one fact: the reader sees one diagram,
 * and which module drew it is an implementation detail they never learn. Two
 * copies of `4 -> 8 -> 6 -> 5` is two chances to renumber a layer in the 2D
 * fallback and not in the WebGL one — a drift nobody would catch, because
 * almost nobody sees both. The repo's rule is that a constant lives in one
 * module; this is that module.
 */

/**
 * Hidden widths. The input (4) and output (5) counts are fixed by the
 * interface — four contact links, five sections — so these two are the only
 * free numbers, and they are chosen so the shape is one an ML reader would not
 * query. `4 -> 8 -> 6 -> 5` is a plain MLP funnel: expand into a wider
 * representation, then taper to the output dimension.
 */
export const HIDDEN = [8, 6];

/**
 * A NAME per layer, and for the two a reader can actually point at, a GLOSS
 * saying what that layer is on THIS page.
 *
 * `INPUT 4` is jargon with nothing behind it: it names a layer in a network
 * the reader has no reason to believe is real. `INPUT / ways to reach me / 4`
 * is the sentence the drawing has been trying to make since it was built — the
 * four icons down the left edge ARE the input vector, and the five section
 * dots down the right ARE the output.
 *
 * The hidden layers get no gloss, deliberately. They are the one part with no
 * counterpart in the interface, and inventing a job for them would be the
 * diagram lying about itself — which is the whole thing this file is for.
 */
export const LAYERS = [
  { name: "INPUT", gloss: "ways to reach me" },
  { name: "HIDDEN 1", gloss: "" },
  { name: "HIDDEN 2", gloss: "" },
  { name: "OUTPUT", gloss: "where to go" },
];

/**
 * How long a control stays lit after an activation leaves or arrives at it,
 * in milliseconds. Shared because the CSS animation in `index.css` has to run
 * for the same length — a class removed before its animation ends cuts the
 * pulse off mid-ring.
 */
export const FIRE_MS = 900;

/**
 * How a forward pass is paced: seconds per layer gap, and seconds of quiet
 * between passes.
 *
 * Shared because both fields animate the same event and a reader who switches
 * machines should not see two different networks. A pass is three gaps, so
 * 1.15s each puts a full pass at ~3.5s and a complete cycle at ~6.3s.
 *
 * On the attention budget: PR #43 measured the old field at ~4.9 activations
 * lit at once and chose that so a reader notices the motion once and then
 * reads over it. A pass shows 8, 16 and 12 dots across its three gaps and then
 * NOTHING for `REST_SECONDS`, which averages near the same figure while
 * spending a third of every cycle completely still. That is the better bargain
 * for one budget: the eye is caught by motion that never stops, not by motion
 * that happens and then ends.
 */
export const HOP_SECONDS = 1.15;
export const REST_SECONDS = 2.8;

/**
 * Alpha for each part of the field, as the FINAL value, applied straight to
 * the material or the fill style.
 *
 * It used to be two numbers multiplied together — a `opacity-[0.55]` class on
 * the canvas times each material's own alpha — and the product was the
 * problem. Edges rendered at 0.55 x 0.14 = 0.077 in WebGL and 0.55 x 0.055 =
 * 0.03 on the 2D canvas. Against the dark theme's page that is a six-point
 * colour delta, and against the light themes barely more: below the threshold
 * where a hairline is visible at all, which is exactly how it was reported —
 * "I can't really see those lines".
 *
 * One number per part, applied once, so what is written here is what renders.
 * The canvas's own opacity is now reserved for the scroll fade alone, which is
 * also what fixes the jump: `onScroll` assigns `style.opacity = fade` with
 * `fade` starting at 1, and that inline value overrode the 0.55 class, so
 * scrolling a single pixel used to make the whole field leap from 0.55 to
 * ~0.99.
 *
 * Tuned against measured contrast in all six themes rather than by eye — see
 * the table in docs/WORKLOG.md. The edge is the number that matters: it is the
 * thing that says "network" and it was the thing nobody could see.
 */
export const FIELD_ALPHA = {
  edge: 0.26,
  node: 0.62,
  signal: 0.9,
  trail: 0.22,
};

/**
 * Light grounds need MORE alpha for the same perceived contrast.
 *
 * Not a hunch — the tokens are not mirror images. A dark theme draws the field
 * in `--c-line-strong`, a pale blue (95 134 148) against a near-black page
 * (15 34 40). A light theme draws the same thing in a mid-grey (143 135 118)
 * against white. The dark pairing separates further, and a thin antialiased
 * line only ever gets partial coverage, which halves whatever is left.
 *
 * Measured at one shared alpha of 0.3, median edge contrast per theme:
 *
 *   ink 51.2   dark 48.1   light 22.0   paper 20.0   clean 19.0   sepia 16.1
 *
 * The light half came in at roughly a third of the dark half — the same
 * asymmetry the role cards hit, where a dark ground would not take a shadow
 * and needed a lighter fill instead. One ratio corrects it; applying it per
 * scheme rather than per theme keeps it to one number, since `data-scheme` is
 * already the axis every structural rule in index.css reads.
 */
export const LIGHT_BOOST = 3.4;

/**
 * How much taller the HIDDEN layers stand than the two real columns.
 *
 * 1 puts every layer in exactly the dock's band, which is where this started:
 * correct, anchored, and visually flat. The docks span roughly 156px while the
 * network spans about 1450px across, so at 1 the whole lattice is a 10:1 strip
 * and the edges read as near-horizontal scan lines rather than as a network.
 *
 * The span is still READ FROM THE REAL CONTROLS and merely scaled — it is
 * their band times this number, centred on their midpoint. That is the part
 * that matters: a hidden layer still cannot move unless a dock moves, and
 * nothing here is derived from viewport height. The previous `h * 0.44` was
 * the opposite, and it is why the band drifted whenever the window did.
 *
 * Centred rather than grown downward, so the funnel still converges
 * symmetrically on the section rail from both sides.
 */
export const HIDDEN_SPREAD = 2.9;

/**
 * Resting and lit intensity of an edge, as a multiplier on its alpha. Shared,
 * because both fields animate the same forward pass and a reader who switches
 * machines must not see two different networks.
 */
export const EDGE_REST = 0.62;
export const EDGE_LIT = 1;

/**
 * Which token the field is drawn in, per scheme.
 *
 * Dark grounds use `--c-line-strong` (95 134 148 on 15 34 40) and separate
 * well. Light grounds used the same token and it is the wrong one there: at
 * 143 135 118 on white it is a mid-tan, the palest ink in the theme, and no
 * amount of alpha makes a pale line on a white page read.
 *
 * `--c-faint` is the token the themes already use for their 10-13px labels --
 * 104 114 119 on `light`, 4.93:1, deliberately quiet but legible. That is
 * exactly the register an ambient diagram wants, and it is ~16% further from
 * the page than `--c-line-strong` before a single point of alpha is spent.
 */
export const inkToken = (scheme) =>
  scheme === "light" ? "--c-faint" : "--c-line-strong";

/**
 * Every edge crossing one layer gap, as [from, to] pairs.
 *
 * Lives here because both fields drew this and each had its own copy of the
 * rule -- two chances for the wiring to diverge between the WebGL field and
 * the fallback, which is the thing this module exists to stop.
 *
 * TWO PASSES, AND THE SECOND ONE IS THE BUG FIX.
 *
 * The first pass is the original rule: each source reaches the two units
 * opposite it in the next layer, not all of them. Fully connected is what an
 * MLP actually is, and at 110 edges it reads as a mesh laid over the headline.
 *
 * That rule alone leaves units stranded whenever a layer EXPANDS. From four
 * inputs into eight hidden units each source claims two, which covers seven of
 * the eight -- and the last source wastes its second edge on a duplicate,
 * because `centreOf + 1` clamps to the final index it already took. So HIDDEN
 * 1's top unit was drawn with no incoming connection at all, and the gap
 * carried one fewer activation than it had edges to show.
 *
 * The second pass fixes it: any target nothing reached gets an edge to the
 * source opposite IT. A drawn unit with no wires is not a quiet unit, it is a
 * drawing of something that is not a network.
 *
 * The `seen` set also drops the duplicates the first pass produces, so a pair
 * is never drawn twice at double brightness.
 */
export const edgesFor = (from, to) => {
  const pairs = [];
  const seen = new Set();
  const reached = new Array(to.length).fill(false);
  const add = (fi, ti) => {
    const key = `${fi}:${ti}`;
    if (seen.has(key)) return;
    seen.add(key);
    reached[ti] = true;
    pairs.push([from[fi], to[ti]]);
  };
  const clamp = (v, n) => Math.min(n - 1, Math.max(0, v));

  from.forEach((_, fi) => {
    const c = Math.round(((fi + 0.5) / from.length) * to.length - 0.5);
    for (const d of [0, 1]) add(fi, clamp(c + d, to.length));
  });
  to.forEach((_, ti) => {
    if (reached[ti]) return;
    const c = Math.round(((ti + 0.5) / to.length) * from.length - 0.5);
    add(clamp(c, from.length), ti);
  });
  return pairs;
};

/** The alphas as they should render on a given `data-scheme`. */
export const alphaFor = (scheme) => {
  const k = scheme === "light" ? LIGHT_BOOST : 1;
  return {
    edge: Math.min(1, FIELD_ALPHA.edge * k),
    // The node is already a filled dot rather than a hairline, so it needs
    // less of the correction than the edges do; at the full ratio the hidden
    // units read as punched holes on the paper themes.
    node: Math.min(1, FIELD_ALPHA.node * (scheme === "light" ? 1.25 : 1)),
    // The activation is drawn in the accent, which is a strong red in every
    // palette and needs no help on either ground.
    signal: FIELD_ALPHA.signal,
    trail: Math.min(1, FIELD_ALPHA.trail * k),
  };
};
