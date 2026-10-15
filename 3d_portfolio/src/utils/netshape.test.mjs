// Run: node src/utils/netshape.test.mjs   (also `npm test`)
//
// Named for the failure that shipped: the hero field drew a hidden unit with
// no incoming connection. Expanding four inputs into eight hidden units, each
// source claimed the two opposite it, which covered seven of the eight — and
// the last source spent its second edge on a duplicate, because `centre + 1`
// clamped to the index it had already taken. HIDDEN 1's top unit sat there
// wired to nothing, which is a drawing of something that is not a network.
//
// It is checked here rather than in the browser because it is pure arithmetic
// over the layer sizes, and because it is invisible: a missing edge among
// thirty-four looks like a design choice until someone counts.
import assert from "node:assert/strict";
import { HIDDEN, edgesFor } from "../components/netShape.js";

// The real shape of the diagram. INPUT is four contact links and OUTPUT five
// sections; both are fixed by the interface, so this is not a fixture, it is
// the thing that ships.
const SIZES = [4, ...HIDDEN, 5];
const layerOf = (n, li) => Array.from({ length: n }, (_, i) => ({ li, i }));
const gaps = () => {
  const layers = SIZES.map(layerOf);
  return layers.slice(0, -1).map((_, i) => ({
    from: SIZES[i],
    to: SIZES[i + 1],
    pairs: edgesFor(layers[i], layers[i + 1]),
  }));
};

// The one that regressed. Every unit a layer draws must have a wire into it,
// or the diagram is claiming a unit computes from nothing.
const test_every_unit_has_an_incoming_edge = () => {
  for (const { to, pairs, from } of gaps()) {
    const incoming = new Array(to).fill(0);
    for (const [, b] of pairs) incoming[b.i]++;
    assert.ok(
      incoming.every((c) => c > 0),
      `${from} -> ${to}: units [${incoming
        .map((c, i) => (c === 0 ? i : -1))
        .filter((i) => i >= 0)}] have no incoming edge`
    );
  }
};

// And the mirror: a unit that feeds nothing is equally wrong, and would mean a
// contact icon sending its activation nowhere.
const test_every_unit_has_an_outgoing_edge = () => {
  for (const { from, to, pairs } of gaps()) {
    const outgoing = new Array(from).fill(0);
    for (const [a] of pairs) outgoing[a.i]++;
    assert.ok(
      outgoing.every((c) => c > 0),
      `${from} -> ${to}: units [${outgoing
        .map((c, i) => (c === 0 ? i : -1))
        .filter((i) => i >= 0)}] have no outgoing edge`
    );
  }
};

// A pair drawn twice renders at double brightness on one line and spends an
// activation slot on a wire already lit. The clamp produced exactly this at
// the end of every expanding gap.
const test_no_edge_is_drawn_twice = () => {
  for (const { from, to, pairs } of gaps()) {
    const keys = pairs.map(([a, b]) => `${a.i}:${b.i}`);
    assert.equal(
      keys.length,
      new Set(keys).size,
      `${from} -> ${to} contains a duplicate edge`
    );
  }
};

// The field is FULLY CONNECTED, because that is what its labels claim. A dense
// layer's weight matrix is (n_out x n_in) with every entry present, so the
// edge count is exactly the product of the two layer sizes. Anything less and
// the drawing is a locally-connected net wearing a dense net's captions.
const test_the_lattice_is_fully_connected = () => {
  for (const { from, to, pairs } of gaps()) {
    assert.equal(
      pairs.length,
      from * to,
      `${from} -> ${to} should have ${from * to} edges, has ${pairs.length}`
    );
  }
};

// Guards the signal buffer. A pass carries every edge of one gap at once, and
// `stepSignals` draws min(gap.length, MAX_SIGNALS) rather than throwing -- so
// a gap wider than the buffer loses edges silently, mid-animation.
const MAX_SIGNALS = 64; // keep in step with NeuralField3D.js
const test_no_gap_exceeds_the_signal_buffer = () => {
  for (const { from, to, pairs } of gaps()) {
    assert.ok(
      pairs.length <= MAX_SIGNALS,
      `${from} -> ${to} needs ${pairs.length} concurrent signals, over MAX_SIGNALS=${MAX_SIGNALS}`
    );
  }
};

const tests = [
  test_every_unit_has_an_incoming_edge,
  test_every_unit_has_an_outgoing_edge,
  test_no_edge_is_drawn_twice,
  test_the_lattice_is_fully_connected,
  test_no_gap_exceeds_the_signal_buffer,
];

let failed = 0;
for (const t of tests) {
  try {
    t();
    console.log(`ok   ${t.name}`);
  } catch (e) {
    failed++;
    console.error(`FAIL ${t.name}\n     ${e.message}`);
  }
}
console.log(`${tests.length - failed}/${tests.length} passed`);
process.exit(failed ? 1 : 0);
