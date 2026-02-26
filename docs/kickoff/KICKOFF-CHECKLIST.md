# Kickoff Meeting Checklist — Epic 1.0

**Data:** 2026-02-27
**Horário:** 10:00 AM PT
**Duração:** 2 horas
**Attendees:** @dev, @data-engineer, @qa, @architect

---

## PRÉ-KICKOFF (Hoje, 2026-02-26)

### Environment Setup
- [ ] GitHub repository cloned locally
- [ ] Node.js 18+ installed
- [ ] npm packages installed (`npm install`)
- [ ] .env.example reviewed
- [ ] VS Code / IDE configured
- [ ] ESLint + Prettier working

### Documentation Review
- [ ] Epic 1.0 lido completamente
- [ ] Stories P0 compreendidas
- [ ] Technical debt assessment revisado
- [ ] Architecture diagrama entendido
- [ ] Database schema visualizado

### Tool Setup
- [ ] Supabase account created/accessed
- [ ] GitHub Copilot enabled (se disponível)
- [ ] Slack workspace joined
- [ ] Calendar invites accepted

---

## KICKOFF AGENDA (2026-02-27, 10am)

### Parte 1: Alignment (30 min)

**Tópicos:**
1. Vision: Transformar de SURVIVAL para STABLE
2. Timeline: 6 semanas, 3 fases
3. Definition of Success: Métricas por checkpoint
4. Risk review: 5 riscos críticos + mitigações
5. Communication: Standups, demos, escalation

**Outputs:**
- [ ] Everyone agrees on vision
- [ ] Timeline confirmado
- [ ] Risks acknowledged
- [ ] Communication plan aceito

### Parte 2: Technical Deep Dive (60 min)

**Sub-teams:**

#### Database Breakout (30 min) — @data-engineer + @dev
- [ ] Supabase setup walkthrough
- [ ] Schema design review
- [ ] RLS policies architecture
- [ ] Migration strategy
- [ ] Backup & recovery plan
- [ ] Connection pooling setup

**Decision Points:**
- [ ] Supabase region confirmado (padrão: us-east-1)
- [ ] Backup frequency (padrão: diário)
- [ ] RLS audit trail (padrão: sim)

#### API & Frontend Breakout (30 min) — @dev + @architect
- [ ] API endpoints walkthrough
- [ ] Error handling patterns
- [ ] Authentication flow
- [ ] Design system overview
- [ ] Mobile breakpoints
- [ ] Component architecture

**Decision Points:**
- [ ] API versioning strategy (padrão: v1 prefix)
- [ ] Error response format (padrão: JSON)
- [ ] Design tokens format (padrão: CSS variables)

#### Testing & QA Breakout (20 min) — @qa + @dev
- [ ] Test pyramid (unit, integration, e2e)
- [ ] Coverage targets (>80%)
- [ ] CI/CD architecture
- [ ] Monitoring setup
- [ ] Performance baselines

**Decision Points:**
- [ ] Test framework confirmado (Vitest)
- [ ] E2E framework (Playwright)
- [ ] Coverage tool (c8)

### Parte 3: Story 1.0.1 Deep Dive (20 min)

**Story 1.0.1: Database Setup**

**Walkthrough:**
- [ ] Supabase project creation (step-by-step)
- [ ] Schema migration process
- [ ] Testing the connection
- [ ] Versioning in Git
- [ ] Backup validation

**Assignments:**
- [ ] @data-engineer: Lead story
- [ ] @dev: Support + API integration
- [ ] @qa: Smoke tests + validation

**ETA:** 8 hours (Tuesday EOD)

**Definition of Done:**
- [ ] 4 tables created (barras_vitais, log_financeiro, orgaos, squads)
- [ ] Indexes created
- [ ] Backup tested
- [ ] Migration files committed
- [ ] Smoke tests passing

---

## POST-KICKOFF (2026-02-27, Afternoon)

### Immediate Actions

**By 5 PM:**
- [ ] Supabase project link shared in Slack
- [ ] Database credentials in .env.example
- [ ] Story 1.0.1 sprint board created
- [ ] First commit with skeleton code

**By EOW (Friday):**
- [ ] Story 1.0.1 completed (Database)
- [ ] Story 1.0.2 started (RLS)
- [ ] Story 1.0.3 started (API)
- [ ] Demo for stakeholders

---

## Communication Cadence

### Daily
- **10:15 AM:** Standup (15 min)
  - What done yesterday?
  - What doing today?
  - Blockers?

### 3x/Week
- **Monday 2 PM:** Specialist sync (Database, Frontend, Testing)
- **Wednesday 3 PM:** Blockers & escalations
- **Friday 4 PM:** Week review & next week planning

### Weekly
- **Friday 5 PM:** Stakeholder update (30 min)
  - Progress on stories
  - Metrics & KPIs
  - Next week preview

### Bi-Weekly
- **Sprint Review:** Show what done, get feedback
- **Sprint Retro:** What went well, what to improve

---

## Success Criteria — Week 1

By EOW (2026-03-07):

| Item | Target | Status |
|------|--------|--------|
| **Story 1.0.1** | ✅ Done (Database) | — |
| **Story 1.0.2** | 50% complete (RLS) | — |
| **Story 1.0.3** | 50% complete (API) | — |
| **Story 1.0.4** | ✅ Done (Deps) | — |
| **Smoke Tests** | All passing | — |
| **GitHub** | All committed | — |
| **Demo** | Stakeholder review | — |

---

## Escalation Path

**If blocked:**

1. **Standup:** Mention blocker
2. **Slack:** @mention specialist (same-day response)
3. **30 min window:** Specialist resolves or escalates
4. **Retro:** Document lesson learned

**Escalation Chain:**
- Technical issue → @architect
- Database issue → @data-engineer
- Frontend issue → @dev
- Testing issue → @qa
- Budget/timeline → Stakeholder

---

## Tools & Access

### Required Tools
```
✅ GitHub: github.com/KRMRevad/age-entidados (access confirmed)
✅ Supabase: (to be created at kickoff)
✅ Slack: (link shared)
✅ VS Code: (local)
✅ Node.js 18+: (verified)
✅ npm 10+: (verified)
```

### Credentials (Secure Storage)
```
SUPABASE_URL: [will be shared at kickoff]
SUPABASE_ANON_KEY: [will be shared at kickoff]
GITHUB_TOKEN: [will be shared at kickoff]
```

---

## Contingency Plans

**If @data-engineer unavailable:**
- @architect takes lead
- @dev supports
- Timeline extends 2 days

**If Supabase setup blocks:**
- Mock database in memory (SQLite)
- Parallel path: API development
- Supabase integration delayed by 2 days

**If tests fail at end of week:**
- Extend to Monday (flexible)
- Don't block subsequent stories
- Create tech debt issue for later

---

## Next Checkpoints

- **Checkpoint 1:** Week 1 (2026-03-07) — P0 Demo
- **Checkpoint 2:** Week 3 (2026-03-21) — P1 Complete
- **Checkpoint 3:** Week 6 (2026-04-07) — Production Ready

---

**Kickoff:** READY TO EXECUTE

**Responsible:** @architect + @dev
**Status:** All pre-kickoff items should be DONE by 2026-02-27 10:00 AM

---

*See you at kickoff!* 🚀
