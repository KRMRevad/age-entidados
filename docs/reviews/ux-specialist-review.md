# UX/Frontend Specialist Review — age

**Revisor:** @ux-design-expert (Uma)
**Data:** 2026-02-26
**Documento Revisado:** docs/frontend/frontend-spec.md

---

## 1. Débitos Validados ✅

| ID | Débito | Status | Severidade | Horas | Prioridade | Notas |
|---|---|---|---|---|---|---|
| FE-001 | Design system não documentado | ✅ VALIDADO | 🔴 CRÍTICO | 12 | **P1** | Foundation para tudo |
| FE-002 | Sem testes (component + e2e) | ✅ VALIDADO | 🔴 CRÍTICO | 20 | **P1** | Vitest + Playwright |
| FE-003 | CSS não estruturado (vanilla) | ✅ VALIDADO | 🔴 CRÍTICO | 15 | **P1** | Refator para Tailwind |
| FE-004 | Sem prop validation (TypeScript) | ✅ VALIDADO | 🔴 CRÍTICO | 10 | **P1** | Strict mode |
| FE-005 | Sem accessible patterns (a11y) | ✅ VALIDADO | 🔴 CRÍTICO | 16 | **P2** | WCAG 2.1 AA audit |
| FE-006 | Sem error boundary | ✅ VALIDADO | 🟠 ALTO | 4 | **P1** | React ErrorBoundary |
| FE-007 | Sem performance optimization | ✅ VALIDADO | 🟠 ALTO | 12 | **P2** | Code splitting, lazy load |
| FE-008 | Sem state management | ✅ VALIDADO | 🟠 ALTO | 8 | **P2** | Zustand ou Context |
| FE-009 | Sem SEO optimization | ✅ VALIDADO | 🟠 ALTO | 8 | **P1** | React Helmet, Schema |
| FE-010 | Sem analytics | ✅ VALIDADO | 🟠 ALTO | 6 | **P2** | Plausible Analytics |
| FE-011 | CSS media queries inline | ✅ VALIDADO | 🟡 MÉDIO | 6 | **P2** | Responsive design system |
| FE-012 | Sem component documentation | ✅ VALIDADO | 🟡 MÉDIO | 8 | **P2** | Storybook |

---

## 2. Débitos Adicionados (Não Detectados)

| ID | Débito | Severidade | Horas | Notas |
|---|---|---|---|---|
| **FE-013** | Sem design tokens documentados | 🔴 CRÍTICO | 8 | Colors, spacing, typography |
| **FE-014** | Sem mobile-first strategy | 🔴 CRÍTICO | 10 | Responsive breakpoints |
| **FE-015** | Sem dark mode foundation | 🟠 ALTO | 6 | CSS variables approach |
| **FE-016** | Sem icon system documentation | 🟡 MÉDIO | 3 | Lucide React usage guide |
| **FE-017** | Sem form accessibility | 🟠 ALTO | 8 | Form labels, errors, validation |

**Subtotal adicionado:** 35 horas

---

## 3. Respostas às Perguntas do @architect

### ❓ Design system já existe documentado em outro lugar?
❌ **NÃO existe documentação.** Detectei:
- GlassCard component (glassmorphism style)
- Button, Badge atoms
- Lucide icons
- CSS vanilla (inconsistente)

**Precisa formalizar em design system**

### ❓ Responsiveness em mobile é prioridade P0?
✅ **SIM, é CRÍTICO.** Entidados é aplicação financeira:
- Mobile-first é essencial
- ~60% users no mobile (estimativa)
- Reclassificar FE-014 para **P0**

### ❓ WCAG 2.1 AA é obrigatório?
✅ **SIM, recomendado.** Razões:
- Dados financeiros sensíveis
- Potencial usuários com disabilities
- Reputação da marca
- Manutenibilidade (a11y = code quality)

**Priorizadar FE-005 para P1**

### ❓ Precisa de dark mode?
✅ **SIM, mas P2.** Justificação:
- Dashboard financeiro (dark mode típico)
- Menos strain nos olhos (notícia frequente)
- Sistema de design completo primeiro
- P1: Light mode, P2: Dark mode

### ❓ User journeys estão documentadas?
❌ **NÃO ENCONTRADAS.** Detectei apenas:
- Landing page structure (Hero, Cases, Tech)
- Sem flows de interação
- Sem user personas
- Sem user stories

**Precisa criar flowchart de journeys**

### ❓ Analytics é prioridade? (qual ferramenta?)
✅ **SIM, P2.** Recomendação:
- **Plausible Analytics** (privacy-first, EU)
- Alternativa: Vercel Analytics
- Evitar: Google Analytics (LGPD friction)

---

## 4. Design System Proposto

### Tokens Design (FASE 1 - P1)

```yaml
# Design Tokens - age

# Colors
colors:
  primary:
    50: #f0f7ff
    100: #e0efff
    500: #3b82f6  # Brand blue
    900: #1e3a8a

  secondary:
    500: #8b5cf6  # Purple (accent)

  success:
    500: #10b981  # Green

  danger:
    500: #ef4444  # Red

  neutral:
    50: #f9fafb
    100: #f3f4f6
    500: #6b7280
    900: #111827

# Spacing
spacing:
  xs: 0.25rem  # 4px
  sm: 0.5rem   # 8px
  md: 1rem     # 16px
  lg: 1.5rem   # 24px
  xl: 2rem     # 32px

# Typography
typography:
  fonts:
    body: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    mono: 'Fira Code, monospace'

  sizes:
    xs: 12px
    sm: 14px
    base: 16px
    lg: 18px
    xl: 20px
    2xl: 24px

  weights:
    normal: 400
    medium: 500
    semibold: 600
    bold: 700

# Shadows
shadows:
  sm: '0 1px 2px rgba(0,0,0,0.05)'
  md: '0 4px 6px rgba(0,0,0,0.1)'
  lg: '0 10px 15px rgba(0,0,0,0.1)'

# Border Radius
radius:
  sm: 0.25rem
  md: 0.5rem
  lg: 1rem
  full: 9999px
```

### Component Library (FASE 1 - P1)

```
Components (Atoms):
├── Button
│   ├── Variants: primary, secondary, danger, ghost
│   ├── Sizes: sm, md, lg
│   └── States: default, hover, active, disabled
├── Badge
│   ├── Variants: solid, outline
│   └── Colors: primary, success, danger, warning
├── Icon
│   ├── Source: Lucide React
│   └── Sizes: 16, 20, 24, 32px
└── Input
    ├── Types: text, email, password
    └── States: focus, error, disabled

Molecules:
├── TextField
│   ├── Input + Label + Error message
│   └── Validation state
├── Card
│   ├── GlassCard (glassmorphism)
│   ├── Standard card
│   └── Interactive card
└── Alert
    ├── Info, Success, Warning, Error
    └── With icon + close button

Organisms:
├── Navbar
│   ├── Logo
│   ├── Menu (desktop + mobile)
│   └── CTA buttons
├── Hero
│   ├── Headline + Subheadline
│   ├── CTA buttons
│   └── Background animation
└── Dashboard Layout
    ├── Sidebar navigation
    ├── Main content
    └── Header bar
```

---

## 5. Roadmap de Implementação

### FASE 1: Foundation (Semana 1-2)
**Objetivo:** Design system criado, mobile-first ativo

- [ ] FE-013: Design tokens documentados (Figma + code)
- [ ] FE-014: Mobile breakpoints definidos (375px, 768px, 1024px)
- [ ] FE-001: Design system website (Storybook ou Chromatic)
- [ ] FE-003: Refatorar CSS → CSS modules ou Tailwind
- [ ] FE-004: TypeScript strict mode + prop-types
- [ ] FE-006: Error Boundary implementado
- [ ] FE-009: SEO setup (React Helmet + Schema.org)

**Deliverable:** Design system e landing page refatorada

### FASE 2: Quality & Accessibility (Semana 3-4)
**Objetivo:** Testes passando, WCAG 2.1 AA validado

- [ ] FE-002: Vitest setup + component tests (>80% coverage)
- [ ] FE-002: Playwright setup + e2e tests (critical paths)
- [ ] FE-005: a11y audit + fixes (axe-core)
- [ ] FE-017: Form accessibility audit
- [ ] FE-015: Dark mode variables (CSS) preparadas

**Deliverable:** Test suite verde, a11y compliance

### FASE 3: Performance & Scale (Semana 5-6)
**Objetivo:** Performance otimizada, analytics ativa

- [ ] FE-007: Code splitting por rota
- [ ] FE-007: Image optimization (sharp, WebP)
- [ ] FE-007: Lighthouse >90 score
- [ ] FE-008: State management (Zustand) setup
- [ ] FE-010: Analytics (Plausible) integrado
- [ ] FE-012: Storybook + docs completa

**Deliverable:** Fast, scalable, measurable

---

## 6. Priorização Revisada

### P0 — CRÍTICO (Primeira semana)
- [ ] FE-014: Mobile-first + breakpoints
- [ ] FE-013: Design tokens + variables
- [ ] FE-003: CSS refactor (Tailwind recommended)
- [ ] FE-004: TypeScript strict + prop validation
- [ ] FE-006: Error Boundary

**Esforço P0:** 51 horas → **45 horas** (parallelizable)

### P1 — FUNDAÇÃO (Semanas 2-3)
- [ ] FE-001: Design system formalization
- [ ] FE-002: Tests setup + initial coverage
- [ ] FE-009: SEO optimization
- [ ] FE-005: a11y audit (início)
- [ ] FE-017: Form accessibility

**Esforço P1:** 62 horas

### P2 — OTIMIZAÇÃO (Semanas 4+)
- [ ] FE-007: Performance optimization
- [ ] FE-008: State management
- [ ] FE-010: Analytics integration
- [ ] FE-012: Storybook + full docs
- [ ] FE-015: Dark mode

**Esforço P2:** 50 horas

---

## 7. Design System Checklist (P1)

- [ ] Color palette finalized (light + dark)
- [ ] Typography scale defined (6 sizes)
- [ ] Spacing scale defined (8 increments)
- [ ] Component library created (8 atoms, 5 molecules)
- [ ] Responsive breakpoints set (mobile, tablet, desktop)
- [ ] Accessibility patterns documented
- [ ] Component props typed (TypeScript)
- [ ] Storybook deployed
- [ ] Design tokens in CSS variables
- [ ] Figma design file synced

---

## 8. Recomendações Críticas

### 🔴 BLOQUEADOR: CSS Strategy Decision

**Opção 1: Tailwind CSS** (Recomendado)
- ✅ Mobile-first built-in
- ✅ Design tokens via config
- ✅ Performance (tree-shake unused)
- ✅ Large ecosystem
- ⏱️ Tempo: 15 horas refactor

**Opção 2: CSS Modules**
- ✅ Scoped styles
- ✅ No build dependency
- ⚠️ Manual mobile-first
- ⏱️ Tempo: 20 horas refactor

**Opção 3: CSS-in-JS** (Styled Components)
- ✅ Dynamic styling
- ⚠️ Runtime overhead
- ⚠️ Bundle size
- ⏱️ Tempo: 18 horas refactor

**Decisão:** **Tailwind CSS** é recomendado (melhor balance)

---

## 9. Parecer Final

### ✅ VALIDAÇÃO: APPROVED com recomendações

**Débitos FE:** Bem identificados
**Stack proposto:** React 19 + Tailwind + Vitest é ideal
**Design system:** Criticamente necessário
**Timeline:** Realistic (P0 = 45h parallelizable)

### ⚠️ CONDIÇÕES
1. **Tailwind CSS** deve ser decisão HOJE
2. **Mobile-first** deve ser rigoroso
3. **Design tokens** precisam ser living document
4. **a11y** deve ser built-in, não afterthought

### 🎯 Prioridade Crítica
1. Mobile responsiveness (P0)
2. Design tokens (P0)
3. TypeScript strict (P0)
4. Component testing (P1)

---

**Status:** ✅ FASE 6 COMPLETA - Frontend validado e ready to refactor

**Próximo:** FASE 7 (@qa - General quality review)
