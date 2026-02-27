# 🧠→💪 Integração Brain-Muscle: Claude + Alienware

## Visão Geral

**Brain (Claude Code)** orquestra `proposal_drafter.py` que chama **Muscle (Alienware LLM local)** para avaliar projetos e gerar propostas de receita em **TEMPO REAL, SEM CUSTO**.

---

## Pré-requisitos

### No Alienware (Muscle):
1. **LM Studio** OU **Ollama** rodando
2. Modelo de LLM carregado (ex: Mistral, Llama2, etc)
3. Server ativo na porta `1234` (ou configurável)
4. Firewall permite conexões da rede local

### No Mac (Brain):
1. Python 3.8+
2. Dependências: `json`, `urllib` (stdlib)
3. IP do Alienware na rede local
4. Variáveis de ambiente

---

## Passo 1: Descobrir IP do Alienware

### Opção A: Via ifconfig (Alienware)
```bash
# No Alienware, abra terminal e rode:
ipconfig (Windows) ou ifconfig (Linux/Mac)

# Procure por algo como:
# IPv4 Address: 192.168.1.100
# ou 10.0.0.x
```

### Opção B: Via Network Scanner
```bash
# No Mac, use:
ping alienware.local

# Ou escaneie a rede:
nmap -sn 192.168.1.0/24 | grep -i alienware
```

### Opção C: No roteador
- Acesse 192.168.1.1 (ou IP do seu roteador)
- Procure "Devices" ou "Connected Devices"
- Encontre Alienware na lista

**⚠️ Anote o IP! Você vai precisar.**

---

## Passo 2: Configurar LM Studio / Ollama no Alienware

### LM Studio:
1. Abra LM Studio no Alienware
2. Selecione um modelo (ex: Mistral 7B, Llama2)
3. Clique em **"Server"** na barra lateral esquerda
4. Certifique-se de que está com status **"Running"**
5. Nota a porta (default: `1234`)
6. **Importante:** Em Settings → "Network", marque "Allow connections from network"

### Ollama:
1. Abra Ollama no Alienware
2. Carregue um modelo: `ollama pull mistral`
3. Inicie o server: `ollama serve --host 0.0.0.0:1234`
4. Teste: `curl http://localhost:1234/v1/models`

---

## Passo 3: Testar Conectividade (Mac → Alienware)

```bash
# Substitua ALIENWARE_IP pelo IP real
ALIENWARE_IP="192.168.1.100"
LLM_PORT="1234"

# Teste básico:
curl -X GET "http://$ALIENWARE_IP:$LLM_PORT/v1/models"

# Deve retornar algo como:
# {"object":"list","data":[{"id":"mistral:latest","object":"model"}]}
```

Se retornar erro, verifique:
- IP está correto?
- LM Studio/Ollama está rodando?
- Firewall permite tráfego na porta 1234?
- Rede local permite comunicação?

---

## Passo 4: Configurar Variáveis de Ambiente

### Opção A: .env (Recomendado)
```bash
# Edite ~/.env ou .env.local no projeto:
export ALIENWARE_IP="192.168.1.100"
export LLM_PORT="1234"
```

### Opção B: Linha de Comando
```bash
export ALIENWARE_IP="192.168.1.100"
export LLM_PORT="1234"
python3 src/workers/proposal_drafter.py
```

### Opção C: Hardcode no Script
Edite `src/workers/proposal_drafter.py`, linha ~40:
```python
ALIENWARE_IP = "192.168.1.100"  # Seu IP real
LLM_PORT = "1234"
```

---

## Passo 5: Executar o Pipeline

### Execução Manual:
```bash
cd /path/to/Entidados-AGE

# Com variáveis de ambiente:
export ALIENWARE_IP="192.168.1.100"
export LLM_PORT="1234"

# Rodar script wrapper (recomendado):
bash src/workers/run_revenue_pipeline.sh

# Ou rodar diretamente:
python3 src/workers/proposal_drafter.py
```

### Execução Automatizada (4x/dia):
Use `cron` (Mac/Linux) ou Task Scheduler (Windows):

```bash
# No Mac, edite crontab:
crontab -e

# Adicione (roda 6h, 12h, 18h, 00h):
0 6,12,18,0 * * * export ALIENWARE_IP="192.168.1.100" && bash /path/to/run_revenue_pipeline.sh >> /tmp/revenue.log 2>&1
```

---

## Passo 6: Verificar Output

Após rodar, verifique:

```bash
# Ver projetos coletados:
jq '.[0:2]' squads/nexus/data/raw_opportunities.json

# Ver projetos avaliados com scores:
jq '.[0:2]' squads/nexus/data/radar_opportunities.json

# Contar projetos "Hot" (score > 80):
jq '[.[] | select(.tier=="hot")] | length' squads/nexus/data/radar_opportunities.json
```

---

## Solução de Problemas

### ❌ "Connection refused"
```
❌ Falha ao conectar ao LLM local em http://192.168.1.100:1234/v1/chat/completions
```
**Solução:**
- Verifique se LM Studio/Ollama está rodando no Alienware
- Confirme o IP com `ping alienware.local`
- Teste manualmente: `curl http://$ALIENWARE_IP:1234/v1/models`

### ❌ "Timeout"
```
Timeout ao conectar
```
**Solução:**
- IP está correto?
- Firewall está bloqueando a porta 1234?
- Rede permite tráfego entre Mac e Alienware?
- Tente aumentar timeout em `proposal_drafter.py`, linha ~25: `timeout=60`

### ❌ "Invalid JSON response"
```
Resposta inesperada do LLM local
```
**Solução:**
- Modelo no LM Studio/Ollama está correto?
- Tente este prompt manualmente:
```bash
curl -X POST "http://192.168.1.100:1234/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "local-model",
    "messages": [{"role": "user", "content": "Say hello"}],
    "max_tokens": 100
  }'
```

### ⚠️ "LLM local indisponível. Tentando OpenRouter..."
**Solução:**
- Isso é NORMAL se Alienware estiver offline
- Sistema faz fallback automático para OpenRouter
- Garanta que OPENROUTER_API_KEY está preenchido como fallback

---

## Fluxo de Dados

```
1. SCRAPER (revenue_scraper.py)
   ↓
   squads/nexus/data/raw_opportunities.json (9 projetos brutos)

2. DRAFTER + LLM LOCAL (proposal_drafter.py → Alienware)
   ↓
   squads/nexus/data/radar_opportunities.json (com scores + proposals)

3. FILTER HOT (score > 80)
   ↓
   Propostas prontas para disparo em Workana/99Freelas

4. WEBHOOK N8N (futuro)
   ↓
   Disparo automático + Tracking Supabase
```

---

## Métricas de Sucesso

| Métrica | Target | Status |
|---------|--------|--------|
| Projetos coletados/dia | 20+ | ⏳ |
| Taxa de avaliação | 100% (sem fails) | ⏳ |
| Projetos "Hot" | 5+ (score > 80) | ⏳ |
| Tempo drafter | < 2 min/projeto | ⏳ |
| Custo LLM | R$ 0 (local) | ✅ |

---

## Próximas Fases

### Fase 3: Integração n8n
- Webhook para ler radar_opportunities.json
- Auto-disparo em Workana/99Freelas
- Tracking de responses

### Fase 4: Monitoramento Real-Time
- Dashboard de propostas + responses
- Cálculo ROI por tier
- Otimização de prompts baseada em dados

### Fase 5: OpenClaw (Futuro)
- Agendador autônomo no Alienware
- Executar pipeline sem intervenção
- Brain apenas monitora resultados

---

## Suporte

Se tiver problemas:
1. Verifique logs: `tail -f /tmp/revenue.log`
2. Teste conectividade: `curl http://$ALIENWARE_IP:1234/v1/models`
3. Valide JSON: `jq . squads/nexus/data/raw_opportunities.json`
4. Revise este guia: procure a seção de "Solução de Problemas"

---

**Status: READY FOR MUSCLE ACTIVATION** 💪
