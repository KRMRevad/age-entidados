#!/bin/bash

# 🚀 ENTIDADOS AGE — API V2 QUICK REFERENCE
# Usage: bash docs/API-V2-QUICK-REFERENCE.sh [command]
# Or: source docs/API-V2-QUICK-REFERENCE.sh && list-proposals

# ============================================================
# HELPERS
# ============================================================

API_BASE="http://localhost:3000/api"

print_header() {
  echo -e "\n\n═══════════════════════════════════════════════════════════════════════════"
  echo "║ $1"
  echo "═══════════════════════════════════════════════════════════════════════════"
}

# ============================================================
# FEATURE 1: LIST PROPOSALS
# ============================================================

list-proposals() {
  print_header "FEATURE 1: GET /api/proposals — List All Proposals"
  curl -s $API_BASE/proposals | jq '.'
}

# ============================================================
# FEATURE 2: CRM KANBAN PIPELINE
# ============================================================

move-to-sent() {
  OPP_ID=${1:-"wkn_2103192957"}
  print_header "FEATURE 2: Move Opportunity to 'sent' — POST /api/opportunities/:id/kanban"
  echo "Opportunity ID: $OPP_ID"
  curl -X POST $API_BASE/opportunities/$OPP_ID/kanban \
    -H "Content-Type: application/json" \
    -d '{"status": "sent"}' | jq '.'
}

move-to-paid() {
  OPP_ID=${1:-"wkn_2103192957"}
  print_header "FEATURE 2: Move Opportunity to 'paid' — Triggers Revenue Logging"
  echo "Opportunity ID: $OPP_ID"
  curl -X POST $API_BASE/opportunities/$OPP_ID/kanban \
    -H "Content-Type: application/json" \
    -d '{"status": "paid"}' | jq '.'
  echo -e "\n💾 Check data/crm-pipeline.json and data/financial-log.json"
}

# ============================================================
# FEATURE 3: PIPELINE ANALYTICS
# ============================================================

get-analytics() {
  print_header "FEATURE 3: GET /api/analytics/pipeline — Full Funnel Analytics"
  curl -s $API_BASE/analytics/pipeline | jq '.'
}

# ============================================================
# FEATURE 4: BATCH WEBHOOK
# ============================================================

batch-webhook() {
  print_header "FEATURE 4: POST /api/webhook/n8n/batch — Ingest Multiple Opportunities"
  curl -X POST $API_BASE/webhook/n8n/batch \
    -H "Content-Type: application/json" \
    -d '{
      "opportunities": [
        {
          "platform": "workana",
          "title": "Sample Batch Project 1",
          "url": "https://workana.com/p/batch1",
          "reward": "750",
          "effort_hours": 30,
          "tier": "warm",
          "score": 65,
          "description": "Batch test project 1"
        },
        {
          "platform": "freelas",
          "title": "Sample Batch Project 2",
          "url": "https://freelas.com/p/batch2",
          "reward": "1200",
          "effort_hours": 50,
          "tier": "hot",
          "score": 80,
          "description": "Batch test project 2"
        }
      ]
    }' | jq '.'
}

# ============================================================
# FEATURE 5: DETAILED HEALTH
# ============================================================

health-detailed() {
  print_header "FEATURE 5: GET /api/health/detailed — Extended System Status"
  curl -s $API_BASE/health/detailed | jq '.'
}

# ============================================================
# FEATURE 6: AGENT STATUS
# ============================================================

list-agents() {
  print_header "FEATURE 6: GET /api/agent-status — List All Available Agents"
  curl -s $API_BASE/agent-status | jq '.'
}

# ============================================================
# FEATURE 7: FOLLOW-UPS
# ============================================================

schedule-followup() {
  TITLE=${1:-"Follow up on test opportunity"}
  SCHEDULED_AT=${2:-"2026-03-05T10:00:00Z"}

  print_header "FEATURE 7: POST /api/followups — Schedule Follow-up"
  echo "Title: $TITLE"
  echo "Scheduled: $SCHEDULED_AT"

  curl -X POST $API_BASE/followups \
    -H "Content-Type: application/json" \
    -d "{
      \"opportunityId\": \"test-opp-$(date +%s)\",
      \"scheduledAt\": \"$SCHEDULED_AT\",
      \"message\": \"$TITLE\",
      \"channel\": \"email\"
    }" | jq '.'
}

list-followups() {
  print_header "FEATURE 7: GET /api/followups — List All Scheduled Follow-ups"
  curl -s $API_BASE/followups | jq '.'
}

list-followups-due() {
  print_header "FEATURE 7: GET /api/followups/due — List Overdue Follow-ups"
  curl -s $API_BASE/followups/due | jq '.'
}

# ============================================================
# TEST ALL ENDPOINTS
# ============================================================

test-all() {
  echo "🚀 Starting comprehensive API V2 test..."

  list-proposals
  get-analytics
  list-agents
  health-detailed
  list-followups
  list-followups-due

  echo -e "\n\n✅ All tests completed!"
  echo "View detailed documentation: docs/API-V2-REFERENCE.md"
}

# ============================================================
# DISPLAY MENU
# ============================================================

show-menu() {
  cat << 'MENU'

╔═══════════════════════════════════════════════════════════════════════════╗
║                 ENTIDADOS AGE — API V2 Quick Reference                   ║
║                         Available Commands:                              ║
╚═══════════════════════════════════════════════════════════════════════════╝

FEATURE 1: Proposals
  list-proposals                  List all generated proposals

FEATURE 2: CRM Pipeline Kanban
  move-to-sent [OPP_ID]          Move opportunity to 'sent'
  move-to-paid [OPP_ID]          Move to 'paid' (triggers revenue logging)

FEATURE 3: Pipeline Analytics
  get-analytics                  Get funnel analytics & metrics

FEATURE 4: Batch Webhook
  batch-webhook                  Send batch of opportunities to webhook

FEATURE 5: Detailed Health
  health-detailed                Get extended system status

FEATURE 6: Agent Status
  list-agents                    List all available agents

FEATURE 7: Follow-ups
  schedule-followup [TITLE] [DATE]   Schedule a new follow-up
  list-followups                 List all scheduled follow-ups
  list-followups-due             List overdue follow-ups (CEO action required)

UTILITY
  test-all                       Run comprehensive API test
  show-menu                      Show this menu

EXAMPLES:
  $ source docs/API-V2-QUICK-REFERENCE.sh
  $ list-proposals
  $ move-to-paid proj-12345
  $ schedule-followup "Follow up on DETRAN" "2026-03-05T14:30:00Z"
  $ test-all

═══════════════════════════════════════════════════════════════════════════

MENU
}

# ============================================================
# MAIN
# ============================================================

if [ $# -eq 0 ]; then
  show-menu
else
  "$@"
fi
