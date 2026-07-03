#!/usr/bin/env node
/**
 * Build-time resume extractor.
 *
 * 1. Scans public/resumes/ for PDFs matching *_YYYYMMDD.pdf
 * 2. Picks the latest by date
 * 3. Extracts text via pdftotext
 * 4. Splits into KB chunks → api/_rag_resume.ts
 * 5. Writes the filename → src/_resume.ts
 */

import { readdirSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(DIR, '..');
const RESUMES_DIR = join(ROOT, 'public', 'resumes');
const OUT_KB = join(ROOT, 'api', '_rag_resume.ts');
const OUT_RESUME = join(ROOT, 'src', '_resume.ts');

// ─── 1. Find latest resume PDF ───

const RESUME_RE = /_(\d{8})\.pdf$/;
const pdfs = readdirSync(RESUMES_DIR)
  .filter(f => RESUME_RE.test(f))
  .map(f => ({ file: f, date: Number(f.match(RESUME_RE)[1]) }))
  .sort((a, b) => b.date - a.date);

if (pdfs.length === 0) {
  console.error('No resume PDFs found in public/resumes/');
  process.exit(1);
}

const latest = pdfs[0];
const pdfPath = join(RESUMES_DIR, latest.file);
console.log(`Latest resume: ${latest.file} (${latest.date})`);

// ─── 2. Extract text ───

let text;
try {
  execSync('which pdftotext', { stdio: 'ignore' });
  text = execSync(`pdftotext "${pdfPath}" -`, { encoding: 'utf-8' }).trim();
} catch {
  console.warn('pdftotext not available — using existing generated files');
  process.exit(0);
}

// ─── 3. Chunk into KB entries ───

/* Strip non-ASCII decoration chars pdftotext renders from PDF symbols */
const DECO_RE = /[ć×\]ĪĜĴŴĢŵħø¤░]/g;

const clean = (s) => s.replace(DECO_RE, '').trim();
const bullet = (s) => s.replace(/^[•·●▪→▸❖⁃\-*\d][.\s)]*\s*/, '').trim();

/* ── Section boundaries ── */
const SECTION_NAMES = ['Professional Experience', 'Self-Projects', 'Skills', 'Education'];

const lines = text.split('\n').map(l => l.trimEnd());
const breaks = [{ name: 'header', line: 0 }];

for (let i = 0; i < lines.length; i++) {
  const l = lines[i].trim();
  for (const name of SECTION_NAMES) {
    if (l.startsWith(name) && (l.length === name.length || /\s/.test(l.slice(name.length, name.length + 1)))) {
      breaks.push({ name, line: i });
      break;
    }
  }
}
breaks.push({ name: 'footer', line: lines.length });

/* Map section name → its lines */
const rawSections = {};
for (let i = 0; i < breaks.length - 1; i++) {
  const from = breaks[i];
  const to = breaks[i + 1];
  const start = from.name === 'header' ? from.line : from.line + 1;
  rawSections[from.name] = lines.slice(start, to.line).filter(l => {
    const c = clean(l);
    return c && !/^Ī+$/.test(c);
  });
}

/* ── Assemble KB chunks (first-person narrative for better retrieval) ── */
const kb = [];

/* Header / Profile */
const headerLines = rawSections.header.map(l => clean(l)).filter(l => l);
let profile = headerLines.join(' · ');
profile = profile.replace(/[aç]\s+(GitHub|Portfolio|LinkedIn)/g, '$1').replace(/\s{2,}/g, ' ').replace(/·\s*·/g, '·').trim();
const profileText = profile || '';
kb.push(`My name is Prithwijit Ghosh. I am a Data Scientist Specialist at Accenture Global Technology. ${profileText}`);

/* Experience — split by sub-project headers (lines containing '|' or '∥') */
const expLines = rawSections['Professional Experience'] || [];
const subs = [];
let cur = { title: '', body: '' };

for (const l of expLines) {
  const c = clean(l);
  if (!c) continue;

  if ((/[|∥]/.test(c) && c.length < 80 || c === 'Proof of Concepts') && !c.startsWith('Ĝ') && !c.startsWith('Ĵ')) {
    if (cur.title || cur.body) subs.push(cur);
    cur = { title: c, body: '' };
  } else if (/(Data Scientist|Bengaluru|July|August|September|October|November|December|January|February|March|April|May|June|^\d{4})/.test(c)) {
    // skip role title / location / date lines
  } else {
    const b = bullet(c);
    if (b && b.length > 3) cur.body += b + ' ';
  }
}
if (cur.title || cur.body) subs.push(cur);

for (const s of subs) {
  const body = s.body.replace(/\s+/g, ' ').trim();
  if (!body) continue;
  const [project, client] = s.title.includes('|') ? s.title.split('|').map(s => s.trim()) : [s.title, ''];
  if (s.title === 'Proof of Concepts') {
    kb.push(`I also worked on proof-of-concept projects at Accenture. ${body}`);
  } else if (client) {
    kb.push(`At Accenture I worked on ${project} for ${client}. ${body}`);
  } else {
    kb.push(`At Accenture I worked on ${project}. ${body}`);
  }
}

/* Self-Projects (title + date + description blocks) */
const projLines = rawSections['Self-Projects'] || [];
const projs = [];
let pcur = { title: '', body: '' };

for (const l of projLines) {
  const c = clean(l);
  if (!c) continue;

  const isDateLine = /^['’A-Z][a-z]+['’]\d{2}/.test(c) ||
    /^['’A-Z][a-z]+ \d{4}/.test(c) ||
    /^\d{4}/.test(c);
  const isTitleLine = !isDateLine && /^[A-Z]/.test(c) && c.length < 70 && !c.startsWith('Ī') &&
    !/^(Built|Deployed|Designed|Developed|Engineered|Created|Implemented)/.test(c);

  if (isTitleLine) {
    if (pcur.title || pcur.body) projs.push(pcur);
    pcur = { title: c, body: '' };
  } else if (isDateLine) {
    // date is metadata for the current project — skip
  } else {
    const b = bullet(c);
    if (b && b.length > 5) pcur.body += b + ' ';
  }
}
if (pcur.title || pcur.body) projs.push(pcur);

/* Collect project names for the summary chunk */
const projectNames = [];

for (const p of projs) {
  const body = p.body.replace(/\s+/g, ' ').trim();
  const title = p.title.replace(/[*]/g, '').trim();
  projectNames.push(title);
  if (body) {
    // Capitalize first letter of body for the sentence
    const desc = body.charAt(0).toUpperCase() + body.slice(1);
    kb.push(`I built a project called "${title}". ${desc}.`);
  }
}

/* Projects summary chunk — explicit list of project names for easy retrieval */
if (projectNames.length) {
  const names = projectNames.map((n, i) => `${i + 1}. "${n}"`).join(', ');
  kb.push(`Here is a list of all the projects I have worked on: ${names}.`);
}

/* Skills */
const skillLines = rawSections.Skills || [];
const skills = skillLines
  .map(l => clean(l).replace(/^\*\s*/, '').trim())
  .filter(l => l)
  .join(' | ');
if (skills) kb.push(`My skills include: ${skills}`);

/* Education */
const eduLines = rawSections.Education || [];
const edu = eduLines
  .map(l => clean(l))
  .filter(l => l)
  .join(' · ');
if (edu) kb.push(`My education: ${edu}`);

// ─── 4. Write generated files ───

const kbContent = `// Auto-generated by scripts/extract-resume.mjs — do not edit manually.
// Source: ${latest.file} (${latest.date})

export const RESUME_KB: string[] = ${JSON.stringify(kb, null, 2)};
`;
writeFileSync(OUT_KB, kbContent, 'utf-8');
console.log(`Wrote ${kb.length} KB chunks → ${relative(ROOT, OUT_KB)}`);

const resumeContent = `// Auto-generated by scripts/extract-resume.mjs — do not edit manually.
export const LATEST_RESUME_FILENAME = ${JSON.stringify(latest.file)};
`;
writeFileSync(OUT_RESUME, resumeContent, 'utf-8');
console.log(`Wrote → ${relative(ROOT, OUT_RESUME)}`);

kb.forEach((c, i) => console.log(`  [${i}] ${c.substring(0, 120)}...`));
