# 🎯 HUNTER ACTIVATION ORDERS
**Emitido por:** APEX / Orion Head
**Para:** Hunter Squad (Radar + Scoring)
**Data:** 2026-03-08 18:30
**Objetivo:** 5-10 propostas HOT enviadas em 24h | 2 clientes em 7 dias

---

## 🚨 SITUAÇÃO ATUAL

✅ **Pronto:**
- 2 propostas HOT já geradas (Workana)
  - `PROPOSAL-wkn_919751634-HOT.md` (Symfony/DETRAN, USD 1K-3K, Score 85)
  - `PROPOSAL-wkn_581968296-HOT.md` (Shopify UX, USD 15-45/h, Score 85)
- Radar sistema funcional (5 oportunidades HOT detectadas)
- 3 nichos-alvo definidos

⏳ **Faltando:**
- [ ] Scraping manual/automático de Workana (N8N + Shopify keywords)
- [ ] Scraping de 99Freelas (N8N automação)
- [ ] Scraping de Google Maps (clínicas, escritórios)
- [ ] Geração de 3-8 propostas adicionais
- [ ] Disparo via Workana chat + email

---

## 📋 ORDENS DE EXECUÇÃO

### ORDEM 1: CONFIRMAÇÃO DE PROPOSTAS PRONTAS (15 min)
```bash
# Verificar as 2 propostas já criadas
ls -la PROPOSAL-*-HOT.md
wc -l PROPOSAL-*.md
```

**Resultado esperado:**
```
PROPOSAL-wkn_919751634-HOT.md    (Symfony, USD 1K-3K)
PROPOSAL-wkn_581968296-HOT.md    (Shopify, USD 15-45/h)
```

✅ **Ação:** Ambas estão prontas para envio. Proceed to ORDEM 2.

---

### ORDEM 2: SCANNER MANUAL DO RADAR (30 min)

**Objetivo:** Encontrar mais 3-5 projetos HOT (score > 80)

#### A. Workana (Freelance platform — BR)
```bash
# Acesse: https://www.workana.com/browse/jobs
# Filtros:
#   - Categoria: Programação > N8N, Integração, Chatbots, HubSpot
#   - Ou: E-commerce > Shopify
#   - Budget: Aceitar acima de USD 100
#   - Status: Aberto

# Anote projetos que encaixam (copie URL + título)
# Mova para arquivo: /tmp/workana-scan.txt
```

**Target:** 5-10 projetos encontrados

#### B. 99Freelas (Freelance platform — BR)
```bash
# Acesse: https://www.99freelas.com.br/
# Pesquise:
#   - "n8n"
#   - "automação"
#   - "integração"
#   - "shopify"

# Anote Top 3-5 projetos mais novos
# Mova para arquivo: /tmp/99freelas-scan.txt
```

**Target:** 3-5 projetos encontrados

#### C. Google Maps (Local B2B)
```bash
# Mapa: https://maps.google.com
# Pesquisas:
#   - "clínicas odontológicas São Paulo"
#   - "escritórios de advocacia São Paulo"
#   - "e-commerce São Paulo"

# Para cada resultado:
#   1. Clique → Detalhes
#   2. Procure: Website, Telefone, Email
#   3. Nota: {nome} | {tipo} | {telefone/email} → /tmp/maps-scan.txt

# Target: 10-15 leads
```

**Target:** 10-15 leads com contato

---

### ORDEM 3: GENERATE PROPOSALS (45 min)

**Input:** Seus scans de ORDEM 2 (URLs + títulos)

**Ferramenta:** Scripts existentes

```bash
cd /Users/kreligar3vad/Documents/Workspace/apps/age

# Para CADA projeto encontrado em Workana/99Freelas:
# 1. Anote URL e título
# 2. Crie manualmente arquivo PROPOSAL-{ID}-HOT.md baseado no template

# Template Base:
# ---
# # 🔥 PROPOSTA HOT — [TÍTULO]
#
# **ID:** {ID}
# **Score:** 85/100
# **Valor:** {USD}
# **Link:** [URL]
#
# ## Escopo
# [Descrição breve do projeto]
#
# ## 💬 PROPOSTA PRONTA PARA COPIAR/COLAR
# ```
# Olá, [nome cliente],
#
# [Pitch adaptado ao tipo de projeto]
#
# Experiência: [relevante]
# Portfolio: [link ou brief]
#
# Estou à disposição para discussão.
# Obrigado!
# ```
# ---

# Ou use o script automático (se configurado):
# python3 src/workers/proposal_drafter.py --url {URL} --title "{TITLE}"
```

**Target:** 3-5 propostas adicionais geradas → Total 5-7 HOT propostas

---

### ORDEM 4: DISPATCH PROPOSTAS WORKANA (30 min)

**Objective:** Enviar as 5-7 propostas via chat da Workana

**Sequência:**

1. **Acesse Workana** → https://www.workana.com/
2. Para **CADA PROPOSTA gerada:**
   ```
   a) Procure o projeto pelo ID ou título
   b) Clique "Fazer oferta" ou "Enviar proposta"
   c) Copie o texto de PROPOSTA PRONTA (do .md)
   d) Cole no campo
   e) Envie
   f) Anote timestamp de envio
   ```

3. **Log de envios:**
   ```
   PROPOSAL-wkn_919751634-HOT.md → ENVIADO 18:45
   PROPOSAL-wkn_581968296-HOT.md → ENVIADO 18:50
   PROPOSAL-{ID3}-HOT.md → ENVIADO 19:05
   ...
   ```

**Target:** Mínimo 3-5 propostas enviadas hoje | 2-3 adicionais amanhã

---

### ORDEM 5: LOCAL B2B OUTREACH (45 min)

**Objetivo:** Ativar o Closer para cold email + WhatsApp para leads locais

**Sequência:**

1. **Prepare lista de 10 leads locais** (Google Maps scan)
   ```
   Formato: {Nome} | {Tipo: clínica/escritório/ecom} | {Telefone/Email}

   Ex:
   Clínica Dra Silva | Odontologia | (11) 99999-8888 | silva@clinica.com.br
   ```

2. **Delegar para Closer:**
   ```
   Instrução: "Enviar cold email + WhatsApp para 10 leads locais
   sobre Automação Comercial (agendamento automático, CRM, follow-up)

   Template:
   ---
   Olá [Nome],

   Vimos que você está em [Tipo de negócio].
   Temos uma solução rápida de automação que gera
   30% mais vendas/agendamentos sem esforço manual.

   30min de consultoria gratuita?

   Abs,
   APEX
   ---
   "
   ```

3. **KPI:** Enviar até 10 mensagens | Esperar resposta em 24-48h

---

## 📊 CHECKLIST DE EXECUÇÃO

- [ ] **ORDEM 1:** Confirmar 2 propostas prontas (5 min)
- [ ] **ORDEM 2:** Scanner manual (30 min)
  - [ ] Workana: 5-10 projetos anotados
  - [ ] 99Freelas: 3-5 projetos anotados
  - [ ] Google Maps: 10-15 leads anotados
- [ ] **ORDEM 3:** Gerar 3-5 propostas adicionais (45 min)
- [ ] **ORDEM 4:** Enviar 5-7 propostas via Workana (30 min)
- [ ] **ORDEM 5:** Preparar cold outreach local (30 min)

**TEMPO TOTAL:** 2.5-3h de execução manual

---

## 🎯 MILESTONES

| Milestone | Target | Ação |
|-----------|--------|------|
| 5-7 propostas enviadas | Hoje (até 22:00) | Hunter + Closer |
| 1ª resposta positiva | Amanhã (até 18:00) | Orion reviews |
| 1º contrato assinado | Até quarta (dia 3) | CEO negocia |
| 2º contrato assinado | Até sexta (dia 5) | Pipeline acceleration |

---

## 🚨 EMERGENCY PIVOT

SE até segunda-feira (72h) não houver:
- ❌ 2+ respostas positivas de Workana
- ❌ 1+ lead qualificado de local outreach

**ENTÃO:** Pivotar 100% para Nicho 3 (Serviços Locais) com urgência.

---

## 📡 COMMS

**Status Updates:**
- After ORDEM 4: Report ao Orion = "X propostas enviadas, waiting for response"
- After 24h: Report = "Y respostas recebidas, classification: hot/warm/cold"
- After 48h: Report = "Status: contrato em negoção? leads qualificados?"

**Webhook Trigger (quando 1º cliente confirmado):**
```bash
# Disparar webhook N8N: lead-enrichment
curl -X POST https://n8n.your-domain/webhook/lead-enrichment \
  -H "Content-Type: application/json" \
  -d '{"client_name": "...", "project_value": "....", "niche": "..."}'
```

---

## 📌 REMEMBER

- **Dinheiro no banco é a única métrica que importa**
- Follow-up mata a fome — se alguém não responde em 24h, re-contate em 48h
- Score > 80 é OURO — não gaste tempo com < 70
- Portfolio de workflows = moeda → Cada projeto bem-sucedido vira template vendável

---

**Orion Out.** 🎯

*Last updated: 2026-03-08 18:30*
*Status: LIVE — Squads deployed*
