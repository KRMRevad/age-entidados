# 🚀 N8N Webhook Integration — Setup & Test Guide

**Data:** 2026-02-28
**Status:** ✅ IMPLEMENTADO E PRONTO PARA TESTE
**Responsável:** @pm + @dev

---

## 📋 O que foi criado

### Backend (Express.js)
- ✅ **POST /api/webhook/n8n** — Recebe payloads do N8N
- ✅ **GET /api/webhook/n8n** — Lista todas as oportunidades recebidas
- ✅ **GET /api/webhook/n8n/hot** — Lista apenas oportunidades HOT (score >= 80)
- ✅ Salvamento automático em `data/n8n-opportunities.json`

### Frontend (Dashboard)
- ✅ **GET /dashboard-webhook** — Dashboard com polling em tempo real (a cada 5s)
- ✅ Atualização automática de contadores (HOT, WARM, COOL)
- ✅ Animação de "blink" para novos registros
- ✅ Status badge com pulsação ao vivo

---

## 🎯 Como Testar (passo a passo)

### 1️⃣ Iniciar o Backend

```bash
cd /Users/kreligar3vad/Documents/Workspace/apps/age
node src/backend/server.js
```

Esperado:
```
╔═══════════════════════════════════════════════════════╗
║ 🚀 ENTIDADOS AGE — Backend Running                    ║
╠═══════════════════════════════════════════════════════╣
║ Server: http://localhost:3000
║ API: http://localhost:3000/api/status
║ Dashboard: http://localhost:3000/dashboard-webhook
║ Mode: SURVIVAL (Brain-Muscle Orchestration)
╚═══════════════════════════════════════════════════════╝
```

### 2️⃣ Abrir o Dashboard

Abra em seu navegador:
```
http://localhost:3000/dashboard-webhook
```

Verá:
- ✅ Status badge "LIVE POLLING" piscando
- ✅ 4 cards de estatísticas (Total, HOT, WARM, COOL) com valor 0
- ✅ Mensagem "Aguardando oportunidades do N8N..."

### 3️⃣ Enviar Teste via CURL

Execute este comando para simular uma oportunidade do N8N:

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
    "description": "Desenvolver chatbot WhatsApp com integração OpenAI para atendimento automático"
  }'
```

Esperado:
```json
{
  "success": true,
  "message": "Oportunidade recebida e salva",
  "opportunity": {
    "id": "n8n-1234567890-abc123def",
    "timestamp": "2026-02-28T15:30:45.123Z",
    "platform": "workana",
    "title": "Bot WhatsApp com IA",
    "url": "https://www.workana.com/job/123456",
    "reward": "USD 500-1000",
    "effort_hours": 40,
    "tier": "hot",
    "score": 85,
    "description": "Desenvolver chatbot WhatsApp com integração OpenAI...",
    "status": "novo"
  },
  "totalCount": 1
}
```

### 4️⃣ Verificar no Dashboard

Volte ao navegador (sem recarregar!) e observe:
- ✅ O card "Total" mudará para 1
- ✅ O card "🔥 Hot" mudará para 1
- ✅ A oportunidade aparecerá na lista com animação de slide
- ✅ O card pisca (blink) por 0.6s indicando novo registro
- ✅ Status mostra "novo"
- ✅ Botões "Abrir" e "Copiar URL" disponíveis

### 5️⃣ Enviar Mais Testes (opcional)

Para testar múltiplas oportunidades:

```bash
# Oportunidade WARM
curl -X POST http://localhost:3000/api/webhook/n8n \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "freelas",
    "title": "Otimizar Landing Page",
    "url": "https://www.99freelas.com.br/job/999",
    "reward": "R$ 800",
    "effort_hours": 16,
    "tier": "warm",
    "score": 70,
    "description": "Melhorar conversão de landing page de e-commerce"
  }'

# Oportunidade COOL
curl -X POST http://localhost:3000/api/webhook/n8n \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "fiverr",
    "title": "Logo Design",
    "url": "https://www.fiverr.com/gigs/123",
    "reward": "USD 100",
    "effort_hours": 8,
    "tier": "cool",
    "score": 50,
    "description": "Criar logo para startup tech"
  }'
```

---

## 🔌 Como Integrar no N8N

### Via Webhook do N8N

1. **Na aba "Workflow" do N8N:**
   - Adicionar node "Webhook"
   - HTTP Method: **POST**
   - URL: `http://localhost:3000/api/webhook/n8n` (ajuste IP se necessário)

2. **No node anterior (ex: "Scrape Opportunities"):**
   - Mapear os campos:
     ```
     platform → platform
     title → title
     url → url
     reward → reward
     effort_hours → effort_hours
     tier → tier (hot/warm/cool)
     score → score (0-100)
     description → description (opcional)
     ```

3. **Testar com "Execute Workflow"**
   - Verificar resposta 201 (Created)
   - Conferir dashboard em tempo real

---

## 📊 Endpoints Disponíveis

### Receber Oportunidade
```
POST /api/webhook/n8n
Content-Type: application/json

{
  "platform": "workana",
  "title": "Título do Projeto",
  "url": "https://...",
  "reward": "USD 500",
  "effort_hours": 40,
  "tier": "hot|warm|cool",
  "score": 85,
  "description": "Descrição opcional"
}
```

**Resposta (201 Created):**
```json
{
  "success": true,
  "message": "Oportunidade recebida e salva",
  "opportunity": { ... },
  "totalCount": 1
}
```

---

### Listar Todas as Oportunidades
```
GET /api/webhook/n8n
```

**Resposta:**
```json
{
  "success": true,
  "stats": {
    "total": 10,
    "novo": 3,
    "processado": 5,
    "hot": 2,
    "warm": 4,
    "cool": 4
  },
  "opportunities": [
    { ... }
  ],
  "timestamp": "2026-02-28T15:30:45.123Z"
}
```

---

### Listar Apenas HOT
```
GET /api/webhook/n8n/hot
```

**Resposta:**
```json
{
  "success": true,
  "count": 2,
  "opportunities": [
    { tier: "hot", score: 85, ... },
    { tier: "hot", score: 92, ... }
  ],
  "timestamp": "2026-02-28T15:30:45.123Z"
}
```

---

## 🎬 Fluxo Completo (CEO → N8N → Backend → Dashboard)

```
1. CEO configura N8N com webhook
   ↓
2. N8N raspa oportunidades continuamente
   ↓
3. Quando encontra novo projeto, faz POST /api/webhook/n8n
   ↓
4. Backend salva em data/n8n-opportunities.json
   ↓
5. Dashboard faz polling a cada 5s
   ↓
6. CEO vê oportunidades em tempo real no dashboard
   ↓
7. CEO clica "Abrir" ou "Copiar URL"
   ↓
8. CEO envia proposta na plataforma (Workana, 99Freelas, etc)
```

---

## 📁 Arquivos Criados/Modificados

```
✅ src/backend/server.js
   → Adicionado POST /api/webhook/n8n
   → Adicionado GET /api/webhook/n8n
   → Adicionado GET /api/webhook/n8n/hot
   → Adicionado GET /dashboard-webhook

✅ dashboard-webhook.html (NOVO)
   → Dashboard com polling em tempo real
   → Animações de novo registro
   → Responsive design

✅ data/n8n-opportunities.json (NOVO)
   → Arquivo JSON local para persistência
   → Criado automaticamente se não existir
```

---

## ⚡ Próximos Passos

1. ✅ **Hoje:** CEO testa webhook com curl
2. ✅ **Hoje:** CEO configura N8N com webhook
3. 🔄 **Amanhã:** N8N começa a enviar oportunidades automaticamente
4. 📊 **Amanhã:** Dashboard exibe oportunidades em tempo real
5. 💰 **Dia seguinte:** CEO envia propostas para HOT opportunities

---

## 🛠️ Troubleshooting

### Dashboard não atualiza
- Verificar se server está rodando: `curl http://localhost:3000`
- Verificar console do navegador (F12 → Console)
- Verificar se o arquivo `data/n8n-opportunities.json` existe

### Webhook retorna erro 400
- Verificar se JSON está válido: `json_pp < file.json`
- Verificar se campos obrigatórios presentes: `title`, `url`
- Verificar headers: `Content-Type: application/json`

### Dados não persistem após reiniciar servidor
- Normal! O arquivo `data/n8n-opportunities.json` persiste
- Se não quer perder dados, usar Supabase (próxima fase)

---

## 📞 Suporte

Para qualquer dúvida:
- Verificar logs do servidor: `node src/backend/server.js` (vê logs em tempo real)
- Abrir DevTools do navegador (F12 → Network)
- Verificar `data/n8n-opportunities.json` diretamente

---

**Pronto para usar! 🚀**
