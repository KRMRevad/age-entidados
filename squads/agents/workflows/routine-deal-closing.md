---
description: Fechamento de Contratos & Follow-up B2B
---

# Routine: Deal Closing

> **Quando:** Acionado quando um cliente responde no chat/freela ou quando um lead cai no estágio "Negociação" do Kanban.
> **Agentes Envolvidos:** `@pm`, `@architect`, `@qa`

## Steps

1. **[PM]** Análise Psicológica:
   * Analisar a resposta do lead. Ele tem objeções de preço? Objeções técnicas?
2. **[Architect]** Suporte Bélico:
   * Se for uma objeção de tecnologia, o Architect rascunha um diagrama de alto nível ou solta um "jargão técnico" que mostre que dominamos o processo todo.
3. **[System]** Pendências Humanas:
   * Criar um card urgente no `/api/human-tasks`: "Lead X respondeu. O draft de persuasão final está pronto para enviar".
4. **[PM]** Acompanhamento CRM:
   * Mover o card no Kanban. Se pagar, mover para "Start" do Squad de Produto e Registrar Receita no painel vital.
