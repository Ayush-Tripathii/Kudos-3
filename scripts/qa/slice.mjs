// Dev-only: slice a full-page screenshot into viewable chunks.
import sharp from 'sharp'; // run from project root
const [file, prefix, chunk = '2400', scale = '0.6'] = process.argv.slice(2);
const m = await sharp(file).metadata();
const H = Number(chunk);
for (let i = 0, y = 0; y < m.height; i++, y += H) {
  const h = Math.min(H, m.height - y);
  await sharp(file).extract({ left: 0, top: y, width: m.width, height: h })
    .resize(Math.round(m.width * Number(scale))).jpeg({ quality: 70 }).toFile(`${prefix}-${String(i).padStart(2, '0')}.jpg`);
}
console.log('slices:', Math.ceil(m.height / H));
