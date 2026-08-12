---
name: spec-new
description: >-
  Create a new feature spec under docs/specs/ from the user's
  description. Do not implement code. Use when the user wants a new spec drafted.
disable-model-invocation: true
---

# Create a new feature spec

Create a new feature spec in `docs/specs/` based on the feature description provided by the user.

1. Derive a short kebab-case feature name and create `docs/specs/<feature-name>/` by copying the structure of `docs/specs/_template/`, or seed from `.cursor/templates/spec.md` and `.cursor/templates/tasks.md` if no project template exists.
2. Fill in `spec.md`: summary, motivation, numbered testable requirements, out-of-scope list, high-level technical notes, and acceptance criteria. Set `Status: Draft` and today's date. Explore the relevant parts of the codebase first so the technical notes reference real modules, components, and APIs.
3. Draft `tasks.md` as an ordered checklist of small, verifiable tasks referencing concrete files.
4. Do NOT implement anything. Finish by asking the user to review the spec and approve it (change `Status` to `Approved`).

If the user's description is too vague to write testable requirements, list the open questions in the spec and ask the user to resolve them.
