#!/usr/bin/env bash
# TodoApp — Project Initialization Script
# Vanilla HTML/CSS/JS project — no dependencies to install.
# This script verifies the scaffold is intact and ready for development.

set -euo pipefail

echo "=== TodoApp Init ==="

# Verify required files exist
required_files=("index.html" "style.css" "app.js")
for f in "${required_files[@]}"; do
  if [ ! -f "$f" ]; then
    echo "ERROR: Missing required file: $f"
    exit 1
  fi
  echo "  ✓ $f"
done

echo ""
echo "No dependencies to install (vanilla HTML/CSS/JS)."
echo "To start development, run a local server:"
echo "  python3 -m http.server 8080"
echo ""
echo "=== Init complete ==="
exit 0
