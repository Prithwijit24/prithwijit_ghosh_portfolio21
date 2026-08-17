import type { SpringAccent } from './theme';
import { LATEST_RESUME_FILENAME } from './_resume';

/* ───────── Navigation ───────── */
export const NAV_SECTIONS = [
  { id: 'home', label: 'Home', emoji: '🏠' },
  { id: 'achievements', label: 'Wins', emoji: '🏆' },
  { id: 'skills', label: 'Skills', emoji: '🧰' },
  { id: 'experience', label: 'Experience', emoji: '💼' },
  { id: 'projects', label: 'Projects', emoji: '🧪' },
  { id: 'education', label: 'Education', emoji: '🎓' },
  { id: 'contact', label: 'Contact', emoji: '📬' }
] as const;

export const NAV_CENTER_SECTIONS = NAV_SECTIONS.filter(
  (section) => section.id !== 'home' && section.id !== 'contact'
);

export const PROFILE_LINKS = {
  email: 'mailto:ghoshprithwijit39@gmail.com',
  phone: 'tel:+917595986858',
  github: 'https://github.com/Prithwijit24',
  linkedin: 'https://www.linkedin.com/in/prithwijit-ghosh-datascience/',
  resume: `/resumes/${LATEST_RESUME_FILENAME}`
} as const;

/* ───────── Data types ───────── */
export type SkillDomain = { title: string; emoji: string; accent: SpringAccent; description: string; skills: string[]; level: number };
export type ExperienceItem = { title: string; client: string; timeline: string; summary: string; bullets: string[]; tags: string[] };
export type ProjectItem = { title: string; timeline?: string; summary: string; bullets: string[]; link?: string; tags: string[] };

export const SKILL_DOMAINS: SkillDomain[] = [
  { title: 'Programming Languages', emoji: '💻', accent: 'blossom', description: 'Core languages & version control for building data products.', skills: ['Python','SQL','R','Git','GitHub Actions'], level: 95 },
  { title: 'Tools', emoji: '🧰', accent: 'sunshine', description: 'BI, streaming & monitoring stack.', skills: ['MS Excel','MS PowerPoint','Power BI','Redis','Kafka','Prometheus'], level: 88 },
  { title: 'Cloud Tools', emoji: '☁️', accent: 'sky', description: 'Containers, orchestration, APIs & AWS deployment.', skills: ['Docker','Kubernetes','FastAPI','Streamlit','Astronomer','Airflow','AWS Fargate','AWS EMR','EC2','S3','CloudWatch'], level: 88 },
  { title: 'Libraries', emoji: '📚', accent: 'mint', description: 'ML, DL, NLP & LLM libraries I work with daily.', skills: ['Pandas','Scikit-learn','XGBoost','LightGBM','NLTK','spaCy','TensorFlow','Keras','LangChain','LangGraph','Ollama'], level: 93 },
  { title: 'Domains', emoji: '🧠', accent: 'violet', description: 'Areas of expertise across the data & AI stack.', skills: ['Data Science','Data Analysis','Predictive Modelling','Classification','NLP','Statistics','Time Series','BI','LLM','AI Agents','RAG'], level: 96 }
];

/* Colour a card tag by the Skills category it belongs to, so tags match the
   Skills section (e.g. Time Series → Domains → violet, Airflow → Cloud → sky). */
const SKILL_ACCENT = new Map<string, SpringAccent>();
for (const d of SKILL_DOMAINS) for (const s of d.skills) SKILL_ACCENT.set(s.toLowerCase(), d.accent);

// tags that aren't literal skill entries, mapped to the right category colour
const TAG_ACCENT_OVERRIDES: Record<string, SpringAccent> = {
  'mlops': 'sky', 'streaming ml': 'sky',
  'risk scoring': 'violet', 'ar forecasting': 'violet', 'collections': 'violet',
  'cash flow': 'violet', 'rfm': 'violet', 'marketing analytics': 'violet',
  'fraud detection': 'violet', 'recommender': 'violet', 'collaborative filtering': 'violet',
  'robust statistics': 'violet', 'dd-classifier': 'violet', 'mahalanobis depth': 'violet',
  'cell-wise robust': 'violet',
  'dashboards': 'sunshine',
  'facenet': 'mint', 'embeddings': 'mint',
  'r + python': 'blossom'
};

export const tagAccent = (tag: string): SpringAccent =>
  SKILL_ACCENT.get(tag.toLowerCase()) ?? TAG_ACCENT_OVERRIDES[tag.toLowerCase()] ?? 'sky';

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    title: 'Sales and Guest-Count Forecasting System', client: 'Global QSR Brand',
    summary: 'Multi-country sales & guest-count forecasting system for long-range planning.',
    bullets: [
      'Designed and productionized an ensemble forecasting system predicting sales and guest counts up to **48 months** ahead using Prophet, Theta, MSTL, LightGBM, and Naïve models with macroeconomic indicators for **6 countries**.',
      'Engineered a custom horizon-aware evaluation framework (trend & seasonal MAPE) across **450+ forecasting models** with an ensemble balancing strategy, stabilizing long-range forecasts to **97–99% at 24 months** and **95–96% at 48 months**.',
      'Implemented a production-grade MLOps pipeline on Docker and GitHub Actions for CI/CD, with unit and integration testing plus security scanning (**SonarQube, Snyk**) before artifact deployment to **JFrog Artifactory**.',
      'Deployed automated monthly forecasting workflows via Astronomer on Apache Airflow DAGs on **AWS Fargate**, enabling reliable large-scale production forecasting.'
    ], tags: ['Python', 'SQL', 'Git', 'Time Series', 'MLOps', 'AWS Fargate', 'Airflow'],
    timeline: ''
  },
  {
    title: 'Late-Payment Risk Prediction', client: 'Water Treatment Brand',
    summary: 'Customer-level late-payment prediction, calibrated risk scoring & AR forecasting.',
    bullets: [
      'Built customer-level late-payment prediction models using **XGBoost** with **50 selected features** from **1000+ derived features**, achieving **84% AUC (due-date)** and **90% AUC (due-month)** across a **10K+ monthly customer base**.',
      'Developed calibrated **risk scoring and risk categorization** using **quantile calibration**, cutting overdue amounts by **38%**, lowering open Accounts Receivable by **15%**, and lifting collections by **12%** over the next 2 years after go-live.',
      'Designed short-term **AR forecasting models (1–6 month horizon)** across client segments using statistical methods (SMA, EWMA, ARIMA, SARIMA, Theta, MSTL) and ML/DL models (XGBoost, LightGBoost, CatBoost, TCN).',
      'Achieved **95–98% accuracy** across Not Yet Due, Current Due and Over Due categories, delivered through an interactive **Power BI** dashboard for leadership and client reporting.'
    ], tags: ['Python','SQL','XGBoost','Risk Scoring','Power BI','AR Forecasting','Collections'],
    timeline: ''
  },
  {
    title: 'Financial Forecast Intelligence', client: 'Accenture',
    summary: 'Natural-language decision intelligence over contract P&L data — answering margin, labour-cost and cost-mix questions with causes and next actions across 70,000+ contracts.',
    bullets: [
      'Built a natural-language **decision-intelligence platform** over contract **profit-and-loss data**, answering finance managers’ questions on margin, labour-cost ratio and cost mix — with *why it moved* and *what to do next* — across **70,000+ contracts**.',
      'Engineered a **multi-agent system** on **LangGraph** and **Gemini 2.5 Flash (Vertex AI)**: a typed intent compiler translating questions into executable **BigQuery SQL**, **8 domain-specialist agents**, and a **53-node decision knowledge graph** mapping business intent to metrics, causal drivers and recommended actions.',
      'Replaced language-model routing with **deterministic graph traversal**, making reasoning reproducible and owned by finance experts with every figure traced to source data — cutting variance analysis from hours of manual work to **~10 seconds**.',
      'Deployed **six parallel service variants** (standard, batch, load-balanced, region-specific) on **Google Cloud serverless**, provisioned with **Terraform** across sandbox, staging and production and released through gated **Azure DevOps** pipelines with end-to-end tracing.'
    ], tags: ['Python','SQL','LangGraph','Gemini','BigQuery','Vertex AI','Terraform','Azure DevOps','Decision Intelligence'],
    timeline: ''
  },
  {
    title: 'Cash-Flow & Marketing Analytics', client: 'Power Utility & Liquor Brand Clients',
    summary: 'Forecasting & marketing analytics prototypes for cash-flow accuracy and customer growth.',
    bullets: [
      'Delivered end-to-end **B2C cash flow forecasting** using **6M+ customers** data, improving **Cash-In accuracy to 98% (from 70%)** and **Cash-Out to 93% (from 64%)** through advanced ML modeling.',
      'Enabled **business insights via interactive dashboards** for the power utility client.',
      'Analyzed **customer behavior** across subscription patterns, marketing campaigns, conversion funnels, up-sell, cross-sell and churn propensity for an internationally renowned liquor brand.',
      'Applied **RFM** and advanced analytics to drive data-informed **growth and retention** strategies.'
    ], tags: ['Python','SQL','Cash Flow','RFM','Marketing Analytics','Dashboards'],
    timeline: ''
  }
];

export const PROJECTS: ProjectItem[] = [
  { title: 'SkinWise Intelligent Recommender', timeline: 'Jun 2025 – Mar 2026',
    summary: 'Facial analysis & demographic prediction feeding a LangGraph agent that researches and recommends skincare products.',
    bullets: [
      'Facial analysis: **FaceNet 512-D embeddings** → PCA to **50-D**, then **LightGBM** (age ~5.7 yr error), **KNN** (gender ~97%) and **CatBoost** (race ~94%) with Fitzpatrick skin-tone mapping.',
      '**LangGraph agent** researches skin concerns, ingredients and real products, then a **safety gate** validates the routine before personalized recommendations.',
      'Product discovery pulls from external sources (**Open Beauty Facts, SerpAPI**) rather than LLM generation; end-to-end **Streamlit app** containerized with **Docker** and deployed on **Hugging Face**.'
    ],
    link: 'https://github.com/Prithwijit24/skinwise_intelligent_recommender',
    tags: ['Python','FaceNet','LangGraph','Streamlit','Docker','Recommender'] },
  { title: 'Credit Card Fraud Detection', timeline: 'Jan 2026 – Mar 2026',
    summary: 'Production-grade fraud detection with leakage-safe features, streaming scoring and explainable risk alerts.',
    bullets: [
      '**Leakage-safe feature engineering** with chronological splits and a **DuckDB feature store**, training **XGBoost / Random Forest** models optimized for **PR-AUC** via walk-forward CV.',
      '**Kafka** micro-batch scoring plus **FastAPI** serving with risk-aware alerting (risk bands & reason strings) for explainable fraud triage.',
      'Fully containerized with **Docker & Kubernetes**, including **CI/CD** and automated unit & integration testing.'
    ],
    link: 'https://github.com/Prithwijit24/credit_card_fraud_detection/tree/fraud_v1',
    tags: ['Python','XGBoost','Kafka','FastAPI','Kubernetes','Fraud Detection','MLOps'] },
  { title: 'Agentic Travel Planner', timeline: 'Mar 2026 – Present',
    summary: 'LangGraph + hybrid Graph/Vector RAG travel planner that builds context-aware itineraries with critique agents.',
    bullets: [
      '**Hybrid Graph + Vector RAG** (**Neo4j** + **ChromaDB**) retrieves real POIs, with deterministic bin-packing for day-by-day itinerary sequencing.',
      '**LangGraph critique loop** (cost → budget → timing → revise) and specialist workers for routing, budgeting and timing, with heuristic fallbacks.',
      '**FastAPI** backend (SSE progress + Prometheus metrics) and **Streamlit** UI; cuts planning wall-time from **~745s to ~13–35s** with low hallucination risk.'
    ],
    link: 'https://github.com/Prithwijit24/agentic_travel_planner',
    tags: ['Python','LangGraph','Neo4j','ChromaDB','RAG','FastAPI','Streamlit'] },
  { title: 'Music Recommendation System', timeline: 'Dec 2025 – Present',
    summary: 'Music recommendations from the Million Song Dataset via content-based retrieval, collaborative filtering and hybrid ranking.',
    bullets: [
      'Content-based retrieval via **nearest-neighbor search over compressed audio embeddings** from the **Million Song Dataset**.',
      '**Collaborative filtering** (matrix factorization) and **hybrid ranking** blend content and interaction signals, plus a deep **autoencoder** for latent representations.',
      'Served through a **REST API** and **Streamlit** UI, fully containerized with **Docker, Kubernetes** and CI/CD.'
    ],
    link: 'https://github.com/Prithwijit24/music_recommendation',
    tags: ['Python','Embeddings','Collaborative Filtering','Autoencoder','FastAPI','Recommender'] }
];

export type Achievement = { emoji: string; stat: string; label: string; desc: string; chart?: 'reduction' | 'auc' };

export const ACHIEVEMENTS_DATA: Achievement[] = [
  { emoji: '🏆', stat: 'AIR 7', label: 'JAM Statistics All India Rank', desc: 'Among thousands of candidates nationwide' },
  { emoji: '🎯', stat: '97–99%', label: 'Forecast Accuracy', desc: '24-month multi-country forecasts' },
  { emoji: '🔬', stat: '90%', label: 'Due-Month AUC', desc: 'Late-payment risk prediction', chart: 'auc' },
  { emoji: '🤝', stat: '7+', label: 'Client Projects', desc: 'Plus Accenture internal projects' },
  { emoji: '📊', stat: '38%', label: 'Overdue Reduction', desc: 'ML-driven collections strategy', chart: 'reduction' },
  { emoji: '💰', stat: '12%', label: 'Collections Increase', desc: 'Over 2 years after go-live' }
];

/* ───────── MSc Final Project ───────── */
export type MscProject = {
  title: string;
  eyebrow: string;
  summary: string;
  problem: string;
  approach: string;
  conclusion: string;
  future: string;
  results: { label: string; value: string }[];
  tags: string[];
  link?: string;
};

export const MSC_PROJECT: MscProject = {
  title: 'Robust DD-Classifier Under Cell-wise Contamination',
  eyebrow: 'M.Sc. Statistics · IIT Kanpur · 2023',
  summary: 'A **depth-based classifier** that holds up when **individual data cells are corrupted**, by mapping points into a *Depth–Depth space* built on **cell-wise-robust** estimates of location and scatter.',
  problem: '**Cell-wise outliers** — corrupted *individual entries*, not whole rows — violate the assumptions of *LDA, QDA, KNN and SVM* and **collapse their accuracy**, especially as dimensionality grows.',
  approach: 'Each point is lifted from ℝᵈ into a **2-D Depth–Depth space** via *Mahalanobis depth* per class, with μ and Σ estimated by **cell-wise-robust methods** (*CellMCD, 2SGS, Detection–Imputation*) so **contamination barely shifts the depths**. Standard classifiers then operate in that *bounded, well-separated* DD space.',
  conclusion: 'Across **100 simulation runs** over Normal and t₅ populations with location, scale and location–scale shifts, and **dimensions from 5 to 25**, the *robust DD classifiers* **consistently beat** both their non-robust counterparts and the original feature-space classifiers under cell-wise contamination. The **2SGS estimator** proved *most reliable in every setting*, and its **edge grew with dimensionality** — exactly where ordinary classifiers fail, since the contaminated class collapses toward the origin and the two classes become *cleanly separable* in DD space.',
  future: 'Natural next steps: extend from the *two-class* setting to the **J-class problem**, test *additional robust estimators* of location and scale, and derive **formal theoretical guarantees** for the robust DD classifier.',
  results: [
    { label: 'Robust DD error', value: '<1%' },
    { label: 'Raw-space error', value: '~52%' },
    { label: 'Best estimator', value: '2SGS' }
  ],
  tags: ['Robust Statistics', 'DD-Classifier', 'Mahalanobis Depth', 'Cell-wise Robust', 'R + Python'],
  link: 'https://github.com/Prithwijit24/Robust-DD-Classifier-for-Cellwise-Contaminated-Data'
};

/* ───────── Certifications & Workshops (PLACEHOLDER — replace with real content) ───────── */
export type Certification = {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  link?: string;
  logo?: string;
};

export const CERTIFICATIONS: Certification[] = [
  { name: 'Machine Learning (Specialization)', issuer: 'Stanford University', date: '', link: 'https://www.coursera.org/account/accomplishments/specialization/CMM5V5AMNBR6', logo: '/logos/certs/stanford.png' },
  // link points to the Drive file named "Tableau.pdf" (content-matched to this Tableau cert)
  { name: 'Data Visualization Using Tableau', issuer: 'Great Learning', date: '', link: 'https://drive.google.com/file/d/1owCpqYV8idCl9RGiDcRFNUs7XzROsJEh/view', logo: '/logos/certs/greatlearning.png' },
  { name: 'Data Analysis with R Programming', issuer: 'Google', date: '', link: 'https://www.coursera.org/account/accomplishments/verify/J2M23576PZLQ', logo: '/logos/certs/google.png' },
  { name: 'Machine Learning to Deep Learning: A Journey for Remote Sensing Data Classification', issuer: 'ISRO', date: '', link: 'https://drive.google.com/file/d/1bQMC5ov6TxQ19eg6i29Xk1MUpeNWKRJc/view', logo: '/logos/certs/isro.svg' },
  { name: 'Python for Data Science', issuer: 'IBM', date: '', link: 'https://courses.cognitiveclass.ai/certificates/821ac36a123944339454cab7542aeba0', logo: '/logos/certs/ibm.png' },
  { name: 'Mathematics for Machine Learning: Linear Algebra', issuer: 'Imperial College London', date: '', link: 'https://www.coursera.org/account/accomplishments/verify/JECSNQP8PCZE', logo: '/logos/certs/imperial.png' }
];

/* ───────── Credly badges ───────── */
export type Badge = { name: string; issuer: string; img: string; link: string };

export const BADGES: Badge[] = [
  { name: 'Applied Data Science with Python — Level 2', issuer: 'IBM', img: '/badges/applied-ds-python.png', link: 'https://www.credly.com/badges/e78eceea-7641-49f4-b9e0-9e0a56da92c8' },
  { name: 'Data Analysis Using Python', issuer: 'IBM', img: '/badges/data-analysis-python.png', link: 'https://www.credly.com/badges/c1832bd7-7741-4ba3-886d-680a7eaf08f2/public_url' },
  { name: 'AI Skills Fest 2026', issuer: 'Microsoft', img: '/badges/ai-skills-fest.png', link: 'https://www.credly.com/badges/865c392f-7bed-4436-a63d-588b084b3f4e' }
];

/* ───────── Hobbies (Instagram-style photo columns) ───────── */
export type HobbyColumn = { title: string; emoji: string; accent: SpringAccent; quote: string; photos: string[] };

export const HOBBIES: HobbyColumn[] = [
  { title: 'Travel', emoji: '✈️', accent: 'sky', quote: 'Lost in the right direction.',
    photos: ['/hobbies/travel-1.jpg', '/hobbies/travel-2.jpg', '/hobbies/travel-3.jpg', '/hobbies/travel-4.mp4', '/hobbies/travel-5.jpg', '/hobbies/travel-6.jpg', '/hobbies/travel-7.jpg'] },
  { title: 'Painting', emoji: '🎨', accent: 'blossom', quote: 'Where words fail, colour speaks.',
    photos: ['/hobbies/painting-1.jpg', '/hobbies/painting-2.jpg', '/hobbies/painting-3.jpg', '/hobbies/painting-4.jpg'] },
  { title: 'Books', emoji: '📚', accent: 'mint', quote: 'A reader lives a thousand lives.',
    photos: ['/hobbies/reading-1.jpg', '/hobbies/reading-2.jpg', '/hobbies/reading-3.jpg', '/hobbies/reading-4.jpg'] }
];
