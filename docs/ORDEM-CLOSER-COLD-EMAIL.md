# 📧 ORDEM TÁTICA — Squad Closer

> **De:** Apex (Head AGE) | **Para:** Squad Closer | **Data:** 2026-03-07
> **Prioridade:** 🔴 MÁXIMA | **Deadline:** Iniciar D+1 após leads HOT

---

## Missão

Configurar cadência de **5 cold emails em 7 dias** para leads HOT (score ≥ 70).
Implementar via **Mailgun + N8N workflow**.

---

## Cadência de Emails

### Email 1 — Dia 1: Abertura (DOR)

**Assunto:** `Vi que a {{EMPRESA}} pode estar perdendo clientes por WhatsApp`

```
Oi {{NOME}},

Encontrei a {{EMPRESA}} no Google Maps — {{RATING}} estrelas com {{REVIEWS}} avaliações. Vocês claramente fazem um trabalho incrível.

Mas percebi uma coisa: quando alguém manda mensagem pelo WhatsApp de vocês fora do horário, o que acontece? Na maioria das {{NICHO_PLURAL}}, a resposta é... nada. E esse cliente vai pro concorrente.

Nós criamos automações com IA que respondem, fazem triagem e até agendam consultas/reuniões — 24 horas por dia, sem contratar ninguém.

Se isso faz sentido pra {{EMPRESA}}, posso mostrar como funciona em 15 min.

Abraço,
{{ASSINATURA}}
```

---

### Email 2 — Dia 3: Valor (EDUCAÇÃO)

**Assunto:** `Como {{NICHO_PLURAL}} estão automatizando o atendimento em 2026`

```
{{NOME}},

Uma tendência que estamos vendo: {{NICHO_PLURAL}} que automatizam o primeiro contato com cliente estão conseguindo:

→ 70% menos mensagens manuais no WhatsApp
→ 60% menos no-shows (com lembretes automáticos)
→ 40% mais conversão de leads (com follow-up em <5 min)

Não é ficção — é N8N + IA. A mesma tecnologia que grandes empresas usam, mas adaptada para negócios como a {{EMPRESA}}.

Se quiser ver exemplos reais, é só responder este email.

{{ASSINATURA}}
```

---

### Email 3 — Dia 5: Case (PROVA)

**Assunto:** `O caso de uma {{NICHO_SINGULAR}} que reduziu no-shows em 60%`

```
{{NOME}},

Semana passada configuramos um sistema de lembretes automáticos para uma {{NICHO_SINGULAR}}. Resultado:

✅ No-shows caíram de 30% para 12%
✅ Recepção parou de ligar para confirmar manualmente
✅ Setup levou 48h, sem mensalidade

Imagina o impacto disso na {{EMPRESA}}: menos buracos na agenda, mais receita por dia, equipe focada no que importa.

Preparei um material com as 5 automações mais relevantes para {{NICHO_PLURAL}}. Posso enviar?

{{ASSINATURA}}
```

---

### Email 4 — Dia 6: Proposta (OFERTA)

**Assunto:** `Preparei algo específico para a {{EMPRESA}}`

```
{{NOME}},

Montei um mini-diagnóstico da {{EMPRESA}} baseado no que vi online:

🔍 Site: {{TEM_SITE}}
🔍 WhatsApp: {{TEM_WHATSAPP}}
🔍 Formulário de contato: {{TEM_FORM}}
🔍 Oportunidade #1: {{DOR_PRINCIPAL}}

Com base nisso, a automação que mais faz sentido pra vocês é: {{AUTOMACAO_RECOMENDADA}}.

Investimento: a partir de R$ {{PRECO_MIN}}.
Tempo de setup: 48h.
Sem mensalidade obrigatória.

Quer agendar 15 min pra eu mostrar ao vivo? Pode ser por WhatsApp ou Google Meet.

{{ASSINATURA}}
```

**Anexar:** Portfolio PDF (gerado pelo Crafter)

---

### Email 5 — Dia 7: Último (URGÊNCIA)

**Assunto:** `Última mensagem — posso ajudar a {{EMPRESA}}?`

```
{{NOME}},

Essa é minha última mensagem sobre isso.

Se automação não é prioridade agora pra {{EMPRESA}}, entendo perfeitamente. Mas se em algum momento vocês sentirem que estão perdendo tempo com tarefas repetitivas ou perdendo clientes por demora no atendimento — meu WhatsApp está aberto:

📱 {{WHATSAPP_CEO}}

Desejo sucesso pra {{EMPRESA}}.

{{ASSINATURA}}
```

---

## Variáveis de Personalização

| Variável | Fonte |
|----------|-------|
| `{{EMPRESA}}` | leads-hot.json → name |
| `{{NOME}}` | Nome do decisor (se disponível, senão omitir) |
| `{{RATING}}` | leads-hot.json → google_rating |
| `{{REVIEWS}}` | leads-hot.json → review_count |
| `{{NICHO_PLURAL}}` | "clínicas" / "lojas virtuais" / "escritórios" |
| `{{NICHO_SINGULAR}}` | "clínica" / "loja virtual" / "escritório" |
| `{{TEM_SITE}}` | "Sim ✅" / "Não ❌" |
| `{{TEM_WHATSAPP}}` | "Sim ✅" / "Não ❌" |
| `{{TEM_FORM}}` | "Sim ✅" / "Não ❌" |
| `{{DOR_PRINCIPAL}}` | Inferida do nicho + dados do lead |
| `{{AUTOMACAO_RECOMENDADA}}` | Baseada na dor principal |
| `{{PRECO_MIN}}` | Pricing matrix → tier 1 |
| `{{WHATSAPP_CEO}}` | .env → WHATSAPP |
| `{{ASSINATURA}}` | Nome CEO + Entidados |

---

## Regras de Envio

| Regra | Valor |
|-------|-------|
| Max emails/dia | 30 |
| Intervalo entre emails | ≥ 2 min |
| Horário de envio | 09h–11h e 14h–16h (horário comercial) |
| Domínio de envio | Mailgun verified domain |
| Track de abertura | Ativado (Mailgun pixel) |
| Se abertura > 20% | Follow-up imediato via WhatsApp |
| Se resposta positiva | CEO assume via Google Meet/WhatsApp |

---

## N8N Workflow Necessário

```
Trigger: Webhook (recebe lista de leads HOT)
  → Node 1: Iterar sobre leads
  → Node 2: Personalizar template com variáveis
  → Node 3: Enviar email via Mailgun
  → Node 4: Aguardar intervalo (2 dias)
  → Node 5: Verificar abertura
  → Node 6: Se abriu → próximo email da cadência
  → Node 7: Se não abriu → skip para email 5
  → Node 8: Log de envio em data/email-cadence-log.json
```

---

## Execução

```bash
cd ~/Documents/Workspace/apps/age && npx claude
```

> "Closer, configure a cadência de cold email conforme docs/ORDEM-CLOSER-COLD-EMAIL.md. Use Mailgun + N8N. Comece pelos leads HOT de data/leads-hot.json."
