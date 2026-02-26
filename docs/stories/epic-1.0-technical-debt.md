# Epic 1.0 — Resolução de Débitos Técnicos

**Epic ID:** 1.0
**Status:** Ready for Development
**Created:** 2026-02-26
**Priority:** 🔴 CRITICAL
**Timeline:** 6 semanas (2 engenheiros)
**Team:** @dev (Dex) + @data-engineer (Dara) + @qa (Quinn)

---

## Objetivo

Resolver 34 débitos técnicos críticos identificados no Brownfield Discovery, transformando o Entidados de **SURVIVAL MODE** para uma **fundação estável e escalável** pronta para crescimento.

### Resultado Esperado
- ✅ Database seguro e versionado
- ✅ API documentada e testada
- ✅ Frontend acessível e responsivo
- ✅ Tests covering critical paths (>80%)
- ✅ CI/CD pipeline automático
- ✅ Monitoring em produção
- ✅ ROI: 5.7:1 em 1 ano

---

## Escopo

### Incluído
- ✅ Database setup (Supabase)
- ✅ API layer (REST endpoints)
- ✅ Frontend refactor (design system, mobile)
- ✅ Test framework (Vitest + Playwright)
- ✅ Security (RLS, validation)
- ✅ Accessibility (WCAG 2.1 AA)
- ✅ Monitoring & logging
- ✅ CI/CD pipeline

### Não Incluído (Futuro)
- ❌ Dark mode implementation (P3)
- ❌ Advanced analytics dashboard (P3)
- ❌ Performance tuning <1s (P3)
- ❌ Offline-first PWA (P3)

---

## Critérios de Sucesso

### P0 Complete (Semana 1)
- [ ] Supabase project created and tested
- [ ] Core schema deployed (4 tables)
- [ ] API layer scaffolding complete
- [ ] RLS policies basic (blocking/allowing)
- [ ] Frontend build passing
- [ ] Smoke tests green

### P1 Complete (Semanas 2-3)
- [ ] Test coverage >80%
- [ ] Design system live (Storybook)
- [ ] a11y audit passed
- [ ] All critical components refactored
- [ ] TypeScript strict mode enabled

### P2 Complete (Semanas 4-6)
- [ ] Lighthouse score >90
- [ ] CI/CD pipeline automated
- [ ] Monitoring alerts active
- [ ] Analytics tracking
- [ ] Production deployment successful

### Final Acceptance
- [ ] All stories marked "Done"
- [ ] No blocking issues
- [ ] Stakeholder sign-off
- [ ] Production monitoring stable

---

## Stories (P0 — SURVIVAL)

### Story 1.0.1: Database Setup & Core Schema

**Assignee:** @data-engineer (Dara)
**Estimate:** 8 hours
**Priority:** 🔴 CRITICAL
**Dependencies:** None
**Blocks:** All API stories

```markdown
## Description
Initialize Supabase project and deploy core schema with 4 foundational tables.

## Tasks
- [ ] Create Supabase project
- [ ] Configure connection pooling
- [ ] Deploy migration: barras_vitais table
- [ ] Deploy migration: log_financeiro table
- [ ] Deploy migration: orgaos table
- [ ] Deploy migration: squads table
- [ ] Create basic indexes
- [ ] Test connection from local machine
- [ ] Document Supabase credentials in .env.example

## Acceptance Criteria
- [ ] Supabase dashboard shows 4 tables
- [ ] Tables have correct columns and types
- [ ] Indexes created and visible
- [ ] Connection string works in local app
- [ ] Migration files versioned in Git

## Test Plan
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN
('barras_vitais', 'log_financeiro', 'orgaos', 'squads');
```
```

---

### Story 1.0.2: RLS Policies & Security Setup

**Assignee:** @data-engineer (Dara)
**Estimate:** 12 hours
**Priority:** 🔴 CRITICAL
**Dependencies:** 1.0.1 (Database)
**Blocks:** API authorization tests

```markdown
## Description
Implement Row Level Security policies to protect multi-user data access.

## Tasks
- [ ] Create auth.users reference
- [ ] Implement RLS policy: log_financeiro (admin-only)
- [ ] Implement RLS policy: usuarios (self + admin read)
- [ ] Create auth.uid() test user
- [ ] Test policy blocking unauthorized access
- [ ] Document RLS architecture
- [ ] Create RLS test fixtures

## Acceptance Criteria
- [ ] Non-admin user cannot read log_financeiro
- [ ] Admin user can read all records
- [ ] Users can only see their own user record
- [ ] Policies enforced at database level
- [ ] Test fixtures cover all policies

## Test Plan
```sql
-- Test as non-admin user
SET ROLE test_user;
SELECT * FROM log_financeiro;  -- Should return 0 rows

-- Test as admin
RESET ROLE;
SELECT * FROM log_financeiro;  -- Should return all rows
```
```

---

### Story 1.0.3: API Layer Scaffolding

**Assignee:** @dev (Dex)
**Estimate:** 20 hours
**Priority:** 🔴 CRITICAL
**Dependencies:** 1.0.1 (Database)
**Blocks:** Frontend integration

```markdown
## Description
Create REST API layer connecting frontend to Supabase database.

## Tasks
- [ ] Setup Express.js server
- [ ] Configure Supabase client
- [ ] Create authentication middleware
- [ ] Implement GET /api/barras-vitais
- [ ] Implement POST /api/log-financeiro
- [ ] Implement GET /api/log-financeiro
- [ ] Add error handling middleware
- [ ] Document API endpoints (Swagger/OpenAPI)
- [ ] Setup environment variables

## Endpoints
```
GET  /api/health
GET  /api/barras-vitais
POST /api/log-financeiro
GET  /api/log-financeiro
GET  /api/orgaos
POST /api/orgaos/:id/squads
```

## Acceptance Criteria
- [ ] All endpoints return correct data
- [ ] Error handling returns proper HTTP codes
- [ ] Authentication validates users
- [ ] API documentation auto-generated
- [ ] CORS configured correctly

## Test Plan
```bash
curl http://localhost:3000/api/health
# Response: {"status":"ok"}

curl -X POST http://localhost:3000/api/log-financeiro \
  -H "Content-Type: application/json" \
  -d '{"tipo":"ENTRADA","valor":100}'
```
```

---

### Story 1.0.4: Frontend Dependency Updates

**Assignee:** @dev (Dex)
**Estimate:** 5 hours
**Priority:** 🔴 CRITICAL
**Dependencies:** None
**Blocks:** Frontend refactoring

```markdown
## Description
Update outdated dependencies to latest secure versions.

## Tasks
- [ ] npm audit and review
- [ ] Update axios to 1.7.x
- [ ] Update puppeteer to latest
- [ ] Update React to 19.2.x (verify)
- [ ] Update Vite to latest
- [ ] Run tests after updates
- [ ] Test app in development
- [ ] Test app in production build

## Acceptance Criteria
- [ ] npm audit shows 0 vulnerabilities
- [ ] All tests pass after updates
- [ ] App builds without warnings
- [ ] No breaking changes detected

## Test Plan
```bash
npm audit
npm run build
npm run lint
npm test
```
```

---

## Stories (P1 — FOUNDATION)

### Story 1.0.5: Design System & Tokens [12h]
### Story 1.0.6: CSS Refactor to Tailwind [15h]
### Story 1.0.7: TypeScript Strict Mode [10h]
### Story 1.0.8: Component Tests (Vitest) [20h]
### Story 1.0.9: a11y Audit & Fixes [16h]
### Story 1.0.10: Form Accessibility [8h]

---

## Stories (P2 — GROWTH)

### Story 1.0.11: CI/CD Pipeline Setup [10h]
### Story 1.0.12: Performance Optimization [12h]
### Story 1.0.13: Analytics Integration [6h]
### Story 1.0.14: Monitoring & Alerts [6h]

---

## Dependencies & Blocking

```
1.0.1 (Database)
├─ Blocks: 1.0.2 (RLS), 1.0.3 (API)
├─ Parallel: 1.0.4 (Deps), 1.0.5 (Design)
└─ Parallel: 1.0.6 (CSS), 1.0.7 (TypeScript)

1.0.2 (RLS)
├─ Blocked by: 1.0.1
└─ Blocks: API auth tests

1.0.3 (API)
├─ Blocked by: 1.0.1
└─ Blocks: 1.0.8 (Integration tests)

1.0.4 (Deps)
├─ Independent
└─ Blocks: Frontend tests (1.0.8)

1.0.5 (Design)
├─ Independent
└─ Blocks: 1.0.6 (CSS), 1.0.9 (a11y)

1.0.6 (CSS)
├─ Blocked by: 1.0.5
└─ Required: before 1.0.8

1.0.7 (TypeScript)
├─ Independent
└─ Required: before 1.0.8

1.0.8 (Tests)
├─ Blocked by: 1.0.4, 1.0.6, 1.0.7
└─ Required: before 1.0.9

1.0.9 (a11y)
├─ Blocked by: 1.0.5, 1.0.8
└─ Required: before P2

1.0.10 (Form a11y)
├─ Blocked by: 1.0.9
└─ Required: before P2
```

---

## Team Assignment

### @data-engineer (Dara)
- Story 1.0.1: Database Setup (8h)
- Story 1.0.2: RLS Policies (12h)
- **Total P0:** 20h
- **Total P1:** 14h (migrations, constraints)
- **Total P2:** 20h (indexes, monitoring, queries)

### @dev (Dex)
- Story 1.0.3: API Layer (20h)
- Story 1.0.4: Dependencies (5h)
- Story 1.0.5: Design System (12h)
- Story 1.0.6: CSS Refactor (15h)
- Story 1.0.7: TypeScript (10h)
- Story 1.0.8: Component Tests (20h)
- Story 1.0.12: Performance (12h)
- Story 1.0.13: Analytics (6h)
- **Total:** 100h across 6 weeks

### @qa (Quinn)
- Epic coordination
- Smoke tests (P0)
- Test strategy docs
- Integration tests
- Load testing
- Monitoring setup

---

## Timeline & Milestones

```
WEEK 1: SURVIVAL MODE
├─ Mon: Kickoff + setup
├─ Tue: 1.0.1 (Database) started
├─ Wed: 1.0.2 (RLS) started
├─ Thu: 1.0.3 (API) started
├─ Fri: Smoke tests + demo
└─ Status: WORKING

WEEKS 2-3: FOUNDATION MODE
├─ Sprint 1: Tests, design system, CSS
├─ Sprint 2: Accessibility, TypeScript
└─ Status: FOUNDATION COMPLETE

WEEKS 4-6: GROWTH MODE
├─ Sprint 3: Performance, CI/CD, analytics
├─ Sprint 4: Monitoring, production prep
└─ Status: PRODUCTION READY
```

---

## Risk Mitigation

| Risk | Mitigation | Owner |
|------|-----------|-------|
| RLS complexity | Early validation + tests | @data-engineer |
| API-Frontend mismatch | Contract testing + OpenAPI | @dev |
| Performance regression | Lighthouse CI | @qa |
| Database schema change | Backwards-compatible migrations | @data-engineer |

---

## Success Metrics (Sprint Review)

- [ ] All P0 stories done by EOD Friday Week 1
- [ ] Test coverage >80% by EOD Week 3
- [ ] Lighthouse >90 by EOD Week 6
- [ ] Zero critical bugs in production
- [ ] All stakeholders sign-off

---

## Communication Plan

- **Daily:** Standup 10am PT
- **3x/week:** Specialist syncs (DB, Frontend, QA)
- **Weekly:** Stakeholder update (Friday)
- **Bi-weekly:** Sprint review + retro

---

**Epic Owner:** @architect (Aria)
**Status:** Ready for Kickoff
**Next:** Start Story 1.0.1 on 2026-02-27
