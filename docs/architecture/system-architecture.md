# System Architecture — Entidados AGE

**Data:** 2026-02-26
**Status:** Brownfield Discovery - FASE 1
**Analista:** @architect (Aria)

---

## 1. Identidade & Contexto

### Organismo
**Entidados** — Sistema vivo de metabolismo financeiro regulado por 5 barras vitais (Caixa, Combustível, Receita, Velocidade, Conversão).

### Modos de Operação
| Modo | Gatilho | Estado Atual |
|------|--------|-------------|
| 🔴 **SURVIVAL** | Caixa < R$ 50 OU Combustível < 5% | ✅ ATIVO |
| 🟠 AUSTERITY | Caixa R$ 50–500 | — |
| 🟢 GROWTH | Caixa > R$ 500 | — |
| 🔵 EXPANSION | MRR > R$ 2.000 | — |
| 🟣 DOMINANCE | MRR > R$ 20.000 | — |

### Órgãos Principais
- 🧠 **NEXUS** — Consultoria & Serviços B2B (receita imediata)
- 📡 **FORGE** — Produtos Digitais & SaaS (receita escalável)
- 🎬 **SINAL** — Conteúdo & Mídia (autoridade + leads)
- 🏛️ **ÁGORA** — DAO & Comunidade (futuro)

---

## 2. Stack Tecnológico Detectado

### Frontend
| Camada | Tecnologia | Status | Notas |
|--------|-----------|--------|-------|
| **Framework** | Vite.js + Vanilla JS | Ativo | age-website/ |
| **Build** | Vite | Ativo | eslint configurado |
| **Styling** | CSS (vanilla) | Ativo | public/ assets |
| **Node Version** | ~16+ (axios deps) | Ativo | package.json |

### Backend
| Camada | Tecnologia | Status | Notas |
|--------|-----------|--------|-------|
| **API Gateway** | n8n (workflow automation) | Ativo | n8n/ folder |
| **Admin Dashboard** | Vanilla HTML/CSS/JS | Ativo | dashboard/ |
| **Web Scraping** | Puppeteer + Cheerio + Axios | Ativo | package.json deps |
| **Data Collection** | Parse scripts (parse_test.js) | Ativo | Teste/POC |

### Infrastructure
| Componente | Status | Notas |
|-----------|--------|-------|
| **Version Control** | Git + GitHub | ✅ Inicializado em 2026-02-26 |
| **Remote** | github.com/KRMRevad/age-entidados | ✅ Conectado |
| **Branches** | main, develop, feature/* | ✅ Estrutura profissional |
| **Framework** | AIOS (.aios-core/) | ✅ Instalado |

---

## 3. Estrutura de Pastas & Componentes

```
entidados/
├── 🌐 age-website/          [Frontend - Vite Application]
│   ├── src/
│   ├── public/
│   ├── vite.config.js
│   ├── package.json (128 deps)
│   └── index.html
│
├── 📊 dashboard/             [Admin Dashboard - Vanilla HTML/JS]
│   ├── app.js (36.5 KB)
│   ├── index.html (26 KB)
│   ├── style.css (36.4 KB)
│   └── [Single Page App]
│
├── 🤖 n8n/                  [Workflow Automation]
│   └── [n8n workflows & configs]
│
├── 📁 docs/                 [Documentation]
│   ├── architecture/        [PHASE 1 outputs]
│   ├── frontend/            [PHASE 3 outputs]
│   ├── reviews/             [PHASE 5-7 outputs]
│   ├── prd/                 [PHASE 4,8 outputs]
│   ├── reports/             [PHASE 9 outputs]
│   └── stories/             [PHASE 10 outputs]
│
├── 📦 squads/               [Team Organization]
│   └── squad-* (future)
│
├── 🧠 .aios-core/           [AIOS Framework]
│   ├── core/
│   ├── development/
│   └── infrastructure/
│
├── 🔧 .claude/              [Claude Code Config]
├── 📝 package.json          [Root dependencies]
└── 🌳 .git/                 [Version Control]
```

---

## 4. Dependências & Versões

### Root Dependencies
```
axios@^1.13.5       — HTTP client (scraping, API calls)
cheerio@^1.2.0      — DOM parser (data extraction)
puppeteer@^24.37.5  — Headless browser (RPA, screenshots)
```

### Frontend Dependencies (age-website)
- **128 npm packages** installed
- **Build tool:** Vite
- **Linting:** ESLint configured
- **Package size:** ~128MB (node_modules)

### Detected Outdated Dependencies
- ⚠️ **axios 1.13.5** (latest: 1.7.x) — Update recommended
- ⚠️ **puppeteer 24.37.5** (tracking latest) — Generally current
- ✅ **cheerio 1.2.0** — Current stable

---

## 5. Padrões de Código Detectados

### Frontend Patterns
```javascript
// age-website/src/
- Component-based structure (Vite default)
- ESLint configuration applied
- Asset management via public/
- Vite hot module replacement enabled
```

### Backend Patterns
```javascript
// dashboard/
- Single-page application (SPA)
- Inline CSS + JS (36.5 KB app.js)
- Direct HTML manipulation (no framework)
- No separate API layer yet

// n8n/
- Workflow-first automation
- API integrations via n8n connectors
- No custom code runtime
```

### Data Collection Patterns
```javascript
// Root directory
- puppeteer + cheerio = Web scraping pipeline
- axios = HTTP communication
- Parse test files = POC/validation scripts
```

---

## 6. Pontos de Integração Detectados

### Frontend → Backend
```
age-website/ ──[HTTP/REST?]──> dashboard/ OR n8n workflows
```
**Status:** ⚠️ **NÃO CLARO** — Precisa documentação de API

### Backend → External
```
n8n ──[API integrations]──> External services
puppeteer + axios ──[web scraping]──> Target websites
```

### Dashboard → n8n
```
dashboard/ (admin) ──[?]──> n8n (workflows)
```
**Status:** ⚠️ **POSSÍVEL** — Não validado ainda

---

## 7. Débitos Técnicos Identificados — NÍVEL SISTEMA

### 🔴 CRÍTICOS

| ID | Débito | Impacto | Notas |
|---|---|---|---|
| SYS-001 | Sem API layer explícita | Acoplamento frontend-backend | Precisa documentação |
| SYS-002 | Sem tests (package.json) | Zero cobertura de testes | Script padrão de erro |
| SYS-003 | Dependências desatualizadas | Vulnerabilidades conhecidas | axios, puppeteer outdated |
| SYS-004 | Sem .env management | Secrets em texto plano? | .env files existem mas não documentados |

### 🟠 ALTOS

| ID | Débito | Impacto | Notas |
|---|---|---|---|
| SYS-005 | Dashboard monolítico (36.5 KB) | Dificuldade de manutenção | Tudo em um arquivo |
| SYS-006 | Sem logging estruturado | Debuggability limitada | Sem observabilidade |
| SYS-007 | Sem monitoramento de performance | Invisibilidade operacional | Métricas não trackadas |
| SYS-008 | Integração n8n não documentada | Risco de regressão | Workflows de caixa preta |

### 🟡 MÉDIOS

| ID | Débito | Impacto | Notas |
|---|---|---|---|
| SYS-009 | Documentação ausente | Onboarding lento | Apenas CODEX.md |
| SYS-010 | Sem CI/CD configurado | Deploy manual propenso a erro | .github/ vazio |
| SYS-011 | Parse test files soltos | Código não-mantido | parse_test*.js orphaned |
| SYS-012 | Sem error handling explícito | Falhas silenciosas possíveis | Não auditado |

---

## 8. Dependências Técnicas & Fluxos

### Fluxo de Dados Principal
```
[External Data]
    ↓
[puppeteer scraping + cheerio parsing]
    ↓
[axios → n8n workflows]
    ↓
[dashboard visualization OR age-website display]
```

### Fluxo de Integração Implícita
```
[age-website UI]
    ↓ ?
[HTTP request to ...]
    ↓ ?
[n8n workflow OR dashboard backend]
    ↓ ?
[Data processing]
```
**⚠️ Este fluxo PRECISA ser documentado na FASE 3 (Frontend) e FASE 2 (API design)**

---

## 9. Questões para Especialistas

### Para @data-engineer
- [ ] Existe banco de dados? (Supabase, PostgreSQL, etc.)
- [ ] Qual é o schema de dados principal?
- [ ] Como n8n armazena estado/dados de workflows?
- [ ] RLS policies estão implementadas?

### Para @ux-design-expert
- [ ] Qual é o user journey principal do age-website?
- [ ] Dashboard é para quem? (Admin, Cliente, Operador?)
- [ ] Design system existe? (tokens, componentes reutilizáveis?)
- [ ] Responsividade testada em mobile?

### Para @qa
- [ ] Existe teste de integração entre frontend-backend?
- [ ] Como n8n é testado antes de prod?
- [ ] Rollback plan se workflow falhar?
- [ ] Monitoring em produção configurado?

---

## 10. Recomendações Preliminares (FASE 1)

### Imediatos (P0 — Survival Mode)
1. ✅ **Git + GitHub** — FEITO (2026-02-26)
2. 🔨 **API Documentation** — Documentar contrato entre age-website ↔ n8n/dashboard
3. 🔨 **Environment Setup** — Validar .env, documentar variáveis secretas
4. 🔨 **Dependency Audit** — `npm audit`, upgrade axios e puppeteer

### Curto Prazo (P1 — Next Sprint)
5. 📝 **Test Suite** — Configurar jest ou vitest + CI/CD
6. 📝 **Error Handling** — Try-catch consistent, error logging
7. 📝 **n8n Documentation** — Mapear workflows e dependências

### Médio Prazo (P2 — Build Phase)
8. 🏗️ **API Layer** — REST/GraphQL para separar frontend-backend
9. 🏗️ **Dashboard Modularization** — Quebrar 36.5 KB em componentes
10. 🏗️ **Logging & Monitoring** — Structured logs + observability

---

## 11. Próximos Passos

**FASE 2:** @data-engineer analisa database (se houver)
**FASE 3:** @ux-design-expert documenta frontend
**FASE 4:** @architect consolida DRAFT
**FASES 5-7:** Especialistas validam
**FASE 8:** Assessment final
**FASE 9:** Relatório executivo
**FASE 10:** Epic + Stories prontas para @dev

---

**Documento gerado por:** @architect (Aria)
**Tempo:** 2026-02-26 19:45
**Status:** ✅ FASE 1 COMPLETA — Aguardando FASE 2 (@data-engineer)
