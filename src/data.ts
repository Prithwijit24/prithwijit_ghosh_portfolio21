/* ───────── Navigation ───────── */
export const NAV_SECTIONS = [
  { id: 'home', label: 'Home', emoji: '🏠' },
  { id: 'achievements', label: 'Wins', emoji: '🏆' },
  { id: 'skills', label: 'Skills', emoji: '🧰' },
  { id: 'experience', label: 'Experience', emoji: '💼' },
  { id: 'msc', label: 'MSc Project', emoji: '🎓' },
  { id: 'projects', label: 'Projects', emoji: '🧪' },
  { id: 'education', label: 'Education', emoji: '🎓' },
  { id: 'certifications', label: 'Certs', emoji: '📜' },
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

export const ROLES = [
  'Data Scientist',
  'Forecasting Engineer',
  'MLOps Specialist',
  'IIT Kanpur Alumnus'
];

export const DS_ICONS = ['📊','📈','🔢','📉','🧮','💻','📀','🔬','🤖','📡','🧠','💾','🔣','📋','🗂️'];

import type { SpringAccent } from './theme';

/* ───────── Data types ───────── */
export type SkillDomain = { title: string; emoji: string; accent: SpringAccent; description: string; skills: string[]; level: number };
export type ExperienceItem = { title: string; client: string; timeline: string; summary: string; bullets: string[]; tags: string[] };
export type ProjectItem = { title: string; timeline?: string; summary: string; bullets: string[]; link?: string; tags: string[] };

export const SKILL_DOMAINS: SkillDomain[] = [
  { title: 'Data Science', emoji: '🧠', accent: 'blossom', description: 'Predictive models & intelligent systems from complex data.', skills: ['Python','Scikit-learn','XGBoost','LightGBM','CatBoost','TensorFlow','Keras'], level: 95 },
  { title: 'Data Analysis', emoji: '📊', accent: 'mint', description: 'Turning raw data into clear insights & evidence-backed decisions.', skills: ['SQL','Pandas','NumPy','R','EDA','Statistics','Time Series'], level: 92 },
  { title: 'Dashboards & BI', emoji: '📈', accent: 'sunshine', description: 'Intuitive views that help teams monitor and act faster.', skills: ['Power BI','Tableau','Plotly','Matplotlib','Seaborn','KPI Design','Excel Analytics'], level: 88 },
  { title: 'Deployment & MLOps', emoji: '☁️', accent: 'sky', description: 'Shipping reliable pipelines & models into production.', skills: ['AWS Fargate','AWS EMR','S3','Docker','Kubernetes','GitHub Actions','Airflow'], level: 85 },
  { title: 'AI Agents & Systems', emoji: '⚙️', accent: 'mint', description: 'AI-enabled apps and production services around models.', skills: ['LangChain','LangGraph','Ollama','RAG','AI Agents','Streamlit','FastAPI'], level: 82 }
];

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  { title: 'Multi-Country Forecasting System', client: 'Accenture · Global QSR Brand', timeline: 'Jul 2023 – Present',
    summary: 'Multi-country sales & guest-count forecasting system for long-range planning.',
    bullets: [
      'Built ensemble forecasts up to 48 months ahead using Prophet, Theta, MSTL, LightGBM across 6 countries and macroeconomic indicators.',
      'Created a horizon-aware evaluation framework across 450+ models; reached 97–99% accuracy for 24-month forecasts.',
      'Shipped Docker + GitHub Actions MLOps pipeline with SonarQube, Snyk, JFrog, Airflow, Astronomer, and AWS Fargate.'
    ], tags: ['Time Series','MLOps','AWS Fargate','Airflow','LightGBM'] },
  { title: 'Late-Payment Risk Prediction', client: 'Accenture · Water Treatment Brand', timeline: 'Jul 2023 – Present',
    summary: 'Customer-level late-payment prediction, calibrated risk scoring & AR forecasting.',
    bullets: [
      'Selected 50 features from 1000+ derived features; XGBoost models for 10K+ monthly customer base with 90% AUC due-month.',
      'Reduced overdue amount by 38%, lowered AR by 15%, increased collections by 12% post go-live.',
      'Power BI dashboards delivering 95–98% accuracy across Not Yet Due, Current Due, and Over Due categories.'
    ], tags: ['XGBoost','Risk Scoring','Power BI','AR Forecasting','Collections'] },
  { title: 'Cash-Flow & Marketing Analytics', client: 'Power Utility & Liquor Brand Clients', timeline: 'Accenture',
    summary: 'Forecasting & marketing analytics prototypes for cash-flow accuracy and customer growth.',
    bullets: [
      'B2C cash-flow forecasting over 6M+ records: Cash-In accuracy 98% (from 70%), Cash-Out 93% (from 64%).',
      'Subscription behavior, campaigns, funnels, up-sell, cross-sell, churn propensity, and RFM segmentation.'
    ], tags: ['Cash Flow','RFM','Marketing Analytics','Dashboards'] }
];

export const PROJECTS: ProjectItem[] = [
  { title: 'Demographic-Aware Recommender', timeline: 'Jun 2025 – Mar 2026',
    summary: 'Facial-embedding recommendation engine with demographic prediction & bias-aware LangChain agent.',
    bullets: ['Predicted age, gender, race with 97% accuracy using facial embeddings.','Containerized Streamlit app on Hugging Face.'],
    tags: ['FaceNet','LangChain','Streamlit','Hugging Face'] },
  { title: 'Real-Time Fraud Detection', timeline: 'Jan 2026 – Mar 2026',
    summary: 'Scalable transaction monitoring for low-latency fraud inference and explainable risk scores.',
    bullets: ['Streaming ML inference & explainable scoring.','Production deployment with Docker, Kubernetes, FastAPI.'],
    tags: ['Fraud Detection','FastAPI','Kubernetes','Streaming ML'] },
  { title: 'Age, Race & Gender Detection',
    summary: 'UTKFace preprocessing and facial embeddings project.',
    bullets: ['23K UTKFace images with augmentation; FaceNet → 512-dim embeddings.','98% SVM gender, 94% KNN race, 5.8 age MAPE with LGBM.','End-to-end Streamlit app deployed.'],
    link: 'https://github.com/Prithwijit24/age-identification',
    tags: ['Computer Vision','FaceNet','SVM','LGBM'] }
];

export const ACHIEVEMENTS_DATA = [
  { emoji: '🏆', stat: 'AIR 7', label: 'JAM Statistics All India Rank', desc: 'Among thousands of candidates nationwide' },
  { emoji: '📊', stat: '38%', label: 'Overdue Reduction', desc: 'ML-driven collections strategy' },
  { emoji: '🎯', stat: '97–99%', label: 'Forecast Accuracy', desc: '24-month multi-country forecasts' },
  { emoji: '☁️', stat: '98%', label: 'Cash-In Accuracy', desc: '6M+ customer cash-flow records' },
  { emoji: '📈', stat: '450+', label: 'Models Evaluated', desc: 'Horizon-aware selection framework' },
  { emoji: '🔬', stat: '90%', label: 'Due-Month AUC', desc: 'Late-payment risk prediction' }
];

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
