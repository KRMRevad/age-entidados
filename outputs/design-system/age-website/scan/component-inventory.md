# Component Inventory (Atomic Design)

## Atoms (Fundamental Building Blocks)

1. **Button**
   - **Variants:** Primary, Outline, Text (Nav links), Social
   - **Properties:** padding, border-radius (999px), background, color, hover animations (scale, shadow)
   - **Instances:** ~11

2. **Typography Elements**
   - **Variants:** H1, H2, H3, P (body), P (subtitle)
   - **Properties:** font-size (including clamp), font-weight, color, letter-spacing
   - **Instances:** ~15

3. **Badge/Pill**
   - **Variants:** Highlight Badge (Hero), Tech Tag (Case Studies)
   - **Properties:** padding (small), border (subtle), border-radius (999px), background (secondary)
   - **Instances:** ~4

4. **Icon**
   - **Set:** Lucide React (ArrowRight, Code, Database, Sparkles, Target, Zap, Github, Linkedin, Mail)
   - **Instances:** ~9

5. **Image Container**
   - **Variants:** Mockup Image Wrapper, Logo
   - **Properties:** 3D transforms, box-shadows, glass overlays
   - **Instances:** ~4

---

## Molecules (Simple Combinations)

1. **TechCard**
   - **Composition:** Icon + H3 + P + GlassPanel (Atom)
   - **Properties:** padding, gap, flex column, hover translation
   - **Instances:** 3

2. **CaseInfo**
   - **Composition:** H3 + P + TechTags Group (Badge Atoms)
   - **Properties:** flex column, gap
   - **Instances:** 3

3. **SocialLink**
   - **Composition:** Icon + Text (inside Button Atom)
   - **Properties:** flex horizontal, hover inversion
   - **Instances:** 4

---

## Organisms (Complex Sections)

1. **Navbar**
   - **Composition:** Logo (Image + Text) + NavLinks (Text) + CTA (Button)
   - **Behavior:** Fixed positioning, glassmorphism backdrop

2. **HeroSection**
   - **Composition:** Badge + H1 + Subtitle + Action Group (Primary + Outline Buttons)
   - **Behavior:** Framer Motion (opacity, scale)

3. **FeatureDeck (Tech Section)**
   - **Composition:** 3x TechCard
   - **Behavior:** CSS Grid, staggered fade-in animations

4. **CaseStudy Timeline**
   - **Composition:** 3x Alternating Rows (CaseImageWrapper + CaseInfo)
   - **Behavior:** 3D parallax on hover, alternating flex orders

5. **Connect / Footer**
   - **Composition:** Connect Card (H2 + P + SocialLinks) + Footer (Text + Links)
