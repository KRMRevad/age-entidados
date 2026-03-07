# 🔍 ORDEM TÁTICA — Squad Hunter

> **De:** Apex (Head AGE) | **Para:** Squad Hunter | **Data:** 2026-03-07
> **Prioridade:** 🔴 MÁXIMA | **Deadline:** 24h

---

## Missão

Gerar lista de **50 leads qualificados por nicho** (150 total) via Google Maps scraping.
Entregar em `data/leads-google-maps.json`.

---

## Queries de Scraping — Google Maps

### Nicho 1: Clínicas

```
"clínica odontológica" + [CIDADE]
"clínica estética" + [CIDADE]
"consultório médico" + [CIDADE]
"clínica dermatologia" + [CIDADE]
"consultório odontológico" + [CIDADE]
```

### Nicho 2: E-commerces

```
"loja virtual" + [CIDADE]  (Google Maps)
site:nuvemshop.com.br [CATEGORIA]  (Google Search)
site:lojaintegrada.com.br [CATEGORIA]  (Google Search)
```

### Nicho 3: Escritórios

```
"escritório de contabilidade" + [CIDADE]
"escritório de advocacia" + [CIDADE]
"escritório de arquitetura" + [CIDADE]
"consultoria empresarial" + [CIDADE]
```

> **[CIDADE]:** Aguardando CEO definir. Default: região metropolitana do CEO.

---

## Dados a Extrair (por lead)

```json
{
  "name": "Nome do Negócio",
  "niche": "clinica|ecommerce|escritorio",
  "phone": "+55...",
  "whatsapp": true|false,
  "email": "contato@...",
  "website": "https://...",
  "address": "Rua..., Cidade-UF",
  "google_rating": 4.5,
  "review_count": 127,
  "has_web_form": true|false,
  "instagram": "@handle",
  "source": "google_maps",
  "scraped_at": "2026-03-07T..."
}
```

---

## Scoring (pós-scraping, via Ollama)

| Critério | Pontos |
|----------|--------|
| Tem site | +20 |
| Tem WhatsApp | +20 |
| Rating ≥ 4.0 | +15 |
| > 50 avaliações | +10 |
| Sem formulário funcional | +15 |
| Tem Instagram ativo | +10 |
| Cidade > 200K hab | +10 |

**Score ≥ 70 = LEAD HOT** → Passa para Closer.
**Score 50-69 = WARM** → Nurturing.
**Score < 50 = COLD** → Ignorar.

---

## Output Esperado

1. `data/leads-google-maps.json` — 150 leads raw
2. `data/leads-scored.json` — Leads com score, ordenados desc
3. `data/leads-hot.json` — Apenas leads HOT (≥70), prontos para Closer

---

## Execução

```bash
cd ~/Documents/Workspace/apps/age && npx claude
```

> "Hunter, varra Google Maps por clínicas odontológicas, escritórios de contabilidade e lojas virtuais em [CIDADE]. Extraia nome, telefone, email, site, rating e avaliações. Salve em data/leads-google-maps.json."
