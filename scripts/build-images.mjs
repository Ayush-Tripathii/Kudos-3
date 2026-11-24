// Kudos image pipeline
// raw JPEG → crop (focal point) → high-key airy grade → 2–3% film grain
//          → AVIF + WebP + JPEG at fixed widths, each held under a byte budget
//          → 20px LQIP, written to src/data/images.json
//
// usage: npm run images            (skips outputs that already exist)
//        npm run images -- --force (rebuild everything)

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import { VENUE, DISHES, RATIOS, WIDTHS, BUDGET } from './images.config.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW = path.join(ROOT, '_raw');
const OUT = path.join(ROOT, 'public', 'img');
const MANIFEST = path.join(ROOT, 'src', 'data', 'images.json');
const FORCE = process.argv.includes('--force');

fs.mkdirSync(OUT, { recursive: true });
sharp.concurrency(Math.max(1, Math.floor(os.cpus().length / 2)));

// ---- Grade: lift shadows toward warm grey-brown, hold highlights,
//      warmth +5, saturation −8, contrast slightly reduced.
function grade(img) {
  return img
    .linear([0.9, 0.89, 0.87], [22, 19, 15])          // compress range: lifts blacks warm, highlights ~held
    .recomb([[1.035, 0.01, 0], [0, 1.0, 0], [0, 0, 0.955]]) // warmth
    .modulate({ saturation: 0.92, brightness: 1.03 });  // −8% sat, airy
}

// ---- Film grain: grayscale gaussian noise, soft-light blended (≈2–3%)
const grainCache = new Map();
async function grain(w, h) {
  const k = `${w}x${h}`;
  const sigma = w >= 1600 ? 9 : 12; // finer at large sizes so it survives compression
  if (grainCache.has(k)) return grainCache.get(k);
  const buf = await sharp({
    create: { width: w, height: h, channels: 3, background: { r: 128, g: 128, b: 128 },
      noise: { type: 'gaussian', mean: 128, sigma } },
  }).greyscale().png().toBuffer();
  grainCache.set(k, buf);
  return buf;
}

function cropBox(W, H, ratio, { x = 0.5, y = 0.5 } = {}) {
  let cw = W, ch = Math.round(W / ratio);
  if (ch > H) { ch = H; cw = Math.round(H * ratio); }
  const left = Math.min(W - cw, Math.max(0, Math.round(x * W - cw / 2)));
  const top = Math.min(H - ch, Math.max(0, Math.round(y * H - ch / 2)));
  return { left, top, width: cw, height: ch };
}

async function encode(pipeline, fmt, budget, file, avifQ) {
  const q0 = fmt === 'avif' && avifQ ? avifQ : { avif: 52, webp: 74, jpg: 76 }[fmt];
  const floor = { avif: 34, webp: 38, jpg: 38 }[fmt];
  for (let q = q0; q >= floor; q -= 6) {
    const p = pipeline.clone();
    const buf = fmt === 'avif' ? await p.avif({ quality: q, effort: 4, chromaSubsampling: '4:2:0' }).toBuffer()
      : fmt === 'webp' ? await p.webp({ quality: q, effort: 5 }).toBuffer()
      : await p.jpeg({ quality: q, mozjpeg: true, progressive: true }).toBuffer();
    if (buf.length <= budget || q - 6 < floor) { fs.writeFileSync(file, buf); return { q, size: buf.length }; }
  }
}

// WebP/JPEG are fallbacks only — capped at 1600 px; 2400 is AVIF-only.
const formatsFor = (w) => (w > 1600 ? ['avif'] : ['avif', 'webp', 'jpg']);

const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};
const report = [];

async function processOne(item) {
  const srcPath = path.join(RAW, item.src);
  const meta = await sharp(srcPath).metadata();
  const entry = (manifest[item.name] ||= { crops: {} });
  for (const [cropKey, focus] of Object.entries(item.crops)) {
    const ratio = RATIOS[cropKey];
    const box = cropBox(meta.width, meta.height, ratio, focus);
    const widths = WIDTHS[cropKey].filter((w) => w <= box.width);
    const allExist = !FORCE && entry.crops[cropKey] && widths.every((w) =>
      formatsFor(w).every((f) => fs.existsSync(path.join(OUT, `${item.name}-${cropKey}-${w}.${f}`))));
    if (allExist) continue;

    // graded master at the largest width
    const maxW = widths[widths.length - 1];
    const master = await grade(
      sharp(srcPath).rotate().extract(box).resize({ width: maxW, kernel: 'lanczos3' })
    ).toColourspace('srgb').raw().toBuffer({ resolveWithObject: true });

    for (const w of widths) {
      const h = Math.round(w / ratio);
      const g = await grain(w, h);
      const base = sharp(master.data, { raw: master.info }).resize(w, h)
        .composite([{ input: g, blend: 'soft-light' }]);
      // composite must be flattened before cloning for multiple encoders
      const flat = sharp(await base.png({ compressionLevel: 0 }).toBuffer());
      for (const fmt of formatsFor(w)) {
        const file = path.join(OUT, `${item.name}-${cropKey}-${w}.${fmt}`);
        const r = await encode(flat, fmt, BUDGET[cropKey], file, item.avifQ);
        report.push(`${path.basename(file).padEnd(52)} q${String(r.q).padStart(2)} ${(r.size / 1024).toFixed(0).padStart(4)} KB${r.size > BUDGET[cropKey] ? '  OVER' : ''}`);
      }
    }
    const lqip = await sharp(master.data, { raw: master.info }).resize(20).blur(1.2).webp({ quality: 40 }).toBuffer();
    entry.crops[cropKey] = { widths, ratio: cropKey, lqip: `data:image/webp;base64,${lqip.toString('base64')}` };
    console.log(`✓ ${item.name} ${cropKey} [${widths.join(', ')}]`);
  }
}

// Open Graph card 1200×630
async function og() {
  const file = path.join(OUT, 'og-kudos-1200x630.jpg');
  if (fs.existsSync(file) && !FORCE) return;
  const src = path.join(RAW, 'venue/DSC8254.jpg');
  const m = await sharp(src).metadata();
  const box = cropBox(m.width, m.height, 1200 / 630, { x: 0.45, y: 0.55 });
  await grade(sharp(src).extract(box).resize(1200, 630)).jpeg({ quality: 80, mozjpeg: true }).toFile(file);
  console.log('✓ og card');
}

const items = [...VENUE, ...DISHES].filter((i) => !process.env.ONLY || process.env.ONLY.split(',').includes(i.name));
const queue = [...items];
await Promise.all(Array.from({ length: 3 }, async () => {
  while (queue.length) await processOne(queue.shift());
}));
await og();

fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1));
if (report.length) fs.writeFileSync(path.join(ROOT, 'scripts', 'image-report.txt'), report.join('\n'));
console.log(`done · ${report.length} files written`);
