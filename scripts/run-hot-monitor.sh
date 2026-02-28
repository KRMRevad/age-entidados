#!/bin/bash
# 🔥 HOT PROPOSALS MONITOR LAUNCHER
# Usage: ./run-hot-monitor.sh [--watch] [interval_seconds]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

# Ensure Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.8+"
    exit 1
fi

echo "🔥 Entidados AGE — HOT Proposals Monitor"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Make script executable
chmod +x "$SCRIPT_DIR/monitor-hot-proposals.py"

# Run monitor
if [[ "$1" == "--watch" ]]; then
    INTERVAL=${2:-30}
    echo "👁️  WATCH MODE — Checking every ${INTERVAL}s for HOT projects (score > 80)"
    echo "📍 Press Ctrl+C to stop"
    echo ""
    python3 "$SCRIPT_DIR/monitor-hot-proposals.py" --watch "$INTERVAL"
else
    echo "📊 ONE-TIME SCAN — Looking for HOT projects (score > 80)..."
    echo ""
    python3 "$SCRIPT_DIR/monitor-hot-proposals.py"
    echo ""
    echo "💡 Tip: Use './scripts/run-hot-monitor.sh --watch 30' for continuous monitoring"
fi
