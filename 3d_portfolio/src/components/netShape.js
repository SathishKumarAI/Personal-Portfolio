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
