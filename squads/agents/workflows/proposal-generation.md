---
description: Workflow para gerar propostas de freelance a partir de vagas raspadas
---
# Workflow: Proposal Generation Pipeline

> **Owner:** @copywriter (Quill)
> **Trigger:** Novas vagas em `squads/nexus/data/raw_opportunities.json` com `status: "raw"`
> **Frequência:** Sob demanda ou quando @sm detectar HOT leads

---

## Pré-condições

- Arquivo `squads/nexus/data/raw_opportunities.json` existe e contém vagas
- Diretório `proposals/` existe (criar se necessário)
- Agent @copywriter ativado no terminal

---

## Steps

### 1. Carregar Contexto do Agente

```
Ler squads/agents/copywriter.md para absorver as regras de qualidade
Ler docs/profile_kit.md para contexto do freelancer
```

### 2. Ler Oportunidades Brutas

```bash
cat squads/nexus/data/raw_opportunities.json | jq '.[] | select(.platform != "")' 
```

// turbo

### 3. Classificar por Prioridade

Para cada vaga, avaliar:

- **Score de Fit:** Match entre skills da vaga e stack do freelancer
- **Score de Valor:** Recompensa vs. esforço estimado
- **Score de Urgência:** Prazo de inscrição + competição estimada

Ordenar: HOT (>80) → WARM (50-80) → COOL (<50)

### 4. Escrever Propostas (Começar pelas HOT)

Para cada vaga HOT/WARM, produzir `proposals/PROPOSAL-{platform}-{id}.md`:

```markdown
# 🔥 PROPOSTA — {Título da Vaga}

**Plataforma:** {platform}
**Score:** {score}/100
**Valor:** {rewardRaw}
**Link:** [{url}]({url})

---

## 💬 PROPOSTA PRONTA PARA ENVIO

```text
{TEXTO DA PROPOSTA AQUI — Seguindo AIDA}
```

---

## 📋 Análise Interna (Não Enviar)

- Probabilidade estimada: X%
- Diferenciadores chave: ...
- Riscos: ...
- Tempo estimado de execução: ...

```

### 5. Consolidar Lote do Dia
Criar `proposals/batch-{YYYY-MM-DD}.md` com resumo de todas as propostas geradas.

### 6. Notificar CEO
Informar ao CEO:
- Quantas propostas foram geradas
- Quais são HOT (prioridade de envio)
- Links diretos para cada arquivo de proposta

---

## Validação

- [ ] Cada proposta segue estrutura AIDA
- [ ] Nenhum template genérico
- [ ] Primeira frase é um hook específico para aquela vaga
- [ ] Valor e prazo mencionados explicitamente
- [ ] Arquivo salvo em `proposals/PROPOSAL-{platform}-{id}.md`
