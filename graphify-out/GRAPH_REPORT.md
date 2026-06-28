# Graph Report - .  (2026-06-21)

## Corpus Check
- Corpus is ~21,793 words - fits in a single context window. You may not need a graph.

## Summary
- 251 nodes · 300 edges · 22 communities (15 shown, 7 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Icon Components|Icon Components]]
- [[_COMMUNITY_Resume & Experience|Resume & Experience]]
- [[_COMMUNITY_ML Projects & Models|ML Projects & Models]]
- [[_COMMUNITY_UI Primitives & Shell|UI Primitives & Shell]]
- [[_COMMUNITY_TSConfig App|TSConfig App]]
- [[_COMMUNITY_TSConfig Node|TSConfig Node]]
- [[_COMMUNITY_Design Spec & Rationale|Design Spec & Rationale]]
- [[_COMMUNITY_Package Configuration|Package Configuration]]
- [[_COMMUNITY_Dev Dependencies|Dev Dependencies]]
- [[_COMMUNITY_Implementation Plan|Implementation Plan]]
- [[_COMMUNITY_SVG Assets & Icons|SVG Assets & Icons]]
- [[_COMMUNITY_Build Toolchain README|Build Toolchain README]]
- [[_COMMUNITY_App Entry & HTML|App Entry & HTML]]
- [[_COMMUNITY_TSConfig Root|TSConfig Root]]
- [[_COMMUNITY_Design Documents|Design Documents]]
- [[_COMMUNITY_Phase 3 3D Scenes|Phase 3: 3D Scenes]]
- [[_COMMUNITY_MLOps Pipeline|MLOps Pipeline]]
- [[_COMMUNITY_Time Series Forecasting|Time Series Forecasting]]
- [[_COMMUNITY_NLTK|NLTK]]
- [[_COMMUNITY_Spacy|Spacy]]

## God Nodes (most connected - your core abstractions)
1. `Prithwijit Ghosh` - 23 edges
2. `compilerOptions` - 17 edges
3. `compilerOptions` - 16 edges
4. `Sales and Guest-Count Forecasting (Global QSR Brand)` - 14 edges
5. `Intelligent Collections 3.0 (Water Treatment Brand)` - 10 edges
6. `React + TypeScript + Vite README` - 6 edges
7. `icons.svg (UI Icon Sprite Set)` - 6 edges
8. `scripts` - 5 edges
9. `Portfolio App index.html` - 5 edges
10. `Color-Blend Transition System` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Purple Gradient Glow Theme` --conceptually_related_to--> `Documentation / Code-Brackets Icon`  [INFERRED]
  public/favicon.svg → public/icons.svg
- `Phase 1: Foundations` --implements--> `TiltCard v2 (Parallax + Glare)`  [EXTRACTED]
  docs/superpowers/plans/2026-06-21-portfolio-redesign.md → docs/superpowers/specs/2026-06-21-portfolio-redesign-design.md
- `Phase 1: Foundations` --implements--> `Reveal Primitive (3D Entrance)`  [EXTRACTED]
  docs/superpowers/plans/2026-06-21-portfolio-redesign.md → docs/superpowers/specs/2026-06-21-portfolio-redesign-design.md
- `SectionShell()` --calls--> `blendStops()`  [EXTRACTED]
  src/components/SectionShell.tsx → src/theme.ts
- `TypewriterText()` --calls--> `useTypewriter()`  [EXTRACTED]
  src/main.tsx → src/hooks/useTypewriter.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **React app bootstrap: HTML shell loads entry module that mounts into root** — portfolio_app_index, portfolio_app_src_main_tsx, portfolio_app_root_div [EXTRACTED 1.00]
- **Forecasting model stack** — src_prithwijit_ghosh_resume_20260523_tech_prophet, src_prithwijit_ghosh_resume_20260523_tech_theta, src_prithwijit_ghosh_resume_20260523_tech_mstl, src_prithwijit_ghosh_resume_20260523_tech_lightgbm, src_prithwijit_ghosh_resume_20260523_tech_arima, src_prithwijit_ghosh_resume_20260523_tech_sarima [INFERRED 0.85]
- **QSR MLOps deployment stack** — src_prithwijit_ghosh_resume_20260523_tech_docker, src_prithwijit_ghosh_resume_20260523_tech_github_actions, src_prithwijit_ghosh_resume_20260523_tech_apache_airflow, src_prithwijit_ghosh_resume_20260523_tech_aws_fargate [INFERRED 0.85]
- **LLM / AI Agent stack** — src_prithwijit_ghosh_resume_20260523_tech_langchain, src_prithwijit_ghosh_resume_20260523_tech_langgraph, src_prithwijit_ghosh_resume_20260523_tech_ollama [INFERRED 0.85]
- **Social-Media UI Icon Set** — public_icons_bluesky, public_icons_discord, public_icons_github, public_icons_x, public_icons_social [INFERRED 0.95]
- **Implementation Phase Sequence (0 through 6)** — plans_2026_06_21_portfolio_redesign_phase_0, plans_2026_06_21_portfolio_redesign_phase_1, plans_2026_06_21_portfolio_redesign_phase_2, plans_2026_06_21_portfolio_redesign_phase_3, plans_2026_06_21_portfolio_redesign_phase_4, plans_2026_06_21_portfolio_redesign_phase_5, plans_2026_06_21_portfolio_redesign_phase_6 [EXTRACTED 1.00]
- **CSS/SVG 3D Primitive Components (TiltCard v2, Reveal, Scene3D)** — specs_2026_06_21_portfolio_redesign_design_tiltcard_v2, specs_2026_06_21_portfolio_redesign_design_reveal, specs_2026_06_21_portfolio_redesign_design_scene3d [EXTRACTED 1.00]

## Communities (22 total, 7 thin omitted)

### Community 0 - "Icon Components"
Cohesion: 0.06
Nodes (38): BackToTop(), CornerIcons, CursorGlow(), DataFloatIcons(), DataNetworkCanvas(), ScholarDecor(), ScrollProgress(), SECTION_CORNERS (+30 more)

### Community 1 - "Resume & Experience"
Cohesion: 0.08
Nodes (25): Prithwijit Ghosh Resume, Accenture Global Technology, Bidhannagar College, Indian Institute of Technology Kanpur (IITK), Prithwijit Ghosh, Cash Flow Forecasting (Power Utility Company), Marketing Data Analysis (Liquor Brand), Demographic-Aware Recommender System with Facial Embeddings (+17 more)

### Community 2 - "ML Projects & Models"
Cohesion: 0.09
Nodes (24): Credit Card Fraud Detection, Intelligent Collections 3.0 (Water Treatment Brand), Sales and Guest-Count Forecasting (Global QSR Brand), Apache Airflow, ARIMA, Astronomer, AWS Fargate, CatBoost (+16 more)

### Community 3 - "UI Primitives & Shell"
Cohesion: 0.12
Nodes (17): AnimatedCounter(), AnimatedCounterProps, FadeIn(), FadeInProps, SectionHeading(), SkillBar(), SkillBarProps, TiltCard() (+9 more)

### Community 4 - "TSConfig App"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+10 more)

### Community 5 - "TSConfig Node"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+9 more)

### Community 6 - "Design Spec & Rationale"
Cohesion: 0.17
Nodes (16): ContactOrbit Scene, Phase 1: Foundations, Phase 4: Remaining 3D Scenes, Phase 6: Polish & QA, SectionShell.tsx, SkillsConstellation Scene, Color-Blend Transition System, CSS/SVG 3D Only (No WebGL) (+8 more)

### Community 7 - "Package Configuration"
Cohesion: 0.15
Nodes (12): dependencies, react, react-dom, name, private, scripts, build, dev (+4 more)

### Community 8 - "Dev Dependencies"
Cohesion: 0.15
Nodes (13): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/node, @types/react (+5 more)

### Community 9 - "Implementation Plan"
Cohesion: 0.22
Nodes (13): data.ts (Content Data Module), InterviewChatModal.tsx, Phase 0: Scaffold, Phase 2: Reorder + Content Sections, Phase 5: Interview Modal + Nav, primitives.tsx (FadeIn, TiltCard, Reveal, Scene3D), SiteNav.tsx, theme.ts (Theme Tokens + Accents) (+5 more)

### Community 10 - "SVG Assets & Icons"
Cohesion: 0.29
Nodes (10): favicon.svg (Brand Favicon Asset), Lightning / Zigzag Logo Mark, Purple Gradient Glow Theme, icons.svg (UI Icon Sprite Set), Bluesky Social Icon, Discord Logo Icon, Documentation / Code-Brackets Icon, GitHub Logo Icon (+2 more)

### Community 11 - "Build Toolchain README"
Cohesion: 0.31
Nodes (9): eslint-plugin-react-dom, eslint-plugin-react-x, Oxc (JS toolchain), React Compiler, React + TypeScript + Vite README, SWC (Rust JS compiler), tseslint type-checked configs, @vitejs/plugin-react (+1 more)

### Community 12 - "App Entry & HTML"
Cohesion: 0.40
Nodes (6): favicon.svg, Portfolio App index.html, Google Font: Inter, Google Font: JetBrains Mono, #root mount node, src/main.tsx (app entry script)

## Knowledge Gaps
- **128 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+123 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Prithwijit Ghosh` connect `Resume & Experience` to `ML Projects & Models`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `Sales and Guest-Count Forecasting (Global QSR Brand)` connect `ML Projects & Models` to `Resume & Experience`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `Intelligent Collections 3.0 (Water Treatment Brand)` connect `ML Projects & Models` to `Resume & Experience`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _132 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Icon Components` be split into smaller, more focused modules?**
  _Cohesion score 0.06313497822931785 - nodes in this community are weakly interconnected._
- **Should `Resume & Experience` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `ML Projects & Models` be split into smaller, more focused modules?**
  _Cohesion score 0.09057971014492754 - nodes in this community are weakly interconnected._