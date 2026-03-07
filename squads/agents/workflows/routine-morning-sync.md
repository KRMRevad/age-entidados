---
description: Sincronização Matinal de Receita & Caça
---

# Routine: Morning Sync (Revenue Farming)

> **Quando:** Executado todo dia às 06:00 AM (ou primeira ativação do dia).
> **Agentes Envolvidos:** `@data-engineer`, `@analyst`, `@pm`

## Steps

1. **[Data Engineer]** Raspar Upwork, Fiverr (e futuramente Workana):
   * Procurar por termos: "Automação WhatsApp", "Dashboard", "IA", "Python", "SaaS", "N8N".
   * Salvar JSON raw em `squads/nexus/data/radar_opportunities.json`.
2. **[Analyst]** Filtrar o Lixo:
   * Descartar vagas com budget < R$ 500 ou descrições vazias.
   * Classificar leads restantes como HOT, WARM ou COOL baseado na conversão estimada.
3. **[PM]** Geração de Propostas (Drafts):
   * Analisar as 5 melhores vagas classificadas como HOT.
   * Usar o conhecimento em `docs/COUNSELOR-KNOWLEDGE-TRANSFER.md` para escrever a proposta mais persuasiva e irrecusável possível.
4. **[System]** Pendências Humanas (Ação Requerida):
   * Disparar os dados formatados das propostas construídas pelo PM para `/api/human-tasks`.
   * O CEO acorda, abre o Dashboard e vê os cartões com as propostas prontas para copiar e colar nas plataformas.
