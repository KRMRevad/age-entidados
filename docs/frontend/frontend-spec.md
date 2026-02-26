# Frontend Specification — Entidados AGE

**Data:** 2026-02-26
**Status:** Brownfield Discovery - FASE 3
**Analista:** @architect (Aria) — Pending @ux-design-expert review

---

## 1. Frontend Stack

### Technologies
| Componente | Versão | Função |
|-----------|--------|---------|
| **Framework** | React 19.2.0 | UI rendering |
| **Build Tool** | Vite 7.3.1 | Dev server + bundling |
| **Language** | TypeScript (via JSX) | Type safety |
| **Animations** | Framer Motion 12.34.3 | Motion library |
| **Icons** | Lucide React 0.575.0 | Icon system |
| **Styling** | CSS (vanilla) | Layout + components |
| **Bundler** | Vite + Rollup | Tree-shaking, code splitting |

### Development Environment
- Node.js: ~18+
- npm: ~10.x
- ESLint: 9.39.1
- React Fast Refresh: ✅ Enabled (HMR)

---

## 2. Estrutura de Componentes Detectada

```
src/
├── App.jsx                      [Root component]
├── App.css                      [App styles]
├── main.jsx                     [Entry point]
├── index.css                    [Global styles]
│
├── components/
│   ├── ui/                      [Atomic Design - Atoms/Molecules]
│   │   ├── Button.jsx
│   │   ├── Button.css
│   │   ├── Badge.jsx
│   │   ├── Badge.css
│   │   ├── GlassCard.jsx        [Reusable card component]
│   │   ├── GlassCard.css
│   │   ├── ShowcaseImage.jsx
│   │   └── ShowcaseImage.css
│   │
│   └── organisms/               [Organisms - Composites]
│       ├── Navbar.jsx           [Header navigation]
│       ├── Hero.jsx             [Hero section]
│       ├── Cases.jsx            [Case studies / Portfolio]
│       ├── Footer.jsx           [Footer navigation]
│       └── TechGrid.jsx         [Technology showcase]
│
├── lib/
│   └── animations.js            [Framer Motion presets]
│
└── assets/
    └── react.svg
```

### Component Hierarchy
```
App.jsx
├── Navbar (organism)
├── Hero (organism)
│   └── Button (ui molecule)
├── TechGrid (organism)
│   └── GlassCard (ui molecule)
│       └── Badge (ui atom)
├── Cases (organism)
│   └── ShowcaseImage (ui molecule)
└── Footer (organism)
```

---

## 3. Pages/Screens Identificadas

### Current Pages
| Página | Componente | Propósito | Status |
|--------|-----------|----------|--------|
| **Home/Landing** | `<App/>` | Entrada principal | ✅ Existe |
| **Header** | `<Navbar/>` | Navegação | ✅ Existe |
| **Hero Section** | `<Hero/>` | Value proposition | ✅ Existe |
| **Tech Showcase** | `<TechGrid/>` | Stack visualização | ✅ Existe |
| **Cases/Portfolio** | `<Cases/>` | Case studies | ✅ Existe |
| **Footer** | `<Footer/>` | Links + meta | ✅ Existe |

### Missing Pages
- ❌ Dashboard (referenciado em /dashboard, não em React)
- ❌ Admin Panel (referenciado em /dashboard, não em React)
- ❌ User authentication flows
- ❌ Product pages (individual)
- ❌ Blog / Content hub

---

## 4. Design System

### Componentes UI Detectados

#### Atoms
- **Button**
  - Props: ? (não auditado)
  - Variants: ? (não documentado)
  - Accessibility: ? (não verificado)

- **Badge**
  - Props: ? (não auditado)
  - Variants: ? (não documentado)

#### Molecules
- **GlassCard**
  - CSS backdrop-filter effect (glassmorphism)
  - Used in: TechGrid, Cases
  - Responsive: ? (CSS mobile breakpoints não verificados)

- **ShowcaseImage**
  - Image wrapper com animação?
  - Used in: Cases

#### Organisms
- **Navbar** — Header navigation
- **Hero** — Hero section com CTA
- **TechGrid** — Technology stack display
- **Cases** — Portfolio showcase
- **Footer** — Site footer

### Styling Approach
- **CSS Files:** `App.css`, `index.css`, `GlassCard.css`, `Button.css`, etc.
- **CSS-in-JS:** ❌ Não detectado (no styled-components, no Tailwind)
- **Tailwind CSS:** ❌ Não usado
- **CSS Modules:** ❌ Não detectado
- **Design Tokens:** ❌ Não documentados

---

## 5. Página Home (Landing Page)

### Sections Atuais
1. **Navbar**
   - Logo
   - Navigation menu (?)
   - CTA buttons (?)

2. **Hero Section**
   - Headline
   - Subheadline
   - CTA button(s)
   - Background animation?

3. **TechGrid**
   - Technology stack showcase
   - Icons + labels
   - Glassmorphism design

4. **Cases Section**
   - Case study cards
   - Images
   - Descriptions
   - Links?

5. **Footer**
   - Links
   - Social?
   - Copyright

### Detectados Patterns
- Glassmorphism design (GlassCard)
- Motion animations (Framer Motion)
- Responsive layout (CSS)
- Lucide icons for consistency

---

## 6. Débitos Técnicos Detectados — NÍVEL FRONTEND

### 🔴 CRÍTICOS

| ID | Débito | Impacto | Severidade |
|---|---|---|---|
| FE-001 | Design system não documentado | Inconsistência visual | CRÍTICO |
| FE-002 | Sem testes (component + e2e) | Regressão invisível | CRÍTICO |
| FE-003 | CSS não estruturado (vanilla) | Maintenance nightmare | CRÍTICO |
| FE-004 | Sem prop validation (TypeScript) | Runtime errors | CRÍTICO |
| FE-005 | Sem accessible patterns (a11y) | Compliance risk | CRÍTICO |

### 🟠 ALTOS

| ID | Débito | Impacto | Severidade |
|---|---|---|---|
| FE-006 | Sem error boundary | Crash invisível | ALTO |
| FE-007 | Sem performance optimization | Slow load times | ALTO |
| FE-008 | Sem state management | Props drilling | ALTO |
| FE-009 | Sem SEO optimization | Discovery lost | ALTO |
| FE-010 | Sem analytics | No insights | ALTO |

### 🟡 MÉDIOS

| ID | Débito | Impacto | Severidade |
|---|---|---|---|
| FE-011 | CSS Media queries inline | Hard to maintain | MÉDIO |
| FE-012 | Sem component documentation | Onboarding slow | MÉDIO |
| FE-013 | Sem storybook | Component testing hard | MÉDIO |
| FE-014 | Sem dark mode | UX limitation | MÉDIO |

---

## 7. Responsiveness & Mobile

### Detectado
- CSS media queries: ✅ Presentes
- Mobile breakpoints: ❓ Não verificados
- Touch interactions: ❓ Não verificados
- Viewport meta tag: ❓ Não verificado

### Recomendado
- Mobile-first design
- Touch-friendly buttons (min 44px)
- Responsive typography
- Mobile nav (hamburger?)

---

## 8. Animações (Framer Motion)

### Detectado
- `framer-motion` importado em lib/animations.js
- Animações em componentes (héror TechGrid, Cases?)
- Preset animations no lib/animations.js

### Débito
- ❓ Performance de animações não otimizada
- ❓ Sem reduced-motion preference
- ❓ Não testadas em low-end devices

---

## 9. Accessibility (a11y)

### Detectado
- Lucide icons para consistência ✅
- ESLint rules: ? (não verificado)
- WCAG compliance: ❌ Não auditado

### Recomendado
- [ ] Audit WCAG 2.1 AA
- [ ] Add semantic HTML (header, nav, main, footer)
- [ ] Add ARIA labels onde necessário
- [ ] Keyboard navigation test
- [ ] Screen reader test
- [ ] Color contrast check
- [ ] Prefers-reduced-motion
- [ ] Focus visible styles

---

## 10. Performance

### Current Metrics
- **Bundle Size:** ? (não medido)
- **Lighthouse Score:** ? (não auditado)
- **FCP/LCP:** ? (não medido)
- **CLS:** ? (não measured)
- **TTI:** ? (not measured)

### Recomendado
- [ ] Code splitting por rota
- [ ] Image optimization (WebP, lazy loading)
- [ ] CSS-in-JS → CSS modules
- [ ] Tree-shaking verificado
- [ ] Minification ✅ (Vite default)

---

## 11. Integration com Backend

### Detectado
- ❌ Nenhuma chamada HTTP observada
- ❌ Nenhum estado global (Redux, Zustand, Context)
- ❌ Nenhuma API client

### Recomendado
- Integrar com `/dashboard` API
- Integrar com n8n workflows
- Fetch data client-side ou SSR?
- State management (se complexidade cresce)

---

## 12. Questionário para @ux-design-expert

### Design & UX
- [ ] User journey completo documentado?
- [ ] Design system finalizado? (tokens, grid, typography)
- [ ] Wireframes para mobile + desktop?
- [ ] Prototypes testados com usuários?
- [ ] Information architecture validada?

### Responsive Design
- [ ] Breakpoints definidos? (mobile, tablet, desktop)
- [ ] Touch targets adequados? (min 44px)
- [ ] Navigation responsiva? (hamburger menu?)
- [ ] Images responsivas? (srcset, picture)

### Accessibility
- [ ] WCAG 2.1 AA target confirmado?
- [ ] Keyboard navigation fully testado?
- [ ] Screen reader compatible?
- [ ] Color contrast verified?
- [ ] Focus visible styles present?

### Performance
- [ ] Lighthouse targets definidos?
- [ ] Web Vitals monitored?
- [ ] Image optimization strategy?
- [ ] Font loading strategy?

### Component Library
- [ ] Design tokens documentados? (colors, spacing, typography)
- [ ] Component API bem definida?
- [ ] Storybook necessário?
- [ ] Props validation com TypeScript?

---

## 13. Recomendações Iniciais

### Imediato (P0 — Foundation)
1. 📝 **TypeScript Setup** — Enable strict mode, type all components
2. 🔨 **CSS Architecture** — Migrate to CSS modules or Tailwind
3. 🔨 **Component Props** — Define TypeScript interfaces
4. 🔨 **Error Boundary** — Implement ErrorBoundary component

### Curto Prazo (P1 — Quality)
5. ✅ **Accessibility Audit** — WCAG 2.1 AA compliance
6. ✅ **Unit Tests** — Vitest + React Testing Library
7. ✅ **Storybook** — Component documentation + isolation
8. ✅ **Performance Audit** — Lighthouse scores

### Médio Prazo (P2 — Scalability)
9. 🏗️ **Design System** — Formalize design tokens
10. 🏗️ **State Management** — Zustand or Context API
11. 🏗️ **SEO Optimization** — Meta tags, structured data
12. 🏗️ **Analytics Integration** — Plausible or Vercel Analytics

---

## 14. Próximas Ações

⚠️ **PRECISA VALIDAÇÃO:** @ux-design-expert deve revisar:
1. User journeys e flows
2. Design system completude
3. Responsive design coverage
4. Accessibility compliance

---

**Status:** ⚠️ FASE 3 INCOMPLETA — Aguardando @ux-design-expert para validação

**Próximo:** FASE 4 (@architect - Consolidar DRAFT)
