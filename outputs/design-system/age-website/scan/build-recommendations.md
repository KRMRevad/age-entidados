# Build Recommendations (Atomic Components)

## Priority Matrix

### HIGH Priority (Build First)

*These components form the foundation of most UI interactions and layouts.*

1. **Button (`<Button />`)**
   - Must support variants: `primary`, `outline`, `ghost`
   - Must support sizes: `sm`, `md`, `lg`
   - Purpose: Unified action interactions, significantly reduces CSS redundancy.
2. **Badge / TechTag (`<Badge />`)**
   - Must support variants: `subtle`, `outline`
   - Purpose: Status indicators and metadata tagging.
3. **Typography (`<Text />`, `<Heading />`)**
   - Purpose: Centralize `clamp()` logic and standard sizes.

### MEDIUM Priority (Build Second)

*These components combine foundational atoms into reusable layouts.*
4. **GlassCard (`<GlassCard />`)**

- Purpose: Standardize `backdrop-filter` and transparent borders for containers.

5. **Image Container (`<ImageWrapper />`)**
   - Purpose: Reusable 3D hover effects with Framer Motion.

### LOW Priority (Build Last)

*These components are highly context-specific to single sections.*
6. **Hero Section**
7. **Navbar**
8. **Case Timeline**

---

## Suggested Phased Build Strategy

### Phase 1: Core Atoms (1-2 Hours)

- Create `src/components/ui/button.jsx`
- Create `src/components/ui/badge.jsx`
- Extract tokens into a unified `/styles/tokens.css` or keep them in `index.css`.

### Phase 2: Common Molecules (1-2 Hours)

- Create `src/components/layout/glass-card.jsx`
- Adapt `TechCard`, `ConnectCard` to use `<GlassCard />` internally.

### Phase 3: Complex Organisms (3-4 Hours)

- Refactor the giant `App.jsx` into smaller organism chunks: `Hero.jsx`, `Features.jsx`, `Cases.jsx`, `Navbar.jsx`, `Footer.jsx`.
