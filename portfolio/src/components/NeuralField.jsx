import { useEffect, useRef } from "react";

/**
 * Owns, the page-wide ambient field behind everything.
 *
 * The idea, and why it is not decoration, the left contact dock and the right
 * section rail are already two columns of dots on opposite edges of a fixed
 * viewport. This reads them as the INPUT and OUTPUT layers of a network, puts
 * two hidden layers between them, and sends activations left to right along real
 * paths. The nodes are not invented: their coordinates come from
 * getBoundingClientRect() on the actual controls, so the drawing stays wired to
 * the interface even when a dock hides itself or the window resizes.
 *
 * Scoped to the LANDING VIEW and faded out as the hero leaves. The token stream
 * lives separately, in the one section where tokens mean something
 * (TokenStream.jsx): a backdrop that follows the reader everywhere is wallpaper.
 *
 * This file is now the FALLBACK, and the `NeuralField3D` module is the field a
 * desktop reader actually sees. The line that used to sit here — "deliberately
 * NOT a 3D engine, three.js plus a renderer is ~150kB gzip against a ~115kB
 * bundle" — was true, is still true as a number, and was overruled on purpose
 * by the owner after being shown it. What did not change is who pays: this 2D
 * canvas is what runs for reduced motion and for a browser with no WebGL, and
 * below 1024px neither one runs at all.
 *
 * Cheap by construction:
 *  - one rAF loop for the whole page, not one per effect
 *  - devicePixelRatio capped at 2
 *  - node positions re-read on resize and every 500ms, never per frame
 *  - `prefers-reduced-motion` paints one settled frame and stops
 *  - pointer-events: none, and aria-hidden, it is never in anyone's way
 */

// The shape and the layer names live in netShape.js. They used to be declared
// here AND in NeuralField3D, which is two copies of one fact: see that file.
import {
  HIDDEN, LAYERS, FIRE_MS, HOP_SECONDS, REST_SECONDS,
  FIELD_ALPHA, alphaFor, EDGE_REST, EDGE_LIT, HIDDEN_SPREAD, inkToken, edgesFor,
  PASS_BUDGET,
} from "./netShape";

const token = (el, name, alpha) => {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return v ? `rgba(${v.split(/\s+/).join(",")},${alpha})` : `rgba(128,128,128,${alpha})`;
};

/**
 * The point on a control's edge that faces the network, plus 6px of air — the
 * same anchor the 3D field uses, and for the same reason. The centre put the
 * node under an opaque tile at `z-40` while this canvas sits at `z-0`, so the
 * edge leaving it disappeared a third of the way out and the lattice read as
 * floating near the dock rather than wired to it. `dir` is +1 for the left
 * dock, -1 for the right rail.
 */
const port = (el, dir) => {
  const b = el.getBoundingClientRect();
  return { x: dir > 0 ? b.right + 6 : b.left - 6, y: b.top + b.height / 2, el };
};

/** Is this control actually on screen? A hidden dock must not anchor an edge. */
const shown = (el) => {
  const s = getComputedStyle(el);
  if (s.display === "none" || s.visibility === "hidden") return false;
  const b = el.getBoundingClientRect();
  return b.width > 0 && b.height > 0;
};

const NeuralField = () => {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    /**
     * Deliberately NOT fetched here. `getContext("2d")` is permanent: once a
     * canvas has a 2D context it can never hand out a WebGL one, so asking for
     * it at mount would break the 3D field for everyone before it had a chance
     * to load. It is taken in `start()`, which only runs when this file is the
     * one drawing.
     */
    let ctx = null;
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Desktop only. The two docks it wires together do not exist below the
    // `rail` breakpoint, so there is nothing to draw, and more to the point, a
    // requestAnimationFrame loop on a phone is battery spent on decoration
    // nobody asked for. This STOPS the loop rather than hiding the canvas.
    const wide = window.matchMedia("(min-width: 1024px)");

    // Scoped to the landing view. The canvas must stay position:fixed, because
    // it is wired to two docks that are themselves fixed, so it is scoped by
    // FADING OUT as the hero leaves and halting the loop, not by re-parenting.
    // A field that follows the reader through Experience and Contact is
    // wallpaper competing with text, which is the opposite of what it is for.
    let heroVisible = 1;

    let dpr = 1, w = 0, h = 0, raf = 0, poll = 0;
    let layers = [];      // [inputs, hidden1, hidden2, outputs]
    // gaps[k] = every [from, to] edge crossing from layer k to layer k+1. A
    // forward pass carries one whole gap at a time; see `gapsOf` below.
    let gaps = [];
    let wave = null;      // { hop, t } while a pass is in flight, else null
    let rest = 1.2;       // seconds of quiet left before the next pass
    // Two passes, then the field holds still so the reader can read. Refilled
    // when they leave the hero and come back. See netShape.js.
    let passesLeft = PASS_BUDGET;
    let left = false;
    // Signature of the interface the current graph was built from, so the
    // 500ms poll can tell "nothing moved" from "rebuild". Without it the poll
    // dropped every pass before it crossed: a pass takes ~3.5s and the poll
    // fires every 0.5s, so the dock fired endlessly and the rail never did.
    let lastSig = "";

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      c.width = Math.max(1, w * dpr);
      c.height = Math.max(1, h * dpr);
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
    };

    /**
     * Read the live interface. Inputs are the left contact dock, outputs the
     * right section rail; both are position:fixed, so their rects are already in
     * the canvas's coordinate space and need no scroll correction.
     */
    const readLayers = () => {
      const inputs = [
        ...document.querySelectorAll(
          'nav[aria-label="Contact shortcuts"] a, nav[aria-label="Contact shortcuts"] button'
        ),
      ].filter(shown).map((el) => port(el, 1));
      const outputs = [
        ...document.querySelectorAll('nav[aria-label="Sections"] a'),
      ].filter(shown).map((el) => port(el, -1));

      if (!inputs.length || !outputs.length) return [];

      const x0 = inputs[0].x, x1 = outputs[0].x;
      /* The hidden layers share the real columns' vertical band — the same
         rule the 3D field follows. They used to span `h * 0.42` centred on the
         viewport, which is far taller than the ~200px the docks occupy, so the
         middle of the network bulged past the icons at either end and the band
         moved with window height while the docks did not. Two layers read from
         the interface and two invented from the viewport is not one diagram. */
      const ys = [...inputs, ...outputs].map((p) => p.y);
      const bandMid = (Math.min(...ys) + Math.max(...ys)) / 2;
      // Scaled by HIDDEN_SPREAD and re-centred, matching the 3D field.
      const span = (Math.max(...ys) - Math.min(...ys)) * HIDDEN_SPREAD;
      const bandTop = bandMid - span / 2;
      const hidden = HIDDEN.map((count, li) => {
        const x = x0 + ((x1 - x0) * (li + 1)) / (HIDDEN.length + 1);
        return Array.from({ length: count }, (_, ni) => ({
          x,
          y: count === 1 ? bandMid : bandTop + (span * ni) / (count - 1),
        }));
      });
      return [inputs, ...hidden, outputs];
    };

    /**
     * Light the real control an activation leaves or reaches. Same mechanism,
     * same class and same duration as the 3D field — see `.net-fire` in
     * index.css for why this is the thing that explains the diagram.
     *
     * The CSS rule turns itself off under `prefers-reduced-motion`, which
     * matters more here than there: this file is exactly what a reduced-motion
     * reader sees, so the class still lands and simply does nothing.
     */
    const lit = new Map();
    const fire = (el) => {
      if (!el) return;
      el.classList.remove("net-fire");
      void el.offsetWidth; // restart the animation rather than ignore the re-add
      el.classList.add("net-fire");
      clearTimeout(lit.get(el));
      lit.set(el, window.setTimeout(() => {
        el.classList.remove("net-fire");
        lit.delete(el);
      }, FIRE_MS));
    };
    const unfireAll = () => {
      lit.forEach((id, el) => { clearTimeout(id); el.classList.remove("net-fire"); });
      lit.clear();
    };

    /**
     * A forward pass, one layer gap at a time — the same correction the 3D
     * field carries, and see its `stepSignals` for the full reasoning. Short
     * version: a layer in an MLP is one matrix multiply, so every unit of
     * layer k+1 reads every unit of layer k at once. The old single dot
     * travelling input -> hidden -> hidden -> output drew a path through one
     * unit per layer, which is not a thing a network does, and read exactly as
     * "layer 1 finishes, then layer 2 starts".
     */
    const gapsOf = (ls) => {
      const out = [];
      for (let i = 0; i < ls.length - 1; i++) out.push(edgesFor(ls[i], ls[i + 1]));
      return out;
    };

    /**
     * Re-read the interface, and rebuild ONLY if it actually moved.
     *
     * A rebuild has to drop a pass in flight, because that pass holds node
     * objects from the graph being replaced. The poll runs twice a second and
     * a pass takes ~3.5s, so an unconditional rebuild meant no pass ever
     * reached the output layer -- measured: the contact dock fired every
     * ~500ms and the section rail never fired once in nine seconds.
     */
    const refresh = () => {
      const next = readLayers();
      const sig = `${w}x${h}|${next.flat().map((p) => `${Math.round(p.x)},${Math.round(p.y)}`).join(" ")}`;
      if (sig === lastSig) return;
      lastSig = sig;
      layers = next;
      gaps = gapsOf(layers);
      wave = null;
    };

    const draw = () => {
      // A frame can still be in flight when the 3D module takes over, and this
      // canvas then has no 2D context at all.
      if (!ctx) return;
      const scheme = root.getAttribute("data-scheme") === "light" ? "light" : "dark";
      const ink = token(root, inkToken(scheme), 1);
      const accent = token(root, "--c-accent", 1);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (heroVisible <= 0.01) return;
      ctx.globalAlpha = heroVisible;

      if (layers.length >= 2) {
        /* Every edge, and the gap currently carrying drawn brighter — the
           same wiring and the same lighting the 3D field uses, from the same
           `edgesFor`. This file used to build its own fully-connected set
           while the WebGL one drew a sparse lattice: two different drawings of
           one diagram, which is the drift netShape.js exists to stop. */
        ctx.lineWidth = 0.9;
        const a = alphaFor(scheme);
        gaps.forEach((gap, k) => {
          const lit = wave && wave.hop === k
            ? EDGE_REST + (EDGE_LIT - EDGE_REST) * Math.sin(Math.PI * Math.min(1, wave.t))
            : EDGE_REST;
          ctx.strokeStyle = ink.replace(",1)", `,${(a.edge * lit).toFixed(3)})`);
          ctx.beginPath();
          gap.forEach(([p, q]) => { ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); });
          ctx.stroke();
        });

        // Layer labels, on a baseline along the bottom with a tick rising to each
        // column. They sit there rather than above the nodes because the columns
        // pass behind the headline, and a caption landing on the type would cost
        // more than it explains.
        const labelY = h - 54;
        ctx.font = '500 10px "JetBrains Mono Variable", ui-monospace, monospace';
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        layers.forEach((layer, li) => {
          const { name, gloss } = LAYERS[li] ?? { name: "", gloss: "" };
          if (!name || !layer.length) return;
          const x = layer[0].x;
          const lowest = Math.max(...layer.map((n) => n.y));

          // tick from the column down to the baseline
          ctx.beginPath();
          ctx.moveTo(x, lowest + 10);
          ctx.lineTo(x, labelY - 12);
          ctx.strokeStyle = ink.replace(",1)", ",0.22)");
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle =
            li === 0 || li === layers.length - 1
              ? accent.replace(",1)", ",0.85)")  // the two the reader can point at
              : ink.replace(",1)", ",0.7)");
          ctx.fillText(name, x, labelY);

          /* The gloss is what turns the name into a sentence: "INPUT" names a
             layer the reader has no reason to think is real, "ways to reach me"
             tells them it is the four icons they can see. Only the two layers
             with a counterpart in the interface carry one — see netShape.js. */
          let line = labelY + 11;
          if (gloss) {
            ctx.fillStyle = accent.replace(",1)", ",0.6)");
            ctx.fillText(gloss, x, line);
            line += 11;
          }

          // node count last, the one number that explains the shape
          ctx.fillStyle = ink.replace(",1)", ",0.45)");
          ctx.fillText(String(layer.length), x, line);
        });
        ctx.textAlign = "start";

        // hidden units
        layers.slice(1, -1).flat().forEach((n) => {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 2.9, 0, Math.PI * 2);
          ctx.fillStyle = ink.replace(",1)", `,${alphaFor(scheme).node})`);
          ctx.fill();
        });

        // The gap currently carrying: every edge across it, together.
        if (wave && gaps[wave.hop]) {
          // Eased, so a front leaves one layer and settles into the next
          // rather than crawling at a constant rate — linear read as a
          // scanline sweeping the page.
          gaps[wave.hop].forEach(([a, b], i) => {
            // Per-edge phase and a glow that rises and falls across the
            // crossing -- the same wave the 3D field draws, and for the same
            // reason: one rigid front sweeping the page read as a scanline.
            const phase = ((i % 5) / 5) * 0.1;
            const tt = Math.max(0, Math.min(1, (wave.t - phase) / (1 - 0.1)));
            const ff = tt < 0.5 ? 2 * tt * tt : 1 - ((-2 * tt + 2) ** 2) / 2;
            const glow = Math.sin(Math.PI * tt) ** 0.6;
            if (glow <= 0.01) return;
            const x = a.x + (b.x - a.x) * ff;
            const y = a.y + (b.y - a.y) * ff;

            // the trail it is leaving on this edge
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(x, y);
            ctx.strokeStyle = accent.replace(",1)", `,${(FIELD_ALPHA.trail * glow).toFixed(3)})`);
            ctx.lineWidth = 1.2;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(x, y, 2.6, 0, Math.PI * 2);
            ctx.fillStyle = accent.replace(",1)", `,${(FIELD_ALPHA.signal * glow).toFixed(3)})`);
            ctx.fill();
          });
        }
      }
    };

    const frame = () => {
      // How much of the hero is still on screen, 1 at the top and 0 once it has
      // scrolled away. Read from scroll position rather than an observer so the
      // fade is continuous rather than a step.
      const hero = document.querySelector('section[aria-label="Intro"]');
      if (hero) {
        const b = hero.getBoundingClientRect();
        heroVisible = Math.max(0, Math.min(1, (b.bottom - h * 0.15) / (h * 0.5)));
      }

      // 1/60s rather than a real delta: this loop has always stepped in fixed
      // ticks, and a pass is paced in seconds, so the two agree.
      const dt = 1 / 60;

      // The hero leaving and coming back is what refills the budget. `left`
      // latches, so jitter at the top of the page cannot re-arm it.
      if (heroVisible < 0.15) left = true;
      else if (left && heroVisible > 0.9) {
        left = false;
        passesLeft = PASS_BUDGET;
        rest = 0.6;
      }

      if (!wave) {
        // Passes stop while the hero is off screen rather than piling up
        // behind it, and stop for good once the budget is spent.
        if (heroVisible > 0.05 && passesLeft > 0) rest -= dt;
        if (rest <= 0 && gaps.length && passesLeft > 0) {
          passesLeft -= 1;
          wave = { hop: 0, t: 0 };
          layers[0]?.forEach((n) => fire(n.el)); // the whole input VECTOR
        }
      } else {
        wave.t += dt / HOP_SECONDS;
        if (wave.t >= 1) {
          wave.hop += 1;
          wave.t = 0;
          if (wave.hop >= gaps.length) {
            layers.at(-1)?.forEach((n) => fire(n.el)); // all five sections
            wave = null;
            rest = REST_SECONDS;
          }
        }
      }

      draw();
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      clearInterval(poll);
      raf = 0;
      poll = 0;
      wave = null;
      // The pulse classes sit on the rails, which this component does not own
      // and React keeps mounted. Leaving one behind outlives the field.
      unfireAll();
      if (!ctx) return; // never drew: the 3D field has the canvas
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, c.width, c.height);
    };

    const start = () => {
      // Handed off? The 3D module owns the canvas from that point on. This
      // returns BEFORE `resize()`, which would otherwise reset the WebGL
      // drawing buffer out from under the renderer on every window resize.
      if (handed) return;
      if (!wide.matches) return stop();
      ctx ??= c.getContext("2d");
      resize();
      refresh();
      if (reduced) {
        // one settled frame, the picture still reads, it just holds still
        draw();
        return;
      }
      if (!raf) raf = requestAnimationFrame(frame);
      // The docks appear, hide and move; re-read on a slow interval rather than
      // per frame, which would cost a layout flush 60 times a second.
      if (!poll) poll = setInterval(refresh, 500);
    };

    /**
     * Who draws this canvas. WebGL gets it when there is a pointer-driven
     * desktop to spend it on and the reader has not asked for less motion;
     * everything else keeps the 2D loop below, which is why this file did not
     * shrink when the 3D one arrived.
     *
     * The support probe is a real context, created and thrown away: a browser
     * can advertise the `WebGL2RenderingContext` constructor and still refuse
     * to hand out a context (blocklisted driver, software rendering disabled,
     * too many live contexts on the page).
     */
    const canUseWebGL = () => {
      try {
        const probe = document.createElement("canvas").getContext("webgl2");
        probe?.getExtension("WEBGL_lose_context")?.loseContext();
        return Boolean(probe);
      } catch {
        return false;
      }
    };

    let handed = false;
    let dispose3d = null;
    let cancelled = false;

    if (wide.matches && !reduced && canUseWebGL()) {
      handed = true;
      c.style.display = "none"; // the 3D module brings its own canvas
      // A separate chunk: a phone, a reduced-motion reader and a browser with
      // no WebGL never fetch it. If it fails to load — offline, a blocked CDN,
      // a GL context lost at creation — the 2D field takes the canvas back
      // rather than the hero losing its backdrop.
      import("./NeuralField3D")
        .then((m) => (cancelled ? null : m.start(c)))
        .then((d) => {
          if (cancelled) { d?.(); return; }
          dispose3d = d;
        })
        .catch(() => {
          handed = false;
          c.style.display = "";
          if (!cancelled) start();
        });
    }

    start();

    const onResize = () => start();
    window.addEventListener("resize", onResize);
    wide.addEventListener("change", start);

    return () => {
      cancelled = true;
      dispose3d?.();
      stop();
      window.removeEventListener("resize", onResize);
      wide.removeEventListener("change", start);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 hidden rail:block"
    />
  );
};

export default NeuralField;
