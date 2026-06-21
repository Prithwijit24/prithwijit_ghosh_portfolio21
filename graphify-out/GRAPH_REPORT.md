# Graph Report - .  (2026-06-21)

## Corpus Check
- Corpus is ~6,357 words - fits in a single context window. You may not need a graph.

## Summary
- 200 nodes · 198 edges · 18 communities (12 shown, 6 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_React UI Components & Sections|React UI Components & Sections]]
- [[_COMMUNITY_Resume Profile & Background|Resume Profile & Background]]
- [[_COMMUNITY_ML Projects & MLOps Stack|ML Projects & MLOps Stack]]
- [[_COMMUNITY_App TSConfig|App TSConfig]]
- [[_COMMUNITY_Node TSConfig|Node TSConfig]]
- [[_COMMUNITY_Package Manifest|Package Manifest]]
- [[_COMMUNITY_Dev Dependencies|Dev Dependencies]]
- [[_COMMUNITY_Brand Assets & Icons|Brand Assets & Icons]]
- [[_COMMUNITY_Build Tooling & Lint|Build Tooling & Lint]]
- [[_COMMUNITY_HTML Entry & Fonts|HTML Entry & Fonts]]
- [[_COMMUNITY_Root TSConfig|Root TSConfig]]
- [[_COMMUNITY_Typewriter Hook|Typewriter Hook]]
- [[_COMMUNITY_MLOps Concept|MLOps Concept]]
- [[_COMMUNITY_Forecasting Concept|Forecasting Concept]]
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
10. `Demographic-Aware Recommender System with Facial Embeddings` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Purple Gradient Glow Theme` --conceptually_related_to--> `Documentation / Code-Brackets Icon`  [INFERRED]
  public/favicon.svg → public/icons.svg

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **React app bootstrap: HTML shell loads entry module that mounts into root** — portfolio_app_index, portfolio_app_src_main_tsx, portfolio_app_root_div [EXTRACTED 1.00]
- **Forecasting model stack** — src_prithwijit_ghosh_resume_20260523_tech_prophet, src_prithwijit_ghosh_resume_20260523_tech_theta, src_prithwijit_ghosh_resume_20260523_tech_mstl, src_prithwijit_ghosh_resume_20260523_tech_lightgbm, src_prithwijit_ghosh_resume_20260523_tech_arima, src_prithwijit_ghosh_resume_20260523_tech_sarima [INFERRED 0.85]
- **QSR MLOps deployment stack** — src_prithwijit_ghosh_resume_20260523_tech_docker, src_prithwijit_ghosh_resume_20260523_tech_github_actions, src_prithwijit_ghosh_resume_20260523_tech_apache_airflow, src_prithwijit_ghosh_resume_20260523_tech_aws_fargate [INFERRED 0.85]
- **LLM / AI Agent stack** — src_prithwijit_ghosh_resume_20260523_tech_langchain, src_prithwijit_ghosh_resume_20260523_tech_langgraph, src_prithwijit_ghosh_resume_20260523_tech_ollama [INFERRED 0.85]
- **Social-Media UI Icon Set** — public_icons_bluesky, public_icons_discord, public_icons_github, public_icons_x, public_icons_social [INFERRED 0.95]

## Communities (18 total, 6 thin omitted)

### Community 0 - "React UI Components & Sections"
Cohesion: 0.04
Nodes (20): ACHIEVEMENTS_DATA, AnimatedCounterProps, CornerIcons, DS_ICONS, EXPERIENCE_ITEMS, ExperienceItem, FadeInProps, NAV_CENTER_SECTIONS (+12 more)

### Community 1 - "Resume Profile & Background"
Cohesion: 0.08
Nodes (25): Prithwijit Ghosh Resume, Accenture Global Technology, Bidhannagar College, Indian Institute of Technology Kanpur (IITK), Prithwijit Ghosh, Cash Flow Forecasting (Power Utility Company), Marketing Data Analysis (Liquor Brand), Demographic-Aware Recommender System with Facial Embeddings (+17 more)

### Community 2 - "ML Projects & MLOps Stack"
Cohesion: 0.09
Nodes (24): Credit Card Fraud Detection, Intelligent Collections 3.0 (Water Treatment Brand), Sales and Guest-Count Forecasting (Global QSR Brand), Apache Airflow, ARIMA, Astronomer, AWS Fargate, CatBoost (+16 more)

### Community 3 - "App TSConfig"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+10 more)

### Community 4 - "Node TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+9 more)

### Community 5 - "Package Manifest"
Cohesion: 0.15
Nodes (12): dependencies, react, react-dom, name, private, scripts, build, dev (+4 more)

### Community 6 - "Dev Dependencies"
Cohesion: 0.15
Nodes (13): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/node, @types/react (+5 more)

### Community 7 - "Brand Assets & Icons"
Cohesion: 0.29
Nodes (10): favicon.svg (Brand Favicon Asset), Lightning / Zigzag Logo Mark, Purple Gradient Glow Theme, icons.svg (UI Icon Sprite Set), Bluesky Social Icon, Discord Logo Icon, Documentation / Code-Brackets Icon, GitHub Logo Icon (+2 more)

### Community 8 - "Build Tooling & Lint"
Cohesion: 0.31
Nodes (9): eslint-plugin-react-dom, eslint-plugin-react-x, Oxc (JS toolchain), React Compiler, React + TypeScript + Vite README, SWC (Rust JS compiler), tseslint type-checked configs, @vitejs/plugin-react (+1 more)

### Community 9 - "HTML Entry & Fonts"
Cohesion: 0.40
Nodes (6): favicon.svg, Portfolio App index.html, Google Font: Inter, Google Font: JetBrains Mono, #root mount node, src/main.tsx (app entry script)

## Knowledge Gaps
- **124 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+119 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Prithwijit Ghosh` connect `Resume Profile & Background` to `ML Projects & MLOps Stack`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `Sales and Guest-Count Forecasting (Global QSR Brand)` connect `ML Projects & MLOps Stack` to `Resume Profile & Background`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `Intelligent Collections 3.0 (Water Treatment Brand)` connect `ML Projects & MLOps Stack` to `Resume Profile & Background`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _126 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `React UI Components & Sections` be split into smaller, more focused modules?**
  _Cohesion score 0.038461538461538464 - nodes in this community are weakly interconnected._
- **Should `Resume Profile & Background` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `ML Projects & MLOps Stack` be split into smaller, more focused modules?**
  _Cohesion score 0.09057971014492754 - nodes in this community are weakly interconnected._