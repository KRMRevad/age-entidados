#!/bin/bash

# ==========================================
# ◬ ENTIDADOS AGE - SQUAD BOOTSTRAPPER ◬
# ==========================================
# Este script inicia os Múltiplos Esquadrões (Squads)
# do Ecossistema em janelas separadas do Terminal.
# Ideal para inicialização rápida após reboots.

echo "🌌 Inicializando o Mosaico Infinito..."

WORKSPACE_DIR="/Users/kreligar3vad/Documents/Workspace/apps/Entidados AGE"

# SQUAD 1: Engenharia e Estratégia
echo "Iniciando SQUAD 1 (ENG/CORE)..."
osascript -e "tell app \"Terminal\"
    do script \"cd '$WORKSPACE_DIR' && clear && echo '🔥 SQUAD 1 (ENG/CORE) INICIADO' && echo 'Missão: Manter APIs, Scrapers e Infraestrutura.' && claude\"
end tell"

# SQUAD 2: UX, Dashboards e Conversão
echo "Iniciando SQUAD 2 (UX/FRONT)..."
osascript -e "tell app \"Terminal\"
    do script \"cd '$WORKSPACE_DIR' && clear && echo '✨ SQUAD 2 (UX/FRONT) INICIADO' && echo 'Missão: Refinar Dashboard, Design e Geração de Propostas B2B.' && claude\"
end tell"

echo "✅ Squads despachados. A prosperidade não dorme."
