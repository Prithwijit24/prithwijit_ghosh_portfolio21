# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio into a 9-section rainbow-spring single-scroll narrative with per-section CSS/SVG 3D scenes, color-blend transitions, About folded into the hero behind a toggle, the interview chat moved to a popup modal, and all known design bugs fixed.

**Architecture:** Approach A — modular split. `src/main.tsx` becomes a thin composition root; content lives in `data.ts`; theme tokens in `theme.ts`; reusable primitives, decorations, nav, modal, and one scene-per-section in `components/`; each section in `sections/`. CSS/SVG 3D only (no WebGL, no new deps). Color-blend transitions via a shared `SectionShell` writing accent CSS variables.

**Tech Stack:** React 19, TypeScript, Vite 8. Verification per phase: `npm run build` + `npm run lint` + manual browser scroll-through.

**No-test constraint:** This codebase has no test framework and the locked spec forbids new dependencies, so this plan does **not** use TDD. Each phase's verification gate is the production build, the linter, and a visual scroll-through (optionally via the `browser-testing-with-devtools` skill). Where pure logic is added, it is kept small and deterministic so build+lint+manual check is sufficient.

**Spec:** `docs/superpowers/specs/2026-06-21-portfolio-redesign-design.md`

**Conventions for this plan:**
- "Move verbatim from `main.tsx:A-B`" means copy those exact lines unchanged. Do not rewrite moved code.
- Every task ends with a commit. Never batch multiple features in one commit.
- If `npm run lint` fails on moved code, fix the specific lint error only — do not refactor.
- The full current source is `src/main.tsx` (1044 lines) and `src/style.css` (737 lines). Re-read the referenced line ranges before editing.

---

## File Structure

Files created or modified. Each has one responsibility.

```
src/
  main.tsx                    MODIFY → thin composition root (~80 lines)
  data.ts                     CREATE → all content data
  theme.ts                    CREATE → SpringAccent type + SECTION_ACCENTS + helpers
  hooks/useTypewriter.ts      CREATE → moved verbatim
  components/
    primitives.tsx            CREATE → FadeIn, TiltCard (v2), AnimatedCounter, SectionHeading, Reveal, Scene3D
    decorations.tsx           CREATE → CursorGlow, ScrollProgress, BackToTop, SectionCorners, AmbientGlow
    SiteNav.tsx               CREATE → nav + mobile menu + Interview button
    InterviewChatModal.tsx    CREATE → popup modal
    SectionShell.tsx          CREATE → color-blend transition wrapper
    Icons.tsx                 CREATE → all SVG icon components (moved + new)
    scenes/
      HeroScene.tsx           CREATE → particle canvas + parallax panel layers
      SkillsConstellation.tsx CREATE → rotating 3D orbit of skill nodes
      ExperienceTimeline3D.tsx CREATE → 3D depth timeline
      ProjectShowcase.tsx     CREATE → 3D flip cards
      MscProjectModel.tsx     CREATE → animated SVG bell-curve model
      CertRibbon.tsx          CREATE → 3D ribbon of cert cards
      EducationCape.tsx       CREATE → refined scholar scene
      ContactOrbit.tsx        CREATE → 3D orbit of contact nodes
  sections/
    Hero.tsx                  CREATE → hero + About toggle
    Achievements.tsx          CREATE
    Skills.tsx                CREATE
    Experience.tsx            CREATE
    MscProject.tsx            CREATE (placeholder content)
    PortfolioProjects.tsx     CREATE
    Education.tsx             CREATE → edu cards + academic honors strip
    Certifications.tsx        CREATE (placeholder content)
    Contact.tsx               CREATE
  style.css                   MODIFY → fix bugs + add scene/transition/modal styles
```

---

## Phase 0 — Scaffold (no visual change)

**Phase exit gate:** `npm run build` green, `npm run lint` green, site renders pixel-identical to current.

### Task 0.1: Create folder structure

**Files:** Create empty dirs `src/hooks`, `src/components`, `src/components/scenes`, `src/sections`.

- [ ] **Step 1: Create the directories**

```bash
mkdir -p src/hooks src/components/scenes src/sections
```

- [ ] **Step 2: Verify**

```bash
ls -d src/hooks src/components src/components/scenes src/sections
```
Expected: all four paths printed, no errors.

### Task 0.2: Extract data into `src/data.ts`

**Files:**
- Create: `src/data.ts`
- Reference: `src/main.tsx:7-37` (NAV_SECTIONS, NAV_CENTER_SECTIONS, PROFILE_LINKS, ROLES, DS_ICONS), `534-592` (types + SKILL_DOMAINS, EXPERIENCE_ITEMS, PROJECTS, ACHIEVEMENTS_DATA)

- [ ] **Step 1: Create `src/data.ts`**

Move verbatim from `main.tsx` into `data.ts`:
- Lines `7-16` (NAV_SECTIONS const + `as const`)
- Lines `18-20` (NAV_CENTER_SECTIONS)
- Lines `22-28` (PROFILE_LINKS)
- Lines `30-35` (ROLES)
- Lines `37` (DS_ICONS)
- Lines `534-536` (type SkillDomain, ExperienceItem, ProjectItem)
- Lines `538-544` (SKILL_DOMAINS)
- Lines `546-567` (EXPERIENCE_ITEMS)
- Lines `569-583` (PROJECTS)
- Lines `585-592` (ACHIEVEMENTS_DATA)

At the top of `data.ts` add the type import line that the types need (none — they're plain TS types). Add `export` to every `const` and `type`. Add `export` to the three type declarations (`SkillDomain`, `ExperienceItem`, `ProjectItem`).

Also add these NEW placeholder data exports for the new sections:

```typescript
/* ───────── MSc Final Project (PLACEHOLDER — replace with real content) ───────── */
export type MscProject = {
  title: string;
  summary: string;
  problem: string;
  approach: string;
  results: { label: string; value: string }[];
  tags: string[];
  link?: string;
};

export const MSC_PROJECT: MscProject = {
  title: '[PLACEHOLDER] MSc Final Project Title',
  summary: '[PLACEHOLDER] One-line summary of the MSc Statistics final project at IIT Kanpur. Replace with the real one-line description.',
  problem: '[PLACEHOLDER] Describe the problem the project solves. Replace with the real problem statement.',
  approach: '[PLACEHOLDER] Describe the model/methods used (e.g. Bayesian hierarchical model, time-series decomposition, GLM). Replace with the real approach.',
  results: [
    { label: 'Metric 1', value: '[P]' },
    { label: 'Metric 2', value: '[P]' },
    { label: 'Metric 3', value: '[P]' }
  ],
  tags: ['[tag 1]', '[tag 2]', '[tag 3]']
  // link: 'https://github.com/Prithwijit24/...'  // add when available
};

/* ───────── Certifications & Workshops (PLACEHOLDER — replace with real content) ───────── */
export type Certification = {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  link?: string;
};

export const CERTIFICATIONS: Certification[] = [
  { name: '[PLACEHOLDER] Certification Name', issuer: '[Issuer]', date: '[Month YYYY]', credentialId: '[ID]', link: '#' },
  { name: '[PLACEHOLDER] Certification Name', issuer: '[Issuer]', date: '[Month YYYY]', credentialId: '[ID]', link: '#' },
  { name: '[PLACEHOLDER] Certification Name', issuer: '[Issuer]', date: '[Month YYYY]', credentialId: '[ID]', link: '#' },
  { name: '[PLACEHOLDER] Certification Name', issuer: '[Issuer]', date: '[Month YYYY]', credentialId: '[ID]', link: '#' }
];
```

- [ ] **Step 2: Verify it compiles in isolation**

```bash
npx tsc --noEmit src/data.ts
```
Expected: no errors. (If `tsc` complains about config, run `npm run build` instead — it runs `tsc -b`.)

### Task 0.3: Create `src/theme.ts`

**Files:** Create: `src/theme.ts`

- [ ] **Step 1: Create the file**

```typescript
export type SpringAccent = 'blossom' | 'sunshine' | 'mint' | 'sky';

export const ACCENT_HEX: Record<SpringAccent, string> = {
  blossom: '#fb7185',
  sunshine: '#fbbf24',
  mint: '#34d399',
  sky: '#38bdf8'
};

export const ACCENT_HEX_SOFT: Record<SpringAccent, string> = {
  blossom: '#fecdd3',
  sunshine: '#fde68a',
  mint: '#a7f3d0',
  sky: '#bae6fd'
};

/**
 * Ordered section flow. Each entry is the accent for that section and the
 * accent the section should blend INTO at its bottom (i.e. the next
 * section's accent). The last section blends into itself (terminal).
 */
export type SectionAccent = { accent: SpringAccent; nextAccent: SpringAccent };

export const SECTION_ACCENTS: Record<string, SectionAccent> = {
  home:          { accent: 'blossom',  nextAccent: 'sunshine' },
  achievements:  { accent: 'sunshine', nextAccent: 'mint' },
  skills:        { accent: 'mint',     nextAccent: 'sky' },
  experience:    { accent: 'sky',      nextAccent: 'blossom' },
  msc:           { accent: 'blossom',  nextAccent: 'sunshine' },
  projects:      { accent: 'sunshine', nextAccent: 'mint' },
  education:     { accent: 'mint',     nextAccent: 'sky' },
  certifications:{ accent: 'sky',      nextAccent: 'blossom' },
  contact:       { accent: 'blossom',  nextAccent: 'blossom' }
};

/** Returns the two CSS color stops for a section's bottom-blend overlay. */
export const blendStops = (key: string): { from: string; to: string } => {
  const { accent, nextAccent } = SECTION_ACCENTS[key] ?? SECTION_ACCENTS.home;
  return { from: ACCENT_HEX[accent], to: ACCENT_HEX[nextAccent] };
};
```

- [ ] **Step 2: Verify**

```bash
npm run build
```
Expected: green (file not imported yet, but must compile).

### Task 0.4: Move `useTypewriter` to `src/hooks/useTypewriter.ts`

**Files:**
- Create: `src/hooks/useTypewriter.ts`
- Reference: `src/main.tsx:445-465`

- [ ] **Step 1: Create the hook file**

Move lines `445-465` (the `useTypewriter` function) verbatim into `src/hooks/useTypewriter.ts`. Add `export` before `const useTypewriter`. Add `import { useEffect, useRef, useState } from 'react';` at the top. Add `import { ROLES } from '../data';` and replace the inline `ROLES` reference (the hook closes over `ROLES`).

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: green. (The old copy still exists in `main.tsx`; both compile. Removal happens in Phase 0 cleanup.)

### Task 0.5: Create `src/components/Icons.tsx`

**Files:**
- Create: `src/components/Icons.tsx`
- Reference: `src/main.tsx:829-876` (SparklesIcon, SendIcon, GitHubIcon, LinkedInIcon, DownloadIcon, MenuIcon, CloseIcon, QuoteIcon, LoaderIcon)

- [ ] **Step 1: Create the file**

Move all eight icon components (lines `829-876`) verbatim. Add `export` to each. Add `import { type ReactNode } from 'react';` if any icon uses ReactNode (none do — they only use `className`). No react import needed for JSX with the React 19 automatic runtime.

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: green.

### Task 0.6: Create `src/components/primitives.tsx` (moved primitives only — v1)

**Files:**
- Create: `src/components/primitives.tsx`
- Reference: `src/main.tsx:264-311` (TiltCard, ScrollProgress — temporarily here; ScrollProgress moves to decorations next task), `476-531` (SectionHeading, FadeIn, AnimatedCounter), `594-610` (SkillBar)

In this task, move these primitives VERBATIM (no v2 enhancement yet — that's Task 1.4). Enhancement later keeps the diff reviewable. Note: `ScrollProgress` is NOT moved here — it goes directly into `decorations.tsx` in Task 0.7.

- [ ] **Step 1: Create `primitives.tsx`**

Move verbatim:
- Lines `264-293` (TiltCard v1)
- Lines `476-482` (SectionHeading)
- Lines `484-500` (FadeIn)
- Lines `502-531` (AnimatedCounter)
- Lines `594-610` (SkillBar)

Add `export` to each component and the `FadeInProps` / `AnimatedCounterProps` types. Add top imports:
```typescript
import { type ReactNode, useEffect, useRef, useState } from 'react';
import type { SpringAccent } from '../theme';
```
The `SkillBar` uses `SpringAccent` — import the type from `../theme` (do not redefine it).

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: green.

### Task 0.7: Create `src/components/decorations.tsx`

**Files:**
- Create: `src/components/decorations.tsx`
- Reference: `src/main.tsx:40-130` (DataNetworkCanvas), `132-149` (DataFloatIcons), `151-172` (SectionCorners + SECTION_CORNERS), `174-229` (ScholarDecor — NOTE: will be replaced by EducationCape in Phase 4, keep verbatim for now), `231-262` (CursorGlow), `295-311` (ScrollProgress), `313-327` (BackToTop)

- [ ] **Step 1: Create `decorations.tsx`**

Move verbatim with `export` added:
- Lines `40-130` (DataNetworkCanvas)
- Lines `132-149` (DataFloatIcons)
- Lines `151-172` (SECTION_CORNERS const + SectionCorners + CornerIcons type)
- Lines `174-229` (ScholarDecor)
- Lines `231-262` (CursorGlow)
- Lines `295-311` (ScrollProgress)
- Lines `313-327` (BackToTop)

Top imports needed:
```typescript
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { DS_ICONS } from '../data';
```
(`DataFloatIcons` uses `DS_ICONS`; `DataNetworkCanvas` uses only React hooks.)

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: green.

### Task 0.8: Create `src/components/SiteNav.tsx` (v1 — current behavior)

**Files:**
- Create: `src/components/SiteNav.tsx`
- Reference: `src/main.tsx:329-442` (SiteNav), `7-20` (NAV_SECTIONS, NAV_CENTER_SECTIONS)

In this task, move SiteNav VERBATIM with current nav entries (the "AI Chat" entry stays for now; it's replaced in Phase 5). Keeps the site working mid-refactor.

- [ ] **Step 1: Create `SiteNav.tsx`**

Move lines `329-442` verbatim. Add `export`. Top imports:
```typescript
import { useEffect, useState } from 'react';
import { NAV_SECTIONS, NAV_CENTER_SECTIONS, PROFILE_LINKS } from '../data';
import { GitHubIcon, LinkedInIcon, DownloadIcon, MenuIcon, CloseIcon } from './Icons';
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: green.

### Task 0.9: Rewrite `src/main.tsx` as composition root importing the moved modules

**Files:**
- Modify: `src/main.tsx` (rewrite — keep only App + the inline section components + render call for now)

- [ ] **Step 1: Rewrite `main.tsx`**

Replace the top of `main.tsx` (lines `1-442` and `445-610` and `829-876` — all the moved code) with imports. The section components that are NOT yet extracted (SkillsSection `614-640`, ExperienceSection `642-676`, ProjectsSection `678-714`, EducationSection `716-759`, HeroSignalPanel `761-783`, AchievementsSection `786-806`, DataNodesAnimation `808-826`, AICloneChat `878-914`, and the App `916-1044`) STAY in `main.tsx` for now — they get extracted in Phase 2.

The new top of `main.tsx`:

```typescript
import { type FormEvent, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

import {
  PROFILE_LINKS,
  SKILL_DOMAINS, EXPERIENCE_ITEMS, PROJECTS, ACHIEVEMENTS_DATA
} from './data';
import { useTypewriter } from './hooks/useTypewriter';
import {
  FadeIn, SectionHeading, AnimatedCounter, TiltCard, SkillBar
} from './components/primitives';
import {
  CursorGlow, ScrollProgress, BackToTop, DataNetworkCanvas, DataFloatIcons,
  SectionCorners, ScholarDecor
} from './components/decorations';
import { SiteNav } from './components/SiteNav';
import {
  SparklesIcon, SendIcon, LoaderIcon, QuoteIcon, GitHubIcon, LinkedInIcon
} from './components/Icons';
```

Then keep the inline section components (SkillsSection, ExperienceSection, ProjectsSection, EducationSection, HeroSignalPanel, AchievementsSection, DataNodesAnimation, AICloneChat, TypewriterText) and the App component and the `createRoot` render. Remove the duplicate definitions of moved symbols (ROLES is used by TypewriterText — but TypewriterText uses `useTypewriter()` which now imports ROLES internally, so TypewriterText itself doesn't need ROLES; verify and remove the ROLES const from main.tsx).

Keep the `import.meta.url` resume reference only in `data.ts` (it's already there in PROFILE_LINKS). Remove any duplicate from main.tsx.

- [ ] **Step 2: Build and lint**

```bash
npm run build && npm run lint
```
Expected: both green. If lint flags unused imports in main.tsx (because some moved symbols are no longer referenced), remove the unused import lines.

- [ ] **Step 3: Manual scroll-through**

```bash
npm run dev
```
Open the dev URL, scroll all sections. Expected: visually identical to before the refactor (same layout, same animations, same section order). This is the Phase 0 exit gate.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: extract data, theme, hooks, primitives, decorations, icons, nav into modules

No visual change. main.tsx is now a composition root importing the
extracted modules. Phase 0 scaffold complete."
```

---

## Phase 1 — Foundations

**Phase exit gate:** color-blend transitions render between sections; enhanced TiltCard tilts with parallax + glare; build + lint green.

### Task 1.1: Add `SectionShell` component

**Files:**
- Create: `src/components/SectionShell.tsx`
- Modify: `src/style.css` (add `.section-shell` styles)

- [ ] **Step 1: Create `SectionShell.tsx`**

```typescript
import { type ReactNode } from 'react';
import { blendStops } from '../theme';

type SectionShellProps = {
  id: string;
  accentKey: string;          // key into SECTION_ACCENTS
  children: ReactNode;
  className?: string;
  contentClassName?: string;  // e.g. 'max-w-6xl'
};

export const SectionShell = ({
  id, accentKey, children, className = '', contentClassName = 'max-w-6xl'
}: SectionShellProps) => {
  const { from, to } = blendStops(accentKey);
  const styleVars = {
    '--accent-in': from,
    '--accent-out': to
  } as React.CSSProperties;
  return (
    <section
      id={id}
      className={`section-shell blend-section content-section scroll-section ${className}`}
      style={styleVars}
    >
      <div className={`section-shell-content ${contentClassName}`}>
        {children}
      </div>
      <span className="section-blend-overlay" aria-hidden="true" />
    </section>
  );
};
```

- [ ] **Step 2: Add CSS to `style.css` (append near the `.blend-section` block, replacing the old generic rule)**

Replace the existing `.blend-section` rule (style.css:636) with:

```css
/* ────── Section shell + color-blend transitions ────── */
.section-shell {
  position: relative; z-index: 1;
  margin-top: -12vh; padding-top: 16vh;
  background:
    radial-gradient(circle at 8% 20%, color-mix(in srgb, var(--accent-in) 14%, transparent), transparent 26%),
    radial-gradient(circle at 92% 30%, color-mix(in srgb, var(--accent-out) 12%, transparent), transparent 30%),
    linear-gradient(180deg,
      color-mix(in srgb, var(--accent-in) 8%, rgba(236,253,245,.92)) 0%,
      color-mix(in srgb, var(--accent-out) 10%, rgba(254,243,199,.95)) 100%);
}
.section-shell-content { width: min(72rem, 100%); margin: 0 auto; }
.section-blend-overlay {
  position: absolute; left: 0; right: 0; bottom: 0; height: 30vh;
  pointer-events: none; z-index: 0;
  background: linear-gradient(to bottom,
    transparent 0%,
    color-mix(in srgb, var(--accent-out) 18%, transparent) 70%,
    color-mix(in srgb, var(--accent-out) 30%, transparent) 100%);
}
/* Keep the old class working for any section not yet migrated */
.blend-section { position: relative; z-index: 1; }
```

Note: `color-mix(in srgb, ...)` is supported in all evergreen browsers (Chrome 111+, Firefox 113+, Safari 16.2+). This is a styling enhancement, not a new dependency.

- [ ] **Step 3: Verify build + lint**

```bash
npm run build && npm run lint
```
Expected: green.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add SectionShell with color-blend transitions"
```

### Task 1.2: Fix width-class and tag-chip bugs (spec items #1, #14)

**Files:** Modify: `src/style.css:45-47`, `455-464`, `510-514`

- [ ] **Step 1: Fix the three identical width classes**

In `style.css`, replace lines `45-47`:

```css
.max-w-4xl { max-width: 56rem; }
.max-w-5xl { max-width: 64rem; }
.max-w-6xl { max-width: 72rem; }
```

- [ ] **Step 2: Unify tags into one `.tag-chip` style**

In `style.css`, replace the `.skill-pill` block (lines `454-464`) — keep the selector but make both tag styles share tokens. Add after the `.skill-pill--sky` rule:

```css
/* Unified tag chip — used by skill pills, experience tags, project tags */
.tag-chip {
  padding: .3rem .65rem; border-radius: 999px; border: 1px solid transparent;
  font-size: .76rem; font-weight: 650; line-height: 1.3;
  background: rgba(255,255,255,.72); color: #047857;
  border-color: rgba(52,211,153,.32);
  transition: transform 150ms ease, box-shadow 150ms ease;
}
.tag-chip:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,.08); }
```

Then update `.compact-tags span` (style.css:513) to:

```css
.compact-tags span { /* now uses .tag-chip class in JSX; legacy fallback kept */ }
```
Actually — simpler: in Phase 2, when sections are rebuilt, the JSX will use `className="tag-chip"` for all tags. Leave `.compact-tags span` rule as a no-op fallback (empty body) for now, or delete it. **Delete the `.compact-tags span` rule body** and let the Phase 2 JSX apply `.tag-chip`. Replace lines `513-514` with:

```css
.compact-tags { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1rem; justify-content: center; }
```
(remove the `span` sub-rule; the tag-chip class handles chip styling).

- [ ] **Step 3: Build + lint + scroll**

```bash
npm run build && npm run lint && npm run dev
```
Expected: green; visually the tags may look slightly different (unified) — that's intended.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "fix: distinct max-widths, unified tag-chip style"
```

### Task 1.3: Add `Reveal` and `Scene3D` primitives

**Files:** Modify: `src/components/primitives.tsx` (append), `src/style.css` (append)

- [ ] **Step 1: Add `Reveal` and `Scene3D` to `primitives.tsx`**

Append to `src/components/primitives.tsx`:

```typescript
type RevealProps = {
  children: ReactNode;
  delay?: number;
  rotateY?: number;     // entrance rotateY in degrees (default -25)
  className?: string;
};

export const Reveal = ({ children, delay = 0, rotateY = -25, className = '' }: RevealProps) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.unobserve(entry.target); }
    }, { rootMargin: '0px 0px -80px 0px' });
    const node = ref.current;
    if (node) observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'reveal--visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ['--reveal-rotate-y' as string]: `${rotateY}deg` }}
    >
      {children}
    </div>
  );
};

type Scene3DProps = { children: ReactNode; className?: string; depth?: number };

export const Scene3D = ({ children, className = '', depth = 1000 }: Scene3DProps) => (
  <div className={`scene-3d ${className}`} style={{ perspective: `${depth}px` }}>
    <div className="scene-3d-inner" style={{ transformStyle: 'preserve-3d' }}>
      {children}
    </div>
  </div>
);
```

- [ ] **Step 2: Add CSS**

Append to `src/style.css`:

```css
/* ────── Reveal (3D entrance) ────── */
.reveal {
  transition: opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1);
  opacity: 0; transform: rotateY(var(--reveal-rotate-y, -25deg)) translateZ(-2rem);
}
.reveal--visible { opacity: 1; transform: rotateY(0deg) translateZ(0); }
.scene-3d { position: relative; }
.scene-3d-inner { position: relative; }
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

- [ ] **Step 3: Build + lint**

```bash
npm run build && npm run lint
```
Expected: green.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Reveal and Scene3D primitives"
```

### Task 1.4: Enhance `TiltCard` to v2 (parallax + glare)

**Files:** Modify: `src/components/primitives.tsx` (the TiltCard component), `src/style.css`

- [ ] **Step 1: Replace TiltCard with v2**

In `src/components/primitives.tsx`, replace the entire `TiltCard` component (moved from main.tsx:264-293) with:

```typescript
type TiltCardProps = { children: ReactNode; className?: string };

export const TiltCard = ({ children, className = '' }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [glare, setGlare] = useState<{ x: number; y: number; o: number }>({ x: 50, y: 50, o: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;   // 0..1
    const py = (e.clientY - rect.top) / rect.height;   // 0..1
    const x = px - 0.5;
    const y = py - 0.5;
    setStyle({
      transform: `perspective(1000px) rotateX(${y * -10}deg) rotateY(${x * 10}deg) translateZ(8px)`,
      transition: 'transform 0.08s ease-out'
    });
    setGlare({ x: px * 100, y: py * 100, o: 0.25 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
      transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)'
    });
    setGlare((g) => ({ ...g, o: 0 }));
  }, []);

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="tilt-card-layer" style={{ transform: 'translateZ(2rem)' }}>
        {children}
      </div>
      <span
        className="tilt-card-glare"
        aria-hidden="true"
        style={{ background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.o}), transparent 60%)` }}
      />
    </div>
  );
};
```

Add `useCallback` to the React import at the top of `primitives.tsx`:
```typescript
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
```

- [ ] **Step 2: Add CSS**

Append to `src/style.css`:

```css
/* ────── TiltCard v2 ────── */
.tilt-card { position: relative; transform-style: preserve-3d; will-change: transform; }
.tilt-card-layer { position: relative; transform-style: preserve-3d; }
.tilt-card-glare {
  position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  opacity: 1; mix-blend-mode: overlay; transition: opacity 0.3s ease;
}
@media (prefers-reduced-motion: reduce) {
  .tilt-card { transform: none !important; }
  .tilt-card-glare { display: none; }
}
```

- [ ] **Step 3: Build + lint + scroll**

```bash
npm run build && npm run lint && npm run dev
```
Expected: green. Cards now tilt with a glare follow and parallax layer. Hover a skill/experience card to confirm.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: TiltCard v2 with parallax layer and cursor glare"
```

---

## Phase 2 — Reorder + content sections

**Phase exit gate:** all 9 sections present in the new order; About is a hero toggle; achievements/education split; bug fixes applied; build + lint green.

> Section components are extracted from main.tsx into `sections/` files, reordered, and wrapped in `SectionShell`. The old inline section components in main.tsx are deleted as each is extracted.

### Task 2.1: Extract `sections/Hero.tsx` with About toggle

**Files:**
- Create: `src/sections/Hero.tsx`
- Reference: `src/main.tsx:923-960` (current hero JSX) + `962-990` (current About JSX) + `467-474` (TypewriterText) + `761-783` (HeroSignalPanel) + `808-826` (DataNodesAnimation)

- [ ] **Step 1: Create `sections/Hero.tsx`**

This combines the hero + About (folded behind a toggle). Full file:

```typescript
import { useState } from 'react';
import { PROFILE_LINKS } from '../data';
import { useTypewriter } from '../hooks/useTypewriter';
import { FadeIn } from '../components/primitives';
import { DataNetworkCanvas, DataFloatIcons } from '../components/decorations';
import { HeroScene } from '../components/scenes/HeroScene';
import { QuoteIcon, DownloadIcon } from '../components/Icons';

const TypewriterText = () => {
  const text = useTypewriter();
  return (
    <span className="typewriter-text">{text}<span className="typewriter-cursor" aria-hidden="true">|</span></span>
  );
};

export const Hero = () => {
  const [storyOpen, setStoryOpen] = useState(false);
  return (
    <section id="home" className="hero-section scroll-section">
      <DataNetworkCanvas />
      <DataFloatIcons />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-glow hero-glow-a" aria-hidden="true" />
      <div className="hero-glow hero-glow-b" aria-hidden="true" />
      <div className="hero-glow hero-glow-c" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-copy">
          <div className="hero-kicker icon-chip">🚀 DATA SCIENCE · FORECASTING · MLOPS</div>
          <h1 className="hero-title spring-gradient-text">
            Hi, I&apos;m<br />
            <span className="hero-accent-line">Prithwijit Ghosh.</span>
          </h1>
          <div className="hero-role-line"><TypewriterText /></div>
          <p className="hero-location icon-chip">
            <span aria-hidden="true">🎓</span> M.Sc. Statistics @ IIT Kanpur
            <span aria-hidden="true"> · </span>
            <span aria-hidden="true">💼</span> Data Scientist @ Accenture
          </p>
          <div className="hero-tags">
            <span className="tag-blossom icon-chip" aria-label="Forecasting models">🤖 Forecasting</span>
            <span className="tag-mint icon-chip" aria-label="Risk scoring">💬 Risk scoring</span>
            <span className="tag-sky icon-chip" aria-label="MLOps on AWS">☁️ MLOps</span>
            <a className="hero-resume-link" href={PROFILE_LINKS.resume} target="_blank" rel="noopener noreferrer">
              <DownloadIcon className="hero-resume-icon" />
              Resume
            </a>
            <button
              type="button"
              className="hero-story-toggle"
              aria-expanded={storyOpen}
              aria-controls="about-story"
              onClick={() => setStoryOpen((o) => !o)}
            >
              {storyOpen ? 'Show less' : 'Read my story'}
            </button>
          </div>

          <div id="about-story" className={`about-story ${storyOpen ? 'about-story--open' : ''}`}>
            <FadeIn>
              <div className="about-section-text">
                <div className="section-heading">
                  <span className="section-heading-icon" aria-hidden="true">📐</span>
                  <h3 className="text-3xl font-bold spring-gradient-text">About Me</h3>
                </div>
                <p className="text-spring-muted text-lg leading-relaxed">
                  <b>Data Scientist Specialist</b> at Accenture with 2.9+ years of experience and an IIT Kanpur Master&apos;s in Statistics. I build and deploy forecasting, risk, and analytics systems across finance, payments-adjacent, sales, and operations domains.
                </p>
                <p className="text-spring-muted text-lg mt-4 leading-relaxed">
                  My work spans sales and guest-count forecasting, accounts receivable forecasting, late-payment prediction, cash-flow forecasting, marketing analytics, Power BI dashboards, and production MLOps with Docker, GitHub Actions, Airflow, Astronomer, and AWS Fargate.
                </p>
                <p className="text-spring-muted text-lg mt-4 leading-relaxed">
                  💡 When I&apos;m not wrangling data pipelines, you&apos;ll find me exploring AI agents, contributing to open-source ML projects, or diving into the latest in MLOps and LLM research.
                </p>
                <div className="about-quote">
                  <QuoteIcon className="about-quote-icon" />
                  <blockquote>Data is the new soil — with the right statistical tools and engineering, we grow decisions that matter.</blockquote>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
        <HeroScene />
      </div>
    </section>
  );
};
```

Note: `HeroScene` is imported but not yet created — create a stub now (Task 2.1 Step 2) so the build passes; the real scene is built in Phase 4 Task 4.1.

- [ ] **Step 2: Create stub `src/components/scenes/HeroScene.tsx`**

```typescript
import { HeroSignalPanel } from './HeroSignalPanel';

/* Placeholder wrapper — real parallax layers added in Phase 4 Task 4.1 */
export const HeroScene = () => <HeroSignalPanel />;
```

- [ ] **Step 3: Create `src/components/scenes/HeroSignalPanel.tsx`** (moved from main.tsx:761-783)

Move the `HeroSignalPanel` component verbatim, add `export`, import `AnimatedCounter` from `../primitives`. Fix bug #13: wrap the two-counter strong in a `.metric-value` container. Replace the first metric div:

```typescript
<div><span className="metric-emoji" aria-hidden="true">📈</span><span className="metric-value"><strong><AnimatedCounter target={99} suffix="%" />–<AnimatedCounter target={97} suffix="%" /></strong></span><span>24-month forecast accuracy</span></div>
```

- [ ] **Step 4: Add CSS for About toggle + metric-value (bug #8, #13)**

Append to `style.css`. Also fix bug #8 (hero-title size):

```css
/* Bug #8: hero name too small */
.hero-title { font-size: clamp(2.75rem, 7vw, 4.5rem); }

/* Bug #13: metric value container */
.metric-value { display: inline-flex; flex-wrap: nowrap; align-items: baseline; }

/* About toggle */
.hero-story-toggle {
  display: inline-flex; align-items: center; min-height: 2.8rem;
  padding: .7rem 1.15rem; border-radius: 999px;
  border: 2px solid rgba(251,113,133,.4); background: rgba(255,228,230,.9);
  color: #be123c; font-size: .9rem; font-weight: 800; cursor: pointer;
  box-shadow: 0 8px 20px rgba(190,120,90,.12);
  transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
}
.hero-story-toggle:hover { transform: translateY(-3px); box-shadow: 0 14px 32px rgba(190,120,90,.2); background: rgba(254,205,211,.98); }

.about-story {
  max-height: 0; opacity: 0; overflow: hidden;
  transition: max-height .6s cubic-bezier(0.16,1,0.3,1), opacity .4s ease, margin .4s ease;
  margin-top: 0;
}
.about-story--open { max-height: 60rem; opacity: 1; margin-top: 2rem; }
@media (prefers-reduced-motion: reduce) {
  .about-story { transition: none; }
  .about-story--open { max-height: none; }
}
```

- [ ] **Step 5: Build + lint**

```bash
npm run build && npm run lint
```
Expected: green. (main.tsx still renders the OLD hero for now — do not wire Hero in yet; that happens in Task 2.9 when all sections are extracted.)

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: extract Hero section with About toggle, fix hero-title and metric-value bugs"
```

### Task 2.2: Extract `sections/Achievements.tsx`

**Files:**
- Create: `src/sections/Achievements.tsx`
- Reference: `src/main.tsx:786-806`

- [ ] **Step 1: Create the section**

```typescript
import { ACHIEVEMENTS_DATA } from '../data';
import { SectionShell } from '../components/SectionShell';
import { SectionHeading, Reveal, TiltCard } from '../components/primitives';

export const Achievements = () => (
  <SectionShell id="achievements" accentKey="achievements" contentClassName="max-w-6xl">
    <Reveal><SectionHeading emoji="🏆" title="Key Achievements" /></Reveal>
    <div className="achievement-grid">
      {ACHIEVEMENTS_DATA.map((a, i) => (
        <Reveal key={a.label} delay={i * 70} rotateY={0}>
          <TiltCard className="achievement-card">
            <span className="achievement-card-emoji" aria-hidden="true">{a.emoji}</span>
            <div className="achievement-card-body">
              <strong className="achievement-card-stat">{a.stat}</strong>
              <span className="achievement-card-label">{a.label}</span>
              <span className="achievement-card-desc">{a.desc}</span>
            </div>
          </TiltCard>
        </Reveal>
      ))}
    </div>
  </SectionShell>
);
```

- [ ] **Step 2: Build + lint**

```bash
npm run build && npm run lint
```
Expected: green.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: extract Achievements section"
```

### Task 2.3: Extract `sections/Skills.tsx` (fix bug #4 — orphan card)

**Files:**
- Create: `src/sections/Skills.tsx`
- Reference: `src/main.tsx:614-640`
- Modify: `src/style.css:427-429`, `723-731` (the orphan-card grid hacks)

- [ ] **Step 1: Create the section**

```typescript
import { SKILL_DOMAINS } from '../data';
import { SectionShell } from '../components/SectionShell';
import { SectionHeading, Reveal, TiltCard, SkillBar } from '../components/primitives';
import { SkillsConstellation } from '../components/scenes/SkillsConstellation';

export const Skills = () => (
  <SectionShell id="skills" accentKey="skills" contentClassName="max-w-6xl">
    <Reveal><SectionHeading emoji="🧰" title="Skills & Expertise" /></Reveal>
    <div className="skills-layout">
      <div className="skills-grid">
        {SKILL_DOMAINS.map((domain, index) => (
          <Reveal key={domain.title} delay={index * 70} rotateY={-18}>
            <TiltCard className={`skill-card skill-card--${domain.accent}`}>
              <div className="skill-card-header">
                <span className="skill-card-icon" aria-hidden="true">{domain.emoji}</span>
                <h4 className="skill-card-title">{domain.title}</h4>
              </div>
              <p className="skill-card-desc">{domain.description}</p>
              <SkillBar level={domain.level} accent={domain.accent} />
              <ul className="skill-pill-list">
                {domain.skills.map(skill => (
                  <li key={skill} className={`tag-chip skill-pill--${domain.accent}`}>{skill}</li>
                ))}
              </ul>
            </TiltCard>
          </Reveal>
        ))}
      </div>
      <SkillsConstellation />
    </div>
  </SectionShell>
);
```

- [ ] **Step 2: Create stub `src/components/scenes/SkillsConstellation.tsx`**

```typescript
/* Placeholder — real constellation built in Phase 4 Task 4.2 */
export const SkillsConstellation = () => <div className="skills-constellation" aria-hidden="true" />;
```

- [ ] **Step 3: Fix bug #4 in CSS — replace the orphan-card grid hacks**

In `style.css`, replace lines `427-429` (`.skills-grid` + the `> div:last-child` hack) with:

```css
.skills-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; align-items: start; }
@media (min-width: 900px) { .skills-layout { grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); } }
.skills-grid {
  display: grid; gap: 1rem; align-items: start;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
}
.skills-constellation { min-height: 12rem; }
```

And **delete** the entire `@media (min-width:900px)` block at lines `723-731` (the old 6-column span hack). Also delete the `.skills-grid > div:last-child` rule that was in the `@media (max-width:640px)` block (lines `717-718`).

- [ ] **Step 4: Build + lint + scroll**

```bash
npm run build && npm run lint && npm run dev
```
Expected: green; skills grid now lays out 5 cards in equal auto-fit columns.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: extract Skills section; fix orphan card grid (bug #4)"
```

### Task 2.4: Extract `sections/Experience.tsx` (fix bug #10 — timeline gutter)

**Files:**
- Create: `src/sections/Experience.tsx`
- Reference: `src/main.tsx:642-676`
- Modify: `src/style.css` (timeline node positioning, bug #10)

- [ ] **Step 1: Create the section**

```typescript
import { EXPERIENCE_ITEMS } from '../data';
import { SectionShell } from '../components/SectionShell';
import { SectionHeading, Reveal, TiltCard } from '../components/primitives';
import { ExperienceTimeline3D } from '../components/scenes/ExperienceTimeline3D';

export const Experience = () => (
  <SectionShell id="experience" accentKey="experience" contentClassName="max-w-6xl">
    <Reveal><SectionHeading emoji="💼" title="Professional Experience" /></Reveal>
    <ExperienceTimeline3D items={EXPERIENCE_ITEMS} />
  </SectionShell>
);
```

- [ ] **Step 2: Create `src/components/scenes/ExperienceTimeline3D.tsx`** (this scene also renders the cards — moved from main.tsx:642-676, restructured)

```typescript
import { type ExperienceItem } from '../../data';
import { Reveal, TiltCard } from '../primitives';

export const ExperienceTimeline3D = ({ items }: { items: ExperienceItem[] }) => (
  <div className="experience-list">
    {items.map((item, index) => (
      <Reveal key={`${item.client}-${item.summary}`} delay={index * 100} rotateY={20}>
        <div className="experience-row">
          <div className="timeline-node" aria-hidden="true">
            <div className="timeline-dot" style={{ animationDelay: `${index * 0.3}s` }} />
            {index < items.length - 1 && <div className="timeline-line" />}
          </div>
          <TiltCard className="experience-card">
            <h3 className="experience-role-heading">{item.title}</h3>
            <div className="experience-meta-row">
              <span className="experience-company">{item.client}</span>
              <span className="experience-meta-sep" aria-hidden="true">·</span>
              <span className="experience-eyebrow experience-eyebrow--inline">{item.timeline}</span>
            </div>
            <p className="experience-summary">{item.summary}</p>
            <ul className="detail-list">
              {item.bullets.map(b => <li key={b}>{b}</li>)}
            </ul>
            <div className="compact-tags">
              {item.tags.map(t => <span key={t} className="tag-chip">{t}</span>)}
            </div>
          </TiltCard>
        </div>
      </Reveal>
    ))}
  </div>
);
```

- [ ] **Step 3: Fix bug #10 — timeline gutter**

In `style.css`, replace `.timeline-node` (line `497`) and `.experience-row` (line `496`):

```css
.experience-row {
  position: relative;
  padding-left: 2.5rem;          /* dedicated gutter for the timeline */
}
.timeline-node {
  position: absolute; left: .5rem; top: 1.5rem; bottom: 0;
  display: flex; flex-direction: column; align-items: center;
  width: 1.5rem;
}
```

- [ ] **Step 4: Build + lint**

```bash
npm run build && npm run lint
```
Expected: green.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: extract Experience section with 3D timeline; fix timeline gutter (bug #10)"
```

### Task 2.5: Extract `sections/Education.tsx` with academic honors strip (fix bugs #5, #6, #11)

**Files:**
- Create: `src/sections/Education.tsx`
- Reference: `src/main.tsx:716-759`
- Modify: `src/style.css:552-584` (consolidate duplicate rules, bugs #5, #6)

- [ ] **Step 1: Create the section**

```typescript
import { SectionShell } from '../components/SectionShell';
import { SectionHeading, Reveal, TiltCard, AnimatedCounter } from '../components/primitives';
import { EducationCape } from '../components/scenes/EducationCape';

const ACADEMIC_HONORS = [
  { stat: '7', label: 'JAM AIR (Statistics)' },
  { stat: '89.9', label: 'M.Sc. CGPA / IIT Kanpur' },
  { stat: '6', label: 'Dept. Rank / IIT Kanpur' },
  { stat: '1', label: 'Dept. Rank / B.Sc.' }
];

export const Education = () => (
  <SectionShell id="education" accentKey="education" contentClassName="max-w-5xl">
    <Reveal><SectionHeading emoji="🎓" title="Education & Achievements" /></Reveal>
    <div className="education-grid">
      <Reveal rotateY={-15}>
        <TiltCard className="education-card education-card--primary">
          <div className="edu-card-top">
            <div className="edu-icon-ring" aria-hidden="true">🎓</div>
            <div>
              <p className="experience-eyebrow">Aug 2021 – Jul 2023</p>
              <h4>M.Sc. in Statistics</h4>
              <p className="edu-institute">Indian Institute of Technology Kanpur</p>
            </div>
          </div>
          <div className="edu-stats">
            <div className="edu-stat"><span className="edu-stat-num"><AnimatedCounter target={89} duration={1500} /></span><span className="edu-stat-dot">.</span><span className="edu-stat-num">9</span><span className="edu-stat-label">CGPA</span></div>
            <div className="edu-stat"><span className="edu-stat-num"><AnimatedCounter target={7} duration={1500} /></span><span className="edu-stat-label">JAM AIR</span></div>
            <div className="edu-stat"><span className="edu-stat-num"><AnimatedCounter target={6} duration={1500} /></span><span className="edu-stat-label">Dept. Rank</span></div>
          </div>
        </TiltCard>
      </Reveal>
      <Reveal delay={100} rotateY={15}>
        <TiltCard className="education-card education-card--secondary">
          <div className="edu-card-top">
            <div className="edu-icon-ring" aria-hidden="true">📚</div>
            <div>
              <p className="experience-eyebrow">Jun 2018 – Jul 2021</p>
              <h4>B.Sc. in Statistics</h4>
              <p className="edu-institute">Bidhannagar College</p>
            </div>
          </div>
          <div className="edu-stats">
            <div className="edu-stat"><span className="edu-stat-num"><AnimatedCounter target={999} duration={1500} /></span><span className="edu-stat-dot">.</span><span className="edu-stat-num">99</span><span className="edu-stat-label">CGPA</span></div>
            <div className="edu-stat"><span className="edu-stat-num"><AnimatedCounter target={1} duration={1500} /></span><span className="edu-stat-label">Dept. Rank</span></div>
          </div>
        </TiltCard>
      </Reveal>
    </div>

    <Reveal delay={150}>
      <div className="academic-honors">
        <h5 className="academic-honors-title">Academic Honors</h5>
        <div className="academic-honors-grid">
          {ACADEMIC_HONORS.map(h => (
            <div key={h.label} className="academic-honor">
              <strong className="academic-honor-stat">{h.stat}</strong>
              <span className="academic-honor-label">{h.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Reveal>

    <EducationCape />
  </SectionShell>
);
```

- [ ] **Step 2: Create stub `src/components/scenes/EducationCape.tsx`**

```typescript
/* Placeholder — refined scholar scene built in Phase 4 Task 4.6 */
export const EducationCape = () => null;
```

- [ ] **Step 3: Fix bugs #5, #6 — consolidate duplicate edu rules**

In `style.css`, find the two `.edu-card-top` rules (lines `556` and `579`) and the two `.education-card` rules (lines `551-555` and `566-568`). Delete the later duplicates; keep one consolidated block:

```css
/* ────── Education (consolidated — bugs #5, #6) ────── */
.education-card {
  padding: 1.5rem; border-radius: 1rem; border: 2px solid rgba(255,255,255,.68);
  background: linear-gradient(145deg, rgba(255,255,255,.93), rgba(236,253,245,.82));
  box-shadow: 0 14px 34px rgba(190,120,90,.12); will-change: transform; text-align: center;
}
.education-card h4 { margin: 0 0 .3rem; color: var(--spring-ink); font-size: 1.16rem; font-weight: 850; }
.education-card p { margin: 0; color: #4d7c68; line-height: 1.58; }
.education-card--primary {
  border-color: rgba(251,113,133,.4);
  background: linear-gradient(145deg, rgba(255,241,242,.95), rgba(255,255,255,.85));
}
.education-card--secondary {
  border-color: rgba(56,189,248,.38);
  background: linear-gradient(145deg, rgba(224,242,254,.95), rgba(255,255,255,.85));
}
.edu-card-top { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1.25rem; justify-content: center; }
```

Add the academic-honors CSS:

```css
/* Academic honors strip */
.academic-honors { margin-top: 2.5rem; }
.academic-honors-title { text-align: center; color: #047857; font-size: 1rem; font-weight: 800; margin: 0 0 1rem; text-transform: uppercase; letter-spacing: .04em; }
.academic-honors-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); gap: 1rem; }
.academic-honor {
  display: flex; flex-direction: column; align-items: center; gap: .25rem;
  padding: 1rem; border-radius: .9rem; border: 1.5px solid rgba(52,211,153,.28);
  background: rgba(255,255,255,.7); text-align: center;
}
.academic-honor-stat { font-size: 1.5rem; font-weight: 900; color: var(--spring-ink); line-height: 1; }
.academic-honor-label { font-size: .75rem; font-weight: 700; color: #047857; }
```

- [ ] **Step 4: Build + lint**

```bash
npm run build && npm run lint
```
Expected: green.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: extract Education section with academic honors strip; consolidate duplicate CSS (bugs #5, #6)"
```

### Task 2.6: Extract `sections/Contact.tsx` (fix bugs #3, #12)

**Files:**
- Create: `src/sections/Contact.tsx`
- Reference: `src/main.tsx:1013-1036`
- Modify: `src/style.css:617` (contact min-height, bug #12)

- [ ] **Step 1: Create the section**

Replace emoji icons with consistent SVGs. Add `PhoneIcon`, `MailIcon`, `DocIcon` to `src/components/Icons.tsx` first:

Append to `Icons.tsx`:
```typescript
export const MailIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const PhoneIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L20 13l1 4v3a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);
export const DocIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 2h8l4 4v16H6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M14 2v4h4M9 13h6M9 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
```

Then create `src/sections/Contact.tsx`:

```typescript
import { PROFILE_LINKS } from '../data';
import { SectionShell } from '../components/SectionShell';
import { SectionHeading, Reveal } from '../components/primitives';
import { ContactOrbit } from '../components/scenes/ContactOrbit';
import { MailIcon, PhoneIcon, GitHubIcon, LinkedInIcon, DocIcon } from '../components/Icons';

export const Contact = () => (
  <SectionShell id="contact" accentKey="contact" contentClassName="max-w-4xl" className="contact-page-section">
    <Reveal><SectionHeading emoji="📬" title="Get in Touch" /></Reveal>
    <Reveal delay={100}>
      <p className="text-spring-muted text-lg mb-8">
        Open to data science roles, collaborations, forecasting systems, MLOps work, and interesting analytics problems. Let&apos;s build something impactful together.
      </p>
    </Reveal>
    <ContactOrbit
      channels={[
        { label: 'Email me', href: PROFILE_LINKS.email, Icon: MailIcon },
        { label: 'Call me', href: PROFILE_LINKS.phone, Icon: PhoneIcon },
        { label: 'GitHub', href: PROFILE_LINKS.github, Icon: GitHubIcon, external: true },
        { label: 'LinkedIn', href: PROFILE_LINKS.linkedin, Icon: LinkedInIcon, external: true },
        { label: 'Resume', href: PROFILE_LINKS.resume, Icon: DocIcon, external: true }
      ]}
    />
  </SectionShell>
);
```

- [ ] **Step 2: Create stub `src/components/scenes/ContactOrbit.tsx`** (fallback card grid until Phase 4)

```typescript
import type React from 'react';

type Channel = { label: string; href: string; Icon: (p: { className?: string }) => React.ReactElement; external?: boolean };

export const ContactOrbit = ({ channels }: { channels: Channel[] }) => (
  <div className="contact-links">
    {channels.map(({ label, href, Icon, external }) => (
      <a key={label} className="contact-card" href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
        <Icon className="contact-card-icon" /><span>{label}</span>
      </a>
    ))}
  </div>
);
```

- [ ] **Step 3: Fix bug #12 — contact section size**

In `style.css`, replace line `617` (`.contact-page-section`):

```css
.contact-page-section {
  padding-top: clamp(5rem, 12vh, 8rem);
  padding-bottom: clamp(6rem, 14vh, 9rem);
  min-height: min(100vh, 720px);
  display: flex; align-items: center;
}
```

(Bug #3 — the emoji icons — is fixed by the JSX now using SVG icons uniformly.)

- [ ] **Step 4: Build + lint**

```bash
npm run build && npm run lint
```
Expected: green.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: extract Contact section with uniform SVG icons; fix contact sizing (bugs #3, #12)"
```

### Task 2.7: Create `sections/MscProject.tsx` (placeholder content) — NEW

**Files:**
- Create: `src/sections/MscProject.tsx`
- Create: `src/components/scenes/MscProjectModel.tsx` (stub)

- [ ] **Step 1: Create the section**

```typescript
import { MSC_PROJECT } from '../data';
import { SectionShell } from '../components/SectionShell';
import { SectionHeading, Reveal, TiltCard } from '../components/primitives';
import { MscProjectModel } from '../components/scenes/MscProjectModel';

export const MscProject = () => (
  <SectionShell id="msc" accentKey="msc" contentClassName="max-w-5xl">
    <Reveal><SectionHeading emoji="🎓" title="MSc Final Project" /></Reveal>
    <div className="msc-layout">
      <Reveal rotateY={-12}>
        <TiltCard className="msc-card">
          <p className="msc-placeholder-badge">[PLACEHOLDER — replace with real project content]</p>
          <h3 className="msc-title">{MSC_PROJECT.title}</h3>
          <p className="msc-summary">{MSC_PROJECT.summary}</p>
          <div className="msc-block">
            <h5 className="msc-block-title">Problem</h5>
            <p className="msc-block-text">{MSC_PROJECT.problem}</p>
          </div>
          <div className="msc-block">
            <h5 className="msc-block-title">Approach</h5>
            <p className="msc-block-text">{MSC_PROJECT.approach}</p>
          </div>
          <div className="msc-metrics">
            {MSC_PROJECT.results.map(r => (
              <div key={r.label} className="msc-metric">
                <strong className="msc-metric-value">{r.value}</strong>
                <span className="msc-metric-label">{r.label}</span>
              </div>
            ))}
          </div>
          <div className="compact-tags">
            {MSC_PROJECT.tags.map(t => <span key={t} className="tag-chip">{t}</span>)}
          </div>
        </TiltCard>
      </Reveal>
      <MscProjectModel />
    </div>
  </SectionShell>
);
```

- [ ] **Step 2: Create stub `src/components/scenes/MscProjectModel.tsx`**

```typescript
/* Placeholder — animated SVG bell-curve model built in Phase 4 Task 4.4 */
export const MscProjectModel = () => <div className="msc-model" aria-hidden="true" />;
```

- [ ] **Step 3: Add CSS**

Append to `style.css`:

```css
/* ────── MSc project ────── */
.msc-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; align-items: start; }
@media (min-width: 900px) { .msc-layout { grid-template-columns: minmax(0,1.6fr) minmax(0,1fr); } }
.msc-card { padding: 1.75rem; border-radius: 1.25rem; border: 2px solid rgba(251,113,133,.3); background: linear-gradient(145deg, rgba(255,255,255,.93), rgba(255,241,242,.85)); box-shadow: 0 16px 40px rgba(190,120,90,.15); text-align: left; }
.msc-placeholder-badge { display: inline-block; margin: 0 0 .75rem; padding: .25rem .6rem; border-radius: 999px; background: rgba(251,113,133,.12); color: #be123c; font-size: .72rem; font-weight: 800; }
.msc-title { margin: 0 0 .5rem; color: var(--spring-ink); font-size: 1.35rem; font-weight: 850; }
.msc-summary { margin: 0 0 1rem; color: #4d7c68; line-height: 1.58; }
.msc-block { margin-bottom: 1rem; }
.msc-block-title { margin: 0 0 .25rem; color: #047857; font-size: .8rem; font-weight: 800; text-transform: uppercase; letter-spacing: .04em; }
.msc-block-text { margin: 0; color: #315f51; line-height: 1.58; }
.msc-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(7rem,1fr)); gap: .75rem; margin: 1.25rem 0; }
.msc-metric { display: flex; flex-direction: column; align-items: center; padding: .75rem; border-radius: .75rem; background: rgba(255,255,255,.6); border: 1.5px solid rgba(52,211,153,.25); text-align: center; }
.msc-metric-value { font-size: 1.25rem; font-weight: 900; color: var(--spring-ink); }
.msc-metric-label { font-size: .72rem; font-weight: 700; color: #047857; }
.msc-model { min-height: 12rem; }
```

- [ ] **Step 4: Build + lint**

```bash
npm run build && npm run lint
```
Expected: green.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add MSc Final Project section (placeholder content)"
```

### Task 2.8: Create `sections/PortfolioProjects.tsx` and `sections/Certifications.tsx`

**Files:**
- Create: `src/sections/PortfolioProjects.tsx`
- Create: `src/sections/Certifications.tsx`
- Create: `src/components/scenes/ProjectShowcase.tsx` (stub)
- Create: `src/components/scenes/CertRibbon.tsx` (stub)
- Reference: `src/main.tsx:678-714`

- [ ] **Step 1: Create `sections/PortfolioProjects.tsx`**

```typescript
import { PROJECTS, PROFILE_LINKS } from '../data';
import { SectionShell } from '../components/SectionShell';
import { SectionHeading, Reveal } from '../components/primitives';
import { ProjectShowcase } from '../components/scenes/ProjectShowcase';
import { GitHubIcon } from '../components/Icons';

export const PortfolioProjects = () => (
  <SectionShell id="projects" accentKey="projects" contentClassName="max-w-6xl">
    <Reveal><SectionHeading emoji="🧪" title="Portfolio Projects" /></Reveal>
    <ProjectShowcase projects={PROJECTS} />
    <Reveal delay={280}>
      <div className="projects-see-more">
        <span className="projects-ellipsis" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span>
        <a className="projects-github-link" href={PROFILE_LINKS.github} target="_blank" rel="noopener noreferrer">
          <GitHubIcon className="projects-github-icon" />
          See more on GitHub
        </a>
      </div>
    </Reveal>
  </SectionShell>
);
```

- [ ] **Step 2: Create `src/components/scenes/ProjectShowcase.tsx`** (stub: renders the cards as-is; flip effect added Phase 4 Task 4.3)

```typescript
import { type ProjectItem } from '../../data';
import { Reveal, TiltCard } from '../primitives';

export const ProjectShowcase = ({ projects }: { projects: ProjectItem[] }) => (
  <div className="project-grid">
    {projects.slice(0, 3).map((project, index) => (
      <Reveal key={project.title} delay={index * 80} rotateY={-10}>
        <TiltCard className="project-card">
          {project.timeline && <p className="experience-eyebrow">{project.timeline}</p>}
          <h3 className="project-card-heading">{project.title}</h3>
          <p>{project.summary}</p>
          <ul className="detail-list">
            {project.bullets.map(b => <li key={b}>{b}</li>)}
          </ul>
          <div className="compact-tags">
            {project.tags.map(t => <span key={t} className="tag-chip">{t}</span>)}
          </div>
          {project.link && <a className="text-link" href={project.link} target="_blank" rel="noopener noreferrer">View repository</a>}
        </TiltCard>
      </Reveal>
    ))}
  </div>
);
```

- [ ] **Step 3: Create `src/sections/Certifications.tsx`** (placeholder content) — NEW

```typescript
import { CERTIFICATIONS } from '../data';
import { SectionShell } from '../components/SectionShell';
import { SectionHeading } from '../components/primitives';
import { CertRibbon } from '../components/scenes/CertRibbon';

export const Certifications = () => (
  <SectionShell id="certifications" accentKey="certifications" contentClassName="max-w-6xl">
    <SectionHeading emoji="📜" title="Certifications & Workshops" />
    <p className="cert-placeholder-note">[PLACEHOLDER — replace with real certifications and workshops]</p>
    <CertRibbon certs={CERTIFICATIONS} />
  </SectionShell>
);
```

- [ ] **Step 4: Create `src/components/scenes/CertRibbon.tsx`** (stub: card grid; ribbon effect Phase 4 Task 4.5)

```typescript
import { type Certification } from '../../data';
import { Reveal, TiltCard } from '../primitives';

export const CertRibbon = ({ certs }: { certs: Certification[] }) => (
  <div className="cert-grid">
    {certs.map((cert, i) => (
      <Reveal key={cert.name + i} delay={i * 70} rotateY={-12}>
        <TiltCard className="cert-card">
          <div className="cert-seal" aria-hidden="true">📜</div>
          <h4 className="cert-name">{cert.name}</h4>
          <p className="cert-issuer">{cert.issuer}</p>
          <p className="cert-date">{cert.date}</p>
          {cert.credentialId && <p className="cert-id">ID: {cert.credentialId}</p>}
        </TiltCard>
      </Reveal>
    ))}
  </div>
);
```

- [ ] **Step 5: Add CSS**

Append to `style.css`:

```css
/* ────── Certifications ────── */
.cert-placeholder-note { text-align: center; color: #be123c; font-size: .8rem; font-weight: 700; margin: 0 0 1.5rem; }
.cert-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); gap: 1.25rem; }
.cert-card { padding: 1.5rem; border-radius: 1rem; border: 2px solid rgba(56,189,248,.32); background: linear-gradient(145deg, rgba(255,255,255,.93), rgba(224,242,254,.82)); box-shadow: 0 14px 34px rgba(190,120,90,.12); text-align: center; }
.cert-seal { font-size: 1.8rem; margin-bottom: .5rem; }
.cert-name { margin: 0 0 .35rem; color: var(--spring-ink); font-size: 1.05rem; font-weight: 850; }
.cert-issuer { margin: 0; color: #047857; font-weight: 700; font-size: .85rem; }
.cert-date { margin: .15rem 0 0; color: #6b9a89; font-size: .78rem; }
.cert-id { margin: .35rem 0 0; color: #94a3b8; font-size: .72rem; }
```

- [ ] **Step 6: Build + lint**

```bash
npm run build && npm run lint
```
Expected: green.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add Portfolio Projects and Certifications (placeholder) sections"
```

### Task 2.9: Rewrite `main.tsx` to compose all sections in the new order (apply bug #7 icon tokens)

**Files:**
- Rewrite: `src/main.tsx`

- [ ] **Step 1: Apply bug #7 — icon size tokens**

In `style.css`, add to `:root` (line `3-6`):

```css
:root {
  --spring-ink: #1e3a2f;
  --nav-height: 4rem;
  --card-icon-box: 2.5rem;
  --card-icon: 1.4rem;
}
```

And update the relevant rules to use the tokens:
- `.skill-card-icon { font-size: var(--card-icon); ... }` (was 1.2rem)
- `.edu-icon-ring { width: var(--card-icon-box); height: var(--card-icon-box); font-size: 1.5rem; ... }` (keep emoji at 1.5rem inside the box)
- `.section-heading-icon { width: var(--card-icon-box); height: var(--card-icon-box); ... }` (was 2.75rem)
- `.achievement-card-emoji { font-size: 1.6rem; ... }` (nudge from 1.8rem toward uniformity)

- [ ] **Step 2: Rewrite `main.tsx` to the final composition root**

Full new `src/main.tsx`:

```typescript
import { createRoot } from 'react-dom/client';
import './style.css';

import { CursorGlow, ScrollProgress, BackToTop } from './components/decorations';
import { SiteNav } from './components/SiteNav';
import { Hero } from './sections/Hero';
import { Achievements } from './sections/Achievements';
import { Skills } from './sections/Skills';
import { Experience } from './sections/Experience';
import { MscProject } from './sections/MscProject';
import { PortfolioProjects } from './sections/PortfolioProjects';
import { Education } from './sections/Education';
import { Certifications } from './sections/Certifications';
import { Contact } from './sections/Contact';

export default function App() {
  return (
    <div className="spring-page font-sans">
      <CursorGlow />
      <ScrollProgress />
      <SiteNav />
      <Hero />
      <Achievements />
      <Skills />
      <Experience />
      <MscProject />
      <PortfolioProjects />
      <Education />
      <Certifications />
      <Contact />
      <BackToTop />
    </div>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root was not found.');
createRoot(rootElement).render(<App />);
```

- [ ] **Step 3: Delete now-unused code**

All the inline section components, AICloneChat, DataNodesAnimation, HeroSignalPanel (moved), ROLES, DS_ICONS (moved) that remain in the OLD main.tsx are gone after the rewrite in Step 2. Verify nothing dangling remains.

- [ ] **Step 4: Build + lint + full scroll**

```bash
npm run build && npm run lint && npm run dev
```
Expected: green. All 9 sections render in order: Hero(+About toggle) → Achievements → Skills → Experience → MSc → Portfolio → Education → Certifications → Contact. Color-blend gradients visible between sections. This is the Phase 2 exit gate.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: compose all sections in new order; apply icon size tokens (bug #7)

Phase 2 complete: 9-section narrative, About as hero toggle,
achievements/education split, bug fixes #1,#3,#4,#5,#6,#7,#8,#10,#12,#13,#14."
```

---

## Phase 3 — New sections' 3D scenes

> The MSc and Certifications sections already exist with stub scenes from Phase 2. Phase 3 builds their real scenes so they're complete before the other scenes in Phase 4. (Order chosen because scenes 5 & 8 are content-isolated.)

**Phase exit gate:** MscProjectModel and CertRibbon scenes animate; build + lint green.

### Task 3.1: Build `MscProjectModel` — animated SVG bell-curve

**Files:** Modify: `src/components/scenes/MscProjectModel.tsx`

- [ ] **Step 1: Replace the stub with the real scene**

```typescript
/* Animated 3D bell-curve / regression surface — generic statistics model.
   Refined once the real MSc project topic is known. */
export const MscProjectModel = () => (
  <div className="msc-model scene-3d" aria-hidden="true">
    <div className="msc-model-inner">
      <svg viewBox="0 0 240 160" className="msc-model-svg">
        <defs>
          <linearGradient id="bellGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {/* 3D axes */}
        <line x1="30" y1="130" x2="210" y2="130" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="30" y1="130" x2="30" y2="30" stroke="#94a3b8" strokeWidth="1.5" />
        {/* bell curve */}
        <path
          d="M30 130 Q 70 130, 90 90 T 120 50 T 150 90 Q 170 130, 210 130 Z"
          fill="url(#bellGrad)"
          stroke="#fb7185"
          strokeWidth="2"
          className="msc-model-curve"
        />
        {/* mean line */}
        <line x1="120" y1="50" x2="120" y2="130" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 4" className="msc-model-mean" />
        {/* data dots */}
        {[60, 90, 110, 120, 130, 150, 180].map((cx, i) => (
          <circle key={i} cx={cx} cy={120 - Math.round(70 * Math.exp(-((cx - 120) ** 2) / 1800))} r="3" fill="#34d399" className="msc-model-dot" style={{ animationDelay: `${i * 0.3}s` }} />
        ))}
      </svg>
    </div>
  </div>
);
```

- [ ] **Step 2: Add CSS**

Append to `style.css`:

```css
/* ────── MSc model ────── */
.msc-model-inner { transform-style: preserve-3d; transform: rotateX(12deg) rotateY(-8deg); }
.msc-model-svg { width: 100%; height: auto; }
.msc-model-curve { transform-origin: center; animation: msc-curve-pulse 4s ease-in-out infinite; }
@keyframes msc-curve-pulse { 0%,100% { opacity: .8; transform: scaleY(1); } 50% { opacity: 1; transform: scaleY(1.05); } }
.msc-model-mean { animation: msc-mean-sweep 3s ease-in-out infinite; }
@keyframes msc-mean-sweep { 0%,100% { opacity: .4; } 50% { opacity: .9; } }
.msc-model-dot { animation: msc-dot-blink 2s ease-in-out infinite; }
@keyframes msc-dot-blink { 0%,100% { opacity: .5; r: 3; } 50% { opacity: 1; r: 4; } }
@media (prefers-reduced-motion: reduce) {
  .msc-model-inner { transform: none; }
  .msc-model-curve, .msc-model-mean, .msc-model-dot { animation: none; }
}
```

Note: animating SVG `r` attribute via CSS works in modern browsers (Chrome 79+, Firefox 75+). If lint/legacy concerns arise, switch to `transform: scale()` on the dots — but `r` animation is simplest here.

- [ ] **Step 3: Build + lint + scroll**

```bash
npm run build && npm run lint && npm run dev
```
Expected: green; MSc section shows an animated bell-curve model.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: MscProjectModel animated bell-curve scene"
```

### Task 3.2: Build `CertRibbon` — 3D ribbon of cert cards

**Files:** Modify: `src/components/scenes/CertRibbon.tsx`, `src/style.css`

- [ ] **Step 1: Replace stub — keep the card grid but add 3D ribbon rotation per card**

```typescript
import { type Certification } from '../../data';
import { Reveal, TiltCard } from '../primitives';

export const CertRibbon = ({ certs }: { certs: Certification[] }) => (
  <div className="cert-ribbon scene-3d">
    <div className="cert-ribbon-inner">
      {certs.map((cert, i) => {
        // spread cards along a gentle 3D arc
        const rotateY = (i - (certs.length - 1) / 2) * 8;
        const translateZ = -Math.abs(i - (certs.length - 1) / 2) * 20;
        return (
          <Reveal key={cert.name + i} delay={i * 70} rotateY={0}>
            <div
              className="cert-arc-card"
              style={{ transform: `rotateY(${rotateY}deg) translateZ(${translateZ}px)` }}
            >
              <TiltCard className="cert-card">
                <div className="cert-seal" aria-hidden="true">📜</div>
                <h4 className="cert-name">{cert.name}</h4>
                <p className="cert-issuer">{cert.issuer}</p>
                <p className="cert-date">{cert.date}</p>
                {cert.credentialId && <p className="cert-id">ID: {cert.credentialId}</p>}
              </TiltCard>
            </div>
          </Reveal>
        );
      })}
    </div>
  </div>
);
```

- [ ] **Step 2: Add CSS**

Append to `style.css`:

```css
/* ────── Cert ribbon ────── */
.cert-ribbon { perspective: 1200px; }
.cert-ribbon-inner {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 1.25rem;
  transform-style: preserve-3d;
}
.cert-arc-card { transform-style: preserve-3d; transition: transform .4s ease; }
.cert-arc-card:hover { transform: rotateY(0deg) translateZ(20px) !important; }
@media (max-width: 640px) {
  .cert-ribbon-inner { flex-direction: column; align-items: center; }
  .cert-arc-card { transform: none !important; }
}
@media (prefers-reduced-motion: reduce) {
  .cert-arc-card { transform: none !important; }
}
```

(Keep the existing `.cert-grid` rule or replace the class usage — here we switched from `.cert-grid` to `.cert-ribbon`. Delete the now-unused `.cert-grid` rule if present, or leave it harmlessly.)

- [ ] **Step 3: Build + lint + scroll**

```bash
npm run build && npm run lint && npm run dev
```
Expected: green; cert cards fan along a 3D arc, straighten on hover.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: CertRibbon 3D arc scene"
```

---

## Phase 4 — Remaining 3D scenes

**Phase exit gate:** all scenes animate and respect reduced-motion; build + lint green.

### Task 4.1: Build `HeroScene` — parallax panel layers

**Files:** Modify: `src/components/scenes/HeroScene.tsx`, `src/style.css`

- [ ] **Step 1: Replace stub with parallax-layered panel**

```typescript
import { useRef, useState, useCallback } from 'react';
import { HeroSignalPanel } from './HeroSignalPanel';

/* HeroSignalPanel wrapped in a parallax layer that responds to pointer.
   Depth layers: calm-visual (back), metrics (mid), glow (front). */
export const HeroScene = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(1200px) rotateY(${x * 6}deg) rotateX(${y * -6}deg)`
    });
  }, []);
  const onLeave = useCallback(() => setStyle({ transform: 'perspective(1200px) rotateY(0) rotateX(0)' }), []);

  return (
    <div ref={ref} className="hero-scene" style={style} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="hero-scene-glow" aria-hidden="true" style={{ transform: 'translateZ(1rem)' }} />
      <div style={{ transform: 'translateZ(2rem)' }}><HeroSignalPanel /></div>
    </div>
  );
};
```

Note: `React.CSSProperties` / `React.MouseEvent` resolve via the global React UMD namespace from `@types/react` (the original `main.tsx` uses the same pattern with no default React import), so this compiles as written.

- [ ] **Step 2: Add CSS**

Append to `style.css`:

```css
/* ────── Hero scene (parallax) ────── */
.hero-scene { position: relative; transform-style: preserve-3d; transition: transform .2s ease-out; }
.hero-scene-glow {
  position: absolute; inset: -10%; border-radius: 2rem; pointer-events: none;
  background: radial-gradient(circle, rgba(251,113,133,.18), transparent 70%);
  filter: blur(20px); z-index: 0;
}
.hero-scene > div:last-child { position: relative; z-index: 1; }
@media (prefers-reduced-motion: reduce) { .hero-scene { transform: none !important; } }
```

- [ ] **Step 3: Build + lint + scroll**

```bash
npm run build && npm run lint && npm run dev
```
Expected: green; hero panel tilts toward pointer with depth layers.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: HeroScene parallax layers"
```

### Task 4.2: Build `SkillsConstellation` — rotating orbit

**Files:** Modify: `src/components/scenes/SkillsConstellation.tsx`, `src/style.css`

- [ ] **Step 1: Replace stub**

```typescript
import { SKILL_DOMAINS } from '../../data';

/* Nodes (skill domain emojis) orbit a central core on a CSS 3D cylinder. */
export const SkillsConstellation = () => {
  const nodes = SKILL_DOMAINS.flatMap(d => d.skills.slice(0, 2).map(s => ({ emoji: d.emoji, label: s })));
  return (
    <div className="skills-constellation scene-3d" aria-hidden="true">
      <div className="constellation-core">🧠</div>
      <div className="constellation-ring">
        {nodes.map((n, i) => {
          const angle = (360 / nodes.length) * i;
          return (
            <span
              key={n.label + i}
              className="constellation-node"
              style={{ transform: `rotateY(${angle}deg) translateZ(5rem)` }}
            >
              <span className="constellation-node-emoji">{n.emoji}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Add CSS**

Append to `style.css`:

```css
/* ────── Skills constellation ────── */
.skills-constellation {
  position: relative; height: 14rem; display: grid; place-items: center;
  perspective: 900px;
}
.constellation-core {
  position: absolute; font-size: 2.5rem; z-index: 2;
  animation: core-pulse 3s ease-in-out infinite;
}
@keyframes core-pulse { 0%,100% { transform: scale(1); opacity: .9; } 50% { transform: scale(1.12); opacity: 1; } }
.constellation-ring {
  position: absolute; width: 10rem; height: 10rem; transform-style: preserve-3d;
  animation: constellation-rotate 18s linear infinite;
}
.constellation-ring:hover { animation-play-state: paused; }
@keyframes constellation-rotate { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
.constellation-node {
  position: absolute; top: 50%; left: 50%; margin: -1rem;
  width: 2rem; height: 2rem; display: grid; place-items: center;
  transform-style: preserve-3d;
}
.constellation-node-emoji { font-size: 1.4rem; }
@media (prefers-reduced-motion: reduce) {
  .constellation-core, .constellation-ring { animation: none; }
}
```

- [ ] **Step 3: Build + lint + scroll**

```bash
npm run build && npm run lint && npm run dev
```
Expected: green; skills section shows a rotating orbit of skill emojis around a core, pauses on hover.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: SkillsConstellation rotating orbit"
```

### Task 4.3: Build `ProjectShowcase` — 3D flip cards

**Files:** Modify: `src/components/scenes/ProjectShowcase.tsx`, `src/style.css`

- [ ] **Step 1: Replace stub with flip cards**

```typescript
import { type ProjectItem } from '../../data';
import { Reveal } from '../primitives';

const FlipCard = ({ project }: { project: ProjectItem }) => (
  <div className="flip-card">
    <div className="flip-card-inner">
      <div className="flip-card-face flip-card-front">
        {project.timeline && <p className="experience-eyebrow">{project.timeline}</p>}
        <h3 className="project-card-heading">{project.title}</h3>
        <p>{project.summary}</p>
        <div className="compact-tags">
          {project.tags.map(t => <span key={t} className="tag-chip">{t}</span>)}
        </div>
        <span className="flip-hint" aria-hidden="true">↻ hover for details</span>
      </div>
      <div className="flip-card-face flip-card-back">
        <h3 className="project-card-heading">{project.title}</h3>
        <ul className="detail-list">
          {project.bullets.map(b => <li key={b}>{b}</li>)}
        </ul>
        {project.link && <a className="text-link" href={project.link} target="_blank" rel="noopener noreferrer">View repository</a>}
      </div>
    </div>
  </div>
);

export const ProjectShowcase = ({ projects }: { projects: ProjectItem[] }) => (
  <div className="project-grid">
    {projects.slice(0, 3).map((project, index) => (
      <Reveal key={project.title} delay={index * 80} rotateY={-10}>
        <FlipCard project={project} />
      </Reveal>
    ))}
  </div>
);
```

- [ ] **Step 2: Add CSS**

Append to `style.css`:

```css
/* ────── Project flip cards ────── */
.flip-card { perspective: 1200px; height: 16rem; }
.flip-card-inner {
  position: relative; width: 100%; height: 100%; transform-style: preserve-3d;
  transition: transform .6s cubic-bezier(0.16,1,0.3,1);
}
.flip-card:hover .flip-card-inner { transform: rotateY(180deg); }
.flip-card-face {
  position: absolute; inset: 0; backface-visibility: hidden;
  padding: 1.4rem; border-radius: 1rem; border: 2px solid rgba(255,255,255,.68);
  background: linear-gradient(145deg, rgba(255,255,255,.93), rgba(236,253,245,.82));
  box-shadow: 0 14px 34px rgba(190,120,90,.12); text-align: center;
  display: flex; flex-direction: column; justify-content: center;
}
.flip-card-back { transform: rotateY(180deg); border-color: rgba(52,211,153,.32); }
.flip-hint { margin-top: auto; font-size: .72rem; color: #94a3b8; }
@media (prefers-reduced-motion: reduce) {
  .flip-card-inner { transition: none; }
  .flip-card:hover .flip-card-inner { transform: none; }
  /* reduced-motion: show front only, details via the existing detail-list below front */
}
```

- [ ] **Step 3: Build + lint + scroll**

```bash
npm run build && npm run lint && npm run dev
```
Expected: green; project cards flip on hover to reveal bullets. (Reduced-motion: static front.)

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: ProjectShowcase 3D flip cards"
```

### Task 4.4: Build `EducationCape` — refined scholar scene

**Files:** Modify: `src/components/scenes/EducationCape.tsx`, `src/style.css`

- [ ] **Step 1: Replace stub (return `null`) with the scene**

Move the `ScholarDecor` SVG (currently in `decorations.tsx`, originally main.tsx:174-229) here, refined: wrap in `scene-3d`, add a swinging tassel. To avoid duplicating, **delete** `ScholarDecor` from `decorations.tsx` and rebuild it here:

```typescript
/* Refined scholar scene — 3D mortarboard with swinging tassel + orbiting icons. */
export const EducationCape = () => (
  <div className="edu-cape scene-3d" aria-hidden="true">
    <div className="edu-cape-hat">
      <svg viewBox="0 0 120 80" className="edu-cape-svg">
        <defs>
          <linearGradient id="capeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
        </defs>
        <path d="M60 5 L5 35 L60 65 L115 35 Z" fill="url(#capeGrad)" opacity="0.35" />
        <path d="M60 15 L20 37 L60 59 L100 37 Z" fill="url(#capeGrad)" opacity="0.6" />
        <rect x="57" y="58" width="6" height="14" fill="#0ea5e9" opacity="0.6" rx="2" />
        {/* swinging tassel */}
        <line x1="100" y1="37" x2="100" y2="52" stroke="#fb7185" strokeWidth="1.5" className="edu-tassel-cord" />
        <circle cx="100" cy="54" r="3" fill="#fbbf24" className="edu-tassel-knot" />
      </svg>
    </div>
    <div className="edu-cape-ring">
      {['🎓','📚','📐','📊','🧮','📜','🔬','💡'].map((ic, i) => (
        <span key={i} className="edu-cape-ring-icon" style={{ ['--i' as string]: i }}>{ic}</span>
      ))}
    </div>
  </div>
);
```

- [ ] **Step 2: Remove `ScholarDecor` from `decorations.tsx`**

Delete the `ScholarDecor` component and its imports/usage from `src/components/decorations.tsx`. Remove the `ScholarDecor` import from `src/sections/Education.tsx` if present (it imports `EducationCape`, so should be fine — verify no dangling reference). Also remove the now-unused `.scholar-decor`, `.scholar-hat`, `.scholar-svg`, `.scholar-ring`, `.scholar-ring-icon` rules from `style.css` (lines 277-300) and replace with the new edu-cape styles:

```css
/* ────── Education cape (replaces scholar-decor — bug #11) ────── */
.edu-cape {
  position: relative; margin: 2rem auto 0; max-width: 12rem;
  display: flex; flex-direction: column; align-items: center;
  perspective: 800px;
}
.edu-cape-hat { transform-style: preserve-3d; animation: cape-hat-tilt 5s ease-in-out infinite; }
@keyframes cape-hat-tilt {
  0%,100% { transform: rotateY(-12deg) translateY(0); }
  50% { transform: rotateY(12deg) translateY(-6px); }
}
.edu-cape-svg { width: 120px; height: 80px; }
.edu-tassel-cord { transform-origin: 100px 37px; animation: tassel-swing 2s ease-in-out infinite; }
.edu-tassel-knot { animation: tassel-swing 2s ease-in-out infinite; }
@keyframes tassel-swing { 0%,100% { transform: translateX(-2px); } 50% { transform: translateX(2px); } }
.edu-cape-ring { display: flex; gap: .3rem; margin-top: .3rem; flex-wrap: wrap; justify-content: center; max-width: 120px; }
.edu-cape-ring-icon { font-size: .7rem; opacity: .35; animation: cape-ring-spin 6s ease-in-out infinite; animation-delay: calc(var(--i) * -0.7s); }
@keyframes cape-ring-spin { 0%,100% { transform: translateY(0) scale(1); opacity: .3; } 50% { transform: translateY(-5px) scale(1.2); opacity: .6; } }
@media (prefers-reduced-motion: reduce) {
  .edu-cape-hat, .edu-tassel-cord, .edu-tassel-knot, .edu-cape-ring-icon { animation: none; }
}
```

- [ ] **Step 3: Build + lint + scroll**

```bash
npm run build && npm run lint && npm run dev
```
Expected: green; education section shows a tilting mortarboard with a swinging tassel.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: EducationCape 3D scholar scene; remove old ScholarDecor (bug #11)"
```

### Task 4.5: Build `ContactOrbit` — 3D orbit of contact nodes

**Files:** Modify: `src/components/scenes/ContactOrbit.tsx`, `src/style.css`

- [ ] **Step 1: Replace stub with orbit**

```typescript
import type React from 'react';

type Channel = { label: string; href: string; Icon: (p: { className?: string }) => React.ReactElement; external?: boolean };

export const ContactOrbit = ({ channels }: { channels: Channel[] }) => (
  <div className="contact-orbit scene-3d" >
    <div className="contact-orbit-core">Let&apos;s connect</div>
    <div className="contact-orbit-ring">
      {channels.map(({ label, href, Icon, external }, i) => {
        const angle = (360 / channels.length) * i;
        return (
          <a
            key={label}
            className="contact-orbit-node"
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            aria-label={label}
            style={{ transform: `rotateY(${angle}deg) translateZ(6rem)` }}
          >
            <Icon className="contact-card-icon" />
            <span>{label}</span>
          </a>
        );
      })}
    </div>
    {/* accessible fallback list for reduced motion / no-3D */}
    <ul className="contact-orbit-fallback">
      {channels.map(({ label, href, Icon, external }) => (
        <li key={label}>
          <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
            <Icon className="contact-card-icon" /><span>{label}</span>
          </a>
        </li>
      ))}
    </ul>
  </div>
);
```

- [ ] **Step 2: Add CSS**

Append to `style.css`:

```css
/* ────── Contact orbit ────── */
.contact-orbit { position: relative; min-height: 16rem; display: grid; place-items: center; perspective: 1000px; }
.contact-orbit-core {
  position: absolute; z-index: 2; padding: .75rem 1.25rem; border-radius: 999px;
  background: linear-gradient(135deg, rgba(255,228,230,.95), rgba(209,250,229,.92));
  border: 2px solid rgba(251,113,133,.35); color: var(--spring-ink); font-weight: 800;
  box-shadow: 0 8px 24px rgba(190,120,90,.18);
}
.contact-orbit-ring {
  position: absolute; width: 12rem; height: 12rem; transform-style: preserve-3d;
  animation: contact-orbit-rotate 22s linear infinite;
}
.contact-orbit-ring:hover { animation-play-state: paused; }
@keyframes contact-orbit-rotate { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
.contact-orbit-node {
  position: absolute; top: 50%; left: 50%; margin: -2rem; width: 4rem;
  display: flex; flex-direction: column; align-items: center; gap: .25rem;
  padding: .75rem; border-radius: .9rem; text-decoration: none;
  border: 2px solid rgba(52,211,153,.3);
  background: linear-gradient(145deg, rgba(255,255,255,.94), rgba(254,243,199,.88));
  color: var(--spring-ink); font-size: .72rem; font-weight: 700;
  box-shadow: 0 12px 28px rgba(190,120,90,.12); transform-style: preserve-3d;
}
.contact-orbit-node:hover { border-color: rgba(251,113,133,.4); }
.contact-orbit-fallback { display: none; }
@media (prefers-reduced-motion: reduce) {
  .contact-orbit-ring { animation: none; }
  .contact-orbit { min-height: auto; }
  .contact-orbit-core, .contact-orbit-ring { display: none; }
  .contact-orbit-fallback {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(9rem,1fr)); gap: 1rem; list-style: none; padding: 0; margin: 0;
  }
  .contact-orbit-fallback a {
    display: flex; flex-direction: column; align-items: center; gap: .65rem; min-height: 7rem;
    padding: 1.25rem; border-radius: 1rem; border: 2px solid rgba(52,211,153,.3);
    background: linear-gradient(145deg, rgba(255,255,255,.94), rgba(254,243,199,.88));
    color: var(--spring-ink); font-weight: 700; text-decoration: none;
  }
}
```

- [ ] **Step 3: Build + lint + scroll**

```bash
npm run build && npm run lint && npm run dev
```
Expected: green; contact section shows orbiting channel nodes around a "Let's connect" core; reduced-motion shows the fallback grid.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: ContactOrbit 3D scene with reduced-motion fallback"
```

### Task 4.6: Build `ExperienceTimeline3D` depth enhancement

The cards already render (Task 2.4). This task adds the 3D depth to the timeline ribbon so nodes recede.

**Files:** Modify: `src/style.css` (timeline depth)

- [ ] **Step 1: Add 3D depth to the timeline**

In `style.css`, enhance `.experience-list` and `.timeline-line`:

```css
.experience-list { display: grid; gap: 1.25rem; perspective: 1200px; }
.timeline-line {
  width: 2px; flex: 1;
  background: linear-gradient(to bottom, #fb7185, #fbbf24, #4ade80, #38bdf8);
  margin-top: .3rem; opacity: .5; min-height: 2rem;
  transform: translateZ(-2rem);
}
.experience-row { transform-style: preserve-3d; }
.experience-row:hover .experience-card { transform: translateZ(10px); }
```

- [ ] **Step 2: Build + lint + scroll**

```bash
npm run build && npm run lint && npm run dev
```
Expected: green; timeline has depth; cards lift on hover.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: ExperienceTimeline3D depth enhancement"
```

---

## Phase 5 — Interview modal + nav

**Phase exit gate:** AI-chat section removed; Interview button in nav opens a modal with focus trap, Esc/click-outside close, scroll lock; build + lint green.

### Task 5.1: Create `InterviewChatModal.tsx`

**Files:**
- Create: `src/components/InterviewChatModal.tsx`
- Reference: `src/main.tsx:878-914` (AICloneChat logic)

- [ ] **Step 1: Create the modal**

```typescript
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { SparklesIcon, SendIcon, LoaderIcon, CloseIcon } from './Icons';

type InterviewChatModalProps = { open: boolean; onClose: () => void; };

export const InterviewChatModal = ({ open, onClose }: InterviewChatModalProps) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Esc to close + focus trap + scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true); setError(''); setResponse('');
    try {
      await new Promise(r => setTimeout(r, 1500));
      setResponse("As a Data Scientist from IIT Kanpur with 3 years at Accenture, I specialize in building ML pipelines (Spark/AWS) and NLP solutions. My focus is always on translating raw data into meaningful business decisions. How can I help you understand my experience further?");
    } catch {
      setError("My AI clone is currently sleeping.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} aria-hidden="true">
      <div
        ref={dialogRef}
        className="modal-dialog chat-spring"
        role="dialog"
        aria-modal="true"
        aria-labelledby="interview-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeBtnRef} type="button" className="modal-close" onClick={onClose} aria-label="Close interview chat">
          <CloseIcon className="modal-close-icon" />
        </button>
        <h4 id="interview-title" className="modal-title">
          <SparklesIcon className="modal-title-icon" />
          Interview My AI Clone
        </h4>
        <p className="modal-subtitle">🧠 Ask my digital twin about my background.</p>
        <p className="chat-demo-note">✨ Demo preview — replies are scripted for now, not a live AI connection.</p>
        <form onSubmit={handleSubmit} className="modal-form">
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="💡 e.g., Have you worked with cloud ETL pipelines?"
            className="modal-input" aria-label="Your question" />
          <button type="submit" className="modal-send" aria-label="Send message">
            {isLoading ? <LoaderIcon className="modal-send-icon animate-spin" /> : <SendIcon className="modal-send-icon" />}
          </button>
        </form>
        {(response || error) && (
          <div className="chat-response">
            <p>💬 {error || response}</p>
          </div>
        )}
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Add modal CSS**

Append to `style.css`:

```css
/* ────── Interview modal ────── */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(30,58,47,.45); backdrop-filter: blur(6px);
  display: grid; place-items: center; padding: 1.5rem;
  animation: modal-fade-in .25s ease-out;
}
@keyframes modal-fade-in { from { opacity: 0; } to { opacity: 1; } }
.modal-dialog {
  position: relative; width: min(40rem, 100%); padding: 2rem;
  border-radius: 1.25rem; text-align: center;
  animation: modal-pop-in .3s cubic-bezier(0.16,1,0.3,1);
}
@keyframes modal-pop-in { from { opacity: 0; transform: scale(.92) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.modal-close {
  position: absolute; top: .75rem; right: .75rem; width: 2.25rem; height: 2.25rem;
  display: grid; place-items: center; border-radius: .6rem;
  border: 1px solid rgba(52,211,153,.3); background: rgba(255,255,255,.8); color: var(--spring-ink); cursor: pointer;
}
.modal-close-icon { width: 1.1rem; height: 1.1rem; }
.modal-title { display: flex; align-items: center; justify-content: center; gap: .5rem; font-size: 1.5rem; font-weight: 800; color: var(--spring-ink); margin: 0 0 .5rem; }
.modal-title-icon { width: 1.5rem; height: 1.5rem; color: #0d9488; }
.modal-subtitle { color: #4d7c68; font-size: .9rem; margin: 0 0 .75rem; }
.modal-form { position: relative; margin-bottom: 1rem; }
.modal-input {
  width: 100%; padding: .9rem 3rem .9rem 1rem;
  background: rgba(255,255,255,.85); border: 1px solid #cbd5e1; border-radius: .6rem;
  color: var(--spring-ink); font-size: .95rem;
}
.modal-input:focus { outline: 2px solid rgba(244,114,182,.55); outline-offset: 2px; }
.modal-send {
  position: absolute; right: .4rem; top: 50%; transform: translateY(-50%);
  width: 2.4rem; height: 2.4rem; display: grid; place-items: center;
  background: rgba(20,184,166,.12); color: #0d9488; border-radius: .5rem; cursor: pointer;
}
.modal-send:hover { background: rgba(20,184,166,.22); }
.modal-send-icon { width: 1.1rem; height: 1.1rem; }
@media (prefers-reduced-motion: reduce) {
  .modal-backdrop, .modal-dialog { animation: none; }
}
```

- [ ] **Step 3: Build + lint**

```bash
npm run build && npm run lint
```
Expected: green.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: InterviewChatModal with focus trap, esc/click-outside close, scroll lock"
```

### Task 5.2: Update `SiteNav.tsx` — Interview button + modal wiring (fix bugs #9, #2, #15)

**Files:**
- Modify: `src/components/SiteNav.tsx`
- Modify: `src/data.ts` (NAV_SECTIONS)
- Modify: `src/main.tsx` (render modal)
- Modify: `src/style.css` (remove dead chat CSS)

- [ ] **Step 1: Update NAV_SECTIONS in `data.ts`**

In `data.ts`, replace the NAV_SECTIONS array (remove the `chat` entry, keep others; the Interview action is a button, not a section):

```typescript
export const NAV_SECTIONS = [
  { id: 'home', label: 'Home', emoji: '🏠' },
  { id: 'achievements', label: 'Achievements', emoji: '🏆' },
  { id: 'skills', label: 'Skills', emoji: '🧰' },
  { id: 'experience', label: 'Experience', emoji: '💼' },
  { id: 'msc', label: 'MSc Project', emoji: '🎓' },
  { id: 'projects', label: 'Projects', emoji: '🧪' },
  { id: 'education', label: 'Education', emoji: '🎓' },
  { id: 'certifications', label: 'Certifications', emoji: '📜' },
  { id: 'contact', label: 'Contact', emoji: '📬' }
] as const;
```

- [ ] **Step 2: Update `SiteNav.tsx` to add the Interview button + modal state**

In `src/components/SiteNav.tsx`, add an `interviewOpen` state and render the modal. Add at the top of the component (after the existing useState calls):

```typescript
const [interviewOpen, setInterviewOpen] = useState(false);
```

Add the Interview button in `.site-nav-right` (before the GitHub icon link):

```tsx
<button
  type="button"
  className="site-nav-action site-nav-interview-btn"
  onClick={() => setInterviewOpen(true)}
>
  <SparklesIcon className="site-nav-action-icon" />
  <span>Interview</span>
</button>
```

And render the modal at the end of the returned `<header>` (just before the closing `</header>`):

```tsx
<InterviewChatModal open={interviewOpen} onClose={() => setInterviewOpen(false)} />
```

Add imports:
```typescript
import { InterviewChatModal } from './InterviewChatModal';
import { SparklesIcon } from './Icons';
```

Also add an Interview entry to the mobile menu social row:

```tsx
<button type="button" className="site-nav-action" onClick={() => setInterviewOpen(true)}>
  <SparklesIcon className="site-nav-action-icon" />
  <span>Interview</span>
</button>
```

- [ ] **Step 3: Add CSS for the Interview button**

Append to `style.css`:

```css
.site-nav-interview-btn {
  background: linear-gradient(135deg, rgba(255,228,229,.95), rgba(255,243,199,.92));
  border-color: rgba(251,113,133,.4); color: #be123c;
}
.site-nav-interview-btn:hover { background: linear-gradient(135deg, rgba(254,205,211,.98), rgba(254,249,195,.95)); }
```

- [ ] **Step 4: Remove dead chat-section CSS (bugs #2, #15)**

In `style.css`, delete:
- The `#chat` rule and `#chat .max-w-4xl { max-width: 336rem !important }` (lines ~613-614) — bug #2.
- The old `.chat-spring` `text-align: center` override if redundant (keep `.chat-spring` since the modal reuses it).
- Any `.border-slate-300`, `.bg-white\/80` etc. utility classes that were only used by the old chat (bug #15) — verify they're unused elsewhere first with a grep; if unused, remove.

- [ ] **Step 5: Build + lint + manual modal test**

```bash
npm run build && npm run lint && npm run dev
```
Expected: green. Click "Interview" in the nav → modal opens centered with backdrop blur. Press Esc → closes. Click backdrop → closes. Tab cycles within modal. Body scroll is locked while open. The old `#chat` section is gone.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: Interview button in nav opens chat modal; remove AI-chat section (bugs #2, #9, #15)"
```

---

## Phase 6 — Polish & QA

**Phase exit gate:** all scenes degrade under reduced-motion; Lighthouse pass; final build + lint green.

### Task 6.1: Reduced-motion audit + width/scroll QA

- [ ] **Step 1: Audit reduced-motion**

In the browser DevTools, toggle "Emulate CSS media feature prefers-reduced-motion: reduce" (Rendering pane). Scroll the whole site. Expected: every scene is static; transitions are instant fades; flip cards show fronts only; contact orbit shows the fallback grid; modal has no entrance animation. Fix any scene that still moves.

- [ ] **Step 2: Width + horizontal-scroll QA**

At widths 1440, 1024, 768, 414, 360 (DevTools responsive):
- No horizontal scrollbar anywhere (the old 336rem bug is gone — confirm).
- All grids collapse to 1 column at narrow widths.
- Nav becomes the mobile menu below 860px; Interview button reachable in the mobile menu.
- Contact orbit doesn't overflow.

- [ ] **Step 3: Fix anything found, then commit (if any changes)**

```bash
git add -A && git commit -m "fix: reduced-motion and responsive QA adjustments" || echo "no changes needed"
```

### Task 6.2: Accessibility + Lighthouse pass

- [ ] **Step 1: Accessibility checklist**

Verify manually:
- Every interactive element is keyboard-reachable (Tab order sensible).
- Modal: focus enters trapped, Esc closes, focus returns to the Interview button on close (add `onClose` focusing the trigger if not already — the modal currently focuses the close button on open; acceptable).
- All decorative scenes are `aria-hidden="true"` (they are, by construction).
- Images/alts: no `<img>` without alt (the site uses SVG/emoji only — confirm).
- Color contrast: accent label text on spring backgrounds meets AA (the `#047857` / `#be123c` / `#4d7c68` palette is retained from the original, already vetted).

- [ ] **Step 2: Lighthouse**

Run Lighthouse (Chrome DevTools → Lighthouse → Performance + Accessibility + Best Practices) on the production build:

```bash
npm run build && npm run preview
```

Open the preview URL, run Lighthouse. Target: Accessibility ≥ 95, Performance ≥ 85 (the canvas particle animation is the heaviest cost; acceptable). Note any failures and fix the cheap ones.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A && git commit -m "fix: accessibility and Lighthouse adjustments" || echo "no changes needed"
```

### Task 6.3: Final build + lint + full scroll-through + plan/spec alignment check

- [ ] **Step 1: Final clean build + lint**

```bash
npm run build && npm run lint
```
Expected: both green, no warnings.

- [ ] **Step 2: Full manual scroll-through**

`npm run dev`, scroll top to bottom. Confirm the full narrative: Hero (toggle About open/closed) → Achievements → Skills (orbit rotating) → Experience (3D timeline) → MSc Project (bell curve, placeholder badge visible) → Portfolio (flip cards on hover) → Education (tilting mortarboard, honors strip) → Certifications (3D ribbon, placeholder note) → Contact (orbit). Color-blend gradients flow between sections. Interview modal works from nav.

- [ ] **Step 3: Spec alignment check**

Re-read `docs/superpowers/specs/2026-06-21-portfolio-redesign-design.md`. Confirm:
- All 9 sections present in order. ✓
- All 15 bug-fix items addressed (cross-check the table). ✓
- About is a hero toggle. ✓
- Interview is a modal from nav. ✓
- Placeholders for MSc + Certs are clearly marked. ✓

- [ ] **Step 4: Final commit**

```bash
git add -A && git commit -m "chore: Phase 6 QA complete — portfolio redesign ready" || echo "already clean"
git log --oneline -20
```

---

## Done

The portfolio is now a 9-section rainbow-spring narrative with per-section CSS/SVG 3D scenes, smooth color-blend transitions, a hero About toggle, a popup interview modal, and all design bugs fixed. Open items for the owner: replace `[PLACEHOLDER]` content in `src/data.ts` (MSC_PROJECT and CERTIFICATIONS) with the real MSc project details and certifications list.
