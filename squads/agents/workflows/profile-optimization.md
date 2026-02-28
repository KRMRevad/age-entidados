---
description: Workflow para otimizar perfis de freelancer nas plataformas de trabalho
---
# Workflow: Profile Optimization

> **Owner:** @copywriter (Quill)
> **Trigger:** Criação ou atualização de perfil em qualquer plataforma
> **Frequência:** A cada nova plataforma ou a cada 30 dias

---

## Pré-condições

- Agent @copywriter ativado
- Acesso a `docs/profile_kit.md` e `docs/revenue-hunter-profiles.md`

---

## Steps

### 1. Analisar Plataforma Alvo

Identificar as regras e limitações de cada plataforma:

| Plataforma | Limite Bio | Diferenciadores |
|---|---|---|
| Workana | ~500 chars | Certificações, portfolio visual |
| 99Freelas | ~1000 chars | Skills tags, portfólio links |
| Upwork | ~5000 chars | Specialized profiles, JSS score |

### 2. Ler Perfil Atual

```bash
cat docs/revenue-hunter-profiles.md
```

// turbo

### 3. Aplicar Framework PAS

- **Problem:** Identificar a dor principal da persona-alvo
- **Agitate:** Amplificar o impacto de não resolver
- **Solve:** Posicionar o freelancer como a única solução lógica

### 4. Escrever Copy Otimizado

Gerar `profiles/PROFILE-{platform}.md` com:

- **Headline** (1 linha killer — max 60 chars)
- **Bio Completa** (respeitando limite da plataforma)
- **Skills Tags** (ordenadas por relevância no mercado)
- **Portfolio Descriptions** (1 parágrafo por projeto)

### 5. A/B Suggestions

Fornecer 2 versões de headline para CEO escolher.

### 6. Entregar para Revisão

O CEO revisa e aplica manualmente na plataforma.

---

## Validação

- [ ] Bio dentro do limite de caracteres da plataforma
- [ ] Headline é específica e diferenciadora (não genérica)
- [ ] Skills ordenadas por demanda de mercado
- [ ] Nenhuma buzzword vazia ("guru", "ninja", "rockstar")
