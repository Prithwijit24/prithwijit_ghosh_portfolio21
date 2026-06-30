// Generates api/_vectors.json by embedding the knowledge base via Gemini.
// Run: node scripts/generate-vectors.mjs
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Load .env
const envPath = resolve(ROOT, '.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    process.env[k] ||= v;
  }
}

const geminiKeys = () =>
  ['GEMINI_API_KEYS', 'GEMINI_API_KEY', 'GEMINI_API_KEY_2', 'GEMINI_API_KEY_3', 'GEMINI_API_KEY_4', 'GOOGLE_API_KEY']
    .flatMap(n => (process.env[n] || '').split(',').map(s => s.trim()).filter(Boolean))
    .filter((v, i, a) => a.indexOf(v) === i);

const BASE = 'https://generativelanguage.googleapis.com/v1beta';
const EMB_MODEL = 'gemini-embedding-001';

async function embedOne(text, taskType) {
  const ks = geminiKeys();
  if (!ks.length) throw new Error('no-embed-key');
  for (const key of ks) {
    try {
      const res = await fetch(`${BASE}/models/${EMB_MODEL}:embedContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: `models/${EMB_MODEL}`, content: { parts: [{ text }] }, taskType })
      });
      if (!res.ok) throw new Error(`embed ${res.status}`);
      return (await res.json()).embedding.values;
    } catch { /* try next key */ }
  }
  throw new Error('all-gemini-keys-failed');
}

async function embedAll(texts) {
  const out = [];
  for (let i = 0; i < texts.length; i++) {
    out.push(await embedOne(texts[i], 'RETRIEVAL_DOCUMENT'));
    if ((i + 1) % 10 === 0) console.log(`  ${i + 1}/${texts.length}`);
  }
  return out;
}

// Knowledge base (mirrors _rag.ts + _hr.ts)
const KB = [
  `Profile: Prithwijit Ghosh is a Data Scientist Specialist at Accenture Global Technology (Bengaluru, India) with 2.9+ years of experience and an M.Sc. in Statistics from IIT Kanpur. He builds and deploys production-grade forecasting, risk and analytics systems (accounts-receivable, cash flow, sales) in finance and payments-adjacent domains. He works in first person as "I".`,
  `Experience — Multi-Country Sales & Guest-Count Forecasting (Accenture, Global QSR Brand, Jul 2023 – Present): Designed and productionized an ensemble forecasting system predicting sales and guest counts up to 48 months ahead using Prophet, Theta, MSTL, LightGBM and Naive models with macroeconomic indicators across 6 countries. Built a custom horizon-aware evaluation framework (trend & seasonal MAPE) over 450+ models, achieving 97–99% accuracy for 24-month and 95–96% for 48-month forecasts.`,
  `Experience — Forecasting MLOps (Accenture QSR): Implemented a production MLOps pipeline using Docker and GitHub Actions for CI/CD with unit and integration testing plus security scanning (SonarQube, Snyk) before deploying artifacts to JFrog Artifactory. Automated monthly forecasting workflows run via Astronomer on Apache Airflow DAGs on AWS Fargate.`,
  `Experience — Intelligent Collections 3.0 / Late-Payment Risk (Accenture, Water Treatment Brand, Jul 2023 – Present): Built customer-level late-payment prediction with XGBoost, selecting 50 of 1000+ engineered features, reaching 84% due-date AUC and 90% due-month AUC across a 10K+ monthly customer base. Developed calibrated risk scoring (quantile calibration), reducing overdue amounts by 38%, lowering open accounts receivable by 15%, and increasing collections by 12% over the next 2 years after go-live.`,
  `Experience — AR Forecasting & dashboards (Accenture Water Treatment): Designed short-term accounts-receivable forecasting (1–6 month horizon) using statistical methods (SMA, EWMA, ARIMA, SARIMA, Theta, MSTL) and ML/DL models (XGBoost, LightGBM, CatBoost, TCN), achieving 95–98% accuracy across Not Yet Due, Current Due and Over Due categories, delivered through interactive Power BI dashboards for leadership and client reporting.`,
  `Experience — Proof of Concepts (Accenture): Cash Flow Forecasting for a Power Utility — end-to-end B2C cash-flow forecasting over 6M+ customer records, improving Cash-In accuracy to 98% (from 70%) and Cash-Out to 93% (from 64%). Marketing Data Analysis for an internationally renowned liquor brand — customer behavior across subscription patterns, campaigns, conversion funnels, up-sell, cross-sell and churn propensity using RFM and advanced analytics.`,
  `Skills — Programming Languages: Python, SQL, R, Git, GitHub Actions. Tools: MS Excel, MS PowerPoint, Power BI, Redis, Kafka, Prometheus.`,
  `Skills — Cloud Tools: Docker, Kubernetes, FastAPI, Streamlit, Astronomer, Airflow, and AWS (Fargate, EMR/Hadoop, EC2, S3, CloudWatch). Libraries: Pandas, Scikit-learn, XGBoost, LightGBM, NLTK, spaCy, TensorFlow, Keras, LangChain, LangGraph, Ollama.`,
  `Skills — Domains: Data Science, Data Analysis, Predictive Modelling, Classification, NLP, Statistics, Time Series, Business Intelligence (BI), LLMs, AI Agents, and Retrieval-Augmented Generation (RAG).`,
  `Master's Research — "Robust DD-Classifier Under Cell-wise Contamination" (M.Sc. Statistics, IIT Kanpur, 2023; advisors Prof. Subhajit Dutta of IIT Kanpur and Prof. Abhik Ghosh of ISI Kolkata). Cell-wise outliers (corrupted individual entries, not whole rows) break LDA, QDA, KNN and SVM. The Depth–Depth (DD) classifier maps each point from R^d to a 2-D space using Mahalanobis depth w.r.t. each class; estimating location and scatter with cell-wise-robust methods (CellMCD, 2SGS, Detection–Imputation) gives a robust DD space where classes separate cleanly.`,
  `Master's Research — results: Across 100 simulation runs over Normal and t5 populations, location / scale / location–scale shifts, and dimensions from 5 to 25, the robust DD classifiers consistently beat both non-robust and original-space classifiers under cell-wise contamination, with robust-DD misclassification under 1% versus ~52% in raw space in some settings. The 2SGS estimator was the most consistent. Built with R (cellWise, GSE, ggplot2) and Python (numpy, pandas, scikit-learn) bridged via reticulate. Repo: github.com/Prithwijit24/Robust-DD-Classifier-for-Cellwise-Contaminated-Data.`,
  `Project — Agentic Product Recommender (Jun 2025 – Mar 2026): A facial-embedding recommendation engine. FaceNet 512-dim embeddings on 23K UTKFace images predict 98% gender (SVM), 94% race (KNN) and 5.8 age MAPE (LGBM); a bias-aware LangChain agent turns predicted demographics into tailored product recommendations, deployed as a containerized Streamlit app on Hugging Face. Repo: github.com/Prithwijit24/product_recommendation_with_agent.`,
  `Project — Credit Card Fraud Detection (Jan 2026 – Mar 2026, ongoing): A scalable real-time fraud detection platform with streaming ML inference, explainable risk scoring and low-latency transaction monitoring, with production deployment using Docker, Kubernetes and FastAPI. Repo: github.com/Prithwijit24/credit_card_fraud_detection.`,
  `Project — Agentic Travel Planner: An LLM agent that plans end-to-end trips (itineraries, budgets, routes) using external tools. A LangGraph hub delegates to route, budget and timing workers with retrieval-augmented (RAG) context. Repo: github.com/Prithwijit24/agentic_travel_planner.`,
  `Project — Music Recommendation System: Personalized recommendations from listening patterns and audio/content features. A hybrid recommender blends collaborative filtering with content-based audio features and embedding-based similarity for next-track and playlist suggestions. Repo: github.com/Prithwijit24/music_recommendation.`,
  `Education: M.Sc. in Statistics, Indian Institute of Technology (IIT) Kanpur, 2021–2023 — CGPA 8.9, JAM All India Rank 7, Department Rank 6. B.Sc. in Statistics, Bidhannagar College, Kolkata, 2018–2021 — CGPA 9.99, Department Rank 1.`,
  `Certifications & badges: Machine Learning Specialization (Stanford), Data Analysis with R Programming (Google), Python for Data Science (IBM), Mathematics for Machine Learning: Linear Algebra (Imperial College London), ML to DL for Remote Sensing (ISRO), Data Visualization with Tableau (Great Learning). Credly badges: IBM Applied Data Science with Python — Level 2, IBM Data Analysis Using Python, Microsoft AI Skills Fest 2026.`,
  `Key achievements: JAM Statistics All India Rank 7; 97–99% accuracy on 24-month multi-country forecasts; 90% due-month AUC on late-payment risk; worked across 7+ client projects plus Accenture internal projects; reduced overdue amounts by 38%; increased collections by 12% over two years after go-live.`,
  `Hobbies & interests: Travel, painting, and reading mathematics / books. Outside data pipelines, Prithwijit explores AI agents, contributes to open-source ML projects, and follows the latest in MLOps and LLM research.`,
  `Contact: email ghoshprithwijit39@gmail.com, phone +91-7595986858 / +91-9230358950, GitHub github.com/Prithwijit24, LinkedIn linkedin.com/in/prithwijit-ghosh-datascience. Open to data science roles, collaborations, forecasting systems, MLOps and analytics problems.`,
];

// HR QA entries (from _hr.ts)
const HR_QA = [
  `HR — "Tell me about yourself": I'm a Data Scientist Specialist at Accenture with about three years of experience building production forecasting and risk systems, and I hold an M.Sc. in Statistics from IIT Kanpur. I've delivered multi-country sales forecasting at 97–99% accuracy and a late-payment risk model that cut overdue amounts by 38%. I enjoy taking a problem from raw data all the way to a deployed, monitored system.`,
  `HR — "Walk me through your resume / background": After a B.Sc. in Statistics where I ranked first in my department, I earned an M.Sc. in Statistics from IIT Kanpur with an All India Rank 7 in JAM. I joined Accenture in 2023 as a data scientist and have since worked on 7+ client projects spanning forecasting, collections risk, cash-flow and marketing analytics. Alongside work I build side projects in agentic AI and fraud detection.`,
  `HR — "How would you describe yourself?": I'd describe myself as a statistically grounded, delivery-focused data scientist who likes owning problems end to end. I'm rigorous about evaluation and equally comfortable on the modeling and the MLOps side. Outside work I'm curious and self-driven — I read, paint, and tinker with new AI tools.`,
  `HR — "What makes you unique / stand out?": My combination of strong statistical foundations from IIT Kanpur and hands-on production MLOps is fairly rare. I don't just build models — I containerize them, automate them on Airflow, and wrap evaluation frameworks around them so they hold up in production. I've also published research on robust classification under cell-wise contamination.`,
  `HR — "Give me your elevator pitch": I'm Prithwijit, a data scientist with an M.Sc. in Statistics from IIT Kanpur and three years at Accenture building forecasting and risk systems that are genuinely in production. My work has delivered 97–99% forecast accuracy and a 38% reduction in overdue receivables. I bridge solid statistics with real engineering.`,
  `HR — "What are your greatest strengths?": My biggest strengths are statistical rigor and end-to-end ownership — I can frame a problem, pick the right model, and ship it with proper CI/CD and monitoring. I'm also strong at evaluation; for the forecasting work I built a custom horizon-aware framework over 450+ models. And I communicate results clearly to non-technical leadership.`,
  `HR — "What is your greatest weakness?": I tend to over-invest early in getting the evaluation and edge cases just right, which can slow me down at the start of a project. I've learned to time-box that exploration, ship an iterative baseline first, then refine. It's made me both faster and just as thorough.`,
  `HR — "What are you working to improve?": I'm deliberately strengthening my software-engineering and system-design skills so my deployments scale even better — that's part of why I'm building a real-time fraud detection platform with Kubernetes and FastAPI. I'm also improving my delegation as I take on more lead responsibilities.`,
  `HR — "What achievement are you most proud of?": I'm most proud of the late-payment risk model I built for a water-treatment client — it reduced overdue amounts by 38% and increased collections by 12% over the two years after go-live. Seeing a model I built translate into real business impact was hugely rewarding.`,
  `HR — "How do you handle criticism and feedback?": I treat feedback as data — I listen without getting defensive, ask clarifying questions, and act on it. Early in a forecasting project a reviewer pushed me on my evaluation metric, and reworking it led to the horizon-aware framework I'm proud of today.`,
  `HR — "What is your biggest professional achievement?": Productionizing the multi-country sales and guest-count forecasting system across six countries, reaching 97–99% accuracy for 24-month horizons. It involved an ensemble of models, macroeconomic features, and a fully automated Airflow pipeline on AWS.`,
  `HR — "What is a skill you recently learned?": I recently went deep on agentic AI — LangChain and LangGraph — and built an agentic product recommender and a travel planner that orchestrate tool-using LLM workers. It's reshaped how I think about combining classical ML with LLM reasoning.`,
  `HR — "What are your core technical strengths?": My core strengths are time-series forecasting, classification and risk modeling, and the MLOps to deploy them — Docker, Airflow, CI/CD, AWS. I'm strongest in Python and SQL, with a solid statistics foundation underpinning my modeling choices.`,
  `HR — "Why do you want to work here?": I'm drawn to roles where data science drives real decisions, and that's what your team does. I'd bring proven experience shipping forecasting and risk models to production, and I'm excited to apply it to your problems. I'm also looking for an environment that pushes me technically.`,
  `HR — "Why should we hire you?": Because I've already done what you need — taken models from notebook to production with measurable impact, like a 38% drop in overdue receivables. I combine statistical depth with engineering, I'm low-ego and delivery-focused, and I'll add value quickly without much ramp-up.`,
  `HR — "Why are you the best candidate?": I bring a rare mix of rigorous statistics from IIT Kanpur and hands-on production MLOps, plus a track record of measurable impact across 7+ projects. I learn fast and own outcomes end to end. That combination is hard to find.`,
  `HR — "What interests you about this role?": The chance to work on high-impact modeling problems and own them through to deployment is exactly what energizes me. I'm especially interested in roles that blend forecasting, risk, or agentic AI — areas where I have deep, recent experience.`,
  `HR — "Why do you want to leave your current job?": I've had a great run at Accenture and learned enormously, but I'm looking for a role with more direct ownership of products and a steeper technical curve. I want to go deeper on building and scaling ML systems rather than spreading across many client engagements.`,
  `HR — "Why are you looking for a change?": I'm seeking deeper ownership and the chance to focus intensely on building and scaling a smaller set of ML systems end to end. I've built broad experience across many clients; now I want depth and sustained impact in one place.`,
  `HR — "What do you know about our company?": I've researched your products, your data challenges, and your engineering culture, and I'm impressed by how central data is to your decisions. I'd love to learn more about your current ML stack and roadmap in our conversation. What I've seen aligns well with where I want to grow.`,
  `HR — "What motivates you?": I'm motivated by impact — seeing a model I built change a real metric, like collections going up 12%. I also love the intellectual challenge of a hard modeling or system-design problem. Shipping something that works in production is deeply satisfying.`,
  `HR — "What are you passionate about?": I'm passionate about turning messy data into reliable, deployed systems that people actually use. Lately I'm fascinated by agentic AI and RAG, and I build side projects to explore them. Outside tech, I'm passionate about travel and painting.`,
  `HR — "Why data science?": I came to data science from a strong statistics background, and I love that it lets me use rigorous methods to solve concrete problems with measurable outcomes. It's the perfect blend of math, programming, and business impact.`,
  `HR — "What attracted you to this field?": My statistics training showed me the power of drawing reliable conclusions from data, and data science let me apply that at scale with real engineering. The mix of theory and tangible impact hooked me.`,
  `HR — "What are you looking for in a new role?": I'm looking for ownership of meaningful ML problems end to end, strong technical peers to learn from, and a culture that values both rigor and shipping. Growth into more technical leadership over time is a plus.`,
  `HR — "Where do you see yourself in 5 years?": In five years I'd like to be a senior or lead data scientist owning the architecture of production ML systems and mentoring others. I want to keep deepening my MLOps and agentic-AI expertise while driving measurable business impact.`,
  `HR — "What are your long-term career goals?": Long term, I want to grow into a technical leadership role where I shape ML strategy and architecture, not just individual models. I'd like to be known for building systems that are both statistically sound and genuinely reliable in production.`,
  `HR — "What are your short-term goals?": In the near term I want to ramp up quickly, deliver a meaningful project end to end, and deepen my system-design skills. I'm also finishing my real-time fraud detection platform to sharpen my streaming-ML and Kubernetes skills.`,
  `HR — "Do you prefer an individual-contributor or management track?": I lean toward the IC and technical-lead track for now — I love staying close to the modeling and architecture. I enjoy mentoring, so a lead role blending both appeals to me, but I'm not looking to move fully away from hands-on work yet.`,
  `HR — "What is your dream job?": My dream job is owning the end-to-end ML systems behind a product real users depend on — designing the models, the pipelines, and the monitoring. Ideally in forecasting, risk, or agentic AI, where I'm strongest.`,
  `HR — "How does this role fit your career plan?": This role fits my plan to go deeper on building and scaling production ML in one place, with more ownership than client consulting allows. It's a natural next step toward the technical-lead direction I'm aiming for.`,
  `HR — "Are you open to learning new domains?": Absolutely — I've already worked across QSR, utilities, water treatment, and liquor-brand marketing, so adapting to new domains is something I do regularly. I get up to speed by understanding the business problem first, then the data.`,
  `HR — "What's next for you technically?": Technically I'm pushing into real-time/streaming ML and agentic systems — my fraud detection project uses streaming inference, and my recommender and travel planner use LangGraph agents. I want to keep blending classical ML with LLM-driven reasoning.`,
  `HR — "Describe your current role.": As a Data Scientist Specialist at Accenture, I build and deploy forecasting and risk-analytics systems for finance and payments-adjacent clients. Day to day that spans feature engineering, modeling, building MLOps pipelines, and presenting results to client leadership.`,
  `HR — "Walk me through a recent project.": Recently I productionized a multi-country sales and guest-count forecasting system for a global QSR brand — an ensemble of Prophet, Theta, MSTL and LightGBM with macroeconomic features across six countries. I built a horizon-aware evaluation framework over 450+ models and automated the monthly runs on Airflow and AWS Fargate, reaching 97–99% accuracy at 24 months.`,
  `HR — "Tell me about your most challenging project.": The most challenging was the late-payment risk model — engineering 1000+ features for a 10K+ customer base and selecting the right 50, then calibrating risk scores so the business could trust them. It paid off with a 38% reduction in overdue amounts.`,
  `HR — "Describe a time you solved a difficult problem.": For accounts-receivable forecasting I had to hit high accuracy across very different categories — Not Yet Due, Current Due, Over Due. I combined statistical models with ML/DL approaches and tuned per category, landing 95–98% accuracy and delivering it via Power BI for leadership.`,
  `HR — "How do you prioritize tasks?": I prioritize by business impact and dependencies — what unblocks others or moves the key metric goes first. I keep a clear backlog, set a baseline early, and communicate trade-offs with stakeholders rather than silently slipping.`,
  `HR — "How do you manage deadlines?": I break work into a baseline plus refinements, ship the baseline early, and protect the deadline by descoping nice-to-haves rather than quality. Automating my forecasting runs on Airflow also freed time that used to go to manual work.`,
  `HR — "How do you handle multiple projects at once?": I've routinely run multiple client engagements in parallel, so I time-box, batch similar work, and lean on automation. Clear status communication with each stakeholder keeps expectations aligned.`,
  `HR — "What does a typical workday look like?": A typical day mixes focused modeling or feature work, reviewing pipeline runs, and syncs with stakeholders. I protect a deep-work block for the hard modeling and try to cluster meetings.`,
  `HR — "How do you stay organized?": I keep a prioritized backlog, document decisions and experiments, and version everything in Git. For pipelines, Airflow and CI/CD give me visibility so nothing silently breaks.`,
  `HR — "How do you handle pressure and stress?": I stay calm by breaking the problem down and focusing on the next concrete step, and I flag risks early. Having robust pipelines and tests means fewer fire-drills in the first place.`,
  `HR — "Tell me about a time you failed.": Early on, an initial forecasting approach I championed underperformed on longer horizons. I owned it, dug into why, and that failure directly led me to build the horizon-aware evaluation framework that's now central to the system.`,
  `HR — "Tell me about a mistake you made.": I once under-weighted a reviewer's concern about my evaluation metric and pushed ahead on my own. The model looked good on my metric but not theirs; I reworked it, and it taught me to align on success criteria upfront.`,
  `HR — "How do you handle ambiguity?": I'm comfortable with ambiguity — I start by clarifying the business goal, make my assumptions explicit, and build a quick baseline to learn from. Working across many client domains has made me good at structuring vague problems.`,
  `HR — "Describe a time you took initiative.": On the QSR project I noticed our evaluation didn't reflect long-horizon performance, so on my own I designed a horizon-aware MAPE framework across 450+ models. It became the standard we judged everything by.`,
  `HR — "How do you ensure quality in your work?": I build evaluation frameworks, write unit and integration tests, and run security scans with SonarQube and Snyk before anything ships through CI/CD. Quality for me is structural, not a final check.`,
  `HR — "Do you prefer working alone or in a team?": I'm comfortable both ways — I can go heads-down on a hard modeling problem, but I genuinely enjoy collaborating with engineers, analysts, and clients. My best outcomes came from tight teamwork.`,
  `HR — "Describe a time you worked in a team.": On the QSR engagement I worked closely with data engineers, fellow scientists, and client stakeholders to deliver the forecasting system. I owned the modeling and evaluation while coordinating on data and deployment, and we shipped a system running in production.`,
  `HR — "Tell me about a conflict with a coworker.": I once disagreed with a teammate on model choice. Rather than argue opinions, we agreed on a shared evaluation metric and let the results decide — it resolved the tension and improved the outcome. I find data settles most disagreements.`,
  `HR — "How do you handle disagreement with your manager?": I make my case with evidence and trade-offs, then commit to the decision once it's made. I've pushed back on evaluation choices before, and being respectful and data-driven kept it constructive.`,
  `HR — "How do you give feedback to peers?": I give feedback privately, specifically, and tied to the work rather than the person, and I always pair a concern with a suggestion. I try to give it early, while it's still useful.`,
  `HR — "Describe working with a difficult stakeholder.": With a demanding client stakeholder, I focus on understanding what they actually need and translating model results into their language — like delivering AR forecasts through Power BI dashboards they could explore. Clear, frequent communication usually turns tension into trust.`,
  `HR — "How do you collaborate with non-technical people?": I translate technical work into business impact — instead of AUC, I talk about overdue amounts dropping 38%. I lean on visuals and dashboards and check for understanding rather than assuming it.`,
  `HR — "Tell me about a time you persuaded someone.": I persuaded a team to adopt my horizon-aware evaluation by showing, with numbers, how the old metric hid long-horizon errors. Leading with evidence rather than opinion made the case for itself.`,
  `HR — "What do you do if a teammate isn't pulling their weight?": I'd first check privately whether something's blocking them, since it's often a hidden obstacle. If it persisted, I'd raise it constructively with clear expectations, and involve the lead only if needed.`,
  `HR — "Describe a time you mentored someone.": I've helped junior colleagues get up to speed on forecasting and MLOps, walking them through evaluation design and pipeline setup. I enjoy it — explaining something well sharpens my own thinking too.`,
  `HR — "How do you build relationships at work?": I build relationships by being reliable, communicating proactively, and being genuinely curious about others' work. Delivering on what I promise earns trust faster than anything.`,
  `HR — "How do you communicate complex results to leadership?": I lead with the business outcome and the decision it supports, then offer detail if needed. For the AR and forecasting work I used Power BI dashboards so leadership could explore the results themselves.`,
  `HR — "Describe a time you led a project.": I led the late-payment risk initiative end to end — framing the problem, engineering features, modeling, calibrating, and presenting impact. Owning it from raw data to a 38% overdue reduction was real leadership of the technical work.`,
  `HR — "Are you a leader or a follower?": I'm comfortable leading the technical direction of a project and equally happy to support a teammate's lead. I care more about the outcome than the title — I'll step up or step back as the work needs.`,
  `HR — "How do you motivate others?": I motivate by connecting the work to visible impact and by removing obstacles. When people see their model change a real metric, the motivation takes care of itself.`,
  `HR — "Tell me about a time you took ownership of a problem.": When my early forecasting approach underperformed, I didn't deflect — I owned it, diagnosed it, and built the framework that fixed it. Owning problems, especially your own, is the core of seniority to me.`,
  `HR — "How do you delegate?": I delegate by matching tasks to people's strengths and growth goals, giving clear context and success criteria, then staying available without micromanaging. I'm still growing this as I take on more lead work.`,
  `HR — "Describe a decision you made under uncertainty.": Forecasting is full of uncertainty, so I decide by setting a baseline, quantifying risk, and choosing the option that's robust across scenarios rather than optimal in one. I keep my assumptions explicit so they can be revisited.`,
  `HR — "Have you ever influenced without authority?": I influenced peers to adopt a new evaluation standard purely by demonstrating its value with data — no authority, just evidence and clear communication. That's usually how change actually sticks on a team.`,
  `HR — "How do you handle responsibility?": I take responsibility seriously — I'd rather over-communicate risks early than surprise people late. Owning production systems has taught me that accountability and good monitoring go hand in hand.`,
  `HR — "Tell me about a time you went above and beyond.": On the cash-flow PoC for a power utility, I went beyond the brief and reworked the approach across 6M+ customer records, lifting Cash-In accuracy from 70% to 98%. The extra effort turned a proof of concept into something genuinely credible.`,
  `HR — "Tell me about a time you disagreed with a decision.": I once disagreed with sticking to a metric that hid long-horizon error. I raised it with evidence, proposed an alternative, and we adopted it — but I'd have committed either way once it was decided.`,
  `HR — "Tell me about a time you had to learn something quickly.": When I picked up agentic AI, I learned LangChain and LangGraph fast by building real projects — a product recommender and a travel planner — rather than just reading. Building is how I learn quickest.`,
  `HR — "Tell me about a time you missed a deadline.": On a complex modeling task I underestimated the feature-engineering effort and flagged the slip early. We re-scoped to ship a solid baseline on time and refined after — and I've estimated feature work more carefully ever since.`,
  `HR — "How do you handle competing priorities from stakeholders?": I surface the conflict openly, tie each request to its business impact, and let that ranking guide sequencing. Making trade-offs visible usually gets stakeholders to agree on order.`,
  `HR — "Tell me about a time you received difficult feedback.": A reviewer once told me my evaluation didn't reflect what the business cared about. It stung, but acting on it produced the horizon-aware framework I'm now proud of — proof that hard feedback is often the most valuable.`,
  `HR — "Describe a time you improved a process.": I replaced manual monthly forecasting with an automated Airflow pipeline on AWS Fargate, complete with CI/CD, testing, and security scans. It cut manual effort and made the runs reliable and repeatable.`,
  `HR — "Tell me about a time a model failed in production.": When a model's performance drifts, I rely on monitoring to catch it, diagnose whether it's data or concept drift, and retrain or recalibrate. Building calibrated scoring and automated pipelines means issues get caught and fixed quickly rather than silently.`,
  `HR — "Describe a high-pressure situation and how you handled it.": Tight client reporting deadlines are high-pressure, and I handle them by automating the repeatable parts and protecting quality over scope. Staying methodical under pressure is something I've built up over many delivery cycles.`,
  `HR — "Tell me about a time you had to make a trade-off.": For AR forecasting I traded a marginally more accurate but heavy deep-learning model for a lighter ensemble that was easier to maintain and explain. In production, reliability and interpretability often beat a tiny accuracy gain.`,
  `HR — "Describe a time you delivered with a tight deadline and limited data.": On a PoC with limited clean data, I leaned on robust statistical methods and explicit assumptions to deliver a credible forecast fast, then flagged where more data would improve it. Being upfront about limitations kept it honest.`,
  `HR — "Tell me about a time you adapted to change.": I've adapted to new domains, tools, and shifting client requirements repeatedly across 7+ projects. I treat change as normal — I focus on the underlying problem, which stays stable even when the specifics move.`,
  `HR — "What are your salary expectations?": I'm looking for compensation that reflects my three years of production data science experience and the impact I bring, and I'm happy to align with a fair market range for the role. I care more about the opportunity and growth than the last rupee.`,
  `HR — "What is your notice period / availability?": I have a notice period with my current employer, but I'm committed to a smooth, prompt transition and will start as early as I can. I'm happy to discuss exact timing.`,
  `HR — "Are you willing to relocate?": I'm based in Bengaluru and open to relocating for the right opportunity. I'm also comfortable with hybrid arrangements.`,
  `HR — "Are you open to remote, hybrid, or onsite work?": I'm flexible — I've delivered effectively in collaborative team settings and can work hybrid, onsite, or remote. I do value some in-person time for close collaboration.`,
  `HR — "Are there any gaps in your career timeline?": My timeline is continuous — B.Sc., then the M.Sc. at IIT Kanpur, then Accenture from 2023 to now. There aren't gaps; I moved straight from study into building production systems.`,
  `HR — "Are you interviewing elsewhere?": I'm exploring a few opportunities to find the right fit, and I'm being selective. I'm genuinely interested in this role and happy to be transparent about my timeline.`,
  `HR — "How do you maintain work-life balance?": I work hard and care about delivery, and I also protect time for things that recharge me, like travel and painting. Good automation and planning mean I rarely need heroics, which keeps the balance sustainable.`,
  `HR — "What are your hobbies and interests outside work?": Outside work I enjoy travel, painting, and reading — especially mathematics. I also tinker with AI side projects and follow MLOps and LLM research for fun.`,
  `HR — "Do you have any questions for us?": Yes — I'd love to understand your current ML stack and roadmap, how data science influences decisions, and what success looks like in this role over the first year. I always want to know the team's biggest challenge right now.`,
  `HR — "Is there anything else we should know about you?": Just that I genuinely enjoy taking problems from raw data to a deployed, reliable system, and I bring both statistical rigor and engineering. I'm low-ego, delivery-focused, and quick to ramp up.`,
  `HR — "How soon can you start?": I can start as soon as my notice period allows, and I'll work to make that as short as possible. I'm happy to align on a date that works for both sides.`,
  `HR — "What role or title are you expecting?": I'm looking for a role around senior data scientist or an equivalent IC/technical-lead level, matching my three years of production experience. But I care more about the scope and growth than the exact title.`,
  `HR — "How do you define success?": I define success as shipping something that creates measurable value and holds up in production — a model that actually moves a business metric. Growth and learning along the way matter to me too.`,
  `HR — "What kind of work environment do you thrive in?": I thrive where there's real ownership, strong technical peers, and a culture that values both rigor and shipping. Autonomy with clear goals brings out my best work.`,
  `HR — "What management style do you work best with?": I do best with a manager who sets clear goals and trusts me to own the how, while being available when I want to talk through trade-offs. I value direct, honest feedback.`,
  `HR — "How do you keep your skills up to date?": I stay current by building side projects, reading MLOps and LLM research, and earning focused certifications — recently in agentic AI and deep learning. Hands-on building is how I really learn.`,
  `HR — "What do you do when you don't know something?": When I don't know something, I say so plainly, then go find out — I'm comfortable digging into docs, papers, or experiments to close the gap fast. I'd rather admit a gap than guess.`,
  `HR — "How do you handle repetitive work?": I handle repetition by automating it — that's exactly why I moved manual monthly forecasting onto an automated Airflow pipeline. If it's worth doing twice, it's usually worth scripting.`,
  `HR — "What is your approach to continuous learning?": I'm a continuous learner by nature — between my research background, side projects, and certifications, I'm always picking up something new. Right now it's streaming ML and agentic systems.`,
  `HR — "Describe your ideal team or company culture.": My ideal culture is collaborative and data-driven, where decisions are backed by evidence, people own their work, and shipping reliable systems is valued as much as clever models. A bit of intellectual curiosity in the team makes it even better.`,
];

const allKB = [...KB, ...HR_QA];

async function main() {
  console.log(`Embedding ${allKB.length} knowledge-base documents via Gemini (sequential)...`);
  const vectors = await embedAll(allKB);
  const outPath = resolve(ROOT, 'api', '_vectors.json');
  writeFileSync(outPath, JSON.stringify(vectors));
  console.log(`✓ Wrote ${vectors.length} vectors to api/_vectors.json`);
  console.log(`  Each vector has ${vectors[0]?.length ?? 0} dimensions`);
}

main().catch(e => { console.error('Failed:', e); process.exit(1); });
