---
id: TASK-RH-001
nome: "Varredura e Avaliação de Oportunidades (Revenue Hunter)"
tipo: "Worker/Agent"
frequencia: "A cada 4 horas ou sob demanda"
squad: "Nexus"
---

# Descrição Clara

O objetivo desta task é automatizar a prospecção de projetos freelance. O sistema deve varrer plataformas de trabalho (inicialmente Workana), capturar TODAS as informações publicamente disponíveis dos projetos recentes (título, descrição completa, habilidades, orçamento) e avaliá-los contra as regras do `CODEX.md` para filtrar apenas os projetos de alto ROI e adequação técnica.

# Inputs Definidos

- `CODEX.md`: Regras do organismo, tech stack aceitável e limites mínimos de valor.
- URLs de busca predefinidas (ex: workana.com/jobs?category=it-programming).

# Outputs Esperados

- Arquivo JSON `squads/nexus/data/raw_opportunities.json` com os dados brutos.
- Arquivo JSON `squads/nexus/data/radar_opportunities.json` contendo apenas os projetos validados, com score calculado (0 a 10) e justificado.

# Pre-conditions

- Ambiente Python configurado com `httpx` e `beautifulsoup4`.
- Acesso à rede (internet).
- `CODEX.md` deve estar acessível para o agente de triagem ler as regras.

# Post-conditions

- O Dashboard Web deve conseguir ler o novo `radar_opportunities.json` sem falhas.
- Se houver projetos com Score >= 7.0, a task subsequente `TASK-RH-002` (Drafting de Propostas) deve ser disparada.

# Executor Type

- **Scraping**: Worker (Script Python `revenue_scraper.py`).
- **Avaliação/Triagem**: Agent (@analyst / @pm com contexto do Claude).

# Acceptance Criteria

- [ ] O script Python extrai a *descrição completa* do projeto (não apenas o resumo).
- [ ] O script não bloqueia por bot-protection básico (usa headers adequados).
- [ ] O Agente filtra com precisão os projetos que não batem com a tech stack do usuário.
- [ ] O cálculo de Score ($/h) é matemático e normalizado.
- [ ] O JSON final tem a estrutura exata exigida pelo front-end do Dashboard.
