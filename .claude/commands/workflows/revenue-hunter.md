---
description: Workflow de prospecção e caça de receita — escaneia plataformas e gera propostas
---
# Revenue Hunter — Caçador de Receita

> **Squad:** squad-survival (NEXUS)
> **Prioridade:** P0 em SURVIVAL / P1 em demais modos
> **Frequência:** Diária

## Pré-requisitos

- Scrapling instalado e funcional
- N8N configurado (ou fluxo manual)
- Perfis criados nas plataformas-alvo
- CODEX.md verificado (modo operacional)

## Passos

### 1. Verificar Modo Operacional

- Ler `CODEX.md` → seção "Status Atual do Organismo"
- Se modo = SURVIVAL ou AUSTERITY: executar workflow completo
- Se modo = GROWTH+: executar apenas scan passivo

### 2. Escanear Plataformas

Plataformas-alvo (em ordem de prioridade para LatAm):

| Plataforma | URL | Foco |
|---|---|---|
| Workana | workana.com | IA, automação, dados, Python |
| 99freelas | 99freelas.com.br | Automação, bots, scraping |
| Fiverr | fiverr.com | AI services, automation |
| Upwork | upwork.com | AI/ML, data engineering |
| LinkedIn | linkedin.com/jobs | Freelance/contract AI |

**Filtros de busca:**

- Keywords: `IA`, `automação`, `bot`, `scraping`, `dados`, `n8n`, `API`, `AI`, `automation`, `python`
- Budget mínimo: R$ 200 (ou equivalente)
- Prazo: publicados nos últimos 3 dias
- Tipo: Freelance / Projeto

### 3. Scoring de Oportunidade

Para cada oportunidade encontrada, calcular:

```
Score = (Probabilidade_Fechamento × 0.4) + (Valor × 0.3) + (Fit_Técnico × 0.2) + (Velocidade_Entrega × 0.1)
```

- **Probabilidade:** 0-10 (baseado em competição, clareza do brief, urgência)
- **Valor:** 0-10 (normalizado — R$200=2, R$500=5, R$2000+=10)
- **Fit Técnico:** 0-10 (quanto se alinha com skills existentes)
- **Velocidade:** 0-10 (quanto mais rápido possível, melhor)

**Threshold:** Score ≥ 5.0 para gerar proposta

### 4. Gerar Proposta

Para oportunidades acima do threshold:

- Personalizar template de proposta
- Incluir: entendimento do problema, solução proposta, timeline, preço
- Destacar diferenciais EVAD (IA-first, automação, velocidade)
- Tom: profissional, direto, confiante

### 5. ⚠️ APROVAÇÃO HUMANA

- **PARAR AQUI** — Apresentar proposta para aprovação do operador
- Operador decide: aprovar, ajustar ou rejeitar
- Só após aprovação, enviar proposta

### 6. Registrar

- Registrar oportunidade no CODEX.md (pipeline)
- Se proposta aprovada e enviada: registrar data de envio
- Se projeto fechado: registrar receita no Log Financeiro

## Guardrails Aplicáveis

- `FIN-01`: Nenhuma proposta enviada sem aprovação
- `LEI-03`: Proposta identifica EVAD/operador
- `LEI-05`: Termos claros de preço e entrega
- `SEC-05`: Rate limiting no scraping
