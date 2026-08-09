#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolvePackageRoot, syncCatalog } from "../lib/sync.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = resolvePackageRoot(__dirname);

function printHelp(): void {
  console.log(`Usage: prompterium sync [options] [TARGET]

Copy package catalog/ into TARGET/.cursor/ (additive; no delete).

  TARGET   App repository path (default: current working directory)

Options:
  --dry-run   Show what would be copied without writing
  -h, --help  Show this help

Examples:
  prompterium sync
  prompterium sync /path/to/my-app
  prompterium sync --dry-run .
`);
}

type ParsedArgs = { command: "help" } | { command: "sync"; dryRun: boolean; target: string };

function parseArgs(argv: string[]): ParsedArgs {
  const args = argv.slice(2);
  let dryRun = false;
  let target = process.cwd();

  if (args.length === 0) {
    return { command: "sync", dryRun, target };
  }

  const first = args[0];
  if (first === "-h" || first === "--help") {
    return { command: "help" };
  }

  if (first === "sync") {
    args.shift();
  } else if (first.startsWith("-")) {
    /* default sync command */
  } else if (first !== "sync") {
    console.error(`error: unknown command: ${first}`);
    printHelp();
    process.exit(1);
  }

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--dry-run") {
      dryRun = true;
    } else if (a === "-h" || a === "--help") {
      return { command: "help" };
    } else if (!a.startsWith("-")) {
      target = a;
    } else {
      console.error(`error: unknown option: ${a}`);
      process.exit(1);
    }
  }

  return { command: "sync", dryRun, target: path.resolve(target) };
}

async function main(): Promise<void> {
  const parsed = parseArgs(process.argv);

  if (parsed.command === "help") {
    printHelp();
    process.exit(0);
  }

  try {
    await syncCatalog(packageRoot, parsed.target, { dryRun: parsed.dryRun });
  } catch (err) {
    console.error(`error: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }
}

main();
