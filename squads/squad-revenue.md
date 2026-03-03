# Squad 1: Prospecção de Receita (Revenue Farming)

## Missão

Garantir o fluxo contínuo de caixa através da raspagem agressiva, filtragem qualificada e geração de propostas letais para leads B2B em plataformas de freelancer e canais de prospecção fria.

## Membros & Papeis

1. **@data-engineer:** Constrói scrapers indetectáveis, varre a Deep Web do freela (Workana, 99freelas, Upwork), extrai e estrutura todos os dados no data lake raw (`squads/nexus/data/`).
2. **@analyst:** Analisa criticamente o que o data-engineer trouxe. Cruza com os filtros de lucratividade da Entidados, descarta projetos furados, categoriza tiers (HOT, WARM, COOL) e define o score (0-100).
3. **@pm (Optimus):** Maestro da receita. Lê o output final do Analyst e comanda o time (incluindo o @dev se precisar gerar draft técnico) para montar a proposta perfeita e implacável para o CEO copiar/colar.

## Arquitetura de Comunicação (Routine)

- Acionamento via cron local diária (cron_morning_sync).
- Fluxo unidirecional: Data -> Analytics -> Product -> Human Action.
