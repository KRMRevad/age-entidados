# Pattern Redundancy Analysis

## Overview

The AGE codebase was built with strict adherence to a pre-defined Design System (via `index.css` variables). As a result, CSS Variable usage prevents typical color/spacing chaos.

## 1. Action Elements (Buttons / Links)

- **Total CSS Classes related to buttons/actions:** 4 (`.button-primary`, `.button-outline`, `.header-btn`, `.social-link`)
- **After clustering:** All 4 can be merged into a single `<Button />` React Component with `variant`, `size`, and `asChild` props.
- **Reduction:** 75% redundancy decrease for action UI nodes.

## 2. Spacing Values

- **Identified Values:** `6px`, `8px`, `12px`, `16px`, `24px`, `32px` (2rem), `40px` (2.5rem), `64px` (4rem), `96px` (6rem), `128px` (8rem)
- **Analysis:** Spacing is generally following a 4px/8px base scale natively (`0.5rem`, `1rem`, `1.5rem`, `2rem`).
- **Recommendation:** No severe redundancy. Mapping these specific values tightly to utility classes or inline spacing variables could make them formally reusable.

## 3. Glassmorphism Patterns

- **Instances:** 3 (`.navbar`, `.glass-panel`, `.glass-overlay`)
- **Analysis:** The `backdrop-filter: blur()` effect is written manually multiple times with slight variations (`blur(24px)` vs `blur(12px)` vs gradient overlays).
- **Recommendation:** Unify these under 2 distinct tokens: `effect-blur-heavy` (panels) and `effect-blur-light` (navbar), along with creating a reusable `<GlassContainer>` layout component to prevent CSS duplication.
