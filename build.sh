#!/bin/bash
# Build script for sasha-portfolio
# Run from project root: bash build.sh

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "→ Installing frontend dependencies..."
cd "$PROJECT_ROOT/client-react"
npm install

echo "→ Building React app..."
npm run build

echo "→ Installing Python dependencies..."
cd "$PROJECT_ROOT/server-flask"
pip install -r requirements.txt

echo "✓ Build complete. Run with: cd server-flask && gunicorn --bind 0.0.0.0:5000 wsgi:app"
