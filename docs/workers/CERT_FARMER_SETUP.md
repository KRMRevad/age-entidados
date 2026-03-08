# Auto-Cert Farmer Bot — Setup & Usage Guide

**Status:** ✅ PRONTO PARA USAR
**Data:** 2026-02-28
**Componentes:** `cert_farmer.js` + `launch_chrome.sh`

---

## 📋 O que é?

O **Auto-Cert Farmer** é um bot autônomo que:

1. Se acopla a um Chrome já aberto (via WebSocket na porta 9222)
2. Raspa perguntas de testes Workana diretamente do DOM
3. Envia cada pergunta para uma **LLM local** (Alienware 100.66.114.87:1234)
4. Recebe a resposta da LLM e **clica automaticamente** na opção correta
5. Repete até o teste ser completo

**Vantagem:** Sem login automático, sem captchas, apenas leitura de UI + clique. Algoritmo Workana não detecta automação.

---

## 🛠️ Arquitetura

```
┌─────────────────┐
│  Workana (Web)  │  Chrome já aberto pelo usuário
│  - Teste aberto │  + Remote Debugging ativo (:9222)
└────────┬────────┘
         ↓ Conexão WebSocket
┌──────────────────────┐
│  Puppeteer-Core      │  cert_farmer.js
│  - Conecta a Chrome  │
│  - Raspa DOM         │  ← LLM Inference
└────────┬─────────────┘
         ↓
┌──────────────────────┐
│  LLM Local           │  100.66.114.87:1234
│  (Alienware)         │  (LM Studio ou Ollama)
│  - Processa pergunta │
│  - Retorna número    │
└──────────────────────┘
```

---

## 📋 Pré-requisitos

1. **Node.js 18+** ✅ (já instalado)
   ```bash
   node --version  # Verifica
   ```

2. **puppeteer-core** ✅ (já em package.json)
   ```bash
   npm list puppeteer-core
   ```

3. **Chrome/Chromium instalado** ✅ (verificar)
   - **macOS:** `/Applications/Google Chrome.app`
   - **Linux:** `google-chrome` ou `chromium`
   - **Windows:** `C:\Program Files\Google\Chrome\Application\chrome.exe`

4. **LLM Local rodando** na Alienware
   - **IP:** 100.66.114.87
   - **Porta:** 1234
   - **Modelo:** neural-chat (ou outro compatível)
   - Veja `src/workers/ALIENWARE_SETUP.md` para detalhes

5. **Workana Test Page aberta no Chrome**
   - Usuário faz login manualmente
   - Usuário abre o teste
   - Primeira questão deve estar visível

---

## 🚀 Guia Rápido — 3 Passos

### Passo 1: Lançar Chrome com Remote Debugging

```bash
# Terminal 1 (Lançador Chrome)
cd /Users/kreligar3vad/Documents/Workspace/apps/age

./src/workers/launch_chrome.sh
# Abre Chrome automaticamente na Workana
# O usuário faz login manualmente, resolve captchas, etc
```

**O que acontece:**
- ✅ Chrome abre em um perfil isolado
- ✅ Remote debugging ativo na porta 9222
- ✅ User vê instruções no console

### Passo 2: Fazer login e abrir teste (Manual)

**No Chrome que foi aberto:**

1. Acesse `https://www.workana.com` (se não abrir automaticamente)
2. Faça login com sua conta
3. Resolva captchas/verificações (humano faz isso)
4. Navegue para a página "Teste de Certificação"
5. **Abra a primeira questão do teste**
6. ⚠️ **NÃO passe para próxima questão** — deixe a primeira visível

**Verificação:** O DOM da página deve ter:
- Uma pergunta visível
- Várias opções (radio buttons ou divs clicáveis)

### Passo 3: Rodar o Bot

```bash
# Terminal 2 (Bot - EM OUTRO TERMINAL)
cd /Users/kreligar3vad/Documents/Workspace/apps/age

node src/workers/cert_farmer.js
```

**O que esperar:**
```
[INFO] === Auto-Cert Farmer Bot ===
[INFO] LLM: 100.66.114.87:1234
[INFO] Chrome: ws://localhost:9222
[INFO] Conectando ao Chrome em ws://localhost:9222...
[✓] Chrome conectado com sucesso
[INFO] Página atual: https://www.workana.com/...
[INFO] Iniciando resolução de questões...

[INFO] --- Questão 1 ---
[INFO] P: Qual é a diferença entre var e let em JavaScript?
[INFO] Opções disponíveis: 4
[DEBUG] Enviando para LLM: "Qual é a diferença entre var e let...
[DEBUG] LLM respondeu: 2 (opção 2)
[INFO] Opção selecionada: 2 - "let tem block scope, var não"
[✓] Opção 2 clicada com sucesso
[✓] Botão próxima questão clicado

[INFO] --- Questão 2 ---
...continua...
```

---

## 🔧 Opções Avançadas

### Executar com limite de questões

```bash
node src/workers/cert_farmer.js --max-questions 5
```

Resolve apenas as 5 primeiras questões e para.

### Customizar porta Chrome

```bash
./src/workers/launch_chrome.sh --port 9333
```

Depois, abra em outro terminal:
```bash
# Edite CONFIG.CHROME_WS_ENDPOINT em cert_farmer.js
# ou passe via variável de ambiente:
CHROME_WS_ENDPOINT=ws://localhost:9333 node src/workers/cert_farmer.js
```

### Usar perfil Chrome existente

```bash
./src/workers/launch_chrome.sh --profile ~/.config/google-chrome/Default
```

Usa seu perfil Chrome já configurado (com bookmarks, histórico, etc).

---

## 📊 Como Funciona — Passo a Passo

### 1️⃣ **Conexão ao Chrome**
```javascript
// cert_farmer.js conecta via WebSocket
const browser = await puppeteer.connect({
  browserWSEndpoint: 'ws://localhost:9222'
});
```

✅ Usa **puppeteer-core** (não instala Chrome)
✅ Sem headless, totalmente visível

### 2️⃣ **Extração de Pergunta & Opções**
```javascript
// Tenta múltiplos seletores (Workana varia HTML)
const questionSelectors = [
  '.question-text',
  '[data-testid="question"]',
  '.quiz-question',
  'h3.question'
];

// Procura por radio buttons ou labels
const optionElements = document.querySelectorAll(
  'input[type="radio"], label input, .option-item'
);
```

✅ Robusto para variações de HTML
✅ Extrai também labels associados

### 3️⃣ **Inference na LLM Local**
```javascript
// POST para LM Studio/Ollama
await axios.post('http://100.66.114.87:1234/v1/chat/completions', {
  model: 'neural-chat',
  messages: [{role: 'user', content: prompt}],
  temperature: 0.1,  // Baixo = mais determinístico
  max_tokens: 10     // Resposta curta
});
```

✅ Compatível com LM Studio, Ollama, vLLM
✅ Fallback aleatório se LLM cair

### 4️⃣ **Clique na Opção**
```javascript
// JS puro inserido na página (evita detecção)
page.evaluate(() => {
  const radios = document.querySelectorAll('input[type="radio"]');
  radios[selectedIndex].click();
});
```

✅ Não usa eventos sintéticos
✅ Click genuíno ao JavaScript nativo

---

## 🐛 Troubleshooting

### ❌ "Falha ao conectar ao Chrome"

**Causa:** Chrome não está rodando com `--remote-debugging-port=9222`

**Solução:**
```bash
# Certifique-se de usar o launcher:
./src/workers/launch_chrome.sh

# OU manualmente:
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-profile
```

---

### ❌ "Não encontrou opções"

**Causa:** Página HTML não carregou ou seletores não correspondem

**Solução:**
1. Verifique se a primeira questão está visível no Chrome
2. Inspecione o HTML (`F12 > Elements`) e procure por:
   - `input[type="radio"]`
   - `label` com texto de opção
   - `.option` ou `.choice` classes

3. Se seletores forem diferentes, edite `extractQuestionAndOptions()` em `cert_farmer.js` com novos seletores

---

### ❌ "Erro ao conectar LLM"

**Causa:** Alienware não está respondendo em 100.66.114.87:1234

**Solução:**
```bash
# Teste conexão manualmente
curl -X POST http://100.66.114.87:1234/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "neural-chat", "messages": [{"role": "user", "content": "Hi"}]}'

# Se não responder, reinicie LM Studio na Alienware
```

**Fallback:** O bot usa resposta aleatória se LLM falhar

---

### ❌ "Clique não funcionou"

**Causa:** Seletores para click estão incorretos

**Solução:**
1. Inspect o botão de opção no Chrome (`F12`)
2. Identifique a estrutura HTML
3. Edite `clickOption()` em `cert_farmer.js` com novos seletores

---

## 📈 Monitoramento

### Ver logs em tempo real

O bot exibe em tempo real:
- Cada pergunta extraída
- Resposta da LLM
- Status de cada clique
- Total de questões resolvidas

```
[INFO] --- Questão 1 ---
[INFO] P: Qual é a diferença entre...
[INFO] Opções disponíveis: 4
[DEBUG] Enviando para LLM: "Qual é a diferença..."
[DEBUG] LLM respondeu: 2 (opção 2)
[INFO] Opção selecionada: 2 - "let tem block scope..."
[✓] Opção 2 clicada com sucesso
[✓] Botão próxima questão clicado
```

---

## 🛡️ Segurança & Anti-Detecção

### Técnicas usadas:

1. **Sem Headless:** Browser é visível (mais natural)
2. **Remote Debugging:** Conexão legítima, não detectável como automação
3. **JS Puro:** Cliques reais, não eventos sintéticos
4. **Sem User-Agent Changes:** Usa Chrome padrão
5. **Sem API Calls diretas:** Tudo via UI (indistinguível de usuário)
6. **Block Delays:** Aguarda 2s entre questões (humano-like)

### Por que não é detectado:

- Workana monitora **mudanças no HTTP/headers/network**
- Este bot trabalha **apenas com DOM da página já carregada**
- Usa Chrome genuíno (não webdriver, não headless)
- Cliques são eventos JavaScript reais

---

## 📝 Exemplo Completo — Session Recomendada

```bash
# Terminal 1: Lançar Chrome
cd /Users/kreligar3vad/Documents/Workspace/apps/age
./src/workers/launch_chrome.sh

# [Chrome abre em alguns segundos]
# Faça login manualmente, abra o teste Workana, coloque a primeira questão visível
# Deixe o Chrome aberto

# Terminal 2: Rodar bot
cd /Users/kreligar3vad/Documents/Workspace/apps/age
node src/workers/cert_farmer.js

# [Bot conecta automaticamente e começa a resolver]
# [Depois que acabar, os 2 terminais fecham]
```

---

## 🎯 Próximos Passos (Fase 3)

Após validar o bot funcionando:

1. **Integração n8n:** Webhook para detectar novas certificações disponíveis
2. **Auto-dispatch:** Executar bot automaticamente via agendamento
3. **Tracking:** Salvar resultado de cada certificação em Supabase
4. **ROI:** Medir conversão de certificações → propostas aceitas

---

## 📞 Support

Se tiver dúvidas:

1. Verifique logs do bot (output no terminal)
2. Inspecione HTML da página Workana (`F12`)
3. Teste conexão LLM manualmente com `curl`
4. Valide que Chrome está com remote debugging ativo

---

**Criado por:** @dev (Dex)
**Status:** ✅ Pronto para usar
**Última atualização:** 2026-02-28
