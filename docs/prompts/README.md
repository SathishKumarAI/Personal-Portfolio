# docs/prompts/

How to build a site like this one with a coding agent, and how to do it
quickly without the speed costing you the thing that makes it worth having.

| File | Use it when |
| --- | --- |
| [`BUILD-THIS-YOURSELF.md`](BUILD-THIS-YOURSELF.md) | You are starting from nothing. Eight phases, in the order that makes each one checkable |
| [`AGENTS-AND-SKILLS.md`](AGENTS-AND-SKILLS.md) | You want it faster: what to parallelise across agents, what to never parallelise, and which repeated jobs are worth turning into a skill |
| [`CLONE-THIS-SITE.md`](CLONE-THIS-SITE.md) | You want *this* site specifically, re-pointed at your own work |

## Read this first

**A one-shot prompt produces a template.** "Build me a portfolio like X" gets
you someone else's taste, a layout you cannot defend in an interview, and a
page of numbers nobody measured. Every prompt here is written to prevent that
specific outcome.

**The order is the product.** Content before layout, rails before features,
budgets before polish. Each phase exists so the next one can be checked
against something. Run them out of order and you lose the checking, which is
the only thing separating this from a template.

**The agent will be confidently wrong, repeatedly.** That is not a reason to
avoid using one; it is the reason every phase ends with a verification step
that does not take the agent's word for anything. In this project the agent
(me) shipped a canvas sized in the wrong units, a colour ramp whose luminance
was not monotonic, a tool filed in a category that would embarrass the owner
in an interview, and a count of its own tests that was wrong by two. Every one
of those was caught by measuring, and none by re-reading the code.

## The three rules worth holding above all the prompts

1. **Measure the running thing, never the source.** A rule can read correctly
   and render wrong. Ask for the computed value, the bounding box, the
   contrast ratio, the bundle entry — not for an assurance.
2. **A green check is a claim about coverage.** When something passes, ask
   what it structurally could not see. Then look at that part by hand.
3. **A placement is a claim.** Which box a thing sits in asserts what kind of
   thing it is. Tests catch drift between lists; they cannot catch a wrong
   category, and a wrong category is what an expert reader notices first.
