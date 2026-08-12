---
name: spec-new
description: >-
  Create a new feature spec under docs/specs/ from the user's
  description. Do not implement code. Use when the user wants a new spec drafted.
disable-model-invocation: true
---

# Create a new feature spec

Create a new feature spec in `docs/specs/` based on the feature description provided by the user.

1. Derive a short kebab-case slug for the feature. Choose the folder prefix:
   - If the user or backlog already named the folder (e.g. `001-implement-auth` from `spec-split`), use that exact name.
   - Otherwise scan `docs/specs/` for existing spec folders matching `^\d{3}-`. Ignore `_template`, `backlog.md`, and non-spec paths. Take the highest three-digit prefix and add 1 (zero-padded to three digits). If none exist, start at `001`.
   - Create `docs/specs/<NNN-feature-slug>/` (e.g. `docs/specs/002-add-user-profile/`) by copying `docs/specs/_template/`, or seed from `.cursor/templates/spec.md` and `.cursor/templates/tasks.md` if no project template exists.
2. Fill in `spec.md`: summary, motivation, numbered testable requirements, out-of-scope list, high-level technical notes, and acceptance criteria. Set `Status: Draft` and today's date. Explore the relevant parts of the codebase first so the technical notes reference real modules, components, and APIs.
3. Draft `tasks.md` as an ordered checklist of small, verifiable tasks referencing concrete files.
4. Do NOT implement anything. Finish by asking the user to review the spec and approve it (change `Status` to `Approved`).

If the user's description is too vague to write testable requirements, list the open questions in the spec and ask the user to resolve them.
