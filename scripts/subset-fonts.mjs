// Subset self-hosted fonts to the glyphs this site uses (English + ₹ + typographic punctuation).
// Originals live in _raw/fonts; output goes to public/fonts.
// usage: node scripts/subset-fonts.mjs
import subsetFont from 'subset-font';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, '_raw', 'fonts');
const OUT = path.join(ROOT, 'public', 'fonts');

const ascii = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('');
const extra = '‘’“”—–·•…→←×₹©®™°éèêàâçñöüäÉ';
const text = ascii + extra;

const jobs = [
  // Archivo is only ever set in uppercase, but keep lowercase for safety; pin the width axis range we use
  { file: 'archivo-latin-wdth-normal.woff2', axes: { wdth: { min: 100, max: 125 } } },
  { file: 'instrument-serif-latin-400-normal.woff2' },
  { file: 'instrument-serif-latin-400-italic.woff2' },
  { file: 'switzer-400.woff2' },
];

for (const j of jobs) {
  const input = fs.readFileSync(path.join(SRC, j.file));
  const out = await subsetFont(input, text, { targetFormat: 'woff2', ...(j.axes && { variationAxes: j.axes }) });
  fs.writeFileSync(path.join(OUT, j.file), out);
  console.log(`${j.file.padEnd(44)} ${(input.length / 1024).toFixed(1)} KB → ${(out.length / 1024).toFixed(1)} KB`);
}
