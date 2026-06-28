# Prompt for Claude Code: Physics-World Portfolio

Paste everything below into Claude Code in your portfolio project's root directory.

---

## Context

I have a half-built portfolio website. Before writing any code, **analyze the existing project**: framework (React/Next.js/Vue/vanilla), styling approach, current file/folder structure, build tool, existing sections and their content, and how content/data is currently structured (hardcoded JSX, markdown, JSON, CMS, etc). Tell me what you find and propose an architecture *before* touching anything, since the rest of this plan needs to bolt onto what already exists rather than replace it.

## The Core Concept

Each major section of the portfolio is a distinct **"world"** — a real-time physics-simulated 3D (or 2.5D) background that the visitor scrolls/travels through, like moving between levels in a game. Scrolling from one section to the next should feel like a deliberate transition between worlds (camera move, portal effect, color/lighting shift) — not just a CSS section change.

Hard requirements that must never be compromised for visual flair:
1. **Content stays the primary focus.** Name, role, project details, experience, contact info must always be clearly readable on top of the simulation (use glass-panel/scrim/blur containers with strong contrast — never let the animation fight the text).
2. **It must run smoothly on a recruiter's laptop**, not just a gaming rig. 60fps target on desktop, graceful degradation on mobile/low-end devices.
3. **It must respect `prefers-reduced-motion`** and provide a "reduce motion" toggle that swaps simulations for static/lightweight gradients without losing any content.
4. Each world should be **lazy-loaded/mounted only when its section is near the viewport**, and properly disposed (WebGL context, physics world, listeners) when scrolled away, to avoid memory leaks and tab slowdown over a long scroll.

## Recommended Tech Stack

Use this unless it conflicts with the existing codebase — if it does, adapt the same ideas to the existing stack and tell me why you changed it:

- **Rendering:** Three.js via `@react-three/fiber` + `@react-three/drei` (if React) — or vanilla Three.js if not React.
- **Physics:** `@react-three/rapier` (or `rapier3d` / `cannon-es` directly) — Rapier preferred for performance.
- **Scroll/transition orchestration:** GSAP + ScrollTrigger (or Framer Motion if already in use) combined with `lenis` for smooth scroll.
- **Performance management:** mount/unmount Canvas per section using an IntersectionObserver wrapper; detect device tier (e.g. check GPU/`navigator.hardwareConcurrency`) and reduce particle/body counts accordingly.

## World-by-Section Design

Build a **shared, reusable "WorldSection" component** (camera rig, lighting rig, physics world wrapper, content-overlay slot) so each section just plugs in its own simulation + content, rather than reinventing the scaffolding each time. Then implement these worlds (adjust section names/order to match my actual content):

| Section | World theme | Physics/sim idea |
|---|---|---|
| Hero / Intro | Open space or abstract origin world | Particle field with soft gravity wells, parallax starfield, gentle drifting rigid-body shapes that react to cursor |
| Skills | Mechanical / workshop world | Floating gears, circuit boards, robotic-arm silhouettes; rigid-body "skill chips" (logos as physics objects) that collide, settle, and can be flicked around with mouse drag |
| Professional Experience | Ocean / sailing world | Simulated wave shader (Gerstner waves or simplex-noise displacement), a ship/boat moving forward as you scroll, floating platforms/islands per job that "surface" as you reach them |
| Projects | City-at-night or orbital/satellite world | Either neon city blocks lit up per project card, or planets/satellites you "fly to" — each project = one celestial body with its own small orbit physics |
| Education | Library / mountain world | Stacked books with rigid-body toppling physics, or a climbing path up a mountain with rope/chain physics |
| Contact / Closing | Calm sunrise, zen garden, or campfire world | Soft particle embers/fireflies, gentle cloth-sim flag or fabric, slow ambient motion — should feel like an exhale after all the kinetic energy of earlier sections |

Feel free to suggest better thematic fits once you've seen my actual section content — these are starting points, not fixed requirements.

## Transition Mechanics

Between sections, implement one consistent transition language (pick one and apply everywhere, don't mix styles):
- Camera dolly/zoom "through a portal" into the next world, with a brief color-grade/fog crossfade, OR
- A scroll-linked camera flythrough where the previous world recedes and the next rises into view, with physics objects from the outgoing world settling/falling away as it disappears.

Whichever you pick, the previous section's physics world must fully unmount (not just hide) once its transition completes, to keep memory/CPU bounded.

## Implementation Plan (do this in phases, checking in with me between each)

1. **Audit** existing code, propose final architecture, list new dependencies.
2. **Build the shared scaffolding**: WorldSection component, lazy-mount/unmount logic, scroll-orchestration setup, reduced-motion fallback system.
3. **Build world #1 (Hero)** fully end-to-end as the reference template — get this right before replicating the pattern.
4. **Replicate the pattern** for each remaining section with its own simulation.
5. **Polish pass**: transition consistency, loading states (e.g. a brief "loading world..." shimmer per section), mobile fallback tier, accessibility toggle.
6. **Performance pass**: profile FPS per section, cap particle/rigid-body counts as needed, run a Lighthouse pass.

## Deliverables

- Working, commented code (explain the physics setup choices, not just what but why).
- A short note in the README on how to add a new "world" section in the future, since I'll likely add more sections later.

Start with Phase 1 — analyze my current codebase and report back before writing any implementation code.
