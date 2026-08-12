---
name: spec-implement
description: >-
  Implement an approved feature spec from docs/specs/. Use when
  the user asks to implement a named spec or continue spec-based feature work.
---

# Implement an approved feature spec

Implement the feature spec indicated by the user (a folder in `docs/specs/`). If no spec was named, list available specs with their statuses and ask which one to implement.

1. Read `spec.md` and `tasks.md` fully before writing any code.
2. Verify `Status` is `Approved` (or `In progress` for resumed work). If it is `Draft`, stop and ask the user to approve the spec first.
3. Set `Status: In progress` in `spec.md`.
4. Execute `tasks.md` top to bottom. After completing and verifying each task, mark it `[x]` in the file before moving on.
5. Follow all repository rules (`agents-general.md`, `agents-react.md`, `.cursor/rules/`) while implementing.
6. If a task conflicts with the spec or the codebase, stop, explain the conflict, and update `spec.md` with the user before continuing.
7. When all tasks and acceptance criteria are done, run lint and relevant tests, complete the Verification checklist in `tasks.md`, and set `Status: Done`.
