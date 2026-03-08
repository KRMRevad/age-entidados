# 🔥 HOT PROPOSALS MONITOR — Setup Guide

**Survival Mode Inside Sales Automation**

---

## O QUE ISSO FAZ?

Este sistema automatiza a detecção e formatação de propostas de **alta oportunidade** (score > 80) do pipeline de receita.

### ✨ Funcionalidades

1. **Monitoramento em Tempo Real** 👁️
   - Verifica `squads/nexus/data/radar_opportunities.json` continuamente
   - Detecta novos projetos com score > 80 (HOT)
   - Envia notificações nativas do Mac (push notification)

2. **Geração Automática de Propostas** 📄
   - Cria Markdown formatado e polido na raiz do projeto
   - Nome padrão: `PROPOSAL-{PROJECT_ID}-HOT.md`
   - Pronto para **copiar/colar no chat da Workana**

3. **Gerenciamento de Estado** 💾
   - Rastreia projetos já processados
   - Evita notificações duplicadas
   - Mantém histórico em `.aios/hot-proposals-state.json`

---

## 🚀 INSTALAÇÃO RÁPIDA

### Passo 1: Tornar Scripts Executáveis
```bash
chmod +x scripts/monitor-hot-proposals.py
chmod +x scripts/run-hot-monitor.sh
```

### Passo 2: Executar UMA VEZ (Scan Inicial)
```bash
./scripts/run-hot-monitor.sh
```

**Output esperado:**
```
🔥 age — HOT Proposals Monitor
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 ONE-TIME SCAN — Looking for HOT projects (score > 80)...

🔥 FOUND 2 HOT PROJECTS!

✨ NEW HOT PROJECT DETECTED:
   ID: wkn_919751634
   Title: Desenvolvedor Php/Symfony para Integração...
   Score: 85/100
   Value: USD 1000 - 3000

   📄 Proposta salva: PROPOSAL-wkn_919751634-HOT.md

✨ NEW HOT PROJECT DETECTED:
   ID: wkn_581968296
   Title: Desenvolvedor e Especialista UX para Suporte...
   Score: 85/100
   Value: USD 15 - 45 / hora

   📄 Proposta salva: PROPOSAL-wkn_581968296-HOT.md

✅ State saved. Monitoring 2 HOT projects.
```

### Passo 3: (OPCIONAL) Ativar Watch Mode
```bash
./scripts/run-hot-monitor.sh --watch 30
```

Isso vai:
- Verificar a cada 30 segundos (customizável)
- Enviar notificação Mac quando novo HOT detectado
- Gerar proposta automaticamente
- Rodará até você pressionar `Ctrl+C`

---

## 📱 COMO USAR NO DIA A DIA

### Cenário 1: Scan Manual (when you want)
```bash
cd /Users/kreligar3vad/Documents/Workspace/apps/age
./scripts/run-hot-monitor.sh
```

**Quando usar:**
- Manhã: verificar projetos novos overnight
- Tarde: validar se novos projetos apareceram
- Antes de trabalhar em outras tasks

### Cenário 2: Watch Mode Contínuo (background)
```bash
# Abra um novo terminal e deixe rodando
./scripts/run-hot-monitor.sh --watch 30 &
```

**Quando usar:**
- Durante o dia inteiro (receberá notificações)
- Enquanto trabalha em outras coisas
- Para não perder oportunidades HOT

### Cenário 3: Cron Job (automático)
```bash
# Adicionar ao crontab para executar a cada 15 min
*/15 * * * * cd /Users/kreligar3vad/Documents/Workspace/apps/age && ./scripts/run-hot-monitor.sh >> /tmp/hot-proposals.log 2>&1
```

---

## 📄 ARQUIVOS GERADOS

### Propostas (na raiz do projeto)
```
PROPOSAL-wkn_919751634-HOT.md    ← Symfony/DETRAN (USD 1K-3K)
PROPOSAL-wkn_581968296-HOT.md    ← Shopify UX (USD 15-45/h)
```

**Cada arquivo contém:**
- 📋 Resumo do projeto (scope, skills, valor)
- 💬 Proposta pronta para copiar/colar
- 🚀 Instruções passo-a-passo de envio
- 💡 Dicas insider (probabilidade, estratégia)

### Estado (rastreamento interno)
```
.aios/hot-proposals-state.json   ← Histórico de projetos vistos
```

---

## 🎯 FLUXO COMPLETO: CEO ENVIANDO PROPOSTA

### 1️⃣ Notificação Chega (Mac push notification)
```
🔥 HOT PROJECT ALERT!
Score: 85/100
Desenvolvedor Php/Symfony para... (USD 1000-3000)
```

### 2️⃣ Arquivo Gerado Automaticamente
```
PROPOSAL-wkn_919751634-HOT.md ← Pronto na raiz
```

### 3️⃣ CEO Abre o Arquivo
```markdown
# 🔥 PROPOSTA HOT — Desenvolvedor Php/Symfony...
...
## 💬 PROPOSTA PRONTA PARA COPIAR/COLAR

```
Olá, vi sua necessidade de integrar o Drive Parts ao DETRAN RS...
```
```

### 4️⃣ CEO Copia & Cola na Workana
- Cmd+C na proposta
- Acessa link do projeto na Workana
- Cmd+V no campo de resposta
- Envia!

### 5️⃣ Resposta em 2-4h
- Cliente avalia proposta
- Pode pedir detalhes/entrevista
- Potencial: USD 1K-3K ou receita recorrente

---

## 🔧 TROUBLESHOOTING

### ❌ "File not found: squads/nexus/data/radar_opportunities.json"
**Solução:** Certifique-se que você rodou o revenue hunter pipeline antes:
```bash
python3 scripts/proposal_drafter.py
```

### ❌ Notificações Mac não aparecem
**Solução:** Verifique System Preferences → Notifications → Terminal
Certifique-se que Terminal tem permissão de notificar.

### ❌ "Python3 not found"
**Solução:** Instale Python 3:
```bash
brew install python3
```

### ⚠️ Muitas notificações (watch mode)
**Solução:** Use um intervalo maior:
```bash
./scripts/run-hot-monitor.sh --watch 300   # 5 minutos
```

---

## 📊 MÉTRICAS & MONITORING

### Ver estado atual
```bash
cat .aios/hot-proposals-state.json
```

Output:
```json
{
  "seen_projects": ["wkn_919751634", "wkn_581968296"],
  "last_check": "2026-02-28T10:30:45.123456"
}
```

### Contar HOT projects
```bash
python3 -c "import json; f=open('squads/nexus/data/radar_opportunities.json'); ops=json.load(f); print(f'HOT: {len([p for p in ops if p.get(\"score\", 0) > 80])}')"
```

---

## 🔐 SEGURANÇA & PRIVACIDADE

- ✅ Scripts rodam **localmente** (no seu Mac)
- ✅ Nenhum dado é enviado para servidor externo
- ✅ Estado salvo em `.aios/` (gitignored)
- ✅ Propostas são apenas markdown (não contêm credenciais)

---

## 📚 REFERÊNCIA RÁPIDA

| Comando | O que faz |
|---------|-----------|
| `./scripts/run-hot-monitor.sh` | Scan uma vez |
| `./scripts/run-hot-monitor.sh --watch 30` | Watch mode a cada 30s |
| `cat .aios/hot-proposals-state.json` | Ver estado |
| `ls PROPOSAL-*-HOT.md` | Listar propostas geradas |

---

## 🎓 PRÓXIMOS PASSOS

### Hoje (Survive)
1. ✅ Scripts instalados
2. ✅ Propostas HOT geradas
3. 🔄 **Enviar 2 propostas no chat da Workana**
4. 🔔 Ativar watch mode para novas oportunidades

### Semana 1 (Stabilize)
1. Acompanhar respostas das propostas
2. Negociar com clientes interessados
3. Fechar 1º contrato
4. Analisar ROI

### Semana 2+ (Scale)
1. Automatizar envio via n8n
2. Integrar resposta de clientes
3. Dashboard de conversão
4. Otimizar score (prioritize HOT)

---

## 🚀 BOA SORTE!

Este é seu **Inside Sales Orgânico** automatizado. Use bem! 💰

**Sistema:** age — Revenue Hunter Pipeline (Survival Mode)
**Atualizado:** 2026-02-28
**Versão:** 1.0-beta
