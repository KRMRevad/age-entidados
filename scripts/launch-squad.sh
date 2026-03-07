#!/bin/bash

# ==========================================
# ENTIDADOS AIOS - Squad Launcher (macOS)
# ==========================================

SQUAD=$1
PROJECT_DIR=$(pwd) # Or use absolute path if needed, but since it'll be called from Node, PWD should be project root

if [ -z "$SQUAD" ]; then
    echo "Erro: Forneça o nome do squad (ex: revenue, product, ux)"
    exit 1
fi

# Define commands for each squad based on the current context
if [ "$SQUAD" == "revenue" ]; then
    CMD="cd \\\"$PROJECT_DIR\\\" && claude -p \\\"Leia squads/squad-revenue.md e execute squads/agents/workflows/routine-morning-sync.md agora.\\\""
elif [ "$SQUAD" == "product" ]; then
    CMD="cd \\\"$PROJECT_DIR\\\" && claude -p \\\"Leia squads/squad-product.md. Verifique o Kanban e aguarde ordens.\\\""
elif [ "$SQUAD" == "ux" ]; then
    CMD="cd \\\"$PROJECT_DIR\\\" && claude -p \\\"Atue como ux-design-expert. Refine o dashboard e avalie rotina de brand monitoring.\\\""
else
    echo "Squad desconhecido: $SQUAD"
    exit 1
fi

# Use AppleScript to open a new Terminal window and run the command
osascript -e "tell application \"Terminal\"" \
          -e "do script \"$CMD\"" \
          -e "activate" \
          -e "end tell"

echo "Squad $SQUAD acionado via Terminal macOS."
