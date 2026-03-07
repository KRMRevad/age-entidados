---
description: Monitoramento RSS via N8N e Otimização de Imagem da Marca (AGE/KR)
---

# Routine: Brand Monitoring & Scaling

> **Quando:** Executado continuamente via Webhooks/Triggers no N8N.
> **Agentes Envolvidos:** `@aios-master`, `@ux-design-expert`, `@analyst`

## Objetivos

O objetivo supremo deste workflow é usar o n8n para plugar o RSS/Analytics de todos os perfis públicos e de prospecção (Fiverr, Upwork, LinkedIn, etc.) e garantir que a percepção externa da marca **AGE/KR** seja absolutamente letal, impecável e escalável.

## Steps

1. **[N8N System]** Monitoramento de Tráfego (RSS/API):
   * O n8n coleta em tempo real dados de impressões, cliques e conversões dos Gigs no Fiverr e do perfil no Upwork.
   * Alertas são disparados se as métricas caem abaixo da baseline de performance.
2. **[Analyst]** Análise de Métricas:
   * Processar os dados brutos recebidos do n8n.
   * Identificar quais Gigs/Serviços estão recebendo mais tráfego e quais estão ociosos.
3. **[UX Design Expert]** Auditoria Crítica de Imagem:
   * Periodicamente, o UX Expert analisa as thumbnails, vídeos de portfólio e a copy da descrição de cada serviço.
   * Pergunta principal: *"Essa imagem transmite uma autoridade e uma estética premium de alto ticket?"*
   * Sugere revisões de cor, tipografia ou reescrita de copy para maximizar o ticket médio percebido.
4. **[System]** Pendências Humanas (Ação Requerida):
   * Se for detectada uma oportunidade de otimização clara (ex: "Thumbnail do Gig de N8N está convertendo mal"), disparar um Human Task para aprovar o deploy de novos assets visuais nas plataformas.
