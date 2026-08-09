export { syncCatalog, resolvePackageRoot } from "./sync.js";
export type { SyncOptions, SyncResult } from "./sync.js";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Absolute path to the bundled catalog/ directory. */
export const catalogRoot = path.join(__dirname, "..", "..", "catalog");
