---
description: Rastreia custo por token e otimiza alocação de recursos de API
---
# Token Optimizer — Otimizador de Recursos

> **Frequência:** Semanal (ou quando combustível < 20%)
> **Responsável:** @analyst ou operador
> **Prioridade:** P3 (GROWTH+) / P1 (se combustível crítico)

## Objetivo

Garantir que cada centavo gasto em API gera o máximo retorno. Rastrear custos, identificar desperdícios e otimizar alocação.

## Passos

### 1. Inventário de Providers

Verificar saldos em cada provider de API:

| Provider | Dashboard | Custo/1M tokens | Uso Principal |
|---|---|---|---|
| DeepSeek | platform.deepseek.com | ~$0.14 | Tarefas gerais (mais barato) |
| OpenRouter | openrouter.ai | Variável | Multi-model routing |
| Anthropic | console.anthropic.com | ~$3-15 | Tasks complexas |
| Modal | modal.com | Pay-per-use | GLM5 hosting |

### 2. Análise de Custo por Ação

Para cada tipo de ação, calcular custo médio:

| Ação | Tokens Médios | Custo Estimado | ROI |
|---|---|---|---|
| Proposta de freelance | ~2000 tokens | ~R$ 0.05 | R$ 500+ (se fecha) |
| Script de conteúdo | ~5000 tokens | ~R$ 0.12 | Variável (views) |
| Código (dev task) | ~3000 tokens | ~R$ 0.07 | Incluso no projeto |
| Análise de mercado | ~4000 tokens | ~R$ 0.10 | Informacional |
| Brainstorm | ~8000 tokens | ~R$ 0.20 | Incerto |

### 3. Regras de Otimização

**Em SURVIVAL:**

- Usar DeepSeek para TUDO que for possível (custo mínimo)
- Anthropic APENAS para tasks com ROI comprovado > R$ 50
- Zero prompts exploratórios ou de brainstorm
- Máximo 50% do budget diário em uma única task

**Em AUSTERITY:**

- DeepSeek para tasks gerais
- OpenRouter para tasks que precisam de qualidade específica
- Anthropic para propostas de alto valor ou arquitetura crítica

**Em GROWTH+:**

- Usar cada provider conforme sua força
- Experimentação limitada permitida (10% do budget)

### 4. Relatório Semanal

```
📊 TOKEN OPTIMIZER — Semana DD/MM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Gasto total API: R$ X.XX
Tokens utilizados: XXX,XXX
Custo médio/token: R$ 0.XXXX
ROI estimado: R$ XXX.XX

Top 3 ações mais caras:
1. [ação] — R$ X.XX — ROI: [sim/não]
2. [ação] — R$ X.XX — ROI: [sim/não]
3. [ação] — R$ X.XX — ROI: [sim/não]

Recomendações:
- [otimização 1]
- [otimização 2]
```

### 5. Atualizar CODEX.md

- Atualizar barra ⛽ COMBUSTÍVEL
- Registrar gasto semanal no Log Financeiro
- Ajustar budget diário se necessário (com aprovação)

## Guardrails

- `FIN-04`: Respeitar budget diário por modo
- `FIN-05`: Todo gasto registrado com motivo e resultado
- Se combustível < 5%: ALERTAR operador imediatamente
