import fs from "node:fs/promises";
import path from "node:path";

const SUBTREES = ["skills", "rules", "commands", "templates"];

/**
 * @param {string} packageRoot - directory containing catalog/
 * @param {string} targetDir - app repository root
 * @param {{ dryRun?: boolean }} [options]
 */
export async function syncCatalog(packageRoot, targetDir, options = {}) {
  const dryRun = options.dryRun ?? false;
  const catalog = path.join(packageRoot, "catalog");
  const dest = path.join(targetDir, ".cursor");

  try {
    await fs.access(catalog);
  } catch {
    throw new Error(`catalog not found at ${catalog}`);
  }

  const stat = await fs.stat(targetDir);
  if (!stat.isDirectory()) {
    throw new Error(`TARGET is not a directory: ${targetDir}`);
  }

  targetDir = path.resolve(targetDir);
  const destResolved = path.join(targetDir, ".cursor");

  let copied = 0;
  const log = (msg) => console.log(msg);

  for (const subtree of SUBTREES) {
    const src = path.join(catalog, subtree);
    if (!(await dirHasEntries(src))) continue;
    const dst = path.join(destResolved, subtree);
    if (dryRun) {
      log(`[dry-run] would sync catalog/${subtree} -> .cursor/${subtree}`);
    } else {
      await fs.mkdir(dst, { recursive: true });
      await copyDirContents(src, dst);
      log(`synced: catalog/${subtree} -> .cursor/${subtree}`);
    }
    copied++;
  }

  const hooksSrc = path.join(catalog, "hooks");
  if (await dirHasEntries(hooksSrc)) {
    const hooksDst = path.join(destResolved, "hooks");
    if (dryRun) {
      log("[dry-run] would sync catalog/hooks -> .cursor/hooks (except hooks.json at root)");
      const hooksJson = path.join(hooksSrc, "hooks.json");
      try {
        await fs.access(hooksJson);
        log("[dry-run] would copy catalog/hooks/hooks.json -> .cursor/hooks.json");
      } catch {
        /* no hooks.json */
      }
    } else {
      await fs.mkdir(hooksDst, { recursive: true });
      const entries = await fs.readdir(hooksSrc, { withFileTypes: true });
      for (const ent of entries) {
        if (ent.name === "hooks.json") continue;
        const from = path.join(hooksSrc, ent.name);
        const to = path.join(hooksDst, ent.name);
        if (ent.isDirectory()) {
          await fs.cp(from, to, { recursive: true });
        } else {
          await fs.copyFile(from, to);
          if (ent.name.endsWith(".sh") || ent.name.endsWith(".bash")) {
            await fs.chmod(to, 0o755);
          }
        }
      }
      log("synced: catalog/hooks/* -> .cursor/hooks/ (except hooks.json)");

      const hooksJson = path.join(hooksSrc, "hooks.json");
      try {
        await fs.access(hooksJson);
        await fs.copyFile(hooksJson, path.join(destResolved, "hooks.json"));
        log("synced: catalog/hooks/hooks.json -> .cursor/hooks.json");
      } catch {
        /* optional */
      }
    }
    copied++;
  }

  if (copied === 0) {
    console.warn("warning: nothing to sync (catalog subtrees are empty or missing)");
  } else if (!dryRun) {
    log(`done: ${destResolved}`);
  }

  return { dest: destResolved, copied };
}

/** @returns {string} absolute package root (contains catalog/) */
export function resolvePackageRoot(fromDir) {
  return path.resolve(fromDir, "..");
}

async function dirHasEntries(dir) {
  try {
    const entries = await fs.readdir(dir);
    return entries.length > 0;
  } catch {
    return false;
  }
}

async function copyDirContents(src, dst) {
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const ent of entries) {
    const from = path.join(src, ent.name);
    const to = path.join(dst, ent.name);
    if (ent.isDirectory()) {
      await fs.mkdir(to, { recursive: true });
      await copyDirContents(from, to);
    } else {
      await fs.copyFile(from, to);
    }
  }
}
