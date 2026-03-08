# Database Audit — age

**Data:** 2026-02-26
**Status:** Brownfield Discovery - FASE 2
**Analista:** @architect (Aria) — Pending @data-engineer review

---

## 1. Database Configuration Status

### Atual
| Item | Status | Detalhes |
|------|--------|----------|
| **Database Type** | Planejado: Supabase | .env.example referencia |
| **Connection** | ❌ Não configurada | `SUPABASE_URL` vazio |
| **Schema** | ❌ Não criado | Nenhum arquivo SQL de schema |
| **Migrations** | ❌ Não existe | Pasta supabase/migrations vazia |
| **RLS Policies** | ❌ Não implementado | Zero políticas de segurança |

---

## 2. Planejamento do Database (Do .env.example)

### Variáveis Esperadas
```
SUPABASE_URL=                    # PostgreSQL endpoint
SUPABASE_ANON_KEY=               # Public API key
SUPABASE_SERVICE_ROLE_KEY=       # Admin API key (servidor)
```

### Tipo de Database
- **Provider:** Supabase (PostgreSQL + Auth + Storage)
- **Tier Recomendado:** Free (até setup estável)
- **Region:** (Não documentado — usar Brasil se possível)

---

## 3. Arquitetura de Dados Esperada (Baseado no CODEX)

### Entidades Principais (Inferidas do CODEX.md)

#### 🧬 Barras Vitais
```sql
CREATE TABLE barras_vitais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_atualizacao TIMESTAMP DEFAULT NOW(),

  -- Caixa (R$ disponíveis)
  caixa_valor DECIMAL(10,2),
  caixa_status TEXT,

  -- Combustível (API Credits %)
  combustivel_pct DECIMAL(5,2),
  combustivel_status TEXT,

  -- Receita (R$/dia média 7d)
  receita_media_7d DECIMAL(10,2),
  receita_status TEXT,

  -- Velocidade (tasks/dia)
  velocidade_tasks_dia INT,
  velocidade_status TEXT,

  -- Conversão (%)
  conversao_pct DECIMAL(5,2),
  conversao_status TEXT,

  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 💰 Log Financeiro
```sql
CREATE TABLE log_financeiro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data TIMESTAMP DEFAULT NOW(),
  tipo TEXT NOT NULL, -- 'ENTRADA', 'SAÍDA', 'INICIAL'
  valor DECIMAL(10,2) NOT NULL,
  descricao TEXT,
  saldo_anterior DECIMAL(10,2),
  saldo_novo DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 🧠 Órgãos (Squads)
```sql
CREATE TABLE orgaos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE, -- 'NEXUS', 'FORGE', 'SINAL', 'AGORA'
  nome TEXT NOT NULL,
  descricao TEXT,
  funcao TEXT,
  squad_id UUID REFERENCES squads(id),
  prioridade_survival INT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 📊 Squads
```sql
CREATE TABLE squads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE,
  nome TEXT NOT NULL,
  membro_ids UUID[] DEFAULT '{}', -- Array de user IDs
  orgao_id UUID REFERENCES orgaos(id),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 4. Débitos Técnicos Detectados — NÍVEL DATABASE

### 🔴 CRÍTICOS

| ID | Débito | Impacto | Severidade |
|---|---|---|---|
| DB-001 | Database não inicializado | Sistema não pode armazenar dados | CRÍTICO |
| DB-002 | Nenhuma RLS policy | Risco de data breach | CRÍTICO |
| DB-003 | Sem schema definido | Retrabalho futuro | CRÍTICO |
| DB-004 | Sem backup strategy | Perda de dados potencial | CRÍTICO |

### 🟠 ALTOS

| ID | Débito | Impacto | Severidade |
|---|---|---|---|
| DB-005 | Sem migrations versionadas | Rollback impossível | ALTO |
| DB-006 | Sem índices planejados | Performance unknown | ALTO |
| DB-007 | Sem constraints de integridade | Data corruption risk | ALTO |
| DB-008 | Sem stored procedures | Lógica distribuída | ALTO |

### 🟡 MÉDIOS

| ID | Débito | Impacto | Severidade |
|---|---|---|---|
| DB-009 | Sem data seed scripts | Testing difícil | MÉDIO |
| DB-010 | Sem monitoring de queries | Query analysis blind | MÉDIO |

---

## 5. Questionário para @data-engineer

### Decisões de Design
- [ ] PostgreSQL vs outras bases? (Supabase é escolha final?)
- [ ] Qual é o modelo de acesso aos dados? (User-scoped, org-scoped, public?)
- [ ] Precisa de real-time features? (Supabase realtime, webhooks?)
- [ ] Estratégia de backup? (Automática via Supabase, custom?)

### Schema Principal
- [ ] Qual é a grain/granularidade principal dos dados? (User, Org, Financial Entry?)
- [ ] Como modela "Barras Vitais"? (JSON, normalized tables, both?)
- [ ] Tabelas "temporais"? (Audit log, history tracking?)
- [ ] Particionamento necessário? (Por data, por org?)

### Segurança
- [ ] Qual é a estratégia RLS? (User-based, role-based, org-based?)
- [ ] Precisa de encryption at rest? (Supabase + pgcrypto?)
- [ ] Como auditar mudanças sensíveis? (Audit tables, WAL, logs?)

### Performance
- [ ] Índices estratégicos? (Em quais colunas?)
- [ ] Materialized views necessárias? (Para dashboards?)
- [ ] Caching strategy? (Redis, pgmemcache, applicação?)
- [ ] Expected data volume? (Rows/month, storage estimate?)

### Integrations
- [ ] n8n acessa database? (Direct, via API, webhooks?)
- [ ] age-website acessa database? (Via Supabase JS client, servidor?)
- [ ] ETL pipelines? (Scheduled, event-driven?)

---

## 6. Recomendações Iniciais

### Imediato (P0 — Setup Phase)
1. 📝 **Decidir Stack Definitivo** — Confirmar Supabase ou alternativa
2. 🔨 **Criar Supabase Project** — Setup, conectar .env
3. 🔨 **Definir Schema Principal** — Tabelas core (barras_vitais, log_financeiro, orgaos)

### Curto Prazo (P1 — Foundation)
4. 🔐 **Implementar RLS** — Policies básicas por user
5. 🔐 **Setup Migrations** — Versionamento de schema
6. 🔐 **Criar Indices** — Otimizar queries críticas

### Médio Prazo (P2 — Operacional)
7. 📊 **Backup & Recovery** — Procedimentos testados
8. 📊 **Monitoring & Alertas** — Query performance, disk usage
9. 📊 **Audit Logging** — Track changes para compliance

---

## 7. Próximas Ações

🔴 **BLOQUEADOR:** Nenhuma database física existe ainda

**Recomendação:** Ativar @data-engineer para:
1. Confirmar Supabase como escolha final
2. Desenhar schema completo
3. Criar migration inicial

**Timeline:** 1-2 horas para schema + setup básico

---

**Status:** ⚠️ FASE 2 INCOMPLETA — Aguardando @data-engineer para finalizar design

**Próximo:** FASE 3 (@ux-design-expert - Frontend Spec)
