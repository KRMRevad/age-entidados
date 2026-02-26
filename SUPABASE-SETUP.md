# Supabase Setup Guide — Entidados AGE

**Story:** Story 1.0.1 - Database Setup & Core Schema
**Status:** Initial Setup Required
**Estimated Time:** 15 minutes

---

## 📋 Pre-requisites

- [ ] Supabase account (free or paid)
- [ ] Node.js 18+ installed
- [ ] npm packages installed (`npm install`)
- [ ] This file open for reference

---

## Step 1: Create Supabase Project

### 1.1 Sign up / Log in
- Go to **https://supabase.com**
- Sign in with email or GitHub
- If new account, verify email

### 1.2 Create New Project
1. Click **"New Project"** button
2. Enter **Project Name:** `Entidados AGE`
3. Set **Database Password:** Create a strong password (save it!)
4. Select **Region:** `us-east-1` (default is OK)
5. Click **"Create New Project"**

### 1.3 Wait for Project to Initialize
- Page shows "Initializing project..."
- Wait 2-3 minutes for Supabase to set up database
- You'll see project dashboard when ready

---

## Step 2: Get Project Credentials

### 2.1 Find Credentials in Dashboard
1. In Supabase dashboard, click **"Settings"** (bottom left)
2. Click **"API"** in left sidebar
3. Copy **Project URL** → This is `SUPABASE_URL`
4. Copy **anon public key** → This is `SUPABASE_ANON_KEY`
5. Copy **service_role key** → This is `SUPABASE_SERVICE_ROLE_KEY`

### 2.2 Example Values (DO NOT USE)
```
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 3: Configure Local Environment

### 3.1 Create .env File
```bash
# From project root directory
cp .env.example .env
```

### 3.2 Edit .env File
Open `.env` and fill in Supabase credentials:

```env
# Copy from Step 2.1 above
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Keep other values from .env.example
```

### 3.3 Verify .env in .gitignore
```bash
# Check that .env is ignored
grep "^\.env$" .gitignore
# Should output: .env
```

---

## Step 4: Deploy Database Schema

### 4.1 Install Supabase CLI (Optional but Recommended)
```bash
npm install -g supabase
supabase login
```

### 4.2 Apply Schema via Supabase Dashboard

**Option A: Manual SQL (Simple)**

1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New Query"**
3. Copy-paste the SQL schema from below
4. Click **"RUN"**
5. Verify tables appear in **"Table Editor"**

**Option B: Using CLI (Advanced)**
```bash
# Create migration file
supabase migration new create_core_schema

# Edit migration file and add schema SQL
# Then apply:
supabase db push
```

### 4.3 Core Schema SQL

Run this SQL in Supabase SQL Editor:

```sql
-- Table 1: barras_vitais (Health metrics)
CREATE TABLE barras_vitais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_atualizacao TIMESTAMP DEFAULT NOW(),

  caixa_valor DECIMAL(15,2) NOT NULL,
  caixa_status TEXT CHECK (caixa_status IN ('CRITICO','ATENCAO','SAUDAVEL')),

  combustivel_pct DECIMAL(5,2) NOT NULL,
  combustivel_status TEXT,

  receita_media_7d DECIMAL(15,2) NOT NULL,
  receita_status TEXT,

  velocidade_tasks_dia INT NOT NULL,
  velocidade_status TEXT,

  conversao_pct DECIMAL(5,2) NOT NULL,
  conversao_status TEXT,

  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT barras_vitais_one_row CHECK (id = '00000000-0000-0000-0000-000000000001'::UUID)
);

-- Table 2: log_financeiro (Financial transactions)
CREATE TABLE log_financeiro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_evento TIMESTAMP NOT NULL,

  tipo TEXT NOT NULL CHECK (tipo IN ('ENTRADA','SAIDA','AJUSTE')),
  valor DECIMAL(15,2) NOT NULL,
  descricao TEXT,

  saldo_anterior DECIMAL(15,2),
  saldo_novo DECIMAL(15,2),

  criado_em TIMESTAMP DEFAULT NOW()
);

-- Table 3: orgaos (Organizational units)
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

-- Table 4: squads (Teams)
CREATE TABLE squads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,

  orgao_id UUID REFERENCES orgaos(id),
  ativo BOOLEAN DEFAULT true,

  criado_em TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_log_financeiro_data ON log_financeiro(data_evento DESC);
CREATE INDEX idx_log_financeiro_tipo ON log_financeiro(tipo);
CREATE INDEX idx_squads_orgao ON squads(orgao_id);
```

### 4.4 Verify Tables Created
- Go to **"Table Editor"** in Supabase dashboard
- You should see 4 tables:
  - ✅ barras_vitais
  - ✅ log_financeiro
  - ✅ orgaos
  - ✅ squads

---

## Step 5: Test Local Connection

### 5.1 Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### 5.2 Run Connection Test
```bash
node supabase-test.js
```

### 5.3 Expected Output
```
🔍 Testing Supabase Connection...

📡 Connecting to Supabase...
  - Testing barras_vitais table...
    ✅ barras_vitais accessible
  - Testing log_financeiro table...
    ✅ log_financeiro accessible
  - Testing orgaos table...
    ✅ orgaos accessible
  - Testing squads table...
    ✅ squads accessible

✅ All tests passed! Connection to Supabase is working.
```

**If you see errors:**
- Check SUPABASE_URL and SUPABASE_ANON_KEY in .env
- Verify tables were created in Supabase dashboard
- Check firewall/network connection

---

## Step 6: Enable Connection Pooling (Optional but Recommended)

### 6.1 In Supabase Dashboard
1. Go to **"Settings"** → **"Database"**
2. Under **"Connection Pooling"**, enable PgBouncer
3. Copy the **"Pooling Connection String"**

### 6.2 Update .env (Optional)
If you want to use pooling:
```env
# For pooled connections (recommended for production)
SUPABASE_URL_POOLING=postgresql://postgres:[password]@[host]:6543/postgres
```

---

## Step 7: Configure Backups

### 7.1 In Supabase Dashboard
1. Go to **"Settings"** → **"Database"** → **"Backups"**
2. **Daily Backups** should be enabled by default
3. Set **Retention** to **30 days** (or your preference)
4. Backups are automatic

### 7.2 Verify Backup Configuration
- You should see "Backups configured" message
- Check back in 24 hours to see first backup

---

## Step 8: Commit Configuration

### 8.1 Stage Files
```bash
git add supabase-test.js SUPABASE-SETUP.md .env.example
git status
```

### 8.2 Commit
```bash
git commit -m "feat(db): add Supabase setup guide and test script

- Create supabase-test.js for connection validation
- Add SUPABASE-SETUP.md with step-by-step guide
- Update .env.example with Supabase credential placeholders

Story 1.0.1: Database Setup & Core Schema"
```

### 8.3 Push
```bash
# When ready to share (after setting up Supabase):
git push origin feature/initial-integration
```

---

## ✅ Checklist

When you've completed all steps, check off:

- [ ] Supabase project created
- [ ] Credentials obtained (URL + API keys)
- [ ] .env file configured with credentials
- [ ] Database schema deployed (4 tables created)
- [ ] Indexes created
- [ ] Local connection test passed
- [ ] Backup configured
- [ ] Files committed to Git

---

## 🚨 Troubleshooting

### "Connection refused"
**Cause:** Wrong Supabase URL or credentials
**Fix:** Double-check SUPABASE_URL and SUPABASE_ANON_KEY in .env

### "Table doesn't exist"
**Cause:** Schema not deployed
**Fix:** Go to Supabase SQL Editor and run the schema SQL again

### "Permission denied"
**Cause:** Using service_role key instead of anon key
**Fix:** Make sure SUPABASE_ANON_KEY (not SERVICE_ROLE_KEY) is used in test script

### "Network error"
**Cause:** Firewall blocking Supabase
**Fix:** Check internet connection, try from different network

---

## 📞 Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.io
- Project Issue: Check Story 1.0.1 in docs/stories/

---

**Next Step:** Run `node supabase-test.js` to verify everything is working!

*Setup guide for Story 1.0.1 — Database Setup & Core Schema*
