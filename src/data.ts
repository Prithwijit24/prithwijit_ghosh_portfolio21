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
  resume: new URL('./Prithwijit_Ghosh_Resume_20260523.pdf', import.meta.url).href
} as const;

import type { SpringAccent } from './theme';

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
  { title: 'Multi-Country Forecasting System', client: 'Accenture · Global QSR Brand', timeline: 'Jul 2023 – Present',
    summary: 'Multi-country sales & guest-count forecasting system for long-range planning.',
    bullets: [
      'Ensemble forecasts up to **48 months ahead** (Prophet, Theta, MSTL, LightGBM) across **6 countries**, blended with macroeconomic indicators.',
      'Horizon-aware evaluation framework spanning **450+ models** — **97–99% accuracy** on 24-month forecasts.',
      'Shipped an **MLOps pipeline** on Docker, GitHub Actions, Airflow, Astronomer and AWS Fargate, gated by SonarQube, Snyk and JFrog.'
    ], tags: ['Python','SQL','Git','Time Series','MLOps','AWS Fargate','Airflow'] },
  { title: 'Late-Payment Risk Prediction', client: 'Accenture · Water Treatment Brand', timeline: 'Jul 2023 – Present',
    summary: 'Customer-level late-payment prediction, calibrated risk scoring & AR forecasting.',
    bullets: [
      'Selected **50 of 1000+** engineered features; XGBoost across a **10K+** monthly customer base, reaching **90% due-month AUC**.',
      'Cut overdue amounts by **38%**, lowered AR by **15%** and lifted collections by **12%** post go-live.',
      'Power BI dashboards delivering **95–98% accuracy** across Not Yet Due, Current Due and Over Due categories.'
    ], tags: ['Python','SQL','XGBoost','Risk Scoring','Power BI','AR Forecasting','Collections'] },
  { title: 'Cash-Flow & Marketing Analytics', client: 'Accenture · Power Utility & Liquor Brand Clients', timeline: 'Jul 2023 – Present',
    summary: 'Forecasting & marketing analytics prototypes for cash-flow accuracy and customer growth.',
    bullets: [
      'B2C cash-flow forecasting over **6M+ records** — Cash-In accuracy **98%** (from 70%), Cash-Out **93%** (from 64%).',
      'Marketing analytics: subscription behavior, campaigns, funnels, up-sell, cross-sell, churn propensity and **RFM segmentation**.'
    ], tags: ['Python','SQL','Cash Flow','RFM','Marketing Analytics','Dashboards'] }
];

export const PROJECTS: ProjectItem[] = [
  { title: 'Agentic Product Recommender', timeline: 'Jun 2025 – Mar 2026',
    summary: 'Facial-embedding demographic prediction feeding a bias-aware LangChain agent that recommends products.',
    bullets: [
      'FaceNet **512-dim embeddings** on **23K UTKFace images** — **98% gender** (SVM), **94% race** (KNN), **5.8 age MAPE** (LGBM).',
      'Bias-aware **LangChain agent** turns predicted demographics into tailored product recommendations.',
      'End-to-end **Streamlit app** containerized and deployed on **Hugging Face**.'
    ],
    link: 'https://github.com/Prithwijit24/product_recommendation_with_agent',
    tags: ['Python','SQL','LangChain','FaceNet','Streamlit','Recommender'] },
  { title: 'Credit Card Fraud Detection', timeline: 'Jan 2026 – Mar 2026',
    summary: 'Scalable transaction monitoring for low-latency fraud inference and explainable risk scores.',
    bullets: [
      '**Streaming ML inference** with **explainable risk scoring** on highly imbalanced transaction data.',
      'Production deployment with **Docker, Kubernetes and FastAPI**.'
    ],
    link: 'https://github.com/Prithwijit24/credit_card_fraud_detection/tree/fraud_v1',
    tags: ['Python','SQL','Fraud Detection','FastAPI','Kubernetes','Streaming ML'] },
  { title: 'Agentic Travel Planner',
    summary: 'An LLM agent that plans end-to-end trips — itineraries, budgets and routes — using external tools.',
    bullets: [
      '**LangGraph agent** orchestrates tools for destinations, routes and day-by-day itineraries.',
      '**Retrieval-augmented** context produces personalized, budget-aware travel plans.'
    ],
    link: 'https://github.com/Prithwijit24/agentic_travel_planner',
    tags: ['Python','SQL','LangGraph','AI Agents','RAG','FastAPI'] },
  { title: 'Music Recommendation System',
    summary: 'Personalized music recommendations from listening patterns and audio/content features.',
    bullets: [
      '**Hybrid recommender** blending collaborative filtering with content-based audio features.',
      '**Embedding-based similarity** for next-track and playlist suggestions.'
    ],
    link: 'https://github.com/Prithwijit24/music_recommendation',
    tags: ['Python','SQL','Recommender','Embeddings','Collaborative Filtering'] }
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
  summary: 'A **depth-based classifier** that stays accurate when **individual data cells are corrupted** — by building the *Depth–Depth map* on **cell-wise-robust** estimates of location and scatter.',
  problem: '**Cell-wise outliers** (corrupted individual entries, not whole rows) break the assumptions behind *LDA, QDA, KNN and SVM*, **collapsing their accuracy** — especially as dimension grows.',
  approach: 'Map each point from ℝᵈ into a **2-D Depth–Depth space** using *Mahalanobis depth* w.r.t. each class, with μ and Σ estimated by **cell-wise-robust methods** (*CellMCD, 2SGS, Detection–Imputation*) so **contamination barely moves the depths**. Standard classifiers then run in the *bounded, well-separated DD space*.',
  conclusion: 'Across **100 simulation runs** spanning Normal and t₅ populations, location / scale / location–scale shifts, and **dimensions from 5 to 25**, the *robust DD classifiers* **consistently beat** both their non-robust counterparts and the original-space classifiers under cell-wise contamination. The **2SGS estimator** was the *most reliable across every setting*, and its **advantage widened as dimensionality grew** — precisely where ordinary classifiers degrade the most, because the contaminated class collapses toward the origin and leaves the two classes *cleanly separable*.',
  future: 'Natural extensions: generalise from the *two-class* to the **J-class problem**, explore *other robust estimators* of location and scale, and establish **formal theoretical guarantees** for the robust DD classifier.',
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
