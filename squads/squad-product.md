---
description: squad de produto — Receita escalável via micro-SaaS, APIs e templates
---
# Squad Product — 📡 FORGE

> **Órgão:** FORGE (Produtos Digitais & SaaS)
> **Prioridade SURVIVAL:** BAIXA (exceto templates custo zero)
> **Objetivo:** Criar ativos geradores de receita recorrente (MRR)

## Composição

| Agent | Papel no Squad | Ativação |
|---|---|---|
| `@architect` | Arquitetura de micro-SaaS e APIs | `/architect` |
| `@dev` | Desenvolvimento e implementação | `/dev` |
| `@qa` | Testing e qualidade | `/qa` |
| `@devops` | Deploy, CI/CD e infraestrutura | `/devops` |
| `@po` | Product ownership e backlog | `/po` |

## Produtos Planejados

### Fase 1 (SURVIVAL/AUSTERITY — custo zero)

1. **Templates & Prompts** — Pacotes vendidos em Gumroad/Hotmart
2. **Automações N8N** — Workflows pré-configurados
3. **Bots de Telegram/WhatsApp** — Productized services

### Fase 2 (GROWTH)

4. **Micro-SaaS #1** — Identificar dor de mercado, MVP em 2 semanas
2. **API as Service** — GLM5 e outros modelos monetizados
3. **Dashboard EVAD** — Versão SaaS do Entidados para creators

### Fase 3 (EXPANSION)

7. **Marketplace de Automações** — Plataforma de compra/venda de workflows
2. **Enterprise Licensing** — Stack EVAD para empresas

## Workflow Principal

1. **Discovery** (`@po` + `@analyst`): Validar dor de mercado com dados reais
2. **Design** (`@architect`): Arquitetura minimalista, deploy em horas
3. **Build** (`@dev`): Sprint de 1-2 semanas max até MVP
4. **Test** (`@qa`): Smoke tests essenciais apenas
5. **Ship** (`@devops`): Deploy via Vercel/Railway (free tiers)
6. **Iterate** (`@po`): Métricas → decisão: matar, manter ou escalar

## Métricas

- **Produtos lançados/mês:** meta ≥ 1
- **MRR total:** principal KPI de crescimento
- **Churn rate:** meta < 5%/mês
- **LTV/CAC:** meta > 3x

## Guardrails

- Carrega `.aios-core/guardrails.md`
- Deploy APENAS em free tiers durante SURVIVAL/AUSTERITY
- Nenhuma assinatura de serviço sem aprovação (FIN-01)
- Architecture reviews obrigatórios (`@architect`) antes de build
