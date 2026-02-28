# Story: 002 - The Auto-Cert Farmer (Workana Stealth Bot)

## 1. Definição do Problema

O perfil do CEO nas plataformas Freelance (Workana, Upwork) é novo. O algoritmo dessas plataformas recompensa imensamente perfis que possuem dezenas de certificações e medalhas de habilidades aprovadas (ex: Javascript avançado, Python, API Rest). Fazer isso manualmente demora horas valiosas.

## 2. Visão da Solução

A criação de um robô inteligente, residente na infraestrutura local do Mac, acoplado a LLMs locais (Alienware). O robô resolverá em segundos e validará as questões.

## 3. Requisitos da Arquitetura Stealth

Para evitar `bans` por sistemas de *Anti-Scraping / Cloudflare Turnstile*, seguiremos a política de **Acoplamento em Sessão Viva**:

- **Setup Humano:** O usuário inicia o Chrome com a URL de Debugging ativa (`--remote-debugging-port=9222`) e um perfil local (`--user-data-dir`). O usuário acessa a Workana, resolve captchas, faz login manualmente e abre a tela da "Questão 1" da prova.
- **Acoplamento Máquina:** O robô (`cert_farmer.js`) utiliza `puppeteer-core` para se acoplar na porta 9222 desse Chrome já aberto.
- **Processamento:**
  1. Localiza a `Pergunta` no DOM HTML da prova.
  2. Localiza as `Opções` disponíveis.
  3. Dispara a lógica de *Inference* para a LLM (Alienware `100.66.114.87:1234` ou OpenRouter/Claude de fallback).
  4. O robô clica (usando JS puro inserido na página) na resposta selecionada.

## 4. Estrutura Proposta no Codebase

- `src/workers/cert_farmer.js` - O cérebro automotivo.
- `src/workers/launch_chrome.sh` - Um bash utilitário para facilitar a inicialização do browser aberto ao DOM debugging.
- Atualizar `.claude/claude.json` se novos *permissions* (como portas de web socket) precisarem ser explicitados.

## 5. Critérios de Aceitação

- [ ] O Node.js consegue se acoplar a um Chrome externo (`wsEndpoint`).
- [ ] O sistema lê a UI da Workana corretamente (usando `querySelectorAll` no padrão de layout deles).
- [ ] O Alienware recebe o payload, retorna a resposta com alta precisão (em caso de falha da conexão Alienware, ter fallback).
- [ ] O script envia um clique válido no radio button correto da resposta.
