#!/usr/bin/env bash
set -euo pipefail

themes=(casper lyra)

# ensure destination exists
mkdir -p content/themes

# copy themes from node_modules → content/themes
for theme in "${themes[@]}"; do
  rm -rf "content/themes/$theme"
  cp -R "node_modules/$theme" "content/themes/$theme"
done

# alias "source" → casper so Ghost boots if DB expects "source"
if [ -d "content/themes/casper" ]; then
  rm -rf "content/themes/source"
  cp -R "content/themes/casper" "content/themes/source"
fi
