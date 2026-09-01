/**
 * Regenerates the derived brand images in ../assets:
 *   - og-image.png      (1200x630)  link-share preview: EraaSoft + iCareer logos
 *   - favicon-16/32/180/512.png       EraaSoft brain-gear mark on a white rounded tile
 *
 * Sources: assets/eraasoft.png, assets/icareer.png
 * Requires Playwright's Chromium. Run:  node scripts/generate-brand-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const asset = (p) => path.join(root, 'assets', p);
const dataUri = (p) => `data:image/png;base64,${fs.readFileSync(asset(p)).toString('base64')}`;

const eraa = dataUri('eraasoft.png');
const icareer = dataUri('icareer.png');

/* ---------- Open Graph preview card ---------- */
const ogHtml = `<!doctype html><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;display:flex;align-items:center;justify-content:center;
    background:linear-gradient(135deg,#1d3a8f,#2243a4 50%,#13245c);font-family:'Segoe UI',Tahoma,sans-serif}
  .card{background:#fff;border-radius:28px;border-top:10px solid #f1c40f;padding:64px 88px;
    box-shadow:0 30px 70px rgba(14,26,66,.45);display:flex;flex-direction:column;align-items:center;gap:38px}
  .logos{display:flex;align-items:center;gap:56px}
  .logos img.eraa{height:130px}
  .logos .divider{width:2px;height:96px;background:#e2e8f0}
  .logos img.ic{height:92px}
  h1{font-size:44px;color:#2243a4;font-weight:700}
  p{font-size:24px;color:#94a3b8}
</style>
<div class="card">
  <div class="logos">
    <img class="eraa" src="${eraa}"><div class="divider"></div><img class="ic" src="${icareer}">
  </div>
  <h1>Student Registration Form</h1>
  <p>EraaSoft &nbsp;&times;&nbsp; iCareer</p>
</div>`;

/* ---------- Favicon: crop the icon mark out of the eraasoft wordmark ---------- */
const sx = 40, sy = 158, sw = 140;   // crop box in the 500x500 source
const inner = 396;                    // rendered icon box inside the 512 canvas
const scale = inner / sw;
const faviconHtml = `<!doctype html><meta charset="utf-8"><style>
  *{margin:0;padding:0}
  body{width:512px;height:512px;background:transparent;display:flex;align-items:center;justify-content:center}
  .bg{width:512px;height:512px;background:#fff;border-radius:112px;display:flex;align-items:center;justify-content:center}
  .clip{width:${inner}px;height:${inner}px;overflow:hidden;position:relative}
  img{position:absolute;width:${500 * scale}px;left:${-sx * scale}px;top:${-sy * scale}px;max-width:none}
</style>
<div class="bg"><div class="clip"><img src="${eraa}"></div></div>`;

const browser = await chromium.launch();

const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await og.setContent(ogHtml, { waitUntil: 'networkidle' });
await og.screenshot({ path: asset('og-image.png') });

const fav = await browser.newPage({ viewport: { width: 512, height: 512 } });
await fav.setContent(faviconHtml, { waitUntil: 'networkidle' });
fs.writeFileSync(asset('favicon-512.png'), await fav.screenshot({ omitBackground: true }));

const src512 = dataUri('favicon-512.png');
for (const size of [180, 32, 16]) {
  const p = await browser.newPage({ viewport: { width: size, height: size } });
  await p.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0;padding:0}body{width:${size}px;height:${size}px;background:transparent}img{width:${size}px;height:${size}px;display:block}</style><img src="${src512}">`, { waitUntil: 'networkidle' });
  fs.writeFileSync(asset(`favicon-${size}.png`), await p.screenshot({ omitBackground: true }));
}

await browser.close();
console.log('Wrote assets/og-image.png and assets/favicon-{16,32,180,512}.png');
