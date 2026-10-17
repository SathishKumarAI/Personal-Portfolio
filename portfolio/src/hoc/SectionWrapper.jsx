/* ---------------------------------------------------------------------------
   PLAIN ENGLISH.

   Every section on the page is wrapped by this one function, which gives it two
   separate things:

     the STAGE   — the <section>, full width, paints the background colour
     the MEASURE — a <div> inside it, capped in width, where the text lives

   Keeping them apart is what lets a scene colour run edge-to-edge while the
   words stay in a readable column. When both jobs were on one element, a
   section could never paint a background wider than its own paragraph.

   A "higher-order component" sounds grand; it is just a function that takes a
   component and returns a bigger one wrapped around it.

   Walked through slowly: docs/LEARNING-NOTES.md, section 2.
--------------------------------------------------------------------------- */
import { motion } from "framer-motion";
import { styles } from "../styles";
import { staggerContainer } from "../utils/motion";

/* `wide` is opt-in and Stack is the only caller. Every other section is a
   DOCUMENT, and 1280px is already past a comfortable line length for prose.
   Stack in its diagram view is a DRAWING: sixteen boxes that each have to hold
   a title, a responsibility and a list, and 1280px on a 1990px viewport left
   355px of empty margin on either side while the boxes inside wrapped. A
   drawing wants the room; a paragraph does not, which is why the intro keeps
   its own `max-w-[46rem]` either way. */
/* `tight` trims the scene's vertical padding, and only Stack asks for it. The
   standard clamp spends 256px of a 872px viewport on air above and below —
   correct for a section of prose, expensive for one holding a sixteen-node
   drawing that the reader is trying to take in at once. The grounds still
   alternate, so the scenes stay visibly separated on less of it.

   SYMMETRIC AGAIN. It was briefly asymmetric because the token ribbon lived
   in the top padding and needed the room; the ribbon has since moved down
   beside the heading, into the band the definition card used to block, so the
   padding went back to tight and gave 44px back.

   TIGHTENED AGAIN 2026-10-16, from clamp(2rem,5vw,4.25rem) to this. Measured:
   the old middle term paid 68px at 1366px wide, 136px of a 768px laptop
   screen spent on air around a drawing the reader is trying to take in at
   once. 44px still separates the scenes — they alternate ground colours, so
   the gap is not the only separator — and gives 48px back to the drawing.
   The 2rem floor is unchanged, so phones pay exactly what they paid. */
const SectionWrapper = (Component, idName, { wide = false, tight = false } = {}) =>
  function HOC() {
    return (
      <motion.section
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        // `amount` is a raw IntersectionObserver threshold, and intersectionRatio
        // is capped at viewportHeight/elementHeight. Projects is ~3800px tall, so
        // on a 844px phone the ratio maxes at 0.22 and a 0.25 threshold NEVER
        // fires, the whole section stayed at opacity 0. "some" is threshold 0.
        viewport={{ once: true, amount: "some" }}
        // A bare <section> is a region with no name, and five of them are five
        // identical entries in a screen reader's landmark list. `SectionHead`
        // puts this id on its own <h2>, so the name IS the heading and cannot
        // drift from it.
        aria-labelledby={`${idName}-title`}
        /**
         * The GROUND is full-bleed, the CONTENT is not.
         *
         * `max-w-7xl mx-auto` used to sit on the <section> itself, which meant
         * a section could never paint a background wider than its text. Scenes
         * need the opposite: the colour runs edge to edge and the measure stays
         * where it was. So the section is now the stage and the div inside it is
         * the page.
         *
         * Which scenes are tinted is decided in `index.css` by
         * `main > section:nth-of-type(odd)`, not here — alternation is a
         * property of the sequence, and a component that had to be told its own
         * index would be wrong the moment a section moved.
         */
        // The clamp FLOOR is what a phone gets: 9vw is 35px at 390px wide, so the
        // middle term never wins there and every section paid 64px top and
        // bottom. 3rem keeps the scenes visibly separated — the grounds
        // alternate, so the gap is doing real work — and gives 160px back
        // across the five of them. Desktop is untouched: 9vw passes 4rem at
        // 712px wide, well below any screen that reads the clamp differently.
        className={`scene ${styles.paddingX} ${tight ? "py-[clamp(2rem,3.2vw,2.75rem)]" : "py-[clamp(3rem,9vw,8rem)]"} relative z-0 isolate`}
      >
        <span className="hash-span" id={idName}>
          &nbsp;
        </span>
        <div className={`${wide ? "max-w-[104rem]" : "max-w-7xl"} mx-auto`}>
          <Component />
        </div>
      </motion.section>
    );
  };

export default SectionWrapper;
