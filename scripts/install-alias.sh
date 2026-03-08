#!/bin/bash
# Install shell alias for hot-monitor
# Usage: ./scripts/install-alias.sh

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Detect shell profile
if [ -f ~/.zshrc ]; then
    PROFILE=~/.zshrc
elif [ -f ~/.bashrc ]; then
    PROFILE=~/.bashrc
else
    echo "❌ No .zshrc or .bashrc found. Please add manually:"
    echo ""
    echo "alias hot-monitor='cd $REPO_ROOT && ./scripts/run-hot-monitor.sh'"
    echo "alias hot-watch='cd $REPO_ROOT && ./scripts/run-hot-monitor.sh --watch 30'"
    echo ""
    exit 1
fi

# Backup
cp "$PROFILE" "$PROFILE.backup"
echo "✅ Backed up $PROFILE → ${PROFILE}.backup"

# Add aliases (if not already present)
if ! grep -q "hot-monitor" "$PROFILE"; then
    cat >> "$PROFILE" << 'EOF'

# 🔥 age — HOT Proposals Monitor Aliases
alias hot-monitor='cd /Users/kreligar3vad/Documents/Workspace/apps/age && ./scripts/run-hot-monitor.sh'
alias hot-watch='cd /Users/kreligar3vad/Documents/Workspace/apps/age && ./scripts/run-hot-monitor.sh --watch 30'
EOF
    echo "✅ Aliases added to $PROFILE"
else
    echo "⚠️  Aliases already present in $PROFILE"
fi

# Reload shell
source "$PROFILE"
echo "✅ Shell profile reloaded"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Installation complete!"
echo ""
echo "You can now use:"
echo "  🔍 hot-monitor     (scan once)"
echo "  👁️  hot-watch      (continuous watch)"
echo ""
