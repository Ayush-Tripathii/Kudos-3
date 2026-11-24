// Dev-only: measure FCP/LCP/CLS with a fresh session (intro plays), throttled like Lighthouse mobile.
import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true });
const c = await page.target().createCDPSession();
await c.send('Network.enable');
await c.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
await c.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await page.evaluateOnNewDocument(() => {
  window.__v = { lcp: 0, cls: 0, el: '' };
  new PerformanceObserver((l) => { for (const e of l.getEntries()) { window.__v.lcp = e.startTime; window.__v.el = (e.element && (e.element.tagName + '.' + e.element.className)) || e.url; } }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__v.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
});
await page.goto(process.argv[2] || 'http://127.0.0.1:4321/', { waitUntil: 'networkidle0', timeout: 120000 });
await new Promise((r) => setTimeout(r, 3000));
const fcp = await page.evaluate(() => performance.getEntriesByName('first-contentful-paint')[0]?.startTime);
const v = await page.evaluate(() => window.__v);
const bytes = await page.evaluate(() => performance.getEntriesByType('resource').reduce((a, r) => a + (r.transferSize || 0), 0) + (performance.getEntriesByType('navigation')[0]?.transferSize || 0));
console.log({ fcp: Math.round(fcp), lcp: Math.round(v.lcp), lcpEl: v.el, cls: v.cls.toFixed(4), kbTransferred: Math.round(bytes / 1024) });
await browser.close();
