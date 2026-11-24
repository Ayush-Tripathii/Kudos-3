// Dev-only: screenshot the built site at several widths (uses local Chrome).
import puppeteer from 'puppeteer-core';
const url = process.argv[2] || 'http://localhost:4321/';
const out = process.argv[3] || '.';
const widths = (process.argv[4] || '1440,390').split(',').map(Number);
const rm = process.argv.includes('--rm');
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
for (const w of widths) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.setViewport({ width: w, height: w < 768 ? 844 : 900, deviceScaleFactor: 1 });
  if (rm) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.evaluateOnNewDocument(() => sessionStorage.setItem('kudos-intro', '1'));
  await page.goto(url, { waitUntil: 'networkidle0' });
  // scroll through so every reveal fires and lazy images load
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 400) { await page.evaluate((y) => window.scrollTo(0, y), y); await new Promise((r) => setTimeout(r, 120)); }
  await new Promise((r) => setTimeout(r, 1500));
    const vh = w < 768 ? 844 : 900;
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const only = process.env.AT ? process.env.AT.split(',').map(Number) : null;
  let n = 0;
  for (let y = 0; y < total; y += vh, n++) {
    if (only && !only.includes(n)) continue;
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await new Promise((r) => setTimeout(r, 900));
    await page.screenshot({ path: `${out}/v${w}${rm ? 'rm' : ''}-${String(n).padStart(2, '0')}.png` });
  }
  console.log(w, 'viewport shots:', n);
  console.log(w, 'height', h, 'errors:', errors.length ? errors : 'none');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const wide = await page.evaluate(() => [...document.querySelectorAll('body *')].filter((e) => { const r = e.getBoundingClientRect(); return r.right > document.documentElement.clientWidth + 1 && getComputedStyle(e).position !== 'fixed'; }).slice(0, 8).map((e) => e.className + ' ' + Math.round(e.getBoundingClientRect().right)));
  if (overflow > 0) console.log('wide:', wide);
  console.log(w, 'horizontal overflow px:', overflow);
  await page.close();
}
await browser.close();
