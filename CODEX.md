# CÓDEX — Metabolismo Central do Entidados

> *"O CÓDEX é o coração que bombeia sangue (dinheiro) para todos os órgãos. Se ele para, tudo para."*

**Versão:** 1.0.0 | **Criado:** 2026-02-24 | **Status:** SURVIVAL MODE 🔴

---

## 1. Identidade

O **Entidados** é o organismo vivo da EVAD DAO. O **CÓDEX** é seu metabolismo — o sistema que regula, distribui e monitora o fluxo de recursos (dinheiro, tokens, energia, tempo) entre todos os órgãos.

### Trindade EVAD

| Dimensão | Acrônimo | Função no Metabolismo |
|---|---|---|
| 🧬 **Ciência** | Encontros Válidos Alimentam Definições | Decisões baseadas em dados reais |
| 💡 **Intuição** | Exumerar Verdade Agora Dentro | Velocidade de ação e instinto |
| 🎨 **Arte** | Estratégia Viável Alcança Densidade | Impacto máximo por ação |

---

## 2. Arquitetura de IA (Brain vs Muscle)

O Entidados divide sua força cognitiva em duas camadas estritas:

### 🧠 O Cérebro (Cloud/Frontier LLMs)

- **Exemplos:** Antigravity, Claude Code, Sonnet 3.5.
- **Papel:** Reflexão, Arquitetura, Planejamento, "Base Intelectual".
- **Comportamento:** Criam os fluxos, desenham os agentes, debugam o núcleo do sistema.

### 💪 O Músculo (Local/Specialized LLMs)

- **Exemplos:** Llama/Qwen locais (Mac ou Alienware), Agentes OpenClaw.
- **Papel:** Execução ultra-verticalizada, sem espaço para reflexão.
- **Comportamento:** Classificam dados de scraping (n8n), geram propostas engessadas, seguem pipelines restritos. Não pensam, apenas processam payloads de A para B.

---

## 2. Barras Vitais

Estas métricas definem a saúde do Entidados. São monitoradas continuamente.

### 💰 CAIXA (Bar Principal)

- **O que mede:** Reais disponíveis para operação
- **Fonte:** Receitas reais minus despesas reais
- **Atualização:** Manual pelo operador (até integração bancária)
- 🔴 Crítico: < R$ 50
- 🟡 Atenção: R$ 50 – R$ 500
- 🟢 Saudável: > R$ 500

### ⛽ COMBUSTÍVEL

- **O que mede:** Créditos de API restantes (todos os providers somados)
- **Fonte:** Dashboards de DeepSeek, OpenRouter, Anthropic, Modal
- **Atualização:** Verificação diária
- 🔴 Crítico: < 5% do budget mensal
- 🟡 Atenção: 5% – 20%
- 🟢 Saudável: > 20%

### 📊 RECEITA

- **O que mede:** Média de R$/dia nos últimos 7 dias
- **Fonte:** Log de entradas financeiras
- 🔴 Crítico: < R$ 50/dia
- 🟡 Atenção: R$ 50 – R$ 200/dia
- 🟢 Saudável: > R$ 200/dia

### 🏃 VELOCIDADE

- **O que mede:** Tasks produtivas concluídas por dia
- **Fonte:** Story completion + commit history
- 🔴 Crítico: < 3/dia
- 🟡 Atenção: 3 – 10/dia
- 🟢 Saudável: > 10/dia

### 🎯 CONVERSÃO

- **O que mede:** % de ações externas que geram receita
- **Fonte:** Propostas enviadas / projetos fechados
- 🔴 Crítico: < 2%
- 🟡 Atenção: 2% – 10%
- 🟢 Saudável: > 10%

---

## 3. Modos de Operação

O Entidados alterna entre modos automaticamente baseado nas barras vitais.

### 🔴 SURVIVAL (Atual)

**Gatilho:** Caixa < R$ 50 OU Combustível < 5%

**Regras:**

- 100% do esforço em ações de receita direta
- Zero experimentação, zero overhead
- Cada prompt deve ter ROI calculável
- Tokens usados apenas para ações com >70% probabilidade de gerar receita em <48h
- Suspensão de processos internos, refatorações, pesquisas exploratórias
- **Mensagem para todos os agents:** *"MODO SOBREVIVÊNCIA. O organismo está em risco. Cada ação deve gerar valor imediato ou será bloqueada."*

### 🟠 AUSTERITY

**Gatilho:** Caixa R$ 50 – R$ 500

**Regras:**

- 80% receita direta, 20% construção de ativos
- Aprovação necessária para qualquer gasto > R$ 5
- Experimentação apenas com custo zero
- Início de construção de pipeline de conteúdo (custo zero)

### 🟢 GROWTH

**Gatilho:** Caixa > R$ 500 E Receita > R$ 50/dia (rolling 7d)

**Regras:**

- 60% receita, 40% construção
- Budget de experimentação: até R$ 20/dia
- Início de micro-SaaS e produtos
- Investimento em marketing de conteúdo

### 🔵 EXPANSION

**Gatilho:** Caixa > R$ 5.000 E MRR > R$ 2.000

**Regras:**

- 40% receita direta, 60% investimento em escala
- Contratação de ferramentas pagas
- Marketing pago com ROI comprovado
- Expansão de operações

### 🟣 DOMINANCE

**Gatilho:** MRR > R$ 20.000

**Regras:**

- Investimento estratégico agressivo
- Aquisição de talentos e ferramentas
- Expansão geográfica e de mercado
- Preparação para captação

---

## 4. Status Atual do Organismo

```yaml
# Atualizar manualmente até integração automatizada
data_atualizacao: "2026-02-24"
modo: SURVIVAL
barras:
  caixa:
    valor: 0
    moeda: BRL
    status: CRITICO
  combustivel:
    api_credits_restantes_pct: 0
    providers:
      deepseek: 0
      openrouter: 0
      anthropic: 0
      modal: 0
    status: CRITICO
  receita:
    media_7d: 0
    status: CRITICO
  velocidade:
    tasks_dia: 0
    status: CRITICO
  conversao:
    pct: 0
    status: CRITICO
meta_anual: 2000000
dias_restantes: 310
necessario_por_dia: 6451
```

---

## 5. Regras de Priorização

Em **qualquer modo**, tasks são priorizadas por:

1. **P0 — Sobrevivência:** Ação que gera receita nas próximas 24h
2. **P1 — Pipeline:** Ação que gera receita nos próximos 7 dias
3. **P2 — Ativo:** Ação que constrói ativo gerador de receita recorrente
4. **P3 — Infraestrutura:** Melhoria interna que aumenta eficiência
5. **P4 — Exploração:** Pesquisa ou experimentação sem ROI garantido

No modo SURVIVAL: Apenas P0 e P1 são executados.
No modo AUSTERITY: P0, P1 e P2.
No modo GROWTH+: Todos os níveis.

---

## 6. Log Financeiro

| Data | Tipo | Valor (R$) | Descrição | Saldo |
|---|---|---|---|---|
| 2026-02-24 | INICIAL | 0.00 | Saldo inicial | 0.00 |

---

## 7. Órgãos do Organismo

### 🧠 NEXUS — Consultoria & Serviços B2B

- **Função:** Receita imediata via serviços de IA, automação e dados
- **Squad:** squad-survival
- **Prioridade no SURVIVAL:** MÁXIMA

### 📡 FORGE — Produtos Digitais & SaaS

- **Função:** Receita escalável via micro-SaaS, APIs, templates
- **Squad:** squad-product
- **Prioridade no SURVIVAL:** BAIXA (exceto templates de custo zero)

### 🎬 SINAL — Conteúdo & Mídia

- **Função:** Autoridade, tráfego e conversão via conteúdo
- **Squad:** squad-content
- **Prioridade no SURVIVAL:** MÉDIA (conteúdo de custo zero gera leads)

### 🏛️ ÁGORA — DAO & Comunidade

- **Função:** Capital social, governança e efeito de rede
- **Squad:** (futuro)
- **Prioridade no SURVIVAL:** MÍNIMA

---

*O CÓDEX é o espelho do organismo. Quando você olha para ele, ele olha de volta.*
