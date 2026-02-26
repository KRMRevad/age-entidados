---
description: Monitora as 5 barras vitais do Entidados e ajusta o modo de operação
---
# Health Check — Monitor de Saúde do Organismo

> **Frequência:** Início de cada sessão de trabalho
> **Responsável:** Qualquer agent (auto-check)
> **Prioridade:** SISTEMA (sempre executa)

## Objetivo

Verificar o estado de saúde do organismo Entidados e garantir que o modo operacional correto está ativo. Todo agent DEVE executar este check antes de iniciar trabalho.

## Passos

### 1. Ler Estado Atual

- Abrir `CODEX.md` → seção "4. Status Atual do Organismo"
- Registrar valores atuais das 5 barras

### 2. Verificar Cada Barra

| Barra | Verificação | Ação se Crítico |
|---|---|---|
| 💰 CAIXA | Valor em R$ | Ativar SURVIVAL MODE |
| ⛽ COMBUSTÍVEL | % de créditos API restantes | Suspender tasks não-essenciais |
| 📊 RECEITA | Média R$/dia (7d) | Escalar squad-survival |
| 🏃 VELOCIDADE | Tasks/dia concluídas | Identificar bloqueios |
| 🎯 CONVERSÃO | % leads→receita | Otimizar propostas |

### 3. Determinar Modo Operacional

```
SE caixa < R$50 OU combustível < 5%:
  modo = SURVIVAL 🔴
SENÃO SE caixa < R$500:
  modo = AUSTERITY 🟠
SENÃO SE caixa > R$500 E receita_7d > R$50/dia:
  modo = GROWTH 🟢
SENÃO SE caixa > R$5000 E mrr > R$2000:
  modo = EXPANSION 🔵
SENÃO SE mrr > R$20000:
  modo = DOMINANCE 🟣
```

### 4. Atualizar CODEX.md

- Atualizar `data_atualizacao` com data atual
- Atualizar `modo` se mudou
- Atualizar valores das barras
- Registrar transição de modo (se houve)

### 5. Notificar Agent Ativo

- Informar ao agent que está operando qual é o modo atual
- Listar restrições do modo (ver CODEX.md seção 3)
- Se transição de modo: alertar operador humano

## Exemplo de Output

```
🫀 HEALTH CHECK — 2026-02-24
━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 CAIXA:      R$ 0,00     🔴 CRÍTICO
⛽ COMBUSTÍVEL: 0%          🔴 CRÍTICO
📊 RECEITA:    R$ 0/dia     🔴 CRÍTICO
🏃 VELOCIDADE: 0 tasks/dia  🔴 CRÍTICO
🎯 CONVERSÃO:  0%           🔴 CRÍTICO
━━━━━━━━━━━━━━━━━━━━━━━━━━━
MODO: 🔴 SURVIVAL
ALERTA: Todas as barras críticas.
       Apenas ações P0 (receita imediata) permitidas.
```

## Guardrails

- Este workflow NÃO tem custo (leitura local)
- Deve ser executado ANTES de qualquer outra ação
- Transição para modo mais restritivo é automática
- Transição para modo menos restritivo requer dados reais confirmados
