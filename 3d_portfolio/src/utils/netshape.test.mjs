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

// The ceiling that keeps it a diagram rather than a mesh. Fully connected is
// 4*8 + 8*6 + 6*5 = 110, which at any opacity that makes one edge visible
// reads as a net laid over the headline. If a future shape pushes this past
// the limit, the field needs looking at, not the test.
const test_the_lattice_stays_sparse = () => {
  const total = gaps().reduce((n, g) => n + g.pairs.length, 0);
  assert.ok(total <= 48, `${total} edges is past the sparse ceiling of 48`);
  assert.ok(total >= 20, `${total} edges is too few to read as a network`);
};

// Guards the signal buffer. `MAX_SIGNALS` in NeuralField3D is 32 and a gap
// carries every one of its edges at once, so a wider gap than that would be
// silently clipped mid-pass rather than throwing.
const test_no_gap_exceeds_the_signal_buffer = () => {
  for (const { from, to, pairs } of gaps()) {
    assert.ok(
      pairs.length <= 32,
      `${from} -> ${to} needs ${pairs.length} concurrent signals, over MAX_SIGNALS=32`
    );
  }
};

const tests = [
  test_every_unit_has_an_incoming_edge,
  test_every_unit_has_an_outgoing_edge,
  test_no_edge_is_drawn_twice,
  test_the_lattice_stays_sparse,
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
