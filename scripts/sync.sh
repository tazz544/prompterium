#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: sync.sh [--dry-run] TARGET

Copy Prompterium catalog/ into TARGET/.cursor/ (additive; no delete).

  TARGET  Path to an app repository (use . for this repo)

Examples:
  ./scripts/sync.sh /path/to/my-app
  ./scripts/sync.sh .
EOF
}

DRY_RUN=0
TARGET=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    -h | --help)
      usage
      exit 0
      ;;
    *)
      if [[ -n "$TARGET" ]]; then
        echo "error: unexpected argument: $1" >&2
        usage >&2
        exit 1
      fi
      TARGET="$1"
      shift
      ;;
  esac
done

if [[ -z "$TARGET" ]]; then
  echo "error: TARGET is required" >&2
  usage >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROMPTERIUM_ROOT="${PROMPTERIUM_ROOT:-$(cd "$SCRIPT_DIR/.." && pwd)}"
CATALOG="$PROMPTERIUM_ROOT/catalog"

if [[ ! -d "$CATALOG" ]]; then
  echo "error: catalog not found at $CATALOG" >&2
  exit 1
fi

if [[ ! -d "$TARGET" ]]; then
  echo "error: TARGET is not a directory: $TARGET" >&2
  exit 1
fi

TARGET="$(cd "$TARGET" && pwd)"
DEST="$TARGET/.cursor"
mkdir -p "$DEST"

copy_tree() {
  local src="$1"
  local dst="$2"
  shift 2
  local -a extra=("$@")

  if [[ ! -d "$src" ]]; then
    return 0
  fi

  mkdir -p "$dst"

  if command -v rsync >/dev/null 2>&1; then
    local -a rsync_args=(-a)
    if [[ $DRY_RUN -eq 1 ]]; then
      rsync_args+=(-n -v)
    fi
    if ((${#extra[@]} > 0)); then
      rsync "${rsync_args[@]}" "${extra[@]}" "$src/" "$dst/"
    else
      rsync "${rsync_args[@]}" "$src/" "$dst/"
    fi
  else
    if [[ $DRY_RUN -eq 1 ]]; then
      echo "[dry-run] would copy $src/ -> $dst/"
      return 0
    fi
    cp -R "$src/." "$dst/"
  fi
}

copy_file() {
  local src="$1"
  local dst="$2"

  if [[ ! -f "$src" ]]; then
    return 0
  fi

  if [[ $DRY_RUN -eq 1 ]]; then
    echo "[dry-run] would copy $src -> $dst"
    return 0
  fi

  mkdir -p "$(dirname "$dst")"
  cp "$src" "$dst"
}

SUBTREES=(skills rules commands templates)
copied=0

for subtree in "${SUBTREES[@]}"; do
  src="$CATALOG/$subtree"
  if [[ -d "$src" ]] && [[ -n "$(ls -A "$src" 2>/dev/null || true)" ]]; then
    copy_tree "$src" "$DEST/$subtree"
    echo "synced: catalog/$subtree -> .cursor/$subtree"
    copied=$((copied + 1))
  fi
done

HOOKS_SRC="$CATALOG/hooks"
if [[ -d "$HOOKS_SRC" ]]; then
  if command -v rsync >/dev/null 2>&1; then
    copy_tree "$HOOKS_SRC" "$DEST/hooks" --exclude hooks.json
  else
    if [[ $DRY_RUN -eq 0 ]]; then
      mkdir -p "$DEST/hooks"
      for f in "$HOOKS_SRC"/*; do
        [[ -e "$f" ]] || continue
        base="$(basename "$f")"
        [[ "$base" == "hooks.json" ]] && continue
        if [[ -f "$f" ]]; then
          cp "$f" "$DEST/hooks/$base"
        elif [[ -d "$f" ]]; then
          cp -R "$f" "$DEST/hooks/$base"
        fi
      done
    else
      echo "[dry-run] would copy $HOOKS_SRC/* (except hooks.json) -> $DEST/hooks/"
    fi
  fi
  echo "synced: catalog/hooks/* -> .cursor/hooks/ (except hooks.json)"

  copy_file "$HOOKS_SRC/hooks.json" "$DEST/hooks.json"
  if [[ -f "$HOOKS_SRC/hooks.json" ]]; then
    echo "synced: catalog/hooks/hooks.json -> .cursor/hooks.json"
  fi

  if [[ $DRY_RUN -eq 0 ]] && [[ -d "$DEST/hooks" ]]; then
    find "$DEST/hooks" -type f \( -name '*.sh' -o -name '*.bash' \) -exec chmod +x {} +
  fi

  copied=$((copied + 1))
fi

if [[ $copied -eq 0 ]]; then
  echo "warning: nothing to sync (catalog subtrees are empty or missing)" >&2
else
  echo "done: $DEST"
fi
