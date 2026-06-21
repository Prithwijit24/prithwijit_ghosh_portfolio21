# Portfolio Redesign — Design Spec

**Date:** 2026-06-21
**Branch:** `feature/new_style_added`
**Status:** Approved (brainstorming complete), pending spec review

## Goal

Redesign Prithwijit Ghosh's data-science portfolio into a single-scroll,
rainbow-spring-themed experience that keeps a hiring manager engaged for
longer. Reorder to a 9-section narrative, add per-section CSS/SVG 3D scenes
with motion that matches each section, blend section colors smoothly, and
replace the full-page AI-chat section with a popup chat modal launched from
the top navigation bar. Fix all outstanding design/layout bugs along the way.

## Locked Decisions

1. **3D approach:** CSS + SVG only. No new runtime dependencies (no Three.js,
   no R3F). Real depth via `perspective`, `transform-style: preserve-3d`,
   `translateZ`, layered parallax, and animated SVG. Keeps bundle small and
   works on any device a hiring manager might use.
2. **Achievements:** Keep both. Section 2 = headline business metrics
   (big cards). Section 7 = academic honors paired with education cards.
   No content duplication.
3. **New-section content:** Sections 5 (MSc project) and 8 (Certifications)
   ship with clearly-marked `[PLACEHOLDER]` content that the owner swaps in
   later. Styling and 3D scenes are built for real; only copy is pending.
4. **About placement:** Hero stays compact (name, role typewriter, tags,
   metrics panel, Resume). A **"Read my story"** toggle button under the tags
   expands the full About text inline on the first slide — no navigation,
   smooth height + opacity transition, "Show less" collapses it.
5. **Code structure:** Approach A — modular split. Sections, scenes,
   primitives, decorations, and data each get focused files.
6. **Transitions:** Color-blend gradients between sections (accent of current
   flows into accent of next) plus scroll-triggered fade/slide entrances.
   No full-page wipe overlays (too gimmicky for a professional portfolio).

## Non-Goals

- No WebGL / Three.js / React Three Fiber in this revision. The `scenes/`
  folder is the extension point if real 3D is added later.
- No backend, no live AI. The interview chat stays scripted/demo as it is now.
- No routing or multi-page app. Single-scroll experience is preserved.
- No new runtime dependencies. (Dev deps unchanged.)
- No restructuring of the content data that already exists (skills, projects,
  experience, education, achievements) beyond moving it into `data.ts`.

---

## 1. Architecture

### File structure

```
src/
  main.tsx                  App composition + createRoot (~80 lines)
  data.ts                   All content data (NAV, SKILLS, PROJECTS, CERTS, MSC_PROJECT...)
  theme.ts                  SpringAccent type + SECTION_ACCENTS map + transition helpers
  hooks/
    useTypewriter.ts        Moved verbatim from main.tsx
  components/
    primitives.tsx          FadeIn, TiltCard (enhanced 3D), AnimatedCounter, SectionHeading, Reveal, Scene3D
    decorations.tsx         CursorGlow, ScrollProgress, BackToTop, SectionCorners, AmbientGlow
    SiteNav.tsx             Top nav + mobile menu + Interview button
    InterviewChatModal.tsx  New popup (replaces the AI Clone section)
    SectionShell.tsx        Shared wrapper providing color-blend transitions
    scenes/                 One animated CSS/SVG 3D scene per section
      HeroScene.tsx
      SkillsConstellation.tsx
      ExperienceTimeline3D.tsx
      ProjectShowcase.tsx
      MscProjectModel.tsx
      CertRibbon.tsx
      EducationCape.tsx
      ContactOrbit.tsx
  sections/
    Hero.tsx (contains the About toggle + expandable About content inline),
    Achievements.tsx, Skills.tsx, Experience.tsx,
    MscProject.tsx, PortfolioProjects.tsx, Education.tsx, Certifications.tsx, Contact.tsx
  style.css                 Kept + expanded (scenes, transitions, design fixes)
```

Each file has one clear purpose and stays under ~200 lines, so it can be read
and edited in isolation. `scenes/` is the extension point for a future WebGL
layer.

### Color-blend transition system

Per-section accent assignment maps a smooth journey through the rainbow:

| # | Section | Primary accent | Transition into next |
|---|---------|---------------|----------------------|
| 1 | Hero + About | blossom (rose `#fb7185`) | rose → gold |
| 2 | Key Achievements | sunshine (gold `#fbbf24`) | gold → mint |
| 3 | Skills & Expertise | mint (`#34d399`) | mint → sky |
| 4 | Professional Experience | sky (`#38bdf8`) | sky → blossom |
| 5 | MSc Final Project | blossom (rose) | rose → gold |
| 6 | Portfolio Projects | sunshine (gold) | gold → mint |
| 7 | Education & Achievements | mint | mint → sky |
| 8 | Certifications & Workshops | sky | sky → blossom |
| 9 | Get in Touch | blossom (rose) | terminal |

Mechanism (no new deps):
- Each `<section>` renders via a shared `SectionShell` that receives
  `accent` and `nextAccent` props and writes them to CSS custom properties
  `--accent-in` and `--accent-out`.
- `SectionShell::before` is a gradient overlay that fades `--accent-in` into
  `--accent-out` across the bottom 30vh of the section, so each section's
  tail color matches the next section's head color — no hard color cuts.
- The existing negative-margin `blend-section` technique is generalized into
  `SectionShell` so every section flows into the next uniformly.
- `FadeIn` continues to handle entrance animations; a new `Reveal` primitive
  adds scroll-driven 3D entrance (rotateY / translateZ) for scene elements.

### Enhanced 3D primitives

- **`TiltCard` v2:** keeps the current pointer tilt, adds parallax layers
  (children move at different depths via `translateZ`), a glare highlight
  that tracks the cursor, and spring easing on release. Shared by every card
  (skill, experience, project, cert) so sizing and feel are uniform — this
  directly fixes the "cards look uneven" complaint.
- **`Reveal`:** new IntersectionObserver primitive applying section-specific
  3D entrance (e.g. cards fan in from `rotateY(-25deg)`, counters pop with
  scale + blur).
- **`Scene3D` wrapper:** establishes `perspective` + `transform-style:
  preserve-3d` context so each section's scene has real depth without WebGL.

---

## 2. Per-Section Breakout

Every section flows into the next via the color-blend system. "Content"
describes what stays, moves, or is new. "Entrance" is the scroll-triggered
animation. "Scene" is the dedicated CSS/SVG 3D element.

### 1. Hero + About — accent blossom → gold
- **Content:** Compact hero keeps name, typewriter roles, location tags,
  metrics panel, Resume button. New **"Read my story"** toggle under the tags
  expands the full About text (3 paragraphs + quote currently in `#foundation`)
  inline with a smooth height + opacity transition. "Show less" collapses it.
  The standalone About section is removed; its content moves into the hero.
- **Entrance:** hero elements cascade in on load. On toggle, About paragraphs
  reveal with staggered `FadeIn`; quote slides in from the left.
- **Scene — `HeroScene`:** keep the particle network canvas + floating emoji.
  The metrics panel gains parallax depth layers (chart behind, numbers mid,
  glow front) that shift on pointer move via `TiltCard` parallax. Hero glow
  blobs continue to drift.

### 2. Key Achievements — accent gold → mint
- **Content:** the 6 headline metric cards (AIR 7, 38%, 97–99%, 98%, 450+,
  90%) — kept as-is, moved to position 2.
- **Entrance:** cards pop in with `Reveal` (scale + blur), staggered;
  counters animate on view.
- **Scene:** cards sit on a shared **3D podium floor** — a subtle perspective
  grid plane receding into mint; cards lift toward viewer on hover
  (`translateZ`). Unifies card sizes (fixes current unevenness).

### 3. Skills & Expertise — accent mint → sky
- **Content:** the 5 skill domains + level bars + pills — kept.
- **Entrance:** domain cards fan in with 3D `rotateY`, staggered; skill bars
  fill on view (kept).
- **Scene — `SkillsConstellation`:** a rotating orbit/constellation of skill
  emojis around a central core — CSS 3D transforms (`rotateY` on a cylinder
  of nodes), each node a skill-pill on the orbit ring. Pauses on hover;
  respects `prefers-reduced-motion`. Beside the cards on desktop, above on
  mobile.

### 4. Professional Experience — accent sky → blossom
- **Content:** the 3 experience items + timeline — kept.
- **Entrance:** rows slide in from the left (kept); timeline dots pulse in
  sequence.
- **Scene — `ExperienceTimeline3D`:** the vertical timeline becomes a 3D
  depth timeline — nodes recede along a z-axis path, the connecting line is a
  gradient ribbon in 3D space, cards tilt toward the viewer as you scroll
  past. Conveys the career arc.

### 5. MSc Final Project — accent blossom → gold — NEW
- **Content:** `[PLACEHOLDER]` — project title, summary, problem, approach
  (model/methods), results/metrics, tech tags, optional repo link. Styled as
  an expanded project card with a dedicated metrics strip. Owner provides real
  content later; swap-in only.
- **Entrance:** card rises + rotates into view; bullets stagger.
- **Scene — `MscProjectModel`:** a thematic animated SVG model representing
  the project domain. Since the topic is TBD, ship a tasteful generic
  statistics model (3D bell-curve / regression surface in SVG with depth
  shading) and refine once the topic is known.

### 6. Portfolio Projects — accent gold → mint
- **Content:** the existing 3 projects + GitHub "see more" — kept.
- **Entrance:** cards stagger up (kept).
- **Scene — `ProjectShowcase`:** cards become **3D flip cards** — hover flips
  the card to reveal detail bullets on the back; front shows title, summary,
  tags. Unifies card sizes and adds interactivity. Reduced-motion: static
  front only.

### 7. Education & Achievements — accent mint → sky
- **Content:** the 2 education cards (M.Sc. IIT Kanpur, B.Sc. Bidhannagar)
  plus a compact **Academic Achievements** strip — academic honors only
  (JAM AIR 7, CGPA 89.9, Dept ranks), distinct from the headline business
  metrics in section 2. No duplication.
- **Entrance:** edu cards rise; honors strip counts up.
- **Scene — `EducationCape`:** the scholar-hat decor evolves into a 3D
  graduation scene — mortarboard tilts in 3D with a swinging tassel, orbiting
  academic icons. Refined version of the current `ScholarDecor`.

### 8. Certifications & Workshops — accent sky → blossom — NEW
- **Content:** `[PLACEHOLDER]` — grid of cert cards (name, issuer, date,
  credential id/link). 4–6 placeholder cards with clear `[PLACEHOLDER]`
  markers. Owner provides real certs later.
- **Entrance:** ribbon/cards fan in.
- **Scene — `CertRibbon`:** certificates displayed along a gently curving 3D
  ribbon/banner — cards lift and straighten on hover. Reinforces the award
  feel.

### 9. Get in Touch — accent blossom (terminal)
- **Content:** the contact cards (email, phone, GitHub, LinkedIn, resume) —
  kept.
- **Entrance:** cards rise + glow.
- **Scene — `ContactOrbit`:** contact channels as nodes on a slow 3D orbit
  around a central "let's connect" core; clicking a node fires the link.
  Pulls the eye in as the finale.

### Interview Chat Modal (replaces the AI Clone section)
- **Trigger:** the top-nav **Interview** button (replaces the current
  "AI Chat" nav entry) opens a centered modal overlay containing the existing
  chat interface (scripted replies, clearly labeled demo).
- **Behavior:** backdrop blur + fade/scale-in, `Esc` to close, click outside
  to close, focus trapped inside the modal, body scroll locked while open.
  The existing `AICloneChat` UI moves into `InterviewChatModal`.
- **Removed:** the full `#chat` section, its nav entry, and the broken
  `#chat .max-w-4xl { max-width: 336rem !important }` CSS.

---

## 3. Design Bug Audit & Fixes

Concrete problems found while reading `src/main.tsx` and `src/style.css`. All
are fixed as part of the redesign.

| # | Bug (location) | Problem | Fix |
|---|----------------|---------|-----|
| 1 | `.max-w-4xl/5xl/6xl` all = `84rem` (style.css:45–47) | Three differently-named width classes are identical → meaningless; content too wide for "4xl" intent | Distinct max-widths: `4xl→56rem`, `5xl→64rem`, `6xl→72rem`. Remove the 336rem chat hack |
| 2 | `#chat .max-w-4xl { max-width: 336rem !important }` (style.css:614) | Forces chat content absurdly wide → horizontal scroll bug | Removed entirely (chat section deleted; chat lives in modal) |
| 3 | Contact cards mix emoji + SVG icons (main.tsx:1022–1032) | `✉️📞📄` text emojis vs `.contact-card-icon` SVG (1.75rem) → uneven sizes/alignment | All 5 cards use consistent SVG icons at a uniform size; emoji removed |
| 4 | Skills grid 5th card orphaned at `width: calc(50% - 2.5rem)` (style.css:428–429, 729–730) | Last domain card forced to awkward half-width, centered alone | Redesign grid: 5 domains → `repeat(auto-fit, minmax(18rem,1fr))`, all cards equal full width |
| 5 | `.edu-card-top` declared twice (style.css:556 & 579) | Duplicate/conflicting declarations | Consolidate into one rule |
| 6 | `.education-card` `text-align: center` twice (style.css:552 & 566) | Redundant | Merge |
| 7 | Inconsistent emoji/icon sizes across cards | skill-icon 1.2rem, achievement-emoji 1.8rem, edu-icon 1.5rem-in-3rem-box, section-heading 1.35rem-in-2.75rem-box | Tokenize: `--card-icon-box: 2.5rem`, `--card-icon: 1.4rem` applied uniformly via the shared `TiltCard` header |
| 8 | `.hero-title` capped at `3rem` (style.css:354) | Hero name undersized for impact | Raise to `clamp(2.75rem, 7vw, 4.5rem)` |
| 9 | Nav center includes "AI Chat" full-section link (main.tsx:7–16) | Links to section being removed | Replace with **Interview** button → opens modal |
| 10 | Timeline node `left: -0.75rem` overlaps card content on some widths (style.css:497) | Dot can collide with card padding | Move timeline into a dedicated grid column with a consistent gutter; already hidden on mobile |
| 11 | `.scholar-decor` absolute `right/bottom` can overlap edu content mid-width (style.css:278) | Decorative overlap risk | Reposition as a non-overlapping scene element in `EducationCape`; already hidden <820px |
| 12 | Contact section `min-height: 920px` + heavy padding (style.css:617) | Excess empty space | Reduce to `min-height: min(100vh, 720px)`; tighten padding |
| 13 | `.metric-grid strong` two-counter "99%-97%" overflow risk (main.tsx:768) | Inline counters can wrap awkwardly | Wrap in `.metric-value` flex container with `flex-wrap: nowrap`; shrink font on small screens |
| 14 | `.compact-tags` vs `.skill-pill` inconsistent padding/font (style.css:455 vs 513) | Tag styles don't match across sections | Unify into one `.tag-chip` token style used everywhere |
| 15 | Mixed utility-class approach (`bg-white/80`, `border-slate-300` inline in chat JSX) | Tailwind-style classes without Tailwind → brittle, only on chat | Replace with semantic classes; chat moves to modal anyway |

**Result:** uniform card sizing, consistent icon scale, no horizontal-scroll
bug, a single tag-chip style across all sections.

---

## 4. Implementation Order

Built incrementally so the site stays working at every step. Each phase ends
with `npm run build` + `npm run lint` + a manual scroll-through.

**Phase 0 — Scaffold (no visual change)**
- Create folder structure (`components/`, `sections/`, `scenes/`, `hooks/`).
- Extract data → `data.ts`, theme tokens → `theme.ts`, `useTypewriter` → `hooks/`.
- Move existing primitives/decorations into their files verbatim.
- Verify: build + lint green; site pixel-identical.

**Phase 1 — Foundations**
- `theme.ts`: `SECTION_ACCENTS` map and accent CSS variables.
- `SectionShell` component with color-blend gradient transitions.
- Enhanced `TiltCard` (parallax + glare), new `Reveal` primitive, `Scene3D` wrapper.
- Fix width-class bugs (#1), tag-chip unification (#14).
- Verify: transitions render, cards tilt, build green.

**Phase 2 — Reorder + content sections**
- Reorder sections to the 9-section flow.
- Build `Hero` + About toggle, `Achievements`, `Skills`, `Experience`,
  `Education` + honors, `Contact`.
- Apply bug fixes #3, #4, #5, #6, #7, #8, #10, #11, #12, #13.
- Verify: all sections present in order; no layout regressions.

**Phase 3 — New sections (placeholder content)**
- `MscProject` + `Certifications` with `[PLACEHOLDER]` content and their 3D
  scenes (`MscProjectModel`, `CertRibbon`).
- Verify: sections styled; placeholders clearly marked.

**Phase 4 — 3D scenes**
- Implement remaining scenes: `HeroScene`, `SkillsConstellation`,
  `ExperienceTimeline3D`, `ProjectShowcase` (flip cards), `EducationCape`,
  `ContactOrbit`.
- Wire each into its section.
- Verify: scenes animate; respect `prefers-reduced-motion`.

**Phase 5 — Interview modal + nav**
- Remove `#chat` section; delete AI-clone nav entry + buggy CSS (#2, #9, #15).
- Build `InterviewChatModal` (backdrop, Esc/click-outside close, focus trap,
  scroll lock).
- Verify: modal opens/closes correctly from nav on desktop + mobile.

**Phase 6 — Polish & QA**
- Full scroll-through on mobile + desktop widths.
- `prefers-reduced-motion` audit (all scenes degrade gracefully).
- Lighthouse pass (performance, accessibility).
- Final build + lint.

---

## Accessibility & Performance

- All decorative 3D scenes are `aria-hidden="true"` and purely visual.
- Every animation respects `prefers-reduced-motion: reduce` — scenes become
  static, transitions become instant fades. The existing global reduced-motion
  rule is kept and extended to cover new scenes.
- Modal implements focus trap, `Esc` to close, click-outside to close, and
  restores focus to the trigger on close.
- No new runtime dependencies; bundle size stays small.
- Color contrast on accent text/labels is verified against the spring
  backgrounds (existing `--spring-ink` / `#4d7c68` palette is retained).

## Open Items (owner to provide later)

- **MSc Final Project** real content (section 5): title, summary, problem,
  approach, results, tags, optional repo link. Scene topic refinement depends
  on this.
- **Certifications & Workshops** real content (section 8): cert name, issuer,
  date, credential id/link for 4–6 cards.
