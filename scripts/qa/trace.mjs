// Dev-only: trace first 8s of a fresh mobile load at 4x CPU; summarise long tasks.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const out = process.argv[2];
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true });
const c = await page.target().createCDPSession();
await c.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await page.tracing.start({ path: out, categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'disabled-by-default-devtools.timeline.invalidationTracking', 'disabled-by-default-devtools.timeline.stack'] });
await page.goto('http://127.0.0.1:4321/', { waitUntil: 'load' });
await new Promise((r) => setTimeout(r, 6000));
await page.tracing.stop();
await browser.close();
const t = JSON.parse(fs.readFileSync(out, 'utf8')).traceEvents;
const main = t.find((e) => e.name === 'TracingStartedInBrowser')?.args?.data?.frames?.[0];
const tasks = t.filter((e) => e.name === 'RunTask' && e.dur > 50000).sort((a, b) => b.dur - a.dur).slice(0, 10);
for (const task of tasks) {
  const kids = t.filter((e) => e.tid === task.tid && e.pid === task.pid && e.ts >= task.ts && e.ts + (e.dur || 0) <= task.ts + task.dur && e.ph === 'X' && e.name !== 'RunTask');
  const agg = {};
  kids.forEach((k) => { agg[k.name] = (agg[k.name] || 0) + k.dur; });
  const top = Object.entries(agg).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([n, d]) => `${n}:${Math.round(d / 1000)}`).join(' ');
  const fn = kids.find((k) => k.name === 'FunctionCall' || k.name === 'EventDispatch' || k.name === 'TimerFire' || k.name === 'FireAnimationFrame');
  const ul = kids.find((k) => k.name === 'UpdateLayoutTree');
  console.log(`${Math.round(task.dur / 1000)}ms @${Math.round((task.ts - tasks[0].ts) / 1000)} | ${top} | ${fn ? fn.name + ' ' + JSON.stringify(fn.args?.data?.url || fn.args?.data?.type || '').slice(-60) : ''} | elems:${ul?.args?.elementCount ?? ''}`);
}
const agg = {};
t.filter((e) => e.ph === 'X').forEach((e) => { agg[e.name] = (agg[e.name] || 0) + (e.dur || 0); });
console.log('TOTALS', Object.entries(agg).filter(([n]) => n !== 'RunTask' && !n.startsWith('Thread')).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([n, d]) => `${n}:${Math.round(d / 1000)}`).join(' | '));
