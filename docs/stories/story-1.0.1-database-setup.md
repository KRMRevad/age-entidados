# Story 1.0.1 — Database Setup & Core Schema

**Epic:** Epic 1.0 - Resolução de Débitos Técnicos
**Status:** In Progress
**Assignee:** @dev (Dex)
**Estimate:** 8 hours
**Priority:** 🔴 CRITICAL
**Created:** 2026-02-27
**Dependencies:** None
**Blocks:** Story 1.0.2 (RLS), Story 1.0.3 (API)

---

## Description

Initialize Supabase project and deploy core schema with 4 foundational tables to unblock API development and database operations.

## Acceptance Criteria

- [ ] Supabase project created and accessible
- [ ] 4 core tables deployed (barras_vitais, log_financeiro, orgaos, squads)
- [ ] Indexes created on primary keys and foreign keys
- [ ] Connection pooling configured
- [ ] Local connection tested successfully
- [ ] Backup configured and tested
- [ ] Migration files versioned in Git
- [ ] .env.example updated with Supabase credentials

---

## Tasks

### Task 1: Create Supabase Project
- [ ] Go to supabase.com and create account (if needed)
- [ ] Create new project "Entidados AGE"
- [ ] Set region to us-east-1
- [ ] Configure email for auth
- [ ] Retrieve project URL and API keys
- [ ] Document in .env file

**Acceptance:** Project dashboard accessible, credentials in .env

---

### Task 2: Deploy Core Schema

#### Subtask 2.1: barras_vitais Table
```sql
CREATE TABLE barras_vitais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_atualizacao TIMESTAMP DEFAULT NOW(),

  -- Caixa (R$ disponíveis)
  caixa_valor DECIMAL(15,2) NOT NULL,
  caixa_status TEXT CHECK (caixa_status IN ('CRITICO','ATENCAO','SAUDAVEL')),

  -- Combustível (API Credits %)
  combustivel_pct DECIMAL(5,2) NOT NULL,
  combustivel_status TEXT,

  -- Receita (R$/dia média 7d)
  receita_media_7d DECIMAL(15,2) NOT NULL,
  receita_status TEXT,

  -- Velocidade (tasks/dia)
  velocidade_tasks_dia INT NOT NULL,
  velocidade_status TEXT,

  -- Conversão (%)
  conversao_pct DECIMAL(5,2) NOT NULL,
  conversao_status TEXT,

  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT barras_vitais_one_row CHECK (id = '00000000-0000-0000-0000-000000000001'::UUID)
);
```

#### Subtask 2.2: log_financeiro Table
```sql
CREATE TABLE log_financeiro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_evento TIMESTAMP NOT NULL,

  tipo TEXT NOT NULL CHECK (tipo IN ('ENTRADA','SAIDA','AJUSTE')),
  valor DECIMAL(15,2) NOT NULL,
  descricao TEXT,

  saldo_anterior DECIMAL(15,2),
  saldo_novo DECIMAL(15,2),

  criado_em TIMESTAMP DEFAULT NOW(),

  INDEX idx_log_data (data_evento DESC),
  INDEX idx_log_tipo (tipo)
);
```

#### Subtask 2.3: orgaos Table
```sql
CREATE TABLE orgaos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  funcao TEXT,

  prioridade_survival INT,
  status TEXT DEFAULT 'active',

  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);
```

#### Subtask 2.4: squads Table
```sql
CREATE TABLE squads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,

  orgao_id UUID REFERENCES orgaos(id),
  ativo BOOLEAN DEFAULT true,

  criado_em TIMESTAMP DEFAULT NOW()
);
```

**Acceptance:** All 4 tables exist in Supabase, columns match spec, constraints in place

---

### Task 3: Configure Indexes
- [ ] Create index on log_financeiro.data_evento DESC
- [ ] Create index on log_financeiro.tipo
- [ ] Create index on squads.orgao_id
- [ ] Verify indexes in Supabase UI

**Acceptance:** All indexes visible in database

---

### Task 4: Configure Connection Pooling
- [ ] Enable pgBouncer in Supabase project
- [ ] Set pool size to 10 (default)
- [ ] Retrieve pooling connection string
- [ ] Update .env with pooling URL

**Acceptance:** Connection pooling URL available

---

### Task 5: Test Local Connection
- [ ] Install @supabase/supabase-js
- [ ] Create test script (supabase-test.js)
- [ ] Connect to database
- [ ] Query barras_vitais table
- [ ] Insert test row
- [ ] Verify data persisted
- [ ] Clean up test data

**Test Script:**
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Test connection
const { data, error } = await supabase
  .from('barras_vitais')
  .select('*')
  .limit(1);

if (error) {
  console.error('Connection failed:', error);
  process.exit(1);
}

console.log('✅ Connection successful!');
```

**Acceptance:** Script runs without errors, can query tables

---

### Task 6: Configure Backup
- [ ] Enable daily backups in Supabase settings
- [ ] Set retention to 30 days
- [ ] Test backup restoration (optional)
- [ ] Document backup procedure

**Acceptance:** Backup enabled and tested

---

### Task 7: Commit to Git
- [ ] Create migration files (if using Supabase CLI)
- [ ] Update .env.example with credential format
- [ ] Commit: "feat(db): initialize Supabase and core schema"
- [ ] Push to feature/initial-integration branch

**Acceptance:** All files committed, push ready

---

## Dev Agent Record

### Implementation Notes
- Started: 2026-02-27 10:30 AM
- Approach: Create Supabase project → Deploy schema → Test connection → Commit
- Current step: Task 1 (Create Supabase Project)

### Blocked By
- None (Story 1.0.1 has no dependencies)

### Blocks
- Story 1.0.2 (RLS policies) — Waiting for 1.0.1 to complete
- Story 1.0.3 (API layer) — Waiting for 1.0.1 to complete

### Debug Log
```
[2026-02-27 10:30] Starting Story 1.0.1 implementation
[2026-02-27 10:31] Loaded story file, tasks verified
[2026-02-27] Ready for Task 1: Create Supabase Project
```

### Completion Notes
- [Task 1] Create Supabase Project — ⏳ In Progress
- [Task 2] Deploy Core Schema — ⏳ Pending
- [Task 3] Configure Indexes — ⏳ Pending
- [Task 4] Configure Connection Pooling — ⏳ Pending
- [Task 5] Test Local Connection — ⏳ Pending
- [Task 6] Configure Backup — ⏳ Pending
- [Task 7] Commit to Git — ⏳ Pending

### File List
- docs/stories/story-1.0.1-database-setup.md (NEW)
- supabase-test.js (NEW)
- .env.example (MODIFIED)

### Agent Model Used
- claude-haiku-4-5-20251001

---

## Testing

### Unit Tests
N/A (Database infrastructure story)

### Integration Tests
```bash
# Test script runs without error
node supabase-test.js

# Verify connection
curl $SUPABASE_URL/rest/v1/barras_vitais?limit=1 \
  -H "apikey: $SUPABASE_ANON_KEY"
```

### Smoke Tests
- [ ] Supabase dashboard loads
- [ ] Can view all 4 tables
- [ ] Can insert data
- [ ] Can query data

---

## Change Log

*Changes will be logged here as implementation proceeds*

---

## Status

**Current:** In Progress
**Next:** Execute Task 1 (Create Supabase Project)
**Expected Completion:** 2026-02-27 6 PM (8 hours)

---

*Story created and tracked by @dev (Dex)*
*Last updated: 2026-02-27*
