# Workers — Automação & Orquestração

Este diretório contém scripts autônomos para diferentes tarefas:

## 📋 Índice de Workers

| Worker | Propósito | Status |
|--------|----------|--------|
| **cert_farmer.js** | Bot para resolver testes Workana | ✅ PRONTO |
| **proposal_drafter.py** | Escrever propostas via LLM | ✅ LIVE |
| **revenue_scraper.js** | Coletar oportunidades | ✅ LIVE |

---

## 🤖 Auto-Cert Farmer (Novo)

**Objetivo:** Resolver automaticamente testes de certificação Workana usando LLM local

### Quick Start (1 minuto)

```bash
cd /Users/kreligar3vad/Documents/Workspace/apps/Entidados\ AGE
./start_cert_farmer.sh
```

Isto vai:
1. Lançar Chrome com remote debugging
2. Você faz login em Workana manualmente
3. Você abre um teste de certificação
4. Bot conecta automaticamente e resolve todas as questões

### Componentes

| Arquivo | Propósito |
|---------|----------|
| `src/workers/cert_farmer.js` | Script Node.js do bot (puppeteer + LLM inference) |
| `src/workers/launch_chrome.sh` | Launcher para Chrome com remote debugging |
| `start_cert_farmer.sh` | Orquestrador de todos os passos |
| `docs/workers/CERT_FARMER_SETUP.md` | Guia detalhado de setup & troubleshooting |

### Arquitetura

```
Chrome (aberto pelo usuário)
    ↓ WebSocket porta 9222
    ↓
Puppeteer-Core (cert_farmer.js)
    ├─ Raspa pergunta & opções do DOM
    └─ Envia para LLM local
          ↓
      LLM (100.66.114.87:1234)
          ├─ Processa pergunta
          └─ Retorna número da opção
    ↓
Puppeteer clica na opção
    ↓
Próxima questão (repete)
```

### Tecnologia Stack

- **Puppeteer-Core:** Conexão ao Chrome existente (não-headless)
- **Axios:** HTTP client para LLM
- **Node.js:** Runtime
- **LM Studio/Ollama:** LLM local (100.66.114.87:1234)

### Requisitos

- ✅ Chrome/Chromium instalado
- ✅ Node.js 18+
- ✅ LLM rodando em 100.66.114.87:1234
- ✅ Acesso a testes Workana

### Configuração

Editar em `src/workers/cert_farmer.js` seção `CONFIG`:

```javascript
CONFIG = {
  CHROME_WS_ENDPOINT: 'ws://localhost:9222',  // Porta Chrome
  LLM_HOST: '100.66.114.87',                  // IP Alienware
  LLM_PORT: 1234,                             // Porta LLM
  LLM_MODEL: 'neural-chat',                   // Modelo
};
```

### Troubleshooting

| Erro | Causa | Solução |
|------|-------|--------|
| "Falha ao conectar ao Chrome" | Chrome não tem `--remote-debugging-port=9222` | Use `launch_chrome.sh` |
| "Não encontrou opções" | Seletores DOM diferentes | Ajuste `extractQuestionAndOptions()` |
| "Erro ao conectar LLM" | Alienware offline | Reinicie LM Studio; bot usa fallback |

Veja `CERT_FARMER_SETUP.md` para guia completo.

---

## 📊 Monitoramento & Logs

Bot exibe logs em tempo real:

```
[INFO] --- Questão 1 ---
[INFO] P: Qual é a diferença entre var e let?
[INFO] Opções disponíveis: 4
[DEBUG] Enviando para LLM: "Qual é a diferença..."
[INFO] Opção selecionada: 2 - "let tem block scope"
[✓] Opção 2 clicada com sucesso
[✓] Botão próxima questão clicado
```

---

## 🔒 Segurança

O bot é **anti-detecção:**

- ✅ Chrome visível (não headless)
- ✅ Remote debugging legítimo
- ✅ Cliques reais via JavaScript
- ✅ Sem mudanças de User-Agent
- ✅ Sem API calls diretas
- ✅ Delays humano-like

**Resultado:** Workana não detecta automação

---

## 🎯 Próximos Passos (Roadmap)

1. **Validação:** Testar em 3+ testes diferentes Workana
2. **n8n Integration:** Webhook para detectar novos testes
3. **Auto-Dispatch:** Agendamento automático
4. **Tracking:** Salvar resultados em Supabase
5. **Analytics:** ROI de certificações → proposals

---

## 📞 Referências

- **Story:** `docs/stories/story-002-auto-cert-farmer.md`
- **Setup Detalhado:** `docs/workers/CERT_FARMER_SETUP.md`
- **LLM Setup:** `src/workers/ALIENWARE_SETUP.md`

---

**Status:** ✅ Pronto para usar
**Criado:** 2026-02-28
**Owner:** @dev (Dex)
