#!/usr/bin/env bash
set -euo pipefail
mkdir -p content/adapters
rm -rf content/adapters/cloudinary
cp -R node_modules/ghost-storage-cloudinary content/adapters/cloudinary
