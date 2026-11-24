// Dev-only: keyboard / lightbox / form / pillar / hover checks.
import puppeteer from 'puppeteer-core';
const out = process.argv[2];
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.setViewport({ width: 1440, height: 900 });
await page.evaluateOnNewDocument(() => sessionStorage.setItem('kudos-intro', '1'));
await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 1500));
const ok = (label, cond) => console.log((cond ? 'PASS ' : 'FAIL ') + label);

// skip link is the first tab stop
await page.keyboard.press('Tab');
ok('skip link first focus', await page.evaluate(() => document.activeElement.classList.contains('skip')));

// pillars: click 3rd, arrow navigation
await page.evaluate(() => document.querySelector('#philosophy').scrollIntoView());
await new Promise((r) => setTimeout(r, 600));
await page.click('#pillar-b-2');
ok('pillar 3 expanded', await page.evaluate(() => document.querySelector('#pillar-b-2').getAttribute('aria-expanded') === 'true' && document.querySelector('[data-pillar-fig="2"]').classList.contains('is-active')));
await page.keyboard.press('ArrowDown');
ok('pillar ArrowDown moves focus', await page.evaluate(() => document.activeElement.id === 'pillar-b-3'));
await page.keyboard.press('Enter');
ok('pillar Enter activates', await page.evaluate(() => document.querySelector('#pillar-b-3').getAttribute('aria-expanded') === 'true'));

// dish hover wipe
await page.evaluate(() => document.querySelector('#food .board').scrollIntoView());
await new Promise((r) => setTimeout(r, 800));
const dish = await page.$('.dish:nth-child(2) .dish__btn');
await dish.hover();
await new Promise((r) => setTimeout(r, 600));
ok('dish photo wiped in on hover', await page.evaluate(() => getComputedStyle(document.querySelector('.dish:nth-child(2) .dish__photo')).clipPath.replace(/\s/g, '') === 'inset(0px)'));
await page.screenshot({ path: `${out}/i-dish-hover.png` });

// gallery: keyboard open lightbox
await page.evaluate(() => document.querySelector('#gallery').scrollIntoView());
await new Promise((r) => setTimeout(r, 800));
await page.focus('.sheet__btn[data-index="2"]');
await page.keyboard.press('Enter');
await new Promise((r) => setTimeout(r, 900));
ok('lightbox open (modal)', await page.evaluate(() => document.querySelector('[data-lightbox]').open && document.querySelector('[data-lightbox]').matches(':modal')));
ok('lightbox image src set', await page.evaluate(() => document.querySelector('[data-lb-img]').currentSrc.includes('kudos-bar-counter')));
await page.screenshot({ path: `${out}/i-lightbox.png` });
await page.keyboard.press('ArrowRight');
ok('lightbox ArrowRight → next', await page.evaluate(() => document.querySelector('[data-lb-img]').src.includes('kudos-terrace-sunset-palace')));
// focus trap: tab many times, focus must stay inside dialog
for (let i = 0; i < 6; i++) await page.keyboard.press('Tab');
ok('focus trapped in lightbox', await page.evaluate(() => !!document.activeElement.closest('[data-lightbox]') || document.activeElement === document.body));
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 300));
ok('Escape closes lightbox', await page.evaluate(() => !document.querySelector('[data-lightbox]').open));
ok('focus returned to thumbnail', await page.evaluate(() => document.activeElement.matches('.sheet__btn[data-index="3"]')));

// form: empty submit → errors; fill → WhatsApp fallback success
await page.evaluate(() => document.querySelector('#visit').scrollIntoView());
await new Promise((r) => setTimeout(r, 600));
await page.click('.form__submit');
const errs = await page.$$eval('.field.is-invalid', (e) => e.length);
ok(`empty submit shows ${errs} inline errors`, errs === 5);
ok('focus moved to first invalid field', await page.evaluate(() => document.activeElement.id === 'f-name'));
await page.screenshot({ path: `${out}/i-form-errors.png` });
await page.type('#f-name', 'Test Guest');
await page.type('#f-phone', '98765 43210');
await page.select('#f-guests', '4');
const d = new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10);
await page.$eval('#f-date', (el, v) => { el.value = v; }, d);
await page.$eval('#f-time', (el) => { el.value = '20:00'; });
await page.evaluate(() => { window.__opened = ''; window.open = (u) => { window.__opened = u; return null; }; });
await page.click('.form__submit');
const url = await page.evaluate(() => window.__opened);
ok('WhatsApp fallback opened with message', url.startsWith('https://wa.me/') && decodeURIComponent(url).includes('Test Guest'));
ok('success state shown', await page.evaluate(() => document.querySelector('[data-form]').classList.contains('is-sent')));
await page.screenshot({ path: `${out}/i-form-sent.png` });

console.log('page errors:', errors.length ? errors : 'none');
await browser.close();
