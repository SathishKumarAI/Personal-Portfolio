/**
 * Owns, the drawing on every project cover.
 * Does not own: the card around it, or what a project IS. `Works.jsx` owns the
 * card; `projects` in `../../constants` owns the content.
 *
 * WHY THE COVERS ARE DRAWN RATHER THAN SCREENSHOTTED. Each one is a small
 * diagram of how that project works -- a question being embedded and its
 * passages retrieved, a detector boxing an object, training happening in three
 * places at once. A screenshot of a user interface would say less, because the
 * interesting part of this work is the shape of the system behind it.
 *
 * Plain canvas calls, no library: the drawing is a few dozen lines and a
 * dependency would be larger than the thing it drew.
 *
 * THE TRAP. Every cover seeds its randomness from the PROJECT NAME, via
 * `hash(name)` and `mulberry` in `../../utils/draw.js`. A drawing is therefore
 * stable across reloads -- and renaming a project silently changes its
 * artwork, with nothing in the build to tell you.
 *
 * Split out of `Works.jsx` on 2026-10-16: the file was 655 lines, of which
 * 250 were these functions, and they share nothing with the React components
 * but the canvas context.
 *
 * Each drawer takes `(ctx, w, h, t, rng)` and returns nothing. `t` is seconds
 * since the cover came on screen; `rng` is the seeded generator. A drawer that
 * ignores `t` is a still frame, and must be left out of `ANIMATED` so no loop
 * is started for it.
 */
import { TAU, roundRect } from "../../utils/draw";

const RED = "#FF3621";
const BG = "#11262C"; // keep in step with --c-canvas in index.css
const bone = (a) => `rgba(233,230,223,${a})`;

const grid = (ctx, w, h) => {
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let x = 24; x < w; x += 24) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 24; y < h; y += 24) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
};
// rag-pipeline: a question is embedded, its nearest passages retrieved, and the
// answer marks the one it cites. Three labelled stages, left to right, so the
// card states the mechanic rather than decorating it.
const retrieval = (ctx, w, h, t, rng) => {
  grid(ctx, w, h);
  const mid = h * 0.5;
  const labelY = h * 0.88;
  const stage = (text, cx) => {
    ctx.font = '600 8px "JetBrains Mono Variable", monospace';
    ctx.fillStyle = bone(0.45);
    ctx.textAlign = "center";
    ctx.fillText(text, cx, labelY);
    ctx.textAlign = "left";
  };
  const arrow = (x0, x1) => {
    ctx.strokeStyle = bone(0.4); ctx.fillStyle = bone(0.4); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(x0, mid); ctx.lineTo(x1 - 4, mid); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x1 - 5, mid - 3); ctx.lineTo(x1, mid); ctx.lineTo(x1 - 5, mid + 3);
    ctx.closePath(); ctx.fill();
  };

  // 1. the question, as typed
  const qx = w * 0.05, qw = w * 0.16, qh = h * 0.17;
  ctx.strokeStyle = bone(0.5); ctx.lineWidth = 1.4;
  roundRect(ctx, qx, mid - qh / 2, qw, qh, 4); ctx.stroke();
  ctx.fillStyle = bone(0.5);
  roundRect(ctx, qx + 6, mid - 6, qw * 0.62, 3.5, 2); ctx.fill();
  roundRect(ctx, qx + 6, mid + 1.5, qw * 0.4, 3.5, 2); ctx.fill();
  stage("QUERY", qx + qw / 2);

  arrow(w * 0.215, w * 0.265);

  // 2. the store: the query lands as a point, the three nearest come back
  const sx = w * 0.27, sw = w * 0.3, sy = mid - h * 0.26, sh = h * 0.52;
  ctx.strokeStyle = bone(0.22); ctx.lineWidth = 1;
  ctx.setLineDash([3, 4]);
  roundRect(ctx, sx, sy, sw, sh, 6); ctx.stroke();
  ctx.setLineDash([]);
  const dots = [];
  for (let i = 0; i < 22; i++) {
    dots.push({ x: sx + 10 + rng() * (sw - 20), y: sy + 9 + rng() * (sh - 18) });
  }
  dots.forEach((d) => {
    ctx.beginPath(); ctx.arc(d.x, d.y, 2, 0, TAU); ctx.fillStyle = bone(0.35); ctx.fill();
  });
  const q = { x: sx + sw * 0.3, y: sy + sh * 0.5 };
  const near = dots
    .map((d, i) => ({ i, dd: (d.x - q.x) ** 2 + (d.y - q.y) ** 2 }))
    .sort((a, b) => a.dd - b.dd)
    .slice(0, 3);
  ctx.strokeStyle = "rgba(255,54,33,0.7)"; ctx.lineWidth = 1.2;
  near.forEach((o) => {
    const d = dots[o.i];
    ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(d.x, d.y); ctx.stroke();
    ctx.beginPath(); ctx.arc(d.x, d.y, 3.2, 0, TAU); ctx.fillStyle = RED; ctx.fill();
  });
  if (t >= 0) {
    const p = t % 1;
    ctx.beginPath(); ctx.arc(q.x, q.y, 6 + p * 26, 0, TAU);
    ctx.strokeStyle = `rgba(255,54,33,${0.5 * (1 - p)})`; ctx.lineWidth = 1.5; ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(q.x, q.y, 4.5, 0, TAU); ctx.fillStyle = RED; ctx.fill();
  stage("TOP-3 PASSAGES", sx + sw / 2);

  arrow(w * 0.585, w * 0.612);

  // 3. the answer, with the retrieved passage marked in it
  const ax = w * 0.63, aw = w * 0.27, rows = 6, rh = (sh - 12) / (rows - 1);
  for (let i = 0; i < rows; i++) {
    const y = sy + 8 + i * rh;
    const wid = aw * (0.5 + rng() * 0.5);
    if (i === 3) {
      ctx.fillStyle = "rgba(255,54,33,0.14)"; ctx.fillRect(ax - 6, y - 5, aw + 12, 12);
      ctx.fillStyle = RED; ctx.fillRect(ax - 6, y - 5, 2.5, 12);
      roundRect(ctx, ax, y - 2, wid, 4, 2); ctx.fill();
      ctx.font = '600 9px "JetBrains Mono Variable", monospace';
      ctx.fillText("[1]", ax + aw + 5, y + 3);
    } else {
      ctx.fillStyle = bone(0.45);
      roundRect(ctx, ax, y - 2, wid, 4, 2); ctx.fill();
    }
  }
  stage("CITED ANSWER", ax + aw / 2);
};

// due-diligence: cited answer
const citation = (ctx, w, h, t, rng) => {
  grid(ctx, w, h);
  const x0 = w * 0.14, x1 = w * 0.86, rows = 7, top = h * 0.2, rh = (h * 0.6) / rows, hi = 3;
  for (let i = 0; i < rows; i++) {
    const y = top + i * rh;
    const wid = (x1 - x0) * (0.45 + rng() * 0.5);
    if (i === hi) {
      ctx.fillStyle = "rgba(255,54,33,0.14)"; ctx.fillRect(x0 - 8, y - 5, x1 - x0 + 16, 12);
      ctx.fillStyle = RED; ctx.fillRect(x0 - 8, y - 5, 2.5, 12);
      ctx.fillStyle = RED; roundRect(ctx, x0, y - 2, wid, 4, 2); ctx.fill();
      ctx.font = '600 10px "JetBrains Mono Variable", monospace';
      ctx.fillStyle = RED; ctx.textAlign = "left"; ctx.fillText("[1]", x1 + 4, y + 3);
    } else {
      ctx.fillStyle = bone(0.45); roundRect(ctx, x0, y - 2, wid, 4, 2); ctx.fill();
    }
  }
};

// federated: one training round is two trips, not one. Local updates travel in,
// the aggregated global model travels back out to every client. Animating only
// the inbound leg said the clients give and never receive, which is the half of
// federated learning that is not federated.
const federated = (ctx, w, h, t) => {
  grid(ctx, w, h);
  const hub = { x: w * 0.5, y: h * 0.5 };
  const R = Math.min(w, h) * 0.34, N = 5;
  const clients = Array.from({ length: N }, (_, i) => {
    const a = -Math.PI / 2 + (i * TAU) / N;
    return { x: hub.x + Math.cos(a) * R, y: hub.y + Math.sin(a) * R };
  });
  ctx.strokeStyle = bone(0.4); ctx.lineWidth = 1;
  clients.forEach((c) => { ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(hub.x, hub.y); ctx.stroke(); });

  // Filled red inbound (this client's update), hollow outbound (the shared
  // model). Same two marks the rest of the covers use for "mine" and "given".
  const travel = (frac, inbound) => {
    clients.forEach((c, i) => {
      const pp = (frac + i / N) % 1;
      const k = inbound ? pp : 1 - pp;
      const x = c.x + (hub.x - c.x) * k;
      const y = c.y + (hub.y - c.y) * k;
      ctx.beginPath(); ctx.arc(x, y, 2.6, 0, TAU);
      if (inbound) {
        ctx.fillStyle = RED; ctx.fill();
      } else {
        ctx.fillStyle = BG; ctx.fill();
        ctx.strokeStyle = bone(0.85); ctx.lineWidth = 1.4; ctx.stroke();
      }
    });
  };

  const inbound = t < 0 ? null : (t % 1) < 0.5;
  const p = t < 0 ? 0.5 : ((t % 1) % 0.5) / 0.5;

  if (inbound === null) {
    // Static cover: show both legs mid-flight so the round still reads.
    travel(0.5, true);
    travel(0.5, false);
  } else {
    travel(p, inbound);
    // the aggregate step, at the moment the round turns around
    if (!inbound && p < 0.4) {
      const q = p / 0.4;
      ctx.beginPath(); ctx.arc(hub.x, hub.y, 12 + q * 20, 0, TAU);
      ctx.strokeStyle = `rgba(233,230,223,${0.45 * (1 - q)})`; ctx.lineWidth = 1.5; ctx.stroke();
    }
  }

  clients.forEach((c) => {
    ctx.beginPath(); ctx.arc(c.x, c.y, 7, 0, TAU); ctx.fillStyle = BG; ctx.fill();
    ctx.strokeStyle = bone(0.7); ctx.lineWidth = 1.4; ctx.stroke();
    ctx.fillStyle = bone(0.55); ctx.fillRect(c.x - 2, c.y - 2, 4, 4);
  });
  ctx.beginPath(); ctx.arc(hub.x, hub.y, 10, 0, TAU); ctx.fillStyle = RED; ctx.fill();

  ctx.font = '600 8px "JetBrains Mono Variable", monospace';
  ctx.fillStyle = bone(0.45);
  ctx.textAlign = "center";
  ctx.fillText(
    inbound === null ? "ONE ROUND" : inbound ? "LOCAL UPDATES IN" : "GLOBAL MODEL OUT",
    w * 0.5,
    h * 0.94
  );
  ctx.textAlign = "left";
};

// reels: video frames become text
const frames = (ctx, w, h, t, rng) => {
  grid(ctx, w, h);
  const fw = w * 0.14, fh = fw * 0.68, fx = w * 0.12, top = h * 0.24;
  for (let i = 0; i < 3; i++) {
    const y = top + i * (fh + 8);
    ctx.strokeStyle = bone(0.5); ctx.lineWidth = 1.4; ctx.strokeRect(fx, y, fw, fh);
    ctx.fillStyle = bone(0.45);
    for (let s = 0; s < 3; s++) { ctx.fillRect(fx + 3 + s * (fw / 3), y - 3, 3, 2); ctx.fillRect(fx + 3 + s * (fw / 3), y + fh + 1, 3, 2); }
  }
  const ax = fx + fw + w * 0.05;
  ctx.strokeStyle = RED; ctx.fillStyle = RED; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(ax, h * 0.5); ctx.lineTo(ax + w * 0.07, h * 0.5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ax + w * 0.07, h * 0.47); ctx.lineTo(ax + w * 0.09, h * 0.5); ctx.lineTo(ax + w * 0.07, h * 0.53); ctx.closePath(); ctx.fill();
  const tx = ax + w * 0.13, tw = w * 0.86 - tx;
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = bone(0.45);
    roundRect(ctx, tx, top + i * (h * 0.6 / 6), tw * (0.5 + rng() * 0.5), 3.5, 2); ctx.fill();
  }
};

// pickleball vision: detection + tracking
const tracking = (ctx, w, h, t) => {
  grid(ctx, w, h);
  const fx = w * 0.12, fy = h * 0.16, fw = w * 0.76, fh = h * 0.64;
  ctx.strokeStyle = bone(0.45); ctx.lineWidth = 1; ctx.strokeRect(fx, fy, fw, fh);
  const bbox = (x, y, bw, bh) => {
    ctx.strokeStyle = RED; ctx.lineWidth = 1.4; ctx.strokeRect(x, y, bw, bh);
    const k = 5; ctx.beginPath();
    ctx.moveTo(x, y + k); ctx.lineTo(x, y); ctx.lineTo(x + k, y);
    ctx.moveTo(x + bw - k, y + bh); ctx.lineTo(x + bw, y + bh); ctx.lineTo(x + bw, y + bh - k);
    ctx.stroke();
  };
  bbox(fx + fw * 0.55, fy + fh * 0.28, fw * 0.22, fh * 0.4);
  const p = t >= 0 ? t % 1 : 0.5;
  const mx = fx + fw * 0.12 + p * fw * 0.28;
  ctx.strokeStyle = "rgba(255,54,33,0.4)"; ctx.setLineDash([3, 4]); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(fx + fw * 0.12 + fw * 0.1, fy + fh * 0.6); ctx.lineTo(mx + fw * 0.1, fy + fh * 0.6); ctx.stroke();
  ctx.setLineDash([]);
  bbox(mx, fy + fh * 0.45, fw * 0.2, fh * 0.3);
};

// pickleball shuffle: live scorekeeper app
const scorecard = (ctx, w, h) => {
  grid(ctx, w, h);
  const pw = w * 0.26, ph = h * 0.74, px = w * 0.5 - pw / 2, py = h * 0.5 - ph / 2;
  ctx.fillStyle = "rgba(233,230,223,0.04)"; roundRect(ctx, px, py, pw, ph, 10); ctx.fill();
  ctx.strokeStyle = bone(0.5); ctx.lineWidth = 1.4; roundRect(ctx, px, py, pw, ph, 10); ctx.stroke();
  ctx.textAlign = "center";
  ctx.fillStyle = bone(0.45); ctx.font = '600 8px "JetBrains Mono Variable", monospace';
  ctx.fillText("SCORE", w * 0.5, py + ph * 0.22);
  ctx.fillStyle = bone(0.9); ctx.font = '700 20px "Barlow", sans-serif';
  ctx.fillText("11: 9", w * 0.5, py + ph * 0.44);
  ctx.strokeStyle = bone(0.4); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(px + 12, py + ph * 0.56); ctx.lineTo(px + pw - 12, py + ph * 0.56); ctx.stroke();
  ctx.fillStyle = RED; roundRect(ctx, w * 0.5 - pw * 0.32, py + ph * 0.66, pw * 0.64, ph * 0.13, 5); ctx.fill();
  ctx.fillStyle = "#fff"; ctx.font = '700 8px "JetBrains Mono Variable", monospace';
  ctx.fillText("TWIST", w * 0.5, py + ph * 0.735);
};

const DRAWERS = { retrieval, citation, federated, frames, tracking, scorecard };
const LABELS = {
  retrieval: "retrieve, then cite", citation: "cited answer", federated: "federated",
  frames: "video → text", tracking: "detection", scorecard: "live app",
};
const ANIMATED = new Set(["retrieval", "federated", "tracking"]);
export { DRAWERS, LABELS, ANIMATED };
