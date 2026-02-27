#!/bin/bash

# ============================================================
# REVENUE PIPELINE RUNNER — Brain-to-Muscle Orchestration
# ============================================================
# Synkra AIOS: Cérebro (Claude) → Músculo (Alienware)
# ============================================================

set -e

echo "🚀 Iniciando Revenue Pipeline (Scraper → Drafter → Radar)"
echo "========================================================"

# 1. CONFIGURAÇÃO
ALIENWARE_IP="${ALIENWARE_IP:-192.168.1.100}"
LLM_PORT="${LLM_PORT:-1234}"
WORK_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
DATA_DIR="$WORK_DIR/squads/nexus/data"

echo "📍 Configuração:"
echo "   Alienware IP: $ALIENWARE_IP"
echo "   LLM Port: $LLM_PORT"
echo "   Data Dir: $DATA_DIR"

# 2. VALIDAR CONEXÃO ALIENWARE
echo ""
echo "🔗 Validando conexão com Alienware..."
if curl -s -m 5 "http://$ALIENWARE_IP:$LLM_PORT/v1/models" > /dev/null 2>&1; then
    echo "✅ Alienware acessível em $ALIENWARE_IP:$LLM_PORT"
else
    echo "❌ Alienware NÃO acessível em $ALIENWARE_IP:$LLM_PORT"
    echo "   Verifique:"
    echo "   - LM Studio/Ollama rodando no Alienware"
    echo "   - Server ativado (porta $LLM_PORT)"
    echo "   - IP correto ($ALIENWARE_IP)"
    echo "   - Firewall/rede permite acesso"
    echo ""
    echo "   Para corrigir, rode:"
    echo "   export ALIENWARE_IP=<IP_CORRETO>"
    echo "   export LLM_PORT=<PORTA_CORRETA>"
    exit 1
fi

# 3. CRIAR DIRETÓRIO DE DADOS
mkdir -p "$DATA_DIR"

# 4. EXECUTAR SCRAPER (se necessário)
if [ ! -f "$DATA_DIR/raw_opportunities.json" ] || [ "$(date +%s -r "$DATA_DIR/raw_opportunities.json")" -lt "$(date -d '6 hours ago' +%s 2>/dev/null || date -v-6H +%s)" ]; then
    echo ""
    echo "📊 Executando Revenue Scraper..."
    cd "$WORK_DIR"
    python3 src/workers/revenue_scraper.py
    echo "✅ Scraper completo. $(jq 'length' squads/nexus/data/raw_opportunities.json) projetos coletados."
else
    echo ""
    echo "⏭️  Pulando scraper (dados atualizados < 6h)"
fi

# 5. EXECUTAR PROPOSAL DRAFTER
echo ""
echo "🧠 Executando Proposal Drafter (Brain → Muscle)..."
export ALIENWARE_IP
export LLM_PORT
cd "$WORK_DIR"
python3 src/workers/proposal_drafter.py

# 6. RESUMO FINAL
echo ""
echo "✅ Pipeline completo!"
echo ""
echo "📊 Radar de Oportunidades:"
if [ -f "$DATA_DIR/radar_opportunities.json" ]; then
    HOT_COUNT=$(jq '[.[] | select(.tier=="hot")] | length' "$DATA_DIR/radar_opportunities.json")
    WARM_COUNT=$(jq '[.[] | select(.tier=="warm")] | length' "$DATA_DIR/radar_opportunities.json")
    COOL_COUNT=$(jq '[.[] | select(.tier=="cool")] | length' "$DATA_DIR/radar_opportunities.json")
    TOTAL=$(jq 'length' "$DATA_DIR/radar_opportunities.json")

    echo "   🔥 Hot:   $HOT_COUNT projetos (score > 80)"
    echo "   🌡️  Warm:  $WARM_COUNT projetos (50-80)"
    echo "   ❄️  Cool:  $COOL_COUNT projetos (< 50)"
    echo "   📈 Total: $TOTAL projetos"
    echo ""
    echo "💡 Próximos Passos:"
    echo "   1. Revisar os projetos 'Hot' em: $DATA_DIR/radar_opportunities.json"
    echo "   2. Copiar proposal_draft para Workana"
    echo "   3. Enviar manualmente para forçar primeira receita"
    echo "   4. Monitorar responses em tempo real"
else
    echo "   ⚠️  radar_opportunities.json não encontrado"
fi

echo ""
echo "🧠 Cérebro está em standby. Músculo trabalhou bem! 💪"
