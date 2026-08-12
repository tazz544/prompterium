---
name: spec-driven
description: >-
  Spec-driven development — use docs/specs/ as source of truth,
  respect Status, and keep tasks.md in sync. Use when doing feature work in that area.
---

# Spec Driven Development

Feature specifications live in `docs/specs/<feature-name>/`. The `_template` folder sits directly under `docs/specs/`. Each spec folder contains:

- `spec.md` - requirements, acceptance criteria, and a `Status` field.
- `tasks.md` - ordered implementation checklist.

Prompterium templates for new specs (after sync): `.cursor/templates/spec.md` and `.cursor/templates/tasks.md`.

## Rules for the agent

1. Before starting feature work, check whether a matching spec exists under `docs/specs/`. If it does, treat it as the source of truth over chat history.
2. Never implement a spec whose `Status` is `Draft` or `Abandoned`. Ask the user to approve it first (set `Status: Approved`).
3. When implementing a spec, work through `tasks.md` top to bottom. Mark each task `[x]` in the file immediately after completing and verifying it. Set `Status: In progress` when starting and `Status: Done` when all tasks and acceptance criteria are met.
4. If implementation reveals that the spec is wrong or incomplete, stop, describe the conflict to the user, and update `spec.md` before continuing. Do not silently diverge from the spec.
5. Record non-obvious implementation decisions in the `Notes / Decisions` section of `tasks.md`.
6. When creating a new spec, copy `docs/specs/_template/` and follow its structure. Keep `spec.md` about the "what/why" and `tasks.md` about the "how".
7. Small bugfixes and trivial changes do not require a spec.
