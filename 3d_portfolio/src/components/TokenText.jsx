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
 * Twice now this has been too fast to follow. 45ms a word was set when the
 * hero streamed on page load and the reader was already looking at it; 85ms
 * still read as a flicker once the About list waited for the reader to arrive
 * and then performed for them.
 *
 * 120ms is a pace you can watch a word land at. A line of six takes 600ms to
 * fill and the whole three-claim cascade runs about 2.9s -- long for an
 * entrance, and correct for a deliberate one: by the time it plays, every
 * other thing in the section has already landed and this is the only thing
 * moving. Nothing is withheld while it runs, because every word is in the DOM
 * from the first frame and only its opacity moves.
 *
 * `CLAIM_GAP` is a line's place in the queue. At 430ms the three claims read
 * as three separate events rather than one wash.
 */
export const TOKEN_STEP = 120;
export const CLAIM_GAP = 430;

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
