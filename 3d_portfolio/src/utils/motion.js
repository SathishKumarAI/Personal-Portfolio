/* ---------------------------------------------------------------------------
   PLAIN ENGLISH.

   The three entrance animations every section shares. Each one returns a
   framer-motion "variants" object — a pair of named states, `hidden` and
   `show`, which framer animates between.

   Nothing here decides WHEN something animates. A component says
   `variants={fadeIn(...)}` and the section's wrapper says "play when you
   scroll into view"; these functions only describe what the two ends look
   like.

     textVariant(delay)                   a heading dropping into place
     fadeIn(direction, type, delay, dur)  anything arriving from one side
     staggerContainer(stagger, delay)     a parent that deals its children in,
                                          one after another rather than at once

   WHY THEY ARE FUNCTIONS and not constants: the delay is the argument. Three
   cards sharing one constant would all arrive together, and the stagger is
   what makes a section read as composed rather than as a flash.

   THE TRAP, and it has caused two invisible-content bugs here: framer passes
   variants down through MOTION components only. Wrap children in a plain
   `<div>` and the chain breaks — they keep the `hidden` state and sit at
   `opacity: 0` forever, with no error anywhere. If content is missing and the
   markup looks right, check for a plain wrapper between the parent and the
   child.
--------------------------------------------------------------------------- */

export const textVariant = (delay) => ({
  hidden: { y: -50, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", duration: 1.25, delay: delay || 0 },
  },
});

export const fadeIn = (direction, type, delay, duration) => ({
  hidden: {
    x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
    y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type: type || "tween",
      delay: delay || 0,
      duration: duration || 0.8,
      ease: "easeOut",
    },
  },
});

export const staggerContainer = (staggerChildren, delayChildren) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: staggerChildren || 0.1,
      delayChildren: delayChildren || 0,
    },
  },
});
