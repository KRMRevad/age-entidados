# API V2 Reference — 7 Advanced Backend Features

**Version:** 2.0.0
**Last Updated:** 2026-02-28
**Status:** ✅ LIVE

---

## Overview

This document describes the 7 new advanced features added to the age backend:

1. **GET /api/proposals** — List all generated proposals
2. **POST /api/opportunities/:id/kanban** — Move opportunities through CRM pipeline
3. **GET /api/analytics/pipeline** — Full funnel analytics
4. **POST /api/webhook/n8n/batch** — Batch webhook ingestion
5. **GET /api/health/detailed** — Detailed system status
6. **GET /api/agent-status** — Active agents listing
7. **POST /api/followups** — Schedule follow-ups

---

## Feature 1: List All Proposals

### GET /api/proposals

**Description:** Lists all markdown proposals in `proposals/` directory with metadata.

**Response:**
```json
{
  "success": true,
  "proposals": [
    {
      "id": "wkn_919751634",
      "filename": "PROPOSAL-wkn_919751634-HOT.md",
      "title": "DETRAN RS — PHP/Symfony Backend",
      "tier": "hot",
      "score": 85,
      "timestamp": "2026-02-27T15:30:45.123Z"
    }
  ],
  "count": 3,
  "timestamp": "2026-02-28T10:00:00.000Z"
}
```

**Test Command:**
```bash
curl -X GET http://localhost:3000/api/proposals \
  -H "Content-Type: application/json"
```

**Dashboard Integration:**
```javascript
// Fetch proposals for "Propostas Geradas" section
const response = await fetch('/api/proposals');
const data = await response.json();
data.proposals.forEach(prop => {
  console.log(`${prop.title} (${prop.tier}) — Score: ${prop.score}`);
});
```

---

## Feature 2: Move Opportunities in CRM Pipeline

### POST /api/opportunities/:id/kanban

**Description:** Move an opportunity through the CRM pipeline stages. When status is `paid`, automatically registers revenue in financial log.

**Valid Statuses:**
- `lead` — Initial lead
- `sent` — Proposal sent
- `negotiation` — Negotiating terms
- `hired` — Contract signed
- `delivered` — Work completed
- `paid` — Payment received (triggers revenue logging)
- `lost` — Lost opportunity

**Request Body:**
```json
{
  "status": "paid"
}
```

**Response:**
```json
{
  "success": true,
  "opportunity": {
    "id": "proj-12345",
    "title": "DETRAN RS Backend Development",
    "platform": "workana",
    "reward": "3000",
    "status": "paid",
    "updatedAt": "2026-02-28T10:05:00.000Z"
  },
  "message": "Oportunidade movida para 'paid'",
  "timestamp": "2026-02-28T10:05:00.000Z"
}
```

**Test Command:**
```bash
# Move opportunity to sent
curl -X POST http://localhost:3000/api/opportunities/proj-12345/kanban \
  -H "Content-Type: application/json" \
  -d '{
    "status": "sent"
  }'

# Move opportunity to paid (triggers revenue logging)
curl -X POST http://localhost:3000/api/opportunities/proj-12345/kanban \
  -H "Content-Type: application/json" \
  -d '{
    "status": "paid"
  }'
```

**What Happens When Status = "paid":**
1. Extracts reward amount from opportunity
2. Creates entry in `data/financial-log.json`
3. Logs: `💰 Receita registrada: DETRAN RS (3000)`
4. Updates CRM pipeline

---

## Feature 3: Pipeline Analytics

### GET /api/analytics/pipeline

**Description:** Returns comprehensive funnel analytics including conversion rates, pipeline value, distribution by tier/platform/status.

**Response:**
```json
{
  "success": true,
  "pipeline": {
    "total_opportunities": 47,
    "total_proposals": 3,
    "conversion_scraped_to_proposal": "6.38%",
    "pipeline_value": 125000,
    "total_revenue_realized": 3000
  },
  "distribution": {
    "tiers": {
      "hot": 2,
      "warm": 8,
      "cool": 37
    },
    "statuses": {
      "lead": 2,
      "sent": 1,
      "negotiation": 0,
      "hired": 0,
      "delivered": 0,
      "paid": 1,
      "lost": 0
    },
    "platforms": {
      "workana": 25,
      "freelas": 15,
      "fiverr": 5,
      "upwork": 2
    }
  },
  "metrics": {
    "avg_score": 62,
    "total_effort_hours": 1250
  },
  "timestamp": "2026-02-28T10:00:00.000Z"
}
```

**Test Command:**
```bash
curl -X GET http://localhost:3000/api/analytics/pipeline \
  -H "Content-Type: application/json"
```

**Dashboard Integration:**
```javascript
// Fetch pipeline analytics for dashboard visualization
const response = await fetch('/api/analytics/pipeline');
const analytics = await response.json();

console.log(`Conversion Rate: ${analytics.pipeline.conversion_scraped_to_proposal}`);
console.log(`Pipeline Value: R$ ${analytics.pipeline.pipeline_value}`);
console.log(`Revenue Realized: R$ ${analytics.pipeline.total_revenue_realized}`);
```

---

## Feature 4: Batch Webhook for N8N

### POST /api/webhook/n8n/batch

**Description:** Ingest multiple opportunities in a single API call instead of one per request. Useful for N8N bulk operations.

**Request Body:**
```json
{
  "opportunities": [
    {
      "platform": "workana",
      "title": "Frontend React Development",
      "url": "https://workana.com/project/123",
      "reward": "1500",
      "effort_hours": 40,
      "tier": "warm",
      "score": 70,
      "description": "E-commerce platform React redesign"
    },
    {
      "platform": "freelas",
      "title": "Mobile App Testing",
      "url": "https://freelas.com/project/456",
      "reward": "800",
      "effort_hours": 20,
      "tier": "cool",
      "score": 45,
      "description": "QA testing for Flutter app"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "processed": 2,
  "errors": [],
  "totalCount": 47,
  "timestamp": "2026-02-28T10:10:00.000Z"
}
```

**Test Command:**
```bash
curl -X POST http://localhost:3000/api/webhook/n8n/batch \
  -H "Content-Type: application/json" \
  -d '{
    "opportunities": [
      {
        "platform": "workana",
        "title": "Test Project 1",
        "url": "https://workana.com/p/1",
        "reward": "500",
        "tier": "cool",
        "score": 50
      },
      {
        "platform": "freelas",
        "title": "Test Project 2",
        "url": "https://freelas.com/p/2",
        "reward": "1000",
        "tier": "warm",
        "score": 70
      }
    ]
  }'
```

**Error Handling:**
```json
{
  "success": true,
  "processed": 1,
  "errors": [
    {
      "index": 1,
      "error": "Requerido: title, url"
    }
  ],
  "totalCount": 48,
  "timestamp": "2026-02-28T10:10:00.000Z"
}
```

---

## Feature 5: Detailed Health Status

### GET /api/health/detailed

**Description:** Extended health check with uptime, memory usage, data staleness detection, and vital bars.

**Response:**
```json
{
  "success": true,
  "system": {
    "uptime": "2h 15m",
    "uptime_seconds": 8100,
    "memory_usage": {
      "rss": "45.32 MB",
      "heap_used": "28.15 MB",
      "heap_total": "64.00 MB"
    }
  },
  "data_sources": {
    "radar": {
      "last_update": "2026-02-28T09:45:00.000Z",
      "status": "online"
    },
    "webhook": {
      "last_update": "2026-02-28T10:10:00.000Z",
      "status": "online"
    }
  },
  "proposals": {
    "ready": 3
  },
  "vital_bars": {
    "caixa": {
      "label": "Caixa",
      "value": 0,
      "status": "critical",
      "percentage": 0
    },
    "receita": {
      "label": "Receita 24h",
      "value": 0,
      "status": "critical",
      "percentage": 0
    },
    "oportunidades": {
      "label": "Oportunidades",
      "value": 2,
      "target": 5,
      "status": "yellow",
      "percentage": 40
    },
    "producao": {
      "label": "Produção",
      "value": "1250h",
      "status": "yellow",
      "percentage": 50
    },
    "qualidade": {
      "label": "Qualidade",
      "value": "62%",
      "status": "green",
      "percentage": 62
    }
  },
  "radar_stats": {
    "total": 47,
    "hot": 2,
    "warm": 8,
    "cool": 37,
    "avgScore": 62,
    "highestScore": 95,
    "totalEffortHours": 1250
  },
  "timestamp": "2026-02-28T10:15:00.000Z"
}
```

**Test Command:**
```bash
curl -X GET http://localhost:3000/api/health/detailed \
  -H "Content-Type: application/json"
```

**Data Staleness Detection:**
- Data is marked `stale` if last update was > 1 hour ago
- Helps CEO identify if scraper/webhook pipelines are active

---

## Feature 6: Agent Status Listing

### GET /api/agent-status

**Description:** Lists all available agents from `.antigravity/rules/agents/` directory with their roles.

**Response:**
```json
{
  "success": true,
  "agents": [
    {
      "name": "Optimus Prime",
      "role": "Product Manager",
      "specFile": "optimus-prime.md",
      "lastActive": null
    },
    {
      "name": "Engine",
      "role": "Developer",
      "specFile": "engine.md",
      "lastActive": null
    },
    {
      "name": "Dara",
      "role": "Data Engineer",
      "specFile": "dara.md",
      "lastActive": null
    }
  ],
  "count": 3,
  "timestamp": "2026-02-28T10:00:00.000Z"
}
```

**Test Command:**
```bash
curl -X GET http://localhost:3000/api/agent-status \
  -H "Content-Type: application/json"
```

**Dashboard Integration:**
```javascript
// Display active agents in dashboard
const response = await fetch('/api/agent-status');
const { agents } = await response.json();

agents.forEach(agent => {
  console.log(`${agent.name} — ${agent.role}`);
});
```

---

## Feature 7: Follow-Up Scheduler

### POST /api/followups

**Description:** Schedule follow-ups for opportunities.

**Request Body:**
```json
{
  "opportunityId": "proj-12345",
  "scheduledAt": "2026-03-01T10:00:00Z",
  "message": "Follow up on DETRAN proposal — check if received",
  "channel": "email"
}
```

**Response:**
```json
{
  "success": true,
  "followup": {
    "id": "fu-1234567890-abc123",
    "opportunityId": "proj-12345",
    "scheduledAt": "2026-03-01T10:00:00Z",
    "message": "Follow up on DETRAN proposal — check if received",
    "channel": "email",
    "createdAt": "2026-02-28T10:20:00.000Z",
    "completed": false
  },
  "timestamp": "2026-02-28T10:20:00.000Z"
}
```

**Test Command:**
```bash
curl -X POST http://localhost:3000/api/followups \
  -H "Content-Type: application/json" \
  -d '{
    "opportunityId": "proj-12345",
    "scheduledAt": "2026-03-01T10:00:00Z",
    "message": "Follow up on DETRAN proposal",
    "channel": "email"
  }'
```

---

### GET /api/followups

**Description:** List all scheduled follow-ups sorted by date (next scheduled first).

**Response:**
```json
{
  "success": true,
  "followups": [
    {
      "id": "fu-1234567890-abc123",
      "opportunityId": "proj-12345",
      "scheduledAt": "2026-03-01T10:00:00Z",
      "message": "Follow up on DETRAN proposal",
      "channel": "email",
      "createdAt": "2026-02-28T10:20:00.000Z",
      "completed": false
    },
    {
      "id": "fu-1234567890-def456",
      "opportunityId": "proj-67890",
      "scheduledAt": "2026-03-02T14:30:00Z",
      "message": "Check Shopify UX project status",
      "channel": "slack",
      "createdAt": "2026-02-28T10:22:00.000Z",
      "completed": false
    }
  ],
  "count": 2,
  "timestamp": "2026-02-28T10:25:00.000Z"
}
```

**Test Command:**
```bash
curl -X GET http://localhost:3000/api/followups \
  -H "Content-Type: application/json"
```

---

### GET /api/followups/due

**Description:** List follow-ups whose scheduled time has passed (CEO action required).

**Response:**
```json
{
  "success": true,
  "followups": [
    {
      "id": "fu-1234567890-abc123",
      "opportunityId": "proj-12345",
      "scheduledAt": "2026-02-27T15:00:00Z",
      "message": "Follow up on DETRAN proposal — 3 days passed",
      "channel": "email",
      "createdAt": "2026-02-25T10:20:00.000Z",
      "completed": false
    }
  ],
  "count": 1,
  "timestamp": "2026-02-28T10:30:00.000Z"
}
```

**Test Command:**
```bash
curl -X GET http://localhost:3000/api/followups/due \
  -H "Content-Type: application/json"
```

---

## Complete Testing Workflow

### 1. Start the Server
```bash
cd /Users/kreligar3vad/Documents/Workspace/apps/age
npm install  # if needed
node src/backend/server.js
```

### 2. Test All Endpoints

#### Check System Health
```bash
curl http://localhost:3000/api/health/detailed
```

#### List Proposals
```bash
curl http://localhost:3000/api/proposals
```

#### List Agents
```bash
curl http://localhost:3000/api/agent-status
```

#### Get Pipeline Analytics
```bash
curl http://localhost:3000/api/analytics/pipeline
```

#### Send Batch Webhook
```bash
curl -X POST http://localhost:3000/api/webhook/n8n/batch \
  -H "Content-Type: application/json" \
  -d '{
    "opportunities": [
      {
        "platform": "workana",
        "title": "Sample Project",
        "url": "https://workana.com/test",
        "reward": "500",
        "tier": "cool",
        "score": 50
      }
    ]
  }'
```

#### Schedule Follow-up
```bash
curl -X POST http://localhost:3000/api/followups \
  -H "Content-Type: application/json" \
  -d '{
    "opportunityId": "test-opp",
    "scheduledAt": "2026-03-05T10:00:00Z",
    "message": "Test follow-up",
    "channel": "email"
  }'
```

#### Move Opportunity in CRM
```bash
# First, find an opportunity ID from GET /api/radar
curl http://localhost:3000/api/radar | jq '.projects[0].id'

# Then move it through the pipeline
curl -X POST http://localhost:3000/api/opportunities/proj-12345/kanban \
  -H "Content-Type: application/json" \
  -d '{"status": "sent"}'
```

---

## Data Files

The backend now manages 3 new JSON data files:

| File | Purpose | Created At |
|------|---------|-----------|
| `data/crm-pipeline.json` | Tracks opportunity status (lead → paid → lost) | Auto-created on first write |
| `data/financial-log.json` | Records revenue when status = 'paid' | Auto-created on first write |
| `data/followups.json` | Stores scheduled follow-ups | Auto-created on first write |

All files are auto-created if they don't exist.

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Requerido: opportunityId, scheduledAt, message"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Oportunidade não encontrada"
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": "Error message details"
}
```

---

## Summary

✅ All 7 features implemented and tested
✅ Data persistence with JSON files
✅ No breaking changes to existing endpoints
✅ Ready for dashboard integration
✅ Ready for n8n webhook automation

**Commit:** `feat(api): 7 advanced backend features — pipeline analytics, follow-ups, batch webhook, agent status`
