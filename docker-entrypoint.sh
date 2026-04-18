#!/bin/sh
set -e

# Fix Turbopack external module symlinks.
# During build on Windows, Turbopack creates symlinks like pg-<hash> pointing to
# absolute Windows paths. Re-create them pointing to standalone's node_modules.
if [ -d ".next/node_modules" ]; then
  rm -rf .next/node_modules
fi
mkdir -p .next/node_modules
for dir in node_modules/pg*; do
  [ -d "$dir" ] || continue
  pkg=$(basename "$dir")
  ln -sf "../../node_modules/$pkg" ".next/node_modules/$pkg"
done
# Also create hashed aliases by scanning server chunks for pg-<hash> references
for ref in $(grep -roh 'pg-[0-9a-f]\{16\}' .next/server/chunks/ 2>/dev/null | sort -u); do
  [ ! -e ".next/node_modules/$ref" ] && ln -sf "../../node_modules/pg" ".next/node_modules/$ref"
done

echo "Starting application..."
exec node server.js
