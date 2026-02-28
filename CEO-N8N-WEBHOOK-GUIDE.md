# 🚀 CEO — N8N Webhook Integration (Ready to Use)

**Status:** ✅ PRONTO PARA USAR
**Data:** 2026-02-28
**Versão:** 1.0

---

## 📊 Resumo do que foi implementado

Seu servidor Express agora tem um **webhook pronto para receber oportunidades do N8N em tempo real**. Dashboard atualiza automaticamente a cada 5 segundos.

```
N8N Workflow → POST /api/webhook/n8n → Backend (Express) → data/n8n-opportunities.json
                                                              ↓
                                           Dashboard (polling 5s) → Visualização em Tempo Real
```

---

## 🎯 Próximos Passos (5 minutos)

### 1️⃣ Validar que servidor está rodando

```bash
curl http://localhost:3000
```

Esperado: Resposta com versão do app.

---

### 2️⃣ Testar Webhook (CURL para Copiar/Colar)

Copie e cole este comando **exatamente como está** no terminal:

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

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Oportunidade recebida e salva",
  "opportunity": { ... },
  "totalCount": 1
}
```

---

### 3️⃣ Abrir Dashboard em Tempo Real

Abra em seu navegador:
```
http://localhost:3000/dashboard-webhook
```

Você verá:
- ✅ Badge "LIVE POLLING" piscando
- ✅ Contador de oportunidades
- ✅ Lista de projetos com animação

**IMPORTANTE:** Não recarregue a página! O polling automático atualiza a cada 5 segundos.

---

### 4️⃣ Integrar N8N (Configuração)

#### No seu workflow N8N:

1. **Adicione um node "HTTP Request" (ou "Webhook"):**
   - Method: `POST`
   - URL: `http://localhost:3000/api/webhook/n8n`
   - Headers: `Content-Type: application/json`

2. **Mapeie os campos de saída do seu scraper para:**
   ```json
   {
     "platform": "workana",  // ou "freelas", "fiverr", "upwork", "other"
     "title": "Título do Projeto",
     "url": "https://www.workana.com/job/123",
     "reward": "USD 500",  // string com moeda
     "effort_hours": 40,   // número em horas
     "tier": "hot",        // "hot" | "warm" | "cool"
     "score": 85,          // número 0-100
     "description": "Descrição opcional"
   }
   ```

3. **Execute o workflow:**
   - Clique em "Execute Workflow"
   - Deve retornar HTTP 201 (Created)
   - Confira o dashboard em tempo real

---

## 📡 Endpoints Disponíveis

### Enviar Oportunidade
```
POST /api/webhook/n8n
Content-Type: application/json

{
  "platform": "workana|freelas|fiverr|upwork|other",
  "title": "Título do Projeto",
  "url": "https://...",
  "reward": "USD 500 ou R$ 2500",
  "effort_hours": 40,
  "tier": "hot|warm|cool",
  "score": 85,
  "description": "Descrição opcional"
}
```

**Resposta:** 201 Created + JSON

---

### Listar Todas (API)
```
GET /api/webhook/n8n
```

**Retorna:**
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
  "opportunities": [ ... ]
}
```

---

### Listar Apenas HOT (API)
```
GET /api/webhook/n8n/hot
```

**Retorna apenas score >= 80 ou tier == "hot"**

---

## 🖥️ Dashboard URL

**Dashboard em Tempo Real:**
```
http://localhost:3000/dashboard-webhook
```

**Funcionalidades:**
- ✅ Polling automático a cada 5s
- ✅ Contadores ao vivo (Total, HOT, WARM, COOL)
- ✅ Animação de novo registro (slide + blink)
- ✅ Botão "Abrir" (abre URL em nova aba)
- ✅ Botão "Copiar URL" (copia para clipboard)
- ✅ Status de cada oportunidade (novo, processado, etc)
- ✅ Timestamp de recebimento
- ✅ Responsive (funciona em mobile)

---

## 🧪 Exemplo Completo: Do N8N para o Dashboard

### Fluxo N8N (Pseudocódigo)

```javascript
// Node: "Scrape Workana"
const opportunities = [
  {
    title: "Bot WhatsApp com IA",
    url: "https://www.workana.com/job/123",
    reward: "USD 500-1000",
    effort_hours: 40,
    score: 85
  }
];

// Node: "HTTP Request (Webhook)"
POST http://localhost:3000/api/webhook/n8n
{
  platform: "workana",
  title: opportunities[0].title,
  url: opportunities[0].url,
  reward: opportunities[0].reward,
  effort_hours: opportunities[0].effort_hours,
  tier: opportunities[0].score >= 80 ? "hot" : "warm",
  score: opportunities[0].score,
  description: "..."
}

// Response: 201 Created
{
  "success": true,
  "opportunity": {
    "id": "n8n-1772297980520-j9qwld9np",
    "timestamp": "2026-02-28T16:59:40.520Z",
    "status": "novo",
    ...
  }
}
```

### O que aparece no Dashboard

**Imediatamente (sem recarregar):**
1. Card "HOT" muda de 0 → 1 ✅
2. Card "Total" muda de 0 → 1 ✅
3. Nova linha aparece com animação de slide ✅
4. Linha pisca (blink) por 0.6s ✅
5. Você pode clicar em "Abrir" ou "Copiar URL" ✅

---

## 💾 Persistência

**Dados salvos em:** `data/n8n-opportunities.json`

- ✅ Arquivo JSON local
- ✅ Persiste após reiniciar servidor
- ✅ Mantém últimos 100 registros (mais recentes primeiro)
- ✅ Criado automaticamente se não existir

```bash
# Ver dados salvos
cat data/n8n-opportunities.json | jq .
```

---

## 🔄 Workflow Recomendado

```
1. [HOJE] Teste webhook com curl (acima)
2. [HOJE] Configure N8N com novo endpoint
3. [HOJE] Execute workflow N8N 1x para validar
4. [AMANHÃ] Configure N8N para rodar a cada 30 min
5. [AMANHÃ] Monitore dashboard em tempo real
6. [AMANHÃ] CEO envia propostas para HOT opportunities
```

---

## ⚡ Performance

| Métrica | Valor |
|---------|-------|
| Latência Webhook | < 100ms |
| Polling Dashboard | 5 segundos |
| Limite de registros | 100 últimos |
| Tamanho arquivo JSON | ~100KB (100 registros) |
| Memória consumida | ~5-10MB |

---

## 🛠️ Troubleshooting

### Dashboard não atualiza
- [ ] Servidor está rodando? `ps aux | grep "node src/backend"`
- [ ] URL correta? `http://localhost:3000/dashboard-webhook`
- [ ] Console do navegador (F12) mostra erro? Anote e reporte
- [ ] Tente enviar novo webhook via curl

### Webhook retorna erro
```
400 Bad Request → Faltam campos obrigatórios: title, url
404 Not Found → Servidor não está rodando
500 Server Error → Veja logs do servidor
```

### Dados não aparecem
- [ ] Arquivo `data/n8n-opportunities.json` existe?
- [ ] Dashboard faz polling? (Veja Network no F12)
- [ ] Servidor reiniciou? Recarregue o dashboard

---

## 📞 Próximos Passos

**Depois que estiver funcionando:**

1. **[ ] Fase 2:** Integrar Supabase para persistência permanente
2. **[ ] Fase 3:** Auto-dispatch de propostas (n8n → Workana API)
3. **[ ] Fase 4:** ROI tracking por tier (hot/warm/cool)
4. **[ ] Fase 5:** AI proposal generator (automático)

---

## ✅ Checklist Final

- [ ] Servidor Express rodando em porta 3000
- [ ] Webhook testado com curl (201 Created)
- [ ] Dashboard abre sem erro
- [ ] Dashboard atualiza a cada 5s
- [ ] Novo registro anima e pisca
- [ ] Dados persistem em JSON
- [ ] N8N configurado (na sua máquina)
- [ ] Primeiro webhook do N8N testado

---

**Pronto para capturar oportunidades em tempo real! 🚀**

Dúvidas? Abra o DevTools (F12) e verifique a aba "Network" durante um webhook. Ou veja os logs do servidor.
