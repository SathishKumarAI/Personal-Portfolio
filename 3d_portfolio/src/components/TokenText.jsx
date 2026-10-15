/**
 * Owns, text that arrives one word at a time, the way a model emits it.
 * Does not own: what the text says, or when the block it sits in appears.
 *
 * WHY THIS AND NOT A FADE
 *
 * The hero's three claims used to arrive as one block, which is a fade — the
 * same fade every other element on the page uses. On a page whose whole
 * subject is models, text that STREAMS is the one piece of motion that means
 * something: it is what the reader has watched a model do.
 *
 * It is a texture, not a delay: every word is in the DOM from the first frame
 * and only its opacity moves, so nothing is ever withheld from a reader or a
 * screen reader. Content is never gated behind decoration — that rule outranks
 * the effect, and it is why this is an opacity ramp rather than a typewriter
 * that inserts characters over time.
 *
 * WHY CSS AND NOT FRAMER
 *
 * Fifteen words is fifteen animated components if framer drives it, each with
 * its own subscription and its own layer. One class and a custom property per
 * word costs a stylesheet rule and nothing at runtime, and the whole thing is
 * declarative enough that reduced-motion is a single media query rather than a
 * branch in a hook.
 *
 * ACCESSIBILITY, AND WHY THE SPACES ARE OUTSIDE THE SPANS
 *
 * Every word stays in the DOM from the first frame — only its opacity moves —
 * so a screen reader reads the sentence whole, immediately, and selection
 * copies it whole. A spinning typewriter that inserts characters over time
 * would read as gibberish to anyone not looking at it.
 *
 * `.tok` is `inline-block`, because a transform does not apply to an inline
 * box. An inline-block containing its own trailing space gives the line no
 * break opportunity there, so a long claim would overflow instead of wrapping.
 * The spaces are therefore real text nodes BETWEEN the spans.
 */
/**
 * The pace, shared by every block that streams.
 *
 * 85ms a word, up from 45. At 45 the whole About list finished in ~1.2s, which
 * is fine when it plays on page load and the reader is already looking at it —
 * and far too fast when it is triggered by arriving at a section. Reported as
 * exactly that: "I can't humanly measure it, it's going very fast".
 *
 * `CLAIM_GAP` is a line's place in the queue. At 320ms three claims read as
 * three events in order rather than one blur; the whole cascade now runs about
 * 1.8s instead of 1.2s.
 */
export const TOKEN_STEP = 85;
export const CLAIM_GAP = 320;

const TokenText = ({ text, start = 0, step = TOKEN_STEP, className = "" }) => {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        // The index is a stable key here, and only here: this list is derived
        // from a constant string and is never reordered, inserted into, or
        // filtered.
        <span key={i}>
          {i > 0 ? " " : null}
          <span
            className="tok"
            style={{ "--tok": i, "--tok-start": `${start}ms`, "--tok-step": `${step}ms` }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
};

export default TokenText;
