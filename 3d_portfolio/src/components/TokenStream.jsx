import { useEffect, useRef } from "react";

/**
 * Owns, the wave of generated tokens behind ONE section.
 *
 * It lives in Stack, and only in Stack, because that is where the `LLM / RAG`
 * group sits, so a stream of sub-word pieces is an illustration of the content
 * rather than decoration behind it. The same effect running the length of the
 * page would trail the reader through Experience and Contact, where it means
 * nothing and competes with the text. That is the difference between a backdrop
 * that adds something and wallpaper.
 *
 * Scoped to a BAND, not to the section. Filling the section ran the wave behind
 * all six stack cards, which is the same wallpaper problem one level down. It
 * occupies the empty strip to the right of the intro copy and above the card
 * grid, the one part of this section that had nothing in it.
 *
 * DESKTOP ONLY, and that is a design decision rather than a performance one.
 * There was a phone variant that took a strip of its own above the stack list.
 * At 390px the band is too short for a wave and too narrow for a sentence of
 * tokens, so it rendered as struck-through fragments floating in empty space
 * and read as a rendering fault. The strip came out with it; a phone has no
 * empty band here to fill.
 *
 * Section-scoped, so unlike NeuralField it is positioned absolutely inside its
 * own section and needs no fixed-coordinate wiring.
 *
 * Cheap by construction:
 *  - the loop only runs while the section is on screen (IntersectionObserver)
 *  - desktop only; below 1024px the loop never starts
 *  - devicePixelRatio capped at 2
 *  - prefers-reduced-motion paints one still frame
 *  - pointer-events: none, aria-hidden
 */

// Real sub-word pieces, the way a tokenizer splits text. Several sentences, not
// one: a stream that emits the same seventeen pieces forever is a loop the
// reader notices and then stops reading. These cycle, so the text is different
// each time the band fills.
const SENTENCES = [
  ["re", "trie", "val", "▁aug", "ment", "ed", "▁gene", "ration", "."],
  ["▁cites", "▁the", "▁source", "▁it", "▁used", ",", "▁every", "▁time", "."],
  ["▁off", "line", "▁first", ",", "▁no", "▁key", ",", "▁no", "▁account", "."],
  ["▁fed", "er", "ated", ":", "▁the", "▁data", "▁never", "▁moves", "."],
  ["▁YOLO", "v", "8", "▁de", "tect", "s", ",", "▁then", "▁tracks", "."],
  ["▁measure", "d", ",", "▁not", "▁est", "im", "ated", "."],
];
const PIECES = SENTENCES.flat();

const cssColor = (el, name, alpha) => {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return v ? `rgba(${v.split(/\s+/).join(",")},${alpha})` : `rgba(128,128,128,${alpha})`;
};

const TokenStream = () => {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gate = window.matchMedia("(min-width: 1024px)");

    let dpr = 1, w = 0, h = 0, raf = 0, t0 = null, onScreen = false;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = Math.max(1, w * dpr);
      c.height = Math.max(1, h * dpr);
    };

    const draw = (time) => {
      if (!w || !h) return;
      const ink = cssColor(root, "--c-line-strong", 1);
      const accent = cssColor(root, "--c-accent", 1);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // The wave breathes inside the band. It used to translate downward and
      // wrap, at 11px/s over a range of (h + 0.55h): a period of about fifty
      // seconds, of which it spent only a few actually inside the canvas.
      // Measured, the painted ink decayed 3.37% to 0.00% over five seconds and
      // then stayed empty, which is why it read as playing once and stopping.
      // Now the baseline oscillates gently around the middle, so the stream is
      // always on screen and always moving.
      const baseY = h * 0.5 + Math.sin(time * 0.22) * h * 0.16;
      const amp = Math.min(38, h * 0.075);
      const yAt = (x) => baseY + Math.sin(x / 190 + time * 0.45) * amp;

      ctx.beginPath();
      for (let x = 0; x <= w; x += 8) {
        const y = yAt(x);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = accent.replace(",1)", ",0.34)");
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Tokens ride the curve they were emitted onto.
      //
      // A token keeps its own text for the whole crossing. The label used to be
      // indexed by the current time, so every box changed its word twice a
      // second while it travelled: the stream flickered instead of carrying
      // anything. Indexing by emission order instead means each box holds one
      // piece from end to end, and the sentence turns over once a lap.
      ctx.font = '500 12px "JetBrains Mono Variable", ui-monospace, monospace';
      ctx.textBaseline = "middle";
      // Twelve was tuned for a 52%-wide band. The run is longer now, so the
      // same count would leave visible gaps between tokens.
      const COUNT = 16;
      for (let i = 0; i < COUNT; i++) {
        // 0.032, down from 0.05: a lap is ~31s rather than ~20s. Travel time
        // is a function of SPEED, not of width, so widening the band without
        // this would simply have made every token move faster across it.
        const raw = time * 0.032 + i / COUNT;
        const p = raw % 1;
        const emission = Math.floor(raw) * COUNT + i; // monotonic, so the text advances
        const x = p * (w + 180) - 90;
        const y = yAt(x);
        const label = PIECES[((emission % PIECES.length) + PIECES.length) % PIECES.length].replace("▁", " ");
        const tw = ctx.measureText(label).width + 10;
        const fade = Math.min(1, p * 8) * Math.min(1, (1 - p) * 8);
        if (fade <= 0.02) continue;
        // The leading token is the one being generated right now.
        const lead = emission % PIECES.length === Math.floor(time * 0.6) % PIECES.length;
        ctx.fillStyle = ink.replace(",1)", `,${0.06 * fade})`);
        ctx.fillRect(x, y - 10, tw, 20);
        ctx.strokeStyle = (lead ? accent : ink).replace(",1)", `,${(lead ? 0.55 : 0.26) * fade})`);
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y - 10, tw, 20);
        ctx.fillStyle = (lead ? accent : ink).replace(",1)", `,${(lead ? 0.95 : 0.62) * fade})`);
        ctx.fillText(label, x + 5, y);
      }
    };

    const frame = (ts) => {
      if (t0 === null) t0 = ts;
      if (onScreen) draw((ts - t0) / 1000);
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, c.width, c.height);
    };

    const start = () => {
      if (!gate.matches) return stop();
      resize();
      if (reduced) return draw(5); // one still frame; the picture still reads
      if (!raf) raf = requestAnimationFrame(frame);
    };

    // Only animate while this section is actually being looked at.
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting), {
      threshold: 0,
    });
    io.observe(c);

    const ro = new ResizeObserver(() => start());
    ro.observe(c);

    start();
    gate.addEventListener("change", start);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      gate.removeEventListener("change", start);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      // A BAND, not the section. Filling the section put the wave behind all six
      // cards: section-scoped wallpaper is still wallpaper. It now occupies only
      // the empty strip to the right of the intro text, above the grid, so it
      // crosses no content at all.
      /* The band to the RIGHT of the heading, running to the section's edge.
         At `w-[52%] h-[22rem]` this canvas crossed the intro paragraph -- a
         measured 416x106px overlap with the whole paragraph -- and the repo's
         rule is that ambient work must not cross text. Boxing it into the
         corner fixed that and cost the effect its run: a token had a few
         hundred pixels to cross.
         `left-[33%]` starts it just past "Stack" and `right-0` gives it the
         whole remaining width, which is the longest clear horizontal run in
         the section. It sits above the intro and above the definition panel,
         so it still crosses nothing. */
      /* HEIGHT IS SET BY WHAT IS BELOW IT, not by what looks good alone.
         The view toggle moved into the header's right column, which put a
         control a reader is meant to read and click inside this band: measured
         187x47px of canvas over the button group and 185x38 over its question.
         ONE FIXED CLEARANCE NOW, and that is a consequence of the header
         change rather than a tuning choice. The band used to have to clear the
         view toggle, whose top moved with the breakpoint -- y=178 at 1601px
         but y=161 at 1281px, because its question wrapped to two lines -- so
         the height had to be responsive to chase it.

         The band sits in the section's TOP PADDING, which is the only strip
         on this page where an ambient canvas crosses nothing by construction.
         That is why Stack's padding is asymmetric: trimming it evenly moved
         the content up under the ribbon and put a measured 466x44px of canvas
         behind the definition panel. Band 52px + 52px = 104px of the ~112px
         the padding gives it. Re-measure if either number is touched.

         A long thin ribbon rather than a short wide block, and that is the
         right trade for this effect: the ask was for the stream to "take more
         time", and travel time is a function of the RUN, which is the 952px
         width -- not of the height. Re-measure whenever anything is added to
         the top-right of the section, because this clearance is set by where
         the header's right column starts.

         EXPLICIT WIDTH, not `left` + `right`. A <canvas> is a REPLACED
         element: given both insets and `width: auto` it does not stretch, it
         falls back to its intrinsic width and ignores `right`. Measured when
         this was `left-[33%] right-0`: 416px wide instead of the ~1060px the
         insets implied, which put it straight back over the heading. The hero
         field hit the identical trap with `renderer.setSize(w, h, false)`. */
      className="pointer-events-none absolute top-[3.25rem] left-[33%] w-[60%] -z-10 hidden rail:block h-[3.25rem] opacity-[0.95]"
    />
  );
};

export default TokenStream;
