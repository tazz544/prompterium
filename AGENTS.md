# Agents working in Prompterium

This repo is a **Cursor context library**, not an application. Read [README.md](README.md) for sync and layout.

## Conventions

- Put **shareable** skills, rules, hooks, and templates under **`catalog/`** only.
- Deploy with `npx prompterium sync <app>` (npm) or `./scripts/sync.sh <app>` (git checkout); commit `.cursor/` in the **app** repo, not here.
- Do **not** write to `~/.cursor/skills-cursor/` (Cursor-managed built-ins).
- v1 sync is additive: removing files from `catalog/` does not remove them from apps automatically.
- Keep changes minimal; match existing `SKILL.md` and `.mdc` frontmatter patterns.

This repo does **not** include a local `.cursor/` folder; consumer apps receive context via sync.
