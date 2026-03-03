# ⚡ 10-Minute Quick Start

**Get your automation running in < 10 minutes.**

---

## ✅ Pre-requisites Checklist

- [ ] N8N running (self-hosted or cloud)
- [ ] Backend API running on port 3000
- [ ] OpenAI account OR Ollama running locally
- [ ] Workana/99Freelas credentials ready

---

## 🚀 Step 1: Add N8N Credentials (2 min)

Go to **N8N Dashboard → Credentials**

### Add OpenAI
```
Type: OpenAI
Name: "OpenAI-API-Key"
API Key: sk-xxxxx
Model: gpt-4-turbo
```

### Add Ollama (local option)
```
Type: OpenAI
Base URL: http://localhost:11434/v1
Model: mistral
```

---

## 📥 Step 2: Import Workflow (3 min)

In N8N: **Workflows → Import → n8n-workflow-example.json**

---

## 🔧 Step 3: Configure Webhook (2 min)

1. Copy Webhook URL from N8N
2. Add to Workana: Settings → Integrations → Webhook
3. Add to 99Freelas: Painel → API → Webhooks

---

## ✔️ Step 4: Test (2 min)

```bash
curl -X POST http://localhost:5678/webhook/webhook-xxxxx \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_001",
    "title": "Dev Test Job",
    "rewardMin": 500,
    "rewardMax": 2000,
    "skills": ["Node.js"]
  }'
```

---

## 🎯 Step 5: Activate! (0 min)

Toggle **Active** in N8N. Done! ✅

---

**Total time: ~10 minutes**

