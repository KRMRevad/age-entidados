# 🚀 N8N Webhook — Quick Test (Copy & Paste)

## Dashboard em Tempo Real
```
http://localhost:3000/dashboard-webhook
```

---

## Teste Rápido (CURL)

Cole este comando NO TERMINAL e pressione ENTER:

```bash
curl -X POST http://localhost:3000/api/webhook/n8n \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "workana",
    "title": "Bot WhatsApp com IA",
    "url": "https://www.workana.com/job/123456",
    "reward": "USD 500-1000",
    "effort_hours": 40,
    "tier": "hot",
    "score": 85,
    "description": "Desenvolver chatbot WhatsApp com integração OpenAI"
  }'
```

**Esperado:** Resposta com `"success": true` + `201 Created`

---

## O que deve acontecer no Dashboard

1. ✅ Card "🔥 Hot" muda de **0 → 1**
2. ✅ Card "Total" muda de **0 → 1**
3. ✅ Nova linha aparece com **animação de slide**
4. ✅ Linha **pisca** por 0.6s (blink)
5. ✅ Botões "🔗 Abrir" e "📋 Copiar URL" funcionam

**NÃO RECARREGUE A PÁGINA!** O polling automático (5s) atualiza sozinho.

---

## Múltiplos Testes

### Test 2: Opportunity WARM
```bash
curl -X POST http://localhost:3000/api/webhook/n8n \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "freelas",
    "title": "Otimizar Landing Page",
    "url": "https://www.99freelas.com.br/job/999",
    "reward": "R$ 800",
    "effort_hours": 16,
    "tier": "warm",
    "score": 70
  }'
```

### Test 3: Opportunity COOL
```bash
curl -X POST http://localhost:3000/api/webhook/n8n \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "fiverr",
    "title": "Logo Design",
    "url": "https://www.fiverr.com/gigs/123",
    "reward": "USD 100",
    "effort_hours": 8,
    "tier": "cool",
    "score": 50
  }'
```

---

## Parametros Disponíveis

| Campo | Tipo | Obrigatório | Exemplo |
|-------|------|-------------|---------|
| `platform` | string | ✅ | "workana", "freelas", "fiverr", "upwork" |
| `title` | string | ✅ | "Bot WhatsApp com IA" |
| `url` | string | ✅ | "https://www.workana.com/job/123" |
| `reward` | string | ✅ | "USD 500-1000" ou "R$ 2500" |
| `effort_hours` | number | ✅ | 40 |
| `tier` | string | ✅ | "hot", "warm", "cool" |
| `score` | number | ✅ | 85 (0-100) |
| `description` | string | ❌ | "Descrição opcional" |

---

## Endpoints da API

| Método | URL | Descrição |
|--------|-----|-----------|
| POST | `/api/webhook/n8n` | Receber oportunidade |
| GET | `/api/webhook/n8n` | Listar todas |
| GET | `/api/webhook/n8n/hot` | Apenas HOT (score >= 80) |

---

## Dashboard URLs

| URL | Descrição |
|-----|-----------|
| `http://localhost:3000/dashboard` | Dashboard original (estático) |
| `http://localhost:3000/dashboard-webhook` | **NOVO - Webhook em tempo real** ⭐ |
| `http://localhost:3000/api/status` | API (JSON) |

---

**Pronto para usar! 🎯**
