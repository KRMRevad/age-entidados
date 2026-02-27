# 🚀 Revenue Hunter — Checklist Executivo (24h)

**Status:** 🚨 SURVIVAL MODE | Alvo: R$ 50+ hoje
**Brain:** Claude Code | **Muscle:** Alienware LLM

---

## ✅ PHASE 1: Preparação Brain-Muscle (30 min)

### A. Descobrir IP Alienware
- [ ] **Opção 1:** Terminal Alienware → `ipconfig` (Win) ou `ifconfig` (Linux/Mac)
- [ ] **Opção 2:** Terminal Mac → `ping alienware.local`
- [ ] **Opção 3:** Roteador → 192.168.1.1 → Devices
- [ ] ✏️ **Anote o IP:** `192.168.x.x` → _________________

### B. Validar LLM no Alienware (5 min)
- [ ] Abrir **LM Studio** ou **Ollama** no Alienware
- [ ] **LM Studio:** Server ativo na porta 1234 (Settings → Network → Allow external)
- [ ] **Ollama:** `ollama serve --host 0.0.0.0:1234`
- [ ] Modelo carregado? (Mistral, Llama2, etc)

### C. Teste de Conectividade (10 min)
```bash
# No Mac, rode:
export ALIENWARE_IP="SEU_IP_AQUI"
export LLM_PORT="1234"

# Execute teste:
python3 src/workers/test_alienware_connection.py

# Resultado esperado:
# ✅ Servidor acessível!
# ✅ Modelos disponíveis: X
# ✅ Inferência bem-sucedida!
# ✅ TUDO OK!
```

---

## 🚀 PHASE 2: Executar Pipeline (5-10 min)

### A. Setup de Variáveis
```bash
# Terminal (Mac):
export ALIENWARE_IP="192.168.x.x"  # SEU IP
export LLM_PORT="1234"
```

### B. Rodar Pipeline Completo
```bash
cd /Users/kreligar3vad/Documents/Workspace/apps/Entidados\ AGE

# Opção 1: Script Wrapper (recomendado)
bash src/workers/run_revenue_pipeline.sh

# Opção 2: Direto com Python
python3 src/workers/proposal_drafter.py
```

### C. Validar Output
```bash
# Verifique se radar foi gerado:
ls -la squads/nexus/data/radar_opportunities.json

# Conte os projetos "Hot" (score > 80):
jq '[.[] | select(.tier=="hot")] | length' squads/nexus/data/radar_opportunities.json

# Veja um exemplo:
jq '.[0]' squads/nexus/data/radar_opportunities.json | head -20
```

---

## 💰 PHASE 3: Disparo Manual (30 min)

### A. Filtrar "Hot" Projects
```bash
# Extrair apenas hot projects:
jq '[.[] | select(.tier=="hot")]' squads/nexus/data/radar_opportunities.json > hot_proposals.json

# Ver quantos tem:
jq 'length' hot_proposals.json
```

### B. Copiar Proposals para Workana
1. [ ] Abrir Workana em browser
2. [ ] Para cada projeto em `hot_proposals.json`:
   - [ ] Ir para projeto no Workana
   - [ ] Copiar `proposal_draft` do JSON
   - [ ] Colar no campo de proposta
   - [ ] Enviar
3. [ ] **Meta:** 3-5 propostas em 30 min

### C. Repetir em 99Freelas (opcional)
- [ ] Mesma estratégia que Workana
- [ ] Projects com "warm" tier também são bons targets

---

## 📊 PHASE 4: Monitoramento (Contínuo)

### A. Respostas em Tempo Real
```bash
# Checklist de respostas (fazer a cada 1-2 horas):
# 1. Visite seu email (notificações de respostas)
# 2. Acesse Workana → Propostas enviadas
# 3. Procure por:
#    - "Aceitei sua proposta" = 🎉 DEAL
#    - "Preciso de mais info" = Responda ASAP
#    - "Já contratei outro" = Move on
```

### B. Rastrear ROI
```bash
# Quando vencer um contrato:
# - Aumente confiança no score daquele tier
# - Otimize prompts no proposal_drafter.py
# - Priorize projetos similares
```

---

## 🔄 PHASE 5: Automação 4x/dia (Próximas 48h)

### A. Agendador via Cron (Mac/Linux)
```bash
# Editar crontab:
crontab -e

# Adicionar (roda 6h, 12h, 18h, 00h):
0 6,12,18,0 * * * export ALIENWARE_IP="192.168.x.x" && bash /caminho/completo/src/workers/run_revenue_pipeline.sh >> /tmp/revenue.log 2>&1

# Verificar logs:
tail -f /tmp/revenue.log
```

### B. N8N Webhook (Futuro — Fase 3)
- [ ] (Aguardando integração n8n)
- [ ] Auto-dispatch de hot projects
- [ ] Tracking em Supabase

---

## 🆘 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| "Connection refused" | Verifique IP + LLM está rodando |
| "Timeout" | LLM está lento? Tente aumentar timeout em proposal_drafter.py |
| "Invalid JSON" | Modelo não está respondendo JSON. Teste manualmente: `curl http://IP:1234/v1/models` |
| "Nenhum projeto Hot" | Normal. Ajuste threshold em proposal_drafter.py ou mude modelo |
| "Não consigo achar IP" | Terminal: `arp -a` (Mac) ou `ipconfig /all` (Win) |

---

## 📈 Métricas de Sucesso

| Métrica | Target | Atual |
|---------|--------|-------|
| Projetos avaliados/dia | 10+ | ⏳ |
| Taxa "Hot" (score > 80) | 30%+ | ⏳ |
| Propostas disparadas/dia | 5-10 | ⏳ |
| Taxa resposta (24h) | 20%+ | ⏳ |
| Contratos fechados (7 dias) | 1-2 (R$ 200-1000) | ⏳ |

---

## 🎯 Próximos Passos (After Receita > R$ 500)

1. **Completar n8n integration** (auto-dispatch)
2. **Retomar Story 1.0.2** (RLS Policies)
3. **Retomar Story 1.0.3** (API Layer)
4. **Implementar OpenClaw** (agendador autônomo)

---

## 📞 Suporte Rápido

**Seu IP do Alienware é:** ___________________

**Porta do LLM:** 1234

**Modelo LLM carregado:** ___________________

**Data/Hora de início:** ___________________

---

**Status:** 🚨 SURVIVAL MODE ACTIVE
**Goal:** R$ 50+ nas próximas 24h
**Brain:** Ready to guide you
**Muscle:** Waiting for activation

**Vamos lá! 💪**
