---
name: spec-split
description: >-
  Split a complex piece of text — a project brief, RFC, email thread, meeting
  notes, README, epic description, client requirements, or anything else the
  user pastes or attaches — into an ordered backlog of individual, verifiable
  tasks under docs/simulations-react/specs/. Do not implement code. Use this
  whenever the user wants a long or messy description broken into concrete work
  items, tasks, tickets, or specs — even if they don't say the word "spec".
disable-model-invocation: true
---

# Split text into individual tasks

Take whatever the user supplies at invocation and turn it into a set of discrete, verifiable work items. Planning only — no implementation.

## 1. Take the input

The input is whatever the user provides with the invocation: text pasted inline, one or more file paths, an attachment, or a mix. It may be structured (README, RFC, spec document) or unstructured (email thread, chat log, meeting notes, bullet dump, transcript). Handle all of it the same way — extract intent, not format.

If nothing was supplied, ask for it. Do not go looking for a default file.

Read every file the user referenced, plus anything those files link to that is clearly load-bearing. If the input references parts of this repository, explore them to establish what already exists — text usually describes a target state, and some of it is already built. Anything already implemented does not become a task.

## 2. Extract before you split

Unstructured input hides three different things that must not be mixed:

- **Requirements** — what has to be true when the work is done.
- **Context** — background, rationale, constraints. Informs tasks, never becomes one.
- **Noise** — pleasantries, tangents, resolved debates, superseded statements.

Where the text contradicts itself or a decision changed later in the thread, the later statement wins. Record the contradiction as an open question rather than silently picking one side.

Where the text states something as decided but does not say what it means concretely, that is an open question, not a task.

## 3. Draft the breakdown

Write the result to `docs/simulations-react/specs/backlog.md`:

- **Source** — what the input was and where it came from, in one line.
- **Scope summary** — one paragraph on what the text is asking for, in your own words.
- **Already covered** — items in the text that exist in the codebase today, with file references. Excluded from the backlog.
- **Tasks** — a numbered table. For each: kebab-case name, one-line goal, dependencies (by number), rough size (S/M/L), and a short quote or pointer to the part of the input it came from.
- **Deferred / out of scope** — items too vague, too far out, or explicitly non-goals.
- **Open questions** — anything that can't be turned into a testable requirement until the user answers something.

Every task must trace back to something in the input. If a task is your inference rather than a stated requirement, mark it `[inferred]` in the table so the user can reject it.

Sizing rule: one task is one coherent, verifiable slice — roughly what one person finishes in a few days, with a clear done condition. Split anything larger. Merge anything that can't be shipped or verified independently.

Ordering rule: sort by dependency, then by what unblocks the most downstream work. State the reasoning in one line under the table.

## 4. Stop and get approval

Present the breakdown and ask the user to confirm before creating anything else. Do not generate specs in the same turn as the breakdown — a wrong split multiplied across fifteen folders is expensive to undo.

Ask explicitly:
- Is the granularity right?
- Any items to merge, split, drop, or reorder?
- Are the `[inferred]` items correct?
- Which items should be specced now, and which stay as backlog rows?

## 5. Generate the approved specs

For each item the user approves, follow the `spec-new` skill to create `docs/simulations-react/specs/<task-name>/`. Additionally:

- Add `Depends on: <task-name>` where the backlog records a dependency.
- Keep requirements scoped to that item only. If writing the spec reveals it's actually two tasks, stop, say so, and update the backlog instead of writing an oversized spec.
- Link each spec back to its backlog row, and mark the row with the spec path.

Set every generated spec to `Status: Draft`.

## 6. Finish

Report which specs were created, which backlog rows remain unspecced, and which open questions are still unanswered. Ask the user to review and approve the individual specs.

## Notes

- Never implement code under this skill, including scaffolding, config, or "just the types".
- If the input is too thin to decompose, say so directly and ask for what's missing rather than inventing a plausible-looking backlog. Padding a short input into ten tasks is worse than returning three.
- Re-running this skill with additional input should reconcile against the existing `backlog.md`: keep completed and in-progress rows, append new ones, and flag rows the new input contradicts.