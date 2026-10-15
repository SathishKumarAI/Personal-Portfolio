// Run: node src/utils/stages.test.mjs   (also `npm test`)
//
// Named for the failure this repo keeps re-committing: two hand-maintained
// lists of the same strings, drifting apart silently.
//
// Stack renders the same 47 tools twice -- `stackGroups` files them by skill
// area for the tool list, `systemPlanes` files them by responsibility for the
// system diagram. Nothing in React notices when a tool is added to one and not
// the other: the list simply gains a term, the diagram simply does not, and
// both views render perfectly. The only symptom is a tool that exists in one
// reading of the stack and not the other, which is the kind of thing nobody
// finds by looking.
//
// Checked here rather than in the browser because it is set arithmetic over
// two constants, and because a missing term among 47 looks like a deliberate
// omission until someone counts.
import assert from "node:assert/strict";
import {
  stackGroups,
  systemPlanes,
  systemSubstrate,
  platformSwaps,
  PLATFORMS,
  glossary,
} from "../constants/index.js";

const listTools = () => new Set(stackGroups.flatMap((g) => g.items));
const allNodes = () => [
  ...systemPlanes.flatMap((p) => p.nodes),
  ...systemSubstrate.nodes,
];
const stageTools = () => allNodes().flatMap((n) => n.items);

// The one that will regress. Add a tool to `stackGroups` and forget the
// diagram, and it is missing from half the section with nothing to say so.
const test_every_listed_tool_appears_in_a_stage = () => {
  const stages = new Set(stageTools());
  const missing = [...listTools()].filter((t) => !stages.has(t));
  assert.deepEqual(
    missing,
    [],
    `in stackGroups but in no system stage: ${missing.join(", ")}`
  );
};

// And the mirror: a stage naming a tool the list does not carry would put a
// term in the diagram that has no definition and no glyph behind it.
const test_every_staged_tool_is_a_listed_tool = () => {
  const list = listTools();
  const stray = stageTools().filter((t) => !list.has(t));
  assert.deepEqual(
    stray,
    [],
    `in a system stage but not in stackGroups: ${stray.join(", ")}`
  );
};

// A tool in two stages is drawn twice in one diagram, which reads as two
// different things sharing a name rather than as one thing used twice.
const test_no_tool_is_staged_twice = () => {
  const all = stageTools();
  const dupes = [...new Set(all.filter((t, i) => all.indexOf(t) !== i))];
  assert.deepEqual(dupes, [], `staged more than once: ${dupes.join(", ")}`);
};

// Every term the section renders is hoverable for a definition. A term with no
// glossary entry renders with no dotted underline and does nothing on hover --
// indistinguishable, to a reader, from one that is broken.
const test_every_staged_tool_has_a_definition = () => {
  const undefined_ = stageTools().filter((t) => !glossary[t]);
  assert.deepEqual(
    undefined_,
    [],
    `no glossary entry: ${undefined_.join(", ")}`
  );
};

// A node with no tools is an empty box making a claim about a responsibility
// nothing fills -- which is worse than not drawing it, because the reader
// assumes the gap is deliberate.
const test_no_node_is_empty = () => {
  const empty = allNodes().filter((n) => !n.items.length).map((n) => n.id);
  assert.deepEqual(empty, [], `nodes with no tools: ${empty.join(", ")}`);
};

// Every node needs the two lines the drawing is built on: what it is called
// and what it is RESPONSIBLE for. The second is the whole difference between
// this view and the tool list.
const test_every_node_states_a_responsibility = () => {
  const bare = allNodes()
    .filter((n) => !n.title || !n.role)
    .map((n) => n.id);
  assert.deepEqual(bare, [], `nodes missing a title or role: ${bare.join(", ")}`);
};

// The swap table is the diagram's whole claim about portability. A row missing
// a vendor renders as a gap in one platform and not the others, which reads as
// "there is no equivalent" rather than "someone forgot a cell".
const test_every_swap_covers_every_platform = () => {
  const vendors = PLATFORMS.filter((p) => p.id !== "oss").map((p) => p.id);
  for (const [tool, swap] of Object.entries(platformSwaps)) {
    assert.ok(swap.role, `${tool}: swap has no role`);
    for (const v of vendors) {
      assert.ok(
        typeof swap[v] === "string" && swap[v].length > 0,
        `${tool}: no ${v} equivalent`
      );
    }
  }
};

// A swap for a tool the section never renders is dead weight that still costs
// a reader a row to scan.
const test_every_swap_names_a_staged_tool = () => {
  const stages = new Set(stageTools());
  const orphans = Object.keys(platformSwaps).filter((t) => !stages.has(t));
  assert.deepEqual(
    orphans,
    [],
    `swap defined for an unstaged tool: ${orphans.join(", ")}`
  );
};

const tests = [
  test_no_node_is_empty,
  test_every_node_states_a_responsibility,
  test_every_listed_tool_appears_in_a_stage,
  test_every_staged_tool_is_a_listed_tool,
  test_no_tool_is_staged_twice,
  test_every_staged_tool_has_a_definition,
  test_every_swap_covers_every_platform,
  test_every_swap_names_a_staged_tool,
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
