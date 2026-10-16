# Going faster: agents and skills

Parallelism buys wall-clock time and costs coherence. This file is about
spending that trade deliberately rather than discovering it.

Everything here is from building this site. The numbers are what actually
happened, not estimates.

---

## 1. What parallelises, and what does not

The test is **shared state**, not size. Two jobs can run at once when neither
needs to see the other's output to be correct.

| Safe to run in parallel | Why |
| --- | --- |
| Two different sections of the page | Different files, different components, no shared layout |
| A feature in one file + a doc pass in another | Disjoint file sets |
| Research ("what do the three clouds call this role?") + building something else | Read-only against the internet, writes nothing |
| Per-item work over a list: definitions for 30 terms, alt text for 20 images | Each item is independent and uniform |

| Never parallelise | Why |
| --- | --- |
| Two jobs touching the same file | Last writer wins, silently. Git will not save you inside one working tree |
| Anything with a **height, width or performance budget** | Two agents each add 60px "within budget" and the section is 120px over. The budget is global state |
| A taxonomy or naming decision | Two agents will pick two reasonable, incompatible schemes. Decide once, then fan out |
| The verification pass | One agent measuring is a measurement. Three agents measuring is three opinions and no record |

**The budget failure is the one that bites.** Layout, bundle size and scroll
length are global properties, and an agent only sees its own diff.

---

## 2. The prompt that makes a parallel agent safe

A subagent with a vague brief produces work you have to redo. Give it the
things it cannot infer from the code:

> You are working in `<repo>`. Build `<one specific thing>`.
>
> **Files you own:** `<explicit list>` — plus new files you create.
> **Files you must not touch:** `<list>` — another agent is editing them.
> **Do not run git.** Leave changes in the working tree; I handle commits.
>
> **House rules that are not obvious from the code:** `<paste the 5–10 real
> ones: the honesty rails, the motion rule, the comment style, the traps
> already learned>`
>
> **Verification you must do:** `<build/test/lint commands>`. Do not attempt
> browser automation; I own that and will verify visually.
>
> **Report back, under 400 words:** what you chose and why, what you rejected,
> the exact output of each check, and a numbered list of what I must verify
> that you could not.

The last line is the one people leave out, and it is the one that makes the
result usable. An agent that tells you what it could *not* check has handed
you a working list; one that reports success has handed you a search.

### Worked example from this repo

One agent was given the closing band while the main thread worked on Stack.
Its brief carried the ten house rules, an explicit file list, and a ban on
git. It came back having chosen TF-IDF retrieval over three alternatives,
with the reasoning for each rejection, build and lint output quoted, and
**eight numbered things for me to check in a browser**. Six were fine; two
were real and fixed in minutes.

It also reported a pre-existing test failure it had not caused and could not
fix inside its file scope. That is a well-behaved agent: it found something
outside its remit and said so instead of widening its own scope.

---

## 3. When to make a skill instead of repeating a prompt

A skill is worth writing when the same instruction has been given **three
times** and the answer is always the same shape. Below three, you are
guessing at the pattern.

Good candidates, from this project:

| Repeated job | Why a skill beats re-prompting |
| --- | --- |
| "Add a tool to the stack" | Touches five places — the group list, the glossary, the icon map, a diagram node, sometimes the cloud matrix. A skill encodes all five and the test that proves none was missed |
| "Verify this section visually" | Always the same measurements: overlap against five elements, section height in screens, contrast in six themes. Same script every time |
| "Check the docs still match" | Establish ground truth from the code, grep the living docs for contradicting numbers, leave dated entries alone |
| "Write a commit message here" | This repo wants *why*, the rejected options, and the measurements. That is a format, and formats are what skills are for |

Bad candidates: anything requiring judgement about *this* content. A skill
that decides which box a tool belongs in will be confidently wrong, because
that decision needs knowledge of the person, not of the repo.

---

## 4. The sequence that actually went fastest

Not the most parallel. The fastest to a result worth keeping.

1. **Decide the content model alone, with no agents.** One head, one scheme.
   Fanning out before this produces incompatible vocabularies.
2. **Fan out on independent sections.** Three agents, three sections, explicit
   file ownership.
3. **Converge and measure yourself.** One pass, one measurer, one record.
4. **Fan out on the per-item long tail** — definitions, alt text, icons.
   Uniform work over a list is where parallelism genuinely pays.
5. **Converge for taxonomy and naming.** Decide once, centrally. This is the
   step that is tempting to parallelise and must not be.
6. **Documentation last, by one agent, reading the final state.** Docs written
   in parallel with the code describe the code that was planned.

---

## 5. Prompts for the jobs that recur

### Re-check the docs against reality

> Establish ground truth from the code first — counts, file lists, test
> numbers — and print it. Then grep the *living* reference documents for
> numbers that contradict it and fix those. Do **not** edit dated entries: a
> log rewritten to match today is worthless as a log. List what you changed
> and what you deliberately left.

### Audit for things nobody uses

> Find code, assets and documents nothing references. For each, prove it with
> something stronger than grep — for assets, check whether the bundler emits
> them; for exports, check the import graph. Move what is dead to `archive/`
> with the evidence written beside it. Delete nothing.

### Make an agent argue with itself

> Before implementing, give me the two strongest objections to the approach
> you just proposed, and what you would build instead if each were decisive.

That last one is the cheapest quality gain available. In this project it is
what produced the layered-plane diagram instead of a prettier version of the
list that already existed.
