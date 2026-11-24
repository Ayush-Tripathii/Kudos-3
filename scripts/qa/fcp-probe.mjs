// Dev-only: verify first paint on first visit (intro plays) and repeat visit.
import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
const variants = { 'first-visit': () => {}, 'repeat-visit': () => sessionStorage.setItem('kudos-intro', '1') };
for (const [label, fn] of Object.entries(variants)) {
  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 823 });
  await page.evaluateOnNewDocument(fn);
  await page.evaluateOnNewDocument(() => {
    window.__lcp = [];
    new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lcp.push(Math.round(e.startTime) + ' ' + (e.element?.tagName || '') + '.' + (e.element?.className || '')))).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  await page.goto('http://127.0.0.1:4321/', { waitUntil: 'load' });
  await new Promise((r) => setTimeout(r, 2500));
  const r = await page.evaluate(() => ({
    paints: performance.getEntriesByType('paint').map((p) => p.name + ':' + Math.round(p.startTime)),
    lcp: window.__lcp.at(-1),
    cls: document.documentElement.className,
    htmlDisplay: getComputedStyle(document.documentElement).display,
    overlay: getComputedStyle(document.querySelector('div.intro')).display,
  }));
  console.log(label, r);
  await page.close();
}
await browser.close();
