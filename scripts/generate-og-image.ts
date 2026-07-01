import { chromium } from 'playwright';
import { execSync, spawn, type ChildProcess } from 'child_process';
import { existsSync, unlinkSync } from 'fs';
import { resolve } from 'path';
import sharp from 'sharp';

const PORT = 4173;
const BASE = `http://localhost:${PORT}`;
const OUT = resolve('public/og-image.jpg');

async function waitForServer(url: string, ms = 15000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < ms) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch { /* server not ready yet */ }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Server at ${url} did not become ready within ${ms}ms`);
}

async function main() {
  if (!existsSync('dist/index.html')) {
    console.log('Building…');
    execSync('npm run build', { stdio: 'inherit' });
  }

  console.log('Starting preview server…');
  const server: ChildProcess = spawn('npx', ['vite', 'preview', '--port', String(PORT)], {
    stdio: 'pipe',
    shell: true,
  });

  try {
    await waitForServer(BASE);

    console.log('Launching browser…');
    const browser = await chromium.launch();
    // Use a wide viewport so the graph renders at a good width
    const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });

    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 20000 });

    // Wait for the experience graph SVG to render
    await page.waitForSelector('.experience-flow svg', { timeout: 10000 });
    await page.waitForTimeout(500);

    // Inject CSS to give the graph a natural block layout (remove flex constraints)
    await page.addStyleTag({
      content: `
        .experience-layout { display: block !important; }
        .experience-flow { width: 100% !important; height: auto !important; flex: none !important; }
        .experience-flow svg { width: 100% !important; height: auto !important; max-height: none !important; }
      `,
    });
    await page.waitForTimeout(300);

    // Scroll to the experience section so the SVG is forced to render at full height
    await page.evaluate(() => {
      const el = document.querySelector('#experience');
      if (el) el.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
    await page.waitForTimeout(500);

    // Get the graph element's page-level bounding box
    const box = await page.evaluate(() => {
      const el = document.querySelector('.experience-flow');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.top + window.scrollY, w: r.width, h: r.height };
    });

    if (!box || box.w === 0 || box.h === 0) {
      console.error('Could not locate graph element');
      await page.screenshot({ path: OUT, type: 'jpeg', quality: 92 });
    } else {
      // Take a full-page screenshot and crop to the graph element
      const fullPagePath = resolve('tmp-fullpage.png');
      await page.screenshot({ path: fullPagePath, fullPage: true });

      // Crop to the graph element, then resize to 1200×630 (cover-crop to fit)
      await sharp(fullPagePath)
        .extract({ left: Math.round(box.x), top: Math.round(box.y), width: Math.round(box.w), height: Math.round(box.h) })
        .resize(1200, 630, { fit: 'cover', position: 'centre' })
        .jpeg({ quality: 92 })
        .toFile(OUT);

      // Clean up temp file
      try { if (existsSync(fullPagePath)) unlinkSync(fullPagePath); } catch { /* ignore */ }

      console.log(`OG image saved → ${OUT} (${Math.round(box.w)}×${Math.round(box.h)} → 1200×630)`);
    }

    await browser.close();
  } finally {
    server.kill('SIGTERM');
    setTimeout(() => { try { server.kill('SIGKILL'); } catch { /* ignore */ } }, 3000);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
