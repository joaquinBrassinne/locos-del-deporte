#!/usr/bin/env bash
cd "$(dirname "$0")/../playwright" || exit 1
npm install && npx playwright install chromium
npx playwright test "$@"
echo "Reporte: npx playwright show-report"
