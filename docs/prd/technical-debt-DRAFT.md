# Technical Debt Assessment — DRAFT

**Projeto:** age
**Data:** 2026-02-26
**Status:** Brownfield Discovery - FASE 4 (DRAFT para validação)
**Consolidado por:** @architect (Aria)

> **IMPORTANTE:** Este é um DRAFT consolidando descobertas das FASES 1-3.
> Aguardando validação especializada dos revisores:
> - @data-engineer → Seção Database
> - @ux-design-expert → Seção Frontend
> - @qa → Review geral de gaps

---

## 1. Executive Summary (Preliminary)

**Entidados** é um sistema vivo de metabolismo financeiro em **SURVIVAL MODE** (crítico).

### Composição Técnica
- **Frontend:** React 19 + Vite (landing page)
- **Backend:** Vanilla JS + n8n workflows (automação)
- **Database:** Planejado (Supabase), não implementado
- **Framework:** AIOS (orquestração de agentes)

### Débitos Detectados
- **Críticos:** 12 (implementação bloqueada)
- **Altos:** 10 (operação afetada)
- **Médios:** 8 (manutenção difícil)

**Total: 30 débitos técnicos**

### Esforço Estimado
- **Resolução completa:** ~80-100 horas
- **Fase crítica (P0):** ~30 horas
- **Fase fundação (P1):** ~40 horas
- **Fase otimização (P2):** ~20 horas

---

## 2. Débitos de Sistema (FASE 1)

### Infraestrutura & Arquitetura

| ID | Débito | Severidade | Horas | Status |
|---|---|---|---|---|
| **SYS-001** | Sem API layer explícita | 🔴 CRÍTICO | 20 | Bloqueador |
| **SYS-002** | Sem testes unitários/e2e | 🔴 CRÍTICO | 25 | Bloqueador |
| **SYS-003** | Dependências desatualizadas | 🔴 CRÍTICO | 5 | Quick fix |
| **SYS-004** | Sem .env management | 🔴 CRÍTICO | 4 | Quick fix |
| **SYS-005** | Dashboard monolítico (36.5 KB) | 🟠 ALTO | 12 | Refactor |
| **SYS-006** | Sem logging estruturado | 🟠 ALTO | 8 | Add libs |
| **SYS-007** | Sem monitoring | 🟠 ALTO | 6 | Setup Sentry |
| **SYS-008** | n8n workflows não documentados | 🟠 ALTO | 10 | Document |
| **SYS-009** | Documentação ausente | 🟡 MÉDIO | 6 | Docs |
| **SYS-010** | Sem CI/CD pipeline | 🟡 MÉDIO | 10 | GitHub Actions |
| **SYS-011** | Parse test files orphaned | 🟡 MÉDIO | 2 | Cleanup |
| **SYS-012** | Sem error handling explícito | 🟡 MÉDIO | 8 | Refactor |

**Subtotal:** 116 horas

---

## 3. Débitos de Database (FASE 2)

### ⚠️ BLOQUEADOR: Database não existe ainda

| ID | Débito | Severidade | Horas | Status |
|---|---|---|---|---|
| **DB-001** | Database não inicializado | 🔴 CRÍTICO | 8 | BLOQUEADOR |
| **DB-002** | Sem RLS policies | 🔴 CRÍTICO | 12 | Dependency |
| **DB-003** | Sem schema definido | 🔴 CRÍTICO | 20 | Bloqueador |
| **DB-004** | Sem backup strategy | 🔴 CRÍTICO | 4 | Bloqueador |
| **DB-005** | Sem migrations versionadas | 🟠 ALTO | 6 | Bloqueador |
| **DB-006** | Sem índices planejados | 🟠 ALTO | 10 | Performance |
| **DB-007** | Sem constraints de integridade | 🟠 ALTO | 8 | Data quality |
| **DB-008** | Sem stored procedures | 🟠 ALTO | 15 | Optional |
| **DB-009** | Sem data seed scripts | 🟡 MÉDIO | 4 | Testing |
| **DB-010** | Sem query monitoring | 🟡 MÉDIO | 6 | Observability |

**Subtotal:** 93 horas

---

## 4. Débitos de Frontend (FASE 3)

### Design System & UX

| ID | Débito | Severidade | Horas | Status |
|---|---|---|---|---|
| **FE-001** | Design system não documentado | 🔴 CRÍTICO | 12 | Foundation |
| **FE-002** | Sem testes (component + e2e) | 🔴 CRÍTICO | 20 | Bloqueador |
| **FE-003** | CSS não estruturado (vanilla) | 🔴 CRÍTICO | 15 | Refactor |
| **FE-004** | Sem prop validation (TypeScript) | 🔴 CRÍTICO | 10 | QA gate |
| **FE-005** | Sem accessible patterns (a11y) | 🔴 CRÍTICO | 16 | Compliance |
| **FE-006** | Sem error boundary | 🟠 ALTO | 4 | Safety |
| **FE-007** | Sem performance optimization | 🟠 ALTO | 12 | UX |
| **FE-008** | Sem state management | 🟠 ALTO | 8 | Scalability |
| **FE-009** | Sem SEO optimization | 🟠 ALTO | 8 | Discovery |
| **FE-010** | Sem analytics | 🟠 ALTO | 6 | Insights |
| **FE-011** | CSS media queries inline | 🟡 MÉDIO | 6 | Maintainability |
| **FE-012** | Sem component documentation | 🟡 MÉDIO | 8 | Onboarding |

**Subtotal:** 125 horas

---

## 5. Matriz de Priorização Preliminar

### P0 — SURVIVAL (Primeiros 7 dias)
Débitos que bloqueiam operação em SURVIVAL MODE:

| Débito | Impacto | Esforço |
|--------|---------|---------|
| DB-001: Database não existe | ⛔ Bloqueador crítico | 8h |
| SYS-001: Sem API layer | ⛔ Frontend-backend desconectado | 20h |
| SYS-003: Deps desatualizadas | ⚠️ Segurança | 5h |
| **Subtotal P0** | | **33h** |

### P1 — FOUNDATION (Próximas 2 semanas)
Débitos que permitem operação estável:

| Débito | Impacto | Esforço |
|--------|---------|---------|
| DB-003: Schema não existe | ⛔ Data integrity | 20h |
| DB-002: Sem RLS | 🔐 Segurança crítica | 12h |
| SYS-002: Sem testes | ❌ Zero cobertura | 25h |
| FE-001: Design system | 🎨 Inconsistência visual | 12h |
| FE-003: CSS refactor | 🔧 Maintainability | 15h |
| **Subtotal P1** | | **84h** |

### P2 — GROWTH (Próximo mês)
Débitos que melhoram eficiência:

| Débito | Impacto | Esforço |
|--------|---------|---------|
| SYS-010: CI/CD pipeline | 🚀 Deploy automation | 10h |
| FE-002: Component tests | ✅ Quality gates | 20h |
| DB-006: Índices | ⚡ Performance | 10h |
| Outros (menor prioridade) | | ~30h |
| **Subtotal P2** | | **70h** |

---

## 6. Perguntas para Especialistas

### 🔧 @data-engineer
- [ ] Supabase é a escolha final para database?
- [ ] Qual é a prioridade de RLS? (crítica em SURVIVAL?)
- [ ] Precisa de real-time features ou polling é ok?
- [ ] Qual é o backup strategy recomendado?
- [ ] Qual é o SLA de disponibilidade?
- [ ] n8n acessa database como? (cliente JS, webhook, API?)

### 🎨 @ux-design-expert
- [ ] Design system já existe documentado em outro lugar?
- [ ] Responsiveness em mobile é prioridade P0?
- [ ] WCAG 2.1 AA é obrigatório?
- [ ] Precisa de dark mode?
- [ ] User journeys estão documentadas?
- [ ] Analytics é prioridade? (qual ferramenta?)

### 🧪 @qa
- [ ] Teste de integração entre frontend-backend precisa de mock?
- [ ] Como testar n8n workflows antes de prod?
- [ ] Qual é o testing framework recomendado? (Jest, Vitest?)
- [ ] E2E testing necessário? (Playwright, Cypress?)
- [ ] Load testing é requerido?

---

## 7. Dependências entre Débitos

```
DB-001 (Database)
  ↓
  ├─ DB-003 (Schema) — Bloqueador para SYS-001 (API)
  ├─ DB-002 (RLS) — Bloqueador para FE-008 (State)
  └─ SYS-001 (API) — Conecta frontend ↔ backend

SYS-001 (API Layer)
  ↓
  ├─ FE-008 (State Management) — Consuma API
  └─ SYS-002 (Tests) — Teste integração

FE-001 (Design System)
  ↓
  └─ FE-003 (CSS Refactor) — Implemente sistema

FE-003 (CSS)
  ↓
  └─ FE-011 (Media Queries) — Organize responsiveness
```

---

## 8. Ordem de Resolução Recomendada

### FASE 1: SURVIVAL (Semana 1)
1. DB-001: Inicializar Supabase ✅
2. SYS-001: Criar API layer ✅
3. SYS-003: Atualizar dependências ✅

### FASE 2: FOUNDATION (Semanas 2-3)
4. DB-003: Desenhar schema ✅
5. DB-002: Implementar RLS ✅
6. SYS-002: Configurar testes ✅
7. FE-001: Documentar design system ✅

### FASE 3: GROWTH (Semanas 4-6)
8. FE-003: Refatorar CSS ✅
9. SYS-010: Setup CI/CD ✅
10. FE-002: Component tests ✅

---

## 9. Riscos Identificados

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Database schema redesign necessário | Média | Alto | Validar com @data-engineer ASAP |
| RLS complexity subestimado | Alta | Crítico | Planning rigoroso antes de dev |
| Frontend refactor causa regressão | Média | Alto | E2E tests antes de refactor |
| n8n workflows quebram com API | Alta | Crítico | Contract testing |
| Teste suite coverage inadequada | Média | Médio | Enforçar >80% coverage |

---

## 10. Perguntas Abertas para Validação

- ❓ Existe um PRD formal de features que Entidados deve ter?
- ❓ Qual é o número de usuários esperado? (para escala)
- ❓ Qual é o SLA de uptime? (99%, 99.9%?)
- ❓ Qual é o orçamento de resolução?
- ❓ Qual é o timeline desejado?
- ❓ Há constraints de tech stack?
- ❓ Quem são os stakeholders para aprovação?

---

## 11. Próximas Ações

### IMEDIATAMENTE
- [ ] @data-engineer valida DB-AUDIT.md
- [ ] @ux-design-expert valida frontend-spec.md
- [ ] @qa faz review geral de gaps

### APÓS VALIDAÇÃO
- [ ] @architect consolida ASSESSMENT FINAL
- [ ] @analyst cria relatório executivo
- [ ] @pm cria epic + stories

---

**DRAFT Status:** ⚠️ AGUARDANDO VALIDAÇÃO ESPECIALIZADA

**Próximo:** FASES 5-7 (Validação dos especialistas)
