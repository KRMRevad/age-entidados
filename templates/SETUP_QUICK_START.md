# ⚡ 10-Minute Quick Start

**Get your automation running in < 10 minutes.**

---

## ✅ Pre-requisites Checklist

```
[ ] N8N running (self-hosted or cloud)
    → Self-hosted: docker run -d --name n8n -p 5678:5678 n8nio/n8n
    → Cloud: Sign up at https://app.n8n.cloud

[ ] Backend API running on your server
    → Node.js + Express listening on port 3000
    → GET /api/status should return 200

[ ] OpenAI account OR Ollama running locally
    → OpenAI: Get API key from https://platform.openai.com/api-keys
    → Ollama: docker run -d -p 11434:11434 ollama/ollama

[ ] Your Workana/99Freelas credentials ready
```

---

## 🚀 Step 1: Add N8N Credentials (2 min)

Go to **N8N Dashboard → Credentials**

### 1a. Add OpenAI (if using cloud)
```
Type: OpenAI
Name: "OpenAI-API-Key"
API Key: sk-xxxxx (from https://platform.openai.com)
Model: gpt-4-turbo
```

### 1b. Add Ollama (if using local)
```
Type: OpenAI
Name: "Ollama-Local"
Base URL: http://localhost:11434/v1
API Key: sk-mock (can be anything)
Model: mistral (or llama2)
```

### 1c. Add HTTP credentials (Backend)
```
Type: Generic Credential
Name: "Backend-API"
URL: https://seu-dominio.com:3000
Authentication: None (if local, add Basic if needed)
```

---

## 📥 Step 2: Import Workflow (3 min)

### Option A: Upload JSON file
1. In N8N: **Workflows → Import**
2. Select `n8n-workflow-example.json`
3. Click **Import**

### Option B: Copy-paste JSON
1. New workflow
2. Editor → **JSON (Advanced)**
3. Paste content from `n8n-workflow-example.json`
4. Save as "Revenue Automation — Opportunity Monitor"

---

## 🔧 Step 3: Configure Workflow Nodes (3 min)

### Node 1: Webhook
1. Click webhook node
2. Copy the **Webhook URL**
3. Add to Workana/99Freelas webhook settings

**Workana:**
```
Settings → Integrations → Webhook
URL: [paste webhook URL]
Events: job.created, job.updated, proposal.invited
```

**99Freelas:**
```
Painel → API → Webhooks
POST: [paste webhook URL]
Events: nova_vaga, atualização
```

### Node 2: OpenAI/Ollama
1. Click "Generate Proposal with AI" node
2. Set **Credential** to "OpenAI-API-Key" or "Ollama-Local"
3. Check prompt matches your style

### Node 3: Backend HTTP
1. Click "POST Proposal to Backend"
2. Update **URL** to `https://seu-dominio.com/api/proposals`
3. Add body:
   ```json
   {
     "id": "{{$json.id}}",
     "content": "{{$json.proposalContent}}",
     "filename": "{{$json.filename}}"
   }
   ```

### Node 4: Slack (Optional)
1. Create Slack app: https://api.slack.com/apps
2. Get Bot Token
3. Add credential in N8N
4. Update channel to your #revenue channel

---

## ✔️ Step 4: Test (2 min)

### Test with Webhook
```bash
curl -X POST http://localhost:5678/webhook/webhook-xxxxx \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_001",
    "title": "Desenvolvedor Node.js",
    "platform": "Workana",
    "rewardMin": 500,
    "rewardMax": 2000,
    "deadline": "2026-03-10",
    "skills": ["Node.js", "PostgreSQL"],
    "url": "https://workana.com/job/test"
  }'
```

### Expected Response
```
✅ Proposal saved to backend
📧 Email notified CEO (if configured)
🔔 Slack message sent (if configured)
```

---

## 🎯 Step 5: Go Live (0 min)

Just activate your workflow!

1. **N8N Dashboard**
2. Find "Revenue Automation — Opportunity Monitor"
3. Toggle **Active** to ON
4. Done! ✅

---

## 📊 Verify It's Working

### Check N8N Logs
```
Workflow should show execution with green checkmarks:
[✓] Webhook triggered
[✓] Calculate Score & Tier
[✓] Log to Backend
[✓] Generate Proposal (OpenAI call)
[✓] POST to Backend
```

### Check Backend Logs
```bash
# Your server should show:
POST /api/proposals 200 OK
✅ Proposal saved: PROPOSAL-test_001-HOT.md
```

### Check File System
```bash
ls -la proposals/PROPOSAL-test_001-HOT.md
# Should exist with proposal content
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Webhook returns 404 | Verify webhook URL in N8N matches Workana settings |
| OpenAI call fails | Check API key is valid, has credits, rate limit not hit |
| File not saved | Verify backend `/proposals` directory exists, is writable |
| No Slack notification | Add Slack credential, update channel name |

---

## 🚀 What's Next?

### Immediate (Today)
- [ ] Test with 1 real job posting
- [ ] Adjust AI prompt for your style
- [ ] Save test proposal & review

### Week 1
- [ ] Wait for real webhook from Workana
- [ ] Monitor execution logs
- [ ] Collect feedback on proposal quality
- [ ] Adjust prompt if needed

### Week 2+
- [ ] Add Follow-up Scheduler workflow
- [ ] Add CRM Pipeline updater
- [ ] Integrate revenue logger
- [ ] Scale to multiple platforms

---

## 📞 Need Help?

1. **Email support:** reply to Gumroad purchase
2. **Discord community:** [Join here](https://discord.gg/xxx)
3. **Check troubleshooting:** See TROUBLESHOOTING.md
4. **Video walkthrough:** [YouTube unlisted](https://youtube.com/xxx)

---

## ⏱️ Timeline

```
⏱️  0-2 min:  Add credentials
⏱️  2-5 min:  Import workflow
⏱️  5-8 min:  Configure nodes
⏱️  8-10 min: Test & activate
```

**Total: ~10 minutes to your first automated proposal generation!** 🎉

---

**Status:** Ready to launch
**Last tested:** 2026-03-03
**Confidence:** ✅✅✅✅✅ (5/5)
