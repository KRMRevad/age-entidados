---
description: Entrega de Produto e Validação Final
---

# Routine: Product Delivery

> **Quando:** Quando o dev dá merge do código final para um cliente ou micro-SaaS interno.
> **Agentes Envolvidos:** `@dev`, `@qa`, `@devops`, `@pm`

## Steps

1. **[Dev]** Aviso de Code Freeze:
   * Declara que o incremento de produto está pronto para homologação.
2. **[QA]** Teste Impiedoso:
   * O QA lê os PRs e joga dados errados no banco.
   * Faz fuzzing nos formulários.
   * Rejeita o PR implacavelmente se houver 1 erro.
3. **[DevOps]** Preparação Mísseis (Deploy):
   * O DevOps gera as variáveis de ambiente, verifica se a infra free (Vercel) aguenta o bundle size e prepara a nuvem.
4. **[System]** Pendências Humanas:
   * Envia uma Human Task crítica: "Aprovação de Push to Production. Tudo verde pelos testes locais."
5. **[PM]** Handover ao Cliente (Opcional):
   * Se for projeto cliente, o PM gera o draft educado de "Entrega Concluída - Peça o Pagamento Final na Plataforma."
