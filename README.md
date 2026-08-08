# Prompterium

Central library for Cursor **project** context: agent skills, rules, hooks, and templates. Prompterium holds the canonical copies; you **sync** them into any app repo’s `.cursor/` folder and commit there so your team gets the same prompts without cloning this repo.

## What goes where

| In Prompterium | After sync (in your app) | Loaded by Cursor? |
|----------------|--------------------------|-------------------|
| `catalog/skills/<name>/SKILL.md` | `.cursor/skills/<name>/` | Yes — agent skills |
| `catalog/rules/*.mdc` | `.cursor/rules/` | Yes — rules |
| `catalog/commands/*.md` | `.cursor/commands/` | Yes — slash commands (legacy) |
| `catalog/hooks/hooks.json`, `catalog/hooks/*` | `.cursor/hooks.json`, `.cursor/hooks/` | Yes — hooks |
| `catalog/templates/**` | `.cursor/templates/` | Only if referenced by a skill or rule |

Do not copy anything into `~/.cursor/skills-cursor/` — that directory is managed by Cursor.

Docs: [Skills](https://cursor.com/docs/context/skills), [Rules](https://cursor.com/docs/context/rules), [Hooks](https://cursor.com/docs/hooks).

## Repository layout

```
catalog/          # source of truth (shared library)
lib/              # sync implementation (Node)
bin/prompterium.js
scripts/sync.sh   # optional bash sync (same catalog layout)
package.json      # npm package
AGENTS.md         # conventions for agents working in this repo
```

See [catalog/README.md](catalog/README.md) for contribution conventions.

## Working in this repository

Prompterium has **no** `.cursor/` folder in the repo—only **`catalog/`** plus sync tooling. Edit the catalog here; run `./scripts/sync.sh` on **app** repos to install context. See [AGENTS.md](AGENTS.md) for agent conventions.

## Requirements

**From git:** macOS or Linux with **bash** and **rsync** (optional; Node sync below works cross-platform).

**From npm:** **Node.js 18+** only.

## Install as an npm package (recommended for apps)

In your **application** repository:

```bash
npm install -D prompterium
npx prompterium sync .
```

Add a script for repeat use:

```json
{
  "devDependencies": {
    "prompterium": "^0.1.0"
  },
  "scripts": {
    "cursor:sync": "prompterium sync ."
  }
}
```

Then:

```bash
npm run cursor:sync
git add .cursor && git commit -m "Sync Cursor context from Prompterium"
```

Bump the `prompterium` version in `package.json` when you want new skills or templates from the library.

### Publish to npm (maintainers)

1. Log in: `npm login`
2. If the name `prompterium` is taken, set a scoped name in `package.json`, e.g. `"name": "@your-scope/prompterium"`.
3. Bump version: `npm version patch`
4. Publish: `npm publish --access public` (required for scoped public packages)

The published tarball includes `catalog/`, `lib/`, and the `prompterium` CLI only—no postinstall hooks.

## Quick start (git clone)

1. Clone Prompterium (once, anywhere on your machine).
2. From Prompterium:

   ```bash
   chmod +x scripts/sync.sh
   ./scripts/sync.sh /path/to/your-app-repo
   ```

3. In the app repo, commit the updated `.cursor/`:

   ```bash
   cd /path/to/your-app-repo
   git add .cursor
   git commit -m "Sync Cursor context from Prompterium"
   ```

Teammates who clone the app get `.cursor/` automatically; they do not need Prompterium unless they want to run sync themselves.

## Day-to-day workflow

1. Add or edit content under `catalog/` in Prompterium; commit, push, and **`npm version patch`** + **`npm publish`** when sharing via npm.
2. In each app: update the `prompterium` devDependency (or re-run install at latest), then `npx prompterium sync .` (or `./scripts/sync.sh` if using a git checkout).
3. Commit `.cursor/` in each app repo.

## Adding a skill

1. Create `catalog/skills/my-skill/SKILL.md`.
2. Frontmatter (required):

   ```yaml
   ---
   name: my-skill
   description: One line — when the agent should use this skill.
   ---
   ```

3. Run sync, then commit in the target app.

Optional: `disable-model-invocation: true` for user-only slash-style workflows.

## Adding a rule

Add `catalog/rules/my-rule.mdc` with `description`, and either `alwaysApply: true` or `globs: **/*.ts`. Sync copies it to `.cursor/rules/`.

## Hooks

Put `hooks.json` and scripts under `catalog/hooks/`. Sync copies `hooks.json` to `.cursor/hooks.json` and scripts to `.cursor/hooks/`. **v1 overwrites** `.cursor/hooks.json` in the target app — keep shared hooks here; app-only hooks belong in the app repo outside Prompterium or wait for v2 merge support.

## Sync behavior (v1)

- **Additive / update:** files in the app’s `.cursor/` that are not in the catalog are left alone.
- **No prune:** deleting a skill from Prompterium does **not** remove it from an app until you delete it manually in the app (v2 may add `--delete` or a lockfile).
- **`--dry-run`:** shows what would copy without writing.

## Roadmap

- Manifest / profiles (`prompterium.yaml`) for per-app subsets
- Safe removal sync and `hooks.json` merge
- Validation script for SKILL frontmatter

## License

MIT
