import { forwardRef } from "react";
import { motion } from "framer-motion";

/**
 * Owns, the one scroll-reveal used across the page.
 * Does not own: section-level staggering: SectionWrapper already does that.
 *
 * One primitive instead of a `fadeIn(direction, type, delay, duration)` call
 * written differently at every site. The amount is "some" (threshold 0) on
 * purpose: a numeric threshold cannot be satisfied by an element taller than the
 * viewport, which is what left the whole Work section invisible on phones.
 *
 * MotionConfig reducedMotion="user" at the root neutralises the transform for
 * anyone who has asked for less motion; the content still arrives, it simply
 * arrives without travelling.
 */
const EASE = [0.22, 0.61, 0.36, 1];

// forwardRef because callers measure the revealed element. Works.jsx drives the
// cover parallax from `useScroll({ target })` on the card, and a plain function
// component drops the ref silently: the target reads null and the parallax
// stops working with nothing logged.
const Reveal = forwardRef(({
  children,
  delay = 0,
  y = 18,
  // Optional, and 1 means "behave exactly as before" so no existing caller
  // changes. Only the Roles deck passes it: a stack of cards arriving should
  // settle toward the reader, and a few thousandths of scale is the difference
  // between a card appearing and a card being dealt.
  scale = 1,
  duration = 0.55,
  as = "div",
  className = "",
  ...rest
}, ref) => {
  const Tag = motion[as] ?? motion.div;
  // Spreading a `scale: 1` into the initial state would still hand framer a
  // transform to animate, which promotes every revealed element on the page to
  // its own layer for no visible gain.
  const from = scale === 1 ? { opacity: 0, y } : { opacity: 0, y, scale };
  const to = scale === 1 ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 };
  return (
    <Tag
      ref={ref}
      initial={from}
      whileInView={to}
      viewport={{ once: true, amount: "some", margin: "0px 0px -12% 0px" }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
});

Reveal.displayName = "Reveal";

export default Reveal;
